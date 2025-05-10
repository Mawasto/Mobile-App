import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const Results = () => {
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [memoryScores, setMemoryScores] = useState<number[]>([]);
    const [mathResults, setMathResults] = useState<{ correct: number; timeMs: number }[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const db = getFirestore();

                // Fetch reaction test results
                const reactionRef = collection(db, 'reactionResults', user.uid, 'results');
                const reactionQuery = query(reactionRef, orderBy('timestamp', 'desc'));
                const reactionSnap = await getDocs(reactionQuery);
                const times = reactionSnap.docs.map(doc => doc.data().reactionTime);
                setReactionTimes(times);

                // Fetch memory test results
                const memoryRef = collection(db, 'memResults');
                const memoryQuery = query(memoryRef, where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
                const memorySnap = await getDocs(memoryQuery);
                const scores = memorySnap.docs.map(doc => doc.data().score);
                setMemoryScores(scores);

                // Fetch math test results
                const mathRef = collection(db, 'mathResults', user.uid, 'results');
                const mathQuery = query(mathRef, orderBy('timestamp', 'desc'));
                const mathSnap = await getDocs(mathQuery);
                const math = mathSnap.docs.map(doc => ({
                    correct: doc.data().correct,
                    timeMs: doc.data().timeMs
                }));
                setMathResults(math);
            }
        };

        fetchData();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Reaction Test History:</Text>
            {reactionTimes.length > 0 ? (
                reactionTimes.map((time, index) => (
                    <Text key={`reaction-${index}`}>#{index + 1}: {time} ms</Text>
                ))
            ) : (
                <Text>No reaction test results found.</Text>
            )}

            <Text style={[styles.title, { marginTop: 20 }]}>Memory Test History:</Text>
            {memoryScores.length > 0 ? (
                memoryScores.map((score, index) => (
                    <Text key={`memory-${index}`}>#{index + 1}: {score} digits</Text>
                ))
            ) : (
                <Text>No memory test results found.</Text>
            )}
            <Text style={[styles.title, { marginTop: 20 }]}>Math Test History:</Text>
            {mathResults.length > 0 ? (
                mathResults.map((res, index) => (
                    <Text key={`math-${index}`}>
                        #{index + 1}: {res.correct} correct answers in {Math.round(res.timeMs / 1000)} seconds
                    </Text>
                ))
            ) : (
                <Text>No math test results found.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }
});

export default Results;

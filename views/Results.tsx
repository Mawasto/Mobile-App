import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

const Results = () => {
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const db = getFirestore();
                const resultsRef = collection(db, 'reactionResults', user.uid, 'results');
                const q = query(resultsRef, orderBy('timestamp', 'desc'));
                const querySnapshot = await getDocs(q);
                const times = querySnapshot.docs.map(doc => doc.data().reactionTime);
                setReactionTimes(times);
            }
        };
        fetchData();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Reaction Test History:</Text>
            {reactionTimes.length > 0 ? (
                reactionTimes.map((time, index) => (
                    <Text key={index}>#{index + 1}: {time} ms</Text>
                ))
            ) : (
                <Text>No results found.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }
});

export default Results;

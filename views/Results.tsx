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

                const reactionRef = collection(db, 'reactionResults', user.uid, 'results');
                const reactionQuery = query(reactionRef, orderBy('timestamp', 'desc'));
                const reactionSnap = await getDocs(reactionQuery);
                const times = reactionSnap.docs.map(doc => doc.data().reactionTime);
                setReactionTimes(times);

                const memoryRef = collection(db, 'memResults');
                const memoryQuery = query(memoryRef, where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
                const memorySnap = await getDocs(memoryQuery);
                const scores = memorySnap.docs.map(doc => doc.data().score);
                setMemoryScores(scores);

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

    const maxRows = Math.max(reactionTimes.length, memoryScores.length, mathResults.length);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.header}>Your Test History</Text>
            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={[styles.cell, styles.headerCell]}>Reaction (ms)</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Memory (digits)</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Math (correct/time)</Text>
                </View>
                {Array.from({ length: maxRows }).map((_, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.cell}>
                            {reactionTimes[index] !== undefined ? `${reactionTimes[index]} ms` : '-'}
                        </Text>
                        <Text style={styles.cell}>
                            {memoryScores[index] !== undefined ? `${memoryScores[index]} digits` : '-'}
                        </Text>
                        <Text style={styles.cell}>
                            {mathResults[index] !== undefined
                                ? `${mathResults[index].correct} / ${Math.round(mathResults[index].timeMs / 1000)}s`
                                : '-'}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    cell: {
        flex: 1,
        padding: 12,
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
    },
    headerCell: {
        backgroundColor: '#e0e0e0',
        fontWeight: 'bold',
    },
});

export default Results;

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const ReactionTest = () => {
    const [isReady, setIsReady] = useState(false);
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startTest = () => {
        setIsReady(false);
        setReactionTime(null);

        const delay = Math.random() * 3000 + 1000;
        timeoutRef.current = setTimeout(() => {
            setStartTime(Date.now());
            setIsReady(true);
        }, delay);
    };

    const handleClick = async () => {
        if (!isReady) {
            alert("Too soon! Wait for the button to turn red.");
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        } else if (startTime !== null) {
            const endTime = Date.now();
            const result = endTime - startTime;
            setReactionTime(result);
            setIsReady(false);

            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const db = getFirestore();
                const userResultsRef = collection(db, 'reactionResults', user.uid, 'results');
                await addDoc(userResultsRef, {
                    reactionTime: result,
                    timestamp: new Date().toISOString()
                });
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.startButton} onPress={startTest}>
                <Text style={styles.buttonText}>Start Reaction Test</Text>
            </TouchableOpacity>

            <View style={[styles.reactionBox, { backgroundColor: isReady ? '#e53935' : '#757575' }]}>
                <TouchableOpacity
                    style={styles.tapButton}
                    onPress={handleClick}
                    activeOpacity={0.7}
                >
                    <Text style={styles.tapText}>Tap me!</Text>
                </TouchableOpacity>
            </View>

            {reactionTime !== null && (
                <Text style={styles.resultText}>Your reaction time: {reactionTime} ms</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    startButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    reactionBox: {
        marginTop: 10,
        padding: 30,
        borderRadius: 12,
        width: 220,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tapButton: {
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        elevation: 3,
    },
    tapText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    resultText: {
        marginTop: 30,
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
    },
});

export default ReactionTest;

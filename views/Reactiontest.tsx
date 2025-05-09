import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
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
            <Button title="Start Reaction Test" onPress={startTest} />
            <View style={[styles.reactionBox, { backgroundColor: isReady ? 'red' : 'gray' }]}>
                <Button title="Tap me!" onPress={handleClick} color="#fff" />
            </View>
            {reactionTime !== null && <Text>Your reaction time: {reactionTime} ms</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1 },
    reactionBox: {
        marginTop: 20,
        padding: 20,
        borderRadius: 10,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ReactionTest;

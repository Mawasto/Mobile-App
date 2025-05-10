import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const MAX_LENGTH = 20;
const SHOW_DURATION_MS = 4000;

const generateNumber = (length: number) => {
    let number = '';
    for (let i = 0; i < length; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
};

const MemoryTest = () => {
    const [currentLength, setCurrentLength] = useState(1);
    const [generatedNumber, setGeneratedNumber] = useState('');
    const [showNumber, setShowNumber] = useState(true);
    const [userInput, setUserInput] = useState('');
    const [testFinished, setTestFinished] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);


    useEffect(() => {
        if (currentLength > MAX_LENGTH) {
            saveResult(MAX_LENGTH);
            setTestFinished(true);
            return;
        }

        const newNumber = generateNumber(currentLength);
        setGeneratedNumber(newNumber);
        setShowNumber(true);
        setUserInput('');

        timeoutRef.current = setTimeout(() => {
            setShowNumber(false);
        }, SHOW_DURATION_MS);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentLength]);

    const saveResult = async (score: number) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            Alert.alert('Not authenticated', 'Please log in to save your score.');
            return;
        }

        try {
            const db = getFirestore();
            const memResultsRef = collection(db, 'memResults');
            await addDoc(memResultsRef, {
                userId: user.uid,
                score,
                timestamp: new Date().toISOString(),
            });
            console.log(`Memory test result saved: ${score}`);
        } catch (error) {
            console.error('Error saving memory test result:', error);
            Alert.alert('Error', 'Failed to save your result. Please try again.');
        }
    };


    const handleSubmit = async () => {
        if (userInput === generatedNumber) {
            setCurrentLength((prev) => prev + 1);
        } else {
            await saveResult(currentLength - 1);
            setTestFinished(true);
            Alert.alert('Incorrect', `Wrong number! Your score: ${currentLength - 1}`);
        }
    };

    if (testFinished) {
        return (
            <View style={styles.container}>
                <Text style={styles.finishedText}>Test finished!</Text>
                <Text style={styles.scoreText}>Your score: {currentLength - 1}</Text>
                <Button
                    title="Restart Test"
                    onPress={() => {
                        setCurrentLength(1);
                        setTestFinished(false);
                    }}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {showNumber ? (
                <Text style={styles.number} selectable={false} onLongPress={() => { }}>{generatedNumber}</Text>
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter the number you remember"
                        keyboardType="numeric"
                        value={userInput}
                        onChangeText={setUserInput}
                        maxLength={currentLength}
                        autoFocus
                    />
                    <Button title="Submit" onPress={handleSubmit} disabled={userInput.length !== currentLength} />
                    <Text style={styles.infoText}>Length: {currentLength}</Text>
                </>
            )}
        </View>
    );
};


//Styles
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    number: { fontSize: 48, fontWeight: 'bold', marginBottom: 20, letterSpacing: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: '80%',
        padding: 12,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 12,
        borderRadius: 6,
    },
    infoText: { marginTop: 10, fontSize: 16, color: '#555' },
    finishedText: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    scoreText: { fontSize: 22, marginBottom: 20 },
});

export default MemoryTest;

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

type Question = {
    question: string;
    answer: number;
};

const generateQuestion = (): Question => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const op = ['+', '-', '×'][Math.floor(Math.random() * 3)];

    let result = 0;
    if (op === '+') result = a + b;
    else if (op === '-') result = a - b;
    else result = a * b;

    return { question: `${a} ${op} ${b}`, answer: result };
};

const MathTest = () => {
    const TOTAL_QUESTIONS = 5;
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [correctCount, setCorrectCount] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [finished, setFinished] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [timeTaken, setTimeTaken] = useState(0);

    useEffect(() => {
        const generated = Array.from({ length: TOTAL_QUESTIONS }, generateQuestion);
        setQuestions(generated);
        setStartTime(Date.now());
        startQuestionTimer();
    }, []);

    const startQuestionTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            handleSubmit();
        }, 5000);
    };

    const handleSubmit = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const currentQuestion = questions[currentIndex];
        const isCorrect = parseInt(userAnswer) === currentQuestion.answer;
        if (isCorrect) setCorrectCount(prev => prev + 1);

        if (currentIndex + 1 < TOTAL_QUESTIONS) {
            setCurrentIndex(prev => prev + 1);
            setUserAnswer('');
            startQuestionTimer();
        } else {
            const totalTime = Date.now() - (startTime ?? Date.now());
            setTimeTaken(totalTime);
            setFinished(true);
            saveResult(correctCount + (isCorrect ? 1 : 0), totalTime);
        }
    };

    const saveResult = async (correct: number, time: number) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const db = getFirestore();
            const ref = collection(db, 'mathResults', user.uid, 'results');
            await addDoc(ref, {
                correct,
                timeMs: time,
                timestamp: new Date().toISOString()
            });
        }
    };

    if (questions.length === 0) return <Text>Loading questions...</Text>;

    if (finished) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Test finished!</Text>
                <Text style={styles.title}>Correct answers: {correctCount} / {TOTAL_QUESTIONS}</Text>
                <Text style={styles.title}>Time: {Math.round(timeTaken / 1000)} s</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Question {currentIndex + 1} z {TOTAL_QUESTIONS}</Text>
            <Text style={styles.question}>{questions[currentIndex].question}</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={userAnswer}
                onChangeText={setUserAnswer}
                placeholder="Your answer"
            />
            <Button title="Commit" onPress={handleSubmit} />
        </View>
    );
};

//Styles
const styles = StyleSheet.create({
    container: { fontSize: 35, padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1 },
    title: { fontSize: 40, fontWeight: 'bold', marginBottom: 10 },
    question: { fontSize: 50, marginBottom: 10 },
    input: {
        borderWidth: 1, borderColor: '#ccc', padding: 10, width: 300,
        marginBottom: 10, textAlign: 'center', fontSize: 18
    }
});

export default MathTest;

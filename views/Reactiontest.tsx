import React from 'react';
import { View, Button, Text } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const ReactionTest = () => {
    const handleSaveResult = async () => {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;
        if (user) {
            const uid = user.uid;
            await setDoc(doc(db, 'results', uid), {
                reactionTime: Math.floor(Math.random() * 1000),
                timestamp: new Date().toISOString()
            });
            alert('Result saved!');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Simulated Reaction Test</Text>
            <Button title="Save Random Result" onPress={handleSaveResult} />
        </View>
    );
};

export default ReactionTest;

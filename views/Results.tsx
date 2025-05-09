import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Results = () => {
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const auth = getAuth();
            const db = getFirestore();
            const user = auth.currentUser;
            if (user) {
                const resDoc = await getDoc(doc(db, 'results', user.uid));
                if (resDoc.exists()) setResult(resDoc.data());
            }
        };
        fetchData();
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text>Results:</Text>
            {result ? (
                <>
                    <Text>Reaction Time: {result.reactionTime} ms</Text>
                    <Text>Date: {new Date(result.timestamp).toLocaleString()}</Text>
                </>
            ) : (
                <Text>No results found</Text>
            )}
        </View>
    );
};

export default Results;

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Home = () => {
    const navigation = useNavigation<NavigationProp>();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user?.email) {
            const name = user.email.split('@')[0];
            setUsername(name);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(getAuth());
            navigation.navigate('Login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.loginTitle} >Welcome {username}!</Text>

            <TouchableOpacity style={styles.greenButton} onPress={() => navigation.navigate('Reactiontest')}>
                <Text style={styles.buttonText}>Reaction Test</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.greenButton} onPress={() => navigation.navigate('Memorytest')}>
                <Text style={styles.buttonText}>Memory Test</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.greenButton} onPress={() => navigation.navigate('Results')}>
                <Text style={styles.buttonText}>Results</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.redButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        gap: 20,
    },
    greenButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 2,
    },
    redButton: {
        backgroundColor: '#f44336',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default Home;

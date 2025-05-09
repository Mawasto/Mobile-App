import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Home = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            <Button title="Reaction Test" onPress={() => navigation.navigate('Reactiontest')} />
            <Button title="Memory Test" onPress={() => navigation.navigate('Memorytest')} />
            <Button title="Results" onPress={() => navigation.navigate('Results')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', gap: 20, padding: 20 },
});

export default Home;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Register: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text>This is registers</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Register;

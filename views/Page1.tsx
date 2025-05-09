// Page1.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Page1: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text>This is Page 1ŁUBIBAŁUBIBA</Text>
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

export default Page1;

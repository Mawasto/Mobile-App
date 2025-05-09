import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './views/Register';
import Login from './views/Login';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';


import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAlgFo4umVb2nES1n4KFVVKIK8WPfXtOxY",
  authDomain: "mobile-app-fc1bf.firebaseapp.com",
  projectId: "mobile-app-fc1bf",
  storageBucket: "mobile-app-fc1bf.firebasestorage.app",
  messagingSenderId: "474739799588",
  appId: "1:474739799588:web:682a90ebcc145954f74ab1"
};
const app = initializeApp(firebaseConfig);


initializeApp(firebaseConfig);


type RootStackParamList = {
  MainMenu: undefined;
  Login: undefined;
  Register: undefined;
  Page3: undefined;
  Page4: undefined;
  Page5: undefined;
  Page6: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainMenu = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Menu</Text>
      <Button title="Go to Page 1" onPress={() => navigation.navigate('Login')} />
      <Button title="Go to Page 2" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

const PageTemplate = ({ route }: { route: { name: string } }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.pageText}>This is {route.name}</Text>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainMenu">
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
  },
  pageText: {
    fontSize: 24,
    textAlign: 'center',
  },
});

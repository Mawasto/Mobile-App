import React from 'react';
import {
  NavigationContainer
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


import Login from './views/Login';
import Register from './views/Register';
import Main from './views/Main';
import Memorytest from './views/Memorytest';
import Reactiontest from './views/Reactiontest';
import Results from './views/Results';
import MathTest from './views/Mathtest';

const firebaseConfig = {
  apiKey: "AIzaSyAlgFo4umVb2nES1n4KFVVKIK8WPfXtOxY",
  authDomain: "mobile-app-fc1bf.firebaseapp.com",
  projectId: "mobile-app-fc1bf",
  storageBucket: "mobile-app-fc1bf.firebasestorage.app",
  messagingSenderId: "474739799588",
  appId: "1:474739799588:web:682a90ebcc145954f74ab1"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

initializeApp(firebaseConfig);


import { RootStackParamList } from './types';


const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Memorytest" component={Memorytest} />
        <Stack.Screen name="Reactiontest" component={Reactiontest} />
        <Stack.Screen name="Results" component={Results} />
        <Stack.Screen name="Mathtest" component={MathTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
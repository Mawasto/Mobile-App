import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type RootStackParamList = {
  MainMenu: undefined;
  Page1: undefined;
  Page2: undefined;
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
      <Button title="Go to Page 1" onPress={() => navigation.navigate('Page1')} />
      <Button title="Go to Page 2" onPress={() => navigation.navigate('Page2')} />
      <Button title="Go to Page 3" onPress={() => navigation.navigate('Page3')} />
      <Button title="Go to Page 4" onPress={() => navigation.navigate('Page4')} />
      <Button title="Go to Page 5" onPress={() => navigation.navigate('Page5')} />
      <Button title="Go to Page 6" onPress={() => navigation.navigate('Page6')} />
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
        <Stack.Screen name="Page1" component={PageTemplate} />
        <Stack.Screen name="Page2" component={PageTemplate} />
        <Stack.Screen name="Page3" component={PageTemplate} />
        <Stack.Screen name="Page4" component={PageTemplate} />
        <Stack.Screen name="Page5" component={PageTemplate} />
        <Stack.Screen name="Page6" component={PageTemplate} />
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

import { StatusBar, useColorScheme } from 'react-native';
import { DetailScreen, HomeScreen } from './src/screen/';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type RootStackParamList = {
  Galeria: undefined;
  Detalhes: {
    uri: string;
    date: string;
    coords?: { latitude: number; longitude: number };
    onDelete?: (uri: string) => void;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Galeria"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#37474F',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Galeria" component={HomeScreen} />
          <Stack.Screen name="Detalhes" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

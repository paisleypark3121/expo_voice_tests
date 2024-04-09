// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen'; // Importing HomeScreen component

import WebVoiceRecognitionScreen from './src/screens/WebVoiceRecognition';
import VoiceFirstScreen from './src/screens/VoiceFirstScreen';
import FilesManagerScreen from './src/screens/FilesManagerScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WebVoiceRecognition" component={WebVoiceRecognitionScreen} />
        <Stack.Screen name="VoiceFirstScreen" component={VoiceFirstScreen} />
        <Stack.Screen name="FilesManagerScreen" component={FilesManagerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
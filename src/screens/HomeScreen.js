// HomeScreen.js

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
            title="Go to Web Voice Recognition"
            onPress={() => navigation.navigate('WebVoiceRecognition')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
            title="Go to Voice First"
            onPress={() => navigation.navigate('VoiceFirstScreen')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
            title="Go to Files Manager"
            onPress={() => navigation.navigate('FilesManagerScreen')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      padding: 10,
    },
    buttonContainer: {
      margin: 10,
    },
});

export default HomeScreen;

import { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';


export default function FilesManagerScreen() {

  const [sound, setSound] = useState();
  const [isListening, setIsListening] = useState(false);

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('../../assets/cocchio.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  async function stopSound() {
    if (sound) {
      console.log('Stopping Sound');
      await sound.stopAsync();
    }
  }

  const handleToggleSound = () => {
    //console.log('toggle')
    if (isListening) {
      //console.log('is listening')
      stopSound()
      setIsListening(false);
    } else {
      //console.log('not is listening')
      playSound()
      setIsListening(true);
    }
  };

  async function showFiles() {
    try {
      if (Platform.OS=== 'web') {
        console.log('no need on web')
      } else {
        const directory = await getAVDirectory()
        console.log("AV directory: "+directory)
        const files = await FileSystem.readDirectoryAsync(directory);
        console.log('Files di registrazione:', files);
      }
    } catch (error) {
      console.error('Errore durante il recupero dei file di registrazione:', error);
    }
  }

  async function getAVDirectory() {
    try {
      if (Platform.OS === 'web') {
        console.log('no need on web')
      } else {
        const cacheDirectory = FileSystem.cacheDirectory;
        console.log("CACHE: "+cacheDirectory)
        avDirectory = `${cacheDirectory}AV/`;
      }      
      await FileSystem.makeDirectoryAsync(avDirectory, { intermediates: true });
      return avDirectory;
    } catch (error) {
      console.error('Errore durante il recupero del percorso della directory "AV":', error);
      return null;
    }
  }
  
  async function deleteFiles() {
    try {
      if (Platform.OS=== 'web') {
        console.log('no need on web')
      } else {
        const directory = await getAVDirectory()
        console.log("AV directory: "+directory)
        const files = await FileSystem.readDirectoryAsync(directory);
        console.log('Files di registrazione:', files);
        if (files) {
            files.forEach(async (filename) => {
              const filePath = `${directory}${filename}`;
              await FileSystem.deleteAsync(filePath);
              console.log(`File ${filename} eliminato con successo`);
            });
          }
      }
    } catch (error) {
      console.error('Errore durante il recupero dei file di registrazione:', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} title="Play Sound" onPress={handleToggleSound} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Show Recordings" onPress={showFiles} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Delete Recordings" onPress={deleteFiles} />
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

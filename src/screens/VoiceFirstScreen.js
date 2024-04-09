import React, { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Platform } from 'react-native';
import { Audio } from 'expo-av';
import FormData from 'form-data';

export default function VoiceFirstScreen() {
  const [sound, setSound] = useState(null);
  const [recording, setRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [silenceTimeout, setSilenceTimeout] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [uri, setUri]=useState(null);

  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  const bearerKey = process.env.EXPO_PUBLIC_BEARER_KEY;
  const whisperEndPoint="https://dda55258-db86-4b0b-8d8f-472e686f33f7-00-yzptp4c53njh.worf.replit.dev/whisper"
  const testEndPoint="https://dda55258-db86-4b0b-8d8f-472e686f33f7-00-yzptp4c53njh.worf.replit.dev/test"
  
  // useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log('Unloading Sound');
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);

  const startRecording = async () => {
    try {

      if (Platform.OS==='web') {
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        setRecording(recording);
        setIsRecording(true);
        monitorAudioLevels();
      } else {
        if (permissionResponse.status !== 'granted') {
          await requestPermission();
        }
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
  
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const monitorAudioLevels = () => {
    if (!recording) 
      return;

    recording.setOnRecordingStatusUpdate(status => {
      if (status.isRecording) {
        if (status.peakPower < -30) {
          console.log('Silence detected, start timeout')
          setSilenceTimeout(setTimeout(stopRecording, 3000)); // 3 seconds
        } else {
          console.log('Reset timeout')
          clearTimeout(silenceTimeout);
          setSilenceTimeout(null);
        } 
      }
    });
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (!recording) 
      return;
    
    try {
      
      if (Platform.OS==='web') {
        await recording.stopAndUnloadAsync();
        const uri = await recording.getURI();
        setUri(uri);
        console.log('Recording stopped, URI:', uri);
        const { sound } = await Audio.Sound.createAsync(
          { uri: uri },
          { shouldPlay: false }
        );
        setSound(sound);
      } else {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
          {
            allowsRecordingIOS: false,
          }
        );
        const uri = await recording.getURI();
        setUri(uri);
        console.log('Recording stopped, URI:', uri);
        const { sound } = await Audio.Sound.createAsync(
          { uri: uri },
          { shouldPlay: false }
        );
        setSound(sound);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const playSound = async() => {
    if (sound)
      await sound.playAsync();
  }

  function extractFileName(uri) {
    const parts = uri.split('/');
    const fileNameWithExtension = parts[parts.length - 1];
    const lastDotIndex = fileNameWithExtension.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return fileNameWithExtension + ".mp3";
    } else {
      return fileNameWithExtension;
    }
  }

  const convertSound_test = async () => {
    try {     

      const fileUri = '../../assets/cocchio_small.mp3';
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Crea un oggetto FormData
      const formData = new FormData();
      formData.append("audio", blob, "cocchio_small.mp3");

      const _response = await fetch(whisperEndPoint, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${bearerKey}`,
        },
      });
      
      // const textData = {
      //   username: 'alice',
      //   message: 'Ciao dal lato client!',
      // };

      // const _response = await fetch(testEndPoint, {
      //     method: "POST",
      //     body: new URLSearchParams(textData).toString(),
      //     headers: {
      //       "Content-Type": "application/x-www-form-urlencoded",
      //       'Authorization': `Bearer ${bearerKey}`,
      //     },
      //   });

      // Verifica la risposta
      if (_response.status === 200) {
        console.log("File caricato con successo!");
      } else {
        console.error(`Errore durante l'invio del file. Codice di stato: ${_response.status}`);
      }

    } catch (error) {
      console.log('Error:', error);
    }
  };
  
  const convertSound = async () => {
    try {     
      const formData = new FormData();

      if (Platform.OS==="web") {

        const audioFileUri = '../../assets/cocchio_small.mp3';
        myAsset=require('../../assets/cocchio_small.mp3')
        filename='cocchio_small.mp3'
        type='audio/mp3'

        const file = {
          uri: myAsset,
          type: type,
          name: filename          
        }
        
        formData.append('audio', file);

      } else {
        formData.append('audio', {
          uri: uri,
          type: 'audio/x-m4a',
          name: extractFileName(uri),
        });
      }
      
      console.log(formData)

      const response = await fetch(whisperEndPoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${bearerKey}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const responseData = await response.json();
        if (responseData.hasOwnProperty('success')) {
          const successText = responseData.success;
          console.log('Translation:', successText);
        } else {
          console.error('Missing translation');
        }
      } else {
        console.error('Errore in performing the request:'+ response.status + ' - '+response.error);
      }

      // const response = await fetch(sound.uri);
      // const blob = await response.blob();
      // const blobUrl = URL.createObjectURL(blob);

      // console.log('Percorso del file:', blobUrl);

      // const directory = FileSystem.cacheDirectory;
      // console.log(directory)

      //ffmpeg.writeFile('test.mp3', await fetchFile(sound.uri));
      //console.log(ffmpeg)

      //Run the FFmpeg command
      //in this case, trim file size down to 1.5s and save to memory as output.mp3
      // ffmpeg.exec('-i', 'test.mp3', '-t', '1.5', 'output.mp3');

      // //Read the result from memory
      //const data = ffmpeg.readFile('output.mp3');
      //const data = ffmpeg.readFile('test.mp3');

      // //Create URL so it can be used in the browser
      // const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' }));
      // console.log(url)
      
        
      // const transcription = await openai.audio.transcriptions.create({
      //   file: uri,
      //   model: "whisper-1",
      // });

      // console.log(transcription)
      // const form = new FormData();
      // form.append('file', audioBuffer);
      // form.append("model", "whisper-1");

      // try {
      //     const response = await axios.post(
      //       'https://api.openai.com/v1/audio/transcriptions', 
      //       form, {
      //         headers: {
      //             'Authorization': `Bearer ${apiKey}`,
      //             'Content-Type': 'multipart/form-data',
      //         },
      //       }
      //     );

      //   const transcription = response.data;
      //   console.log('Trascrizione:', transcription);
      // } catch (error) {
      //     console.error('Errore durante la richiesta:', error);
      // }
    } catch (error) {
      console.log('Error:', error);
    }
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title={isRecording ? "Stop Recording" : "Start Recording"} onPress={isRecording ? stopRecording : startRecording} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="play sound" onPress={playSound} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="convert sound" onPress={convertSound} />
      </View>
    </View>
  );
}

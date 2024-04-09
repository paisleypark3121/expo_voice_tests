import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

const WebVoiceRecognition = () => {
    const [transcript, setTranscript] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = React.useRef(null);
    let pauseTimer;

    //console.log("IS LISTENING: "+isListening)

    const getRandomResponse = () => {
        const responses = [
            "Tommy lost the shopping list his mother had given him and just bought things he wanted to eat.",
            "I take off my slippers and put on my socks and shoes.",
            "Last weekend, she wanted to go to the wedding, but she wasn't sure it was safe.",
            "Chances are that you won’t do well if you don’t study.",
            "Nikita is a perfectly respectable businessman.",
            "He was in desperate need of a Christmas miracle.",
            "If you could live anywhere, where would you live and why?",
            "Create beautiful designs with a powerful tool.",
            "The rest of the party attendees had fallen silent.",
            "Deodorant helps to prevent embarrassing moments.",
            "On top of that, our power has been out since Sunday.",
            "Would you like to go out and get something to eat?"
        ];
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    };
    
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition && !recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            //recognition.interimResults = true;
            recognition.interimResults = false;
            recognition.onresult = onResult;
            recognitionRef.current = recognition;
        }
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);
  
    const handleToggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            //console.log("STOP")
        } else {
            recognitionRef.current.start();
            setIsListening(true);
            //console.log("START")
        }
    };

    const onResult = (event) => {
        clearTimeout(pauseTimer);
        const { resultIndex, results } = event;
        const transcriptResult = results[resultIndex][0].transcript;
        if (results[resultIndex].isFinal) {
            setTranscript(prevTranscript => [...prevTranscript, transcriptResult + '\n']);

            const randomDelay = Math.random() * 5000 + 1000;

            setTimeout(() => {
                const response = getRandomResponse();
                setTranscript(prevTranscript => [...prevTranscript, response + '\n\n']);
            }, randomDelay);
        } else {
            setTranscript(prevTranscript => {
                const tempTranscript = [...prevTranscript];
                if (tempTranscript[tempTranscript.length - 1]?.endsWith('\n')) {
                    return [...tempTranscript, transcriptResult];
                } else {
                    tempTranscript[tempTranscript.length - 1] = transcriptResult;
                    return tempTranscript;
                }
            });
        //console.log(transcriptResult)
        }

        // Start the pause timer
        pauseTimer = setTimeout(() => {
            setTranscript(prevTranscript => [...prevTranscript, '\n']);
        }, 3000);
    };

  return (
    <View style={styles.container}>
      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={handleToggleListening}
      />
      <ScrollView style={styles.scrollView}>
        {transcript.map((line, index) => (
          <Text key={index} style={styles.transcriptText}>{line}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  transcriptText: {
    fontSize: 16,
  },
});

export default WebVoiceRecognition;

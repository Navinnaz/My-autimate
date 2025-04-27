import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import SpeechRecognitionWrapper from './SpeechRecognitionWrapper'; // Adjust the import path as needed

const SpeechRecognitionComponent = () => {
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const speechRecognition = new SpeechRecognitionWrapper();
    setRecognition(speechRecognition);

    return () => {
      speechRecognition.cleanup();
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.startRecognition(setTranscript, (error) => {
        console.error('Error:', error);
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stopRecognition();
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 20 }}>Transcript: {transcript}</Text>
      <Button title="Start Listening" onPress={startListening} />
      <Button title="Stop Listening" onPress={stopListening} />
    </View>
  );
};

export default SpeechRecognitionComponent;v

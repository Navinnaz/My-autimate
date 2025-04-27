import React, { useState, useEffect } from 'react';
import stringSimilarity from 'string-similarity';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import RandomStoryApp from './RandomStoryApp';
import ColorGuessingGame from './ColorGuessingGame';
import BreathingExercise from './BreathingExercise'; // Import the BreathingExercise component

const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key
const wordsList = ['cat', 'dog', 'sun', 'tree', 'car'];

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFeature, setSelectedFeature] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [userSpeech, setUserSpeech] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [messages, setMessages] = useState([{ message: "Hello, I'm your assistant! Ask me anything!", sender: "ChatGPT" }]);
  const [isTyping, setIsTyping] = useState(false);
  const similarityThreshold = 0.8;

  useEffect(() => {
    if (selectedFeature === 'speechTraining') {
      pickRandomWord();
    }
  }, [selectedFeature]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'sai' || username === 'nirmal' || username === 'namitha' || username === 'lancey' || username === 'faaz' || username === 'reni' && password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const pickRandomWord = () => {
    const randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
    setCurrentWord(randomWord);
    setFeedback('');
    setUserSpeech('');
  };

  const pronounceWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    try {
      const recognizer = new SpeechRecognitionWrapper();
      recognizer.startRecognition(
        (transcript) => {
          const trimmedTranscript = transcript.trim().toLowerCase();
          setUserSpeech(trimmedTranscript);
          const similarity = stringSimilarity.compareTwoStrings(trimmedTranscript, currentWord.toLowerCase());
          if (similarity >= similarityThreshold) {
            setFeedback('Correct! 🎉');
            setScore(score + 1);
          } else if (similarity >= 0.5) {
            setFeedback('Almost there! Try again.');
          } else {
            setFeedback('Try again!');
          }
        },
        (error) => {
          setFeedback(Error: ${error});
        }
      );
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
  };

  const handleSend = async (message) => {
    const newMessage = { message, direction: 'outgoing', sender: "user" };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => ({
      role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
      content: messageObject.message
    }));

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Explain things like you're talking to a software professional with 2 years of experience." },
        ...apiMessages
      ]
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": Bearer ${API_KEY},
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      const data = await response.json();
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
    } catch (error) {
 console.error("Error fetching data from API:", error);
    } finally {
      setIsTyping(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="login">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  if (selectedFeature === 'speechTraining') {
    return (
      <div className="app">
        <h1>Speech Trainer</h1>
        <p>Listen to the word and pronounce it!</p>
        <h2>Word: {currentWord}</h2>
        <button onClick={pronounceWord}>Hear Word</button>
        <button onClick={startRecognition}>Start Pronouncing</button>
        <h3>{feedback}</h3>
        <p>Your Pronunciation: {userSpeech}</p>
        <p>Score: {score}</p>
        <button onClick={pickRandomWord}>Next Word</button>
        <button onClick={() => setSelectedFeature('')}>Back</button>
      </div>
    );
  }

  if (selectedFeature === 'chatGPT') {
    return (
      <div className="chat-container">
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
        <button onClick={() => setSelectedFeature('')}>Back</button>
      </div>
    );
  }

  if (selectedFeature === 'randomStory') {
    return <RandomStoryApp />;
  }

  if (selectedFeature === 'colorGuessingGame') {
    return <ColorGuessingGame setIsColorGuessingGame={setSelectedFeature} />;
  }

  if (selectedFeature === 'breathingExercise') {
    return <BreathingExercise setIsBreathingExercise={setSelectedFeature}  />;
  }

  return (
    <div className="app">
      <h1>Welcome!</h1>
      <div className="feature-buttons">
        <button onClick={() => handleFeatureSelect('speechTraining')}>Speech Training</button>
        <button onClick={() => handleFeatureSelect('chatGPT')}>ChatGPT</button>
        <button onClick={() => handleFeatureSelect('randomStory')}>Random Story</button>
        <button onClick={() => handleFeatureSelect('colorGuessingGame')}>Color Guessing Game</button>
        <button onClick={() => handleFeatureSelect('breathingExercise')}>Breathing Exercise</button>
      </div>
    </div>
  );
};

// SpeechRecognitionWrapper class
class SpeechRecognitionWrapper {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('Speech Recognition API is not supported in this browser.');
    }
    this.recognizer = new SpeechRecognition();
    this.recognizer.lang = 'en-US';
    this.recognizer.continuous = false;
    this.recognizer.interimResults = false;
  }

  startRecognition(onResult, onError) {
    this.recognizer.start();
    this.recognizer.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    this.recognizer.onerror = (event) => {
      onError(event.error);
    };
    this.recognizer.onend = () => {
      console.log('Recognition ended.');
    };
  }

  stopRecognition() {
    this.recognizer.stop();
  }
}

// Inline styles
const styles = {
  app: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  login: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
};```javascript
// Improved code

// Extracted constants
const FEATURES = {
  speechTraining: 'Speech Training',
  chatGPT: 'ChatGPT',
  randomStory: 'Random Story',
  colorGuessingGame: 'Color Guessing Game',
  breathingExercise: 'Breathing Exercise',
};

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// Improved App component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFeature, setSelectedFeature] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [userSpeech, setUserSpeech] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [messages, setMessages] = useState([{ message: "Hello, I'm your assistant! Ask me anything!", sender: "ChatGPT" }]);
  const [isTyping, setIsTyping] = useState(false);
  const similarityThreshold = 0.8;

  // Improved useEffect hook
  useEffect(() => {
    if (selectedFeature === FEATURES.speechTraining) {
      pickRandomWord();
    }
  }, [selectedFeature]);

  // Improved handleLogin function
  const handleLogin = (e) => {
    e.preventDefault();
    const credentials = ['sai', 'nirmal', 'namitha', 'lancey', 'faaz', 'reni'];
    if (credentials.includes(username) && password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  // Improved pickRandomWord function
  const pickRandomWord = () => {
    const randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
    setCurrentWord(randomWord);
    setFeedback('');
    setUserSpeech('');
  };

  // Improved pronounceWord function
  const pronounceWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    window.speechSynthesis.speak(utterance);
  };

  // Improved startRecognition function
  const startRecognition = () => {
    try {
      const recognizer = new SpeechRecognitionWrapper();
      recognizer.startRecognition(
        (transcript) => {
          const trimmedTranscript = transcript.trim().toLowerCase();
          setUserSpeech(trimmedTranscript);
          const similarity = stringSimilarity.compareTwoStrings(trimmedTranscript, currentWord.toLowerCase());
          if (similarity >= similarityThreshold) {
            setFeedback('Correct!');
            setScore(score + 1);
          } else if (similarity >= 0.5) {
            setFeedback('Almost there! Try again.');
          } else {
            setFeedback('Try again!');
          }
        },
        (error) => {
          setFeedback(`Error: ${error}`);
        }
      );
    } catch (error) {
      setFeedback(error.message);
    }
  };

  // Improved handleFeatureSelect function
  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
  };

  // Improved handleSend function
  const handleSend = async (message) => {
    const newMessage = { message, direction: 'outgoing', sender: "user" };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  // Improved processMessageToChatGPT function
  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => ({
      role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
      content: messageObject.message
    }));

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Explain things like you're talking to a software professional with 2 years of experience." },
        ...apiMessages
      ]
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      const data = await response.json();
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    } finally {
      setIsTyping(false);
    }
  }

  // Improved JSX
  if (!isLoggedIn) {
    return (
      <div className="login">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  if (selectedFeature === FEATURES.speechTraining) {
    return (
      <div className="app">
        <h1>Speech Trainer</h1>
        <p>Listen to the word and pronounce it!</p>
        <h2>Word: {currentWord}</h2>
        <button onClick={pronounceWord}>Hear Word</button>
        <button onClick={startRecognition}>Start Pronouncing</button>
        <h3>{feedback}</h3>
        <p>Your Pronunciation: {userSpeech}</p>
        <p>Score: {score}</p>
        <button onClick={pickRandomWord}>Next Word</button>
        <button onClick={() => setSelectedFeature('')}>Back</button>
      </div>
    );
  }

  if (selectedFeature === FEATURES.chatGPT) {
    return (
      <div className="chat-container">
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
        <button onClick={() => setSelectedFeature('')}>Back</button>
      </div>
    );
  }

  if (selectedFeature === FEATURES.randomStory) {
    return <RandomStoryApp />;
  }

  if (selectedFeature === FEATURES.colorGuessingGame) {
    return <ColorGuessingGame setIsColorGuessingGame={setSelectedFeature} />;
  }

  if (selectedFeature === FEATURES.breathingExercise) {
    return <BreathingExercise setIsBreathingExercise={setSelectedFeature} />;
  }

  return (
    <div className="app">
      <h1>Welcome!</h1>
      <div className="feature-buttons">
        <button onClick={() => handleFeatureSelect(FEATURES.speechTraining)}>Speech Training</button>
        <button onClick={() => handleFeatureSelect(FEATURES.chatGPT)}>ChatGPT</button>
        <button onClick={() => handleFeatureSelect(FEATURES.randomStory)}>Random Story</button>
        <button onClick={() => handleFeatureSelect(FEATURES.colorGuessingGame)}>Color Guessing Game</button>
        <button onClick={() => handleFeatureSelect(FEATURES.breathingExercise)}>Breathing Exercise</button>
      </div>
    </div>
  );
};
```
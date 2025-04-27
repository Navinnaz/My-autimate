import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, ScrollView, Animated, Vibration, Button, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAIBuddy, setShowAIBuddy] = useState(false);
  const [animationValue] = useState(new Animated.Value(1));
  const [breathStage, setBreathStage] = useState('Inhale');
  const [isBreathingExercise, setIsBreathingExercise] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [showDiary, setShowDiary] = useState(false);
  const [showRoutine, setShowRoutine] = useState(false);
  const [showEmotionTracker, setShowEmotionTracker] = useState(false);

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  useEffect(() => {
    let currentStageIndex = 0;

    const stages = [
      { name: 'Inhale', duration: 2000, size: 1.5 },
      { name: 'Hold', duration: 2000, size: 1.5 },
      { name: 'Exhale', duration: 4000, size: 1 },
    ];

    const startBreathingCycle = () => {
      const currentStage = stages[currentStageIndex];

      Animated.timing(animationValue, {
        toValue: currentStage.size,
        duration: currentStage.duration,
        useNativeDriver: true,
      }).start(() => {
        setBreathStage(currentStage.name);
        currentStageIndex = (currentStageIndex + 1) % stages.length;
        setTimeout(startBreathingCycle, currentStage.duration);
      });

      if (currentStage.name === 'Inhale') {
        Vibration.vibrate(200);
      }
    };

    if (isBreathingExercise) {
      startBreathingCycle();
    }

    return () => {
      // Cleanup if needed
    };
  }, [isBreathingExercise, animationValue]);

  const circleSize = Math.max(breathStage.length * 20, 150);

  const activities = [
    {
      title: "Communication Skills",
      steps: [
        "Use visual schedules to outline daily activities.",
        "Practice role-playing different social scenarios.",
        "Encourage the use of simple sentences to express needs."
      ]
    },
    {
      title: "Self-Care Skills",
      steps: [
        "Create a step-by-step guide for daily tasks like brushing teeth.",
        "Use visual aids to demonstrate how to wash hands properly.",
        "Practice cooking simple meals together."
      ]
    },
    {
      title: "Social Skills Activities",
      steps: [
        "Use emotion cards to help recognize and express feelings.",
        "Organize sharing time where individuals share their interests.",
        "Play the Name Game to practice introductions."
      ]
    },
    {
      title: "Mindfulness and Emotional Regulation",
      steps: [
        "Create calm-down cards with strategies for managing anxiety.",
        "Practice mindfulness exercises like deep breathing.",
        "Introduce grounding techniques such as counting or stretching."
      ]
    },
    {
      title: "Sensory Activities",
      steps: [
        "Create sensory bins filled with various textures.",
        "Provide fidget toys to help with focus.",
        "Use musical instruments for auditory exploration."
      ]
    },
    {
      title: "Movement and Coordination",
      steps: [
        "Set up obstacle courses to encourage physical activity.",
        "Engage in core stability exercises like balancing.",
        "Practice simple yoga poses for flexibility."
      ]
    },
    {
      title: "Creative and Cognitive Activities",
      steps: [
        "Encourage drawing, painting, or crafting for creative expression.",
        "Conduct fun slime experiments to combine science and sensory play.",
        "Use colorful snacks for sorting activities."
      ]
    },
    {
      title: "Relaxation Techniques",
      steps: [
        "Designate a quiet area for students to decompress.",
        "Create a calm-down kit with sensory toys.",
        "Practice relaxation techniques like guided imagery."
      ]
    },
  ];

  const [entry, setEntry] = useState('');
}
import React, { useState } from 'react';
        import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
        
        const App = () => {
          const [username, setUsername] = useState<string>('');
          const [password, setPassword] = useState<string>('');
          const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
        
          const handleLogin = () => {
            if (username === 'admin' && password === 'password') {
              setIsLoggedIn(true);
            } else {
              Alert.alert('Error', 'Invalid credentials');
            }
          };
        
          return (
            <View style={styles.container}>
              {isLoggedIn ? (
                <View style={styles.welcomeContainer}>
                  <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
                  <TouchableOpacity style={styles.logoutButton} onPress={() => setIsLoggedIn(false)}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.loginContainer}>
                  <Text style={styles.title}>Login</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#888"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                  />
                  <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        };
        
        const styles = StyleSheet.create({
          container: {
            flex: 1,
            justifyContent: 'center',
            padding: 16,
            backgroundColor: '#f0f0f0', // Light background color
          },
          loginContainer: {
            backgroundColor: '#ffffff', // White background for the login form
            borderRadius: 10,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5, // For Android shadow
          },
          welcomeContainer: {
            alignItems: 'center',
          },
          title: {
            fontSize: 28,
            marginBottom: 16,
            textAlign: 'center',
            color: '#333', // Dark text color
          },
          input: {
            height: 50,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            paddingHorizontal: 10,
            fontSize: 16,
          },
          loginButton: {
            backgroundColor: '#007BFF', // Blue button color
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: 'center',
          },
          loginButtonText: {
            color: '#ffffff', // White text color
            fontSize: 18,
            fontWeight: 'bold',
          },
          welcomeText: {
            fontSize: 24,
            marginBottom: 20,
            textAlign: 'center',
            color: '#333',
          },
          logoutButton: {
            marginTop: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: '#FF5733', // Red button color for logout
            borderRadius: 8,
          },
          logoutButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 'bold',
          },
        });
        
        export default App; 
    }
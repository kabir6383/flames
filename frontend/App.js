import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import MainScreen from './src/screens/MainScreen';
import axios from 'axios';

// Replace with your local IP if testing on a real device
const API_URL = 'http://localhost:5000/api';
// Replace with your Google Apps Script Web App URL after deployment
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbydz8f3oOGsDzhvhqUy8PVkL0zJsG_6NlsPyHCU3NWsdbmYKxrEIReevyJi_81TBMGvUQ/exec'; 

export default function App() {

  const handleCalculateSuccess = async (resultChar, name1, name2) => {
    const meaningMap = {
      'F': 'Friends',
      'L': 'Love',
      'A': 'Affection',
      'M': 'Marriage',
      'E': 'Enemy',
      'S': 'Sister'
    };
    const fullResult = meaningMap[resultChar] || resultChar;
    // 1. Send to MongoDB (MERN requirement)
    try {
      await axios.post(`${API_URL}/calculate`, {
        name1: name1,
        name2: name2
      });
      console.log('Result saved to MongoDB');
    } catch (error) {
      console.log('Backend (MongoDB) not connected, skipping local save.');
    }

    // 2. Send to Google Sheets (Apps Script)
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name1,
            partner: name2,
            result: fullResult
          })
        });
        console.log('Result saved to Google Sheets');
      } catch (error) {
        console.warn('Google Sheets save failed:', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <SafeAreaView style={{ flex: 1 }}>
        <MainScreen 
          onCalculateSuccess={handleCalculateSuccess}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

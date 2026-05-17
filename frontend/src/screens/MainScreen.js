import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp, ZoomIn } from 'react-native-reanimated';
import FlamesCalculator from '../components/FlamesCalculator';

const { width } = Dimensions.get('window');

export default function MainScreen({ onCalculateSuccess }) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  
  const quote = "Discover the sparks between you. Will it be Friends, Love, Affection, Marriage, Enemy, or Sister?";

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#FFF0F0', '#FFE3E3']}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={ZoomIn.duration(800)} style={styles.celebration}>
          <Text style={styles.sparkles}>✨🎉✨</Text>
        </Animated.View>

        <Animated.Text entering={FadeIn.delay(300).duration(800)} style={styles.headerTitle}>
          FLAMES Calculator
        </Animated.Text>

        <Animated.View entering={FadeIn.delay(500).duration(800)} style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="your name here..."
              value={name1}
              onChangeText={setName1}
              placeholderTextColor="#A0A0A0"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Partner's Name</Text>
            <TextInput
              style={styles.input}
              placeholder="you know... 😉"
              value={name2}
              onChangeText={setName2}
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(700).duration(800)} style={styles.quoteCard}>
          <Text style={styles.quoteMarkTop}>“</Text>
          <Text style={styles.quoteText}>{quote}</Text>
          <Text style={styles.quoteMarkBottom}>”</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(1000).duration(800)} style={styles.calculatorWrapper}>
          <FlamesCalculator 
            name1={name1} 
            name2={name2} 
            onCalculateSuccess={onCalculateSuccess} 
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  celebration: {
    marginBottom: 20,
  },
  sparkles: {
    fontSize: 50,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF0055',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputSection: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#FF0055',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#FF0055',
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFEBEB',
    color: '#2C3E50',
  },
  quoteCard: {
    width: width * 0.85,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
    marginBottom: 20,
  },
  quoteMarkTop: {
    position: 'absolute',
    top: 5,
    left: 10,
    fontSize: 50,
    color: '#FFD1D1',
    fontFamily: 'serif',
  },
  quoteText: {
    fontSize: 20,
    color: '#C0392B',
    fontFamily: 'serif',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 30,
    zIndex: 2,
    marginTop: 15,
    marginBottom: 15,
  },
  quoteMarkBottom: {
    position: 'absolute',
    bottom: -15,
    right: 15,
    fontSize: 50,
    color: '#FFD1D1',
    fontFamily: 'serif',
  },
  calculatorWrapper: {
    width: '100%',
    alignItems: 'center',
  }
});

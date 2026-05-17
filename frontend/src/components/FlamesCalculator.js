import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, ZoomIn, BounceIn, Layout } from 'react-native-reanimated';
import { FLAMES_MEANINGS, getFlamesAnimationSteps } from '../utils/flamesLogic';

export default function FlamesCalculator({ name1, name2, onCalculateSuccess }) {
  const [phase, setPhase] = useState('IDLE'); // IDLE, STRIKING, COUNTING, ELIMINATING, RESULT
  const [animData, setAnimData] = useState(null);
  
  const [struck1, setStruck1] = useState([]);
  const [struck2, setStruck2] = useState([]);
  const [eliminatedFlames, setEliminatedFlames] = useState([]);
  const [isFinalGlow, setIsFinalGlow] = useState(false);
  const [error, setError] = useState('');

  const flamesBase = ['F', 'L', 'A', 'M', 'E', 'S'];

  const resetState = () => {
    setPhase('IDLE');
    setAnimData(null);
    setStruck1([]);
    setStruck2([]);
    setEliminatedFlames([]);
    setIsFinalGlow(false);
    setError('');
  };

  const handleCalculate = () => {
    if (!name1.trim() || !name2.trim()) {
      setError("Please enter both names");
      return;
    }
    
    resetState();
    const data = getFlamesAnimationSteps(name1, name2);
    setAnimData(data);
    setPhase('STRIKING');
  };

  // Run animation sequence
  useEffect(() => {
    if (phase === 'STRIKING' && animData) {
      // Strike common letters one by one to build hype
      let step = 0;
      const totalCommon = animData.commonIndices1.length;
      
      if (totalCommon === 0) {
        const timer = setTimeout(() => setPhase('COUNTING'), 1500);
        return () => clearTimeout(timer);
      }

      const interval = setInterval(() => {
        if (step < totalCommon) {
          // Use a function to ensure we get the latest state
          const currentStep = step;
          setStruck1(prev => [...prev, animData.commonIndices1[currentStep]]);
          setStruck2(prev => [...prev, animData.commonIndices2[currentStep]]);
          step++;
        } else {
          clearInterval(interval);
          setTimeout(() => setPhase('COUNTING'), 1200);
        }
      }, 700); // 700ms delay between cutting each common letter
      
      return () => clearInterval(interval);
    }
    
    if (phase === 'COUNTING' && animData) {
      // Show count for 1.5s then move to eliminating
      const timer = setTimeout(() => {
        setPhase('ELIMINATING');
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (phase === 'ELIMINATING' && animData) {
      // Eliminate letters one by one
      let step = 0;
      const interval = setInterval(() => {
        if (step < animData.eliminationSteps.length) {
          // Capture step in a local variable before state updater
          const currentStep = step;
          setEliminatedFlames(prev => {
             if (prev.includes(animData.eliminationSteps[currentStep])) return prev;
             return [...prev, animData.eliminationSteps[currentStep]];
          });
          step++;
        } else {
          clearInterval(interval);
          setIsFinalGlow(true);
          setTimeout(() => {
            setPhase('RESULT');
            if (onCalculateSuccess) {
              onCalculateSuccess(animData.finalResult, name1, name2);
            }
          }, 3500); // Wait 3.5s to show the glow for maximum suspense
        }
      }, 1200); // 1200ms between each elimination for major hype
      
      return () => clearInterval(interval);
    }
  }, [phase, animData, name1, name2, onCalculateSuccess]);

  const meaning = (phase === 'RESULT' && animData) ? FLAMES_MEANINGS[animData.finalResult] : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expect the Unexpected</Text>

      {error ? (
        <Animated.Text entering={FadeIn} style={styles.errorText}>
          {error}
        </Animated.Text>
      ) : null}

      {phase === 'IDLE' && (
        <TouchableOpacity 
          style={styles.calculateButton}
          onPress={handleCalculate}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF4D4D', '#FF0055']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>💘 Try It</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {(phase === 'STRIKING' || phase === 'COUNTING' || phase === 'ELIMINATING') && animData && (
        <Animated.View entering={FadeIn} style={styles.animationContainer}>
          
          <View style={styles.namesRow}>
             <View style={styles.nameBlock}>
                {animData.name1Array.map((char, idx) => (
                  <Text key={`n1-${idx}`} style={[styles.letter, struck1.includes(idx) && styles.struckLetter]}>
                    {char.toUpperCase()}
                  </Text>
                ))}
             </View>
             <Text style={styles.plusText}>+</Text>
             <View style={styles.nameBlock}>
                {animData.name2Array.map((char, idx) => (
                  <Text key={`n2-${idx}`} style={[styles.letter, struck2.includes(idx) && styles.struckLetter]}>
                    {char.toUpperCase()}
                  </Text>
                ))}
             </View>
          </View>

          {phase === 'COUNTING' && (
             <Animated.View entering={BounceIn} style={styles.countContainer}>
               <Text style={styles.countText}>Total: {animData.count}</Text>
             </Animated.View>
          )}

          {(phase === 'ELIMINATING') && (
             <Animated.View entering={FadeIn} style={styles.flamesRow}>
                {flamesBase.map((fChar, idx) => {
                   const isEliminated = eliminatedFlames.includes(fChar);
                   const isSurvivor = isFinalGlow && fChar === animData.finalResult;
                   
                   if (isSurvivor) {
                     return (
                       <Animated.Text 
                          entering={ZoomIn.duration(1500)}
                          key={`survivor-${fChar}`} 
                          style={[styles.flamesLetter, styles.glowingLetter]}
                       >
                         {fChar}
                       </Animated.Text>
                     );
                   }

                   return (
                     <Animated.Text 
                        layout={Layout.springify()} 
                        key={fChar} 
                        style={[styles.flamesLetter, isEliminated && styles.eliminatedFlamesLetter]}
                     >
                       {fChar}
                     </Animated.Text>
                   );
                })}
             </Animated.View>
          )}
        </Animated.View>
      )}

      {phase === 'RESULT' && meaning && (
        <Animated.View entering={ZoomIn.duration(800)} style={styles.resultContainer}>
          <View style={styles.resultCircle}>
             <Text style={styles.emoji}>{meaning.emoji}</Text>
          </View>
          <Animated.Text entering={BounceIn.delay(400)} style={[styles.resultTitle, { color: meaning.color }]}>
            {meaning.title}
          </Animated.Text>
          <Text style={styles.descriptionText}>
            {meaning.description}
          </Text>

          <TouchableOpacity style={{marginTop: 20}} onPress={resetState}>
            <Text style={{color: '#FF0055', fontWeight: 'bold'}}>Recalculate</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#FF0055',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFEBEB',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF0055',
    marginBottom: 20,
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '700',
  },
  calculateButton: {
    borderRadius: 30,
    overflow: 'hidden',
    width: '80%',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  animationContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  namesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  nameBlock: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  letter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginHorizontal: 2,
  },
  struckLetter: {
    textDecorationLine: 'line-through',
    color: '#E74C3C',
    opacity: 0.5,
  },
  plusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF0055',
  },
  countContainer: {
    backgroundColor: '#FFD1D1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0055',
  },
  flamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  flamesLetter: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF0055',
  },
  eliminatedFlamesLetter: {
    textDecorationLine: 'line-through',
    color: '#BDC3C7',
    opacity: 0.3,
  },
  glowingLetter: {
    textShadowColor: '#FF0055',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    transform: [{ scale: 1.5 }],
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  resultCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD1D1',
    marginBottom: 15,
  },
  emoji: {
    fontSize: 50,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});

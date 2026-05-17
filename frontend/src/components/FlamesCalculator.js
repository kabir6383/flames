import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, ZoomIn, BounceIn, Layout } from 'react-native-reanimated';
import { Play, RotateCcw, Heart } from 'lucide-react-native';
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
      setError("Please enter both names to run evaluation");
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
      let step = 0;
      const totalCommon = animData.commonIndices1.length;
      
      if (totalCommon === 0) {
        const timer = setTimeout(() => setPhase('COUNTING'), 1200);
        return () => clearTimeout(timer);
      }

      const interval = setInterval(() => {
        if (step < totalCommon) {
          const currentStep = step;
          setStruck1(prev => [...prev, animData.commonIndices1[currentStep]]);
          setStruck2(prev => [...prev, animData.commonIndices2[currentStep]]);
          step++;
        } else {
          clearInterval(interval);
          setTimeout(() => setPhase('COUNTING'), 1000);
        }
      }, 500); // 500ms delay between cutting each common letter
      
      return () => clearInterval(interval);
    }
    
    if (phase === 'COUNTING' && animData) {
      const timer = setTimeout(() => {
        setPhase('ELIMINATING');
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (phase === 'ELIMINATING' && animData) {
      let step = 0;
      const interval = setInterval(() => {
        if (step < animData.eliminationSteps.length) {
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
          }, 2000); // 2 seconds glow reveal
        }
      }, 800); // 800ms speed for smoother official feel
      
      return () => clearInterval(interval);
    }
  }, [phase, animData, name1, name2, onCalculateSuccess]);

  const meaning = (phase === 'RESULT' && animData) ? FLAMES_MEANINGS[animData.finalResult] : null;

  return (
    <View style={styles.container}>
      {error ? (
        <Animated.Text entering={FadeIn} style={styles.errorText}>
          ⚠️ {error}
        </Animated.Text>
      ) : null}

      {phase === 'IDLE' && (
        <TouchableOpacity 
          style={styles.calculateButton}
          onPress={handleCalculate}
          activeOpacity={0.9}
        >
          <View style={styles.buttonContent}>
            <Heart size={18} color="#FFF" fill="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Evaluate Compatibility</Text>
          </View>
        </TouchableOpacity>
      )}

      {(phase === 'STRIKING' || phase === 'COUNTING' || phase === 'ELIMINATING') && animData && (
        <Animated.View entering={FadeIn} style={styles.animationContainer}>
          <Text style={styles.phaseLabel}>
            {phase === 'STRIKING' && 'ANALYZING ALPHABET RELATIONSHIPS...'}
            {phase === 'COUNTING' && 'COMPUTING TOTAL MATRIX RATIO...'}
            {phase === 'ELIMINATING' && 'ELIMINATING DEVIATION COEFFICIENTS...'}
          </Text>

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
               <Text style={styles.countText}>INDEX DIVISOR: {animData.count}</Text>
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
                          entering={ZoomIn.duration(1000)}
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
        <Animated.View entering={ZoomIn.duration(600)} style={styles.resultContainer}>
          <View style={[styles.resultBadge, { backgroundColor: meaning.color + '15', borderColor: meaning.color }]}>
             <Text style={styles.emoji}>{meaning.emoji}</Text>
             <Text style={[styles.resultTitle, { color: meaning.color }]}>
               {meaning.title.toUpperCase()}
             </Text>
          </View>
          
          <Text style={styles.descriptionText}>
            "{meaning.description}"
          </Text>

          <TouchableOpacity style={styles.recalculateButton} onPress={resetState} activeOpacity={0.8}>
            <RotateCcw size={14} color="#8A2BE2" style={{marginRight: 6}} />
            <Text style={styles.recalculateText}>New Compatibility Check</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 15,
    fontWeight: '700',
  },
  calculateButton: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#8A2BE2',
    overflow: 'hidden',
    paddingVertical: 14,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonIcon: {
    marginTop: 1,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  animationContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#FAF9FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBE3FF',
    marginTop: 10,
  },
  phaseLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A2BE2',
    letterSpacing: 1,
    marginBottom: 15,
  },
  namesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  nameBlock: {
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  letter: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginHorizontal: 1,
    fontFamily: 'monospace',
  },
  struckLetter: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
    opacity: 0.4,
  },
  plusText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8A2BE2',
  },
  countContainer: {
    backgroundColor: '#EBE3FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A2BE2',
    letterSpacing: 0.5,
  },
  flamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 5,
  },
  flamesLetter: {
    fontSize: 22,
    fontWeight: '900',
    color: '#8A2BE2',
  },
  eliminatedFlamesLetter: {
    textDecorationLine: 'line-through',
    color: '#D1D5DB',
    opacity: 0.3,
  },
  glowingLetter: {
    color: '#8A2BE2',
    textShadowColor: '#8A2BE2',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    transform: [{ scale: 1.3 }],
  },
  resultContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginBottom: 15,
    gap: 10,
  },
  emoji: {
    fontSize: 24,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  recalculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FF',
    borderWidth: 1,
    borderColor: '#EBE3FF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  recalculateText: {
    color: '#8A2BE2',
    fontWeight: '800',
    fontSize: 12,
  },
});

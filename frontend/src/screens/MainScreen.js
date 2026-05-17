import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions, Pressable } from 'react-native';
import Animated, { FadeIn, ZoomIn, SlideInRight } from 'react-native-reanimated';
import { Heart, Sparkles, Lock, Shield, ArrowRight, HelpCircle, Info } from 'lucide-react-native';
import FlamesCalculator from '../components/FlamesCalculator';

export default function MainScreen({ onCalculateSuccess }) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const flamesGrid = [
    { key: 'F', name: 'Friends', emoji: '🤝', desc: 'A strong, everlasting bond built on trust.', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    { key: 'L', name: 'Love', emoji: '❤️', desc: 'A deep, passionate connection of souls.', bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
    { key: 'A', name: 'Affection', emoji: '😊', desc: 'Genuine warmth, kindness, and fond care.', bg: '#FFFBEB', border: '#FEF3C7', text: '#92400E' },
    { key: 'M', name: 'Marriage', emoji: '💍', desc: 'A lifetime of growth and togetherness.', bg: '#FDF4FF', border: '#F5D0FE', text: '#86198F' },
    { key: 'E', name: 'Enemy', emoji: '🔥', desc: 'A fiery, intense, and competitive relationship.', bg: '#FFF7ED', border: '#FFEDD5', text: '#9A3412' },
    { key: 'S', name: 'Sister', emoji: '👧', desc: 'A protective, sibling-like support system.', bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Sticky Header Navigation */}
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Heart size={24} color="#8A2BE2" fill="#8A2BE2" style={styles.logoIcon} />
            <Text style={styles.logoText}>FLAMES</Text>
          </View>
          
          {isDesktop && (
            <View style={styles.navLinks}>
              <Text style={styles.navLinkActive}>Calculator</Text>
              <Text style={styles.navLink}>How it Works</Text>
              <Text style={styles.navLink}>Privacy</Text>
              <Text style={styles.navLink}>Security</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Content Layout */}
        <View style={[styles.mainLayout, isDesktop && styles.desktopLayout]}>
          
          {/* Left Column: Hero & Information */}
          <View style={[styles.leftColumn, isDesktop && styles.desktopLeftColumn]}>
            <Animated.View entering={FadeIn.duration(800)}>

              
              <Text style={styles.heroTitle}>
                Discover the True Nature of Your Bond
              </Text>
              


              {/* Grid of Emojis and Meanings */}
              <Text style={styles.sectionHeading}>Calculated Outcomes Dictionary</Text>
              <View style={styles.flamesGridContainer}>
                {flamesGrid.map((item, idx) => (
                  <Animated.View 
                    entering={ZoomIn.delay(idx * 100).duration(600)} 
                    key={item.key} 
                    style={[styles.flamesGridItem, { backgroundColor: item.bg, borderColor: item.border }]}
                  >
                    <View style={styles.flamesItemHeader}>
                      <Text style={styles.flamesItemEmoji}>{item.emoji}</Text>
                      <Text style={[styles.flamesItemName, { color: item.text }]}>{item.name}</Text>
                    </View>
                    <Text style={styles.flamesItemDesc}>{item.desc}</Text>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          </View>

          {/* Right Column: Unified Calculator Card */}
          <View style={[styles.rightColumn, isDesktop && styles.desktopRightColumn]}>
            <Animated.View entering={SlideInRight.duration(800)} style={styles.calculatorCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Compatibility Calculator</Text>
                <Text style={styles.cardSubtitle}>Enter full names below to begin analysis</Text>
              </View>

              <View style={styles.inputSection}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Your Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name..."
                    value={name1}
                    onChangeText={setName1}
                    placeholderTextColor="#A0A0A0"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Partner's Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter their name..."
                    value={name2}
                    onChangeText={setName2}
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>

              <View style={styles.calculatorWrapper}>
                <FlamesCalculator 
                  name1={name1} 
                  name2={name2} 
                  onCalculateSuccess={onCalculateSuccess} 
                />
              </View>
            </Animated.View>
          </View>
        </View>

        {/* Detailed "How it works" section below */}
        <View style={styles.methodologySection}>
          <Text style={styles.methodologyTitle}>
            How the FLAMES Algorithm Works
          </Text>
          <Text style={styles.methodologySubtitle}>
            The system employs a deterministic letter-striking mathematical reduction model to isolate the final status vector.
          </Text>

          <View style={styles.stepsContainer}>
            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>01</Text>
              <Text style={styles.stepTitle}>Eliminate Common Letters</Text>
              <Text style={styles.stepDesc}>
                All identical characters occurring across both names are progressively removed, leaving only unique remaining letters.
              </Text>
            </View>
            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>02</Text>
              <Text style={styles.stepTitle}>Compute Relationship Index</Text>
              <Text style={styles.stepDesc}>
                The system sums the remaining character counts to establish the primary relationship divisor/count index.
              </Text>
            </View>
            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>03</Text>
              <Text style={styles.stepTitle}>Iterative Elimination</Text>
              <Text style={styles.stepDesc}>
                Starting from 'F', the index is used to count and systematically eliminate letters until a single survivor is revealed.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 FLAMES Portal. Distributed under mathematical predictive licensing.
          </Text>
          <Text style={styles.footerSubText}>
            This compatibility matrix is based on local algebraic indices. Run locally with browser sandbox security.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBE3FF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    zIndex: 10,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
      },
    }),
  },
  headerContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  officialBadge: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  officialBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 25,
  },
  navLink: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    cursor: 'pointer',
  },
  navLinkActive: {
    fontSize: 14,
    color: '#8A2BE2',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainLayout: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
    paddingTop: 30,
    flexDirection: 'column',
  },
  desktopLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
    paddingTop: 50,
  },
  leftColumn: {
    width: '100%',
    marginBottom: 40,
  },
  desktopLeftColumn: {
    flex: 1.2,
    marginBottom: 0,
  },
  rightColumn: {
    width: '100%',
  },
  desktopRightColumn: {
    flex: 1,
  },
  portalTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
    gap: 6,
  },
  portalTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7E22CE',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 46,
    marginBottom: 15,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 25,
  },
  privacyShieldCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBE3FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 35,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  shieldIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  privacyDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 15,
  },
  flamesGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  flamesGridItem: {
    width: '48%',
    minWidth: 140,
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  flamesItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  flamesItemEmoji: {
    fontSize: 18,
  },
  flamesItemName: {
    fontSize: 14,
    fontWeight: '800',
  },
  flamesItemDesc: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 14,
  },
  calculatorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EBE3FF',
    padding: 24,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 8,
  },
  cardHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  inputSection: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FAFAFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#EBE3FF',
    color: '#1F2937',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  calculatorWrapper: {
    width: '100%',
  },
  methodologySection: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#EBE3FF',
    paddingTop: 40,
  },
  methodologyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  methodologySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 600,
    alignSelf: 'center',
    marginBottom: 35,
    lineHeight: 20,
  },
  stepsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBE3FF',
    borderRadius: 16,
    padding: 20,
    width: '30%',
    minWidth: 280,
    flexGrow: 1,
  },
  stepNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#E0D5FF',
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EBE3FF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 60,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
});

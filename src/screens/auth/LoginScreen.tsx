/**
 * NOVA Core — Login Screen (Hero Edition)
 * Full-screen fitness hero image with large "NOVA Core" overlay text,
 * animated slide-up form panel, and lively micro-interactions.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../auth/authStore';
import { colors } from '../../theme/colors';

const { height: SCREEN_H } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_H * 0.42;

export function LoginScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp, guestSignIn, isLoading, error, clearError } = useAuthStore();

  // Animations
  const heroScale = useRef(new Animated.Value(1.08)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(24)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const panelY = useRef(new Animated.Value(60)).current;
  const panelOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for the orange accent dot
  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation sequence
    Animated.sequence([
      // 1. Hero image fade + subtle zoom
      Animated.parallel([
        Animated.timing(heroOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(heroScale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
      // 2. Title slides up
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      // 3. Form panel slides up
      Animated.parallel([
        Animated.timing(panelOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(panelY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();

    // Continuous pulse on the accent dot
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, { toValue: 1.35, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseScale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const switchMode = (next: 'signin' | 'signup') => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 130, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    clearError();
    setMode(next);
  };

  const handleSubmit = async () => {
    if (mode === 'signin') {
      await signIn(email.trim(), password);
    } else {
      await signUp(email.trim(), password, displayName.trim() || 'Athlete');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Hero Image Section ── */}
      <Animated.View
        style={[
          styles.heroContainer,
          { opacity: heroOpacity, transform: [{ scale: heroScale }] },
        ]}
      >
        <ImageBackground
          source={require('../../../assets/auth_hero.png')}
          style={styles.heroBg}
          resizeMode="cover"
        >
          {/* Dark gradient overlays */}
          <View style={styles.heroOverlayTop} />
          <View style={styles.heroOverlayBottom} />

          {/* NOVA Core brand overlay — large text on hero */}
          <Animated.View
            style={[
              styles.brandBlock,
              { opacity: titleOpacity, transform: [{ translateY: titleY }] },
            ]}
          >
            {/* Pulse dot accent */}
            <View style={styles.dotRow}>
              <Animated.View
                style={[styles.pulseDot, { transform: [{ scale: pulseScale }] }]}
              />
              <View style={styles.pulseDotCore} />
            </View>

            <Text style={styles.brandLine1}>NOVA</Text>
            <Text style={styles.brandLine2}>Core</Text>
            <Text style={styles.brandTagline}>Your personal AI fitness coach</Text>
          </Animated.View>
        </ImageBackground>
      </Animated.View>

      {/* ── Form Panel (slides up over hero) ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.formPanel,
              { opacity: panelOpacity, transform: [{ translateY: panelY }] },
            ]}
          >
            {/* ── Tab Switcher ── */}
            <View style={styles.tabRow}>
              {(['signin', 'signup'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, mode === tab && styles.tabActive]}
                  onPress={() => switchMode(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, mode === tab && styles.tabTextActive]}>
                    {tab === 'signin' ? 'Log In' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Form Fields ── */}
            <Animated.View style={[styles.formBody, { opacity: fadeAnim }]}>
              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>⚠️  {error}</Text>
                </View>
              )}

              {mode === 'signup' && (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    style={styles.input}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Full Name"
                    placeholderTextColor={colors.text.muted}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              )}

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={mode === 'signin' ? 'Username or Email' : 'Email'}
                  placeholderTextColor={colors.text.muted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor={colors.text.muted}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword((v) => !v)}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>

              {mode === 'signup' && (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password"
                    placeholderTextColor={colors.text.muted}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>
              )}

              {/* ── Forgot password (sign-in only) ── */}
              {mode === 'signin' && (
                <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              {/* ── Primary CTA ── */}
              <TouchableOpacity
                style={[
                  styles.ctaButton,
                  (isLoading || !email || !password) && styles.ctaDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isLoading || !email || !password}
                activeOpacity={0.85}
              >
                <Text style={styles.ctaText}>
                  {isLoading
                    ? '⏳  Loading...'
                    : mode === 'signin'
                    ? '🚀  Log In'
                    : '✨  Create Account'}
                </Text>
              </TouchableOpacity>

              {/* ── Divider ── */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* ── Social Buttons ── */}
              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
                  <Text style={styles.socialBtnText}>G  Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialBtn, styles.appleSocialBtn]} activeOpacity={0.85}>
                  <Text style={styles.socialBtnTextDark}> Apple</Text>
                </TouchableOpacity>
              </View>

              {/* ── Guest Demo Button ── */}
              <TouchableOpacity
                style={styles.guestBtn}
                onPress={guestSignIn}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Text style={styles.guestBtnText}>✨  Try Guest Demo</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* ── Switch mode link ── */}
            <TouchableOpacity
              style={styles.switchLink}
              onPress={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              <Text style={styles.switchText}>
                {mode === 'signin'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <Text style={styles.switchAccent}>
                  {mode === 'signin' ? 'Sign Up' : 'Log In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.DEFAULT },
  flex: { flex: 1 },

  // ── Hero ──
  heroContainer: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroOverlayTop: {
    ...StyleSheet.absoluteFillObject,
    background: 'transparent',
    // top gradient: subtle dark vignette
    backgroundColor: 'rgba(15,15,26,0.18)',
  },
  heroOverlayBottom: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 120,
    backgroundColor: colors.background.DEFAULT,
    opacity: 0.85,
    // soft feather handled by the panel overlap
  },

  // ── Brand overlay on hero ──
  brandBlock: {
    position: 'absolute',
    bottom: 28,
    left: 22,
  },
  dotRow: {
    position: 'relative',
    width: 18,
    height: 18,
    marginBottom: 6,
  },
  pulseDot: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,102,0,0.35)',
  },
  pulseDotCore: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.electric.DEFAULT,
  },
  brandLine1: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    lineHeight: 56,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  brandLine2: {
    fontSize: 56,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: 2,
    lineHeight: 58,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  brandTagline: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.3,
  },

  // ── Form Panel ──
  scrollContent: {
    flexGrow: 1,
    paddingTop: 0,
  },
  formPanel: {
    backgroundColor: colors.background.DEFAULT,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 32,
    // subtle top orange shimmer border
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255,102,0,0.22)',
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },

  // ── Tabs ──
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 18,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.electric.DEFAULT,
    shadowColor: colors.electric.glow,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  tabText: { color: colors.text.muted, fontWeight: '600', fontSize: 15 },
  tabTextActive: { color: '#FFFFFF', fontWeight: '800' },

  // ── Form body ──
  formBody: { gap: 12 },

  errorBanner: {
    backgroundColor: 'rgba(255,59,92,0.12)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,59,92,0.3)',
  },
  errorText: { color: colors.error, fontSize: 13 },

  // ── Inputs ──
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
    paddingVertical: 13,
  },
  eyeBtn: { padding: 8 },
  eyeIcon: { fontSize: 18 },

  forgotRow: { alignItems: 'flex-end', marginTop: -4 },
  forgotText: { color: colors.electric.DEFAULT, fontSize: 13, fontWeight: '600' },

  // ── CTA ──
  ctaButton: {
    backgroundColor: colors.electric.DEFAULT,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: colors.electric.glow,
    shadowOpacity: 0.8,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  // ── Divider ──
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerText: { color: colors.text.muted, fontSize: 12 },

  // ── Social ──
  socialRow: { flexDirection: 'row', gap: 10 },
  socialBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 13,
    alignItems: 'center',
  },
  appleSocialBtn: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  socialBtnText: { color: '#1A1A2E', fontSize: 14, fontWeight: '700' },
  socialBtnTextDark: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  guestBtn: {
    backgroundColor: colors.electric.subtle,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: colors.electric.DEFAULT,
    shadowColor: colors.electric.glow,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  guestBtnText: {
    color: colors.electric.bright,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ── Switch mode ──
  switchLink: { alignItems: 'center', paddingTop: 20 },
  switchText: { color: colors.text.muted, fontSize: 14 },
  switchAccent: { color: colors.electric.DEFAULT, fontWeight: '700' },
});

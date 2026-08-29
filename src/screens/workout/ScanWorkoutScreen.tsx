/**
 * NOVA Core — AI Scan Workout Screen (Overhauled)
 * Camera-based form detection with Firebase workout logging.
 * Uses workoutStore (not the old activityStore).
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useAuthStore } from '../../auth/authStore';
import { GlassCard } from '../../components/GlassCard';
import { AnimatedButton } from '../../components/AnimatedButton';
import { colors } from '../../theme/colors';
import { logger } from '../../utils/logger';

// Simulated AI detection results for demo
const DEMO_DETECTIONS = ['Squat', 'Push-Up', 'Lunge', 'Plank', 'Burpee'];

export function ScanWorkoutScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const user = useAuthStore((s) => s.user);
  const { startSession, addSet, finishSession, isLoading } = useWorkoutStore();

  // Pulse animation during scan
  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [scanning]);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission?.().catch((err: unknown) => {
        // Some Android configurations reject the permission request itself
        logger.error('ScanWorkoutScreen.requestPermission', err, {
          platform: Platform.OS,
        });
        setScanError('Could not request camera permission. Please enable it in Settings.');
      });
    }
  }, [permission]);

  const handleStartScan = () => {
    setScanning(true);
    setDetected(null);
    setLogged(false);
    setScanError(null);
    // Simulate AI detection after 3 seconds
    setTimeout(() => {
      const pick = DEMO_DETECTIONS[Math.floor(Math.random() * DEMO_DETECTIONS.length)];
      setDetected(pick);
      setScanning(false);
    }, 3000);
  };

  const handleLogDetected = async () => {
    if (!detected || !user?.id) return;
    setScanError(null);
    const exerciseId = detected.toLowerCase().replace(/\s+/g, '-');
    try {
      startSession(exerciseId, detected);
      addSet({ reps: 10 });
      await finishSession(user.id, 5);
      setDetected(null);
      setLogged(true);
    } catch (err: unknown) {
      // finishSession already logs internally via workoutStore, but we also
      // capture screen-level context here for the UI response.
      logger.error('ScanWorkoutScreen.handleLogDetected', err, {
        uid: user.id,
        exerciseId,
        exerciseName: detected,
      });
      setScanError('Failed to log workout. Check your connection and try again.');
    }
  };

  // ── Web placeholder (camera not supported on web) ──
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.heroRow}>
            <View style={styles.heroIcon}>
              <Text style={{ fontSize: 36 }}>📷</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>AI Form Scanner</Text>
              <Text style={styles.heroSub}>Camera scanning works on iOS & Android</Text>
            </View>
          </View>

          <GlassCard accent="blue" glow style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 How it works</Text>
            <Text style={styles.infoText}>
              On your phone, point the camera at yourself while working out. NOVA Core's AI will detect your exercise and automatically suggest form corrections in real time.
            </Text>
          </GlassCard>

          {/* Demo simulation for web */}
          <GlassCard accent={logged ? 'green' : 'none'} style={styles.demoCard}>
            <Text style={styles.demoTitle}>🎮 Try a demo scan</Text>
            <Text style={styles.demoSub}>Simulate AI detection on web</Text>

            {scanning && (
              <View style={styles.analysingRow}>
                <Animated.Text style={[styles.analysingDot, { transform: [{ scale: pulseAnim }] }]}>
                  ●
                </Animated.Text>
                <Text style={styles.analysingText}>Analysing movement…</Text>
              </View>
            )}

            {detected && (
              <GlassCard accent="green" style={styles.detectedCard} padding={12}>
                <Text style={styles.detectedLabel}>DETECTED EXERCISE</Text>
                <Text style={styles.detectedName}>{detected}</Text>
                <AnimatedButton
                  label="Log to Firebase 🔥"
                  onPress={handleLogDetected}
                  loading={isLoading}
                  variant="success"
                  style={{ marginTop: 8 }}
                />
              </GlassCard>
            )}

            {logged && (
              <View style={styles.loggedBanner}>
                <Text style={styles.loggedText}>✅ Workout logged to Firebase!</Text>
              </View>
            )}

            {scanError && (
              <GlassCard accent="orange" style={styles.errorCard} padding={12}>
                <Text style={styles.errorText}>⚠️ {scanError}</Text>
                <TouchableOpacity onPress={() => setScanError(null)} style={styles.errorDismiss}>
                  <Text style={styles.errorDismissText}>Dismiss</Text>
                </TouchableOpacity>
              </GlassCard>
            )}

            {!scanning && !detected && (
              <AnimatedButton
                label={logged ? 'Scan Again' : 'Start AI Scan'}
                onPress={handleStartScan}
                icon="📷"
                variant="primary"
                style={{ marginTop: 16 }}
              />
            )}
          </GlassCard>

          {/* Feature list */}
          <View style={styles.features}>
            {[
              { icon: '🦴', text: 'Pose estimation & rep counting' },
              { icon: '⚡', text: 'Real-time form feedback' },
              { icon: '☁️', text: 'Auto-logs to your Firebase profile' },
              { icon: '📈', text: 'Updates heatmap & progress instantly' },
            ].map(({ icon, text }) => (
              <View key={text} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{icon}</Text>
                <Text style={styles.featureText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Camera permission not yet checked ──
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Checking camera…</Text>
      </View>
    );
  }

  // ── Permission denied ──
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <GlassCard accent="orange" glow>
            <Text style={styles.permTitle}>📷 Camera Access Needed</Text>
            <Text style={styles.permText}>
              NOVA Core needs camera access to analyze your workout form in real time.
            </Text>
            <AnimatedButton
              label="Grant Camera Permission"
              onPress={requestPermission}
              variant="primary"
              style={{ marginTop: 16 }}
            />
          </GlassCard>
        </View>
      </SafeAreaView>
    );
  }

  // ── Live camera view ──
  return (
    <View style={styles.camContainer}>
      <CameraView style={StyleSheet.absoluteFill}>
        {/* Scan frame corners */}
        <View style={styles.frameWrapper}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>

        {/* Bottom controls */}
        <View style={styles.overlay}>
          {scanning && (
            <Animated.View style={[styles.scanningBadge, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.scanningText}>● Analysing…</Text>
            </Animated.View>
          )}

          {detected && (
            <View style={styles.detectedOverlay}>
              <Text style={styles.detectedOverlayLabel}>AI Detected:</Text>
              <Text style={styles.detectedOverlayName}>{detected}</Text>
              <TouchableOpacity style={styles.logBtn} onPress={handleLogDetected}>
                <Text style={styles.logBtnText}>Log this workout</Text>
              </TouchableOpacity>
            </View>
          )}

          {!scanning && !detected && (
            <Text style={styles.hintText}>Align your body in the frame and tap Start</Text>
          )}

          <TouchableOpacity
            onPress={handleStartScan}
            disabled={scanning}
            style={styles.recordButton}
            activeOpacity={0.8}
          >
            <Animated.View style={[
              styles.recordInner,
              scanning && { transform: [{ scale: pulseAnim }] },
            ]} />
          </TouchableOpacity>
          <Text style={styles.recordLabel}>{scanning ? 'Scanning…' : 'Start Scan'}</Text>
        </View>
      </CameraView>
    </View>
  );
}

const CORNER_SIZE = 24;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background.DEFAULT },
  center: { flex: 1, backgroundColor: colors.background.DEFAULT, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 20, gap: 16 },

  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 4 },
  heroIcon: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: colors.electric.subtle,
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { color: colors.text.primary, fontSize: 22, fontWeight: '800' },
  heroSub: { color: colors.text.muted, fontSize: 13 },

  infoCard: { gap: 8 },
  infoTitle: { color: colors.text.primary, fontWeight: '700', fontSize: 15 },
  infoText: { color: colors.text.secondary, fontSize: 13, lineHeight: 20 },

  demoCard: { gap: 8 },
  demoTitle: { color: colors.text.primary, fontWeight: '700', fontSize: 15 },
  demoSub: { color: colors.text.muted, fontSize: 12 },

  analysingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  analysingDot: { color: colors.electric.DEFAULT, fontSize: 16 },
  analysingText: { color: colors.electric.DEFAULT, fontSize: 14, fontWeight: '600' },

  detectedCard: { gap: 4 },
  detectedLabel: { color: colors.neon.DEFAULT, fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  detectedName: { color: colors.text.primary, fontSize: 22, fontWeight: '800' },

  loggedBanner: {
    backgroundColor: colors.neon.glow,
    borderRadius: 10, padding: 12, alignItems: 'center',
  },
  loggedText: { color: colors.neon.DEFAULT, fontWeight: '700' },

  features: { gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  featureText: { color: colors.text.secondary, fontSize: 14, flex: 1 },

  permTitle: { color: colors.text.primary, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  permText: { color: colors.text.secondary, fontSize: 14, lineHeight: 20 },

  // ── Camera styles ──
  camContainer: { flex: 1, backgroundColor: '#000' },
  frameWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: { width: 260, height: 380, position: 'relative' },
  corner: {
    position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE,
    borderColor: colors.electric.DEFAULT, borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  overlay: { padding: 24, paddingBottom: 48, alignItems: 'center', gap: 12 },
  scanningBadge: {
    backgroundColor: 'rgba(0,163,255,0.2)', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.electric.DEFAULT,
  },
  scanningText: { color: colors.electric.DEFAULT, fontWeight: '700' },
  detectedOverlay: {
    backgroundColor: 'rgba(0,255,136,0.15)', borderRadius: 12,
    padding: 16, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: colors.neon.DEFAULT,
  },
  detectedOverlayLabel: { color: colors.neon.DEFAULT, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  detectedOverlayName: { color: '#fff', fontSize: 22, fontWeight: '800' },
  logBtn: {
    backgroundColor: colors.neon.DEFAULT, borderRadius: 8,
    paddingHorizontal: 20, paddingVertical: 8, marginTop: 8,
  },
  logBtnText: { color: '#050D1A', fontWeight: '700' },
  hintText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, textAlign: 'center' },
  recordButton: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.electric.DEFAULT,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: colors.electric.glow,
    shadowColor: colors.electric.glow,
    shadowOpacity: 0.8, shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  recordInner: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff' },
  recordLabel: { color: '#fff', fontWeight: '600', fontSize: 13 },
  muted: { color: colors.text.muted },

  // ── Error banner ──
  errorCard: { gap: 6 },
  errorText: { color: colors.sunset.DEFAULT ?? colors.text.primary, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  errorDismiss: {
    alignSelf: 'flex-start', marginTop: 4,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 6, borderWidth: 1,
    borderColor: colors.sunset.DEFAULT ?? 'rgba(255,255,255,0.3)',
  },
  errorDismissText: { color: colors.text.secondary, fontSize: 12, fontWeight: '600' },
});

/**
 * NOVA Core — Exercise Detail Screen (Overhauled)
 * Full exercise profile: variations, step-by-step, common mistakes,
 * progression chain, and integrated workout logger.
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { WorkoutStackParamList } from '../../navigation/types';
import { getExerciseById, getProgressionChain, type Exercise } from '../../data/exercises';
import { GlassCard } from '../../components/GlassCard';
import { AnimatedButton } from '../../components/AnimatedButton';
import { ProgressBar } from '../../components/ProgressBar';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useAuthStore } from '../../auth/authStore';
import { colors } from '../../theme/colors';

type RouteProps = RouteProp<WorkoutStackParamList, 'ExerciseDetail'>;
type Nav = NativeStackNavigationProp<WorkoutStackParamList, 'ExerciseDetail'>;

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: colors.neon.DEFAULT,
  intermediate: colors.electric.DEFAULT,
  advanced: colors.sunset.DEFAULT,
  elite: colors.violet.DEFAULT,
};

export function ExerciseDetailScreen() {
  const { params } = useRoute<RouteProps>();
  const navigation = useNavigation<Nav>();
  const exercise = getExerciseById(params.exerciseId);
  const progressionChain = getProgressionChain(params.exerciseId);
  const user = useAuthStore((s) => s.user);

  const {
    activeSession, startSession, addSet, finishSession, cancelSession, isLoading,
  } = useWorkoutStore();

  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'log' | 'variations'>('info');

  if (!exercise) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Exercise not found.</Text>
      </SafeAreaView>
    );
  }

  const isMySession = activeSession?.exerciseId === exercise.id;

  const handleStartSession = () => {
    startSession(exercise.id, exercise.name);
    setSessionStarted(true);
    setActiveTab('log');
  };

  const handleAddSet = () => {
    const r = parseInt(reps, 10);
    if (!r || r <= 0) { Alert.alert('Invalid Reps', 'Enter a valid rep count.'); return; }
    addSet({
      reps: r,
      weight: weight ? parseFloat(weight) : undefined,
      duration: duration ? parseInt(duration, 10) : undefined,
    });
    Alert.alert('Set Added! 💪', `${r} reps ${weight ? `@ ${weight}kg` : '(bodyweight)'}`);
  };

  const handleFinish = async () => {
    if (!user?.id) return;
    const mins = parseInt(duration || '20', 10);
    await finishSession(user.id, mins);
    setSessionStarted(false);
    Alert.alert('Workout Saved! 🔥', 'Your session has been logged to Firebase.');
    navigation.goBack();
  };

  const diffColor = DIFFICULTY_COLOR[exercise.difficulty] ?? colors.electric.DEFAULT;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Text style={{ fontSize: 40 }}>💪</Text>
        </View>
        <Text style={styles.heroName}>{exercise.name}</Text>
        <View style={styles.heroBadges}>
          <View style={[styles.badge, { borderColor: `${diffColor}60`, backgroundColor: `${diffColor}15` }]}>
            <Text style={[styles.badgeText, { color: diffColor }]}>{exercise.difficulty}</Text>
          </View>
          <View style={styles.badgeGray}>
            <Text style={styles.badgeGrayText}>{exercise.category}</Text>
          </View>
          {exercise.equipment.includes('none') && (
            <View style={styles.badgeGreen}>
              <Text style={styles.badgeGreenText}>No Equipment</Text>
            </View>
          )}
        </View>

        {/* Primary muscles */}
        <View style={styles.muscleRow}>
          {exercise.muscles.map((m) => (
            <Text key={m} style={styles.muscleTag}>{m}</Text>
          ))}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {(['info', 'log', 'variations'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'info' ? '📋 Info' : tab === 'log' ? '🎯 Log' : `🔀 Variations (${exercise.variations.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── INFO TAB ── */}
        {activeTab === 'info' && (
          <>
            {/* Calorie card */}
            {exercise.caloriesPerMin && (
              <GlassCard accent="orange" style={{ marginBottom: 16 }} padding={12}>
                <View style={styles.calCard}>
                  <Text style={styles.calTitle}>🔥 Energy Output</Text>
                  <Text style={styles.calValue}>~{exercise.caloriesPerMin}</Text>
                  <Text style={styles.calUnit}>kcal / min</Text>
                </View>
              </GlassCard>
            )}

            {/* Instructions */}
            <Text style={styles.sectionTitle}>How to Perform</Text>
            <GlassCard accent="blue">
              {exercise.instructions.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </GlassCard>

            {/* Common Mistakes */}
            {exercise.commonMistakes.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>⚠️ Common Mistakes</Text>
                <GlassCard accent="orange">
                  {exercise.commonMistakes.map((m, i) => (
                    <View key={i} style={styles.mistakeRow}>
                      <Text style={styles.mistakeBad}>✗ {m.mistake}</Text>
                      <Text style={styles.mistakeFix}>✓ {m.fix}</Text>
                    </View>
                  ))}
                </GlassCard>
              </>
            )}

            {/* Progression Chain */}
            {progressionChain.length > 1 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>🚀 Progression Path</Text>
                <GlassCard accent="green">
                  {progressionChain.map((ex, i) => (
                    <View key={ex.id} style={styles.chainRow}>
                      <View style={[styles.chainDot, ex.id === exercise.id && { backgroundColor: colors.neon.DEFAULT }]} />
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => ex.id !== exercise.id && navigation.navigate('ExerciseDetail', { exerciseId: ex.id })}
                      >
                        <Text style={[styles.chainName, ex.id === exercise.id && { color: colors.neon.DEFAULT }]}>
                          {ex.id === exercise.id ? `● ${ex.name} (you are here)` : `${ex.name}`}
                        </Text>
                        <Text style={styles.chainDiff}>{ex.difficulty}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </GlassCard>
              </>
            )}
          </>
        )}

        {/* ── LOG TAB ── */}
        {activeTab === 'log' && (
          <>
            {!isMySession ? (
              <>
                <GlassCard accent="blue" glow style={{ marginBottom: 16 }}>
                  <Text style={styles.logHero}>Ready to crush it? 💪</Text>
                  <Text style={styles.logSub}>Start a session to log your sets and save to Firebase.</Text>
                </GlassCard>
                <AnimatedButton
                  label="Start Session"
                  onPress={handleStartSession}
                  icon="🎯"
                  variant="success"
                />
              </>
            ) : (
              <>
                {/* Current sets */}
                <GlassCard accent="green" style={{ marginBottom: 16 }}>
                  <Text style={styles.setsTitle}>
                    Sets Logged: {activeSession?.sets.length ?? 0}
                  </Text>
                  {activeSession?.sets.map((s, i) => (
                    <View key={i} style={styles.setRow}>
                      <Text style={styles.setNum}>Set {i + 1}</Text>
                      <Text style={styles.setDetails}>
                        {s.reps} reps {s.weight ? `@ ${s.weight}kg` : '(BW)'}
                      </Text>
                      <Text style={[styles.setVol, { color: colors.neon.DEFAULT }]}>
                        vol {s.reps * (s.weight ?? 1)}
                      </Text>
                    </View>
                  ))}
                </GlassCard>

                {/* Input row */}
                <GlassCard accent="blue" style={{ marginBottom: 16 }}>
                  <Text style={styles.inputLabel}>Add a Set</Text>
                  <View style={styles.inputRow}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputHint}>Reps</Text>
                      <TextInput
                        style={styles.numInput}
                        value={reps}
                        onChangeText={setReps}
                        keyboardType="numeric"
                        placeholder="10"
                        placeholderTextColor={colors.text.muted}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputHint}>Weight (kg)</Text>
                      <TextInput
                        style={styles.numInput}
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="decimal-pad"
                        placeholder="0 (BW)"
                        placeholderTextColor={colors.text.muted}
                      />
                    </View>
                  </View>
                  <AnimatedButton
                    label="Add Set"
                    onPress={handleAddSet}
                    icon="+"
                    variant="secondary"
                  />
                </GlassCard>

                {/* Finish */}
                <View style={{ gap: 10 }}>
                  <AnimatedButton
                    label="Finish & Save Workout 🔥"
                    onPress={handleFinish}
                    loading={isLoading}
                    disabled={(activeSession?.sets.length ?? 0) === 0}
                    variant="success"
                  />
                  <AnimatedButton
                    label="Cancel Session"
                    onPress={() => { cancelSession(); setSessionStarted(false); }}
                    variant="danger"
                  />
                </View>
              </>
            )}
          </>
        )}

        {/* ── VARIATIONS TAB ── */}
        {activeTab === 'variations' && (
          <>
            {exercise.variations.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔀</Text>
                <Text style={styles.emptyText}>No variations listed for this exercise.</Text>
              </View>
            ) : (
              exercise.variations.map((v) => (
                <GlassCard key={v.id} accent="none" style={{ marginBottom: 10 }} padding={14}>
                  <Text style={styles.varName}>{v.name}</Text>
                  <Text style={styles.varNote}>{v.focusNote}</Text>
                </GlassCard>
              ))
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background.DEFAULT },
  errorText: { color: colors.error, textAlign: 'center', marginTop: 40 },

  hero: {
    alignItems: 'center', paddingVertical: 24,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  heroIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.electric.subtle,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  heroName: { color: colors.text.primary, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  heroBadges: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' },
  badge: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  badgeGray: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeGrayText: { color: colors.text.muted, fontSize: 12, textTransform: 'capitalize' },
  badgeGreen: { backgroundColor: colors.neon.glow, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeGreenText: { color: colors.neon.DEFAULT, fontSize: 12, fontWeight: '600' },
  muscleRow: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' },
  muscleTag: { color: colors.text.muted, fontSize: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },

  tabBar: {
    flexDirection: 'row', borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)', backgroundColor: colors.background.card,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.electric.DEFAULT },
  tabText: { color: colors.text.muted, fontSize: 11, fontWeight: '600' },
  tabTextActive: { color: colors.electric.DEFAULT },

  scroll: { flex: 1 },
  content: { padding: 20 },

  sectionTitle: { color: colors.text.secondary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },

  calCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  calTitle: { color: colors.text.secondary, fontSize: 14, flex: 1 },
  calValue: { color: colors.sunset.DEFAULT, fontSize: 28, fontWeight: '900' },
  calUnit: { color: colors.text.muted, fontSize: 12 },

  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  stepNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.electric.subtle, alignItems: 'center', justifyContent: 'center',
  },
  stepNumText: { color: colors.electric.DEFAULT, fontWeight: '800', fontSize: 12 },
  stepText: { color: colors.text.primary, fontSize: 14, lineHeight: 20, flex: 1 },

  mistakeRow: { marginBottom: 12, gap: 4 },
  mistakeBad: { color: colors.error, fontSize: 13 },
  mistakeFix: { color: colors.neon.DEFAULT, fontSize: 13 },

  chainRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  chainDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.text.muted },
  chainName: { color: colors.text.primary, fontWeight: '600', fontSize: 14 },
  chainDiff: { color: colors.text.muted, fontSize: 12, textTransform: 'capitalize' },

  logHero: { color: colors.text.primary, fontSize: 18, fontWeight: '800', marginBottom: 6 },
  logSub: { color: colors.text.muted, fontSize: 13, lineHeight: 18 },

  setsTitle: { color: colors.neon.DEFAULT, fontWeight: '700', fontSize: 15, marginBottom: 10 },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  setNum: { color: colors.text.muted, fontSize: 12, width: 40 },
  setDetails: { color: colors.text.primary, fontSize: 14, flex: 1 },
  setVol: { fontSize: 12, fontWeight: '700' },

  inputLabel: { color: colors.text.secondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  inputGroup: { flex: 1, gap: 6 },
  inputHint: { color: colors.text.muted, fontSize: 11 },
  numInput: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    color: colors.text.primary, fontSize: 18, fontWeight: '700',
    padding: 12, textAlign: 'center',
  },

  varName: { color: colors.text.primary, fontWeight: '700', fontSize: 15, marginBottom: 4 },
  varNote: { color: colors.electric.DEFAULT, fontSize: 13 },

  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyText: { color: colors.text.muted, fontSize: 14, textAlign: 'center' },
});

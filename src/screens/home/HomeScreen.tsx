/**
 * NOVA Core — Home Screen (Orange Edition)
 * Matches Stitch design: greeting, macro cards, smart suggestion, quick actions.
 */

import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList, WorkoutStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../auth/authStore';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useProgressStore } from '../../stores/progressStore';
import { GlassCard } from '../../components/GlassCard';
import { ProgressBar } from '../../components/ProgressBar';
import { colors } from '../../theme/colors';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<WorkoutStackParamList>
>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const { workouts, subscribe: subWorkouts } = useWorkoutStore();
  const { stats, progressionSuggestions, subscribe: subProgress, computeInsights } = useProgressStore();

  useEffect(() => {
    if (!user?.id) return;
    const unsubW = subWorkouts(user.id);
    const unsubP = subProgress(user.id);
    return () => { unsubW(); unsubP(); };
  }, [user?.id]);

  useEffect(() => {
    if (workouts.length > 0) computeInsights(workouts);
  }, [workouts]);

  const greeting = (): string => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = workouts.filter((w) => w.completedAt.startsWith(today)).length;
  const weeklyGoal = 4;
  const streakDays = stats?.currentStreak ?? 0;
  const displayName = user?.displayName ?? 'Health Seeker';

  // Mock macro data (replace with real nutrition data if available)
  const macros = [
    { label: 'Protein', value: stats ? Math.round((stats.totalCalories ?? 0) * 0.0025) || 42 : 42, unit: 'g', color: '#FF6600' },
    { label: 'Carbs', value: stats ? Math.round((stats.totalCalories ?? 0) * 0.0015) || 128 : 128, unit: 'g', color: colors.neon.DEFAULT },
    { label: 'Fats', value: stats ? Math.round((stats.totalCalories ?? 0) * 0.0008) || 32 : 32, unit: 'g', color: colors.violet.DEFAULT },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.DEFAULT} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.name}>{displayName}!</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('Profile' as any)}
          >
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Search Bar ── */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Workout', { screen: 'WorkoutLibrary' })}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search exercises...</Text>
        </TouchableOpacity>

        {/* ── Macro Cards ── */}
        <Text style={styles.sectionTitle}>Today's Nutrition</Text>
        <View style={styles.macroRow}>
          {macros.map((macro) => (
            <GlassCard key={macro.label} accent="none" style={styles.macroCard} padding={14}>
              <Text style={[styles.macroValue, { color: macro.color }]}>{macro.value}{macro.unit}</Text>
              <Text style={styles.macroLabel}>{macro.label}</Text>
            </GlassCard>
          ))}
        </View>

        {/* ── Smart Suggestion ── */}
        <Text style={styles.sectionTitle}>🧠 Smart Suggestion</Text>
        <GlassCard accent="orange" glow style={styles.suggestionCard}>
          <View style={styles.suggestionContent}>
            <View style={styles.suggestionBadge}>
              <Text style={styles.suggestionBadgeText}>FEATURED</Text>
            </View>
            <Text style={styles.suggestionTitle}>Power Core Circuit</Text>
            <Text style={styles.suggestionSub}>Full body · 40 mins · ~320 kcal</Text>
            <View style={styles.suggestionMeta}>
              <View style={styles.metaTag}>
                <Text style={styles.metaTagText}>🔥 High Intensity</Text>
              </View>
              <View style={styles.metaTag}>
                <Text style={styles.metaTagText}>💪 No Equipment</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.suggestionBtn}
            onPress={() => navigation.navigate('Workout', { screen: 'WorkoutLibrary' })}
          >
            <Text style={styles.suggestionBtnText}>Start →</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* ── Today's Summary ── */}
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <GlassCard accent="blue" glow style={styles.summaryCard}>
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={[styles.statValue, { color: colors.electric.DEFAULT }]}>
                {todayCount}
              </Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={[styles.statValue, { color: colors.neon.DEFAULT }]}>
                {stats?.totalCalories
                  ? `${(stats.totalCalories / 1000).toFixed(1)}k`
                  : '0'}
              </Text>
              <Text style={styles.statLabel}>Total kcal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={[styles.statValue, { color: colors.electric.DEFAULT }]}>
                {streakDays}🔥
              </Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          <View style={{ marginTop: 16 }}>
            <ProgressBar
              value={(todayCount / weeklyGoal) * 100}
              label="Weekly Goal"
              sublabel={`${todayCount} of ${weeklyGoal} workouts this week`}
              color="orange"
              showPercent
            />
          </View>
        </GlassCard>

        {/* ── Quick Start ── */}
        <Text style={styles.sectionTitle}>Quick Start</Text>
        <View style={styles.quickRow}>
          <GlassCard
            accent="orange"
            glow
            style={styles.quickCard}
            onPress={() => navigation.navigate('Workout', { screen: 'WorkoutLibrary' })}
            padding={14}
          >
            <Text style={styles.quickIcon}>📋</Text>
            <Text style={styles.quickTitle}>Library</Text>
            <Text style={styles.quickSub}>Browse exercises</Text>
          </GlassCard>

          <GlassCard
            accent="orange"
            glow
            style={styles.quickCard}
            onPress={() => navigation.navigate('Workout', { screen: 'ScanWorkout' })}
            padding={14}
          >
            <Text style={styles.quickIcon}>📷</Text>
            <Text style={styles.quickTitle}>AI Scan</Text>
            <Text style={styles.quickSub}>Form analysis</Text>
          </GlassCard>

          <GlassCard
            accent="violet"
            style={styles.quickCard}
            onPress={() => navigation.navigate('Progress')}
            padding={14}
          >
            <Text style={styles.quickIcon}>📊</Text>
            <Text style={styles.quickTitle}>Progress</Text>
            <Text style={styles.quickSub}>Heatmap & PRs</Text>
          </GlassCard>
        </View>

        {/* ── Progression Suggestions ── */}
        {progressionSuggestions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🚀 Progress Intelligence</Text>
            {progressionSuggestions.map((sug) => (
              <GlassCard
                key={sug.exercise.id}
                accent={sug.urgency === 'ready' ? 'green' : sug.urgency === 'almost' ? 'orange' : 'none'}
                style={{ marginBottom: 10 }}
                onPress={() =>
                  navigation.navigate('Workout', {
                    screen: 'ExerciseDetail',
                    params: { exerciseId: sug.exercise.id },
                  })
                }
              >
                <View style={styles.suggestionRow}>
                  <View style={[
                    styles.urgencyDot,
                    { backgroundColor: sug.urgency === 'ready' ? colors.neon.DEFAULT : sug.urgency === 'almost' ? colors.electric.DEFAULT : colors.text.muted },
                  ]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.suggestionName}>
                      {sug.urgency === 'ready' ? '🚀 ' : sug.urgency === 'almost' ? '⚡ ' : '💪 '}
                      {sug.exercise.name}
                    </Text>
                    <Text style={styles.suggestionReason}>{sug.reason}</Text>
                  </View>
                  <Text style={styles.suggestionArrow}>›</Text>
                </View>
              </GlassCard>
            ))}
          </>
        )}

        {/* ── Recent Activity ── */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <GlassCard accent="none">
          {workouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏋️</Text>
              <Text style={styles.emptyText}>No workouts yet.</Text>
              <Text style={styles.emptySubtext}>Start with the library or AI scan above.</Text>
            </View>
          ) : (
            workouts.slice(0, 5).map((w, i) => {
              const date = new Date(w.completedAt);
              const when = date.toDateString() === new Date().toDateString()
                ? 'Today'
                : date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
              return (
                <View key={w.id ?? i} style={[styles.activityRow, i < Math.min(workouts.length, 5) - 1 && styles.activityDivider]}>
                  <View style={styles.activityIcon}>
                    <Text>💪</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityName}>{w.exerciseName}</Text>
                    <Text style={styles.activityMeta}>
                      {when} · {w.durationMinutes} min · {w.caloriesBurned} kcal
                    </Text>
                  </View>
                  <Text style={[styles.volumeTag, { color: colors.electric.DEFAULT }]}>
                    {w.totalVolume} vol
                  </Text>
                </View>
              );
            })
          )}
        </GlassCard>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background.DEFAULT },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { color: colors.text.secondary, fontSize: 14, fontWeight: '500' },
  name: { color: colors.text.primary, fontSize: 24, fontWeight: '800', letterSpacing: 0.2 },
  avatarBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.electric.subtle,
    borderWidth: 2, borderColor: colors.electric.DEFAULT,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: colors.electric.DEFAULT, fontWeight: '800', fontSize: 18 },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.glass.DEFAULT,
    borderRadius: 50,
    borderWidth: 1, borderColor: colors.glass.neutralBorder,
    paddingHorizontal: 18, paddingVertical: 13,
    marginBottom: 20, gap: 10,
  },
  searchIcon: { fontSize: 15 },
  searchPlaceholder: { color: colors.text.muted, fontSize: 14 },

  // Section title
  sectionTitle: {
    color: colors.text.primary, fontSize: 16, fontWeight: '700',
    marginBottom: 12, marginTop: 6,
  },

  // Macros
  macroRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  macroCard: { flex: 1, alignItems: 'center', gap: 4 },
  macroValue: { fontSize: 22, fontWeight: '900' },
  macroLabel: { color: colors.text.muted, fontSize: 11, fontWeight: '600' },

  // Smart suggestion
  suggestionCard: { marginBottom: 20, gap: 12 },
  suggestionContent: { gap: 8 },
  suggestionBadge: {
    backgroundColor: colors.electric.subtle,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  suggestionBadgeText: { color: colors.electric.DEFAULT, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  suggestionTitle: { color: colors.text.primary, fontSize: 20, fontWeight: '800' },
  suggestionSub: { color: colors.text.secondary, fontSize: 13 },
  suggestionMeta: { flexDirection: 'row', gap: 8, marginTop: 4 },
  metaTag: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  metaTagText: { color: colors.text.secondary, fontSize: 12 },
  suggestionBtn: {
    backgroundColor: colors.electric.DEFAULT,
    borderRadius: 50, paddingVertical: 12,
    alignItems: 'center',
    shadowColor: colors.electric.glow,
    shadowOpacity: 0.6, shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  suggestionBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },

  // Today's summary
  summaryCard: { marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statBlock: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 26, fontWeight: '900' },
  statLabel: { color: colors.text.muted, fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.06)' },

  // Quick actions
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  quickCard: { flex: 1, gap: 4 },
  quickIcon: { fontSize: 22, marginBottom: 4 },
  quickTitle: { color: colors.text.primary, fontWeight: '700', fontSize: 13 },
  quickSub: { color: colors.text.muted, fontSize: 10 },

  // Suggestions
  suggestionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  urgencyDot: { width: 8, height: 8, borderRadius: 4 },
  suggestionName: { color: colors.text.primary, fontWeight: '700', fontSize: 14 },
  suggestionReason: { color: colors.text.muted, fontSize: 12, marginTop: 2 },
  suggestionArrow: { color: colors.text.muted, fontSize: 22 },

  // Activity
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  activityIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.electric.subtle,
    alignItems: 'center', justifyContent: 'center',
  },
  activityName: { color: colors.text.primary, fontWeight: '600', fontSize: 14 },
  activityMeta: { color: colors.text.muted, fontSize: 12, marginTop: 2 },
  volumeTag: { fontSize: 11, fontWeight: '700' },

  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  emptyIcon: { fontSize: 36 },
  emptyText: { color: colors.text.secondary, fontWeight: '600' },
  emptySubtext: { color: colors.text.muted, fontSize: 12, textAlign: 'center' },
});

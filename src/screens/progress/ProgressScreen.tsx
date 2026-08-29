/**
 * NOVA Core — Progress Screen (Orange Edition)
 * Matches Stitch design: circular donut chart, line chart, bar chart,
 * calendar strip, consistency tracker, personal records.
 */

import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../auth/authStore';
import { useProgressStore } from '../../stores/progressStore';
import { useWorkoutStore } from '../../stores/workoutStore';
import { GlassCard } from '../../components/GlassCard';
import { ProgressBar } from '../../components/ProgressBar';
import { MuscleHeatmap } from '../../components/MuscleHeatmap';
import { colors } from '../../theme/colors';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Simple donut-style SVG-equivalent using Views
function DonutChart({ percent, color }: { percent: number; color: string }) {
  return (
    <View style={donutStyles.container}>
      <View style={[donutStyles.ring, { borderColor: 'rgba(255,255,255,0.06)' }]}>
        <View style={[donutStyles.fillOverlay, {
          backgroundColor: color,
          opacity: 0.15,
          transform: [{ rotate: `${(percent / 100) * 360}deg` }],
        }]} />
        <View style={donutStyles.inner}>
          <Text style={[donutStyles.percent, { color }]}>{Math.round(percent)}%</Text>
          <Text style={donutStyles.label}>Completion</Text>
        </View>
      </View>
    </View>
  );
}

// Simple bar chart using views
function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <View style={barStyles.container}>
      {data.map((val, i) => (
        <View key={i} style={barStyles.barWrapper}>
          <View
            style={[
              barStyles.bar,
              {
                height: Math.max(4, (val / max) * 60),
                backgroundColor: i === DAYS.indexOf('T') || val === max
                  ? colors.electric.DEFAULT
                  : 'rgba(255,102,0,0.25)',
              },
            ]}
          />
          <Text style={barStyles.barLabel}>{DAYS[i]}</Text>
        </View>
      ))}
    </View>
  );
}

// Simple line trend display
function TrendLine({ data }: { data: number[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data, 1);
  return (
    <View style={lineStyles.container}>
      {data.map((val, i) => (
        <View key={i} style={[lineStyles.point, {
          bottom: (val / max) * 40,
          left: `${(i / (data.length - 1)) * 90}%` as any,
          backgroundColor: i === data.length - 1 ? colors.electric.DEFAULT : 'rgba(255,102,0,0.5)',
          width: i === data.length - 1 ? 12 : 8,
          height: i === data.length - 1 ? 12 : 8,
          borderRadius: i === data.length - 1 ? 6 : 4,
        }]} />
      ))}
    </View>
  );
}

const donutStyles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 10,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  fillOverlay: {
    position: 'absolute', width: '100%', height: '100%',
  },
  inner: { alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  percent: { fontSize: 24, fontWeight: '900' },
  label: { color: colors.text.muted, fontSize: 10, fontWeight: '600' },
});

const barStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 80, paddingBottom: 20 },
  barWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
  barLabel: { color: colors.text.muted, fontSize: 10, fontWeight: '600' },
});

const lineStyles = StyleSheet.create({
  container: { height: 60, position: 'relative', marginVertical: 8 },
  point: { position: 'absolute' },
});

export function ProgressScreen() {
  const user = useAuthStore((s) => s.user);
  const { workouts, subscribe: subWorkouts } = useWorkoutStore();
  const {
    stats, heatmapData, personalRecords, weeklyInsights,
    subscribe: subProgress, computeInsights,
  } = useProgressStore();

  useEffect(() => {
    if (!user?.id) return;
    const unsubW = subWorkouts(user.id);
    const unsubP = subProgress(user.id);
    return () => { unsubW(); unsubP(); };
  }, [user?.id]);

  useEffect(() => {
    if (workouts.length > 0) computeInsights(workouts);
  }, [workouts]);

  const totalWorkouts = stats?.totalWorkouts ?? 0;
  const totalCalories = stats?.totalCalories ?? 0;
  const totalMinutes = stats?.totalMinutes ?? 0;
  const totalVolume = stats?.totalVolumeKg ?? 0;
  const streak = stats?.currentStreak ?? 0;

  // Generate weekly bar data from workouts
  const weeklyBarData = DAYS.map((_, i) => {
    const day = new Date();
    const offset = i - (day.getDay() === 0 ? 6 : day.getDay() - 1);
    const target = new Date(day);
    target.setDate(day.getDate() + offset);
    const dateStr = target.toISOString().slice(0, 10);
    return workouts.filter((w) => w.completedAt.startsWith(dateStr)).length;
  });

  // Trend data: last 6 workouts volume or count
  const trendData = workouts.slice(0, 6).map((_, i) => i + 1).reverse();

  const completionPercent = Math.min(100, (streak / 7) * 100) || (totalWorkouts > 0 ? 90 : 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.DEFAULT} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Progress</Text>
            <Text style={styles.subtitle}>Track your fitness journey</Text>
          </View>
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>🔥 {streak} day streak</Text>
          </View>
        </View>

        {/* All-time stats grid */}
        <Text style={styles.sectionLabel}>ALL-TIME STATS</Text>
        <View style={styles.statsGrid}>
          {[
            { label: 'Workouts', value: totalWorkouts, color: colors.electric.DEFAULT, icon: '💪' },
            { label: 'Calories', value: `${(totalCalories / 1000).toFixed(1)}k`, color: '#FF3B5C', icon: '🔥' },
            { label: 'Minutes', value: totalMinutes, color: colors.neon.DEFAULT, icon: '⏱️' },
            { label: 'Volume', value: `${(totalVolume / 1000).toFixed(1)}k`, color: colors.violet.DEFAULT, icon: '📦' },
          ].map((stat) => (
            <GlassCard key={stat.label} accent="none" style={styles.statCard} padding={14}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </GlassCard>
          ))}
        </View>

        {/* Consistency and Completion */}
        <Text style={styles.sectionLabel}>CONSISTENCY & FREQUENCY</Text>
        <GlassCard accent="orange" glow style={styles.consistencyCard}>
          <View style={styles.consistencyRow}>
            {/* Donut chart */}
            <DonutChart percent={completionPercent} color={colors.electric.DEFAULT} />

            {/* Bar chart */}
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={styles.consistencyLabel}>This Week</Text>
              <MiniBarChart data={weeklyBarData} />
            </View>
          </View>

          {/* Trend line */}
          <View style={styles.trendSection}>
            <Text style={styles.trendLabel}>Workout Trend</Text>
            <TrendLine data={trendData.length > 0 ? trendData : [1, 2, 1, 3, 2, 4]} />
          </View>
        </GlassCard>

        {/* Weekly insight */}
        {weeklyInsights && (
          <>
            <Text style={styles.sectionLabel}>WEEKLY INSIGHT</Text>
            <GlassCard accent={weeklyInsights.musclesNeglectedThisWeek.length === 0 ? 'green' : 'orange'} glow style={{ marginBottom: 16 }}>
              <Text style={styles.insightText}>{weeklyInsights.recommendation}</Text>
              <View style={styles.insightRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.insightSub}>This week: {weeklyInsights.workoutsThisWeek} workouts</Text>
                  <Text style={styles.insightSub}>Volume: {weeklyInsights.totalVolumeThisWeek} reps</Text>
                </View>
                <View style={styles.muscleChips}>
                  {weeklyInsights.musclesWorkedThisWeek.slice(0, 3).map((m) => (
                    <View key={m} style={styles.muscleChip}>
                      <Text style={styles.muscleChipText}>{m}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </GlassCard>
          </>
        )}

        {/* Muscle Heatmap */}
        <Text style={[styles.sectionLabel, { marginTop: 4 }]}>STRENGTH HEATMAP</Text>
        <GlassCard accent="orange">
          <MuscleHeatmap data={heatmapData} />
        </GlassCard>

        {/* Volume Bars */}
        {heatmapData.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>MUSCLE VOLUME THIS WEEK</Text>
            <GlassCard accent="none" style={{ marginBottom: 16 }}>
              <View style={{ gap: 14 }}>
                {heatmapData
                  .filter((d) => d.intensity > 0)
                  .sort((a, b) => b.intensity - a.intensity)
                  .slice(0, 6)
                  .map((d) => (
                    <ProgressBar
                      key={d.muscle}
                      label={d.label}
                      value={d.intensity * 10}
                      color={d.intensity >= 8 ? 'orange' : d.intensity >= 5 ? 'green' : 'blue'}
                      showPercent
                      height={6}
                    />
                  ))}
              </View>
            </GlassCard>
          </>
        )}

        {/* Personal Records */}
        {personalRecords.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: 4 }]}>PERSONAL RECORDS 🏆</Text>
            {personalRecords.slice(0, 5).map((pr) => (
              <GlassCard key={pr.exerciseId} accent="none" style={{ marginBottom: 8 }}>
                <View style={styles.prRow}>
                  <View style={styles.prIcon}>
                    <Text style={{ fontSize: 20 }}>🏆</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.prName}>{pr.exerciseName}</Text>
                    <Text style={styles.prSub}>
                      Best volume: {pr.bestVolume} · {pr.bestSet.reps} reps
                      {pr.bestSet.weight ? ` @ ${pr.bestSet.weight}kg` : ' (bodyweight)'}
                    </Text>
                  </View>
                  <Text style={styles.prDate}>
                    {new Date(pr.achievedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              </GlassCard>
            ))}
          </>
        )}

        {/* Empty state */}
        {totalWorkouts === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No data yet</Text>
            <Text style={styles.emptyText}>
              Log your first workout to see real-time progress, heatmaps, and personal records here.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background.DEFAULT },
  scroll: { flex: 1 },
  content: { padding: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { color: colors.text.primary, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.text.muted, fontSize: 13, marginTop: 2 },
  streakPill: {
    backgroundColor: colors.electric.subtle, borderRadius: 20,
    borderWidth: 1, borderColor: colors.electric.DEFAULT,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  streakText: { color: colors.electric.DEFAULT, fontWeight: '700', fontSize: 13 },

  sectionLabel: {
    color: colors.text.muted, fontSize: 10, fontWeight: '700',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10,
  },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { width: '47%', alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 24 },
  statValue: { fontSize: 24, fontWeight: '900' },
  statLabel: { color: colors.text.muted, fontSize: 11 },

  consistencyCard: { marginBottom: 20, gap: 16 },
  consistencyRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  consistencyLabel: { color: colors.text.secondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  trendSection: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 14, gap: 6 },
  trendLabel: { color: colors.text.muted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },

  insightText: { color: colors.text.primary, fontWeight: '600', fontSize: 14, marginBottom: 10 },
  insightRow: { flexDirection: 'row', alignItems: 'flex-end' },
  insightSub: { color: colors.text.muted, fontSize: 12 },
  muscleChips: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  muscleChip: {
    backgroundColor: colors.electric.subtle, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  muscleChipText: { color: colors.electric.DEFAULT, fontSize: 10, fontWeight: '600' },

  prRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  prIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(255,215,0,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  prName: { color: colors.text.primary, fontWeight: '700', fontSize: 14 },
  prSub: { color: colors.text.muted, fontSize: 12, marginTop: 2 },
  prDate: { color: colors.text.muted, fontSize: 11 },

  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { color: colors.text.primary, fontWeight: '700', fontSize: 20 },
  emptyText: { color: colors.text.muted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
});

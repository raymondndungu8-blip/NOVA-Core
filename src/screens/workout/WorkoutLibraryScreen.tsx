/**
 * NOVA Core — Workout Library Screen (Orange Edition)
 * Matches Stitch design: "Choose Your Workout" header, Gym/Home tabs,
 * search bar, category filter chips, exercise cards with duration tags.
 */

import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../../navigation/types';
import {
  EXERCISES, type Exercise, type Category, type Difficulty,
} from '../../data/exercises';
import { colors } from '../../theme/colors';

type Nav = NativeStackNavigationProp<WorkoutStackParamList, 'WorkoutLibrary'>;

type WorkoutType = 'gym' | 'home';

const WORKOUT_TABS: { key: WorkoutType; label: string }[] = [
  { key: 'gym', label: 'Gym Workouts' },
  { key: 'home', label: 'Home Workouts' },
];

const CATEGORIES: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'strength', label: 'Strength' },
  { key: 'core', label: 'Core' },
  { key: 'cardio', label: 'Cardio' },
  { key: 'hiit', label: 'HIIT' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'mobility', label: 'Mobility' },
];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: colors.neon.DEFAULT,
  intermediate: colors.electric.DEFAULT,
  advanced: '#FF3B5C',
  elite: colors.violet.DEFAULT,
};

const DIFFICULTY_BADGE_BG: Record<Difficulty, string> = {
  beginner: 'rgba(0,255,136,0.15)',
  intermediate: 'rgba(255,102,0,0.15)',
  advanced: 'rgba(255,59,92,0.15)',
  elite: 'rgba(139,92,246,0.15)',
};

// Estimate duration based on category
function getDuration(e: Exercise): number {
  if (e.category === 'cardio') return 30;
  if (e.category === 'hiit') return 25;
  if (e.category === 'yoga' || e.category === 'mobility') return 40;
  return 45;
}

export function WorkoutLibraryScreen() {
  const navigation = useNavigation<Nav>();
  const [workoutType, setWorkoutType] = useState<WorkoutType>('gym');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');

  const filtered = useMemo(() => {
    return EXERCISES.filter((e) => {
      const matchCat = category === 'all' || e.category === category;
      const matchDiff = difficulty === 'all' || e.difficulty === difficulty;
      const matchType = workoutType === 'home'
        ? e.equipment.includes('none')
        : !e.equipment.includes('none') || e.category === 'strength';
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase())
        || e.muscles.some((m) => m.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchDiff && matchSearch && matchType;
    });
  }, [category, difficulty, search, workoutType]);

  const renderItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item.id })}
      activeOpacity={0.8}
    >
      {/* Card image area */}
      <View style={styles.cardImageArea}>
        <Text style={styles.cardImageEmoji}>🏋️</Text>
        {/* Difficulty badge overlay */}
        <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_BADGE_BG[item.difficulty] }]}>
          <Text style={[styles.diffBadgeText, { color: DIFFICULTY_COLORS[item.difficulty] }]}>
            {item.difficulty.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Card info */}
      <View style={styles.cardInfo}>
        <Text style={styles.exerciseName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.exerciseMuscles} numberOfLines={1}>
          {item.muscles.slice(0, 2).join(' · ')}
        </Text>
        <View style={styles.cardMeta}>
          <View style={styles.durationTag}>
            <Text style={styles.durationText}>⏱ {getDuration(item)} mins</Text>
          </View>
          {item.equipment.includes('none') && (
            <View style={styles.noEquipTag}>
              <Text style={styles.noEquipText}>No equipment</Text>
            </View>
          )}
          {item.caloriesPerMin && (
            <View style={styles.calTag}>
              <Text style={styles.calText}>🔥 ~{item.caloriesPerMin * getDuration(item)} kcal</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.DEFAULT} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Workout</Text>
        <Text style={styles.count}>{filtered.length} exercises</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search exercises..."
          placeholderTextColor={colors.text.muted}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Gym / Home Tabs */}
      <View style={styles.workoutTabRow}>
        {WORKOUT_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.workoutTab, workoutType === tab.key && styles.workoutTabActive]}
            onPress={() => setWorkoutType(tab.key)}
          >
            <Text style={[styles.workoutTabText, workoutType === tab.key && styles.workoutTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Chips */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        renderItem={({ item: c }) => (
          <TouchableOpacity
            style={[styles.chip, category === c.key && styles.chipActive]}
            onPress={() => setCategory(c.key as Category | 'all')}
          >
            <Text style={[styles.chipText, category === c.key && styles.chipTextActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Difficulty filter */}
      <View style={styles.diffRow}>
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((d) => (
          <TouchableOpacity
            key={d}
            style={[
              styles.diffChip,
              difficulty === d && {
                borderColor: d === 'all' ? colors.electric.DEFAULT : DIFFICULTY_COLORS[d as Difficulty],
                backgroundColor: d === 'all' ? colors.electric.subtle : DIFFICULTY_BADGE_BG[d as Difficulty],
              },
            ]}
            onPress={() => setDifficulty(d)}
          >
            <Text style={[
              styles.diffChipText,
              difficulty === d && { color: d === 'all' ? colors.electric.DEFAULT : DIFFICULTY_COLORS[d as Difficulty] },
            ]}>
              {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Exercise List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No exercises match your filters.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background.DEFAULT },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10,
  },
  title: { color: colors.text.primary, fontSize: 24, fontWeight: '800' },
  count: { color: colors.electric.DEFAULT, fontWeight: '700', fontSize: 13 },

  // Search
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.glass.DEFAULT,
    marginHorizontal: 20, marginBottom: 14,
    borderRadius: 50,
    borderWidth: 1, borderColor: colors.glass.neutralBorder,
    paddingHorizontal: 18, gap: 8,
  },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, color: colors.text.primary, fontSize: 14, paddingVertical: 13 },

  // Gym / Home tabs
  workoutTabRow: {
    flexDirection: 'row',
    marginHorizontal: 20, marginBottom: 14,
    backgroundColor: colors.background.card,
    borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: 4, gap: 4,
  },
  workoutTab: {
    flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10,
  },
  workoutTabActive: {
    backgroundColor: colors.electric.DEFAULT,
    shadowColor: colors.electric.glow,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  workoutTabText: { color: colors.text.muted, fontWeight: '600', fontSize: 14 },
  workoutTabTextActive: { color: '#FFFFFF', fontWeight: '800' },

  // Category chips
  chips: { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  chip: {
    backgroundColor: colors.glass.DEFAULT, borderRadius: 20,
    borderWidth: 1, borderColor: colors.glass.neutralBorder,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  chipActive: { backgroundColor: colors.electric.subtle, borderColor: colors.electric.DEFAULT },
  chipText: { color: colors.text.muted, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: colors.electric.DEFAULT, fontWeight: '700' },

  // Difficulty filter
  diffRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  diffChip: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  diffChipText: { color: colors.text.muted, fontSize: 12, fontWeight: '600' },

  // Exercise list
  list: { paddingHorizontal: 20, gap: 14, paddingBottom: 40 },

  // Exercise card
  exerciseCard: {
    backgroundColor: colors.background.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  cardImageArea: {
    height: 140,
    backgroundColor: 'rgba(255,102,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  cardImageEmoji: { fontSize: 56 },
  diffBadge: {
    position: 'absolute',
    top: 10, left: 12,
    borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  diffBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  cardInfo: { padding: 14, gap: 6 },
  exerciseName: { color: colors.text.primary, fontWeight: '700', fontSize: 16 },
  exerciseMuscles: { color: colors.text.muted, fontSize: 13 },
  cardMeta: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  durationTag: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  durationText: { color: colors.text.secondary, fontSize: 12, fontWeight: '600' },
  noEquipTag: {
    backgroundColor: colors.neon.subtle,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  noEquipText: { color: colors.neon.DEFAULT, fontSize: 12, fontWeight: '600' },
  calTag: {
    backgroundColor: colors.electric.subtle,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  calText: { color: colors.electric.DEFAULT, fontSize: 12, fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyText: { color: colors.text.muted, fontSize: 14 },
});

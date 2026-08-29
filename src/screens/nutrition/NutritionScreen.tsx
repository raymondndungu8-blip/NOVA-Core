/**
 * NOVA Core — Nutrition Hub (Orange Edition)
 * Matches Stitch design: macro cards, hydration tracker, smart suggestion card,
 * horizontal calendar strip, glassmorphic layout.
 */

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../../components/GlassCard';
import { colors } from '../../theme/colors';

const GLASSES_GOAL = 8;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const today = new Date().getDay(); // 0 = Sun
const todayIndex = today === 0 ? 6 : today - 1;

const MEALS = [
  { name: 'Avocado Quinoa Power Bowl', cal: 420, protein: 22, carbs: 48, fat: 18, emoji: '🥗', tag: 'SMART PICK' },
  { name: 'Grilled Chicken & Rice', cal: 380, protein: 42, carbs: 36, fat: 8, emoji: '🍗', tag: null },
  { name: 'Greek Yogurt + Berries', cal: 180, protein: 14, carbs: 22, fat: 4, emoji: '🫐', tag: null },
];

export function NutritionScreen() {
  const [glasses, setGlasses] = useState(4);
  const [activeDay, setActiveDay] = useState(todayIndex);
  const [loggedMeals, setLoggedMeals] = useState<number[]>([0]); // first meal logged by default

  const totalCal = loggedMeals.reduce((sum, i) => sum + MEALS[i].cal, 0);
  const totalProtein = loggedMeals.reduce((sum, i) => sum + MEALS[i].protein, 0);
  const totalCarbs = loggedMeals.reduce((sum, i) => sum + MEALS[i].carbs, 0);
  const totalFat = loggedMeals.reduce((sum, i) => sum + MEALS[i].fat, 0);

  const toggleMeal = (i: number) => {
    setLoggedMeals((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.DEFAULT} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Nutrition Hub</Text>
            <Text style={styles.subtitle}>Track macros & fuel performance</Text>
          </View>
          <View style={styles.calBadge}>
            <Text style={styles.calBadgeValue}>{totalCal}</Text>
            <Text style={styles.calBadgeLabel}>kcal</Text>
          </View>
        </View>

        {/* Calendar Strip */}
        <View style={styles.calendarStrip}>
          {DAYS.map((day, i) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayBtn, activeDay === i && styles.dayBtnActive]}
              onPress={() => setActiveDay(i)}
            >
              <Text style={[styles.dayLabel, activeDay === i && styles.dayLabelActive]}>{day}</Text>
              <View style={[styles.dayDot, activeDay === i && styles.dayDotActive]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Macro Tracker */}
        <Text style={styles.sectionTitle}>Today's Macros</Text>
        <View style={styles.macroRow}>
          {[
            { label: 'Protein', value: totalProtein, unit: 'g', color: colors.electric.DEFAULT, bg: colors.electric.subtle },
            { label: 'Carbs', value: totalCarbs, unit: 'g', color: colors.neon.DEFAULT, bg: colors.neon.subtle },
            { label: 'Fats', value: totalFat, unit: 'g', color: colors.violet.DEFAULT, bg: colors.violet.subtle },
          ].map((m) => (
            <GlassCard key={m.label} accent="none" style={styles.macroCard} padding={14}>
              <View style={[styles.macroIcon, { backgroundColor: m.bg }]}>
                <Text style={{ fontSize: 18 }}>
                  {m.label === 'Protein' ? '🥩' : m.label === 'Carbs' ? '🌾' : '🥑'}
                </Text>
              </View>
              <Text style={[styles.macroValue, { color: m.color }]}>{m.value}{m.unit}</Text>
              <Text style={styles.macroLabel}>{m.label}</Text>
            </GlassCard>
          ))}
        </View>

        {/* Smart Suggestion */}
        <Text style={styles.sectionTitle}>🌟 Smart Suggestion</Text>
        <GlassCard accent="orange" glow style={styles.featuredCard}>
          <View style={styles.featuredLeft}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>AI PICK</Text>
            </View>
            <Text style={styles.featuredTitle}>Avocado Quinoa{'\n'}Power Bowl</Text>
            <Text style={styles.featuredSub}>420 kcal · 22g protein · 48g carbs</Text>
            <View style={styles.featuredTags}>
              <View style={styles.smallTag}><Text style={styles.smallTagText}>🌱 Plant-based</Text></View>
              <View style={styles.smallTag}><Text style={styles.smallTagText}>⚡ High energy</Text></View>
            </View>
          </View>
          <Text style={styles.featuredEmoji}>🥗</Text>
        </GlassCard>

        {/* Meals */}
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        {MEALS.map((meal, i) => (
          <GlassCard
            key={meal.name}
            accent="none"
            style={styles.mealCard}
            onPress={() => toggleMeal(i)}
          >
            <View style={styles.mealRow}>
              <View style={styles.mealEmoji}>
                <Text style={{ fontSize: 28 }}>{meal.emoji}</Text>
              </View>
              <View style={styles.mealInfo}>
                {meal.tag && (
                  <Text style={styles.mealTag}>{meal.tag}</Text>
                )}
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealMacros}>
                  {meal.cal} kcal · P:{meal.protein}g · C:{meal.carbs}g · F:{meal.fat}g
                </Text>
              </View>
              <View style={[styles.mealCheck, loggedMeals.includes(i) && styles.mealCheckActive]}>
                {loggedMeals.includes(i) && <Text style={styles.mealCheckIcon}>✓</Text>}
              </View>
            </View>
          </GlassCard>
        ))}

        {/* Log meal button */}
        <TouchableOpacity style={styles.logBtn} activeOpacity={0.85}>
          <Text style={styles.logBtnText}>+ Log a Meal</Text>
        </TouchableOpacity>

        {/* Hydration */}
        <Text style={styles.sectionTitle}>💧 Hydration</Text>
        <GlassCard accent="none" style={styles.hydrationCard}>
          <View style={styles.hydrationHeader}>
            <Text style={styles.hydrationTitle}>Water Intake</Text>
            <Text style={styles.hydrationValue}>
              <Text style={[styles.hydrationCount, { color: colors.electric.DEFAULT }]}>{glasses}</Text>
              <Text style={styles.hydrationGoal}>/{GLASSES_GOAL} glasses</Text>
            </Text>
          </View>
          <View style={styles.bars}>
            {Array.from({ length: GLASSES_GOAL }).map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.bar, i < glasses && styles.barFilled]}
                onPress={() => setGlasses(i < glasses ? i : Math.min(GLASSES_GOAL, i + 1))}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.addWaterBtn}
            onPress={() => setGlasses((g) => Math.min(GLASSES_GOAL, g + 1))}
          >
            <Text style={styles.addWaterText}>+ Add Glass</Text>
          </TouchableOpacity>
        </GlassCard>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background.DEFAULT },
  content: { padding: 20, paddingBottom: 40 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { color: colors.text.primary, fontSize: 24, fontWeight: '800' },
  subtitle: { color: colors.text.muted, fontSize: 13, marginTop: 2 },
  calBadge: {
    backgroundColor: colors.electric.subtle,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8,
    alignItems: 'center',
  },
  calBadgeValue: { color: colors.electric.DEFAULT, fontSize: 20, fontWeight: '900' },
  calBadgeLabel: { color: colors.text.muted, fontSize: 10, fontWeight: '600' },

  // Calendar
  calendarStrip: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: 12, marginBottom: 20,
  },
  dayBtn: { alignItems: 'center', gap: 6, paddingHorizontal: 4, paddingVertical: 4, borderRadius: 8, flex: 1 },
  dayBtnActive: { backgroundColor: colors.electric.subtle },
  dayLabel: { color: colors.text.muted, fontSize: 11, fontWeight: '600' },
  dayLabelActive: { color: colors.electric.DEFAULT, fontWeight: '800' },
  dayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'transparent' },
  dayDotActive: { backgroundColor: colors.electric.DEFAULT },

  sectionTitle: { color: colors.text.primary, fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 4 },

  // Macros
  macroRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  macroCard: { flex: 1, alignItems: 'center', gap: 6 },
  macroIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  macroValue: { fontSize: 20, fontWeight: '900' },
  macroLabel: { color: colors.text.muted, fontSize: 11, fontWeight: '600' },

  // Featured
  featuredCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  featuredLeft: { flex: 1, gap: 8 },
  featuredBadge: {
    backgroundColor: colors.electric.subtle,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  featuredBadgeText: { color: colors.electric.DEFAULT, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  featuredTitle: { color: colors.text.primary, fontSize: 18, fontWeight: '800', lineHeight: 24 },
  featuredSub: { color: colors.text.muted, fontSize: 12 },
  featuredTags: { flexDirection: 'row', gap: 6 },
  smallTag: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  smallTagText: { color: colors.text.secondary, fontSize: 11 },
  featuredEmoji: { fontSize: 56 },

  // Meals
  mealCard: { marginBottom: 10 },
  mealRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mealEmoji: {
    width: 52, height: 52, borderRadius: 12,
    backgroundColor: colors.glass.neutral,
    alignItems: 'center', justifyContent: 'center',
  },
  mealInfo: { flex: 1, gap: 3 },
  mealTag: { color: colors.electric.DEFAULT, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  mealName: { color: colors.text.primary, fontWeight: '700', fontSize: 14 },
  mealMacros: { color: colors.text.muted, fontSize: 11 },
  mealCheck: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  mealCheckActive: {
    backgroundColor: colors.electric.DEFAULT,
    borderColor: colors.electric.DEFAULT,
  },
  mealCheckIcon: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },

  logBtn: {
    borderWidth: 1.5,
    borderColor: colors.electric.DEFAULT,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  logBtnText: { color: colors.electric.DEFAULT, fontWeight: '700', fontSize: 15 },

  // Hydration
  hydrationCard: { gap: 14 },
  hydrationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hydrationTitle: { color: colors.text.primary, fontWeight: '700', fontSize: 16 },
  hydrationValue: {},
  hydrationCount: { fontSize: 22, fontWeight: '900' },
  hydrationGoal: { color: colors.text.muted, fontSize: 14, fontWeight: '600' },
  bars: { flexDirection: 'row', gap: 6 },
  bar: {
    flex: 1, height: 10, borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  barFilled: { backgroundColor: colors.electric.DEFAULT },
  addWaterBtn: {
    backgroundColor: colors.electric.subtle,
    borderRadius: 50, paddingVertical: 12,
    alignItems: 'center',
  },
  addWaterText: { color: colors.electric.DEFAULT, fontWeight: '700', fontSize: 14 },
});

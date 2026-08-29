/**
 * NOVA Core — Progress Intelligence Service
 * Analyzes workout history and dynamically suggests next progressions.
 * Powers the "smart recommendation" system on the dashboard.
 */

import { getExerciseById, getProgression, EXERCISES, type Exercise } from '../data/exercises';
import type { WorkoutLog, ProgressStats } from './firestoreService';

// How many times you need to complete an exercise to unlock progression suggestion
const PROGRESSION_THRESHOLD = 5;

export interface ProgressionSuggestion {
    exercise: Exercise;
    reason: string;
    urgency: 'ready' | 'almost' | 'keep_going';
    completionsToUnlock?: number;
}

export interface WeeklyInsight {
    musclesWorkedThisWeek: string[];
    musclesNeglectedThisWeek: string[];
    totalVolumeThisWeek: number;
    workoutsThisWeek: number;
    recommendation: string;
}

// ─────────────────────────────────────────────────────────────
// PROGRESSION INTELLIGENCE
// ─────────────────────────────────────────────────────────────

/**
 * Given a user's recent workout logs, returns smart progression suggestions.
 * The system counts how many times each exercise was completed;
 * once threshold is reached, it suggests the next progression.
 */
export function getProgressionSuggestions(
    workouts: WorkoutLog[],
    limit = 3,
): ProgressionSuggestion[] {
    // Count exercise completions
    const completionCount: Record<string, number> = {};
    for (const w of workouts) {
        completionCount[w.exerciseId] = (completionCount[w.exerciseId] ?? 0) + 1;
    }

    const suggestions: ProgressionSuggestion[] = [];

    for (const [exerciseId, count] of Object.entries(completionCount)) {
        const nextExercise = getProgression(exerciseId);
        if (!nextExercise) continue;

        const currentExercise = getExerciseById(exerciseId);
        if (!currentExercise) continue;

        if (count >= PROGRESSION_THRESHOLD) {
            suggestions.push({
                exercise: nextExercise,
                reason: `You've done ${count} ${currentExercise.name} sessions — time to level up!`,
                urgency: 'ready',
            });
        } else if (count >= PROGRESSION_THRESHOLD - 2) {
            suggestions.push({
                exercise: nextExercise,
                reason: `${PROGRESSION_THRESHOLD - count} more ${currentExercise.name} sessions to unlock ${nextExercise.name}`,
                urgency: 'almost',
                completionsToUnlock: PROGRESSION_THRESHOLD - count,
            });
        } else {
            suggestions.push({
                exercise: nextExercise,
                reason: `Stay consistent with ${currentExercise.name} to unlock ${nextExercise.name}`,
                urgency: 'keep_going',
                completionsToUnlock: PROGRESSION_THRESHOLD - count,
            });
        }
    }

    // Sort: ready > almost > keep_going
    const urgencyOrder = { ready: 0, almost: 1, keep_going: 2 };
    suggestions.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

    return suggestions.slice(0, limit);
}

// ─────────────────────────────────────────────────────────────
// WEEKLY INSIGHTS
// ─────────────────────────────────────────────────────────────

/** Returns insight on muscle balance based on this week's workouts */
export function getWeeklyInsights(
    workouts: WorkoutLog[],
    stats: ProgressStats | null,
): WeeklyInsight {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const weekWorkouts = workouts.filter((w) => w.completedAt >= oneWeekAgo);

    // Muscles worked this week
    const worked = new Set<string>();
    let totalVolume = 0;

    for (const w of weekWorkouts) {
        const ex = getExerciseById(w.exerciseId);
        if (ex) {
            worked.add(ex.muscleGroup);
        }
        totalVolume += w.totalVolume;
    }

    // All major muscle groups
    const allGroups = ['chest', 'back', 'shoulders', 'legs', 'core', 'glutes'];
    const neglected = allGroups.filter((g) => !worked.has(g));

    // Recommendation
    let recommendation = '';
    if (neglected.length === 0) {
        recommendation = '🏆 Perfect — you hit every major muscle group this week!';
    } else if (neglected.length <= 2) {
        recommendation = `💡 Add a ${neglected[0]} workout to complete your weekly balance.`;
    } else {
        recommendation = `⚡ Start with a ${neglected[0]} and ${neglected[1]} day this week.`;
    }

    return {
        musclesWorkedThisWeek: Array.from(worked),
        musclesNeglectedThisWeek: neglected,
        totalVolumeThisWeek: totalVolume,
        workoutsThisWeek: weekWorkouts.length,
        recommendation,
    };
}

// ─────────────────────────────────────────────────────────────
// CALORIE CALCULATION
// ─────────────────────────────────────────────────────────────

/** Estimates calories burned based on MET value, weight (kg), and duration (min) */
export function estimateCalories(
    exerciseId: string,
    durationMinutes: number,
    bodyWeightKg = 75,
): number {
    const ex = getExerciseById(exerciseId);
    const mets = ex?.mets ?? 6;
    // METs × weight(kg) × time(hours) = kcal
    return Math.round(mets * bodyWeightKg * (durationMinutes / 60));
}

/** Calculates total volume for a session (reps × weight, or reps for BW) */
export function calculateTotalVolume(
    sets: { reps: number; weight?: number }[],
): number {
    return sets.reduce((sum, s) => sum + s.reps * (s.weight ?? 1), 0);
}

// ─────────────────────────────────────────────────────────────
// HEATMAP DATA
// ─────────────────────────────────────────────────────────────

export interface MuscleHeatmapData {
    muscle: string;
    intensity: number; // 0–10 scale
    label: string;
}

const muscleLabels: Record<string, string> = {
    chest: 'Chest',
    back: 'Back',
    shoulders: 'Shoulders',
    biceps: 'Biceps',
    triceps: 'Triceps',
    legs: 'Legs',
    glutes: 'Glutes',
    core: 'Core',
    calves: 'Calves',
    full_body: 'Full Body',
};

/** Converts weekly heatmap counts into 0–10 intensity scores for rendering */
export function buildHeatmapData(
    weeklyHeatmap: Record<string, number>,
): MuscleHeatmapData[] {
    const counts = Object.values(weeklyHeatmap);
    const max = Math.max(...counts, 1);

    return Object.entries(weeklyHeatmap).map(([muscle, count]) => ({
        muscle,
        intensity: Math.round((count / max) * 10),
        label: muscleLabels[muscle] ?? muscle,
    }));
}

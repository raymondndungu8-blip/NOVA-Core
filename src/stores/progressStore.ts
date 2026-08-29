/**
 * NOVA Core — Progress Store (Zustand + Firebase)
 * Real-time progress stats, heatmap data, and progression suggestions.
 * Auto-updates dashboard the moment a workout is logged.
 */

import { create } from 'zustand';
import {
    subscribeToProgressStats,
    subscribeToPersonalRecords,
    type ProgressStats,
    type ExercisePR,
} from '../services/firestoreService';
import {
    getProgressionSuggestions,
    getWeeklyInsights,
    buildHeatmapData,
    type ProgressionSuggestion,
    type WeeklyInsight,
    type MuscleHeatmapData,
} from '../services/progressService';
import type { WorkoutLog } from '../services/firestoreService';

interface ProgressState {
    stats: ProgressStats | null;
    personalRecords: ExercisePR[];
    heatmapData: MuscleHeatmapData[];
    progressionSuggestions: ProgressionSuggestion[];
    weeklyInsights: WeeklyInsight | null;
    isLoading: boolean;

    // Subscribe to real-time updates
    subscribe: (uid: string) => () => void;

    // Called after workouts load so suggestions can be computed
    computeInsights: (workouts: WorkoutLog[]) => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
    stats: null,
    personalRecords: [],
    heatmapData: [],
    progressionSuggestions: [],
    weeklyInsights: null,
    isLoading: false,

    subscribe: (uid: string) => {
        set({ isLoading: true });

        // Subscribe to aggregate stats
        const unsubStats = subscribeToProgressStats(uid, (stats) => {
            const heatmapData = stats ? buildHeatmapData(stats.weeklyMuscleHeatmap ?? {}) : [];
            set({ stats, heatmapData, isLoading: false });
        });

        // Subscribe to personal records
        const unsubPRs = subscribeToPersonalRecords(uid, (prs) => {
            set({ personalRecords: prs });
        });

        // Return cleanup function
        return () => {
            unsubStats();
            unsubPRs();
        };
    },

    computeInsights: (workouts: WorkoutLog[]) => {
        const { stats } = get();
        const suggestions = getProgressionSuggestions(workouts, 3);
        const insights = getWeeklyInsights(workouts, stats);
        set({ progressionSuggestions: suggestions, weeklyInsights: insights });
    },
}));

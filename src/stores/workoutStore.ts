/**
 * NOVA Core — Workout Store (Zustand + Firebase)
 * Real-time workout state powered by Firestore listeners.
 * Offline persistence handled automatically by Firebase config.
 */

import { create } from 'zustand';
import {
    subscribeToUserWorkouts,
    logWorkout,
    type WorkoutLog,
    type WorkoutSet,
} from '../services/firestoreService';
import { estimateCalories, calculateTotalVolume } from '../services/progressService';
import { logger } from '../utils/logger';

interface WorkoutState {
    workouts: WorkoutLog[];
    isLoading: boolean;
    error: string | null;
    // Active session state
    activeSession: ActiveSession | null;

    // Actions
    subscribe: (uid: string) => () => void;
    startSession: (exerciseId: string, exerciseName: string) => void;
    addSet: (set: WorkoutSet) => void;
    finishSession: (uid: string, durationMinutes: number, notes?: string) => Promise<void>;
    cancelSession: () => void;
    clearError: () => void;
}

export interface ActiveSession {
    exerciseId: string;
    exerciseName: string;
    sets: WorkoutSet[];
    startTime: number;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
    workouts: [],
    isLoading: false,
    error: null,
    activeSession: null,

    /** Subscribe to real-time Firestore updates for this user's workouts */
    subscribe: (uid: string) => {
        set({ isLoading: true });
        const unsubscribe = subscribeToUserWorkouts(
            uid,
            (workouts) => {
                set({ workouts, isLoading: false });
            },
            20,
            (err) => {
                // Firestore real-time listener failed (permissions, network, quota, etc.)
                logger.error('workoutStore.subscribe', err, { uid });
                set({
                    error: 'Could not load workouts. Check your connection.',
                    isLoading: false,
                });
            },
        );
        return unsubscribe;
    },

    startSession: (exerciseId, exerciseName) => {
        set({
            activeSession: {
                exerciseId,
                exerciseName,
                sets: [],
                startTime: Date.now(),
            },
        });
    },

    addSet: (newSet) => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({
            activeSession: {
                ...activeSession,
                sets: [...activeSession.sets, newSet],
            },
        });
    },

    finishSession: async (uid, durationMinutes, notes) => {
        const { activeSession } = get();
        if (!activeSession || activeSession.sets.length === 0) return;

        set({ isLoading: true, error: null });
        try {
            const totalVolume = calculateTotalVolume(activeSession.sets);
            const caloriesBurned = estimateCalories(
                activeSession.exerciseId,
                durationMinutes,
            );

            const log: WorkoutLog = {
                userId: uid,
                exerciseId: activeSession.exerciseId,
                exerciseName: activeSession.exerciseName,
                sets: activeSession.sets,
                durationMinutes,
                caloriesBurned,
                totalVolume,
                completedAt: new Date().toISOString(),
                notes,
            };

            await logWorkout(log);
            set({ activeSession: null, isLoading: false });
        } catch (err: unknown) {
            logger.error('workoutStore.finishSession', err, {
                uid,
                durationMinutes,
                exerciseId: activeSession.exerciseId,
                exerciseName: activeSession.exerciseName,
                setsCount: activeSession.sets.length,
            });
            set({ error: 'Failed to save workout. Please try again.', isLoading: false });
        }
    },

    cancelSession: () => set({ activeSession: null }),

    clearError: () => set({ error: null }),
}));

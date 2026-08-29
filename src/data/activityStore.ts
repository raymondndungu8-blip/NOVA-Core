/**
 * NOVA Core — Legacy Activity Store
 * Kept for backward compatibility during refactor.
 * The real data now comes from Firebase via workoutStore + progressStore.
 */

import { create } from 'zustand';

interface ActivityState {
  workouts: any[];
  dailyGoal: { workouts: number; hydration: number };
  load: () => void;
}

/** @deprecated Use useWorkoutStore and useProgressStore instead */
export const useActivityStore = create<ActivityState>(() => ({
  workouts: [],
  dailyGoal: { workouts: 4, hydration: 8 },
  load: () => { },
}));

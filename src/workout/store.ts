import { create } from 'zustand';

interface WorkoutState {
    isScanning: boolean;
    setScanning: (scanning: boolean) => void;
    workoutType: string | null;
    setWorkoutType: (type: string | null) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
    isScanning: false,
    setScanning: (scanning) => set({ isScanning: scanning }),
    workoutType: null,
    setWorkoutType: (type) => set({ workoutType: type }),
}));

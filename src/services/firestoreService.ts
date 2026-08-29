/**
 * NOVA Core — Firestore Service
 * Handles all database reads/writes with real-time listeners.
 * Uses offline persistence (enabled in firebase/config.ts) automatically.
 */

import { logger } from '../utils/logger';

import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    increment,
    Timestamp,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface WorkoutLog {
    id?: string;
    userId: string;
    exerciseId: string;
    exerciseName: string;
    sets: WorkoutSet[];
    durationMinutes: number;
    caloriesBurned: number;
    totalVolume: number;       // sum of (reps × weight) or reps for bodyweight
    completedAt: string;       // ISO string
    notes?: string;
    createdAt?: Timestamp;
}

export interface WorkoutSet {
    reps: number;
    weight?: number;           // kg  (0 for bodyweight)
    duration?: number;         // seconds (for holds/cardio)
    rpe?: number;              // Rate of Perceived Exertion 1–10
}

export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    photoUrl?: string;
    fitnessGoal?: 'lose_fat' | 'build_muscle' | 'improve_endurance' | 'general_fitness';
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    weeklyGoal?: number;       // # workouts per week
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface ProgressStats {
    uid: string;
    totalWorkouts: number;
    totalVolumeKg: number;
    totalCalories: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    lastWorkoutDate?: string;
    // heatmap: map of muscle group → times trained this week
    weeklyMuscleHeatmap: Record<string, number>;
    updatedAt?: Timestamp;
}

export interface ExercisePR {
    exerciseId: string;
    exerciseName: string;
    bestVolume: number;        // Best single-session total volume
    bestSet: WorkoutSet;       // Best single set
    achievedAt: string;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION REFERENCES
// ─────────────────────────────────────────────────────────────

const usersCol = () => collection(db, 'users');
const workoutsCol = () => collection(db, 'workouts');
const statsCol = () => collection(db, 'stats');
const prsCol = () => collection(db, 'personalRecords');

// ─────────────────────────────────────────────────────────────
// USER PROFILE
// ─────────────────────────────────────────────────────────────

export async function createOrUpdateUserProfile(profile: UserProfile): Promise<void> {
    const ref = doc(usersCol(), profile.uid);
    await setDoc(ref, { ...profile, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(usersCol(), uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
}

export function subscribeToUserProfile(
    uid: string,
    callback: (profile: UserProfile | null) => void,
    onError?: (err: Error) => void,
): Unsubscribe {
    return onSnapshot(
        doc(usersCol(), uid),
        (snap) => {
            callback(snap.exists() ? (snap.data() as UserProfile) : null);
        },
        (err) => {
            logger.error('firestoreService.subscribeToUserProfile', err, { uid });
            onError?.(err);
        },
    );
}

// ─────────────────────────────────────────────────────────────
// WORKOUT LOGS
// ─────────────────────────────────────────────────────────────

export async function logWorkout(workout: WorkoutLog): Promise<string> {
    const docRef = await addDoc(workoutsCol(), {
        ...workout,
        createdAt: serverTimestamp(),
    });

    // After logging, update aggregate stats in parallel
    await Promise.all([
        updateProgressStats(workout),
        updatePersonalRecord(workout),
    ]);

    return docRef.id;
}

export async function getUserWorkouts(uid: string, limitCount = 20): Promise<WorkoutLog[]> {
    const q = query(
        workoutsCol(),
        where('userId', '==', uid),
        orderBy('completedAt', 'desc'),
        limit(limitCount),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkoutLog));
}

/** Real-time listener for user's workouts — auto-updates UI on any change */
export function subscribeToUserWorkouts(
    uid: string,
    callback: (workouts: WorkoutLog[]) => void,
    limitCount = 20,
    onError?: (err: Error) => void,
): Unsubscribe {
    const q = query(
        workoutsCol(),
        where('userId', '==', uid),
        orderBy('completedAt', 'desc'),
        limit(limitCount),
    );

    return onSnapshot(
        q,
        (snap) => {
            const workouts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkoutLog));
            callback(workouts);
        },
        (err) => {
            logger.error('firestoreService.subscribeToUserWorkouts', err, { uid, limitCount });
            onError?.(err);
        },
    );
}

export async function deleteWorkout(workoutId: string): Promise<void> {
    await deleteDoc(doc(workoutsCol(), workoutId));
}

// ─────────────────────────────────────────────────────────────
// PROGRESS STATS (aggregate — fast dashboard reads)
// ─────────────────────────────────────────────────────────────

async function updateProgressStats(workout: WorkoutLog): Promise<void> {
    const ref = doc(statsCol(), workout.userId);
    const existing = await getDoc(ref);

    // Calculate new streak
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = existing.exists() ? existing.data().lastWorkoutDate : null;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    let streakIncrement = 0;
    if (lastDate !== today) {
        // First workout today — check if yesterday had a workout (streak continues)
        streakIncrement = lastDate === yesterday ? 1 : 0;
    }

    // Muscle heatmap update — reset weekly on Sunday (or handled client-side)
    const muscleUpdate: Record<string, unknown> = {};
    if (workout.exerciseId) {
        muscleUpdate[`weeklyMuscleHeatmap.${workout.exerciseId}`] = increment(1);
    }

    if (!existing.exists()) {
        // First workout ever
        await setDoc(ref, {
            uid: workout.userId,
            totalWorkouts: 1,
            totalVolumeKg: workout.totalVolume,
            totalCalories: workout.caloriesBurned,
            totalMinutes: workout.durationMinutes,
            currentStreak: 1,
            longestStreak: 1,
            lastWorkoutDate: today,
            weeklyMuscleHeatmap: { [workout.exerciseId]: 1 },
            updatedAt: serverTimestamp(),
        });
    } else {
        await updateDoc(ref, {
            totalWorkouts: increment(1),
            totalVolumeKg: increment(workout.totalVolume),
            totalCalories: increment(workout.caloriesBurned),
            totalMinutes: increment(workout.durationMinutes),
            currentStreak: streakIncrement > 0
                ? increment(streakIncrement)
                : (lastDate === today ? existing.data().currentStreak : 1),
            lastWorkoutDate: today,
            ...muscleUpdate,
            updatedAt: serverTimestamp(),
        });
    }
}

/** Real-time listener for progress stats — powers heatmap and dashboard */
export function subscribeToProgressStats(
    uid: string,
    callback: (stats: ProgressStats | null) => void,
    onError?: (err: Error) => void,
): Unsubscribe {
    return onSnapshot(
        doc(statsCol(), uid),
        (snap) => {
            callback(snap.exists() ? (snap.data() as ProgressStats) : null);
        },
        (err) => {
            logger.error('firestoreService.subscribeToProgressStats', err, { uid });
            onError?.(err);
        },
    );
}

export async function getProgressStats(uid: string): Promise<ProgressStats | null> {
    const snap = await getDoc(doc(statsCol(), uid));
    return snap.exists() ? (snap.data() as ProgressStats) : null;
}

// ─────────────────────────────────────────────────────────────
// PERSONAL RECORDS
// ─────────────────────────────────────────────────────────────

async function updatePersonalRecord(workout: WorkoutLog): Promise<void> {
    const ref = doc(prsCol(), `${workout.userId}_${workout.exerciseId}`);
    const existing = await getDoc(ref);

    const bestSet = workout.sets.reduce(
        (best, set) => {
            const vol = set.reps * (set.weight ?? 1);
            return vol > (best.reps * (best.weight ?? 1)) ? set : best;
        },
        workout.sets[0],
    );

    if (!existing.exists() || workout.totalVolume > existing.data().bestVolume) {
        await setDoc(ref, {
            exerciseId: workout.exerciseId,
            exerciseName: workout.exerciseName,
            userId: workout.userId,
            bestVolume: workout.totalVolume,
            bestSet,
            achievedAt: workout.completedAt,
        });
    }
}

export async function getPersonalRecords(uid: string): Promise<ExercisePR[]> {
    const q = query(prsCol(), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ExercisePR);
}

export function subscribeToPersonalRecords(
    uid: string,
    callback: (prs: ExercisePR[]) => void,
    onError?: (err: Error) => void,
): Unsubscribe {
    const q = query(prsCol(), where('userId', '==', uid));
    return onSnapshot(
        q,
        (snap) => {
            callback(snap.docs.map((d) => d.data() as ExercisePR));
        },
        (err) => {
            logger.error('firestoreService.subscribeToPersonalRecords', err, { uid });
            onError?.(err);
        },
    );
}

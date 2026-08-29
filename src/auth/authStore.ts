/**
 * NOVA Core — Firebase Auth Store (Zustand)
 * Replaces the old AsyncStorage mock with real Firebase Authentication.
 * Listens to auth state changes in real time.
 */

import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  type User as FBUser,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createOrUpdateUserProfile } from '../services/firestoreService';
import { logger } from '../utils/logger';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  guestSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => void;
  clearError: () => void;

  // Internal
  setUser: (user: User | null) => void;
}

function mapFirebaseUser(u: FBUser): User {
  return {
    id: u.uid,
    email: u.email ?? '',
    displayName: u.displayName ?? u.email?.split('@')[0] ?? 'Athlete',
    photoUrl: u.photoURL ?? undefined,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  /** Called once from RootNavigator — sets up a persistent auth listener */
  hydrate: () => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (fbUser) => {
        // If we are currently a guest user, don't let a null firebase user override us
        const currentUser = get().user;
        if (currentUser?.id === 'guest-athlete') {
          return;
        }

        if (fbUser) {
          const user = mapFirebaseUser(fbUser);
          set({ user, isAuthenticated: true, isLoading: false });
        } else {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
      (err) => {
        // Auth listener itself failed — token revoked, network error, etc.
        logger.error('authStore.hydrate', err);
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication service unavailable. Please restart the app.',
        });
      },
    );
    // The listener is permanent for app lifetime, so we don't clean it up here
    return unsubscribe;
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will set the user automatically
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : err.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : 'Sign in failed. Please try again.';
      set({ error: msg, isLoading: false });
    }
  },

  signUp: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(fbUser, { displayName });

      // Create Firestore profile document
      await createOrUpdateUserProfile({
        uid: fbUser.uid,
        email: fbUser.email ?? email,
        displayName,
        fitnessGoal: 'general_fitness',
        experienceLevel: 'beginner',
        weeklyGoal: 4,
      });
    } catch (err: any) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists.'
        : err.code === 'auth/weak-password'
          ? 'Password must be at least 6 characters.'
          : 'Sign up failed. Please try again.';
      set({ error: msg, isLoading: false });
    }
  },

  guestSignIn: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock loading delay for realistic premium transition feel
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({
        user: { id: 'guest-athlete', email: 'guest@novacore.ai', displayName: 'Apex Athlete' },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: 'Failed to start guest session.', isLoading: false });
    }
  },

  signOut: async () => {
    try {
      const currentUser = get().user;
      if (currentUser && currentUser.id !== 'guest-athlete') {
        await fbSignOut(auth);
      }
      set({ user: null, isAuthenticated: false });
    } catch (err: unknown) {
      logger.error('authStore.signOut', err);
      // Still clear local state so the user isn't stuck in an authenticated view
      set({ user: null, isAuthenticated: false, error: 'Sign out failed — local session cleared.' });
    }
  },

  clearError: () => set({ error: null }),
}));

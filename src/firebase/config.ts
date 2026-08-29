/**
 * NOVA Core — Firebase Configuration
 * Initializes Firebase app with Firestore offline persistence
 * for fast loads even in poor connectivity.
 */

import { initializeApp, getApps } from 'firebase/app';
import {
    getFirestore,
    enableIndexedDbPersistence,
    connectFirestoreEmulator,
} from 'firebase/firestore';
import {
    getAuth,
    connectAuthEmulator,
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyCoWEtgOzohsNzxUhizQCmS0T1o_4J7o1Q',
    authDomain: 'studio-3978458396-4fd2c.firebaseapp.com',
    projectId: 'studio-3978458396-4fd2c',
    storageBucket: 'studio-3978458396-4fd2c.firebasestorage.app',
    messagingSenderId: '289531682786',
    appId: '1:289531682786:web:215e29b8e67eb0e59963bb',
};

// Initialize Firebase only once (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore instance
export const db = getFirestore(app);

// Auth instance
export const auth = getAuth(app);

// Enable offline persistence (Firestore caches data locally)
// This ensures the app works even with no internet connection
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open — offline only works in one tab at a time
        console.warn('[NOVA] Offline persistence failed: multiple tabs open');
    } else if (err.code === 'unimplemented') {
        // Browser doesn't support IndexedDB
        console.warn('[NOVA] Offline persistence not supported in this browser');
    }
});

export default app;

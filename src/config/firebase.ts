import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * Firebase Configuration
 * Initialize Firebase services for the application
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Check if running in dev mode without Firebase config
const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
const hasFirebaseConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_api_key';

if (hasFirebaseConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else if (!isDevMode) {
  console.error('Firebase configuration is missing. Please set up Firebase environment variables.');
}

export { app, auth, db, storage, isDevMode, hasFirebaseConfig };

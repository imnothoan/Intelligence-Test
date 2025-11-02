// Firebase Configuration Template
// Copy this file and fill in your Firebase project details

export const firebaseConfigExample = {
  // Get these values from Firebase Console > Project Settings > General > Your apps > Web app
  
  // API Key - Used to identify your Firebase project
  // Example: "AIzaSyBxxx-xxxxxxxxxxxxxxxxxxxxxxxx"
  apiKey: "YOUR_FIREBASE_API_KEY",
  
  // Auth Domain - Used for authentication
  // Example: "your-project.firebaseapp.com"
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  
  // Project ID - Your Firebase project identifier
  // Example: "my-intelligence-test"
  projectId: "YOUR_PROJECT_ID",
  
  // Storage Bucket - Used for file storage
  // Example: "your-project.appspot.com"
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  
  // Messaging Sender ID - Used for cloud messaging
  // Example: "123456789012"
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  
  // App ID - Your web app identifier
  // Example: "1:123456789012:web:abc123def456"
  appId: "YOUR_APP_ID",
  
  // Measurement ID (Optional) - Used for Google Analytics
  // Example: "G-XXXXXXXXXX"
  measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

// HOW TO GET THESE VALUES:
// 1. Go to https://console.firebase.google.com
// 2. Select your project
// 3. Click on the gear icon (⚙️) next to "Project Overview"
// 4. Go to "Project settings"
// 5. Scroll down to "Your apps" section
// 6. If you don't have a web app, click the </> icon to add one
// 7. Copy the config object values shown

// WHERE TO USE:
// Add these values to your .env file as:
/*
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
*/

// The actual implementation (src/config/firebase.ts) will read from environment variables:
/*
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
*/

// SECURITY NOTE:
// - Never commit actual Firebase credentials to version control
// - The .env file is already in .gitignore
// - Use environment variables for production deployment
// - Set up proper security rules in Firebase Console

// TROUBLESHOOTING:
// If you get "Firebase: Error (auth/invalid-api-key)":
// - Double check your API key is correct
// - Make sure there are no extra spaces or quotes
// - Verify the key is from the correct Firebase project

// If you get "Missing or insufficient permissions":
// - Check your Firestore security rules
// - Make sure you've enabled the services in Firebase Console
// - Verify user authentication is working

export default firebaseConfigExample;

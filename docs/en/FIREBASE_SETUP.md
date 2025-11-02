# Firebase Setup Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Create Firebase Project](#create-firebase-project)
3. [Configure Services](#configure-services)
4. [Get JSON Configuration](#get-json-configuration)
5. [Install in Application](#install-in-application)
6. [Setup Security Rules](#setup-security-rules)
7. [Test Connection](#test-connection)

## Introduction

Firebase is Google's free backend platform providing:
- **Authentication**: User authentication
- **Firestore Database**: NoSQL database
- **Hosting**: Web app deployment

**Important Note**: The system **DOES NOT** use Firebase Storage to save costs. All images (such as anti-cheat screenshots) are stored as base64 strings directly in Firestore Database.

**Free Tier (Spark Plan) includes:**
- 1 GB Firestore storage
- 50,000 reads/day, 20,000 writes/day
- Suitable for small to medium institutions

## Create Firebase Project

### Step 1: Access Firebase Console
1. Open browser and go to: https://console.firebase.google.com
2. Sign in with your Google account
3. Click **"Add project"**

### Step 2: Project Setup
1. **Project name**: Enter project name (e.g., `intelligence-test-school`)
2. **Google Analytics**: Can enable or disable (recommended: enable)
3. Select Analytics account if enabled
4. Click **"Create project"** and wait a few seconds

### Step 3: Register Web App
1. In Firebase Console, click the **Web** icon (`</>`)
2. Name your app (e.g., `Intelligence Test Web`)
3. **Don't** select Firebase Hosting yet
4. Click **"Register app"**

## Configure Services

### Authentication

1. In sidebar, select **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable methods:

**Email/Password:**
- Click on "Email/Password"
- Toggle "Enable"
- Click "Save"

**Google Sign-In (Optional):**
- Click on "Google"
- Toggle "Enable"
- Select support email
- Click "Save"

### Firestore Database

1. In sidebar, select **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - Test mode allows free read/write (30 days)
   - Will configure security rules later
4. Select **location closest** to your users:
   - `asia-southeast1` (Singapore) - good for Vietnam
   - `asia-east1` (Taiwan)
   - `us-central1` (Iowa) - for US
5. Click **"Enable"**

**Done!** You don't need to set up Firebase Storage because the system stores images as base64 in Firestore Database, which saves costs.

## Get JSON Configuration

### Method 1: From Firebase Console

1. Click on **gear icon** (⚙️) → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Find the web app you created
4. In **"SDK setup and configuration"**, select **"Config"**
5. You'll see a JavaScript object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxx-xxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

**Note**: You can ignore the `storageBucket` field if present, as the system doesn't use Firebase Storage.

### Method 2: Download google-services.json (Mobile)

If you need JSON file for mobile app:
1. Go to **Project Settings**
2. Select Android or iOS platform
3. Download `google-services.json` (Android) or `GoogleService-Info.plist` (iOS)

## Install in Application

### Step 1: Create .env File

In project root directory, create `.env` file:

```bash
# From Intelligence-Test/ directory
cp .env.example .env
```

### Step 2: Fill Firebase Information

Open `.env` file and fill values from Firebase Config:

```env
# OpenAI API Key (Optional - for AI features)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration
# Note: VITE_FIREBASE_STORAGE_BUCKET is NOT needed as images are stored as base64 in database
VITE_FIREBASE_API_KEY=AIzaSyBxxx-xxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456

# Development Settings
# Set to false to use Firebase, true to use localStorage
VITE_DEV_MODE=false
```

### Step 3: Verify Config File

File `src/config/firebase.ts` will automatically read environment variables:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Note: No storage - images are stored as base64 in Firestore
```

## Setup Security Rules

After development, update security rules for production.

### Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User data - only that user can read/write
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Exams - authenticated users can read, only instructors create/edit
    match /exams/{examId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor';
    }
    
    // Exam attempts - students create, instructors view all
    match /examAttempts/{attemptId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.studentId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor'
      );
      allow create: if request.auth != null && 
        request.resource.data.studentId == request.auth.uid;
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.studentId;
    }
    
    // Classes - instructor manages
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor';
    }
    
    // Questions - instructor manages
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor';
    }
  }
}
```

3. Click **"Publish"**

## Test Connection

### Step 1: Start Development Server

```bash
npm run dev
```

### Step 2: Open Browser

Navigate to: http://localhost:5173

### Step 3: Test Login

1. Try logging in with any email
2. If dev mode = false, Firebase will be used
3. Check Firebase Console → Authentication to see new user

### Step 4: Test Database

1. Create a class or exam
2. Check Firebase Console → Firestore Database
3. You'll see new collections and documents

### Step 5: Check Browser Console

Open DevTools (F12) and check console:
- Should not have Firebase errors
- If errors, recheck `.env` and firebaseConfig

## Common Error Handling

### Error: "Firebase: Error (auth/invalid-api-key)"
- **Cause**: Wrong API Key
- **Solution**: Copy API Key again from Firebase Console

### Error: "Firebase: Error (auth/network-request-failed)"
- **Cause**: No internet or Firebase blocked
- **Solution**: Check network connection, try disabling VPN

### Error: "Missing or insufficient permissions"
- **Cause**: Security rules blocking
- **Solution**: Recheck Firestore rules

### Error: "Quota exceeded"
- **Cause**: Exceeded free tier limits
- **Solution**: Upgrade to Blaze plan (pay-as-you-go)

## Upgrade and Optimization

### Monitor Usage

1. Go to Firebase Console → **Usage and billing**
2. Monitor:
   - Firestore reads/writes
   - Authentication usage

**Note**: No Storage costs as images are stored as base64 in Firestore.

### Cost Optimization

**Reduce reads:**
- Cache data in localStorage
- Use pagination
- Fetch only needed fields

**Reduce writes:**
- Batch writes when possible
- Use transactions
- Avoid unnecessary updates

### Backup Data

**Manual backup:**
1. Go to Firestore Database
2. Export collections to JSON

**Automatic backup (Blaze plan):**
1. Go to Firebase Console
2. Setup scheduled backups

## Reference Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Pricing](https://firebase.google.com/pricing)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Best Practices](https://firebase.google.com/docs/firestore/best-practices)

## Support

If you encounter issues:
1. Check Firebase Console logs
2. View browser console for errors
3. Refer to Firebase documentation
4. Open issue on GitHub repository

---

**Note**: Always keep `.env` file secret and don't commit to GitHub. `.gitignore` is already configured to ignore this file.

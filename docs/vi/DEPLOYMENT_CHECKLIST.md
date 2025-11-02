# Deployment Checklist - Intelligence Test Platform 🚀

## Pre-Deployment Checklist

### ✅ Step 1: Environment Setup

- [ ] **Node.js & npm installed** (v18+)
- [ ] **Git repository cloned**
- [ ] **Dependencies installed** (`npm install`)
- [ ] **Build successful** (`npm run build`)

### ✅ Step 2: API Keys Configuration

#### Google Gemini (REQUIRED - FREE)
- [ ] Get API key from https://makersuite.google.com/app/apikey
- [ ] Add to `.env`: `VITE_GEMINI_API_KEY=AIza...`
- [ ] Verify key works (test question generation)

#### Firebase (REQUIRED for Production)
- [ ] Create Firebase project
- [ ] Enable Firestore Database
- [ ] Enable Authentication (Email/Password)
- [ ] Copy configuration to `.env`
- [ ] Test database connection

#### OpenAI (OPTIONAL)
- [ ] Get API key from https://platform.openai.com
- [ ] Add to `.env`: `VITE_OPENAI_API_KEY=sk-...`
- [ ] (Skip if using only Gemini)

### ✅ Step 3: Firebase Configuration

#### 3.1. Create Firebase Project
```bash
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name: "intelligence-test" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create Project"
```

#### 3.2. Enable Firestore
```bash
1. In Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select location (closest to users)
5. Click "Enable"
```

#### 3.3. Configure Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Exams collection
    match /exams/{examId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor';
    }
    
    // Classes collection
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor';
    }
    
    // Exam attempts
    match /examAttempts/{attemptId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.studentId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor');
    }
    
    // Question bank
    match /questionBank/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor';
    }
  }
}
```

#### 3.4. Enable Authentication
```bash
1. Go to "Authentication" → "Get started"
2. Click "Email/Password"
3. Enable "Email/Password"
4. Save
```

#### 3.5. Get Firebase Config
```bash
1. Go to Project Settings (⚙️)
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app name
5. Copy config values to .env:

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### ✅ Step 4: Environment Variables

Create production `.env`:

```env
# Google Gemini (PRIMARY AI - FREE)
VITE_GEMINI_API_KEY=AIza...your-gemini-key

# Firebase (REQUIRED for production)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# OpenAI (OPTIONAL - fallback only)
# VITE_OPENAI_API_KEY=sk-...

# Production mode (uses Firebase)
VITE_DEV_MODE=false
```

### ✅ Step 5: Build & Test

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Test checklist:
- [ ] Login works (instructor & student)
- [ ] Create class works
- [ ] Create exam works
- [ ] Generate questions with AI (Gemini)
- [ ] Take exam works
- [ ] Submit exam works
- [ ] View results works
- [ ] Anti-cheat monitoring works (if enabled)
```

---

## Deployment Options

### Option 1: Vercel (RECOMMENDED - Easiest)

#### Step-by-Step:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel --prod
   ```

3. **Configure Environment Variables in Vercel**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add all variables from `.env`
   - Redeploy

4. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your domain
   - Update DNS records as instructed

**Cost:** FREE for personal/small projects

---

### Option 2: Netlify

#### Step-by-Step:

1. **Build Configuration**
   
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Configure Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add all variables from `.env`

**Cost:** FREE for personal projects

---

### Option 3: Firebase Hosting

#### Step-by-Step:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   
   # Select:
   # - Use existing project (your Firebase project)
   # - Public directory: dist
   # - Configure as SPA: Yes
   # - Set up automatic builds: No
   ```

3. **Build & Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

**Cost:** FREE (generous limits)

---

### Option 4: Docker + VPS

For complete control (DigitalOcean, AWS, Linode):

#### Dockerfile:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Deploy:
```bash
# Build Docker image
docker build -t intelligence-test .

# Run container
docker run -d -p 80:80 --name app intelligence-test

# Or use docker-compose
docker-compose up -d
```

---

## Post-Deployment Checklist

### ✅ Verify Deployment

- [ ] **Website loads** at production URL
- [ ] **No console errors** (F12 → Console)
- [ ] **Firebase connection works**
- [ ] **Gemini AI works** (generate questions)
- [ ] **Authentication works** (login/logout)
- [ ] **Data persists** (refresh page, data still there)
- [ ] **Webcam permission** works for anti-cheat
- [ ] **Mobile responsive** (test on phone)

### ✅ Create Initial Accounts

```bash
# Create instructor account
1. Go to your app URL
2. Click "Sign Up" or use demo: instructor@test.com
3. Set role to "Instructor"

# Create test student account
1. student@test.com
2. Set role to "Student"
```

### ✅ Configure Production Settings

#### Firebase Quotas
- Go to Firebase Console
- Check current usage
- Set up billing alerts (optional)
- Free tier limits:
  - 50K reads/day
  - 20K writes/day
  - 1GB storage

#### Gemini Quotas
- 60 requests/minute (FREE)
- 1,500 requests/day (FREE)
- Monitor at: https://makersuite.google.com

### ✅ Security Hardening

- [ ] **Firebase rules** set to production mode
- [ ] **API keys** not exposed in client code
- [ ] **HTTPS** enabled (automatic on Vercel/Netlify)
- [ ] **CORS** configured if using custom domain
- [ ] **Environment variables** set correctly
- [ ] **No `.env` file** committed to Git

### ✅ Performance Optimization

- [ ] **Enable compression** (automatic on Vercel/Netlify)
- [ ] **Enable caching** for static assets
- [ ] **Lazy load** routes (already implemented)
- [ ] **Monitor bundle size** (currently ~3MB)
- [ ] **CDN** for static assets (automatic)

### ✅ Monitoring & Analytics

#### Setup Error Tracking (Optional)
```bash
# Install Sentry
npm install @sentry/react

# Add to src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

#### Setup Analytics (Optional)
```bash
# Firebase Analytics already included
# Enable in Firebase Console → Analytics
```

---

## Maintenance Checklist

### Daily
- [ ] Check Firebase usage
- [ ] Monitor Gemini API calls
- [ ] Check for user-reported issues

### Weekly
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Backup important data

### Monthly
- [ ] Update dependencies (`npm update`)
- [ ] Review and optimize queries
- [ ] Clean up old exam attempts (optional)
- [ ] Review and update documentation

---

## Troubleshooting

### Issue: "Firebase not configured"
**Solution:** Check `.env` file has all Firebase variables set

### Issue: "Gemini API key invalid"
**Solution:** 
1. Verify key starts with `AIza`
2. Regenerate key at https://makersuite.google.com
3. Check key is not restricted

### Issue: "Authentication failed"
**Solution:**
1. Check Firebase Authentication is enabled
2. Verify auth domain in `.env`
3. Check Firebase rules allow authentication

### Issue: "Questions not generating"
**Solution:**
1. Check Gemini API key in `.env`
2. Check console for errors (F12)
3. Verify not hitting rate limits (60/min)

### Issue: "Data not persisting"
**Solution:**
1. Check `VITE_DEV_MODE=false` in production
2. Verify Firebase connection (console logs)
3. Check Firestore rules allow writes

---

## Scaling Guidelines

### Small Schools (<50 students)
- ✅ Free tier sufficient
- ✅ Use Gemini (free)
- ✅ Firebase free tier
- **Cost:** $0/month

### Medium Schools (50-200 students)
- ✅ Free tier likely sufficient
- ✅ Use Gemini (free)
- ⚠️ Monitor Firebase usage
- **Cost:** $0-10/month

### Large Schools (200-1000 students)
- ⚠️ May need Firebase Blaze plan
- ✅ Use Gemini (still free!)
- ✅ Consider multiple Gemini API keys (rotation)
- **Cost:** $10-50/month

### Enterprise (1000+ students)
- 🔴 Need Firebase Blaze plan
- 🔴 Consider OpenAI for premium features
- 🔴 May need custom hosting
- 🔴 Consider CDN for static assets
- **Cost:** $100-500/month

---

## Success Criteria

Your deployment is successful when:

✅ All checklist items completed  
✅ Users can login and take exams  
✅ Data persists across sessions  
✅ AI features work (Gemini)  
✅ No console errors  
✅ Performance is good (<3s load time)  
✅ Mobile works properly  
✅ Monitoring is in place  

---

## Support Resources

- **Documentation:** [README.md](../README.md)
- **Gemini Setup:** [GEMINI_SETUP.md](./GEMINI_SETUP.md)
- **Training Guide:** [COMPLETE_TRAINING_GUIDE.md](./COMPLETE_TRAINING_GUIDE.md)
- **Firebase Docs:** https://firebase.google.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Issues:** https://github.com/imnothoan/Intelligence-Test/issues

---

**Chúc bạn deploy thành công! 🎉**

If you encounter issues, please open an issue on GitHub with:
- Error message
- Browser console logs
- Steps to reproduce

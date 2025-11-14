# Intelligence Test Platform 🎓

A modern, AI-powered intelligent exam platform built with React, TypeScript, and cutting-edge technologies. This platform implements Computerized Adaptive Testing (CAT) algorithm, features AI-powered question generation with **FREE Google Gemini**, real-time monitoring, and comprehensive analytics.

## 🏗️ Architecture

This repository contains the **Client Application** (Frontend). The platform uses a client-server architecture:

- **Client (This Repo)**: React + TypeScript frontend application
- **Server**: [Intelligence Test Server](https://github.com/imnothoan/Intell-Test_Server) - Node.js/Express backend API

> **New!** The platform has been migrated to a modern client-server architecture for better scalability, security, and maintainability. See [Client-Server Migration Guide](#client-server-architecture) below.

> **🇻🇳 Dành cho người dùng Việt Nam:**  
> - **[🆓 HƯỚNG DẪN GEMINI MIỄN PHÍ](./docs/vi/GEMINI_SETUP.md)** ⭐ **MỚI!** Sử dụng AI hoàn toàn miễn phí
> - **[🎯 HƯỚNG DẪN TRAINING CHI TIẾT](./docs/vi/COMPLETE_TRAINING_GUIDE.md)** ⭐ Giải đáp TẤT CẢ thắc mắc
> - **[📖 Hướng dẫn nhanh bằng Tiếng Việt](./QUICKSTART.vi.md)** ⭐ Quick Start
> - **[📊 Sơ đồ quy trình làm việc](./docs/vi/WORKFLOW_GUIDE.vi.md)** - Trực quan, dễ hiểu
> - [Hướng dẫn cài đặt Firebase chi tiết](./docs/vi/FIREBASE_SETUP.md)  
> - [Tất cả tài liệu Tiếng Việt](./docs/vi/)
>
> **💡 Lưu ý quan trọng**: 
> - ✅ **SỬ DỤNG GEMINI MIỄN PHÍ** - Không cần thẻ tín dụng!
> - ✅ **KHÔNG CẦN TRAIN MODEL** - Hệ thống đã có sẵn tất cả!

## ✨ Key Features

### 🆓 FREE Google Gemini AI Integration (NEWEST!)
- **Completely FREE**: No credit card required, 60 requests/minute
- **Vietnamese Language Support**: Excellent support for Vietnamese content
- **Question Generation**: Auto-generate multiple-choice and essay questions
- **Essay Grading**: AI-powered essay evaluation with detailed feedback
- **Priority Fallback**: Automatically uses Gemini → OpenAI → Mock data
- **Easy Setup**: Just add API key from Google AI Studio

### 🔥 Client-Server Architecture (NEW!)
- **Scalable Backend API**: RESTful API with JWT authentication
- **WebSocket Support**: Real-time monitoring and notifications
- **Database Options**: PostgreSQL or MongoDB
- **Deployment Ready**: VPS, Heroku, Railway, Render support
- **API Documentation**: Complete API specification with 30+ endpoints
- **Offline Fallback**: Works with localStorage when server unavailable

### 🔥 Legacy Firebase Integration (Optional)
- **Cloud Data Storage**: Persistent storage using Firebase Firestore
- **Real-time Synchronization**: Live data updates across devices
- **Async Operations**: All data operations properly handle async/await
- **Error Handling**: Comprehensive error handling and user feedback
- **Free Tier Support**: Works with Firebase's free tier
- **Fallback Mode**: Operates in localStorage mode when Firebase is not configured

### 📊 Real-time Instructor Monitoring Dashboard
- **Live Exam Sessions**: Monitor active exam sessions in real-time
- **Student Activity Tracking**: Track progress and time elapsed
- **Warning System**: Real-time alerts for suspicious behavior
- **Flagged Exams**: Automatic flagging of high-risk attempts
- **Progress Statistics**: Average progress and completion metrics

### 📈 Advanced Analytics & Reporting
- **Comprehensive Statistics**: Detailed exam and student performance metrics
- **Visual Charts**: Interactive charts using Recharts
- **Score Distribution**: Analyze score patterns and trends
- **Performance Trends**: 30-day historical performance tracking
- **Question Analysis**: Individual question performance metrics
- **Export Reports**: Download analytics as CSV files

### 📚 Question Bank Management
- **Centralized Repository**: Organize all questions in one place
- **Search & Filter**: Find questions by topic, type, or difficulty
- **AI Generation**: Generate questions with AI assistance (Gemini/OpenAI)
- **Bulk Operations**: Import/export questions
- **Difficulty Labeling**: Assign and manage difficulty levels for CAT
- **Topic Categorization**: Tag questions with topics

### 🤖 Enhanced AI Features
- **Advanced Essay Grading**: Rubric-based AI essay evaluation
- **Semantic Analysis**: Analyze essay content and structure
- **Multiple LLM Support**: Gemini (free), OpenAI, and more
- **Free API Options**: Guides for using free LLM services
- **CAT Model Training**: Tools and guides for training custom CAT models

### 📖 Comprehensive User Guide (NEW)
- **Getting Started**: Step-by-step setup instructions
- **CAT Algorithm Guide**: Learn about adaptive testing
- **LLM Integration**: Connect to OpenAI, Gemini, Hugging Face, or Ollama
- **Anti-Cheat Training**: Train computer vision models
- **Firebase Setup**: Complete Firebase configuration guide
- **Best Practices**: Tips for optimal platform usage

### 🎯 Existing Core Features
- **CAT Algorithm**: Item Response Theory (IRT) based adaptive testing
- **AI Question Generation**: OpenAI API integration for automatic question creation
- **Anti-Cheat Monitoring**: Computer vision-based behavior detection
- **Multiple Question Types**: Multiple-choice and essay questions
- **Class Management**: Create and manage classes with students
- **Exam Configuration**: Flexible exam settings and options

## 🛠️ Technology Stack

### Frontend (This Repository)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: Zustand with API client integration
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios with interceptors
- **WebSocket**: Native WebSocket with reconnection
- **AI/ML**: 
  - **Google Gemini API** (FREE - Primary, recommended)
  - OpenAI API (Optional - Fallback for advanced features)
  - TensorFlow.js
  - BlazeFace (face detection)
- **Computer Vision**: react-webcam
- **Charts**: Recharts for data visualization

### Backend ([Server Repository](https://github.com/imnothoan/Intell-Test_Server))
- **Framework**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL 14+ or MongoDB 5+
- **Authentication**: JWT with refresh tokens
- **WebSocket**: ws library for real-time features
- **Security**: bcrypt, helmet, rate limiting
- **Validation**: Joi or class-validator
- **Deployment**: PM2, Docker, Nginx

## 📋 Prerequisites

### For Client Only (Standalone Mode)
- Node.js 18+ and npm
- Modern web browser with webcam support (for anti-cheat features)
- **Google Gemini API key** (FREE, recommended) - [Get it here](https://makersuite.google.com/app/apikey)
- OpenAI API key (optional, only for fallback)

### For Client-Server Architecture (Recommended for Production)
- All client prerequisites above
- **Intelligence Test Server** running ([Setup Guide](https://github.com/imnothoan/Intell-Test_Server))
- PostgreSQL 14+ or MongoDB 5+ database
- Server URL (e.g., http://localhost:3000 for development)

## 🚀 Quick Start

### Option A: Standalone Mode (No Server Required)

Perfect for testing and development without setting up a backend server.

#### Step 1: Clone and Install

```bash
git clone https://github.com/imnothoan/Intelligence-Test.git
cd Intelligence-Test
npm install
```

#### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Google Gemini API (REQUIRED - FREE)
VITE_GEMINI_API_KEY=AIza...your-key-here

# Standalone mode (uses localStorage)
VITE_DEV_MODE=true
```

#### Step 3: Run

```bash
npm run dev
```

Open **http://localhost:5173**

---

### Option B: Client-Server Mode (Recommended for Production)

Full production setup with backend server, database, and real-time features.

#### Step 1: Setup Backend Server

First, setup the Intelligence Test Server:

```bash
# Clone server repository
git clone https://github.com/imnothoan/Intell-Test_Server.git
cd Intell-Test_Server

# Follow server setup instructions
# See: https://github.com/imnothoan/Intell-Test_Server#readme
```

Or see detailed guide: [docs/api/SERVER_SETUP_GUIDE.md](./docs/api/SERVER_SETUP_GUIDE.md)

#### Step 2: Setup Client

```bash
git clone https://github.com/imnothoan/Intelligence-Test.git
cd Intelligence-Test
npm install
cp .env.example .env
```

Edit `.env`:
```env
# Backend Server API URL
VITE_API_BASE_URL=http://localhost:3000/api

# Google Gemini API
VITE_GEMINI_API_KEY=AIza...your-key-here

# Client-Server mode
VITE_DEV_MODE=false
```

#### Step 3: Run Both

```bash
# Terminal 1: Start server (in Intell-Test_Server directory)
cd Intell-Test_Server
npm run dev

# Terminal 2: Start client (in Intelligence-Test directory)
cd Intelligence-Test
npm run dev
```

Access at **http://localhost:5173**

---

## 🏗️ Client-Server Architecture

### Why Client-Server?

The platform has been upgraded to a modern client-server architecture for:

✅ **Better Security**: JWT authentication, server-side validation  
✅ **Scalability**: Handle thousands of concurrent users  
✅ **Real-time Features**: WebSocket for live monitoring  
✅ **Data Persistence**: Professional database (PostgreSQL/MongoDB)  
✅ **API-First**: Easy integration with mobile apps, third-party systems  
✅ **Deployment Flexibility**: Deploy client and server separately  

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React App)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   UI Pages   │  │  API Client  │  │  WebSocket   │      │
│  │              │  │              │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────┬──────────────────────┬───────────────┘
                       │                      │
                       │ HTTP/HTTPS           │ WebSocket
                       │ REST API             │ (Real-time)
                       │                      │
┌──────────────────────┴──────────────────────┴───────────────┐
│                    Server (Node.js/Express)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     API      │  │   Business   │  │   WebSocket  │      │
│  │  Controllers │  │    Logic     │  │   Handlers   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                           │                                  │
│                           │                                  │
│  ┌────────────────────────┴──────────────────────────┐      │
│  │           Database (PostgreSQL/MongoDB)           │      │
│  │  Users | Exams | Classes | Questions | Attempts  │      │
│  └───────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

#### API Client (`src/services/apiClient.ts`)
- Centralized HTTP client with Axios
- Automatic JWT token management
- Token refresh on 401 errors
- Request/response interceptors
- Type-safe API calls

#### WebSocket Service (`src/services/websocketService.ts`)
- Real-time exam monitoring
- Live anti-cheat warnings
- Automatic reconnection
- Event-based subscriptions
- Heartbeat mechanism

#### API Store (`src/store/apiStore.ts`)
- Zustand state management
- API integration
- Optimistic updates
- Error handling
- Loading states

### Documentation

- **[API Specification](./docs/api/API_SPECIFICATION.md)** - Complete API reference (30+ endpoints)
- **[Server Setup Guide](./docs/api/SERVER_SETUP_GUIDE.md)** - Backend installation & deployment
- **[Client Integration Guide](./docs/api/CLIENT_INTEGRATION_GUIDE.md)** - How to use the API client
- **[Database Schema](./docs/api/DATABASE_SCHEMA.md)** - Database design & migrations

---

## 📚 Detailed Documentation

### 🆓 Getting FREE Gemini API Key (Recommended)

**See detailed guide**: [docs/vi/GEMINI_SETUP.md](./docs/vi/GEMINI_SETUP.md)

**Quick steps:**
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Get API Key" → "Create API key in new project"
3. Copy the key (starts with `AIza...`)
4. Add to `.env`: `VITE_GEMINI_API_KEY=AIza...`

**Benefits:**
- ✅ Completely FREE (no credit card)
- ✅ 60 requests/minute, 1500/day
- ✅ Excellent Vietnamese language support
- ✅ Perfect for schools with <200 students/day


## 🎮 Usage

### Demo Credentials

**Instructor Account:**
- Email: `instructor@test.com`
- Password: any password
- Role: Instructor

**Student Account:**
- Email: `student@test.com`
- Password: any password
- Role: Student

### For Instructors

#### 1. Managing Question Bank
1. Navigate to "Question Bank" from the dashboard
2. Search and filter existing questions
3. Add questions manually or generate with AI
4. Assign difficulty levels for CAT algorithm
5. Organize by topics and categories

#### 2. Creating an Exam
1. Click "Create Exam"
2. Fill in basic information (title, description, duration)
3. Select questions from question bank or generate new ones
4. Configure exam settings:
   - Enable/disable CAT algorithm
   - Enable/disable anti-cheat monitoring
   - Set time limits and scheduling
5. Assign to classes
6. Review and publish

#### 3. Real-time Monitoring
1. Click "Monitor Exams" from dashboard
2. Select active exam to monitor
3. View live student sessions
4. Track progress and warnings
5. Flag suspicious behavior
6. Review flagged attempts

#### 4. Analytics & Reporting
1. Navigate to "Analytics" dashboard
2. Select exam to analyze
3. View comprehensive statistics
4. Analyze question performance
5. Track performance trends
6. Export reports as CSV

### For Students

1. Log in as a student
2. View available exams on the dashboard
3. Click "Start Exam"
4. If anti-cheat is enabled, allow camera access
5. Answer questions (adaptive or traditional)
6. Submit or let timer expire
7. View results and feedback

### Managing Classes

1. Click "Create Class"
2. Enter class name and description
3. Add students by email
4. Assign exams to the class
5. Monitor class performance

## 🧮 CAT Algorithm Details

The platform implements a sophisticated Item Response Theory (IRT) model:

- **1PL Model**: Uses difficulty parameter for each question
- **Ability Estimation**: Maximum Likelihood Estimation (MLE)
- **Question Selection**: Targets questions closest to estimated ability
- **Stopping Rule**: Fixed number of questions or precision threshold
- **Score Calculation**: Converts ability estimate to 0-100 scale
- **Adaptive Flow**: Adjusts difficulty based on correct/incorrect responses

### Difficulty Calibration
- **0.0 - 0.3**: Easy questions (beginners)
- **0.3 - 0.7**: Medium difficulty (average students)
- **0.7 - 1.0**: Hard questions (advanced students)

## 🤖 AI Integration

### Supported LLM Providers (Priority Order)

1. **Google Gemini** (FREE - Primary, Recommended) ⭐
2. **OpenAI** (GPT-3.5, GPT-4) - Paid, fallback option
3. **Hugging Face** - Free open-source models
4. **Ollama** - Local models (completely free, offline)

The system automatically tries providers in order:
**Gemini → OpenAI → Mock Data**

### 🆓 Google Gemini Integration (RECOMMENDED)

**Why Gemini?**
- ✅ **COMPLETELY FREE** - No credit card required
- ✅ **Excellent Vietnamese support** - Native understanding
- ✅ **60 requests/minute** - Perfect for schools
- ✅ **1,500 requests/day** - Enough for 200+ students
- ✅ **Easy integration** - Just add API key!

**Quick Setup:**
```bash
# 1. Get FREE API key
Open: https://makersuite.google.com/app/apikey
Click: "Get API Key" → "Create API key in new project"
Copy the key (starts with AIza...)

# 2. Add to .env
VITE_GEMINI_API_KEY=AIza...your-key-here

# 3. Done! System automatically uses Gemini
```

**Features Powered by Gemini:**
- ✨ Question Generation (multiple-choice & essay)
- 📝 Essay Grading with rubrics
- 💬 Student Feedback Generation
- 📚 Topic Explanations

**See detailed guide**: [docs/vi/GEMINI_SETUP.md](./docs/vi/GEMINI_SETUP.md)

### 🆓 How to Use FREE LLM APIs

#### Option 1: Google Gemini (Recommended - Already Integrated!)
**Best for:** Vietnamese users, completely free with generous limits

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key" and create a new key
3. Add to your `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. **Free Tier Limits:** 60 requests per minute, completely free!

**Code Example:**
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent("Generate a math question");
console.log(result.response.text());
```

#### Option 2: Hugging Face Inference API
**Best for:** Open-source models, free tier available

1. Sign up at [Hugging Face](https://huggingface.co/)
2. Go to Settings → Access Tokens → Create new token
3. Add to `.env`:
   ```env
   VITE_HUGGINGFACE_API_KEY=your_hf_token_here
   ```
4. Use free models like `mistralai/Mistral-7B-Instruct-v0.2`

**Code Example:**
```javascript
const response = await fetch(
  "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
  {
    headers: { Authorization: `Bearer ${process.env.VITE_HUGGINGFACE_API_KEY}` },
    method: "POST",
    body: JSON.stringify({ inputs: "Generate a question about Vietnam history" }),
  }
);
```

#### Option 3: Ollama (100% Free, Runs Locally)
**Best for:** Complete privacy, no internet required, unlimited usage

1. Install Ollama:
   ```bash
   # On macOS/Linux
   curl -fsSL https://ollama.com/install.sh | sh
   
   # On Windows
   # Download from https://ollama.com/download
   ```

2. Pull a model:
   ```bash
   ollama pull llama2
   ollama pull mistral
   ollama pull gemma
   ```

3. Start Ollama server:
   ```bash
   ollama serve
   ```

4. Use in your code:
   ```javascript
   const response = await fetch('http://localhost:11434/api/generate', {
     method: 'POST',
     body: JSON.stringify({
       model: 'llama2',
       prompt: 'Generate a math question',
       stream: false
     })
   });
   ```

#### Option 4: Groq (Fast & Free)
**Best for:** Very fast inference, free tier with limits

1. Sign up at [Groq Console](https://console.groq.com/)
2. Create an API key
3. Add to `.env`:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key
   ```
4. **Free Tier:** 30 requests per minute

---

## ❌ Do You Need to Train AI Models?

### **NO! You DON'T need to train anything!**

The platform comes **ready to use** with:

✅ **CAT Algorithm** - Works with manual difficulty assignment  
✅ **Anti-Cheat** - Uses pre-trained BlazeFace from Google  
✅ **Question Generation** - Uses Gemini/OpenAI APIs (no training)  
✅ **Essay Grading** - Uses Gemini/OpenAI APIs (no training)  

### 99% of Users: Just Use the Platform!

**What you need:**
1. ✅ Install the app (`npm install`)
2. ✅ Add Gemini API key (FREE)
3. ✅ Start using! (`npm run dev`)

**What you DON'T need:**
- ❌ Train any models
- ❌ Collect datasets
- ❌ Use Google Colab
- ❌ Python/Machine Learning knowledge

### When Would You Train? (Optional - Advanced Users Only)

**Only train if:**
1. **CAT Calibration** - After 3-6 months with 100+ students → Improve accuracy
2. **Custom Anti-Cheat** - Detect school-specific cheating patterns
3. **Domain-Specific LLM** - Very specialized subject matter (medical, legal)

**See comprehensive guide**: [docs/vi/COMPLETE_TRAINING_GUIDE.md](./docs/vi/COMPLETE_TRAINING_GUIDE.md)

---

## 🎓 How to Use AI Features (No Training Required!)

### Using Gemini for Question Generation

The system automatically uses Gemini when you click "Generate Questions with AI" in the UI.

**Behind the scenes:**
```javascript
import { geminiService } from '@/services/geminiService';

// Generates questions automatically
const questions = await geminiService.generateQuestions(
  'Mathematics',  // topic
  5,             // count
  0.5,           // difficulty (0.0 - 1.0)
  'multiple-choice',
  'vi'           // Vietnamese
);
```

### Using Gemini for Essay Grading

The system automatically grades essays using Gemini when students submit.

```javascript
// Automatically grades with detailed feedback
const result = await geminiService.gradeEssay(
  question,
  studentAnswer,
  rubric,
  maxScore
);

// Returns:
// - score: number
// - feedback: string
// - strengths: string[]
// - improvements: string[]
```

### Manual CAT Calibration (No Training!)

**Quick Start Method:**
1. When creating questions, assign difficulty:
   - **Easy (0.0-0.3)**: Basic concepts
   - **Medium (0.3-0.7)**: Application
   - **Hard (0.7-1.0)**: Analysis/Synthesis

**That's it!** The CAT algorithm works immediately.

### 🎓 Advanced: Training AI Models (Optional)

#### Training the CAT Algorithm

The CAT (Computerized Adaptive Testing) algorithm needs question difficulty parameters. Here's how to calibrate them:

1. **Manual Calibration** (Quick Start - RECOMMENDED):
   - Easy questions: Set difficulty to 0.2
   - Medium questions: Set difficulty to 0.5
   - Hard questions: Set difficulty to 0.8

2. **Data-Based Calibration** (After collecting data):
   ```python
   # See docs/vi/COMPLETE_TRAINING_GUIDE.md for full script
   # Calculate difficulty based on student responses
   difficulty = 1 - (correct_answers / total_attempts)
   ```

3. **IRT-Based Calibration** (Expert Level):
   - Collect 100+ responses per question
   - Use IRT libraries (e.g., `mirt` in R or `py-irt` in Python)
   - Export difficulty parameters to JSON

#### Training Anti-Cheat AI Models

**Option 1: Use Pre-trained Models** (Easiest - RECOMMENDED)
The platform uses BlazeFace which is pre-trained and works out of the box.

**Option 2: Custom Training with TensorFlow**
1. Collect training data:
   - Normal behavior: Student looking at screen
   - Suspicious: Looking away, multiple faces, no face

2. Train a model:
   ```python
   import tensorflow as tf
   
   # Load your dataset
   train_data = load_images_from_folder('training_data/')
   
   # Create model
   model = tf.keras.Sequential([
       tf.keras.layers.Conv2D(32, (3,3), activation='relu'),
       tf.keras.layers.MaxPooling2D(2,2),
       tf.keras.layers.Dense(64, activation='relu'),
       tf.keras.layers.Dense(2, activation='softmax')  # Normal vs Suspicious
   ])
   
   # Train
   model.fit(train_data, epochs=10)
   
   # Convert to TensorFlow.js
   !tensorflowjs_converter --input_format keras model.h5 ./web_model
   ```

3. Place the model in `/public/models/` directory

#### Training Essay Grading AI

**Use Free LLM with Custom Prompts:**
```javascript
const prompt = `Grade this essay on a scale of 0-100:

Essay: "${studentEssay}"

Grading Rubric:
- Content Quality (40 points)
- Writing Quality (30 points)
- Structure (20 points)
- Grammar (10 points)

Provide:
1. Total score
2. Scores for each criterion
3. Strengths
4. Areas for improvement`;

// Use with Gemini (free)
const result = await model.generateContent(prompt);
```

### Essay Grading Features
- Rubric-based scoring with customizable criteria
- Automatic feedback generation
- Strength and improvement identification
- Content quality analysis
- Writing quality assessment

## 🔒 Anti-Cheat Features

### Detection Methods
1. **Face Tracking**: Monitors head position and movement
2. **Multi-Face Detection**: Alerts if multiple people are detected
3. **Attention Monitoring**: Detects when student looks away
4. **No Face Alert**: Warns if student is not visible

### Warning System
- **Low severity**: First-time minor violations
- **Medium severity**: Repeated violations or looking away
- **High severity**: Multiple faces or no face detected
- **Automatic flagging**: After 3+ warnings

### Custom Training
The platform supports training custom computer vision models:
- Collect training data (normal vs. cheating behavior)
- Train with TensorFlow/Keras
- Convert to TensorFlow.js format
- Deploy in the platform

## 📁 Project Structure

```
Intelligence-Test/
├── src/
│   ├── algorithms/          # CAT algorithm implementation
│   │   └── cat.ts
│   ├── config/             # Configuration files
│   │   └── firebase.ts
│   ├── pages/              # Page components
│   │   ├── LoginPage.tsx
│   │   ├── InstructorDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── ExamCreator.tsx
│   │   ├── ExamTaking.tsx
│   │   ├── ClassManagement.tsx
│   │   ├── MonitoringDashboard.tsx   # NEW
│   │   ├── AnalyticsDashboard.tsx    # NEW
│   │   ├── QuestionBank.tsx          # NEW
│   │   └── UserGuide.tsx             # NEW
│   ├── services/           # External service integrations
│   │   ├── aiQuestionGenerator.ts
│   │   ├── antiCheatService.ts
│   │   ├── firebaseService.ts        # NEW
│   │   ├── analyticsService.ts       # NEW
│   │   └── essayGradingService.ts    # NEW
│   ├── store/              # State management
│   │   └── index.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Project dependencies
```

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 🔥 Firebase Setup

### Quick Setup Guide
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore Database (start in test mode)
4. Copy configuration to `.env` file
5. Update security rules for production

**Note**: Firebase Storage is NOT required. Images are stored as base64 strings in Firestore Database to save costs.

### Free Tier Limits
- 1 GB Firestore storage
- 50K reads/day, 20K writes/day
- Suitable for small to medium institutions

See the **User Guide** in the app for detailed setup instructions.

## 📖 Documentation

### 📚 Comprehensive Guides

**NEW: Detailed documentation now available in multiple languages!**

- **🇬🇧 English Documentation:** [docs/en/](./docs/en/)
- **🇻🇳 Tài liệu Tiếng Việt:** [docs/vi/](./docs/vi/)

#### Firebase Setup
Complete guides for setting up Firebase backend:
- **English:** [Firebase Setup Guide](./docs/en/FIREBASE_SETUP.md)
- **Tiếng Việt:** [Hướng Dẫn Cài Đặt Firebase](./docs/vi/FIREBASE_SETUP.md)

Topics covered:
- Creating Firebase project step-by-step
- Getting and using Firebase JSON configuration file
- Configuring Authentication and Firestore
- Setting up security rules (Storage NOT needed)
- Testing and troubleshooting

#### Model Training & API Integration
Comprehensive guides for AI models and APIs:
- **English:** [Model Training Guide](./docs/en/MODEL_TRAINING.md)
- **Tiếng Việt:** [Hướng Dẫn Training Models](./docs/vi/MODEL_TRAINING.md)

Topics covered:
- CAT algorithm question difficulty calibration
- LLM API integration (OpenAI, Gemini, Hugging Face, Ollama)
- Training custom anti-cheat computer vision models
- Essay grading with AI
- Cost optimization and best practices

#### Example Files
- [Firebase Configuration Template](./docs/examples/firebase-config.example.ts)
- [CAT Calibration Script](./docs/examples/training-scripts/train_cat_model.py)

### 📱 In-App User Guide

Access quick reference guides from within the application:
- Click "User Guide" from any dashboard
- Learn about CAT algorithm implementation
- Integrate with various LLM providers
- Train custom anti-cheat models
- Configure Firebase backend
- Best practices and tips

## 🌟 New Features Summary

### Version 2.0 Updates
- ✅ Firebase backend integration with fallback mode
- ✅ Real-time monitoring dashboard for instructors
- ✅ Advanced analytics with visual charts
- ✅ Question bank management system
- ✅ Enhanced AI essay grading with rubrics
- ✅ Multiple LLM provider support
- ✅ Comprehensive user guide and documentation
- ✅ Improved UI/UX with better navigation
- ✅ Export functionality for reports
- ✅ Real-time data synchronization

## 🚧 Future Enhancements

- [ ] Collaborative exam creation with version control
- [ ] Mobile app version (React Native)
- [ ] Plagiarism detection for essays
- [ ] Integration with Learning Management Systems (LMS)
- [ ] Multi-language support
- [ ] Advanced statistics and machine learning insights
- [ ] Video proctoring enhancements
- [ ] Peer review system
- [ ] Gamification elements
- [ ] API for third-party integrations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- [@imnothoan](https://github.com/imnothoan)

## 🙏 Acknowledgments

- OpenAI for GPT API
- TensorFlow.js team for ML models
- React and Vite communities
- All contributors and testers

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

**Note**: This is a demonstration platform. For production use, implement proper backend services, authentication, and security measures.

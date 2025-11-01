# Intelligence Test Platform 🎓

A modern, AI-powered intelligent exam platform built with React, TypeScript, and cutting-edge technologies. This platform implements Computerized Adaptive Testing (CAT) algorithm, features AI-powered question generation, real-time monitoring, and comprehensive analytics with Firebase backend integration.

> **🇻🇳 Dành cho người dùng Việt Nam:**  
> - [Hướng dẫn cài đặt Firebase chi tiết](./docs/vi/FIREBASE_SETUP.md)  
> - [Hướng dẫn training models và tích hợp API](./docs/vi/MODEL_TRAINING.md)  
> - Tất cả tài liệu có sẵn bằng Tiếng Việt trong thư mục [docs/vi/](./docs/vi/)

## ✨ Key Features

### 🔥 Firebase Backend Integration (NEW)
- **Cloud Data Storage**: Persistent storage using Firebase Firestore
- **Real-time Synchronization**: Live data updates across devices
- **Authentication**: Secure user authentication with Firebase Auth
- **Free Tier Support**: Works with Firebase's free tier
- **Fallback Mode**: Operates in localStorage mode when Firebase is not configured

### 📊 Real-time Instructor Monitoring Dashboard (NEW)
- **Live Exam Sessions**: Monitor active exam sessions in real-time
- **Student Activity Tracking**: Track progress and time elapsed
- **Warning System**: Real-time alerts for suspicious behavior
- **Flagged Exams**: Automatic flagging of high-risk attempts
- **Progress Statistics**: Average progress and completion metrics

### 📈 Advanced Analytics & Reporting (NEW)
- **Comprehensive Statistics**: Detailed exam and student performance metrics
- **Visual Charts**: Interactive charts using Recharts
- **Score Distribution**: Analyze score patterns and trends
- **Performance Trends**: 30-day historical performance tracking
- **Question Analysis**: Individual question performance metrics
- **Export Reports**: Download analytics as CSV files

### 📚 Question Bank Management (NEW)
- **Centralized Repository**: Organize all questions in one place
- **Search & Filter**: Find questions by topic, type, or difficulty
- **AI Generation**: Generate questions with AI assistance
- **Bulk Operations**: Import/export questions
- **Difficulty Labeling**: Assign and manage difficulty levels for CAT
- **Topic Categorization**: Tag questions with topics

### 🤖 Enhanced AI Features (NEW)
- **Advanced Essay Grading**: Rubric-based AI essay evaluation
- **Semantic Analysis**: Analyze essay content and structure
- **Multiple LLM Support**: Integration guides for various LLM APIs
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

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **AI/ML**: 
  - OpenAI API (GPT-4 for essay grading, GPT-3.5 for questions)
  - TensorFlow.js
  - BlazeFace (face detection)
- **Computer Vision**: react-webcam
- **Charts**: Recharts for data visualization

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser with webcam support (for anti-cheat features)
- Firebase account (free tier supported, optional for dev mode)
- OpenAI API key (optional, for AI features)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/imnothoan/Intelligence-Test.git
cd Intelligence-Test
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```
# OpenAI API key (optional)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration (optional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Development mode (uses localStorage instead of Firebase)
VITE_DEV_MODE=true
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

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

### Supported LLM Providers
1. **OpenAI** (GPT-3.5, GPT-4) - Paid with free trial
2. **Google Gemini** - Free tier available
3. **Hugging Face** - Free open-source models
4. **Ollama** - Local models (completely free)

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
4. Create Storage bucket
5. Copy configuration to `.env` file
6. Update security rules for production

### Free Tier Limits
- 1 GB Firestore storage
- 50K reads/day, 20K writes/day
- 5 GB Storage
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
- Configuring Authentication, Firestore, and Storage
- Setting up security rules
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

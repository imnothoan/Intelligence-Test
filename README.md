# Intelligence Test Platform 🎓

A modern, intelligent exam platform built with React, TypeScript, and AI technologies. This platform implements Computerized Adaptive Testing (CAT) algorithm and features AI-powered question generation with computer vision-based anti-cheat monitoring.

## ✨ Key Features

### 🤖 AI-Powered Question Generation
- Integration with OpenAI API for automatic question generation
- Support for multiple question types (multiple-choice, essay)
- Customizable difficulty levels and topics
- Mock question generation for demo purposes

### 📊 CAT (Computerized Adaptive Testing) Algorithm
- Item Response Theory (IRT) based implementation
- Dynamic difficulty adjustment based on student performance
- Efficient ability estimation with standard error tracking
- Optimized test length while maintaining accuracy

### 🎥 Computer Vision Anti-Cheat System
- Real-time face detection using TensorFlow.js and BlazeFace
- Multiple violation detection:
  - Looking away (left/right detection)
  - Multiple faces in frame
  - No face detected
- Automatic warning system with severity levels
- Instructor notification for flagged exams

### 👨‍🏫 Instructor Features
- Create and manage classes
- Add students to classes
- AI-assisted exam creation
- Configure exam settings (CAT, anti-cheat, duration)
- View student performance and warnings
- Monitor exam attempts in real-time

### 👨‍🎓 Student Features
- View enrolled classes and available exams
- Take adaptive or traditional exams
- Real-time timer and progress tracking
- Camera monitoring during exams
- Immediate feedback on adaptive tests

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **AI/ML**: 
  - TensorFlow.js
  - BlazeFace (face detection)
  - OpenAI API (question generation)
- **Computer Vision**: react-webcam

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser with webcam support (for anti-cheat features)
- OpenAI API key (optional, for AI question generation)

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

Edit `.env` and add your OpenAI API key (optional):
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

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

### Creating an Exam (Instructor)

1. Log in as an instructor
2. Click "Create New Exam"
3. Fill in basic information (title, description, duration)
4. Use AI to generate questions:
   - Enter a topic (e.g., "Linear Algebra", "World History")
   - Select difficulty and question count
   - Click "Generate Questions with AI"
5. Review and edit generated questions
6. Configure exam settings:
   - Enable/disable CAT algorithm
   - Enable/disable anti-cheat monitoring
7. Click "Create Exam"

### Taking an Exam (Student)

1. Log in as a student
2. View available exams on the dashboard
3. Click "Start Exam"
4. If anti-cheat is enabled, allow camera access
5. Answer questions one by one
6. Submit the exam or let the timer expire

### Managing Classes (Instructor)

1. Click "Create New Class"
2. Enter class name and description
3. Add students by email
4. Assign exams to the class

## 🧮 CAT Algorithm Details

The platform implements a simplified Item Response Theory (IRT) model:

- **1PL Model**: Uses difficulty parameter for each question
- **Ability Estimation**: Maximum Likelihood Estimation (MLE)
- **Question Selection**: Targets questions closest to estimated ability
- **Stopping Rule**: Fixed number of questions or precision threshold
- **Score Calculation**: Converts ability estimate to 0-100 scale

## 🔒 Anti-Cheat Features

### Detection Methods:
1. **Face Tracking**: Monitors head position and movement
2. **Multi-Face Detection**: Alerts if multiple people are detected
3. **Attention Monitoring**: Detects when student looks away
4. **No Face Alert**: Warns if student is not visible

### Warning System:
- Low severity: First-time minor violations
- Medium severity: Repeated violations or looking away
- High severity: Multiple faces or no face detected
- Automatic flagging after 3+ warnings

## 📁 Project Structure

```
Intelligence-Test/
├── src/
│   ├── algorithms/          # CAT algorithm implementation
│   │   └── cat.ts
│   ├── components/          # Reusable React components
│   ├── pages/              # Page components
│   │   ├── LoginPage.tsx
│   │   ├── InstructorDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── ExamCreator.tsx
│   │   ├── ExamTaking.tsx
│   │   └── ClassManagement.tsx
│   ├── services/           # External service integrations
│   │   ├── aiQuestionGenerator.ts
│   │   └── antiCheatService.ts
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

## 🚧 Future Enhancements

- [ ] Backend API with database persistence
- [ ] User authentication with JWT
- [ ] Real-time instructor monitoring dashboard
- [ ] Advanced analytics and reporting
- [ ] Question bank management
- [ ] Collaborative exam creation
- [ ] Integration with LMS platforms
- [ ] Mobile app version
- [ ] Advanced AI grading for essay questions
- [ ] Plagiarism detection
- [ ] Multi-language support

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

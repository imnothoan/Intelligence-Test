import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * User Guide and Documentation
 * Comprehensive guide for using the platform and training models
 */

export default function UserGuide() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'cat-algorithm', title: 'CAT Algorithm', icon: '🎯' },
    { id: 'llm-integration', title: 'LLM Integration', icon: '🤖' },
    { id: 'anti-cheat', title: 'Anti-Cheat Training', icon: '👁️' },
    { id: 'firebase-setup', title: 'Firebase Setup', icon: '🔥' },
    { id: 'best-practices', title: 'Best Practices', icon: '✨' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📖 User Guide & Documentation
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Complete guide for Intelligence Test Platform
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-3">Contents</h3>
              <nav className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {section.icon} {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {activeSection === 'overview' && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Overview</h2>
                  
                  <p className="text-gray-700 mb-4">
                    Welcome to the Intelligence Test Platform - a modern, AI-powered examination system designed for
                    educational institutions. This platform combines advanced technologies including Computerized
                    Adaptive Testing (CAT), AI-powered question generation, and computer vision-based anti-cheat monitoring.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Key Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>CAT Algorithm:</strong> Adaptive testing that adjusts difficulty based on student performance</li>
                    <li><strong>AI Question Generation:</strong> Automatically generate questions using LLM APIs</li>
                    <li><strong>Real-time Monitoring:</strong> Track student progress and detect cheating in real-time</li>
                    <li><strong>Advanced Analytics:</strong> Comprehensive reporting and performance insights</li>
                    <li><strong>Question Bank:</strong> Organize and manage your question repository</li>
                    <li><strong>Firebase Integration:</strong> Cloud-based data storage and synchronization</li>
                    <li><strong>Essay Grading:</strong> AI-powered automatic grading for essay questions</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">System Architecture</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Frontend:</strong> React + TypeScript + Tailwind CSS<br />
                      <strong>Backend:</strong> Firebase (Firestore, Authentication, Storage)<br />
                      <strong>AI/ML:</strong> OpenAI API, TensorFlow.js, BlazeFace<br />
                      <strong>Analytics:</strong> Recharts for data visualization
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'getting-started' && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Getting Started</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Installation</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
                    <pre className="text-sm">
{`# Clone the repository
git clone https://github.com/imnothoan/Intelligence-Test.git
cd Intelligence-Test

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm run dev`}
                    </pre>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Environment Setup</h3>
                  <p className="text-gray-700 mb-4">
                    Edit the <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file and configure:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>OpenAI API key (for AI features)</li>
                    <li>Firebase configuration (for data persistence)</li>
                    <li>Development mode flag</li>
                  </ul>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> The platform works in demo mode without Firebase configuration.
                      Data will be stored in browser localStorage in development mode.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">First Login</h3>
                  <p className="text-gray-700 mb-2">Use these demo credentials:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">👨‍🏫 Instructor</h4>
                      <p className="text-sm text-gray-700">
                        Email: instructor@test.com<br />
                        Password: any password
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">👨‍🎓 Student</h4>
                      <p className="text-sm text-gray-700">
                        Email: student@test.com<br />
                        Password: any password
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'cat-algorithm' && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 CAT Algorithm Guide</h2>

                  <p className="text-gray-700 mb-4">
                    Computerized Adaptive Testing (CAT) is an intelligent testing method that adapts the difficulty
                    of questions based on the test-taker's ability level.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How It Works</h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    <li>
                      <strong>Initial Question:</strong> Student starts with a medium difficulty question (0.5 on scale 0-1)
                    </li>
                    <li>
                      <strong>Response Analysis:</strong> System analyzes if answer is correct or incorrect
                    </li>
                    <li>
                      <strong>Ability Estimation:</strong> Updates estimated ability using Item Response Theory (IRT)
                    </li>
                    <li>
                      <strong>Next Question Selection:</strong> Selects question closest to estimated ability
                    </li>
                    <li>
                      <strong>Repeat:</strong> Process continues until stopping criteria is met
                    </li>
                  </ol>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Setting Difficulty Levels</h3>
                  <p className="text-gray-700 mb-4">
                    When creating questions, assign difficulty values:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="font-semibold text-green-800">0.0 - 0.3:</span>
                      <span className="text-gray-700">Easy questions for beginners</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <span className="font-semibold text-yellow-800">0.3 - 0.7:</span>
                      <span className="text-gray-700">Medium difficulty for average students</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <span className="font-semibold text-red-800">0.7 - 1.0:</span>
                      <span className="text-gray-700">Hard questions for advanced students</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Training a Custom CAT Model</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
                    <pre className="text-sm">
{`# 1. Collect historical test data
# Export student responses and scores

# 2. Install Python dependencies
pip install numpy scipy scikit-learn

# 3. Train IRT model
python train_cat_model.py --data responses.csv

# 4. Export parameters
# Model outputs difficulty and discrimination parameters

# 5. Update question bank with new parameters
# Import calibrated difficulties into the system`}
                    </pre>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700">
                      <strong>Tip:</strong> Start with at least 100-200 responses per question for accurate
                      difficulty calibration. More data leads to better adaptive testing.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'llm-integration' && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🤖 LLM Integration Guide</h2>

                  <p className="text-gray-700 mb-4">
                    Integrate Large Language Models to automatically generate questions and grade essays.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Using OpenAI API</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
                    <pre className="text-sm">
{`# 1. Get API key from OpenAI
# Visit: https://platform.openai.com/api-keys

# 2. Add to .env file
VITE_OPENAI_API_KEY=sk-...your-key...

# 3. The system will automatically use it for:
# - Question generation
# - Essay grading
# - Content analysis`}
                    </pre>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Free LLM Alternatives</h3>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">1. Hugging Face API (Free Tier)</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Use open-source models like Mistral, Llama 2, or Falcon
                      </p>
                      <div className="bg-gray-900 text-gray-100 rounded p-3 overflow-x-auto">
                        <pre className="text-xs">
{`# Install
npm install @huggingface/inference

// Usage
import { HfInference } from '@huggingface/inference'
const hf = new HfInference('YOUR_TOKEN')
const result = await hf.textGeneration({
  model: 'mistralai/Mistral-7B-Instruct-v0.1',
  inputs: 'Generate a math question...'
})`}
                        </pre>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">2. Google Gemini API (Free Tier)</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Google's AI model with generous free quota
                      </p>
                      <div className="bg-gray-900 text-gray-100 rounded p-3 overflow-x-auto">
                        <pre className="text-xs">
{`# Install
npm install @google/generative-ai

// Usage
import { GoogleGenerativeAI } from '@google/generative-ai'
const genAI = new GoogleGenerativeAI('YOUR_API_KEY')
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
const result = await model.generateContent(prompt)`}
                        </pre>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">3. Ollama (Local)</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Run models locally for complete privacy and no API costs
                      </p>
                      <div className="bg-gray-900 text-gray-100 rounded p-3 overflow-x-auto">
                        <pre className="text-xs">
{`# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2

# Run API
ollama serve

# Use in your app
fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama2',
    prompt: 'Generate a question about...'
  })
})`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Question Generation Best Practices</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Be specific with topics and difficulty levels in prompts</li>
                    <li>Always review AI-generated questions before using</li>
                    <li>Manually assign CAT difficulty ratings after review</li>
                    <li>Build a diverse question bank across topics</li>
                    <li>Test questions with students before high-stakes exams</li>
                  </ul>
                </div>
              )}

              {activeSection === 'anti-cheat' && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">👁️ Anti-Cheat System Training</h2>

                  <p className="text-gray-700 mb-4">
                    The platform uses computer vision to monitor student behavior during exams. Learn how to
                    train and customize the anti-cheat detection model.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Built-in Detection</h3>
                  <p className="text-gray-700 mb-4">
                    The system uses TensorFlow.js with BlazeFace model to detect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>No face detected (student left camera)</li>
                    <li>Multiple faces (someone helping)</li>
                    <li>Looking away (reading from notes)</li>
                    <li>Excessive head movement</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Custom Training</h3>
                  <p className="text-gray-700 mb-4">
                    Train a custom model for your specific needs:
                  </p>

                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
                    <pre className="text-sm">
{`# 1. Collect training data
# Record video of normal exam-taking behavior
# Record video of cheating scenarios

# 2. Install dependencies
pip install tensorflow opencv-python mediapipe

# 3. Prepare dataset
python prepare_dataset.py \\
  --normal-videos ./data/normal \\
  --cheat-videos ./data/cheat \\
  --output ./dataset

# 4. Train model
python train_anticheat.py \\
  --dataset ./dataset \\
  --epochs 50 \\
  --output ./models/anticheat.h5

# 5. Convert to TensorFlow.js
tensorflowjs_converter \\
  --input_format=keras \\
  ./models/anticheat.h5 \\
  ./public/models/anticheat

# 6. Update the service to use your model
# Edit: src/services/antiCheatService.ts`}
                    </pre>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Configuration</h3>
                  <p className="text-gray-700 mb-4">
                    Adjust detection sensitivity in the code:
                  </p>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
                    <pre className="text-sm">
{`// src/services/antiCheatService.ts
export class AntiCheatService {
  private warningThreshold = 3;  // Violations before warning
  private movementThreshold = 100;  // Pixels of head movement
  
  // Adjust these values based on your needs
  constructor(config?: {
    warningThreshold?: number;
    movementThreshold?: number;
  }) {
    if (config) {
      this.warningThreshold = config.warningThreshold ?? 3;
      this.movementThreshold = config.movementThreshold ?? 100;
    }
  }
}`}
                    </pre>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700">
                      <strong>Privacy Note:</strong> Always inform students about monitoring and obtain consent.
                      Consider local privacy laws and institutional policies when using video monitoring.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'firebase-setup' && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🔥 Firebase Setup Guide</h2>

                  <p className="text-gray-700 mb-4">
                    Firebase provides free backend services including authentication, database, and file storage.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Step 1: Create Firebase Project</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Go to <a href="https://console.firebase.google.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener">Firebase Console</a></li>
                    <li>Click "Add Project"</li>
                    <li>Enter project name and follow setup wizard</li>
                    <li>Enable Google Analytics (optional)</li>
                  </ol>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Step 2: Enable Services</h3>
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Authentication</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>Go to Authentication → Sign-in method</li>
                        <li>Enable Email/Password</li>
                        <li>Enable Google (optional)</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Firestore Database</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>Go to Firestore Database → Create database</li>
                        <li>Choose "Start in test mode" for development</li>
                        <li>Select a location close to your users</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Storage</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>Go to Storage → Get started</li>
                        <li>Use default security rules</li>
                        <li>Select same location as Firestore</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Step 3: Get Configuration</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Go to Project Settings (gear icon)</li>
                    <li>Scroll to "Your apps" section</li>
                    <li>Click web icon (&lt;/&gt;) to add web app</li>
                    <li>Register app and copy configuration</li>
                  </ol>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Step 4: Configure App</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
                    <pre className="text-sm">
{`# Add to .env file:
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_DEV_MODE=false`}
                    </pre>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Step 5: Security Rules</h3>
                  <p className="text-gray-700 mb-4">
                    Set up proper security rules for production:
                  </p>
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
                    <pre className="text-sm">
{`// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Instructors can manage their content
    match /exams/{examId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor';
    }
    
    // Students can read/write their attempts
    match /examAttempts/{attemptId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.resource.data.studentId == request.auth.uid;
      allow update: if request.auth.uid == resource.data.studentId;
    }
  }
}`}
                    </pre>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700">
                      <strong>Free Tier:</strong> Firebase Spark (free) plan includes:
                      <br />• 1 GB Firestore storage
                      <br />• 50K reads/day, 20K writes/day
                      <br />• 5 GB Storage
                      <br />• Sufficient for small to medium institutions
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'best-practices' && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Best Practices</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Exam Creation</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Create a diverse question bank with various difficulty levels</li>
                    <li>Review all AI-generated questions before use</li>
                    <li>Test exams with a small group before full deployment</li>
                    <li>Set appropriate time limits based on question count</li>
                    <li>Enable CAT for accurate ability assessment</li>
                    <li>Use anti-cheat monitoring for high-stakes exams</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Question Bank Management</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Organize questions by topic and difficulty</li>
                    <li>Review question performance regularly</li>
                    <li>Remove or revise questions with poor statistics</li>
                    <li>Maintain balance across topics and difficulty levels</li>
                    <li>Update questions periodically to prevent cheating</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Monitoring & Security</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Monitor exams in real-time during sessions</li>
                    <li>Review flagged attempts promptly</li>
                    <li>Adjust anti-cheat sensitivity as needed</li>
                    <li>Inform students about monitoring in advance</li>
                    <li>Keep backup of all exam data</li>
                    <li>Regularly update Firebase security rules</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Analytics & Improvement</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Review analytics after each exam</li>
                    <li>Identify struggling students early</li>
                    <li>Analyze question performance metrics</li>
                    <li>Adjust teaching based on weak topics</li>
                    <li>Export reports for institutional records</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Performance Optimization</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Use question bank pagination for large datasets</li>
                    <li>Enable caching for frequently accessed data</li>
                    <li>Optimize images and media in questions</li>
                    <li>Monitor Firebase usage to stay within limits</li>
                    <li>Consider upgrading plan for large institutions</li>
                  </ul>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Pro Tips</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Schedule regular database backups</li>
                      <li>Create exam templates for common formats</li>
                      <li>Build a community question bank with colleagues</li>
                      <li>Provide practice exams for students</li>
                      <li>Keep system and dependencies updated</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

# Client Integration Guide

## Hướng dẫn Tích hợp Client với Server

Tài liệu này hướng dẫn cách sử dụng API Client và WebSocket Service đã được tạo sẵn trong Intelligence Test Client.

---

## Mục lục

1. [Setup và Configuration](#1-setup-và-configuration)
2. [Authentication](#2-authentication)
3. [Sử dụng API Store](#3-sử-dụng-api-store)
4. [Real-time Monitoring với WebSocket](#4-real-time-monitoring-với-websocket)
5. [Error Handling](#5-error-handling)
6. [Offline Mode](#6-offline-mode)
7. [Examples](#7-examples)

---

## 1. Setup và Configuration

### Bước 1: Cấu hình Environment

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cấu hình `.env`:

```env
# Backend Server URL
VITE_API_BASE_URL=http://localhost:3000/api

# AI Services (giữ nguyên)
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENAI_API_KEY=your_openai_api_key

# Development mode
VITE_DEV_MODE=false
```

### Bước 2: Import và Sử dụng Store

```typescript
// Trong component
import { useStore } from '@/store/apiStore';

function MyComponent() {
  const { currentUser, login, isLoading, error } = useStore();
  
  // Component logic...
}
```

---

## 2. Authentication

### Login

```typescript
import { useStore } from '@/store/apiStore';

function LoginPage() {
  const { login, isLoading, error } = useStore();

  const handleLogin = async (email: string, password: string, role: 'instructor' | 'student') => {
    try {
      await login(email, password, role);
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      // Error is also available in the `error` state
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleLogin(
        formData.get('email') as string,
        formData.get('password') as string,
        formData.get('role') as 'instructor' | 'student'
      );
    }}>
      {/* Form fields */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Register

```typescript
import { useStore } from '@/store/apiStore';

function RegisterPage() {
  const { register, isLoading, error } = useStore();

  const handleRegister = async (
    email: string,
    password: string,
    name: string,
    role: 'instructor' | 'student'
  ) => {
    try {
      await register(email, password, name, role);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  // Form implementation...
}
```

### Logout

```typescript
import { useStore } from '@/store/apiStore';

function Header() {
  const { logout, currentUser } = useStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header>
      <span>Welcome, {currentUser?.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}
```

### Protected Routes

```typescript
import { useStore } from '@/store/apiStore';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'instructor' | 'student' }) {
  const { isAuthenticated, currentUser } = useStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Usage
<Route path="/instructor/*" element={
  <ProtectedRoute role="instructor">
    <InstructorDashboard />
  </ProtectedRoute>
} />
```

---

## 3. Sử dụng API Store

### Exam Operations

#### Tạo Exam

```typescript
import { useStore } from '@/store/apiStore';
import { Exam } from '@/types';

function ExamCreator() {
  const { createExam, currentUser } = useStore();

  const handleCreateExam = async (examData: Omit<Exam, 'id' | 'createdAt'>) => {
    try {
      const newExam = await createExam(examData);
      console.log('Exam created:', newExam);
      navigate(`/exams/${newExam.id}`);
    } catch (error) {
      console.error('Failed to create exam:', error);
    }
  };

  // Form implementation...
}
```

#### Lấy danh sách Exams

```typescript
import { useStore } from '@/store/apiStore';
import { useEffect } from 'react';

function InstructorDashboard() {
  const { exams, loadExamsByInstructor, currentUser, isLoading } = useStore();

  useEffect(() => {
    if (currentUser) {
      loadExamsByInstructor(currentUser.id);
    }
  }, [currentUser]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Exams</h1>
      <ul>
        {exams.map(exam => (
          <li key={exam.id}>
            <h3>{exam.title}</h3>
            <p>{exam.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Update Exam

```typescript
import { useStore } from '@/store/apiStore';

function ExamEditor({ examId }: { examId: string }) {
  const { updateExam } = useStore();

  const handleUpdate = async (updates: Partial<Exam>) => {
    try {
      await updateExam(examId, updates);
      alert('Exam updated successfully!');
    } catch (error) {
      console.error('Failed to update exam:', error);
    }
  };

  // Implementation...
}
```

### Class Operations

#### Tạo Class

```typescript
import { useStore } from '@/store/apiStore';

function ClassCreator() {
  const { createClass, currentUser } = useStore();

  const handleCreateClass = async (name: string, description: string) => {
    try {
      const newClass = await createClass({
        name,
        description,
        instructorId: currentUser!.id,
        students: [],
        exams: [],
      });
      console.log('Class created:', newClass);
    } catch (error) {
      console.error('Failed to create class:', error);
    }
  };

  // Implementation...
}
```

#### Thêm Student vào Class

```typescript
import { useStore } from '@/store/apiStore';

function ClassManagement({ classId }: { classId: string }) {
  const { addStudentToClass } = useStore();

  const handleAddStudent = async (studentEmail: string) => {
    try {
      // You might need to search for student by email first
      const student = await apiClient.getUserByEmail(studentEmail);
      if (student) {
        await addStudentToClass(classId, student.id);
        alert('Student added successfully!');
      }
    } catch (error) {
      console.error('Failed to add student:', error);
    }
  };

  // Implementation...
}
```

### Exam Attempts

#### Bắt đầu Thi

```typescript
import { useStore } from '@/store/apiStore';

function ExamTaking({ examId }: { examId: string }) {
  const { startExamAttempt, currentAttempt } = useStore();

  useEffect(() => {
    const initExam = async () => {
      try {
        const attempt = await startExamAttempt(examId);
        console.log('Exam started:', attempt);
      } catch (error) {
        console.error('Failed to start exam:', error);
      }
    };

    initExam();
  }, [examId]);

  // Exam taking implementation...
}
```

#### Nộp bài

```typescript
import { useStore } from '@/store/apiStore';

function ExamTaking() {
  const { submitExamAttempt, currentAttempt } = useStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    if (!currentAttempt) return;

    try {
      await submitExamAttempt(currentAttempt.id, answers);
      alert('Exam submitted successfully!');
      navigate('/results');
    } catch (error) {
      console.error('Failed to submit exam:', error);
    }
  };

  // Implementation...
}
```

---

## 4. Real-time Monitoring với WebSocket

### Setup Monitoring

```typescript
import { useStore } from '@/store/apiStore';
import { websocketService } from '@/services/websocketService';
import { useEffect } from 'react';

function ExamMonitoring({ examId }: { examId: string }) {
  const { connectToExamMonitoring, disconnectFromMonitoring } = useStore();

  useEffect(() => {
    // Connect to monitoring
    connectToExamMonitoring(examId);

    // Cleanup on unmount
    return () => {
      disconnectFromMonitoring();
    };
  }, [examId]);

  // Component implementation...
}
```

### Subscribe to Updates

```typescript
import { websocketService, MonitoringUpdate } from '@/services/websocketService';
import { useEffect, useState } from 'react';

function LiveMonitoringDashboard({ examId }: { examId: string }) {
  const [activeSessions, setActiveSessions] = useState<MonitoringUpdate[]>([]);

  useEffect(() => {
    // Subscribe to exam updates
    const handleUpdate = (update: MonitoringUpdate) => {
      setActiveSessions(prev => {
        const index = prev.findIndex(s => s.attemptId === update.attemptId);
        if (index >= 0) {
          const newSessions = [...prev];
          newSessions[index] = update;
          return newSessions;
        }
        return [...prev, update];
      });
    };

    websocketService.subscribeToExamMonitoring(examId, handleUpdate);

    return () => {
      // Cleanup if needed
    };
  }, [examId]);

  return (
    <div>
      <h2>Active Sessions: {activeSessions.length}</h2>
      <ul>
        {activeSessions.map(session => (
          <li key={session.attemptId}>
            Student: {session.studentId} - Progress: {session.progress}%
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Report Progress (From Student Side)

```typescript
import { websocketService } from '@/services/websocketService';
import { useEffect } from 'react';

function ExamTaking({ examId, attemptId }: { examId: string; attemptId: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3600);

  useEffect(() => {
    // Report progress every 10 seconds
    const interval = setInterval(() => {
      websocketService.reportProgress({
        attemptId,
        studentId: currentUser.id,
        examId,
        progress: (currentQuestion / totalQuestions) * 100,
        currentQuestion,
        timeRemaining,
        warnings: 0,
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [currentQuestion, timeRemaining]);

  // Exam taking logic...
}
```

### Cheat Warning Detection

```typescript
import { websocketService, CheatWarningUpdate } from '@/services/websocketService';
import { useEffect } from 'react';

function AntiCheatMonitor({ examId }: { examId: string }) {
  const [warnings, setWarnings] = useState<CheatWarningUpdate[]>([]);

  useEffect(() => {
    const handleWarning = (warningUpdate: CheatWarningUpdate) => {
      setWarnings(prev => [...prev, warningUpdate]);
      
      // Show notification
      alert(`⚠️ Cheat warning detected for attempt ${warningUpdate.attemptId}`);
    };

    websocketService.subscribeToCheatWarnings(examId, handleWarning);
  }, [examId]);

  return (
    <div>
      <h3>Cheat Warnings: {warnings.length}</h3>
      {/* Display warnings */}
    </div>
  );
}
```

---

## 5. Error Handling

### Global Error Handler

```typescript
import { useStore } from '@/store/apiStore';
import { useEffect } from 'react';

function App() {
  const { error } = useStore();

  useEffect(() => {
    if (error) {
      // Show error toast/notification
      console.error('Application error:', error);
      // You can use a toast library here
    }
  }, [error]);

  return (
    <div>
      {/* Your app */}
    </div>
  );
}
```

### Try-Catch Pattern

```typescript
import { useStore } from '@/store/apiStore';

function MyComponent() {
  const { createExam } = useStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAction = async () => {
    setLocalError(null);
    
    try {
      await createExam(examData);
      // Success
    } catch (error) {
      if (error instanceof Error) {
        setLocalError(error.message);
      } else {
        setLocalError('An unknown error occurred');
      }
    }
  };

  return (
    <div>
      {localError && <div className="error">{localError}</div>}
      {/* Component UI */}
    </div>
  );
}
```

---

## 6. Offline Mode

### Check Server Connection

```typescript
import { useStore } from '@/store/apiStore';
import { useEffect, useState } from 'react';

function App() {
  const { checkServerConnection, isServerConnected } = useStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check on mount
    checkServerConnection();

    // Check periodically
    const interval = setInterval(() => {
      checkServerConnection();
    }, 30000); // Every 30 seconds

    // Listen to online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div>
      {!isServerConnected && (
        <div className="offline-banner">
          ⚠️ Server is not reachable. Some features may be unavailable.
        </div>
      )}
      {/* Your app */}
    </div>
  );
}
```

### Fallback to LocalStorage

```typescript
import { useStore as useApiStore } from '@/store/apiStore';
import { useStore as useLocalStore } from '@/store/index'; // Original Firebase/localStorage store

function AdaptiveStore() {
  const apiStore = useApiStore();
  const localStore = useLocalStore();

  // Use API store if server is connected, otherwise use local store
  return apiStore.isServerConnected ? apiStore : localStore;
}

// Usage in components
function MyComponent() {
  const store = AdaptiveStore();
  // Use store methods...
}
```

---

## 7. Examples

### Complete Login Flow

```typescript
import { useStore } from '@/store/apiStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'instructor' | 'student'>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password, role);
      
      // Redirect based on role
      if (role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      // Error is handled by store
      console.error('Login failed');
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
```

### Complete Exam Taking Flow

```typescript
import { useStore } from '@/store/apiStore';
import { websocketService } from '@/services/websocketService';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ExamTaking() {
  const { examId } = useParams<{ examId: string }>();
  const {
    currentExam,
    currentAttempt,
    getExam,
    startExamAttempt,
    submitExamAttempt,
    currentUser,
  } = useStore();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!examId) return;

    // Load exam and start attempt
    const initialize = async () => {
      await getExam(examId);
      const attempt = await startExamAttempt(examId);
      setTimeRemaining(currentExam!.duration * 60); // Convert to seconds
    };

    initialize();
  }, [examId]);

  useEffect(() => {
    if (!currentAttempt || !currentExam) return;

    // Timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Report progress
    const progressInterval = setInterval(() => {
      websocketService.reportProgress({
        attemptId: currentAttempt.id,
        studentId: currentUser!.id,
        examId: currentExam.id,
        progress: (Object.keys(answers).length / currentExam.questions.length) * 100,
        currentQuestion: currentQuestionIndex,
        timeRemaining,
        warnings: 0,
      });
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(progressInterval);
    };
  }, [currentAttempt, currentQuestionIndex, timeRemaining, answers]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!currentAttempt) return;

    try {
      await submitExamAttempt(currentAttempt.id, answers);
      alert('Exam submitted successfully!');
      navigate('/results');
    } catch (error) {
      console.error('Failed to submit exam:', error);
    }
  };

  if (!currentExam || !currentAttempt) {
    return <div>Loading exam...</div>;
  }

  const currentQuestion = currentExam.questions[currentQuestionIndex];

  return (
    <div className="exam-taking">
      <div className="exam-header">
        <h1>{currentExam.title}</h1>
        <div className="timer">
          Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60}
        </div>
      </div>

      <div className="question">
        <h3>Question {currentQuestionIndex + 1} of {currentExam.questions.length}</h3>
        <p>{currentQuestion.question}</p>

        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={index.toString()}
                  checked={answers[currentQuestion.id] === index.toString()}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                />
                {option}
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === 'essay' && (
          <textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            rows={10}
            placeholder="Type your answer here..."
          />
        )}
      </div>

      <div className="navigation">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        <button
          onClick={() => setCurrentQuestionIndex(prev => 
            Math.min(currentExam.questions.length - 1, prev + 1)
          )}
          disabled={currentQuestionIndex === currentExam.questions.length - 1}
        >
          Next
        </button>

        <button onClick={handleSubmit} className="submit-button">
          Submit Exam
        </button>
      </div>
    </div>
  );
}

export default ExamTaking;
```

---

## Kết luận

Tài liệu này cung cấp tất cả thông tin cần thiết để tích hợp client với server. 

**Lưu ý quan trọng:**
1. Luôn handle errors properly
2. Sử dụng loading states để improve UX
3. Implement offline fallback khi cần
4. Test thoroughly trước khi deploy
5. Monitor WebSocket connections

Để biết thêm chi tiết về API endpoints, xem [API_SPECIFICATION.md](./API_SPECIFICATION.md).

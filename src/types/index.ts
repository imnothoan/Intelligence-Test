// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'instructor' | 'student';
  avatar?: string;
  createdAt: Date;
}

// Exam types
export interface Question {
  id: string;
  type: 'multiple-choice' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  difficulty: number; // 0-1 scale for CAT algorithm
  topic: string;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  classId: string;
  questions: Question[];
  duration: number; // in minutes
  startTime: Date;
  endTime: Date;
  isAdaptive: boolean; // CAT enabled
  antiCheatEnabled: boolean;
  createdAt: Date;
}

// Class types
export interface Class {
  id: string;
  name: string;
  description: string;
  instructorId: string;
  students: string[]; // student IDs
  exams: string[]; // exam IDs
  createdAt: Date;
}

// Exam attempt types
export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  answers: Record<string, string>;
  score?: number;
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'flagged';
  warnings: CheatWarning[];
}

// Anti-cheat types
export interface CheatWarning {
  id: string;
  attemptId: string;
  type: 'look-away' | 'multiple-faces' | 'no-face' | 'tab-switch';
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  snapshot?: string; // base64 image
}

// CAT Algorithm types
export interface CATState {
  currentDifficulty: number;
  estimatedAbility: number;
  standardError: number;
  questionsAsked: number;
  maxQuestions: number;
}

export interface QuestionResponse {
  questionId: string;
  correct: boolean;
  timeSpent: number;
}

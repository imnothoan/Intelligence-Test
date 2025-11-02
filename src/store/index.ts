import { create } from 'zustand';
import { User, Exam, Class, ExamAttempt } from '@/types';

interface AppState {
  // User state
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Exams state
  exams: Exam[];
  currentExam: Exam | null;
  
  // Classes state
  classes: Class[];
  currentClass: Class | null;
  
  // Exam attempts state
  examAttempts: ExamAttempt[];
  currentAttempt: ExamAttempt | null;
  
  // Actions
  addUser: (user: User) => void;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string, role: 'instructor' | 'student') => Promise<void>;
  logout: () => void;
  
  addExam: (exam: Exam) => void;
  setCurrentExam: (exam: Exam | null) => void;
  updateExam: (examId: string, updates: Partial<Exam>) => void;
  
  addClass: (classData: Class) => void;
  setCurrentClass: (classData: Class | null) => void;
  updateClass: (classId: string, updates: Partial<Class>) => void;
  addStudentToClass: (classId: string, studentId: string) => void;
  
  startExamAttempt: (examId: string, studentId: string) => ExamAttempt;
  updateExamAttempt: (attemptId: string, updates: Partial<ExamAttempt>) => void;
  completeExamAttempt: (attemptId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  users: [],
  currentUser: null,
  isAuthenticated: false,
  exams: [],
  currentExam: null,
  classes: [],
  currentClass: null,
  examAttempts: [],
  currentAttempt: null,

  // User actions
  addUser: (user) => set((state) => ({ 
    users: [...state.users, user] 
  })),
  
  setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
  
  login: async (email, _password, role) => {
    // Mock login - in production, this would call an API
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role,
      createdAt: new Date(),
    };
    
    set({ currentUser: mockUser, isAuthenticated: true });
  },
  
  logout: () => set({ 
    currentUser: null, 
    isAuthenticated: false,
    currentExam: null,
    currentClass: null,
    currentAttempt: null,
  }),

  // Exam actions
  addExam: (exam) => set((state) => ({ 
    exams: [...state.exams, exam] 
  })),
  
  setCurrentExam: (exam) => set({ currentExam: exam }),
  
  updateExam: (examId, updates) => set((state) => ({
    exams: state.exams.map(exam => 
      exam.id === examId ? { ...exam, ...updates } : exam
    ),
    currentExam: state.currentExam?.id === examId 
      ? { ...state.currentExam, ...updates } 
      : state.currentExam,
  })),

  // Class actions
  addClass: (classData) => set((state) => ({ 
    classes: [...state.classes, classData] 
  })),
  
  setCurrentClass: (classData) => set({ currentClass: classData }),
  
  updateClass: (classId, updates) => set((state) => ({
    classes: state.classes.map(cls => 
      cls.id === classId ? { ...cls, ...updates } : cls
    ),
    currentClass: state.currentClass?.id === classId 
      ? { ...state.currentClass, ...updates } 
      : state.currentClass,
  })),
  
  addStudentToClass: (classId, studentId) => set((state) => ({
    classes: state.classes.map(cls => 
      cls.id === classId 
        ? { ...cls, students: [...cls.students, studentId] }
        : cls
    ),
  })),

  // Exam attempt actions
  startExamAttempt: (examId, studentId) => {
    const attempt: ExamAttempt = {
      id: `attempt-${Date.now()}`,
      examId,
      studentId,
      answers: {},
      startTime: new Date(),
      status: 'in-progress',
      warnings: [],
    };
    
    set((state) => ({ 
      examAttempts: [...state.examAttempts, attempt],
      currentAttempt: attempt,
    }));
    
    return attempt;
  },
  
  updateExamAttempt: (attemptId, updates) => set((state) => ({
    examAttempts: state.examAttempts.map(attempt => 
      attempt.id === attemptId ? { ...attempt, ...updates } : attempt
    ),
    currentAttempt: state.currentAttempt?.id === attemptId 
      ? { ...state.currentAttempt, ...updates } 
      : state.currentAttempt,
  })),
  
  completeExamAttempt: (attemptId) => set((state) => ({
    examAttempts: state.examAttempts.map(attempt => 
      attempt.id === attemptId 
        ? { ...attempt, status: 'completed' as const, endTime: new Date() }
        : attempt
    ),
    currentAttempt: null,
  })),
}));

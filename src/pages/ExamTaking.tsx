import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useStore } from '@/store';
import { CATAlgorithm } from '@/algorithms/cat';
import { antiCheatService } from '@/services/antiCheatService';
import { Question, CheatWarning } from '@/types';

const ExamTaking: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const monitoringIntervalRef = useRef<number | null>(null);
  
  const { currentUser, exams, startExamAttempt, updateExamAttempt, completeExamAttempt } = useStore();
  
  const exam = exams.find(e => e.id === examId);
  const [attempt, setAttempt] = useState<any>(null);
  
  const [catAlgorithm] = useState(
    exam ? new CATAlgorithm(exam.questions, exam.isAdaptive ? 15 : exam.questions.length) : null
  );
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [warnings, setWarnings] = useState<CheatWarning[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(exam?.duration ? exam.duration * 60 : 0);
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Initialize exam attempt
  useEffect(() => {
    if (exam && currentUser && !attempt) {
      startExamAttempt(exam.id, currentUser.id).then(newAttempt => {
        setAttempt(newAttempt);
      });
    }
  }, [exam, currentUser, attempt, startExamAttempt]);

  // Initialize anti-cheat if enabled
  useEffect(() => {
    if (!attempt) return;
    
    if (exam?.antiCheatEnabled) {
      antiCheatService.initialize().then(() => {
        setIsMonitoringActive(true);
        startMonitoring();
      }).catch(err => {
        console.error('Failed to initialize anti-cheat:', err);
        alert('Camera access required for this exam. Please enable camera permissions.');
      });
    }
    
    // Load first question
    if (catAlgorithm && exam) {
      loadNextQuestion();
    }

    return () => {
      stopMonitoring();
      antiCheatService.dispose();
    };
  }, [attempt]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const startMonitoring = () => {
    if (monitoringIntervalRef.current) return;

    monitoringIntervalRef.current = window.setInterval(async () => {
      if (webcamRef.current?.video && attempt) {
        const warning = await antiCheatService.analyzeFrame(
          webcamRef.current.video,
          attempt.id
        );
        
        if (warning) {
          setWarnings(prev => [...prev, warning]);
          updateExamAttempt(attempt.id, {
            warnings: [...warnings, warning],
            status: warnings.length >= 3 ? 'flagged' : 'in-progress',
          });
        }
      }
    }, 2000); // Check every 2 seconds
  };

  const stopMonitoring = () => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }
  };

  const loadNextQuestion = () => {
    if (!catAlgorithm || !exam) return;

    const nextQuestion = exam.isAdaptive 
      ? catAlgorithm.getNextQuestion(askedQuestions)
      : exam.questions.find(q => !askedQuestions.includes(q.id));

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setAskedQuestions([...askedQuestions, nextQuestion.id]);
      setCurrentAnswer('');
      setQuestionStartTime(Date.now());
    } else {
      handleSubmitExam();
    }
  };

  const handleAnswerQuestion = () => {
    if (!currentQuestion || !attempt || !catAlgorithm) return;

    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const isCorrect = currentQuestion.type === 'multiple-choice' 
      ? parseInt(currentAnswer) === currentQuestion.correctAnswer
      : false; // Essay questions need manual grading

    // Update attempt with answer
    const updatedAnswers = {
      ...attempt.answers,
      [currentQuestion.id]: currentAnswer,
    };
    
    updateExamAttempt(attempt.id, { answers: updatedAnswers });

    // Update CAT algorithm if adaptive
    if (exam?.isAdaptive) {
      catAlgorithm.updateAbilityEstimate(
        { questionId: currentQuestion.id, correct: isCorrect, timeSpent },
        currentQuestion
      );

      if (catAlgorithm.shouldStop()) {
        handleSubmitExam();
        return;
      }
    }

    // Load next question
    loadNextQuestion();
  };

  const handleSubmitExam = () => {
    if (!attempt) return;

    stopMonitoring();

    // Calculate final score
    let score = 0;
    if (exam?.isAdaptive && catAlgorithm) {
      score = catAlgorithm.getFinalScore();
    } else if (exam) {
      const correctAnswers = exam.questions.filter(q => 
        q.type === 'multiple-choice' && 
        attempt.answers[q.id] === String(q.correctAnswer)
      ).length;
      score = Math.round((correctAnswers / exam.questions.length) * 100);
    }

    updateExamAttempt(attempt.id, { score });
    completeExamAttempt(attempt.id);
    
    navigate('/student');
  };

  if (!exam || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Exam not found</p>
          <button
            onClick={() => navigate('/student')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
            <div className="flex items-center gap-6">
              <div className="text-lg font-semibold">
                Time: <span className={timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Question {askedQuestions.length} / {exam.isAdaptive ? '~15' : exam.questions.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Area */}
          <div className="lg:col-span-2">
            {currentQuestion ? (
              <div className="bg-white p-8 rounded-lg shadow">
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">
                    Difficulty: {currentQuestion.difficulty < 0.3 ? 'Easy' : currentQuestion.difficulty < 0.7 ? 'Medium' : 'Hard'}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {currentQuestion.question}
                  </h2>
                </div>

                {currentQuestion.type === 'multiple-choice' && currentQuestion.options ? (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition"
                        style={{
                          borderColor: currentAnswer === String(index) ? '#3B82F6' : '#E5E7EB'
                        }}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={index}
                          checked={currentAnswer === String(index)}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={8}
                    placeholder="Type your answer here..."
                  />
                )}

                <button
                  onClick={handleAnswerQuestion}
                  disabled={!currentAnswer}
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  {askedQuestions.length >= (exam.isAdaptive ? 15 : exam.questions.length) 
                    ? 'Submit Exam' 
                    : 'Next Question'}
                </button>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">Loading question...</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Anti-Cheat Monitor */}
            {exam.antiCheatEnabled && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  🎥 Camera Monitoring
                </h3>
                {isMonitoringActive ? (
                  <>
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      className="w-full rounded-lg mb-4"
                      screenshotFormat="image/jpeg"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">⚠️ Anti-cheat is active</p>
                      <p className="text-xs">
                        Please face the camera. Looking away may trigger warnings.
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">Initializing camera...</p>
                )}
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  ⚠️ Warnings ({warnings.length})
                </h3>
                <div className="space-y-2">
                  {warnings.slice(-3).map((warning) => (
                    <div key={warning.id} className="text-sm text-red-700">
                      {warning.type === 'look-away' && '👀 Looking away detected'}
                      {warning.type === 'multiple-faces' && '👥 Multiple faces detected'}
                      {warning.type === 'no-face' && '❌ No face detected'}
                    </div>
                  ))}
                </div>
                {warnings.length >= 3 && (
                  <p className="text-sm text-red-800 font-semibold mt-2">
                    Your exam has been flagged for review.
                  </p>
                )}
              </div>
            )}

            {/* CAT Status */}
            {exam.isAdaptive && catAlgorithm && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  📊 Adaptive Testing
                </h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>Estimated Ability:</span>
                    <span className="font-semibold">
                      {Math.round(catAlgorithm.getState().estimatedAbility * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precision:</span>
                    <span className="font-semibold">
                      {Math.round((1 - catAlgorithm.getState().standardError) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitExam}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              Submit Exam Early
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamTaking;

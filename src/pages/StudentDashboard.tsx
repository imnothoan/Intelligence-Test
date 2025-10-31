import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, classes, exams, examAttempts } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Find classes where student is enrolled
  const enrolledClasses = classes.filter(cls => 
    cls.students.includes(currentUser?.id || '')
  );

  // Find available exams from enrolled classes
  const availableExams = exams.filter(exam => 
    enrolledClasses.some(cls => cls.exams.includes(exam.id))
  );

  // Find student's exam attempts
  const myAttempts = examAttempts.filter(
    attempt => attempt.studentId === currentUser?.id
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Welcome, {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="text-xl font-semibold text-gray-800">
              Enrolled Classes
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {enrolledClasses.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="text-xl font-semibold text-gray-800">
              Available Exams
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {availableExams.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="text-xl font-semibold text-gray-800">
              Completed Exams
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {myAttempts.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Available Exams */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Available Exams
          </h2>
          {availableExams.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600">
                No exams available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableExams.map((exam) => {
                const hasAttempt = myAttempts.some(
                  a => a.examId === exam.id && a.status === 'completed'
                );
                
                return (
                  <div
                    key={exam.id}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {exam.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {exam.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span className="font-medium">{exam.questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{exam.duration} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adaptive:</span>
                        <span className="font-medium">
                          {exam.isAdaptive ? '✅ Yes' : '❌ No'}
                        </span>
                      </div>
                      {exam.antiCheatEnabled && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <span>🎥</span>
                          <span>Camera monitoring required</span>
                        </div>
                      )}
                    </div>
                    {hasAttempt ? (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed"
                      >
                        Already Completed
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/exam/${exam.id}`)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Start Exam
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* My Classes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            My Classes
          </h2>
          {enrolledClasses.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600">
                You are not enrolled in any classes yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white p-6 rounded-lg shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {cls.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {cls.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    <span>{cls.students.length} students enrolled</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;

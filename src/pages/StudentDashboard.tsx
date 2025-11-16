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

  // Calculate statistics
  const completedExams = myAttempts.filter(a => a.status === 'completed').length;
  const averageScore = myAttempts.length > 0
    ? Math.round(myAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / myAttempts.length)
    : 0;
  const upcomingExams = availableExams.filter(exam => 
    !myAttempts.some(a => a.examId === exam.id && a.status === 'completed')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🎓</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Bảng Điều Khiển Sinh Viên
                </h1>
                <p className="text-gray-500 text-sm mt-1">Chào mừng trở lại, {currentUser?.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/guide')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Trợ Giúp
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-semibold shadow-lg transition transform hover:scale-105"
              >
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Classes */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition hover:scale-105">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white text-3xl">📚</div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm font-medium">Lớp Học</p>
                  <p className="text-white text-3xl font-bold">{enrolledClasses.length}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50">
              <p className="text-blue-900 text-sm">Đã tham gia</p>
            </div>
          </div>

          {/* Available Exams */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition hover:scale-105">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white text-3xl">📝</div>
                <div className="text-right">
                  <p className="text-purple-100 text-sm font-medium">Bài Thi</p>
                  <p className="text-white text-3xl font-bold">{upcomingExams.length}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50">
              <p className="text-purple-900 text-sm">Chưa hoàn thành</p>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition hover:scale-105">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white text-3xl">✓</div>
                <div className="text-right">
                  <p className="text-green-100 text-sm font-medium">Đã Hoàn Thành</p>
                  <p className="text-white text-3xl font-bold">{completedExams}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50">
              <p className="text-green-900 text-sm">Bài thi đã nộp</p>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition hover:scale-105">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white text-3xl">⭐</div>
                <div className="text-right">
                  <p className="text-orange-100 text-sm font-medium">Điểm TB</p>
                  <p className="text-white text-3xl font-bold">{averageScore}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-orange-50">
              <p className="text-orange-900 text-sm">Trên 100 điểm</p>
            </div>
          </div>
        </div>

        {/* Available Exams Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                📝
              </span>
              Bài Thi Khả Dụng
            </h2>
            {upcomingExams.length > 0 && (
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                {upcomingExams.length} bài thi mới
              </span>
            )}
          </div>
          
          {upcomingExams.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tuyệt vời!</h3>
              <p className="text-gray-600">
                Bạn đã hoàn thành tất cả bài thi. Hãy thư giãn hoặc ôn tập lại kiến thức!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingExams.map((exam) => {
                const hasAttempt = myAttempts.some(
                  a => a.examId === exam.id && a.status === 'completed'
                );
                
                return (
                  <div
                    key={exam.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition hover:scale-105 hover:shadow-2xl"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 text-white">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold flex-1">
                          {exam.title}
                        </h3>
                        {exam.isAdaptive && (
                          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0">
                            THÍCH ỨNG
                          </span>
                        )}
                      </div>
                      <p className="text-blue-100 text-sm line-clamp-2">
                        {exam.description}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="space-y-3 mb-5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            Số câu hỏi
                          </span>
                          <span className="font-semibold text-gray-900">
                            {exam.isAdaptive ? '~15 câu' : `${exam.questions.length} câu`}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Thời gian
                          </span>
                          <span className="font-semibold text-gray-900">
                            {exam.duration} phút
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            Độ khó
                          </span>
                          <span className="font-semibold text-gray-900">
                            {exam.questions.some(q => q.difficulty > 0.7) ? 'Khó' : 
                             exam.questions.some(q => q.difficulty > 0.3) ? 'Trung bình' : 'Dễ'}
                          </span>
                        </div>

                        {exam.antiCheatEnabled && (
                          <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-200">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Yêu cầu camera giám sát</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {hasAttempt ? (
                        <button
                          disabled
                          className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Đã Hoàn Thành
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/exam/${exam.id}`)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          Bắt Đầu Làm Bài
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* My Classes Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="bg-gradient-to-r from-green-500 to-teal-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                🏫
              </span>
              Lớp Học Của Tôi
            </h2>
          </div>
          
          {enrolledClasses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có lớp học</h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa tham gia lớp học nào. Hãy liên hệ giảng viên để được thêm vào lớp!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition hover:scale-105"
                >
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 p-5 text-white">
                    <h3 className="text-xl font-bold mb-2">
                      {cls.name}
                    </h3>
                    <p className="text-green-100 text-sm line-clamp-2">
                      {cls.description}
                    </p>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        Sinh viên
                      </span>
                      <span className="font-semibold text-gray-900">
                        {cls.students.length}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        Bài thi
                      </span>
                      <span className="font-semibold text-gray-900">
                        {cls.exams.length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Exam Results */}
        {myAttempts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                  📊
                </span>
                Kết Quả Gần Đây
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bài Thi</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Điểm</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng Thái</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày Thi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {myAttempts.slice(0, 5).map((attempt) => {
                      const exam = exams.find(e => e.id === attempt.examId);
                      return (
                        <tr key={attempt.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{exam?.title || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`text-2xl font-bold ${
                                (attempt.score || 0) >= 80 ? 'text-green-600' :
                                (attempt.score || 0) >= 60 ? 'text-blue-600' :
                                (attempt.score || 0) >= 40 ? 'text-orange-600' :
                                'text-red-600'
                              }`}>
                                {attempt.score || 0}
                              </div>
                              <span className="text-gray-500 text-sm">/100</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              attempt.status === 'completed' ? 'bg-green-100 text-green-800' :
                              attempt.status === 'flagged' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {attempt.status === 'completed' ? '✓ Hoàn thành' :
                               attempt.status === 'flagged' ? '⚠ Đánh dấu' :
                               '⏳ Đang làm'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(attempt.startTime).toLocaleDateString('vi-VN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-600 text-sm">
          <p>Nền Tảng Khảo Thí Thông Minh © 2024 - Tất cả quyền được bảo lưu</p>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;

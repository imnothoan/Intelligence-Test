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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Bảng Điều Khiển Sinh Viên
              </h1>
              <p className="text-slate-300 text-sm mt-1">Nền Tảng Khảo Thí Thông Minh</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white">
                {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-slate-800 rounded-lg hover:bg-gray-100 font-medium transition"
              >
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Lớp Học Đã Tham Gia
            </h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">
              {enrolledClasses.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Bài Thi Khả Dụng
            </h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">
              {availableExams.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Đã Hoàn Thành
            </h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">
              {myAttempts.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Available Exams */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bài Thi Khả Dụng
          </h2>
          {availableExams.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border-2 border-gray-200 text-center">
              <p className="text-gray-600">
                Hiện tại chưa có bài thi nào.
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
                    className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-slate-400 hover:shadow-md transition"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {exam.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {exam.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Số câu hỏi:</span>
                        <span className="font-medium">{exam.questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thời gian:</span>
                        <span className="font-medium">{exam.duration} phút</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thích ứng:</span>
                        <span className="font-medium">
                          {exam.isAdaptive ? 'Có' : 'Không'}
                        </span>
                      </div>
                      {exam.antiCheatEnabled && (
                        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-2 rounded">
                          <span>Yêu cầu giám sát camera</span>
                        </div>
                      )}
                    </div>
                    {hasAttempt ? (
                      <button
                        disabled
                        className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg cursor-not-allowed"
                      >
                        Đã Hoàn Thành
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/exam/${exam.id}`)}
                        className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition font-medium"
                      >
                        Bắt Đầu Làm Bài
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Lớp Học Của Tôi
          </h2>
          {enrolledClasses.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border-2 border-gray-200 text-center">
              <p className="text-gray-600">
                Bạn chưa tham gia lớp học nào.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white p-6 rounded-lg border-2 border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {cls.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {cls.description}
                  </p>
                  <div className="text-sm text-gray-600">
                    <span>{cls.students.length} sinh viên đã tham gia</span>
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

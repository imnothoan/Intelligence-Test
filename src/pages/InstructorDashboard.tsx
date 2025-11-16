import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Class } from '@/types';

const InstructorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, classes, exams, examAttempts, addClass } = useStore();
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateClass = () => {
    if (!currentUser || !className) return;

    const newClass: Class = {
      id: `class-${Date.now()}`,
      name: className,
      description: classDescription,
      instructorId: currentUser.id,
      students: [],
      exams: [],
      createdAt: new Date(),
    };

    addClass(newClass);
    setShowCreateClass(false);
    setClassName('');
    setClassDescription('');
  };

  const instructorExams = exams.filter(exam => exam.instructorId === currentUser?.id);
  const instructorClasses = classes.filter(cls => cls.instructorId === currentUser?.id);
  
  // Calculate statistics
  const totalStudents = instructorClasses.reduce((sum, cls) => sum + cls.students.length, 0);
  const totalExams = instructorExams.length;
  const totalAttempts = examAttempts.filter(attempt => 
    instructorExams.some(exam => exam.id === attempt.examId)
  ).length;
  const activeExams = examAttempts.filter(attempt => 
    attempt.status === 'in-progress' && 
    instructorExams.some(exam => exam.id === attempt.examId)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">👨‍🏫</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Bảng Điều Khiển Giảng Viên
                </h1>
                <p className="text-gray-500 text-sm mt-1">Xin chào, {currentUser?.name}!</p>
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
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white text-3xl">🏫</div>
                <div className="text-right">
                  <p className="text-purple-100 text-sm font-medium">Lớp Học</p>
                  <p className="text-white text-3xl font-bold">{instructorClasses.length}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50">
              <p className="text-purple-900 text-sm">{totalStudents} sinh viên</p>
            </div>
          </div>

          {/* Total Exams */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition hover:scale-105">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white text-3xl">📝</div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm font-medium">Đề Thi</p>
                  <p className="text-white text-3xl font-bold">{totalExams}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50">
              <p className="text-blue-900 text-sm">Đã tạo</p>
            </div>
          </div>

          {/* Total Attempts */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition hover:scale-105">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white text-3xl">📊</div>
                <div className="text-right">
                  <p className="text-green-100 text-sm font-medium">Lượt Thi</p>
                  <p className="text-white text-3xl font-bold">{totalAttempts}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50">
              <p className="text-green-900 text-sm">Tổng số</p>
            </div>
          </div>

          {/* Active Now */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition hover:scale-105">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white text-3xl">🔴</div>
                <div className="text-right">
                  <p className="text-orange-100 text-sm font-medium">Đang Thi</p>
                  <p className="text-white text-3xl font-bold">{activeExams}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-orange-50">
              <p className="text-orange-900 text-sm">Trực tiếp</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                ⚡
              </span>
              Hành Động Nhanh
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => navigate('/instructor/exam/create')}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden transform transition hover:scale-105 hover:shadow-2xl hover:border-blue-500"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="text-5xl mb-3">📝</div>
                <h3 className="text-xl font-bold">Tạo Đề Thi</h3>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm">
                  Tạo bài kiểm tra mới với AI hoặc thủ công
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/instructor/question-bank')}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden transform transition hover:scale-105 hover:shadow-2xl hover:border-purple-500"
            >
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
                <div className="text-5xl mb-3">🏦</div>
                <h3 className="text-xl font-bold">Ngân Hàng Câu Hỏi</h3>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm">
                  Quản lý và tổ chức kho câu hỏi của bạn
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/instructor/monitoring')}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden transform transition hover:scale-105 hover:shadow-2xl hover:border-red-500"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                <div className="text-5xl mb-3">📹</div>
                <h3 className="text-xl font-bold">Giám Sát</h3>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm">
                  Theo dõi bài thi trực tiếp và phát hiện gian lận
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/instructor/analytics')}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden transform transition hover:scale-105 hover:shadow-2xl hover:border-green-500"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                <div className="text-5xl mb-3">📊</div>
                <h3 className="text-xl font-bold">Phân Tích</h3>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm">
                  Xem báo cáo và thống kê chi tiết
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Secondary Actions */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setShowCreateClass(true)}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 text-left transform transition hover:scale-105 hover:border-indigo-500"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">➕</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Tạo Lớp Học</h3>
                  <p className="text-sm text-gray-600">Thiết lập lớp học mới cho sinh viên</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/guide')}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 text-left transform transition hover:scale-105 hover:border-yellow-500"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📖</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Hướng Dẫn</h3>
                  <p className="text-sm text-gray-600">Tìm hiểu các tính năng của hệ thống</p>
                </div>
              </div>
            </button>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg border-2 border-green-200 p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">☁️</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Trạng Thái</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 font-medium">Đồng bộ đám mây</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Classes Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                🏫
              </span>
              Lớp Học Của Tôi
            </h2>
            {instructorClasses.length > 0 && (
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                {instructorClasses.length} lớp
              </span>
            )}
          </div>
          
          {instructorClasses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="text-6xl mb-4">🏫</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có lớp học</h3>
              <p className="text-gray-600 mb-6">
                Tạo lớp học đầu tiên để bắt đầu quản lý sinh viên và đề thi
              </p>
              <button
                onClick={() => setShowCreateClass(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition transform hover:scale-105"
              >
                ➕ Tạo Lớp Học Ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructorClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition hover:scale-105 hover:shadow-2xl cursor-pointer"
                  onClick={() => navigate(`/instructor/class/${cls.id}`)}
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-5 text-white">
                    <h3 className="text-xl font-bold mb-2">
                      {cls.name}
                    </h3>
                    <p className="text-purple-100 text-sm line-clamp-2">
                      {cls.description}
                    </p>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span className="font-semibold text-gray-900">{cls.students.length}</span>
                        <span>SV</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-gray-900">{cls.exams.length}</span>
                        <span>Thi</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Exams Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
                📝
              </span>
              Đề Thi Của Tôi
            </h2>
            {instructorExams.length > 0 && (
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                {instructorExams.length} đề thi
              </span>
            )}
          </div>
          
          {instructorExams.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có đề thi</h3>
              <p className="text-gray-600 mb-6">
                Tạo đề thi đầu tiên để bắt đầu đánh giá sinh viên
              </p>
              <button
                onClick={() => navigate('/instructor/exam/create')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-cyan-700 transition transform hover:scale-105"
              >
                ➕ Tạo Đề Thi Ngay
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tiêu Đề</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Số Câu Hỏi</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thời Gian</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">CAT</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Anti-Cheat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {instructorExams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{exam.title}</div>
                          <div className="text-sm text-gray-500 mt-1">{exam.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900 font-semibold">{exam.questions.length}</span>
                          <span className="text-gray-500 text-sm ml-1">câu</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900 font-semibold">{exam.duration}</span>
                          <span className="text-gray-500 text-sm ml-1">phút</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            exam.isAdaptive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {exam.isAdaptive ? '✓ Có' : 'Không'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            exam.antiCheatEnabled ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {exam.antiCheatEnabled ? '🎥 Có' : 'Không'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Create Class Modal */}
      {showCreateClass && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white rounded-t-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">➕</span>
                Tạo Lớp Học Mới
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Lớp Học
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                  placeholder="Ví dụ: Toán Cao Cấp A1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô Tả
                </label>
                <textarea
                  value={classDescription}
                  onChange={(e) => setClassDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition resize-none"
                  rows={4}
                  placeholder="Mô tả ngắn về lớp học này..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCreateClass}
                  disabled={!className}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 shadow-lg transition transform hover:scale-105 disabled:transform-none"
                >
                  Tạo Lớp
                </button>
                <button
                  onClick={() => {
                    setShowCreateClass(false);
                    setClassName('');
                    setClassDescription('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-600 text-sm">
          <p>Nền Tảng Khảo Thí Thông Minh © 2024 - Dành cho Giảng Viên</p>
        </div>
      </footer>
    </div>
  );
};

export default InstructorDashboard;

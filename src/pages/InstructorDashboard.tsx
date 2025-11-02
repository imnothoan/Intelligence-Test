import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Class } from '@/types';

const InstructorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, classes, exams, addClass } = useStore();
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Bảng Điều Khiển Giảng Viên
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
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate('/instructor/exam/create')}
            className="p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-slate-400 transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tạo Đề Thi</h3>
            <p className="text-sm text-gray-600">
              Tạo bài kiểm tra với AI
            </p>
          </button>

          <button
            onClick={() => navigate('/instructor/question-bank')}
            className="p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-slate-400 transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ngân Hàng Câu Hỏi</h3>
            <p className="text-sm text-gray-600">
              Quản lý kho câu hỏi
            </p>
          </button>

          <button
            onClick={() => navigate('/instructor/monitoring')}
            className="p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-slate-400 transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Giám Sát</h3>
            <p className="text-sm text-gray-600">
              Theo dõi bài thi trực tiếp
            </p>
          </button>

          <button
            onClick={() => navigate('/instructor/analytics')}
            className="p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-slate-400 transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phân Tích</h3>
            <p className="text-sm text-gray-600">
              Báo cáo và thống kê
            </p>
          </button>
        </div>

        {/* Additional Actions Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setShowCreateClass(true)}
            className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-slate-400 transition text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Tạo Lớp Học</h3>
            <p className="text-sm text-gray-600">
              Thiết lập lớp học mới
            </p>
          </button>

          <button
            onClick={() => navigate('/guide')}
            className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-slate-400 transition text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Hướng Dẫn</h3>
            <p className="text-sm text-gray-600">
              Tìm hiểu các tính năng
            </p>
          </button>

          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-1">Trạng Thái</h3>
            <p className="text-sm text-gray-600">
              Đồng bộ hóa đám mây
            </p>
          </div>
        </div>

        {/* Classes Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lớp Học Của Tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorClasses.length === 0 ? (
              <p className="text-gray-600 col-span-full bg-white p-6 rounded-lg border-2 border-gray-200">
                Chưa có lớp học nào. Tạo lớp học đầu tiên!
              </p>
            ) : (
              instructorClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-slate-400 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/instructor/class/${cls.id}`)}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {cls.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {cls.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{cls.students.length} sinh viên</span>
                    <span>{cls.exams.length} bài thi</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Exams Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Đề Thi Của Tôi</h2>
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            {instructorExams.length === 0 ? (
              <p className="p-6 text-gray-600">
                Chưa có đề thi nào. Tạo đề thi đầu tiên của bạn!
              </p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Tiêu Đề
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Số Câu Hỏi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Thời Gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      CAT
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instructorExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {exam.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {exam.questions.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {exam.duration} phút
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {exam.isAdaptive ? 'Có' : 'Không'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Create Class Modal */}
      {showCreateClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tạo Lớp Học Mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Lớp Học
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                  placeholder="Ví dụ: Toán Cao Cấp A1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô Tả
                </label>
                <textarea
                  value={classDescription}
                  onChange={(e) => setClassDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                  rows={3}
                  placeholder="Mô tả ngắn về lớp học"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleCreateClass}
                  className="flex-1 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900"
                >
                  Tạo Lớp
                </button>
                <button
                  onClick={() => setShowCreateClass(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;

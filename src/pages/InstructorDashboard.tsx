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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Instructor Dashboard
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
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/instructor/exam/create')}
            className="p-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <div className="text-3xl mb-2">📝</div>
            <h3 className="text-xl font-semibold">Create New Exam</h3>
            <p className="text-sm mt-2 opacity-90">
              Use AI to generate questions with CAT algorithm
            </p>
          </button>

          <button
            onClick={() => setShowCreateClass(true)}
            className="p-6 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-xl font-semibold">Create New Class</h3>
            <p className="text-sm mt-2 opacity-90">
              Set up a new class and add students
            </p>
          </button>

          <div className="p-6 bg-purple-600 text-white rounded-lg shadow">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-xl font-semibold">View Analytics</h3>
            <p className="text-sm mt-2 opacity-90">
              Monitor student performance and progress
            </p>
          </div>
        </div>

        {/* Classes Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorClasses.length === 0 ? (
              <p className="text-gray-600 col-span-full">
                No classes yet. Create your first class to get started!
              </p>
            ) : (
              instructorClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/instructor/class/${cls.id}`)}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {cls.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {cls.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{cls.students.length} students</span>
                    <span>{cls.exams.length} exams</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Exams Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Exams</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {instructorExams.length === 0 ? (
              <p className="p-6 text-gray-600">
                No exams yet. Create your first exam!
              </p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Questions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      CAT Enabled
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instructorExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {exam.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exam.questions.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exam.duration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exam.isAdaptive ? '✅ Yes' : '❌ No'}
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
            <h2 className="text-2xl font-bold mb-4">Create New Class</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Advanced Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={classDescription}
                  onChange={(e) => setClassDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief description of the class"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleCreateClass}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateClass(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
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

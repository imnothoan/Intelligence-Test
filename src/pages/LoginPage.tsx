import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'instructor' | 'student'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const { addUser } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Handle registration
        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          alert('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }

        // Create new user
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          name,
          role,
          createdAt: new Date(),
        };

        addUser(newUser);
        alert('Account created successfully! Please login.');
        setIsSignUp(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        // Handle login
        await login(email, password, role);
        navigate(role === 'instructor' ? '/instructor' : '/student');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert(isSignUp ? 'Registration failed. Please try again.' : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl flex shadow-xl rounded-xl overflow-hidden">
        {/* Left side - Welcome section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-12 flex-col justify-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            Nền Tảng Khảo Thí Thông Minh
          </h1>
          <p className="text-lg mb-6 text-slate-300">
            Intelligence Test Platform
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                <span className="text-sm font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Adaptive Testing (CAT)</h3>
                <p className="text-sm text-slate-400">Item Response Theory based intelligent question selection</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                <span className="text-sm font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Features</h3>
                <p className="text-sm text-slate-400">Automatic question generation and essay grading</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                <span className="text-sm font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Monitoring</h3>
                <p className="text-sm text-slate-400">Anti-cheat detection and live exam tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 bg-white p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Tạo Tài Khoản' : 'Đăng Nhập'}
            </h2>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Điền thông tin để tạo tài khoản mới' 
                : 'Chào mừng trở lại với hệ thống'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật Khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition"
                placeholder={isSignUp ? "Tối thiểu 6 ký tự" : "Nhập mật khẩu"}
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác Nhận Mật Khẩu
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai Trò
              </label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => setRole(e.target.value as 'student')}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg text-center transition ${
                    role === 'student' 
                      ? 'border-slate-800 bg-slate-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <span className="font-medium text-gray-800">Sinh Viên</span>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    value="instructor"
                    checked={role === 'instructor'}
                    onChange={(e) => setRole(e.target.value as 'instructor')}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg text-center transition ${
                    role === 'instructor' 
                      ? 'border-slate-800 bg-slate-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <span className="font-medium text-gray-800">Giảng Viên</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? (isSignUp ? 'Đang tạo tài khoản...' : 'Đang đăng nhập...') 
                : (isSignUp ? 'Tạo Tài Khoản' : 'Đăng Nhập')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-slate-700 hover:text-slate-900 font-medium"
            >
              {isSignUp 
                ? 'Đã có tài khoản? Đăng nhập' 
                : 'Chưa có tài khoản? Đăng ký ngay'}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Tài khoản demo:</p>
              <p className="text-xs text-gray-600">Giảng viên: instructor@test.com</p>
              <p className="text-xs text-gray-600">Sinh viên: student@test.com</p>
              <p className="text-xs text-gray-500 mt-1">Mật khẩu: bất kỳ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

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
  const [showPassword, setShowPassword] = useState(false);
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
          alert('Mật khẩu xác nhận không khớp!');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          alert('Mật khẩu phải có ít nhất 6 ký tự.');
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
        alert('Tạo tài khoản thành công! Vui lòng đăng nhập.');
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
      alert(isSignUp ? 'Đăng ký thất bại. Vui lòng thử lại.' : 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative w-full max-w-6xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left side - Welcome section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -ml-40 -mb-40"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-3">
                <span className="text-4xl">🎓</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Nền Tảng Khảo Thí
                </h1>
                <p className="text-blue-100 text-sm">Intelligence Test Platform</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Adaptive Testing (CAT)</h3>
                    <p className="text-sm text-blue-100">Hệ thống thích ứng thông minh dựa trên Item Response Theory</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Tích Hợp AI</h3>
                    <p className="text-sm text-blue-100">Tự động sinh câu hỏi và chấm điểm bài luận bằng AI</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                    <span className="text-2xl">📹</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Giám Sát Thời Gian Thực</h3>
                    <p className="text-sm text-blue-100">Phát hiện gian lận và theo dõi bài thi trực tiếp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="flex items-center gap-3 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Trực tuyến</span>
              </div>
              <span>•</span>
              <span>Bảo mật cao</span>
              <span>•</span>
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {isSignUp ? 'Tạo Tài Khoản' : 'Đăng Nhập'}
            </h2>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Điền thông tin để bắt đầu hành trình học tập' 
                : 'Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="transform transition hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và Tên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>
            )}

            <div className="transform transition hover:scale-[1.01]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="transform transition hover:scale-[1.01]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật Khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  placeholder={isSignUp ? "Tối thiểu 6 ký tự" : "Nhập mật khẩu"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="transform transition hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Xác Nhận Mật Khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Vai Trò
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer group">
                  <input
                    type="radio"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => setRole(e.target.value as 'student')}
                    className="sr-only"
                  />
                  <div className={`p-5 border-2 rounded-xl text-center transition transform group-hover:scale-105 ${
                    role === 'student' 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-3xl mb-2">🎓</div>
                    <span className="font-semibold text-gray-800">Sinh Viên</span>
                  </div>
                </label>
                <label className="cursor-pointer group">
                  <input
                    type="radio"
                    value="instructor"
                    checked={role === 'instructor'}
                    onChange={(e) => setRole(e.target.value as 'instructor')}
                    className="sr-only"
                  />
                  <div className={`p-5 border-2 rounded-xl text-center transition transform group-hover:scale-105 ${
                    role === 'instructor' 
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-3xl mb-2">👨‍🏫</div>
                    <span className="font-semibold text-gray-800">Giảng Viên</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignUp ? 'Đang tạo tài khoản...' : 'Đang đăng nhập...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isSignUp ? '🚀 Tạo Tài Khoản' : '🔐 Đăng Nhập'}
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline"
            >
              {isSignUp 
                ? '← Đã có tài khoản? Đăng nhập ngay' 
                : 'Chưa có tài khoản? Đăng ký miễn phí →'}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-blue-500 rounded-lg p-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 mb-2">Tài khoản demo:</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Giảng viên:</span> instructor@test.com
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Sinh viên:</span> student@test.com
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                      💡 Mật khẩu: bất kỳ (để demo)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

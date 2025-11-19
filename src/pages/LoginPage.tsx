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
  const { login, register } = useStore();

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

        // Register new user via API
        await register(email, password, name, role);
        alert('Tạo tài khoản thành công!');
        navigate(role === 'instructor' ? '/instructor' : '/student');
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
    <div className="min-h-screen bg-academic-50 flex items-center justify-center p-4">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

      <div className="relative w-full max-w-5xl flex bg-white rounded-lg shadow-academic-lg overflow-hidden border border-academic-200">
        {/* Left side - Academic Welcome section */}
        <div className="hidden lg:flex lg:w-1/2 bg-academic-900 p-12 flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="bg-white/10 rounded-lg p-2.5">
                  <span className="text-3xl">🎓</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Nền Tảng Khảo Thí
                  </h1>
                  <p className="text-academic-300 text-sm">Intelligence Test Platform</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-xl">🧠</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">Adaptive Testing (CAT)</h3>
                    <p className="text-sm text-academic-300 leading-relaxed">Hệ thống thích ứng thông minh dựa trên Item Response Theory</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">Tích Hợp AI</h3>
                    <p className="text-sm text-academic-300 leading-relaxed">Tự động sinh câu hỏi và chấm điểm bài luận bằng AI</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-xl">📹</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">Giám Sát Thời Gian Thực</h3>
                    <p className="text-sm text-academic-300 leading-relaxed">Phát hiện gian lận và theo dõi bài thi trực tiếp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="flex items-center gap-3 text-sm text-academic-400">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Bảo mật cao</span>
              </div>
              <span>•</span>
              <span>Hỗ trợ 24/7</span>
              <span>•</span>
              <span>Miễn phí</span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-academic-900 mb-2">
              {isSignUp ? 'Tạo Tài Khoản' : 'Đăng Nhập'}
            </h2>
            <p className="text-academic-600">
              {isSignUp 
                ? 'Điền thông tin để bắt đầu hành trình học tập' 
                : 'Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-academic-700 mb-2">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="academic-input"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-academic-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="academic-input"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-academic-700 mb-2">
                Mật Khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="academic-input pr-11"
                  placeholder={isSignUp ? "Tối thiểu 6 ký tự" : "Nhập mật khẩu"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-academic-400 hover:text-academic-600"
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
              <div>
                <label className="block text-sm font-medium text-academic-700 mb-2">
                  Xác Nhận Mật Khẩu
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="academic-input"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-academic-700 mb-3">
                Vai Trò
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => setRole(e.target.value as 'student')}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg text-center transition ${
                    role === 'student' 
                      ? 'border-academic-900 bg-academic-50' 
                      : 'border-academic-300 hover:border-academic-400 bg-white'
                  }`}>
                    <div className="text-2xl mb-1.5">🎓</div>
                    <span className="font-medium text-academic-900 text-sm">Sinh Viên</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="instructor"
                    checked={role === 'instructor'}
                    onChange={(e) => setRole(e.target.value as 'instructor')}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg text-center transition ${
                    role === 'instructor' 
                      ? 'border-academic-900 bg-academic-50' 
                      : 'border-academic-300 hover:border-academic-400 bg-white'
                  }`}>
                    <div className="text-2xl mb-1.5">👨‍🏫</div>
                    <span className="font-medium text-academic-900 text-sm">Giảng Viên</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="academic-button-primary w-full py-3 text-base"
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
                isSignUp ? 'Tạo Tài Khoản' : 'Đăng Nhập'
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-academic-600 hover:text-academic-900 font-medium text-sm transition"
            >
              {isSignUp 
                ? '← Đã có tài khoản? Đăng nhập ngay' 
                : 'Chưa có tài khoản? Đăng ký miễn phí →'}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-6 bg-academic-50 rounded-lg p-5 border border-academic-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-academic-900 rounded p-1.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-academic-900 mb-2">Tài khoản demo:</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-academic-700">
                      <span className="font-medium">Giảng viên:</span> instructor@test.com
                    </p>
                    <p className="text-academic-700">
                      <span className="font-medium">Sinh viên:</span> student@test.com
                    </p>
                    <p className="text-academic-600 text-xs mt-2">
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

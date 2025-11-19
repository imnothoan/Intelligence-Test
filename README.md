# Intelligence Test Platform 🎓

Nền tảng thi cử thông minh hiện đại với công nghệ AI, CAT (Computerized Adaptive Testing), và giám sát chống gian lận tự động.

## 🏗️ Kiến Trúc

- **Client**: React + TypeScript (Repository này)
- **Server**: [Intelligence Test Server](https://github.com/imnothoan/Intelligence-Test-Server)
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini (MIỄN PHÍ)

## ✨ Tính Năng

### 🎓 Giáo Viên
- Tạo đề thi với CAT algorithm
- Giám sát thời gian thực qua WebSocket
- Phát hiện gian lận tự động (camera + AI)
- Tạo câu hỏi tự động bằng Gemini AI
- Phân tích kết quả chi tiết

### 📝 Học Sinh
- Thi thích ứng với CAT
- Toàn màn hình + camera monitoring
- Câu trắc nghiệm và tự luận
- Kết quả tức thời

### 🤖 Công Nghệ
- React 19 + TypeScript + Vite
- Tailwind CSS v4 (giao diện trắng/xám)
- TensorFlow.js + BlazeFace (anti-cheat)
- Google Gemini AI (MIỄN PHÍ)
- Supabase + WebSocket

## 📋 Yêu Cầu

- Node.js 18+
- Webcam
- [Gemini API key](https://makersuite.google.com/app/apikey) (miễn phí)
- [Supabase account](https://supabase.com) (miễn phí)

## 🚀 Cài Đặt

### 1. Clone Repositories

```bash
# Client
git clone https://github.com/imnothoan/Intelligence-Test.git
cd Intelligence-Test
npm install

# Server (terminal mới)
git clone https://github.com/imnothoan/Intelligence-Test-Server.git
cd Intelligence-Test-Server
npm install
```

### 2. Cấu Hình Supabase

1. Tạo project tại [supabase.com](https://supabase.com)
2. Chạy SQL từ `Intelligence-Test-Server/supabase/migrations/001_initial_schema.sql`
3. Lấy URL và keys từ Project Settings

### 3. Environment Variables

**Server** (.env):
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
GEMINI_API_KEY=AIza...
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

**Client** (.env):
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GEMINI_API_KEY=AIza...
```

### 4. Chạy

```bash
# Terminal 1 - Server
cd Intelligence-Test-Server
npm run dev

# Terminal 2 - Client  
cd Intelligence-Test
npm run dev
```

Truy cập: **http://localhost:5173**

## 🎮 Demo Accounts

**Giáo viên:**
- Email: `instructor@test.com`
- Password: any

**Học sinh:**
- Email: `student@test.com`
- Password: any

## 📚 Sử Dụng

### Giáo Viên
1. Tạo lớp học và thêm học sinh
2. Tạo ngân hàng câu hỏi (thủ công hoặc AI)
3. Tạo đề thi với CAT/anti-cheat
4. Giám sát học sinh thi real-time
5. Xem phân tích kết quả

### Học Sinh
1. Đăng nhập
2. Chọn bài thi
3. Cho phép camera (nếu yêu cầu)
4. Làm bài (câu hỏi thích ứng với năng lực)
5. Xem kết quả

## 🔧 Build

```bash
npm run build
npm run preview
```

## 📄 License

MIT License

## 👥 Author

[@imnothoan](https://github.com/imnothoan)

# Hướng Dẫn Cài Đặt Hệ Thống

## Tổng Quan

Hệ thống Intelligence Test Platform bao gồm 2 phần:
- **Client** (Repository này): React + TypeScript frontend
- **Server**: Node.js + Express backend ([Intelligence-Test-Server](https://github.com/imnothoan/Intelligence-Test-Server))

## Yêu Cầu Hệ Thống

- Node.js 18+ và npm
- Trình duyệt hỗ trợ webcam (Chrome, Firefox, Edge)
- Tài khoản Supabase (miễn phí)
- Google Gemini API key (miễn phí)

## Bước 1: Chuẩn Bị

### 1.1. Tạo Tài Khoản Supabase

1. Truy cập https://supabase.com
2. Đăng ký tài khoản miễn phí
3. Tạo project mới
4. Lưu lại:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 1.2. Lấy Gemini API Key (Miễn Phí)

1. Truy cập https://makersuite.google.com/app/apikey
2. Click "Get API Key" → "Create API key in new project"
3. Copy key (bắt đầu với `AIza...`)

### 1.3. Generate JWT Secret

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Bước 2: Cài Đặt Server

### 2.1. Clone Repository

```bash
git clone https://github.com/imnothoan/Intelligence-Test-Server.git
cd Intelligence-Test-Server
npm install
```

### 2.2. Cấu Hình Database

1. Trong Supabase Dashboard, mở SQL Editor
2. Copy nội dung file `supabase/migrations/001_initial_schema.sql`
3. Chạy SQL để tạo tables

### 2.3. Cấu Hình Environment

Tạo file `.env`:

```env
NODE_ENV=development
PORT=3000
API_PREFIX=/api

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-generated-secret-key
JWT_REFRESH_SECRET=your-generated-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Gemini AI
GEMINI_API_KEY=AIza...your-key

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# WebSocket
WS_PORT=3001
```

### 2.4. Chạy Server

```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:3000

## Bước 3: Cài Đặt Client

### 3.1. Clone Repository

```bash
git clone https://github.com/imnothoan/Intelligence-Test.git
cd Intelligence-Test
npm install
```

### 3.2. Cấu Hình Environment

Tạo file `.env`:

```env
# Backend Server API URL
VITE_API_BASE_URL=http://localhost:3000/api

# Google Gemini API Key
VITE_GEMINI_API_KEY=AIza...your-key

# Development mode
VITE_DEV_MODE=false
```

### 3.3. Chạy Client

```bash
npm run dev
```

Client sẽ chạy tại: http://localhost:5173

## Bước 4: Kiểm Tra Hệ Thống

### 4.1. Test API Server

```bash
curl http://localhost:3000/health
```

Kết quả mong đợi:
```json
{
  "success": true,
  "message": "Intelligence Test Server is running",
  "timestamp": "...",
  "environment": "development"
}
```

### 4.2. Test Client

1. Mở http://localhost:5173
2. Nên thấy trang đăng nhập
3. Thử đăng ký tài khoản mới

### 4.3. Test WebSocket

1. Đăng nhập với tài khoản giáo viên
2. Tạo đề thi
3. Vào "Monitor Exams"
4. Kiểm tra connection status (nên hiển thị "Connected")

## Bước 5: Demo Data (Tùy Chọn)

Database đã có 2 tài khoản demo:

**Giáo viên:**
- Email: `instructor@test.com`
- Password: bất kỳ (authentication đơn giản để demo)

**Học sinh:**
- Email: `student@test.com`  
- Password: bất kỳ

## Troubleshooting

### Server không kết nối được Supabase

- Kiểm tra `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY`
- Verify database tables đã được tạo
- Check logs: `npm run dev`

### Client không kết nối được Server

- Verify server đang chạy: http://localhost:3000/health
- Check CORS configuration trong server `.env`
- Verify `VITE_API_BASE_URL` trong client `.env`

### WebSocket không connect

- Verify `WS_PORT` trong server `.env`
- Check firewall settings
- Try restart cả server và client

### Gemini API không hoạt động

- Verify API key correct và không expired
- Check quota limits (60 requests/minute)
- Try regenerate API key

## Production Deployment

### Server Deployment

Recommended: Railway, Render, or VPS

```bash
npm run build
npm start
```

Environment variables cần thiết:
- `NODE_ENV=production`
- Cập nhật `CORS_ORIGIN` với domain thực tế
- Sử dụng PostgreSQL production database

### Client Deployment  

Recommended: Vercel, Netlify

```bash
npm run build
```

Cấu hình environment variables trong platform:
- `VITE_API_BASE_URL`: URL server production
- `VITE_GEMINI_API_KEY`: Gemini API key
- `VITE_DEV_MODE=false`

## Tính Năng Chính

✅ Đăng nhập/Đăng ký với JWT authentication  
✅ Tạo đề thi với CAT algorithm  
✅ Tạo câu hỏi tự động với Gemini AI  
✅ Thi online với camera monitoring  
✅ Phát hiện gian lận real-time  
✅ WebSocket monitoring cho giáo viên  
✅ Chấm bài tự luận tự động với AI  
✅ Thống kê và phân tích kết quả  

## Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Check logs của cả server và client
2. Verify environment variables
3. Test API endpoints với curl/Postman
4. Open issue trên GitHub

## License

MIT License - Copyright (c) 2024

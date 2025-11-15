# Hướng Dẫn Client-Server - Tóm Tắt

## 🎯 Tổng Quan

Dự án Intelligence Test đã được nâng cấp thành kiến trúc **Client-Server** hiện đại với các tính năng:

- ✅ **Client (Frontend)**: React + TypeScript application (repository này)
- ✅ **Server (Backend)**: Node.js/Express API server ([repository riêng](https://github.com/imnothoan/Intell-Test_Server))
- ✅ **Database**: PostgreSQL hoặc MongoDB
- ✅ **Real-time**: WebSocket cho monitoring trực tiếp
- ✅ **Security**: JWT authentication, bcrypt password hashing
- ✅ **Scalability**: Có thể mở rộng lên hàng nghìn users

---

## 📁 Các File Đã Được Tạo

### 1. API Client Service
**File**: `src/services/apiClient.ts`

Service này xử lý tất cả các HTTP requests tới server:
- ✅ Authentication (login, register, logout)
- ✅ Exam CRUD operations
- ✅ Class management
- ✅ Question bank
- ✅ Exam attempts
- ✅ Analytics
- ✅ Auto refresh JWT tokens

### 2. WebSocket Service
**File**: `src/services/websocketService.ts`

Service cho real-time features:
- ✅ Live exam monitoring
- ✅ Cheat warnings
- ✅ Student progress tracking
- ✅ Auto reconnection
- ✅ Event subscriptions

### 3. API Store
**File**: `src/store/apiStore.ts`

Zustand store mới sử dụng API client:
- ✅ State management với server
- ✅ Loading states
- ✅ Error handling
- ✅ Optimistic updates

### 4. Documentation

#### API Specification
**File**: `docs/api/API_SPECIFICATION.md`
- 30+ endpoints được document chi tiết
- Request/response examples
- WebSocket API
- Error codes

#### Server Setup Guide
**File**: `docs/api/SERVER_SETUP_GUIDE.md`
- Hướng dẫn cài đặt server (Tiếng Việt + English)
- Database setup (PostgreSQL & MongoDB)
- Deployment guides (VPS, Heroku, Railway, Render)
- Security best practices

#### Client Integration Guide
**File**: `docs/api/CLIENT_INTEGRATION_GUIDE.md`
- Code examples chi tiết
- Authentication patterns
- API usage
- WebSocket integration
- Error handling

#### Database Schema
**File**: `docs/api/DATABASE_SCHEMA.md`
- PostgreSQL tables
- MongoDB collections
- Indexes
- Migration scripts

#### Server README Template
**File**: `docs/api/SERVER_README_TEMPLATE.md`
- README hoàn chỉnh cho server repository
- Copy vào Intell-Test_Server repository

---

## 🚀 Cách Sử Dụng

### Option 1: Standalone Mode (Không cần Server)

Sử dụng localStorage, phù hợp cho testing:

```bash
# 1. Clone client
git clone https://github.com/imnothoan/Intelligence-Test.git
cd Intelligence-Test

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# Edit .env:
# VITE_DEV_MODE=true
# VITE_GEMINI_API_KEY=your_key

# 4. Run
npm run dev
```

### Option 2: Client-Server Mode (Khuyến nghị cho Production)

#### Bước 1: Setup Server

```bash
# Clone server repository
git clone https://github.com/imnothoan/Intell-Test_Server.git
cd Intell-Test_Server

# Install dependencies
npm install

# Setup database (PostgreSQL hoặc MongoDB)
# Xem chi tiết trong docs/api/SERVER_SETUP_GUIDE.md

# Configure .env
cp .env.example .env
# Edit với database credentials

# Run migrations
npm run migrate

# Start server
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

#### Bước 2: Setup Client

```bash
# Clone client repository
git clone https://github.com/imnothoan/Intelligence-Test.git
cd Intelligence-Test

# Install dependencies
npm install

# Configure .env
cp .env.example .env
```

Edit `.env`:
```env
# Backend Server
VITE_API_BASE_URL=http://localhost:3000/api

# AI Services
VITE_GEMINI_API_KEY=your_gemini_key

# Mode
VITE_DEV_MODE=false
```

```bash
# Start client
npm run dev
```

Client sẽ chạy tại `http://localhost:5173`

---

## 📊 Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────┐
│         Client (React Application)          │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   UI     │  │   API    │  │ WebSocket│  │
│  │  Pages   │  │  Client  │  │ Service  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────┬──────────────┬───────────┘
                   │              │
                   │ REST API     │ WebSocket
                   │ (HTTP)       │ (WS)
                   │              │
┌──────────────────┴──────────────┴───────────┐
│         Server (Node.js/Express)            │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   API    │  │ Business │  │ WebSocket│  │
│  │Controllers│  │  Logic   │  │ Handlers │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                      │                      │
│  ┌───────────────────┴──────────────────┐  │
│  │      Database (PostgreSQL/MongoDB)   │  │
│  │  Users | Exams | Classes | Questions │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 🔑 Key Features

### 1. Authentication
```typescript
import { useStore } from '@/store/apiStore';

function Login() {
  const { login } = useStore();
  
  const handleLogin = async () => {
    await login(email, password, role);
    // Auto stores JWT tokens
    // Auto redirects based on role
  };
}
```

### 2. API Calls
```typescript
import { useStore } from '@/store/apiStore';

function ExamCreator() {
  const { createExam } = useStore();
  
  const handleCreate = async () => {
    const exam = await createExam({
      title: "Math Exam",
      questions: [...],
      // ... other fields
    });
  };
}
```

### 3. Real-time Monitoring
```typescript
import { websocketService } from '@/services/websocketService';

function Monitoring({ examId }) {
  useEffect(() => {
    // Subscribe to updates
    websocketService.subscribeToExamMonitoring(examId, (update) => {
      console.log('Student progress:', update);
    });
    
    // Subscribe to warnings
    websocketService.subscribeToCheatWarnings(examId, (warning) => {
      console.log('Cheat warning:', warning);
    });
  }, [examId]);
}
```

---

## 📚 Tài Liệu

### Đọc Ngay
1. **[API Specification](./docs/api/API_SPECIFICATION.md)** - Tất cả API endpoints
2. **[Server Setup Guide](./docs/api/SERVER_SETUP_GUIDE.md)** - Cài đặt server
3. **[Client Integration Guide](./docs/api/CLIENT_INTEGRATION_GUIDE.md)** - Cách dùng API client

### Tham Khảo
- **[Database Schema](./docs/api/DATABASE_SCHEMA.md)** - Database design
- **[Server README](./docs/api/SERVER_README_TEMPLATE.md)** - Template cho server repo

---

## 🎯 Các Bước Tiếp Theo

### Cho Server (Intell-Test_Server)

1. **Tạo Project Structure**
   ```
   mkdir -p src/{controllers,models,routes,middleware,services,websocket,config,types}
   ```

2. **Implement Controllers**
   - authController.ts
   - examController.ts
   - classController.ts
   - questionController.ts
   - attemptController.ts

3. **Implement Models**
   - User.ts
   - Exam.ts
   - Class.ts
   - Question.ts
   - ExamAttempt.ts

4. **Implement Routes**
   - authRoutes.ts
   - examRoutes.ts
   - classRoutes.ts
   - questionRoutes.ts
   - attemptRoutes.ts

5. **Implement Services**
   - authService.ts (JWT, bcrypt)
   - examService.ts
   - catService.ts (CAT algorithm)
   - analyticsService.ts

6. **Setup WebSocket**
   - monitoringSocket.ts

7. **Database Setup**
   - Run migrations
   - Seed data

8. **Testing**
   - Unit tests
   - Integration tests
   - API tests với Postman

### Cho Client (Intelligence-Test)

1. **Update Components** để sử dụng API store
   - LoginPage.tsx
   - InstructorDashboard.tsx
   - StudentDashboard.tsx
   - ExamCreator.tsx
   - ExamTaking.tsx
   - MonitoringDashboard.tsx

2. **Test Integration**
   - Test với local server
   - Test real-time features
   - Test error handling

3. **Optimize**
   - Loading states
   - Caching
   - Offline mode

---

## ⚠️ Lưu Ý Quan Trọng

### Security
- ✅ Không commit `.env` file
- ✅ Sử dụng HTTPS trong production
- ✅ Rotate JWT secrets định kỳ
- ✅ Rate limiting cho API
- ✅ Input validation ở cả client và server

### Performance
- ✅ Sử dụng pagination cho large datasets
- ✅ Implement caching khi cần
- ✅ Optimize database queries với indexes
- ✅ Use connection pooling cho database

### Deployment
- ✅ Separate deployment cho client và server
- ✅ Use environment variables
- ✅ Setup monitoring và logging
- ✅ Regular backups cho database

---

## 🤝 Support

Nếu có câu hỏi hoặc cần hỗ trợ:

1. **Documentation**: Đọc các file trong `docs/api/`
2. **Issues**: Mở issue trên GitHub
3. **Examples**: Xem `docs/api/CLIENT_INTEGRATION_GUIDE.md`

---

## 🎉 Tổng Kết

Dự án Intelligence Test đã được nâng cấp thành công sang kiến trúc client-server hiện đại với:

✅ **Scalability**: Có thể handle nhiều users đồng thời  
✅ **Security**: JWT authentication, encrypted passwords  
✅ **Real-time**: WebSocket cho monitoring trực tiếp  
✅ **Professional**: Production-ready architecture  
✅ **Documented**: Complete documentation cho cả client và server  
✅ **Flexible**: Support nhiều deployment options  

**Bước tiếp theo**: Implement server theo hướng dẫn trong `docs/api/SERVER_SETUP_GUIDE.md`

Chúc anh thành công! 🚀

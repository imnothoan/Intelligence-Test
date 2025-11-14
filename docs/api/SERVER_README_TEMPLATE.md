# Intelligence Test Server - README (cho Server Repository)

> **Lưu ý**: File này dành cho repository **Intell-Test_Server** (Backend)
> 
> Đây là template README.md hoàn chỉnh để đặt vào repository server.

---

# 🎓 Intelligence Test Server

Backend API server cho nền tảng thi trực tuyến Intelligence Test Platform.

## 📋 Tổng quan / Overview

Intelligence Test Server cung cấp RESTful API và WebSocket connections để hỗ trợ:

- ✅ **Xác thực người dùng** với JWT tokens
- ✅ **Quản lý kỳ thi** (tạo, sửa, xóa exams)
- ✅ **Quản lý lớp học** và học sinh
- ✅ **Ngân hàng câu hỏi** với tìm kiếm và filtering
- ✅ **Bài thi thích ứng** (CAT algorithm)
- ✅ **Giám sát real-time** với WebSocket
- ✅ **Anti-cheat detection** và cảnh báo
- ✅ **Analytics** và báo cáo chi tiết

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14 hoặc **MongoDB** >= 5
- **npm** hoặc **yarn**

### Installation

```bash
# Clone repository
git clone https://github.com/imnothoan/Intell-Test_Server.git
cd Intell-Test_Server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your .env file
nano .env

# Run database migrations (for PostgreSQL)
npm run migrate

# Start development server
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

## 📁 Project Structure

```
Intell-Test_Server/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── authController.ts
│   │   ├── examController.ts
│   │   ├── classController.ts
│   │   ├── questionController.ts
│   │   └── attemptController.ts
│   ├── models/              # Database models
│   │   ├── User.ts
│   │   ├── Exam.ts
│   │   ├── Class.ts
│   │   ├── Question.ts
│   │   └── ExamAttempt.ts
│   ├── routes/              # API routes
│   │   ├── authRoutes.ts
│   │   ├── examRoutes.ts
│   │   ├── classRoutes.ts
│   │   ├── questionRoutes.ts
│   │   └── attemptRoutes.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── services/            # Business logic
│   │   ├── authService.ts
│   │   ├── examService.ts
│   │   ├── catService.ts
│   │   └── analyticsService.ts
│   ├── websocket/           # WebSocket handlers
│   │   └── monitoringSocket.ts
│   ├── config/              # Configuration
│   │   ├── database.ts
│   │   └── jwt.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── helpers.ts
│   └── app.ts               # Express app
├── tests/                   # Test files
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Configuration

### Environment Variables

Tạo file `.env` với nội dung:

```env
# Server
NODE_ENV=development
PORT=3000
HOST=localhost

# Database (PostgreSQL)
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=intelligence_test
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Setup

#### PostgreSQL

```bash
# Kết nối PostgreSQL
sudo -u postgres psql

# Tạo database và user
CREATE DATABASE intelligence_test;
CREATE USER your_db_user WITH PASSWORD 'your_db_password';
GRANT ALL PRIVILEGES ON DATABASE intelligence_test TO your_db_user;
\q

# Run migrations
npm run migrate
```

#### MongoDB

```bash
# Start MongoDB
sudo systemctl start mongod

# Database sẽ tự động được tạo khi server chạy
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register    - Đăng ký tài khoản mới
POST   /api/auth/login       - Đăng nhập
POST   /api/auth/logout      - Đăng xuất
POST   /api/auth/refresh     - Refresh access token
GET    /api/auth/me          - Lấy thông tin user hiện tại
```

### Users

```
GET    /api/users/:userId           - Lấy thông tin user
PUT    /api/users/:userId           - Cập nhật user
GET    /api/users/email/:email      - Tìm user theo email
```

### Exams

```
POST   /api/exams                         - Tạo exam mới
GET    /api/exams/:examId                 - Lấy thông tin exam
PUT    /api/exams/:examId                 - Cập nhật exam
DELETE /api/exams/:examId                 - Xóa exam
GET    /api/exams/instructor/:instructorId - Lấy exams của instructor
GET    /api/exams/class/:classId          - Lấy exams của class
GET    /api/exams/student/:studentId/available - Lấy exams available cho student
```

### Classes

```
POST   /api/classes                       - Tạo class mới
GET    /api/classes/:classId              - Lấy thông tin class
PUT    /api/classes/:classId              - Cập nhật class
DELETE /api/classes/:classId              - Xóa class
GET    /api/classes/instructor/:instructorId - Lấy classes của instructor
POST   /api/classes/:classId/students     - Thêm student vào class
DELETE /api/classes/:classId/students/:studentId - Xóa student khỏi class
```

### Questions

```
POST   /api/questions          - Tạo question mới
GET    /api/questions/:id      - Lấy question
PUT    /api/questions/:id      - Cập nhật question
DELETE /api/questions/:id      - Xóa question
GET    /api/questions/search   - Tìm kiếm questions
```

### Exam Attempts

```
POST   /api/exams/:examId/attempts         - Bắt đầu exam
GET    /api/attempts/:attemptId            - Lấy thông tin attempt
PUT    /api/attempts/:attemptId            - Cập nhật attempt
POST   /api/attempts/:attemptId/submit     - Nộp bài
GET    /api/exams/:examId/attempts         - Lấy attempts của exam
GET    /api/students/:studentId/attempts   - Lấy attempts của student
```

### Monitoring

```
POST   /api/attempts/:attemptId/warnings      - Báo cáo cheat warning
GET    /api/exams/:examId/sessions/active    - Lấy active sessions
GET    /api/exams/:examId/attempts/flagged   - Lấy flagged attempts
```

### Analytics

```
GET    /api/exams/:examId/statistics           - Thống kê exam
GET    /api/exams/:examId/analytics/questions  - Phân tích questions
GET    /api/students/:studentId/performance    - Performance của student
```

## 🔄 WebSocket API

### Connection

```javascript
const ws = new WebSocket('ws://localhost:3000/ws/monitoring/:examId');

// Authenticate
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'your_access_token'
  }));
};
```

### Events

**Client → Server:**
- `exam_progress` - Báo cáo tiến độ
- `cheat_warning` - Báo cáo cảnh báo gian lận
- `ping` - Heartbeat

**Server → Client:**
- `exam_started` - Có học sinh bắt đầu thi
- `exam_completed` - Học sinh hoàn thành
- `student_joined` - Học sinh vào phòng thi
- `student_left` - Học sinh rời phòng
- `cheat_warning` - Cảnh báo gian lận mới
- `pong` - Heartbeat response

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

## 📦 Deployment

### Deploy lên VPS

```bash
# 1. Setup server
ssh user@your-server-ip
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2
sudo npm install -g pm2

# 4. Clone và setup
cd /var/www
git clone https://github.com/imnothoan/Intell-Test_Server.git
cd Intell-Test_Server
npm install --production
npm run build

# 5. Configure .env
nano .env
# Paste production config

# 6. Start with PM2
pm2 start dist/app.js --name intelligence-test-server
pm2 startup
pm2 save

# 7. Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/intelligence-test
# Configure nginx...

# 8. Enable site
sudo ln -s /etc/nginx/sites-available/intelligence-test /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Deploy lên Heroku

```bash
# Login
heroku login

# Create app
heroku create intelligence-test-server

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy lên Railway/Render

1. Import repository từ GitHub
2. Add PostgreSQL database
3. Set environment variables
4. Deploy!

## 🔐 Security

- ✅ JWT authentication với refresh tokens
- ✅ Password hashing với bcrypt
- ✅ Rate limiting để chống DDoS
- ✅ Input validation và sanitization
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ SQL injection prevention
- ✅ XSS protection

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Exams Table

```sql
CREATE TABLE exams (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES users(id),
    class_id UUID REFERENCES classes(id),
    questions JSONB NOT NULL,
    duration INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_adaptive BOOLEAN DEFAULT FALSE,
    anti_cheat_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

[See full schema in docs/database-schema.md]

## 📚 Documentation

- [API Specification](./docs/API_SPECIFICATION.md)
- [Database Schema](./docs/database-schema.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🛠️ Development

```bash
# Start dev server with auto-reload
npm run dev

# Build TypeScript
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 🐛 Troubleshooting

### Database connection fails

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U your_db_user -d intelligence_test -h localhost
```

### Port already in use

```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### PM2 issues

```bash
# Restart
pm2 restart intelligence-test-server

# View logs
pm2 logs intelligence-test-server

# Monitor
pm2 monit
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## 📝 License

MIT License - see [LICENSE](./LICENSE) file

## 👥 Authors

- [@imnothoan](https://github.com/imnothoan)

## 🙏 Acknowledgments

- Express.js team
- PostgreSQL community
- All contributors

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/imnothoan/Intell-Test_Server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/imnothoan/Intell-Test_Server/discussions)
- **Email**: support@intelligence-test.com

---

**Note**: Đây là backend server. Để sử dụng với client, xem [Intelligence-Test](https://github.com/imnothoan/Intelligence-Test) repository.

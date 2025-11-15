# Intelligence Test Server - Setup Guide

## Mục lục / Table of Contents
1. [Giới thiệu / Overview](#giới-thiệu--overview)
2. [Yêu cầu hệ thống / System Requirements](#yêu-cầu-hệ-thống--system-requirements)
3. [Cấu trúc dự án / Project Structure](#cấu-trúc-dự-án--project-structure)
4. [Cài đặt / Installation](#cài-đặt--installation)
5. [Cấu hình / Configuration](#cấu-hình--configuration)
6. [Database Setup](#database-setup)
7. [Chạy Server / Running the Server](#chạy-server--running-the-server)
8. [Deployment](#deployment)
9. [API Documentation](#api-documentation)

---

## Giới thiệu / Overview

Intelligence Test Server là backend API cho nền tảng thi trực tuyến Intelligence Test. Server cung cấp:

- **RESTful API**: Quản lý users, exams, classes, questions
- **WebSocket**: Real-time monitoring và anti-cheat detection
- **Authentication**: JWT-based authentication với refresh tokens
- **Database**: PostgreSQL hoặc MongoDB
- **File Storage**: Base64 images trong database (không cần cloud storage)

---

## Yêu cầu hệ thống / System Requirements

### Môi trường phát triển / Development
- **Node.js**: v18.0.0 trở lên
- **npm** hoặc **yarn**: Package manager
- **Database**: PostgreSQL 14+ hoặc MongoDB 5+
- **RAM**: Tối thiểu 2GB
- **Storage**: 1GB trống

### Môi trường production / Production
- **Node.js**: v18.0.0 LTS
- **Database**: PostgreSQL 14+ hoặc MongoDB 5+
- **RAM**: Tối thiểu 4GB (8GB khuyến nghị)
- **CPU**: 2 cores trở lên
- **Storage**: 10GB trở lên
- **SSL Certificate**: Cho HTTPS

---

## Cấu trúc dự án / Project Structure

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
│   ├── middleware/          # Middleware functions
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
│   ├── config/              # Configuration files
│   │   ├── database.ts
│   │   └── jwt.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── app.ts               # Express app setup
├── tests/                   # Test files
├── .env.example             # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

---

## Cài đặt / Installation

### Bước 1: Clone Repository

```bash
git clone https://github.com/imnothoan/Intell-Test_Server.git
cd Intell-Test_Server
```

### Bước 2: Cài đặt Dependencies

```bash
npm install
```

### Bước 3: Tạo file `.env`

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với các thông tin của bạn (xem phần [Configuration](#cấu-hình--configuration))

---

## Cấu hình / Configuration

### File `.env`

```env
# ============================================
# Server Configuration
# ============================================
NODE_ENV=development
PORT=3000
HOST=localhost

# ============================================
# Database Configuration
# ============================================
# PostgreSQL
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=intelligence_test
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password

# MongoDB (alternative)
# DATABASE_TYPE=mongodb
# MONGODB_URI=mongodb://localhost:27017/intelligence_test

# ============================================
# JWT Configuration
# ============================================
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_REFRESH_EXPIRES_IN=7d

# ============================================
# CORS Configuration
# ============================================
CORS_ORIGIN=http://localhost:5173
# Production: CORS_ORIGIN=https://your-frontend-domain.com

# ============================================
# Rate Limiting
# ============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ============================================
# File Upload
# ============================================
MAX_FILE_SIZE=10485760
# 10MB in bytes

# ============================================
# Logging
# ============================================
LOG_LEVEL=info
# Options: error, warn, info, debug

# ============================================
# WebSocket
# ============================================
WS_HEARTBEAT_INTERVAL=30000
# 30 seconds
```

---

## Database Setup

### Option 1: PostgreSQL

#### Cài đặt PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download và cài đặt từ [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)

#### Tạo Database

```bash
# Kết nối với PostgreSQL
sudo -u postgres psql

# Tạo database và user
CREATE DATABASE intelligence_test;
CREATE USER your_db_user WITH PASSWORD 'your_db_password';
GRANT ALL PRIVILEGES ON DATABASE intelligence_test TO your_db_user;

# Thoát
\q
```

#### Chạy Migrations

```bash
npm run migrate
```

### Option 2: MongoDB

#### Cài đặt MongoDB

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download từ [MongoDB Downloads](https://www.mongodb.com/try/download/community)

#### Tạo Database

MongoDB tự động tạo database khi bạn insert document đầu tiên.

```bash
# Kết nối với MongoDB
mongosh

# Chuyển sang database
use intelligence_test

# Tạo user (optional, cho production)
db.createUser({
  user: "your_db_user",
  pwd: "your_db_password",
  roles: [{ role: "readWrite", db: "intelligence_test" }]
})
```

---

## Chạy Server / Running the Server

### Development Mode

```bash
# Với auto-reload (nodemon)
npm run dev
```

### Production Mode

```bash
# Build TypeScript
npm run build

# Start server
npm start
```

### Kiểm tra Server

Mở browser và truy cập:
- **Health Check**: http://localhost:3000/api/health
- **API Documentation**: http://localhost:3000/api/docs (nếu có Swagger)

---

## Deployment

### Option 1: Deploy lên VPS (Ubuntu)

#### 1. Chuẩn bị VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Cài đặt PM2 (Process Manager)
sudo npm install -g pm2

# Cài đặt Nginx
sudo apt install nginx -y
```

#### 2. Clone và Setup Project

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/imnothoan/Intell-Test_Server.git
cd Intell-Test_Server

# Install dependencies
sudo npm install --production

# Build
sudo npm run build

# Tạo .env file
sudo nano .env
# Paste cấu hình production của bạn
```

#### 3. Chạy với PM2

```bash
# Start với PM2
pm2 start dist/app.js --name intelligence-test-server

# Enable startup on boot
pm2 startup
pm2 save

# Xem logs
pm2 logs intelligence-test-server
```

#### 4. Cấu hình Nginx

```bash
sudo nano /etc/nginx/sites-available/intelligence-test
```

Paste cấu hình sau:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/intelligence-test /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL với Let's Encrypt

```bash
# Cài đặt Certbot
sudo apt install certbot python3-certbot-nginx -y

# Lấy SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (đã được setup tự động)
sudo certbot renew --dry-run
```

### Option 2: Deploy lên Heroku

#### 1. Cài đặt Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh
```

#### 2. Deploy

```bash
# Login
heroku login

# Tạo app
heroku create intelligence-test-server

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
# ... (set các biến khác)

# Deploy
git push heroku main

# Scale
heroku ps:scale web=1

# Xem logs
heroku logs --tail
```

### Option 3: Deploy lên Railway

1. Đăng nhập vào [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Chọn repository `Intell-Test_Server`
4. Add PostgreSQL database từ Railway marketplace
5. Set environment variables trong Settings
6. Railway tự động deploy khi có commit mới

### Option 4: Deploy lên Render

1. Đăng nhập vào [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Cấu hình:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add PostgreSQL database
6. Set environment variables
7. Deploy

---

## API Documentation

### Swagger UI (Optional)

Nếu bạn setup Swagger, truy cập:
```
http://localhost:3000/api/docs
```

### Postman Collection

Import file `Intelligence-Test-API.postman_collection.json` (cần tạo) vào Postman để test API.

### API Specification

Xem chi tiết tại: [API_SPECIFICATION.md](./API_SPECIFICATION.md)

---

## Database Schema

### Users Table (PostgreSQL)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('instructor', 'student')),
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Exams Table

```sql
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    questions JSONB NOT NULL,
    duration INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_adaptive BOOLEAN DEFAULT FALSE,
    anti_cheat_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exams_instructor ON exams(instructor_id);
CREATE INDEX idx_exams_class ON exams(class_id);
CREATE INDEX idx_exams_dates ON exams(start_time, end_time);
```

### Classes Table

```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    students JSONB DEFAULT '[]',
    exams JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_instructor ON classes(instructor_id);
```

### Questions Table

```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    options JSONB,
    correct_answer VARCHAR(255),
    difficulty DECIMAL(3,2) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    points INTEGER NOT NULL,
    grade_level JSONB,
    subject JSONB,
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_topic ON questions(topic);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_tags ON questions USING GIN(tags);
```

### Exam Attempts Table

```sql
CREATE TABLE exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    answers JSONB DEFAULT '{}',
    score DECIMAL(5,2),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed', 'flagged')),
    warnings JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attempts_exam ON exam_attempts(exam_id);
CREATE INDEX idx_attempts_student ON exam_attempts(student_id);
CREATE INDEX idx_attempts_status ON exam_attempts(status);
```

---

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### API Tests với Postman/Newman

```bash
npm run test:api
```

---

## Monitoring & Logging

### PM2 Monitoring

```bash
# CPU and Memory usage
pm2 monit

# Application logs
pm2 logs intelligence-test-server

# Detailed info
pm2 info intelligence-test-server
```

### Log Files

Logs được lưu trong thư mục `logs/`:
- `error.log`: Error logs
- `combined.log`: All logs
- `access.log`: HTTP access logs

---

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check MongoDB status
sudo systemctl status mongod

# Test connection
psql -U your_db_user -d intelligence_test -h localhost
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### PM2 Issues

```bash
# Restart app
pm2 restart intelligence-test-server

# Delete and recreate
pm2 delete intelligence-test-server
pm2 start dist/app.js --name intelligence-test-server
```

---

## Security Best Practices

1. **Environment Variables**: Không commit file `.env` vào Git
2. **JWT Secrets**: Sử dụng secret keys mạnh (>32 characters)
3. **HTTPS**: Luôn sử dụng HTTPS trong production
4. **Rate Limiting**: Cấu hình rate limiting phù hợp
5. **Input Validation**: Validate tất cả input từ client
6. **SQL Injection**: Sử dụng parameterized queries
7. **CORS**: Chỉ cho phép origins tin cậy
8. **Dependencies**: Thường xuyên update dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Support

- **Documentation**: [API_SPECIFICATION.md](./API_SPECIFICATION.md)
- **Issues**: [GitHub Issues](https://github.com/imnothoan/Intell-Test_Server/issues)
- **Email**: support@intelligence-test.com

---

## License

MIT License - See LICENSE file for details

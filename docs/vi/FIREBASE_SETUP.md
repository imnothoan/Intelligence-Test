# Hướng Dẫn Cài Đặt Firebase Chi Tiết

## Mục Lục
1. [Giới Thiệu](#giới-thiệu)
2. [Tạo Project Firebase](#tạo-project-firebase)
3. [Cấu Hình Các Dịch Vụ](#cấu-hình-các-dịch-vụ)
4. [Lấy File JSON Configuration](#lấy-file-json-configuration)
5. [Cài Đặt Vào Ứng Dụng](#cài-đặt-vào-ứng-dụng)
6. [Thiết Lập Security Rules](#thiết-lập-security-rules)
7. [Kiểm Tra Kết Nối](#kiểm-tra-kết-nối)

## Giới Thiệu

Firebase là nền tảng backend miễn phí của Google, cung cấp các dịch vụ:
- **Authentication**: Xác thực người dùng
- **Firestore Database**: Cơ sở dữ liệu NoSQL
- **Hosting**: Triển khai ứng dụng web

**Lưu ý quan trọng**: Hệ thống **KHÔNG** sử dụng Firebase Storage để tiết kiệm chi phí. Tất cả hình ảnh (như ảnh chụp màn hình anti-cheat) được lưu trữ dưới dạng base64 string trực tiếp trong Firestore Database.

**Gói miễn phí (Spark Plan) bao gồm:**
- 1 GB dữ liệu Firestore
- 50,000 lượt đọc/ngày, 20,000 lượt ghi/ngày
- Đủ cho trường học nhỏ và vừa

## Tạo Project Firebase

### Bước 1: Truy cập Firebase Console
1. Mở trình duyệt và truy cập: https://console.firebase.google.com
2. Đăng nhập bằng tài khoản Google của bạn
3. Nhấn nút **"Add project"** (Thêm dự án)

### Bước 2: Thiết lập Project
1. **Tên dự án**: Nhập tên cho project (ví dụ: `intelligence-test-school`)
2. **Google Analytics**: Có thể bật hoặc tắt (khuyến nghị: bật)
3. Chọn tài khoản Analytics nếu bật
4. Nhấn **"Create project"** và đợi vài giây

### Bước 3: Đăng ký Web App
1. Trong Firebase Console, chọn biểu tượng **Web** (`</>`)
2. Đặt tên cho app (ví dụ: `Intelligence Test Web`)
3. **Không** cần chọn Firebase Hosting lúc này
4. Nhấn **"Register app"**

## Cấu Hình Các Dịch Vụ

### Authentication (Xác Thực)

1. Trong sidebar, chọn **"Authentication"**
2. Nhấn **"Get started"**
3. Chuyển sang tab **"Sign-in method"**
4. Bật các phương thức:

**Email/Password:**
- Nhấn vào "Email/Password"
- Toggle "Enable"
- Nhấn "Save"

**Google Sign-In (Tùy chọn):**
- Nhấn vào "Google"
- Toggle "Enable"
- Chọn support email
- Nhấn "Save"

### Firestore Database (Cơ Sở Dữ Liệu)

1. Trong sidebar, chọn **"Firestore Database"**
2. Nhấn **"Create database"**
3. Chọn **"Start in test mode"** (cho development)
   - Test mode cho phép đọc/ghi tự do (30 ngày)
   - Sẽ cấu hình security rules sau
4. Chọn **location gần nhất** với người dùng:
   - `asia-southeast1` (Singapore) - tốt cho Việt Nam
   - `asia-east1` (Taiwan)
5. Nhấn **"Enable"**

**Xong!** Bạn không cần thiết lập Firebase Storage vì hệ thống lưu trữ hình ảnh dưới dạng base64 trong Firestore Database, giúp tiết kiệm chi phí.

## Lấy File JSON Configuration

### Cách 1: Từ Firebase Console

1. Nhấn vào biểu tượng **bánh răng** (⚙️) → **"Project settings"**
2. Kéo xuống phần **"Your apps"**
3. Tìm ứng dụng web bạn đã tạo
4. Trong phần **"SDK setup and configuration"**, chọn **"Config"**
5. Bạn sẽ thấy một object JavaScript như sau:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxx-xxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

**Lưu ý**: Bạn có thể bỏ qua trường `storageBucket` nếu có, vì hệ thống không sử dụng Firebase Storage.

### Cách 2: Download google-services.json (Mobile)

Nếu bạn cần file JSON cho mobile app:
1. Vào **Project Settings**
2. Chọn nền tảng Android hoặc iOS
3. Download file `google-services.json` (Android) hoặc `GoogleService-Info.plist` (iOS)

## Cài Đặt Vào Ứng Dụng

### Bước 1: Tạo File .env

Trong thư mục gốc của project, tạo file `.env`:

```bash
# Từ thư mục Intelligence-Test/
cp .env.example .env
```

### Bước 2: Điền Thông Tin Firebase

Mở file `.env` và điền các giá trị từ Firebase Config:

```env
# OpenAI API Key (Tùy chọn - cho AI features)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration
# Lưu ý: KHÔNG cần VITE_FIREBASE_STORAGE_BUCKET vì hệ thống lưu ảnh dưới dạng base64 trong database
VITE_FIREBASE_API_KEY=AIzaSyBxxx-xxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456

# Development Settings
# Set to false để sử dụng Firebase, true để dùng localStorage
VITE_DEV_MODE=false
```

### Bước 3: Kiểm Tra File Config

File `src/config/firebase.ts` sẽ tự động đọc các biến môi trường:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Lưu ý: Không có storage - hình ảnh được lưu dưới dạng base64 trong Firestore
```

## Thiết Lập Security Rules

Sau khi development xong, cần cập nhật security rules cho production.

### Firestore Security Rules

1. Vào **Firestore Database** → **Rules**
2. Thay thế rules bằng:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User data - chỉ user đó mới read/write
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Exams - mọi người authenticated đọc được, chỉ instructor tạo/sửa
    match /exams/{examId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor';
    }
    
    // Exam attempts - student tạo, instructor xem tất cả
    match /examAttempts/{attemptId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.studentId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor'
      );
      allow create: if request.auth != null && 
        request.resource.data.studentId == request.auth.uid;
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.studentId;
    }
    
    // Classes - instructor quản lý
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor';
    }
    
    // Questions - instructor quản lý
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'instructor';
    }
  }
}
```

3. Nhấn **"Publish"**

## Kiểm Tra Kết Nối

### Bước 1: Khởi động Development Server

```bash
npm run dev
```

### Bước 2: Mở Browser

Truy cập: http://localhost:5173

### Bước 3: Test Login

1. Thử đăng nhập với email bất kỳ
2. Nếu dev mode = false, Firebase sẽ được sử dụng
3. Kiểm tra Firebase Console → Authentication để thấy user mới

### Bước 4: Test Database

1. Tạo một class hoặc exam
2. Kiểm tra Firebase Console → Firestore Database
3. Bạn sẽ thấy collections và documents mới

### Bước 5: Kiểm tra Browser Console

Mở DevTools (F12) và kiểm tra console:
- Không nên có lỗi Firebase
- Nếu có lỗi, check lại `.env` và firebaseConfig

## Xử Lý Lỗi Thường Gặp

### Lỗi: "Firebase: Error (auth/invalid-api-key)"
- **Nguyên nhân**: API Key sai
- **Giải pháp**: Copy lại API Key từ Firebase Console

### Lỗi: "Firebase: Error (auth/network-request-failed)"
- **Nguyên nhân**: Không có internet hoặc Firebase bị chặn
- **Giải pháp**: Kiểm tra kết nối mạng, thử tắt VPN

### Lỗi: "Missing or insufficient permissions"
- **Nguyên nhân**: Security rules chặn
- **Giải pháp**: Kiểm tra lại Firestore rules

### Lỗi: "Quota exceeded"
- **Nguyên nhân**: Vượt giới hạn free tier
- **Giải pháp**: Nâng cấp lên Blaze plan (pay-as-you-go)

## Nâng Cấp và Tối Ưu

### Monitor Usage

1. Vào Firebase Console → **Usage and billing**
2. Theo dõi:
   - Firestore reads/writes
   - Authentication usage

**Lưu ý**: Không có chi phí Storage vì hệ thống lưu hình ảnh dưới dạng base64 trong Firestore.

### Tối Ưu Chi Phí

**Giảm số lần đọc:**
- Cache dữ liệu trong localStorage
- Sử dụng pagination
- Chỉ lấy fields cần thiết

**Giảm số lần ghi:**
- Batch writes khi có thể
- Sử dụng transactions
- Tránh update không cần thiết

### Backup Dữ Liệu

**Manual backup:**
1. Vào Firestore Database
2. Export collections về JSON

**Automatic backup (Blaze plan):**
1. Vào Firebase Console
2. Setup scheduled backups

## Tài Liệu Tham Khảo

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Pricing](https://firebase.google.com/pricing)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Best Practices](https://firebase.google.com/docs/firestore/best-practices)

## Hỗ Trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra Firebase Console logs
2. Xem browser console để tìm lỗi
3. Tham khảo Firebase documentation
4. Mở issue trên GitHub repository

---

**Lưu ý**: Luôn giữ bí mật `.env` file và không commit lên GitHub. File `.gitignore` đã được cấu hình để ignore file này.

# Hướng Dẫn Nhanh - Intelligence Test Platform

## 🇻🇳 Dành cho người dùng Việt Nam

Tài liệu này cung cấp hướng dẫn nhanh để bắt đầu với Intelligence Test Platform.

### 📚 Tài Liệu Chi Tiết

Xem tài liệu đầy đủ tại: **[docs/vi/](./docs/vi/)**

- **[Hướng Dẫn Cài Đặt Firebase](./docs/vi/FIREBASE_SETUP.md)** - Chi tiết từng bước
- **[Hướng Dẫn Training Models & API](./docs/vi/MODEL_TRAINING.md)** - Training và tích hợp AI

---

## 🚀 Bắt Đầu Nhanh

### 1. Clone Repository

```bash
git clone https://github.com/imnothoan/Intelligence-Test.git
cd Intelligence-Test
```

### 2. Cài Đặt Dependencies

```bash
npm install
```

### 3. Cấu Hình Environment

```bash
# Copy file example
cp .env.example .env

# Chỉnh sửa file .env
nano .env
```

**Cấu hình tối thiểu (Development mode - không cần Firebase):**
```env
VITE_DEV_MODE=true
```

**Cấu hình đầy đủ (Production mode - với Firebase):**
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456

# Optional: OpenAI API cho AI features
VITE_OPENAI_API_KEY=sk-your-openai-key

# Development Settings
VITE_DEV_MODE=false
```

### 4. Chạy Development Server

```bash
npm run dev
```

Mở trình duyệt: http://localhost:5173

### 5. Đăng Nhập Demo

**Giáo viên:**
- Email: `instructor@test.com`
- Password: bất kỳ

**Học sinh:**
- Email: `student@test.com`  
- Password: bất kỳ

---

## 🔥 Cài Đặt Firebase (Tùy chọn)

### Nếu bạn muốn dùng Firebase để lưu trữ dữ liệu:

1. **Tạo Project Firebase:**
   - Truy cập: https://console.firebase.google.com
   - Click "Add project" (Thêm dự án)
   - Đặt tên project và làm theo hướng dẫn

2. **Lấy Configuration:**
   - Vào Project Settings (⚙️)
   - Kéo xuống "Your apps"
   - Click web icon (`</>`) để thêm web app
   - Copy config và paste vào `.env`

3. **Bật các Services:**
   - **Authentication** → Enable Email/Password
   - **Firestore Database** → Create database (test mode)
   - **Storage** → Get started (test mode)

📖 **Xem hướng dẫn chi tiết:** [docs/vi/FIREBASE_SETUP.md](./docs/vi/FIREBASE_SETUP.md)

---

## 🤖 Tích Hợp AI Features (Tùy chọn)

### Option 1: OpenAI API (Trả phí, chất lượng cao)

```bash
# Lấy API key từ: https://platform.openai.com/api-keys
# Thêm vào .env:
VITE_OPENAI_API_KEY=sk-proj-your-key-here
```

**Chi phí:**
- GPT-3.5: ~$0.001/1K tokens (rẻ)
- GPT-4: ~$0.03/1K tokens (đắt hơn, chất lượng cao)

### Option 2: Google Gemini (Miễn phí, giới hạn)

```bash
# Lấy API key từ: https://makersuite.google.com/app/apikey
# Thêm vào .env:
VITE_GEMINI_API_KEY=your-gemini-key

# Cài đặt package:
npm install @google/generative-ai
```

**Giới hạn miễn phí:**
- 60 requests/phút
- 1,500 requests/ngày

### Option 3: Ollama (Local, hoàn toàn miễn phí)

```bash
# Cài đặt Ollama
curl https://ollama.ai/install.sh | sh

# Pull model
ollama pull llama2

# Chạy server
ollama serve
```

**Ưu điểm:** Miễn phí, không giới hạn, privacy  
**Nhược điểm:** Cần máy mạnh (8GB+ RAM)

📖 **Xem so sánh chi tiết và hướng dẫn:** [docs/vi/MODEL_TRAINING.md](./docs/vi/MODEL_TRAINING.md)

---

## 📊 Training Models (Nâng cao)

### CAT Algorithm - Calibrate Độ Khó Câu Hỏi

Hệ thống đã có sẵn CAT algorithm. Chỉ cần gán độ khó cho câu hỏi (0.0-1.0).

**Nếu muốn calibrate chính xác từ dữ liệu thực:**

```bash
# Chuẩn bị file responses.csv với columns:
# student_id, question_id, correct

# Chạy script calibration
cd docs/examples/training-scripts
pip install numpy scipy pandas scikit-learn
python train_cat_model.py ../../responses.csv
```

### Anti-Cheat Model - Computer Vision

Hệ thống đã tích hợp sẵn BlazeFace để detect faces.

**Nếu muốn train custom model:**

```bash
# Thu thập training data
python collect_data.py

# Prepare dataset
python prepare_dataset.py

# Train model
pip install tensorflow opencv-python
python train_anticheat.py

# Convert sang TensorFlow.js
tensorflowjs_converter \
  --input_format=keras \
  models/anticheat_final.h5 \
  public/models/anticheat
```

📖 **Xem hướng dẫn chi tiết:** [docs/vi/MODEL_TRAINING.md](./docs/vi/MODEL_TRAINING.md)

---

## 🏗️ Build cho Production

```bash
# Build
npm run build

# Preview
npm run preview

# Deploy dist/ folder lên hosting
```

---

## 📖 Tài Liệu Đầy Đủ

### Trong Application
Click "User Guide" từ dashboard để xem hướng dẫn tích hợp sẵn.

### Trên GitHub
- **[Hướng Dẫn Firebase](./docs/vi/FIREBASE_SETUP.md)** - Setup Firebase chi tiết
- **[Hướng Dẫn Models](./docs/vi/MODEL_TRAINING.md)** - Training và API integration
- **[README chính](./README.md)** - Tổng quan hệ thống
- **[English Docs](./docs/en/)** - Tài liệu tiếng Anh

---

## ❓ Câu Hỏi Thường Gặp

### Q: Tôi không có Firebase, có dùng được không?
A: Có! Set `VITE_DEV_MODE=true` trong `.env` để dùng localStorage.

### Q: Tôi không có OpenAI API key?
A: Dùng Gemini (miễn phí) hoặc Ollama (local). Hoặc không dùng AI features cũng được.

### Q: Cần training model không?
A: **KHÔNG cần**. Hệ thống đã có sẵn tất cả models cơ bản. Training chỉ cho trường hợp muốn tùy chỉnh.

### Q: Chi phí chạy hệ thống?
A: 
- **Miễn phí hoàn toàn:** Dev mode + Gemini/Ollama + BlazeFace
- **Firebase free tier:** Đủ cho trường học nhỏ/vừa
- **OpenAI:** Tùy chọn, ~$5-20/tháng cho trường nhỏ

### Q: Cần kiến thức gì?
A: 
- **Basic:** Chỉ cần biết chạy npm commands
- **Intermediate:** Setup Firebase
- **Advanced:** Training custom models (cần biết Python/ML)

---

## 🆘 Hỗ Trợ

Nếu gặp vấn đề:

1. **Kiểm tra tài liệu** - Hầu hết câu hỏi đã được trả lời
2. **Xem Browser Console** (F12) để tìm lỗi
3. **Search GitHub Issues** - Có thể đã có người gặp vấn đề tương tự
4. **Mở Issue mới** - Cung cấp chi tiết và error messages

### Links Hữu Ích
- [GitHub Issues](https://github.com/imnothoan/Intelligence-Test/issues)
- [Firebase Console](https://console.firebase.google.com)
- [OpenAI Platform](https://platform.openai.com)
- [Google AI Studio](https://makersuite.google.com)

---

## 📞 Liên Hệ

- **GitHub:** [@imnothoan](https://github.com/imnothoan)
- **Email:** Xem trong GitHub profile
- **Issues:** [GitHub Issues](https://github.com/imnothoan/Intelligence-Test/issues)

---

**Chúc bạn sử dụng thành công! 🎉**

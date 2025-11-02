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

**Lưu ý quan trọng**: KHÔNG cần thiết lập Firebase Storage! Hệ thống lưu hình ảnh dưới dạng base64 trong Firestore Database để tiết kiệm chi phí.

📖 **Xem hướng dẫn chi tiết:** [docs/vi/FIREBASE_SETUP.md](./docs/vi/FIREBASE_SETUP.md)

---

## 🤖 Tích Hợp AI Features (Tùy chọn)

### 🆓 MIỄN PHÍ - Khuyến nghị cho người mới bắt đầu

#### Option 1: Google Gemini (KHUYẾN NGHỊ - Hoàn toàn miễn phí!)

**Tại sao chọn Gemini?**
- ✅ Hoàn toàn miễn phí
- ✅ Hỗ trợ tiếng Việt tốt
- ✅ 60 requests/phút (đủ dùng cho lớp học nhỏ)
- ✅ Không cần thẻ tín dụng

**Hướng dẫn từng bước:**

1. **Lấy API Key miễn phí:**
   - Truy cập: https://makersuite.google.com/app/apikey
   - Đăng nhập bằng Google
   - Click "Create API Key" → "Create API key in new project"
   - Copy API key (bắt đầu bằng "AIza...")

2. **Thêm vào file .env:**
   ```env
   VITE_GEMINI_API_KEY=AIza...your-key-here
   ```

3. **Cài đặt thư viện:**
   ```bash
   npm install @google/generative-ai
   ```

4. **Sử dụng trong code:**
   ```javascript
   // src/services/aiQuestionGenerator.ts
   import { GoogleGenerativeAI } from "@google/generative-ai";
   
   const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
   
   const result = await model.generateContent(
     "Tạo 5 câu hỏi trắc nghiệm về lịch sử Việt Nam"
   );
   console.log(result.response.text());
   ```

**Giới hạn miễn phí:**
- 60 requests/phút
- 1,500 requests/ngày
- Đủ cho ~50 sinh viên làm bài cùng lúc

#### Option 2: Ollama (100% Miễn phí, Chạy local)

**Tại sao chọn Ollama?**
- ✅ Hoàn toàn miễn phí, không giới hạn
- ✅ Bảo mật tuyệt đối (không cần internet)
- ✅ Không cần API key
- ⚠️ Cần máy mạnh (8GB+ RAM khuyến nghị)

**Hướng dẫn cài đặt:**

1. **Tải và cài Ollama:**
   ```bash
   # Trên macOS/Linux:
   curl -fsSL https://ollama.com/install.sh | sh
   
   # Trên Windows:
   # Tải từ: https://ollama.com/download/windows
   ```

2. **Tải model AI (chọn 1 trong các model sau):**
   ```bash
   # Model nhỏ, nhanh (4GB RAM)
   ollama pull gemma:2b
   
   # Model trung bình (8GB RAM) - KHUYẾN NGHỊ
   ollama pull llama2:7b
   
   # Model lớn, chất lượng cao (16GB RAM)
   ollama pull llama2:13b
   ```

3. **Chạy Ollama server:**
   ```bash
   ollama serve
   # Server sẽ chạy ở http://localhost:11434
   ```

4. **Kiểm tra hoạt động:**
   ```bash
   # Test trong terminal
   ollama run llama2 "Tạo 1 câu hỏi toán học"
   ```

5. **Sử dụng trong code:**
   ```javascript
   const response = await fetch('http://localhost:11434/api/generate', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       model: 'llama2',
       prompt: 'Tạo câu hỏi trắc nghiệm về Toán học',
       stream: false
     })
   });
   const data = await response.json();
   console.log(data.response);
   ```

#### Option 3: Hugging Face Inference API (Miễn phí có giới hạn)

**Hướng dẫn:**

1. **Tạo tài khoản:**
   - Truy cập: https://huggingface.co/join
   - Đăng ký miễn phí

2. **Lấy API token:**
   - Vào Settings → Access Tokens
   - Click "New token" → "Read"
   - Copy token

3. **Thêm vào .env:**
   ```env
   VITE_HUGGINGFACE_API_KEY=hf_...your-token
   ```

4. **Sử dụng:**
   ```javascript
   const response = await fetch(
     "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
     {
       headers: { 
         Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
         "Content-Type": "application/json"
       },
       method: "POST",
       body: JSON.stringify({
         inputs: "Tạo câu hỏi về lịch sử Việt Nam"
       })
     }
   );
   ```

**Giới hạn:** ~1000 requests/ngày (free tier)

### 💰 Option 4: OpenAI (Trả phí, chất lượng cao nhất)

**Chỉ dùng khi:**
- Cần chất lượng cao nhất
- Có ngân sách
- Dùng cho production

```bash
# Lấy API key từ: https://platform.openai.com/api-keys
# Thêm vào .env:
VITE_OPENAI_API_KEY=sk-proj-your-key-here
```

**Chi phí:**
- GPT-3.5-turbo: ~$0.001/1K tokens (~5,000đ/1 triệu từ)
- GPT-4: ~$0.03/1K tokens (~150,000đ/1 triệu từ)

---

## 📊 Training AI Models - Hướng dẫn chi tiết

### 🎯 1. Training CAT Algorithm (Thuật toán thích ứng)

CAT algorithm đã được tích hợp sẵn! Bạn chỉ cần:

**Cách 1: Gán độ khó thủ công (Đơn giản - Dành cho người mới)**

Khi tạo câu hỏi, gán độ khó từ 0.0 đến 1.0:
- **0.0 - 0.3**: Câu dễ (dành cho học sinh yếu)
- **0.3 - 0.7**: Câu trung bình (đa số học sinh)
- **0.7 - 1.0**: Câu khó (học sinh giỏi)

**Cách 2: Calibrate từ dữ liệu thực (Nâng cao)**

Sau khi có ~50+ học sinh làm bài:

1. **Xuất dữ liệu:**
   - Vào Analytics Dashboard
   - Download "Question Performance" CSV

2. **Chạy script calibration:**
   ```bash
   cd docs/examples/training-scripts
   pip install numpy scipy pandas
   python train_cat_model.py ../../data/responses.csv
   ```

3. **Import độ khó mới:**
   - Script sẽ tạo file `difficulties.json`
   - Upload vào Question Bank

**Xem hướng dẫn đầy đủ:** [docs/vi/MODEL_TRAINING.md](./docs/vi/MODEL_TRAINING.md)

### 🎥 2. Training Anti-Cheat Model (Phát hiện gian lận)

**Không cần train! Đã tích hợp sẵn BlazeFace**

Hệ thống sử dụng BlazeFace (Google) - model đã được train sẵn để:
- Phát hiện khuôn mặt
- Theo dõi chuyển động đầu
- Phát hiện nhiều người

**Nếu muốn train custom model riêng:**

1. **Thu thập dữ liệu:**
   ```bash
   # Chuẩn bị 2 folders:
   # - normal_behavior/: Học sinh nhìn màn hình
   # - suspicious_behavior/: Nhìn đi chỗ khác, nhiều người
   ```

2. **Train model:**
   ```bash
   pip install tensorflow opencv-python numpy
   
   # Chạy script
   python docs/examples/training-scripts/train_anticheat.py \
     --normal_dir ./data/normal_behavior \
     --suspicious_dir ./data/suspicious_behavior \
     --output_dir ./public/models/anticheat
   ```

3. **Model sẽ tự động convert sang TensorFlow.js và lưu vào `/public/models/`**

### 📝 3. Training Essay Grading (Chấm điểm tự luận)

**Không cần training riêng!** Sử dụng LLM với prompt engineering:

**Ví dụ prompt template:**
```javascript
const gradingPrompt = `
Vai trò: Bạn là giáo viên chuyên nghiệp đang chấm bài tự luận.

Đề bài: "${question}"

Bài làm của học sinh:
"${studentAnswer}"

Tiêu chí chấm điểm (100 điểm):
- Nội dung đúng, đầy đủ: 40 điểm
- Cách trình bày logic, mạch lạc: 30 điểm
- Ngữ pháp, chính tả: 20 điểm
- Sáng tạo, ý tưởng độc đáo: 10 điểm

Yêu cầu trả về JSON:
{
  "totalScore": 85,
  "breakdown": {
    "content": 35,
    "presentation": 28,
    "grammar": 18,
    "creativity": 9
  },
  "feedback": "Bài làm tốt...",
  "strengths": ["Nội dung đầy đủ", "Trình bày rõ ràng"],
  "improvements": ["Cần chú ý chính tả", "Phát triển ý sâu hơn"]
}
`;

// Dùng với Gemini (miễn phí)
const result = await model.generateContent(gradingPrompt);
const grading = JSON.parse(result.response.text());
```

**Tips để có kết quả tốt:**
- ✅ Viết prompt rõ ràng, cụ thể
- ✅ Đưa ra tiêu chí chấm điểm chi tiết
- ✅ Yêu cầu trả về JSON để dễ xử lý
- ✅ Test với nhiều bài khác nhau để tinh chỉnh prompt

📖 **Xem so sánh chi tiết các LLM và best practices:** [docs/vi/MODEL_TRAINING.md](./docs/vi/MODEL_TRAINING.md)

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

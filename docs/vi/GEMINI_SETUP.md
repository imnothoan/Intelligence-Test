# Hướng Dẫn Chi Tiết Sử Dụng Google Gemini API (MIỄN PHÍ) 🆓

## Tại Sao Chọn Gemini?

✅ **Hoàn toàn MIỄN PHÍ** - Không cần thẻ tín dụng  
✅ **Hỗ trợ tiếng Việt tốt** - Hiểu và tạo nội dung tiếng Việt chính xác  
✅ **60 requests/phút** - Đủ dùng cho ~50 học sinh cùng lúc  
✅ **1,500 requests/ngày** - Phù hợp cho trường học nhỏ và vừa  
✅ **Dễ dàng tích hợp** - Chỉ cần 3 bước  

## Bước 1: Lấy API Key Miễn Phí

### 1.1. Truy cập Google AI Studio

Mở trình duyệt và vào: **https://makersuite.google.com/app/apikey**

### 1.2. Đăng Nhập

- Đăng nhập bằng tài khoản Google của bạn
- Nếu chưa có tài khoản Google, tạo một tài khoản mới (miễn phí)

### 1.3. Tạo API Key

1. Click nút **"Get API Key"** (Lấy API Key)
2. Chọn **"Create API key in new project"** (Tạo API key trong dự án mới)
3. Đợi vài giây để Google tạo key
4. Copy API key (sẽ có dạng: `AIza...`)

⚠️ **LƯU Ý**: 
- Giữ API key bí mật, không chia sẻ công khai
- Lưu key vào file `.env`, KHÔNG commit vào Git

## Bước 2: Cấu Hình Trong Dự Án

### 2.1. Thêm API Key vào File .env

```bash
# Mở hoặc tạo file .env trong thư mục gốc dự án
nano .env
```

Thêm dòng sau (thay `YOUR_KEY_HERE` bằng key bạn vừa copy):

```env
VITE_GEMINI_API_KEY=AIza...your-actual-key-here
```

### 2.2. Ví Dụ File .env Hoàn Chỉnh

```env
# Google Gemini API (KHUYẾN NGHỊ - MIỄN PHÍ)
VITE_GEMINI_API_KEY=AIzaSyA...your-key-here

# Firebase (Tùy chọn)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Development mode
VITE_DEV_MODE=true

# OpenAI (Không bắt buộc nếu dùng Gemini)
# VITE_OPENAI_API_KEY=sk-...
```

### 2.3. Lưu và Khởi Động Lại

```bash
# Lưu file .env (Ctrl+O, Enter, Ctrl+X trong nano)

# Khởi động lại server
npm run dev
```

## Bước 3: Kiểm Tra Hoạt Động

### 3.1. Mở Application

Truy cập: http://localhost:5173

### 3.2. Test Question Generation

1. Đăng nhập với tài khoản instructor
2. Click **"Create Exam"** (Tạo đề thi)
3. Click **"Generate Questions with AI"** (Tạo câu hỏi với AI)
4. Nhập topic (ví dụ: "Lịch sử Việt Nam")
5. Click **"Generate"**

✅ Nếu thành công, bạn sẽ thấy câu hỏi được tạo tự động!

### 3.3. Kiểm Tra Console Log

Mở Developer Tools (F12) và xem Console. Bạn sẽ thấy:

```
Using Gemini AI for question generation...
```

Nếu thấy dòng này = Gemini đang hoạt động! 🎉

## Các Tính Năng Được Hỗ Trợ

### 1. ✍️ Tạo Câu Hỏi Trắc Nghiệm

```javascript
// Tự động gọi khi bạn dùng UI
// Hoặc tự code:
import { geminiService } from '@/services/geminiService';

const questions = await geminiService.generateQuestions(
  'Toán học lớp 10',  // Topic
  5,                   // Số câu hỏi
  0.5,                 // Độ khó (0.0-1.0)
  'multiple-choice',   // Loại câu hỏi
  'vi'                 // Ngôn ngữ
);
```

### 2. 📝 Tạo Câu Hỏi Tự Luận

```javascript
const essayQuestions = await geminiService.generateQuestions(
  'Văn học Việt Nam',
  3,
  0.7,
  'essay',
  'vi'
);
```

### 3. 🎯 Chấm Điểm Bài Tự Luận

```javascript
const result = await geminiService.gradeEssay(
  'Phân tích hình tượng người lính trong "Tây Tiến"',
  'Bài làm của học sinh...',
  'Tiêu chí chấm điểm...',
  100  // Điểm tối đa
);

console.log(result.score);         // Điểm số
console.log(result.feedback);      // Nhận xét
console.log(result.strengths);     // Điểm mạnh
console.log(result.improvements);  // Cần cải thiện
```

### 4. 💬 Tạo Phản Hồi Cho Học Sinh

```javascript
const feedback = await geminiService.generateFeedback(
  'Câu hỏi...',
  'Câu trả lời của học sinh...',
  'Đáp án đúng (optional)...'
);
```

### 5. 📚 Giải Thích Kiến Thức

```javascript
const explanation = await geminiService.generateExplanation(
  'Định lý Pythagoras',
  'intermediate'  // 'basic', 'intermediate', hoặc 'advanced'
);
```

## Giới Hạn và Tối Ưu

### Giới Hạn Free Tier

| Loại | Giới Hạn | Đủ Cho |
|------|----------|--------|
| Requests/phút | 60 | ~50 học sinh cùng lúc |
| Requests/ngày | 1,500 | 200-300 học sinh/ngày |
| Tokens/request | Unlimited | Câu hỏi dài bao nhiêu cũng được |

### Tips Tối Ưu

✅ **Batch Questions**: Tạo nhiều câu hỏi một lúc thay vì từng câu
```javascript
// Tốt: Tạo 10 câu một lúc
generateQuestions('Math', 10)

// Không tốt: Gọi 10 lần
for (let i = 0; i < 10; i++) {
  generateQuestions('Math', 1)
}
```

✅ **Cache Results**: Lưu câu hỏi đã tạo vào database
```javascript
// Sau khi generate
const questions = await geminiService.generateQuestions(...);
questions.forEach(q => firebaseService.createQuestion(q));
```

✅ **Rate Limiting**: Hệ thống tự động retry nếu quá giới hạn

## Xử Lý Lỗi

### Lỗi "API key not configured"

**Nguyên nhân**: File `.env` chưa được tạo hoặc key sai

**Giải pháp**:
```bash
# 1. Kiểm tra file .env tồn tại
ls -la .env

# 2. Kiểm tra nội dung
cat .env | grep GEMINI

# 3. Đảm bảo key đúng format (bắt đầu bằng AIza)
# 4. Restart server
npm run dev
```

### Lỗi "429 - Too Many Requests"

**Nguyên nhân**: Vượt quá 60 requests/phút

**Giải pháp**:
- Đợi 1 phút và thử lại
- Hệ thống sẽ tự động retry
- Giảm số requests đồng thời

### Lỗi "Failed to parse response"

**Nguyên nhân**: Gemini trả về format không đúng

**Giải pháp**:
- Thử lại với prompt khác
- Hệ thống sẽ tự động fallback sang mock data
- Báo lỗi trong Console để debug

## So Sánh với OpenAI

| Tiêu Chí | Gemini (Free) | OpenAI GPT-3.5 | OpenAI GPT-4 |
|----------|---------------|----------------|--------------|
| **Giá** | MIỄN PHÍ | ~$0.002/1K tokens | ~$0.03/1K tokens |
| **Tiếng Việt** | Xuất sắc ⭐⭐⭐⭐⭐ | Tốt ⭐⭐⭐⭐ | Xuất sắc ⭐⭐⭐⭐⭐ |
| **Tốc độ** | Nhanh | Rất nhanh | Trung bình |
| **Rate Limit** | 60/phút | 3,500/phút | 500/phút |
| **Thẻ tín dụng** | KHÔNG cần | CẦN | CẦN |
| **Chất lượng** | Tốt ⭐⭐⭐⭐ | Tốt ⭐⭐⭐⭐ | Xuất sắc ⭐⭐⭐⭐⭐ |

### Khi Nào Dùng Gemini?

✅ **NÊN DÙNG** khi:
- Bạn cần giải pháp miễn phí
- Làm việc với tiếng Việt
- Ứng dụng giáo dục, trường học nhỏ
- Không có thẻ tín dụng
- Số lượng học sinh < 200/ngày

❌ **KHÔNG NÊN DÙNG** khi:
- Cần chất lượng tuyệt đối cao nhất (dùng GPT-4)
- Xử lý > 500 requests/phút
- Ứng dụng production lớn với nhiều người dùng

## Nâng Cao: Tùy Chỉnh Prompts

### Custom Question Generation

Chỉnh sửa file `src/services/geminiService.ts`:

```typescript
// Tìm method buildQuestionGenerationPrompt
private buildQuestionGenerationPrompt(...) {
  // Thêm yêu cầu của bạn
  return `Tạo ${count} câu hỏi về ${topic}...
  
  YÊU CẦU BỔ SUNG:
  - Phải có ít nhất 1 câu hỏi thực tế
  - Tránh câu hỏi quá dễ đoán
  - Đáp án sai phải hợp lý
  ...`;
}
```

### Custom Grading Rubric

```typescript
// Trong essayGradingService.ts
private buildEssayGradingPrompt(...) {
  return `Chấm điểm bài tự luận...
  
  TIÊU CHÍ CỦA TÔI:
  - Nội dung: 50%
  - Sáng tạo: 30%
  - Ngôn ngữ: 20%
  ...`;
}
```

## Câu Hỏi Thường Gặp

### Q: Có mất phí không?
**A**: HOÀN TOÀN MIỄN PHÍ! Không cần thẻ tín dụng.

### Q: Giới hạn có đủ không?
**A**: 
- Trường học nhỏ (<50 HS): ✅ Rất đủ
- Trường học vừa (50-200 HS): ✅ Đủ
- Trường học lớn (>200 HS): ⚠️ Có thể cần nhiều API keys

### Q: Làm sao có nhiều API keys?
**A**: 
1. Tạo nhiều tài khoản Google
2. Mỗi tài khoản = 1 API key
3. Rotation giữa các keys

### Q: Có cần internet không?
**A**: CÓ. Gemini chạy trên cloud của Google.

### Q: Độ trễ bao nhiêu?
**A**: ~1-3 giây cho mỗi request. Chấp nhận được!

### Q: Nếu Gemini lỗi thì sao?
**A**: Hệ thống tự động fallback sang:
1. OpenAI (nếu có key)
2. Mock data (câu hỏi mẫu)

## Hỗ Trợ và Debug

### Bật Debug Mode

```typescript
// Trong geminiService.ts
console.log('Gemini request:', prompt);
console.log('Gemini response:', text);
```

### Xem API Usage

Truy cập: https://makersuite.google.com/app/apikey
- Xem số requests đã dùng
- Monitor quota
- Tạo thêm keys nếu cần

### Báo Lỗi

Nếu gặp vấn đề:
1. Copy error message từ Console
2. Check file `.env` có đúng không
3. Test với curl:
```bash
curl https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_KEY \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

## Tài Nguyên Thêm

- 📖 **Official Docs**: https://ai.google.dev/docs
- 🎓 **Tutorials**: https://ai.google.dev/tutorials
- 💬 **Community**: https://github.com/google/generative-ai-docs/discussions
- 🐛 **Bug Report**: https://github.com/google/generative-ai-docs/issues

---

**Chúc bạn sử dụng Gemini thành công! 🚀**

Nếu cần hỗ trợ thêm, mở issue trên GitHub hoặc xem [TUTORIAL_TRAINING.vi.md](./TUTORIAL_TRAINING.vi.md)

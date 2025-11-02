# 📚 Tài Liệu Tiếng Việt - Intelligence Test Platform

## 🎯 Bạn đang tìm gì?

### 🔥 TÔI LÀ NGƯỜI MỚI - BẮT ĐẦU TỪ ĐÂU?

👉 **ĐỌC ĐẦU TIÊN:** [TUTORIAL_TRAINING.vi.md](./TUTORIAL_TRAINING.vi.md)

Tài liệu này trả lời TẤT CẢ câu hỏi:
- ✅ Tôi có cần train AI không? (Câu trả lời: KHÔNG!)
- ✅ Dataset lấy ở đâu?
- ✅ Train ở đâu?
- ✅ Sau khi train dùng như thế nào?
- ✅ Giao diện web dùng như thế nào?

### 🚀 TÔI MUỐN CHẠY HỆ THỐNG NGAY

👉 **ĐỌC:** [Hướng dẫn nhanh - QUICKSTART](../../QUICKSTART.vi.md)

Các bước:
1. `git clone` + `npm install`
2. `npm run dev`
3. Đăng nhập với tài khoản demo
4. Tạo đề thi và sử dụng

Thời gian: **5 phút**

### 🤖 TÔI MUỐN DÙNG AI (Tạo câu hỏi tự động, chấm tự luận)

👉 **ĐỌC:** [MODEL_TRAINING.md](./MODEL_TRAINING.md) - Phần đầu (FAQ)

**KHÔNG CẦN TRAINING!** Chỉ cần:
1. Lấy API key miễn phí từ [Google Gemini](https://makersuite.google.com/app/apikey)
2. Thêm vào file `.env`
3. Cài package: `npm install @google/generative-ai`
4. Xong!

Thời gian: **3 phút**

### 🔥 TÔI MUỐN DÙNG FIREBASE (Lưu dữ liệu online)

👉 **ĐỌC:** [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

Hướng dẫn từng bước setup Firebase, bao gồm:
- Tạo project
- Lấy config
- Setup Authentication & Firestore
- Security rules

Thời gian: **10-15 phút**

### 👁️ TÔI MUỐN TRAIN CUSTOM ANTI-CHEAT MODEL

👉 **ĐỌC:** [TUTORIAL_TRAINING.vi.md](./TUTORIAL_TRAINING.vi.md) - Phần 4.1

⚠️ **Lưu ý:** Chỉ cần khi muốn phát hiện hành vi đặc biệt. Hệ thống đã có sẵn BlazeFace.

Yêu cầu:
- Biết Python
- Thu thập 500-1000 ảnh training data
- 1-2 giờ

### 📊 TÔI MUỐN HIỂU QUY TRÌNH LÀM VIỆC

👉 **ĐỌC:** [WORKFLOW_GUIDE.vi.md](./WORKFLOW_GUIDE.vi.md)

Sơ đồ trực quan giải thích:
- Quy trình giáo viên
- Quy trình học sinh
- Luồng hoạt động AI
- Cấu trúc folders
- Decision trees

---

## 📖 Danh Sách Đầy Đủ Tài Liệu

### Hướng Dẫn Cơ Bản

| Tài Liệu | Mô Tả | Thời Gian Đọc |
|----------|-------|---------------|
| **[TUTORIAL_TRAINING.vi.md](./TUTORIAL_TRAINING.vi.md)** ⭐ | **Hướng dẫn toàn diện A-Z**, giải đáp mọi thắc mắc | 20 phút |
| **[QUICKSTART](../../QUICKSTART.vi.md)** | Quick start, chạy ngay trong 5 phút | 5 phút |
| **[WORKFLOW_GUIDE.vi.md](./WORKFLOW_GUIDE.vi.md)** | Sơ đồ quy trình làm việc trực quan | 10 phút |

### Hướng Dẫn Kỹ Thuật

| Tài Liệu | Mô Tả | Thời Gian |
|----------|-------|-----------|
| **[MODEL_TRAINING.md](./MODEL_TRAINING.md)** | Chi tiết về AI models, APIs, training | 15 phút |
| **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** | Setup Firebase backend từng bước | 10 phút |

### Scripts & Tools

| Folder | Mô Tả |
|--------|-------|
| **[training-scripts/](../examples/training-scripts/)** | Python scripts để train models |
| **[sample-data/](../examples/sample-data/)** | Dữ liệu mẫu để test scripts |

---

## 🎓 Học Theo Trình Tự

### Level 1: Người Mới Bắt Đầu (Bắt buộc)

1. ✅ [TUTORIAL_TRAINING.vi.md](./TUTORIAL_TRAINING.vi.md) - Đọc phần 1, 2
2. ✅ [QUICKSTART](../../QUICKSTART.vi.md) - Làm theo hướng dẫn
3. ✅ Chạy app, đăng nhập, tạo câu hỏi thủ công
4. ✅ Tạo đề thi và test với học sinh

**Mục tiêu:** Hiểu và sử dụng được hệ thống cơ bản

### Level 2: Người Dùng Thông Thường (Tùy chọn)

1. ✅ [MODEL_TRAINING.md](./MODEL_TRAINING.md) - Phần AI APIs
2. ✅ Lấy Gemini API key miễn phí
3. ✅ Dùng AI tạo câu hỏi tự động
4. ✅ [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Setup Firebase
5. ✅ Deploy lên production với Firebase

**Mục tiêu:** Sử dụng AI features và deploy production

### Level 3: Advanced User (Chỉ khi cần)

1. ✅ [TUTORIAL_TRAINING.vi.md](./TUTORIAL_TRAINING.vi.md) - Phần 4
2. ✅ [training-scripts/](../examples/training-scripts/) - Đọc README
3. ✅ Thu thập training data
4. ✅ Train custom models
5. ✅ Deploy custom models

**Mục tiêu:** Customize models cho nhu cầu đặc biệt

---

## ❓ Câu Hỏi Thường Gặp

### Tôi có cần train AI không?

**❌ KHÔNG** - 90% người dùng không cần train. Xem [TUTORIAL_TRAINING.vi.md - Phần 1](./TUTORIAL_TRAINING.vi.md)

### Hệ thống có miễn phí không?

**✅ CÓ** - Hoàn toàn miễn phí nếu:
- Dùng dev mode (không Firebase)
- Dùng Gemini API (miễn phí)
- Dùng BlazeFace built-in

### Tôi không biết code, có dùng được không?

**✅ CÓ** - Chỉ cần biết:
- Chạy `npm install` và `npm run dev`
- Tạo câu hỏi trong giao diện web
- Không cần code gì thêm

### Tôi cần biết gì để dùng hệ thống?

**Cơ bản:**
- Biết cài Node.js
- Biết chạy terminal/cmd cơ bản
- Biết dùng web browser

**Nâng cao (tùy chọn):**
- Firebase basics (nếu muốn deploy)
- API keys (nếu muốn dùng AI)
- Python (nếu muốn train custom models)

### Dataset lấy ở đâu?

**Không cần dataset** cho hầu hết features!

- **AI tạo câu hỏi:** Không cần dataset, chỉ cần API
- **Anti-cheat:** BlazeFace đã có sẵn
- **Custom anti-cheat:** Thu thập qua webcam (có script)
- **CAT calibration:** Export từ app sau khi có học sinh

### Giao diện web khó dùng?

Xem:
1. [UserGuide trong app](#) - Click "User Guide" từ dashboard
2. [WORKFLOW_GUIDE.vi.md](./WORKFLOW_GUIDE.vi.md) - Sơ đồ trực quan
3. [TUTORIAL_TRAINING.vi.md](./TUTORIAL_TRAINING.vi.md) - Hướng dẫn chi tiết

### Tôi gặp lỗi, làm sao?

1. Đọc phần **Troubleshooting** trong tài liệu liên quan
2. Kiểm tra browser console (F12)
3. Search lỗi trên Google
4. Mở [GitHub Issue](https://github.com/imnothoan/Intelligence-Test/issues)

---

## 📞 Hỗ Trợ & Liên Hệ

### Tài Liệu Chính Thức
- **GitHub Repo:** https://github.com/imnothoan/Intelligence-Test
- **Issues:** https://github.com/imnothoan/Intelligence-Test/issues

### Links Hữu Ích
- **Google Gemini API:** https://makersuite.google.com/app/apikey (Miễn phí)
- **Firebase Console:** https://console.firebase.google.com
- **OpenAI Platform:** https://platform.openai.com (Trả phí)
- **Ollama:** https://ollama.com (Local, miễn phí)

### Cộng Đồng
- Mở Issue để đặt câu hỏi
- Pull Request nếu muốn contribute
- Star ⭐ project nếu thấy hữu ích!

---

## 🗺️ Lộ Trình Khuyến Nghị

```
START
  │
  ▼
📖 Đọc TUTORIAL_TRAINING.vi.md
  │
  ▼
🚀 Làm theo QUICKSTART.vi.md
  │
  ▼
✅ Chạy app thành công
  │
  ▼
[Muốn dùng AI?] ──NO──> [OK, dùng thủ công]
  │
 YES
  │
  ▼
📖 Đọc MODEL_TRAINING.md
  │
  ▼
🔑 Lấy Gemini API key
  │
  ▼
✅ Dùng AI tạo câu hỏi
  │
  ▼
[Muốn deploy?] ──NO──> [OK, dùng local]
  │
 YES
  │
  ▼
📖 Đọc FIREBASE_SETUP.md
  │
  ▼
🔥 Setup Firebase
  │
  ▼
🚀 Deploy production
  │
  ▼
[Muốn custom?] ──NO──> [✅ HOÀN TẤT!]
  │
 YES
  │
  ▼
📖 Đọc training-scripts/README.md
  │
  ▼
🔧 Train custom models
  │
  ▼
✅ HOÀN TẤT TOÀN BỘ!
```

---

## 📝 Ghi Chú

### Cập Nhật Tài Liệu

Tài liệu được cập nhật thường xuyên. Các tài liệu **MỚI** được đánh dấu ⭐ hoặc 🔥.

### Ngôn Ngữ

- **Tiếng Việt:** Folder này (`docs/vi/`)
- **English:** `docs/en/`
- **README chính:** `README.md` (English)

### Đóng Góp

Nếu thấy tài liệu chưa rõ hoặc có lỗi:
1. Mở [Issue](https://github.com/imnothoan/Intelligence-Test/issues)
2. Hoặc tạo Pull Request để sửa
3. Mọi đóng góp đều được chào đón! 🙏

---

**Chúc bạn thành công với Intelligence Test Platform! 🎉**

*Last updated: 2024*

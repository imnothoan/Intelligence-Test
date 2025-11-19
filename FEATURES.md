# Tính Năng Hệ Thống

## 🎓 Dành Cho Giáo Viên

### 1. Quản Lý Lớp Học

- ✅ Tạo và quản lý nhiều lớp học
- ✅ Thêm/xóa học sinh
- ✅ Xem danh sách học sinh trong lớp
- ✅ Gán đề thi cho lớp

**Cách sử dụng:**
1. Dashboard → "Tạo Lớp Mới"
2. Nhập tên và mô tả lớp
3. Thêm học sinh bằng email

### 2. Ngân Hàng Câu Hỏi

- ✅ Tạo câu hỏi thủ công
- ✅ Tạo câu hỏi tự động với AI (Gemini)
- ✅ Quản lý độ khó câu hỏi (0.0 - 1.0)
- ✅ Phân loại theo chủ đề
- ✅ Hỗ trợ trắc nghiệm và tự luận
- ✅ Tìm kiếm và lọc câu hỏi

**AI Question Generation:**
- **Chủ đề**: Nhập chủ đề (vd: "Toán học lớp 10")
- **Số lượng**: 1-50 câu
- **Độ khó**: 
  - 0.0-0.3: Dễ (Nhận biết)
  - 0.3-0.7: Trung bình (Thông hiểu, Vận dụng)
  - 0.7-1.0: Khó (Vận dụng cao)
- **Ngôn ngữ**: Tiếng Việt hoặc English

### 3. Tạo Đề Thi

**Loại đề thi:**

#### 3.1. Đề Thi Truyền Thống
- Số câu hỏi cố định
- Tất cả học sinh làm cùng câu hỏi
- Phù hợp với bài kiểm tra nhỏ

#### 3.2. Đề Thi CAT (Computerized Adaptive Testing)
- Câu hỏi thích ứng theo năng lực học sinh
- Mỗi học sinh có bộ câu hỏi khác nhau
- Ước lượng năng lực chính xác hơn
- Tiết kiệm thời gian

**Cấu hình:**
- ✅ Tiêu đề và mô tả
- ✅ Thời gian làm bài (phút)
- ✅ Bật/tắt CAT algorithm
- ✅ Bật/tắt chống gian lận
- ✅ Lịch thi (thời gian bắt đầu/kết thúc)
- ✅ Gán cho lớp học

### 4. Giám Sát Thi Thời Gian Thực

**Real-time Monitoring Dashboard:**
- ✅ Xem danh sách học sinh đang thi
- ✅ Tiến độ làm bài (%)
- ✅ Thời gian còn lại
- ✅ Số cảnh báo gian lận
- ✅ WebSocket live updates
- ✅ Connection status indicator

**Anti-Cheat Warnings:**
- 🔴 High: Nhiều người, không có mặt
- 🟡 Medium: Nhìn ra ngoài nhiều lần
- 🟢 Low: Cảnh báo đầu tiên

**Actions:**
- Xem chi tiết từng học sinh
- Đánh dấu bài thi đáng ngờ
- Xem lịch sử cảnh báo

### 5. Chấm Bài Tự Động

#### 5.1. Trắc Nghiệm
- Tự động chấm ngay khi nộp bài
- Tính điểm theo công thức tùy chỉnh
- Thống kê đáp án

#### 5.2. Tự Luận (AI)
- **Gemini AI** (miễn phí, khuyến nghị)
- Chấm theo rubric chi tiết
- Feedback cụ thể cho từng tiêu chí
- Gợi ý cải thiện

**Rubric tùy chỉnh:**
- Nội dung (40%)
- Cấu trúc (30%)
- Ngôn ngữ (20%)
- Sáng tạo (10%)

### 6. Phân Tích & Báo Cáo

**Dashboard Analytics:**
- 📊 Điểm trung bình lớp
- 📈 Phân bố điểm
- 📉 Câu hỏi khó/dễ nhất
- 🎯 Tỷ lệ hoàn thành
- 📅 Xu hướng theo thời gian

**Export:**
- CSV: Danh sách điểm
- PDF: Báo cáo chi tiết (coming soon)

## 📝 Dành Cho Học Sinh

### 1. Xem Đề Thi

- ✅ Danh sách đề thi được gán
- ✅ Thông tin: Thời gian, số câu, loại thi
- ✅ Trạng thái: Chưa làm, Đang làm, Đã nộp
- ✅ Lịch sử điểm

### 2. Làm Bài Thi

**Trước khi bắt đầu:**
- 📋 Hướng dẫn làm bài
- ⚠️ Lưu ý về camera (nếu có)
- 🖥️ Chế độ toàn màn hình

**Trong khi làm bài:**
- ✅ Auto-save mỗi 5 giây
- ✅ Timer đếm ngược
- ✅ Thanh tiến độ
- ✅ Đánh dấu câu hỏi (Ctrl/⌘ + B)
- ✅ Camera preview (góc phải trên)

**Anti-Cheat:**
- 📷 Camera theo dõi liên tục
- 🔍 Phát hiện không có mặt
- 👥 Phát hiện nhiều người
- 👀 Phát hiện nhìn ra ngoài
- ⚠️ Cảnh báo real-time

### 3. Xem Kết Quả

- ✅ Điểm số ngay sau khi nộp
- ✅ Đáp án chi tiết (trắc nghiệm)
- ✅ Feedback từ AI (tự luận)
- ✅ Phân tích điểm mạnh/yếu
- ✅ So sánh với điểm trung bình lớp

## 🤖 Công Nghệ AI

### 1. Google Gemini (Miễn Phí)

**Ưu điểm:**
- ✅ Hoàn toàn miễn phí
- ✅ Không cần thẻ tín dụng
- ✅ 60 requests/phút, 1500/ngày
- ✅ Hỗ trợ tiếng Việt tốt
- ✅ Phù hợp trường học <200 sinh viên/ngày

**Sử dụng cho:**
- Tạo câu hỏi trắc nghiệm
- Tạo câu hỏi tự luận
- Chấm bài tự luận
- Generate feedback

### 2. OpenAI (Tùy chọn)

**Khi nào dùng:**
- ❌ Gemini hết quota
- ❌ Cần độ chính xác cao hơn
- ❌ Essay grading phức tạp

**Lưu ý:**
- 💰 Tốn phí ($0.002/1K tokens)
- 🔑 Cần credit card

### 3. CAT Algorithm

**Item Response Theory (IRT):**
- Ước lượng năng lực học sinh (θ)
- Chọn câu hỏi phù hợp với θ
- Cập nhật θ sau mỗi câu trả lời
- Dừng khi đạt độ chính xác mong muốn

**Ưu điểm:**
- ✅ Chính xác hơn đề thi truyền thống
- ✅ Ít câu hỏi hơn (15 vs 30-40)
- ✅ Tiết kiệm thời gian
- ✅ Giảm stress cho học sinh

### 4. Anti-Cheat với TensorFlow.js

**BlazeFace Model:**
- Phát hiện khuôn mặt real-time
- Chạy trong browser (privacy)
- Không gửi ảnh lên server
- Lightweight (~500KB)

**Detections:**
- ✅ Face detection
- ✅ Multiple faces
- ✅ No face detected
- ✅ Looking away

## 🔧 Tính Năng Kỹ Thuật

### 1. WebSocket Real-time

**Monitoring:**
- Live student progress
- Instant cheat warnings
- Connection status
- Auto-reconnection

**Events:**
- `exam_started`
- `exam_progress`
- `cheat_warning`
- `exam_completed`

### 2. JWT Authentication

- Access token (1 hour)
- Refresh token (7 days)
- Auto token refresh
- Secure httpOnly cookies

### 3. API Integration

**RESTful API:**
- 30+ endpoints
- Pagination support
- Filtering & sorting
- Error handling
- Rate limiting (100 req/15min)

### 4. State Management

**Zustand Store:**
- Centralized state
- API integration
- Optimistic updates
- Loading states
- Error handling

### 5. Responsive Design

- ✅ Desktop (1920x1080)
- ✅ Laptop (1366x768)
- ✅ Tablet (768x1024)
- ⚠️ Mobile (limited support)

## 🎯 Roadmap

### Version 2.0 (Current)
- [x] API-based architecture
- [x] WebSocket monitoring
- [x] Gemini AI integration
- [x] CAT algorithm
- [x] Anti-cheat system

### Version 2.1 (Next)
- [ ] PDF report export
- [ ] Email notifications
- [ ] Question bank import/export
- [ ] Advanced analytics charts
- [ ] Mobile app (React Native)

### Version 3.0 (Future)
- [ ] Video proctoring
- [ ] Plagiarism detection
- [ ] LMS integration (Moodle, Canvas)
- [ ] Multi-language UI
- [ ] Peer review system

## 📚 Tài Liệu Thêm

- **[SETUP.md](./SETUP.md)**: Hướng dẫn cài đặt
- **[README.md](./README.md)**: Thông tin tổng quan
- **Server Docs**: https://github.com/imnothoan/Intelligence-Test-Server

## 💡 Tips & Best Practices

### Cho Giáo Viên

1. **Tạo câu hỏi:**
   - Dùng AI để draft, sau đó review
   - Phân loại độ khó chính xác
   - Đa dạng hóa chủ đề

2. **CAT Algorithm:**
   - Cần ít nhất 30 câu trong bank
   - Phân bố đều các mức độ khó
   - Nên có 50-100 câu tốt nhất

3. **Anti-Cheat:**
   - Thông báo học sinh trước
   - Yêu cầu môi trường yên tĩnh
   - Check camera trước khi thi

### Cho Học Sinh

1. **Chuẩn bị:**
   - Test camera trước
   - Đảm bảo ánh sáng đủ
   - Tắt các app không cần thiết

2. **Trong khi thi:**
   - Nhìn thẳng vào màn hình
   - Không rời khỏi ghế
   - Không có người khác

3. **Kỹ thuật:**
   - Đọc kỹ đề trước
   - Đánh dấu câu khó
   - Quản lý thời gian tốt

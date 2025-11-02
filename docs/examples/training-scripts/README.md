# Training Scripts - Hướng Dẫn Sử Dụng

## 📚 Tổng Quan

Folder này chứa các scripts Python để training và calibrate AI models cho Intelligence Test Platform.

**⚠️ LƯU Ý QUAN TRỌNG:** 
- **90% người dùng KHÔNG CẦN chạy các scripts này!**
- Hệ thống đã có sẵn AI, chỉ cần thêm API key (miễn phí)
- Chỉ dùng khi muốn custom nâng cao

---

## 📁 Danh Sách Scripts

### 1. `collect_anticheat_data.py` - Thu Thập Dữ Liệu Anti-Cheat

**Mục đích:** Thu thập ảnh từ webcam để training model phát hiện gian lận custom.

**Khi nào dùng:**
- Muốn model phát hiện hành vi gian lận đặc biệt (VD: dùng điện thoại, xem sách)
- BlazeFace mặc định không đủ chính xác cho môi trường của bạn

**Yêu cầu:**
```bash
pip install opencv-python numpy
```

**Sử dụng:**
```bash
python collect_anticheat_data.py
```

**Quy trình:**
1. Script sẽ hỏi bạn muốn thu thập loại dữ liệu nào
2. Chọn "1" cho normal behavior (ngồi nhìn màn hình)
3. Chọn "2" cho cheating behavior (nhìn đi chỗ khác, nhiều người...)
4. Nhấn SPACE để chụp ảnh
5. Nhấn Q để kết thúc
6. Khuyến nghị: 500-1000 ảnh mỗi loại

**Output:**
```
data/anticheat_training/
├── normal/     # Ảnh hành vi bình thường
└── cheat/      # Ảnh hành vi gian lận
```

---

### 2. `train_anticheat_model.py` - Training Anti-Cheat Model

**Mục đích:** Training CNN model để phát hiện gian lận từ dữ liệu đã thu thập.

**Yêu cầu:**
```bash
pip install tensorflow opencv-python numpy scikit-learn matplotlib
```

**Sử dụng:**
```bash
python train_anticheat_model.py
```

**Quy trình:**
1. Script tự động load dữ liệu từ `data/anticheat_training/`
2. Chia train/val/test (70%/15%/15%)
3. Train CNN model (10-30 phút tùy CPU/GPU)
4. Đánh giá accuracy
5. Lưu model và convert sang TensorFlow.js

**Output:**
```
models/
├── anticheat_model.h5          # Keras model
├── best_model.h5                # Best checkpoint
├── training_history.png         # Biểu đồ training
└── anticheat_tfjs/              # TensorFlow.js model
    ├── model.json
    └── group1-shard1of1.bin
```

**Bước tiếp theo:**
Copy `models/anticheat_tfjs/` vào `Intelligence-Test/public/models/anticheat-custom/`

---

### 3. `calibrate_cat.py` - Calibrate CAT Algorithm

**Mục đích:** Tính toán độ khó chính xác cho câu hỏi dựa trên dữ liệu học sinh thực tế.

**Khi nào dùng:**
- Đã có 100+ học sinh làm bài
- Muốn độ khó câu hỏi chính xác hơn

**Yêu cầu:**
```bash
pip install pandas numpy scipy
```

**Input file format (CSV):**
```csv
student_id,question_id,correct
S001,Q001,1
S001,Q002,0
S002,Q001,1
...
```

**Cách lấy dữ liệu:**
1. Vào Analytics Dashboard trong app
2. Export "Student Responses" 
3. Lưu thành `responses.csv`

**Sử dụng:**
```bash
python calibrate_cat.py responses.csv
```

**Phương pháp:**

1. **Simple Calibration** (ít dữ liệu, < 100 responses/câu)
   - Difficulty = 1 - (tỷ lệ đúng)
   - Nhanh, đơn giản
   - Độ chính xác vừa phải

2. **IRT Calibration** (nhiều dữ liệu, > 100 responses/câu)
   - Dựa trên Item Response Theory (1PL Rasch Model)
   - Chính xác hơn
   - Mất thời gian tính toán

**Output:**
```
difficulties_simple.csv    # Kết quả calibration đơn giản
difficulties_irt.csv       # Kết quả IRT (nếu có)
```

**Bước tiếp theo:**
1. Mở file CSV
2. Vào app → Question Bank
3. Update difficulty cho từng câu hỏi

---

## 🚀 Quick Start Guide

### Scenario 1: Tôi muốn training anti-cheat model

```bash
# 1. Thu thập dữ liệu
python collect_anticheat_data.py
# → Thu thập 500+ ảnh normal và 500+ ảnh cheat

# 2. Training
python train_anticheat_model.py
# → Đợi 10-30 phút

# 3. Deploy
cp -r models/anticheat_tfjs Intelligence-Test/public/models/anticheat-custom/

# 4. Test trong app
# Tạo đề thi với Anti-Cheat enabled
```

### Scenario 2: Tôi muốn calibrate CAT

```bash
# 1. Export dữ liệu từ app
# Analytics → Export Student Responses → responses.csv

# 2. Calibrate
python calibrate_cat.py responses.csv

# 3. Update trong app
# Question Bank → Import difficulties hoặc update thủ công
```

---

## 📊 Kết Quả Mong Đợi

### Anti-Cheat Model
- **Accuracy > 90%**: Tốt, có thể dùng
- **Accuracy 80-90%**: Chấp nhận được, có thể cần thêm data
- **Accuracy < 80%**: Cần thu thập thêm dữ liệu

### CAT Calibration
- **Phân bố cân bằng**: ~30% Easy, ~40% Medium, ~30% Hard
- **Không cân bằng**: Cần thêm câu hỏi ở mức độ thiếu

---

## ❓ FAQ

### Q: Tôi chạy script bị lỗi "ModuleNotFoundError"?
**A:** Cài package còn thiếu:
```bash
pip install tensorflow opencv-python numpy pandas scipy scikit-learn matplotlib
```

### Q: Training mất bao lâu?
**A:** 
- Anti-cheat: 10-30 phút (CPU), 5-10 phút (GPU)
- CAT calibration: 1-5 phút

### Q: Tôi không có GPU, training có được không?
**A:** Được! Chỉ mất thời gian lâu hơn. TensorFlow tự động dùng CPU.

### Q: Thu thập bao nhiêu ảnh là đủ?
**A:** 
- Minimum: 200 ảnh/loại
- Khuyến nghị: 500-1000 ảnh/loại
- Tốt nhất: 1000+ ảnh/loại với đa dạng điều kiện

### Q: Làm sao biết model đã tốt chưa?
**A:**
- Test trên app thực tế
- Accuracy > 90%
- Ít false positives (báo nhầm học sinh bình thường)

### Q: Tôi có thể training trên Google Colab không?
**A:** Có! Upload scripts và data lên Colab, chạy như bình thường. Colab có GPU miễn phí.

---

## 🔧 Troubleshooting

### Lỗi: "No module named 'tensorflow'"
```bash
pip install tensorflow
```

### Lỗi: "Could not open webcam"
- Kiểm tra webcam đã kết nối
- Đóng các app khác đang dùng webcam (Zoom, Skype...)
- Thử chạy lại

### Lỗi: "Not enough data"
- Thu thập thêm ảnh (collect_anticheat_data.py)
- Hoặc giảm test_size trong code

### Model accuracy thấp
- Thu thập thêm dữ liệu đa dạng hơn
- Thử tăng epochs trong train_anticheat_model.py
- Kiểm tra quality của ảnh training

---

## 📖 Tài Liệu Liên Quan

- **[TUTORIAL_TRAINING.vi.md](../../vi/TUTORIAL_TRAINING.vi.md)** - Hướng dẫn tổng quan
- **[MODEL_TRAINING.md](../../vi/MODEL_TRAINING.md)** - Chi tiết technical
- **[WORKFLOW_GUIDE.vi.md](../../vi/WORKFLOW_GUIDE.vi.md)** - Sơ đồ quy trình

---

## 💡 Tips

1. **Ánh sáng tốt**: Thu thập ảnh trong điều kiện ánh sáng đủ
2. **Đa dạng**: Thu thập ở nhiều góc độ, nhiều người khác nhau
3. **Chất lượng > Số lượng**: 500 ảnh tốt > 1000 ảnh mờ
4. **Backup**: Lưu model đã train để không phải train lại
5. **Test nhiều**: Test model trên nhiều trường hợp khác nhau

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Đọc lại hướng dẫn trong script (phần đầu file)
2. Kiểm tra error message và search Google
3. Mở GitHub Issue với thông tin chi tiết
4. Đọc FAQ trong [TUTORIAL_TRAINING.vi.md](../../vi/TUTORIAL_TRAINING.vi.md)

---

**Chúc bạn training thành công! 🎉**

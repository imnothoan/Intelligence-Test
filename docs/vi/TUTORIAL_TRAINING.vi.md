# 📚 Hướng Dẫn Chi Tiết: Training và Sử Dụng AI

## 🎯 Mục Đích Tài Liệu

Tài liệu này sẽ hướng dẫn BẠN - người mới bắt đầu - **từng bước cụ thể** về:
1. ✅ **AI trong hệ thống này là gì và hoạt động thế nào**
2. ✅ **CÓ CẦN train AI không? (Câu trả lời ngắn: ĐA SỐ TRƯỜNG HỢP KHÔNG)**
3. ✅ **Nếu muốn train, train ở đâu và làm thế nào**
4. ✅ **Lấy dataset từ đâu**
5. ✅ **Sử dụng sau khi train như thế nào**

---

## 📖 Phần 1: Hiểu về AI trong hệ thống

### Hệ thống có 3 loại AI:

#### 1️⃣ **AI Sinh Câu Hỏi (Question Generation)**
- **Làm gì**: Tự động tạo câu hỏi thi
- **Công nghệ**: API từ OpenAI, Google Gemini, hoặc chạy local với Ollama
- **CẦN TRAIN KHÔNG**: ❌ **KHÔNG** - chỉ cần API key (miễn phí hoặc trả phí)
- **Cách dùng**: Nhấn nút "Generate Question" trong app

#### 2️⃣ **AI Chấm Điểm Tự Luận (Essay Grading)**
- **Làm gì**: Tự động chấm điểm bài tự luận
- **Công nghệ**: API từ OpenAI, Google Gemini
- **CẦN TRAIN KHÔNG**: ❌ **KHÔNG** - chỉ cần API key
- **Cách dùng**: Tự động khi học sinh nộp bài tự luận

#### 3️⃣ **AI Phát Hiện Gian Lận (Anti-Cheat)**
- **Làm gì**: Phát hiện học sinh gian lận qua webcam
- **Công nghệ**: BlazeFace (Google) - đã tích hợp sẵn
- **CẦN TRAIN KHÔNG**: ❌ **KHÔNG** - đã có sẵn, hoạt động ngay
- **CẦN TRAIN chỉ khi**: Muốn custom cho trường hợp đặc biệt

### 🔥 KẾT LUẬN QUAN TRỌNG:

> **BẠN KHÔNG CẦN TRAIN BẤT KỲ MODEL NÀO!**
> 
> Hệ thống đã sẵn sàng sử dụng. Chỉ cần:
> - Cài đặt và chạy app
> - (Tùy chọn) Thêm API key để dùng AI features

---

## 🚀 Phần 2: Hướng Dẫn Sử Dụng KHÔNG CẦN Training

### Bước 1: Cài Đặt và Chạy Hệ Thống

```bash
# 1. Clone code về máy
git clone https://github.com/imnothoan/Intelligence-Test.git
cd Intelligence-Test

# 2. Cài dependencies
npm install

# 3. Tạo file cấu hình
cp .env.example .env

# 4. Chỉnh sửa file .env
# Mở file .env và set:
VITE_DEV_MODE=true

# 5. Chạy app
npm run dev

# 6. Mở trình duyệt
# Truy cập: http://localhost:5173
```

### Bước 2: Đăng Nhập và Sử Dụng

```
👨‍🏫 Giáo viên:
Email: instructor@test.com
Password: (bất kỳ)

👨‍🎓 Học sinh:
Email: student@test.com
Password: (bất kỳ)
```

### Bước 3: Tạo Đề Thi (Không dùng AI)

1. Đăng nhập với tài khoản giáo viên
2. Vào "Question Bank" → "Add Question"
3. Nhập câu hỏi thủ công:
   - Câu hỏi
   - 4 đáp án
   - Đáp án đúng
   - Độ khó (0.0 - 1.0)
4. Lưu câu hỏi
5. Vào "Create Exam" → Chọn câu hỏi đã tạo → Tạo đề thi

### Bước 4: Học Sinh Làm Bài

1. Đăng nhập với tài khoản học sinh
2. Xem danh sách đề thi
3. Nhấn "Start Exam"
4. Làm bài và nộp

✅ **HỆ THỐNG ĐÃ HOẠT ĐỘNG! Không cần AI, không cần training!**

---

## 🤖 Phần 3: Thêm AI Features (Không Cần Training)

### Option A: Dùng Google Gemini (MIỄN PHÍ - KHUYẾN NGHỊ)

#### Tại sao chọn Gemini?
- ✅ Hoàn toàn miễn phí
- ✅ Không cần thẻ tín dụng
- ✅ 60 requests/phút (đủ cho lớp học 30-50 người)
- ✅ Hỗ trợ tiếng Việt tốt

#### Bước 1: Lấy API Key (3 phút)

1. Mở trình duyệt, truy cập: **https://makersuite.google.com/app/apikey**
2. Đăng nhập bằng Gmail của bạn
3. Nhấn nút **"Create API Key"**
4. Chọn **"Create API key in new project"**
5. Đợi 10 giây, API key sẽ xuất hiện
6. Nhấn **Copy** để copy API key (dạng: AIza...)

#### Bước 2: Thêm vào Hệ Thống (1 phút)

```bash
# 1. Mở file .env trong thư mục Intelligence-Test
# Dùng notepad hoặc editor bất kỳ

# 2. Thêm dòng này (thay YOUR_KEY bằng key vừa copy):
VITE_GEMINI_API_KEY=AIza...your-key-here...

# 3. Lưu file

# 4. Restart app (Ctrl+C rồi chạy lại npm run dev)
```

#### Bước 3: Cài Thư Viện (2 phút)

```bash
cd Intelligence-Test
npm install @google/generative-ai
```

#### Bước 4: Sử Dụng

Bây giờ trong app:
1. Vào **"Question Bank"** → **"Generate Question"**
2. Nhập topic (VD: "Lịch sử Việt Nam")
3. Chọn độ khó
4. Nhấn **"Generate"**
5. AI sẽ tự động tạo câu hỏi!

✅ **XONG! Bạn đã có AI sinh câu hỏi tự động!**

### Option B: Dùng Ollama (MIỄN PHÍ, Chạy Local)

#### Khi nào dùng Ollama?
- ✅ Muốn hoàn toàn miễn phí, không giới hạn
- ✅ Muốn bảo mật tuyệt đối (không gửi data ra internet)
- ⚠️ Cần máy mạnh (8GB RAM trở lên)

#### Bước 1: Cài Ollama

**Trên Windows:**
1. Tải từ: **https://ollama.com/download/windows**
2. Chạy file .exe và cài đặt
3. Mở Command Prompt

**Trên Mac:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Trên Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### Bước 2: Tải Model AI

```bash
# Model nhỏ, nhanh (cần 4GB RAM)
ollama pull gemma:2b

# Hoặc model trung bình (cần 8GB RAM) - Khuyến nghị
ollama pull llama2:7b

# Đợi tải xong (2-10 phút tùy mạng)
```

#### Bước 3: Chạy Server

```bash
# Mở terminal/cmd mới
ollama serve

# Để terminal này chạy. Server sẽ ở http://localhost:11434
```

#### Bước 4: Test

```bash
# Mở terminal/cmd khác
ollama run llama2 "Tạo 1 câu hỏi toán học"

# Nếu có kết quả → Thành công!
```

#### Bước 5: Tích Hợp vào App

File mẫu đã có sẵn trong `src/services/aiQuestionGenerator.ts`, chỉ cần uncomment phần Ollama.

✅ **XONG! AI chạy hoàn toàn trên máy bạn!**

---

## 🎓 Phần 4: CHỈ ĐỌC NẾU BẠN MUỐN TRAIN MODEL RIÊNG

> ⚠️ **CHÚ Ý**: Phần này CHỈ dành cho người có kiến thức lập trình Python/Machine Learning và muốn tùy chỉnh nâng cao!

### 4.1. Training Model Anti-Cheat Custom

#### Khi nào cần?
- Bạn muốn phát hiện các hành vi gian lận đặc biệt (VD: dùng điện thoại, mở sách...)
- BlazeFace mặc định không đủ chính xác cho môi trường của bạn

#### Yêu Cầu
- ✅ Biết Python
- ✅ Có GPU (khuyến nghị) hoặc CPU mạnh
- ✅ Có 500-1000 ảnh training data

#### Bước 1: Chuẩn Bị Môi Trường

```bash
# 1. Cài Python 3.8+ (nếu chưa có)
# Tải từ: https://www.python.org/downloads/

# 2. Tạo thư mục làm việc
mkdir anticheat-training
cd anticheat-training

# 3. Cài thư viện
pip install tensorflow opencv-python numpy pillow scikit-learn
```

#### Bước 2: Thu Thập Dữ Liệu

**Tạo file `collect_data.py`:**

```python
import cv2
import os

def collect_images(label, output_dir):
    """Thu thập ảnh từ webcam"""
    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(0)
    count = 0
    
    print(f"\n=== Thu thập ảnh: {label} ===")
    print("Nhấn SPACE để chụp, Q để thoát")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Hiển thị
        cv2.putText(frame, f"{label} - Count: {count}", 
                   (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 
                   1, (0, 255, 0), 2)
        cv2.imshow('Thu thập dữ liệu', frame)
        
        key = cv2.waitKey(1)
        if key == ord(' '):  # Space = chụp
            filepath = os.path.join(output_dir, f"{label}_{count:04d}.jpg")
            cv2.imwrite(filepath, frame)
            print(f"Đã lưu: {filepath}")
            count += 1
        elif key == ord('q'):  # Q = thoát
            break
    
    cap.release()
    cv2.destroyAllWindows()
    print(f"Đã thu thập {count} ảnh")

# Chạy
if __name__ == '__main__':
    # Thu thập ảnh "bình thường" (nhìn màn hình)
    collect_images('normal', 'data/normal')
    
    # Thu thập ảnh "gian lận" (nhìn đi chỗ khác, nhiều người...)
    collect_images('cheat', 'data/cheat')
```

**Cách chạy:**
```bash
python collect_data.py

# Sẽ xuất hiện cửa sổ webcam
# Thu thập 500-1000 ảnh cho mỗi loại
```

#### Bước 3: Training Model

**Tạo file `train_model.py`:**

```python
import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import cv2
from sklearn.model_selection import train_test_split

def load_images(directory, label):
    """Load ảnh và gán label"""
    images = []
    labels = []
    
    for filename in os.listdir(directory):
        if filename.endswith('.jpg'):
            filepath = os.path.join(directory, filename)
            img = cv2.imread(filepath)
            img = cv2.resize(img, (224, 224))
            img = img / 255.0  # Normalize
            
            images.append(img)
            labels.append(label)
    
    return np.array(images), np.array(labels)

def create_model():
    """Tạo CNN model"""
    model = keras.Sequential([
        layers.Input(shape=(224, 224, 3)),
        
        # Block 1
        layers.Conv2D(32, 3, activation='relu'),
        layers.MaxPooling2D(2),
        layers.BatchNormalization(),
        
        # Block 2
        layers.Conv2D(64, 3, activation='relu'),
        layers.MaxPooling2D(2),
        layers.BatchNormalization(),
        
        # Block 3
        layers.Conv2D(128, 3, activation='relu'),
        layers.MaxPooling2D(2),
        layers.BatchNormalization(),
        
        # Classifier
        layers.Flatten(),
        layers.Dropout(0.5),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(1, activation='sigmoid')
    ])
    
    return model

def train():
    """Training pipeline"""
    print("1. Loading data...")
    normal_images, normal_labels = load_images('data/normal', 0)
    cheat_images, cheat_labels = load_images('data/cheat', 1)
    
    # Combine
    X = np.concatenate([normal_images, cheat_images])
    y = np.concatenate([normal_labels, cheat_labels])
    
    print(f"Total images: {len(X)}")
    print(f"Normal: {len(normal_images)}, Cheat: {len(cheat_images)}")
    
    # Split train/val
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print("\n2. Creating model...")
    model = create_model()
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    model.summary()
    
    print("\n3. Training...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=30,
        batch_size=32,
        callbacks=[
            keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
            keras.callbacks.ModelCheckpoint('best_model.h5', save_best_only=True)
        ]
    )
    
    print("\n4. Evaluating...")
    results = model.evaluate(X_val, y_val)
    print(f"Validation Loss: {results[0]:.4f}")
    print(f"Validation Accuracy: {results[1]:.4f}")
    
    print("\n5. Saving model...")
    model.save('anticheat_model.h5')
    print("✅ Training hoàn tất! Model đã lưu tại: anticheat_model.h5")

if __name__ == '__main__':
    train()
```

**Chạy training:**
```bash
python train_model.py

# Đợi 10-30 phút (tùy CPU/GPU)
# Kết quả: file anticheat_model.h5
```

#### Bước 4: Convert sang TensorFlow.js

```bash
# Cài converter
pip install tensorflowjs

# Convert
tensorflowjs_converter \
    --input_format=keras \
    anticheat_model.h5 \
    ./tfjs_model

# Kết quả: folder tfjs_model/ chứa model.json và .bin files
```

#### Bước 5: Đưa Model vào App

```bash
# 1. Copy model vào project
cp -r tfjs_model /home/runner/work/Intelligence-Test/Intelligence-Test/public/models/anticheat-custom

# 2. Update code để load model mới
# Sửa file: src/services/antiCheatService.ts
```

Trong `antiCheatService.ts`:
```typescript
// Thêm vào class
async loadCustomModel() {
  this.model = await tf.loadLayersModel('/models/anticheat-custom/model.json');
  console.log('Custom model loaded!');
}
```

✅ **XONG! Model custom của bạn đã hoạt động!**

### 4.2. Calibrate CAT Algorithm (Nâng Cao)

#### Khi nào cần?
- Đã có 100+ học sinh làm bài
- Muốn độ khó câu hỏi chính xác hơn

#### Folder làm việc
```bash
cd Intelligence-Test
mkdir -p training/cat
cd training/cat
```

#### File `train_cat.py`:

```python
import pandas as pd
import numpy as np
from scipy.optimize import minimize

def calibrate_difficulty(responses_csv):
    """
    Calibrate độ khó câu hỏi từ dữ liệu thực
    
    Input CSV format:
    student_id,question_id,correct
    S001,Q001,1
    S001,Q002,0
    ...
    """
    print("Loading data...")
    df = pd.read_csv(responses_csv)
    
    # Map IDs
    students = df['student_id'].unique()
    questions = df['question_id'].unique()
    
    student_map = {s: i for i, s in enumerate(students)}
    question_map = {q: i for i, q in enumerate(questions)}
    
    df['student_idx'] = df['student_id'].map(student_map)
    df['question_idx'] = df['question_id'].map(question_map)
    
    # Calculate simple difficulty
    question_stats = df.groupby('question_id').agg({
        'correct': ['mean', 'count']
    }).reset_index()
    question_stats.columns = ['question_id', 'correct_rate', 'count']
    
    # Difficulty = 1 - correct_rate (higher = harder)
    question_stats['difficulty'] = 1 - question_stats['correct_rate']
    
    # Save
    question_stats.to_csv('calibrated_difficulties.csv', index=False)
    print(f"\n✅ Đã calibrate {len(questions)} câu hỏi")
    print("\nMẫu kết quả:")
    print(question_stats.head(10))
    
    return question_stats

if __name__ == '__main__':
    # Cần file responses.csv với format như trên
    results = calibrate_difficulty('responses.csv')
```

#### Cách lấy dữ liệu responses.csv:

1. Vào app → Analytics → Export data
2. Hoặc từ Firebase console → Export Firestore data
3. Format thành CSV với 3 cột: student_id, question_id, correct

#### Chạy:
```bash
python train_cat.py

# Output: calibrated_difficulties.csv
```

#### Update vào hệ thống:

1. Mở `calibrated_difficulties.csv`
2. Copy độ khó mới
3. Vào app → Question Bank → Update từng câu hỏi
4. Hoặc viết script import tự động

---

## 📁 Phần 5: Tổng Kết - Folder Làm Việc

### Cấu trúc thư mục khi làm việc:

```
Intelligence-Test/              ← Folder chính
├── src/                        ← Code app
├── public/                     ← Static files
│   └── models/                 ← Đặt custom models ở đây
│       └── anticheat-custom/   ← Model anti-cheat tự train
├── .env                        ← Cấu hình (API keys)
├── package.json                ← Dependencies
└── training/                   ← (Tự tạo) Folder training
    ├── anticheat/              ← Training anti-cheat
    │   ├── collect_data.py
    │   ├── train_model.py
    │   └── data/
    │       ├── normal/         ← Ảnh bình thường
    │       └── cheat/          ← Ảnh gian lận
    └── cat/                    ← Training CAT
        ├── train_cat.py
        ├── responses.csv       ← Dữ liệu đầu vào
        └── calibrated_difficulties.csv  ← Kết quả
```

### Lệnh chạy từng phần:

```bash
# 1. Chạy app
cd Intelligence-Test
npm run dev

# 2. Training anti-cheat (nếu cần)
cd Intelligence-Test/training/anticheat
python train_model.py

# 3. Training CAT (nếu cần)
cd Intelligence-Test/training/cat
python train_cat.py
```

---

## ❓ FAQ - Câu Hỏi Thường Gặp

### Q1: Tôi có cần train model không?
**A:** **KHÔNG** cho đa số trường hợp. Hệ thống đã có sẵn AI, chỉ cần:
- Thêm API key (Gemini miễn phí)
- Hoặc cài Ollama (local, miễn phí)

### Q2: Dataset lấy ở đâu?
**A:** 
- **AI sinh câu hỏi**: Không cần dataset, chỉ cần API
- **Anti-cheat**: Tự thu thập bằng webcam (xem Phần 4.1)
- **CAT calibration**: Export từ app sau khi có học sinh làm bài

### Q3: Train ở đâu? Máy tôi hay cloud?
**A:**
- **Không cần train**: Chỉ chạy app trên máy (`npm run dev`)
- **Nếu train anti-cheat**: Chạy Python scripts trên máy trong folder `training/`
- **Không cần cloud** trừ khi muốn

### Q4: Sau khi train, dùng như thế nào?
**A:** 
- Model train xong → Convert sang .js → Copy vào `public/models/`
- App tự động load model từ folder đó
- Không cần làm gì thêm

### Q5: Giao diện web khó hiểu, làm sao?
**A:** 
- Đọc UserGuide trong app (menu → User Guide)
- Xem video hướng dẫn (nếu có)
- Bắt đầu từ tài khoản demo để làm quen

### Q6: Tôi không biết code, có dùng được không?
**A:** **CÓ!** 
- Dùng phần cơ bản: Chỉ cần biết chạy `npm install` và `npm run dev`
- Tạo đề thi thủ công, không cần AI
- Training chỉ dành cho người biết Python/ML

### Q7: Chi phí chạy hệ thống?
**A:**
- **Miễn phí hoàn toàn**: Dev mode + Gemini API
- **Firebase**: Free tier đủ cho trường nhỏ
- **OpenAI**: Tùy chọn, ~$5-10/tháng

### Q8: Tôi muốn học thêm về AI/ML?
**A:** Khóa học gợi ý:
- Coursera: Machine Learning (Andrew Ng)
- Fast.ai: Practical Deep Learning
- YouTube: Sentdex, 3Blue1Brown

---

## 🆘 Troubleshooting

### Lỗi: "npm: command not found"
```bash
# Cài Node.js từ: https://nodejs.org
# Chọn LTS version
```

### Lỗi: "vite: command not found"
```bash
cd Intelligence-Test
npm install
```

### Lỗi: API không hoạt động
```bash
# Kiểm tra .env file
# Đảm bảo API key đúng format
# Restart app sau khi sửa .env
```

### Lỗi: Python module not found
```bash
pip install tensorflow opencv-python numpy
# Hoặc dùng pip3 trên Mac/Linux
```

### App chạy nhưng không có dữ liệu
```bash
# Kiểm tra VITE_DEV_MODE=true trong .env
# Hoặc setup Firebase (xem FIREBASE_SETUP.md)
```

---

## 📞 Liên Hệ Hỗ Trợ

- **GitHub Issues**: https://github.com/imnothoan/Intelligence-Test/issues
- **Email**: Xem trong GitHub profile
- **Documentation**: `/docs/vi/` folder

---

## ✅ Checklist - Bạn Đã Làm Được:

### Cơ Bản (Không cần training):
- [ ] Clone và cài đặt app
- [ ] Chạy được `npm run dev`
- [ ] Đăng nhập được với tài khoản demo
- [ ] Tạo được câu hỏi thủ công
- [ ] Tạo được đề thi
- [ ] Học sinh làm bài được

### Nâng Cao (Có AI, không training):
- [ ] Lấy được Gemini API key
- [ ] Thêm API key vào .env
- [ ] Sinh được câu hỏi tự động
- [ ] AI chấm được bài tự luận

### Expert (Training custom):
- [ ] Thu thập được training data
- [ ] Train được custom model
- [ ] Convert sang TensorFlow.js
- [ ] Tích hợp vào app
- [ ] Model hoạt động đúng

---

**🎉 Chúc bạn thành công với Intelligence Test Platform!**

Nếu tài liệu này hữu ích, hãy ⭐ star project trên GitHub!

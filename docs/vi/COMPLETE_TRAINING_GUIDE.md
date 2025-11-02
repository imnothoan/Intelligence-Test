# Hướng Dẫn Chi Tiết về Training Models & Dataset 🎓

## MỤC LỤC

1. [Tổng Quan - BẠN CÓ CẦN TRAIN KHÔNG?](#1-tổng-quan)
2. [CAT Algorithm - Calibration](#2-cat-algorithm)
3. [Anti-Cheat Model - Computer Vision](#3-anti-cheat-model)
4. [Essay Grading - LLM Integration](#4-essay-grading)
5. [Dataset - Lấy Ở Đâu?](#5-dataset)
6. [Google Colab Training](#6-google-colab)
7. [Fine-tuning LLMs](#7-fine-tuning-llms)

---

## 1. TỔNG QUAN

### ❌ BẠN KHÔNG CẦN TRAIN!

**99% trường hợp, bạn KHÔNG cần train bất kỳ model nào!**

Hệ thống đã tích hợp sẵn:
- ✅ **CAT Algorithm**: Hoạt động với manual calibration
- ✅ **Anti-Cheat**: Dùng BlazeFace (Google) - đã train sẵn
- ✅ **Essay Grading**: Dùng Gemini/OpenAI - không cần train
- ✅ **Question Generation**: Dùng Gemini/OpenAI - không cần train

### ✅ KHI NÀO CẦN TRAIN?

**Chỉ train khi:**
1. **CAT Calibration**: Sau khi có 100+ học sinh làm bài → Cải thiện độ chính xác
2. **Custom Anti-Cheat**: Phát hiện gian lận đặc thù của trường bạn
3. **Fine-tune LLM**: Domain-specific (môn học rất chuyên sâu)

### Quy Trình Làm Việc

```
BẮT ĐẦU
  ↓
[1] Cài đặt hệ thống (npm install)
  ↓
[2] Thêm Gemini API key (MIỄN PHÍ)
  ↓
[3] Sử dụng ngay! ✅
  ↓
(Optional) Sau 1-2 tháng
  ↓
[4] Calibrate CAT với dữ liệu thực
  ↓
[5] Train custom anti-cheat (nếu cần)
```

---

## 2. CAT ALGORITHM

### 2.1. Lý Thuyết

CAT (Computerized Adaptive Testing) cần **question difficulty** để hoạt động.

**Difficulty Scale**: 0.0 (dễ nhất) → 1.0 (khó nhất)

### 2.2. Manual Calibration (KHUYẾN NGHỊ)

**Cách 1: Gán Thủ Công**

Khi tạo câu hỏi, gán difficulty dựa trên đánh giá:

```
EASY (0.0 - 0.3):
- Kiến thức cơ bản
- Nhớ và hiểu
- Ví dụ: "2 + 2 = ?"

MEDIUM (0.3 - 0.7):
- Áp dụng kiến thức
- Phân tích
- Ví dụ: "Giải phương trình bậc 2"

HARD (0.7 - 1.0):
- Tổng hợp, đánh giá
- Tư duy phản biện
- Ví dụ: "Chứng minh định lý..."
```

### 2.3. Data-Based Calibration (Nâng Cao)

**Khi nào**: Sau khi có ≥100 học sinh làm bài

**Bước 1: Xuất Dữ Liệu**

```javascript
// Trong Analytics Dashboard
1. Chọn exam
2. Click "Export Data"
3. Download file CSV
```

**Bước 2: Chạy Script Calibration**

```bash
cd docs/examples/training-scripts

# Install dependencies
pip install numpy pandas scipy

# Run calibration
python calibrate_cat.py ../../data/exam_responses.csv
```

**Script `calibrate_cat.py`**:

```python
import pandas as pd
import numpy as np
from scipy.optimize import minimize

def calculate_difficulty(responses_df):
    """
    Calculate difficulty for each question
    Formula: difficulty = 1 - (correct_count / total_count)
    """
    questions = responses_df.groupby('question_id').agg({
        'correct': ['sum', 'count']
    })
    
    questions['difficulty'] = 1 - (
        questions['correct']['sum'] / questions['correct']['count']
    )
    
    return questions['difficulty'].to_dict()

# Load data
df = pd.read_csv('exam_responses.csv')

# Calculate
difficulties = calculate_difficulty(df)

# Save results
import json
with open('difficulties.json', 'w') as f:
    json.dump(difficulties, f, indent=2)

print("Calibration complete! See difficulties.json")
```

**Bước 3: Import Vào Question Bank**

```javascript
// Trong Question Bank UI
1. Click "Import Difficulties"
2. Upload difficulties.json
3. Hệ thống tự động cập nhật
```

### 2.4. IRT-Based Calibration (Chuyên Gia)

**Yêu cầu**: Python + R, 500+ responses

```python
# Install py-irt
pip install py-irt

# Script: train_cat_model.py
from py_irt import irt

# Load data
data = pd.read_csv('responses.csv')

# Train IRT model (1PL - Rasch Model)
model = irt(data, model='1pl')
difficulties = model.params['difficulty']

# Export
difficulties.to_json('irt_difficulties.json')
```

**Với R (nâng cao hơn)**:

```r
# Install mirt package
install.packages("mirt")
library(mirt)

# Load data
data <- read.csv("responses.csv")

# Train model
model <- mirt(data, 1, itemtype = "Rasch")

# Extract parameters
params <- coef(model, simplify = TRUE)
difficulties <- params$items[, "d"]

# Save
write.json(difficulties, "difficulties.json")
```

---

## 3. ANTI-CHEAT MODEL

### 3.1. Sử Dụng BlazeFace (KHUYẾN NGHỊ)

**Không cần training!** BlazeFace đã được Google train với 1M+ ảnh.

**Tính năng có sẵn**:
- ✅ Phát hiện khuôn mặt
- ✅ Theo dõi chuyển động
- ✅ Phát hiện nhiều người
- ✅ Cảnh báo khi không nhìn màn hình

### 3.2. Training Custom Model

**Khi nào cần**: 
- Phát hiện hành vi đặc thù (sử dụng tài liệu, điện thoại, ...)
- Môi trường đặc biệt (góc máy, ánh sáng khác thường)

**Bước 1: Thu Thập Dữ Liệu**

Cần 2 loại ảnh:

```
data/
├── normal_behavior/       # 500-1000 ảnh
│   ├── student_1.jpg      # Nhìn màn hình
│   ├── student_2.jpg      # Tập trung làm bài
│   └── ...
└── suspicious_behavior/   # 500-1000 ảnh
    ├── cheat_1.jpg        # Nhìn xuống (tài liệu)
    ├── cheat_2.jpg        # Nhìn sang (bạn bè)
    └── ...
```

**Cách thu thập**:
```python
# Script: collect_data.py
import cv2

cam = cv2.VideoCapture(0)
counter = 0

print("Press SPACE to capture, Q to quit")
while True:
    ret, frame = cam.read()
    cv2.imshow('Capture', frame)
    
    key = cv2.waitKey(1)
    if key == ord(' '):
        cv2.imwrite(f'normal_{counter}.jpg', frame)
        counter += 1
    elif key == ord('q'):
        break

cam.release()
cv2.destroyAllWindows()
```

**Bước 2: Label Dữ Liệu**

Sắp xếp ảnh vào 2 folders: `normal/` và `suspicious/`

**Bước 3: Train Model**

```python
# Script: train_anticheat_model.py
import tensorflow as tf
from tensorflow import keras
import os

# Load data
def load_images(normal_dir, suspicious_dir, img_size=128):
    images = []
    labels = []
    
    # Normal behavior = 0
    for img in os.listdir(normal_dir):
        img_path = os.path.join(normal_dir, img)
        img = keras.preprocessing.image.load_img(
            img_path, target_size=(img_size, img_size)
        )
        img_array = keras.preprocessing.image.img_to_array(img) / 255.0
        images.append(img_array)
        labels.append(0)
    
    # Suspicious behavior = 1
    for img in os.listdir(suspicious_dir):
        img_path = os.path.join(suspicious_dir, img)
        img = keras.preprocessing.image.load_img(
            img_path, target_size=(img_size, img_size)
        )
        img_array = keras.preprocessing.image.img_to_array(img) / 255.0
        images.append(img_array)
        labels.append(1)
    
    return np.array(images), np.array(labels)

# Load
X, y = load_images('data/normal_behavior', 'data/suspicious_behavior')

# Split train/test
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create model
model = keras.Sequential([
    keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
    keras.layers.MaxPooling2D((2, 2)),
    keras.layers.Conv2D(64, (3, 3), activation='relu'),
    keras.layers.MaxPooling2D((2, 2)),
    keras.layers.Conv2D(64, (3, 3), activation='relu'),
    keras.layers.Flatten(),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dropout(0.5),
    keras.layers.Dense(1, activation='sigmoid')
])

# Compile
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Train
history = model.fit(
    X_train, y_train,
    epochs=20,
    batch_size=32,
    validation_data=(X_test, y_test)
)

# Evaluate
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f'Test accuracy: {test_acc:.2f}')

# Save
model.save('anticheat_model.h5')
```

**Bước 4: Convert to TensorFlow.js**

```bash
# Install converter
pip install tensorflowjs

# Convert
tensorflowjs_converter \
  --input_format keras \
  anticheat_model.h5 \
  ./public/models/anticheat
```

**Bước 5: Sử Dụng Trong App**

Model tự động được load từ `public/models/anticheat/`

---

## 4. ESSAY GRADING

### 4.1. Sử Dụng Gemini (KHUYẾN NGHỊ)

**Không cần training!** Chỉ cần API key.

```javascript
// Đã tích hợp sẵn!
import { geminiService } from '@/services/geminiService';

const result = await geminiService.gradeEssay(
  question,
  studentAnswer,
  rubric,
  maxScore
);
```

### 4.2. Prompt Engineering (Tối Ưu)

**Cải thiện kết quả KHÔNG CẦN training**:

```javascript
// File: src/services/geminiService.ts
// Tìm method buildEssayGradingPrompt

private buildEssayGradingPrompt(...) {
  return `Bạn là giáo viên ${subject} có 20 năm kinh nghiệm.

Câu hỏi: ${question}

Bài làm: ${studentAnswer}

Tiêu chí chấm (${maxScore} điểm):
1. Nội dung (40%): ${contentCriteria}
2. Cấu trúc (30%): ${structureCriteria}
3. Ngôn ngữ (20%): ${languageCriteria}
4. Sáng tạo (10%): ${creativityCriteria}

YÊU CẦU:
- Chấm điểm chính xác theo tiêu chí
- Nhận xét cụ thể với ví dụ
- Đưa ra 3 điểm mạnh và 3 điểm cần cải thiện
- Gợi ý cách học tốt hơn

Trả về JSON...`;
}
```

### 4.3. Fine-tuning (Chuyên Gia)

**Khi nào cần**:
- Môn học rất đặc thù
- Chuẩn chấm điểm riêng
- Có ≥1000 bài đã chấm

**Dataset cần**:
```json
[
  {
    "question": "Phân tích hình tượng...",
    "answer": "Bài làm của học sinh...",
    "score": 85,
    "feedback": "Bài làm tốt..."
  },
  // ... 1000+ samples
]
```

**Fine-tuning với OpenAI**:

```bash
# Prepare data
python prepare_finetuning_data.py

# Upload to OpenAI
openai api fine_tunes.create \
  -t essay_grading_train.jsonl \
  -v essay_grading_val.jsonl \
  -m gpt-3.5-turbo \
  --suffix "essay-grader"

# Wait for completion (~1-2 hours)
# Cost: ~$20-50 for 1000 examples
```

**Fine-tuning với Gemini** (hiện chưa hỗ trợ):
- Google chưa mở fine-tuning cho Gemini
- Dùng prompt engineering thay thế

---

## 5. DATASET

### 5.1. Nguồn Dataset Miễn Phí

#### Tiếng Việt

**VLSP (Vietnamese Language and Speech Processing)**
- URL: http://vlsp.org.vn/resources
- Nội dung: Text, QA, NER
- Format: JSON, CSV
- Download: Đăng ký miễn phí

**UIT-ViQuAD (Vietnamese Question Answering)**
- URL: https://github.com/uitnlp/ViQuAD
- Nội dung: 23K câu hỏi tiếng Việt
- Format: JSON
- License: MIT

**Vietnamese Wikipedia**
- URL: https://dumps.wikimedia.org/viwiki/
- Nội dung: Kiến thức tổng quát
- Format: XML
- Download: wget

#### Tiếng Anh

**SQuAD (Stanford Question Answering)**
- URL: https://rajpurkar.github.io/SQuAD-explorer/
- Nội dung: 100K+ câu hỏi
- Format: JSON

**RACE (Reading Comprehension)**
- URL: http://www.cs.cmu.edu/~glai1/data/race/
- Nội dung: 28K passages + câu hỏi
- Format: TXT, JSON

**ARC (AI2 Reasoning Challenge)**
- URL: https://allenai.org/data/arc
- Nội dung: Câu hỏi khoa học
- Format: JSONL

### 5.2. Tạo Dataset Riêng

**Script: generate_dataset.py**

```python
import json
from google.generativeai import GenerativeModel

# Initialize Gemini
model = GenerativeModel('gemini-pro')

topics = [
    'Toán học lớp 10',
    'Vật lý lớp 11',
    'Hóa học lớp 12',
    # ... thêm topics
]

dataset = []

for topic in topics:
    prompt = f"Tạo 10 câu hỏi trắc nghiệm về {topic}"
    response = model.generate_content(prompt)
    
    # Parse và lưu
    questions = parse_questions(response.text)
    dataset.extend(questions)

# Save
with open('custom_dataset.json', 'w', encoding='utf-8') as f:
    json.dump(dataset, f, ensure_ascii=False, indent=2)
```

### 5.3. Augment Data (Tăng Cường Dữ Liệu)

```python
# Script: augment_data.py
import random

def paraphrase_question(question):
    """Diễn đạt lại câu hỏi"""
    prompts = [
        f"Viết lại câu hỏi sau: {question}",
        f"Diễn đạt khác: {question}",
    ]
    # Use Gemini to paraphrase
    return gemini.generate(random.choice(prompts))

def generate_similar(question):
    """Tạo câu hỏi tương tự"""
    prompt = f"Tạo câu hỏi tương tự: {question}"
    return gemini.generate(prompt)

# Augment dataset
original = load_dataset('original.json')
augmented = []

for q in original:
    augmented.append(q)  # Original
    augmented.append(paraphrase_question(q))  # Paraphrase
    augmented.append(generate_similar(q))  # Similar

save_dataset(augmented, 'augmented.json')
```

---

## 6. GOOGLE COLAB TRAINING

### 6.1. Setup Colab

**Bước 1: Tạo Notebook Mới**

1. Truy cập: https://colab.research.google.com
2. Click "New Notebook"
3. Chọn Runtime → Change runtime type → GPU (T4)

**Bước 2: Upload Dataset**

```python
# Cell 1: Upload files
from google.colab import files
uploaded = files.upload()

# Cell 2: Unzip if needed
!unzip dataset.zip
```

### 6.2. Train CAT Model

```python
# Cell: Install dependencies
!pip install py-irt pandas numpy

# Cell: Load và train
import pandas as pd
from py_irt import irt

# Load data
data = pd.read_csv('responses.csv')

# Train
model = irt(data, model='1pl')
difficulties = model.params['difficulty']

# Save
difficulties.to_json('difficulties.json')

# Download result
from google.colab import files
files.download('difficulties.json')
```

### 6.3. Train Anti-Cheat Model

```python
# Cell: Install
!pip install tensorflow opencv-python

# Cell: Upload images
from google.colab import drive
drive.mount('/content/drive')

# Cell: Train (same code as above)
# ... training code ...

# Cell: Convert to TensorFlow.js
!pip install tensorflowjs
!tensorflowjs_converter \
  --input_format keras \
  model.h5 \
  ./tfjs_model

# Cell: Download
!zip -r model.zip ./tfjs_model
files.download('model.zip')
```

### 6.4. Fine-tune LLM (Advanced)

```python
# Cell: Install
!pip install transformers datasets accelerate

# Cell: Load model
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "vinai/phobert-base"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Cell: Prepare data
from datasets import load_dataset
dataset = load_dataset('json', data_files='train.json')

# Cell: Fine-tune
from transformers import Trainer, TrainingArguments

training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=4,
    save_steps=1000,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset['train'],
)

trainer.train()

# Cell: Save
model.save_pretrained('./finetuned_model')
tokenizer.save_pretrained('./finetuned_model')
```

---

## 7. FINE-TUNING LLMs

### 7.1. Khi Nào Cần Fine-tune?

❌ **KHÔNG CẦN** trong hầu hết trường hợp!

Prompt engineering (đã làm) = 80% hiệu quả của fine-tuning!

✅ **CẦN** khi:
- Domain rất đặc thù (y học, luật, ...)
- Có ≥10,000 examples chất lượng cao
- Có ngân sách ($100-1000)

### 7.2. So Sánh Phương Pháp

| Phương Pháp | Chi Phí | Thời Gian | Độ Khó | Kết Quả |
|-------------|---------|-----------|--------|---------|
| **Prompt Engineering** | $0 | 1 giờ | Dễ | ⭐⭐⭐⭐ |
| **Few-shot Learning** | $0 | 2 giờ | Trung bình | ⭐⭐⭐⭐ |
| **Fine-tuning OpenAI** | $20-100 | 1-2 ngày | Trung bình | ⭐⭐⭐⭐⭐ |
| **Fine-tuning Open Source** | $0 (GPU) | 3-7 ngày | Khó | ⭐⭐⭐⭐⭐ |

### 7.3. Fine-tuning với OpenAI

**Bước 1: Chuẩn Bị Data**

```json
// Format: JSONL
{"messages": [
  {"role": "system", "content": "Bạn là giáo viên toán"},
  {"role": "user", "content": "Tạo câu hỏi về đạo hàm"},
  {"role": "assistant", "content": "Câu 1: Tính đạo hàm..."}
]}
{"messages": [...]}
```

**Bước 2: Upload và Train**

```bash
# Upload file
openai api files.create \
  -f training_data.jsonl \
  -p fine-tune

# Start fine-tune
openai api fine_tunes.create \
  -t file-xxx \
  -m gpt-3.5-turbo \
  --suffix "math-teacher"

# Monitor
openai api fine_tunes.follow -i ft-xxx

# Cost: ~$0.008/1K tokens = $8 cho 1M tokens
```

**Bước 3: Sử Dụng**

```javascript
// Update apiEndpoint trong aiQuestionGenerator.ts
const model = 'ft:gpt-3.5-turbo:your-fine-tuned-model';
```

### 7.4. Fine-tuning Open Source (Colab)

```python
# Colab: Fine-tune Gemma 2B
!pip install transformers peft accelerate bitsandbytes

from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, get_peft_model

# Load model
model = AutoModelForCausalLM.from_pretrained(
    "google/gemma-2b",
    load_in_4bit=True  # QLoRA - tiết kiệm RAM
)

# Configure LoRA
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
)

model = get_peft_model(model, lora_config)

# Train (same as above)
# ...

# Merge LoRA weights
model = model.merge_and_unload()
model.save_pretrained('./finetuned_gemma')
```

---

## TÓM TẮT & KHUYẾN NGHỊ

### ✅ KHUYẾN NGHỊ CHO MỌI NGƯỜI

1. **Bắt đầu**: Dùng Gemini (miễn phí) → [GEMINI_SETUP.md](./GEMINI_SETUP.md)
2. **CAT**: Manual calibration → Đủ tốt!
3. **Anti-Cheat**: Dùng BlazeFace → Hoàn hảo!
4. **Essay Grading**: Gemini + prompt engineering → Xuất sắc!

### ⚠️ CHỈ TRAIN KHI CẦN

- CAT: Sau 3-6 tháng, có 100+ học sinh
- Anti-Cheat: Môi trường đặc biệt
- LLM: Domain cực kỳ đặc thù + có ngân sách

### 📚 TÀI NGUYÊN HỌC TẬP

**Video Tutorials**:
- TensorFlow.js: https://youtube.com/@TensorFlow
- Colab Training: https://youtube.com/colab-training
- Fine-tuning: https://youtube.com/huggingface

**Courses**:
- Coursera: Machine Learning (Andrew Ng)
- Fast.ai: Practical Deep Learning
- Hugging Face: NLP Course

**Communities**:
- r/MachineLearning
- Hugging Face Forums
- TensorFlow Community

---

**Câu hỏi? Mở issue trên GitHub!**

Next: [GEMINI_SETUP.md](./GEMINI_SETUP.md) - Hướng dẫn sử dụng Gemini miễn phí

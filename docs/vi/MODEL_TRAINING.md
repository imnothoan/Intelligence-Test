# Hướng Dẫn Training và Sử Dụng AI Models

## Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Model CAT Algorithm](#model-cat-algorithm)
3. [Model Sinh Câu Hỏi (Question Generation)](#model-sinh-câu-hỏi)
4. [Model Anti-Cheat](#model-anti-cheat)
5. [Tích Hợp LLM APIs](#tích-hợp-llm-apis)

---

## Tổng Quan

Hệ thống Intelligence Test sử dụng nhiều loại AI models:

| Model | Công dụng | Công nghệ | Training cần thiết |
|-------|-----------|-----------|-------------------|
| CAT Algorithm | Adaptive testing | IRT (Item Response Theory) | Có - calibrate câu hỏi |
| Question Generation | Tạo câu hỏi tự động | LLM API (GPT, Gemini) | Không - dùng API |
| Essay Grading | Chấm bài tự luận | LLM API | Không - dùng API |
| Anti-Cheat | Phát hiện gian lận | Computer Vision | Có - train custom model |

---

## Model CAT Algorithm

### Giới Thiệu

CAT (Computerized Adaptive Testing) sử dụng **Item Response Theory (IRT)** để điều chỉnh độ khó câu hỏi dựa trên khả năng của học sinh.

### Cách Hoạt Động

**1PL IRT Model (Rasch Model):**
```
P(correct) = 1 / (1 + exp(-(ability - difficulty)))
```

- `ability`: Khả năng của học sinh (θ)
- `difficulty`: Độ khó của câu hỏi (b)

### Không Cần Training Model (Built-in)

Hệ thống đã có sẵn CAT algorithm, KHÔNG cần train model riêng. Chỉ cần:

**Bước 1: Gán độ khó cho câu hỏi**
- 0.0 - 0.3: Dễ
- 0.3 - 0.7: Trung bình
- 0.7 - 1.0: Khó

**Bước 2: Hệ thống tự động**
- Chọn câu hỏi phù hợp
- Ước tính ability
- Điều chỉnh độ khó

### Calibration Nâng Cao (Optional)

Nếu muốn calibrate độ khó CHÍNH XÁC hơn dựa trên dữ liệu thực tế:

#### Yêu Cầu
- Python 3.8+
- Ít nhất 100-200 responses mỗi câu hỏi
- Dữ liệu lịch sử thi

#### Bước 1: Chuẩn bị dữ liệu

Tạo file `responses.csv`:
```csv
student_id,question_id,correct,time_taken
S001,Q001,1,45
S001,Q002,0,60
S002,Q001,1,50
S002,Q002,1,55
...
```

#### Bước 2: Cài đặt Python packages

```bash
pip install numpy scipy pandas scikit-learn
```

#### Bước 3: Tạo script training

Tạo file `train_cat_model.py`:

```python
import pandas as pd
import numpy as np
from scipy.optimize import minimize

def rasch_probability(ability, difficulty):
    """Tính xác suất trả lời đúng theo Rasch model"""
    return 1 / (1 + np.exp(-(ability - difficulty)))

def log_likelihood(params, responses):
    """Hàm log-likelihood để tối ưu"""
    n_students = len(set(responses['student_id']))
    n_questions = len(set(responses['question_id']))
    
    abilities = params[:n_students]
    difficulties = params[n_students:]
    
    ll = 0
    for _, row in responses.iterrows():
        student_idx = row['student_idx']
        question_idx = row['question_idx']
        correct = row['correct']
        
        prob = rasch_probability(abilities[student_idx], difficulties[question_idx])
        ll += correct * np.log(prob) + (1 - correct) * np.log(1 - prob)
    
    return -ll  # Negative for minimization

def calibrate_questions(csv_file):
    """Calibrate độ khó câu hỏi từ dữ liệu"""
    # Đọc dữ liệu
    df = pd.read_csv(csv_file)
    
    # Map IDs sang indices
    students = df['student_id'].unique()
    questions = df['question_id'].unique()
    
    student_map = {s: i for i, s in enumerate(students)}
    question_map = {q: i for i, q in enumerate(questions)}
    
    df['student_idx'] = df['student_id'].map(student_map)
    df['question_idx'] = df['question_id'].map(question_map)
    
    # Initial parameters (random)
    n_students = len(students)
    n_questions = len(questions)
    initial_params = np.random.randn(n_students + n_questions) * 0.1
    
    # Optimize
    print("Training IRT model...")
    result = minimize(
        log_likelihood,
        initial_params,
        args=(df,),
        method='BFGS',
        options={'maxiter': 1000, 'disp': True}
    )
    
    # Extract parameters
    abilities = result.x[:n_students]
    difficulties = result.x[n_students:]
    
    # Normalize difficulties to 0-1 range
    min_diff = difficulties.min()
    max_diff = difficulties.max()
    normalized_difficulties = (difficulties - min_diff) / (max_diff - min_diff)
    
    # Save results
    results = pd.DataFrame({
        'question_id': questions,
        'difficulty': normalized_difficulties,
        'raw_difficulty': difficulties
    })
    
    results.to_csv('calibrated_difficulties.csv', index=False)
    print(f"\nCalibration complete!")
    print(f"Results saved to: calibrated_difficulties.csv")
    
    return results

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("Usage: python train_cat_model.py <responses.csv>")
        sys.exit(1)
    
    results = calibrate_questions(sys.argv[1])
    print("\nSample results:")
    print(results.head(10))
```

#### Bước 4: Chạy training

```bash
python train_cat_model.py responses.csv
```

Output: `calibrated_difficulties.csv` với độ khó đã được calibrate.

#### Bước 5: Import vào hệ thống

1. Vào **Question Bank** trong ứng dụng
2. Import/update các câu hỏi với difficulty mới
3. Hoặc dùng API/script để bulk update

---

## Model Sinh Câu Hỏi

### Không Cần Training - Dùng LLM API

Hệ thống sử dụng các LLM có sẵn qua API. **KHÔNG cần train model riêng**.

### Option 1: OpenAI API (Trả phí, chất lượng cao)

#### Bước 1: Đăng ký API key
1. Truy cập: https://platform.openai.com/signup
2. Tạo tài khoản và verify email
3. Vào https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy key (bắt đầu với `sk-`)

#### Bước 2: Thêm vào .env
```env
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
```

#### Bước 3: Sử dụng trong app
- Vào **Question Bank** → **Generate Question**
- Nhập topic và yêu cầu
- Hệ thống tự động gọi OpenAI API

**Chi phí:**
- GPT-3.5 Turbo: $0.001/1K tokens (~500 câu hỏi/$1)
- GPT-4: $0.03/1K tokens (~17 câu hỏi/$1)

### Option 2: Google Gemini API (Miễn phí, giới hạn)

#### Bước 1: Lấy API key
1. Truy cập: https://makersuite.google.com/app/apikey
2. Click "Get API key"
3. Chọn hoặc tạo Google Cloud project
4. Copy API key

#### Bước 2: Cài đặt package
```bash
npm install @google/generative-ai
```

#### Bước 3: Tạo service wrapper

File `src/services/geminiService.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function generateQuestion(topic: string, difficulty: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Generate a ${difficulty} multiple-choice question about ${topic}.
Include:
1. Question text
2. Four answer options (A, B, C, D)
3. Correct answer
4. Brief explanation

Format as JSON.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return JSON.parse(text);
}
```

#### Bước 4: Update .env
```env
VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Giới hạn miễn phí:**
- 60 requests/phút
- 1,500 requests/ngày

### Option 3: Hugging Face (Miễn phí, open-source)

#### Bước 1: Lấy token
1. Truy cập: https://huggingface.co/settings/tokens
2. Create new token
3. Copy token

#### Bước 2: Cài đặt
```bash
npm install @huggingface/inference
```

#### Bước 3: Tạo service

File `src/services/huggingfaceService.ts`:

```typescript
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HF_TOKEN);

export async function generateQuestion(topic: string, difficulty: string) {
  const response = await hf.textGeneration({
    model: 'mistralai/Mistral-7B-Instruct-v0.1',
    inputs: `Generate a ${difficulty} multiple-choice question about ${topic}...`,
    parameters: {
      max_new_tokens: 500,
      temperature: 0.7,
    }
  });
  
  return parseQuestionFromText(response.generated_text);
}
```

### Option 4: Ollama (Local, hoàn toàn miễn phí)

#### Bước 1: Cài đặt Ollama
```bash
# MacOS/Linux
curl https://ollama.ai/install.sh | sh

# Windows: Download từ ollama.ai
```

#### Bước 2: Pull model
```bash
ollama pull llama2
# Hoặc: ollama pull mistral
```

#### Bước 3: Start server
```bash
ollama serve
```

#### Bước 4: Sử dụng trong app

```typescript
async function generateQuestion(topic: string, difficulty: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      prompt: `Generate a ${difficulty} question about ${topic}...`,
      stream: false
    })
  });
  
  const data = await response.json();
  return parseQuestionFromText(data.response);
}
```

**Ưu điểm:**
- Hoàn toàn miễn phí
- Không giới hạn requests
- Privacy (chạy local)

**Nhược điểm:**
- Cần máy mạnh (8GB+ RAM)
- Chất lượng thấp hơn GPT-4

---

## Model Anti-Cheat

### Overview

Model Anti-Cheat sử dụng Computer Vision để phát hiện:
- Không có người trước camera
- Nhiều người cùng lúc
- Nhìn sang chỗ khác
- Di chuyển bất thường

### Built-in Model (BlazeFace)

Hệ thống đã tích hợp sẵn **BlazeFace** từ TensorFlow.js:
- Detect faces
- Track head position
- Không cần training

### Training Custom Model (Nâng cao)

Nếu muốn model chính xác hơn cho trường hợp cụ thể:

#### Yêu Cầu
- Python 3.8+
- TensorFlow 2.x
- Webcam để thu thập dữ liệu
- GPU khuyến nghị (không bắt buộc)

#### Bước 1: Thu thập dữ liệu

Tạo script `collect_data.py`:

```python
import cv2
import os
from datetime import datetime

def collect_training_data(output_dir, label):
    """Thu thập ảnh training data"""
    os.makedirs(output_dir, exist_ok=True)
    
    cap = cv2.VideoCapture(0)
    count = 0
    
    print(f"Collecting {label} data...")
    print("Press SPACE to capture, Q to quit")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        cv2.imshow('Collect Data', frame)
        
        key = cv2.waitKey(1)
        if key == ord(' '):  # Space to capture
            filename = f"{label}_{count:04d}.jpg"
            filepath = os.path.join(output_dir, filename)
            cv2.imwrite(filepath, frame)
            print(f"Saved: {filename}")
            count += 1
            
        elif key == ord('q'):  # Q to quit
            break
    
    cap.release()
    cv2.destroyAllWindows()
    print(f"Collected {count} images")

if __name__ == '__main__':
    # Collect normal behavior
    print("\n=== NORMAL BEHAVIOR ===")
    print("Looking at screen, minimal movement")
    collect_training_data('data/normal', 'normal')
    
    # Collect cheating behavior
    print("\n=== CHEATING BEHAVIOR ===")
    print("Looking away, multiple people, etc.")
    collect_training_data('data/cheat', 'cheat')
```

**Chạy:**
```bash
python collect_data.py
```

Thu thập:
- 500-1000 ảnh "normal" (nhìn màn hình bình thường)
- 500-1000 ảnh "cheat" (nhìn đi chỗ khác, nhiều người, v.v.)

#### Bước 2: Chuẩn bị dataset

```python
# prepare_dataset.py
import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split

def load_images(directory, label):
    """Load và label images"""
    images = []
    labels = []
    
    for filename in os.listdir(directory):
        if filename.endswith('.jpg'):
            filepath = os.path.join(directory, filename)
            img = cv2.imread(filepath)
            img = cv2.resize(img, (224, 224))  # Resize to standard size
            img = img / 255.0  # Normalize
            
            images.append(img)
            labels.append(label)
    
    return np.array(images), np.array(labels)

def prepare_dataset():
    """Prepare training và validation sets"""
    # Load data
    normal_images, normal_labels = load_images('data/normal', 0)
    cheat_images, cheat_labels = load_images('data/cheat', 1)
    
    # Combine
    X = np.concatenate([normal_images, cheat_images])
    y = np.concatenate([normal_labels, cheat_labels])
    
    # Split
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Save
    np.save('data/X_train.npy', X_train)
    np.save('data/X_val.npy', X_val)
    np.save('data/y_train.npy', y_train)
    np.save('data/y_val.npy', y_val)
    
    print(f"Training set: {len(X_train)} images")
    print(f"Validation set: {len(X_val)} images")

if __name__ == '__main__':
    prepare_dataset()
```

#### Bước 3: Training model

```python
# train_anticheat.py
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

def create_model():
    """Create CNN model cho anti-cheat"""
    model = keras.Sequential([
        # Input layer
        layers.Input(shape=(224, 224, 3)),
        
        # Convolutional blocks
        layers.Conv2D(32, 3, activation='relu'),
        layers.MaxPooling2D(2),
        layers.BatchNormalization(),
        
        layers.Conv2D(64, 3, activation='relu'),
        layers.MaxPooling2D(2),
        layers.BatchNormalization(),
        
        layers.Conv2D(128, 3, activation='relu'),
        layers.MaxPooling2D(2),
        layers.BatchNormalization(),
        
        # Dense layers
        layers.Flatten(),
        layers.Dropout(0.5),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(1, activation='sigmoid')  # Binary classification
    ])
    
    return model

def train_model():
    """Train anti-cheat model"""
    # Load data
    X_train = np.load('data/X_train.npy')
    y_train = np.load('data/y_train.npy')
    X_val = np.load('data/X_val.npy')
    y_val = np.load('data/y_val.npy')
    
    # Create model
    model = create_model()
    
    # Compile
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy', 'precision', 'recall']
    )
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            patience=10,
            restore_best_weights=True
        ),
        keras.callbacks.ModelCheckpoint(
            'models/anticheat_best.h5',
            save_best_only=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            factor=0.5,
            patience=5
        )
    ]
    
    # Train
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=50,
        batch_size=32,
        callbacks=callbacks
    )
    
    # Save final model
    model.save('models/anticheat_final.h5')
    print("Training complete!")
    
    return model, history

if __name__ == '__main__':
    model, history = train_model()
    
    # Evaluate
    X_val = np.load('data/X_val.npy')
    y_val = np.load('data/y_val.npy')
    
    results = model.evaluate(X_val, y_val)
    print(f"\nValidation Results:")
    print(f"Loss: {results[0]:.4f}")
    print(f"Accuracy: {results[1]:.4f}")
    print(f"Precision: {results[2]:.4f}")
    print(f"Recall: {results[3]:.4f}")
```

**Chạy:**
```bash
pip install tensorflow opencv-python scikit-learn
python prepare_dataset.py
python train_anticheat.py
```

#### Bước 4: Convert sang TensorFlow.js

```bash
pip install tensorflowjs

tensorflowjs_converter \
  --input_format=keras \
  models/anticheat_final.h5 \
  public/models/anticheat
```

Sẽ tạo:
- `public/models/anticheat/model.json`
- `public/models/anticheat/group1-shard1of1.bin`

#### Bước 5: Tích hợp vào app

Update `src/services/antiCheatService.ts`:

```typescript
import * as tf from '@tensorflow/tfjs';

export class AntiCheatService {
  private model: tf.LayersModel | null = null;
  
  async loadCustomModel() {
    // Load your custom model
    this.model = await tf.loadLayersModel('/models/anticheat/model.json');
    console.log('Custom anti-cheat model loaded');
  }
  
  async detectCheating(imageData: ImageData): Promise<boolean> {
    if (!this.model) {
      await this.loadCustomModel();
    }
    
    // Preprocess image
    const tensor = tf.browser.fromPixels(imageData)
      .resizeBilinear([224, 224])
      .div(255.0)
      .expandDims(0);
    
    // Predict
    const prediction = await this.model!.predict(tensor) as tf.Tensor;
    const score = await prediction.data();
    
    // Clean up
    tensor.dispose();
    prediction.dispose();
    
    // score > 0.5 means cheating detected
    return score[0] > 0.5;
  }
}
```

---

## Tích Hợp LLM APIs

### So Sánh Các Options

| Provider | Miễn phí | Chất lượng | Tốc độ | Privacy |
|----------|----------|------------|---------|---------|
| OpenAI GPT-4 | ❌ ($) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| OpenAI GPT-3.5 | ❌ ($) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Google Gemini | ✅ (giới hạn) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Hugging Face | ✅ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Ollama (Local) | ✅ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |

### Khuyến Nghị

**Cho production (trả phí):**
- OpenAI GPT-3.5 Turbo: Tốt nhất về giá/chất lượng
- OpenAI GPT-4: Cho essay grading chất lượng cao

**Cho development/testing (miễn phí):**
- Google Gemini: Tốt nhất trong các option miễn phí
- Ollama: Nếu có máy mạnh và cần privacy

**Cho trường học nhỏ (budget thấp):**
- Gemini cho question generation
- BlazeFace (built-in) cho anti-cheat
- Manual grading cho essays

---

## Best Practices

### Question Generation
1. **Review trước khi dùng**: Luôn kiểm tra câu hỏi AI tạo
2. **Đa dạng prompts**: Thử nhiều cách hỏi khác nhau
3. **Set temperature thấp**: 0.3-0.5 cho consistent results
4. **Batch generation**: Tạo nhiều câu cùng lúc để chọn lọc

### CAT Algorithm
1. **Start với medium difficulty**: Câu đầu nên ở 0.5
2. **Minimum 10 questions**: Ít nhất 10 câu cho accurate assessment
3. **Balanced question bank**: Đủ câu hỏi ở mọi mức độ
4. **Regular calibration**: Update difficulties định kỳ

### Anti-Cheat
1. **Inform students**: Thông báo trước về monitoring
2. **Test trước**: Test system với một nhóm nhỏ
3. **Adjust sensitivity**: Điều chỉnh threshold phù hợp
4. **Manual review**: Review các warning cẩn thận

### Cost Optimization
1. **Cache results**: Cache câu hỏi đã generate
2. **Use cheaper models**: GPT-3.5 thay vì GPT-4 khi có thể
3. **Batch requests**: Gộp nhiều requests lại
4. **Local models**: Dùng Ollama cho non-critical tasks

---

## Troubleshooting

### LLM API không hoạt động
**Kiểm tra:**
- API key đúng chưa
- Còn credit không (OpenAI)
- Còn quota không (Gemini)
- Network connection

### Model anti-cheat không chính xác
**Giải pháp:**
- Thu thập thêm training data
- Augment data (flip, rotate, brightness)
- Train thêm epochs
- Điều chỉnh threshold

### CAT algorithm không adaptive
**Nguyên nhân:**
- Không đủ câu hỏi ở các mức độ
- Difficulty không được gán đúng
- Bug trong code

---

## Tài Liệu Tham Khảo

### APIs
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Gemini Docs](https://ai.google.dev/docs)
- [Hugging Face Inference](https://huggingface.co/docs/api-inference)
- [Ollama Docs](https://ollama.ai/docs)

### Machine Learning
- [TensorFlow.js Guide](https://www.tensorflow.org/js/guide)
- [IRT Theory](https://en.wikipedia.org/wiki/Item_response_theory)
- [Computer Vision with OpenCV](https://opencv.org/)

### Tutorials
- [Training Custom Models](https://www.tensorflow.org/tutorials)
- [Fine-tuning LLMs](https://huggingface.co/docs/transformers/training)
- [CAT Implementation](https://github.com/topics/computerized-adaptive-testing)

---

**Lưu ý**: Training models đòi hỏi kiến thức về machine learning. Nếu chưa có kinh nghiệm, khuyến nghị dùng các models và APIs có sẵn.

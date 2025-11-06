# Hướng Dẫn Training AI trên MacBook 12-inch 2017 🍎

## Mục Lục
1. [Có Cần Train Không?](#1-có-cần-train-không)
2. [Thông Số MacBook 12-inch 2017](#2-thông-số-macbook)
3. [Training trên MacBook vs Google Colab](#3-so-sánh)
4. [Setup Environment](#4-setup-environment)
5. [Dataset - Lấy Ở Đâu?](#5-dataset)
6. [Training CAT Model](#6-training-cat-model)
7. [Training Anti-Cheat Model](#7-training-anti-cheat)
8. [Fine-tuning Gemini (Nâng Cao)](#8-fine-tuning-gemini)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Có Cần Train Không?

### ❌ 99% KHÔNG CẦN TRAIN!

**Hệ thống đã hoàn chỉnh và sẵn sàng sử dụng!**

```
┌─────────────────────────────────────────────────┐
│  Bạn chỉ cần làm:                               │
│  1. npm install                                  │
│  2. Thêm VITE_GEMINI_API_KEY (miễn phí)        │
│  3. npm run dev                                  │
│  → XONG! Đã có thể dùng ngay! ✅                │
└─────────────────────────────────────────────────┘
```

**Các tính năng SẴN CÓ (không cần train):**
- ✅ **Tạo câu hỏi tự động**: Dùng Gemini API (miễn phí)
- ✅ **Chấm điểm tự luận**: Dùng Gemini API (miễn phí)
- ✅ **CAT Algorithm**: Hoạt động với manual difficulty
- ✅ **Anti-Cheat**: Dùng BlazeFace (Google) - pre-trained

### ✅ Khi Nào Cần Train?

**CHỈ TRAIN KHI:**

1. **CAT Calibration** (Sau 3-6 tháng)
   - Đã có ≥100 học sinh làm bài
   - Muốn tăng độ chính xác CAT algorithm
   - **Timeline**: 1-2 giờ training
   - **Yêu cầu**: Dữ liệu responses của học sinh

2. **Custom Anti-Cheat** (Tùy chọn)
   - Phát hiện hành vi gian lận đặc thù
   - Trường có quy định riêng
   - **Timeline**: 2-3 ngày thu thập data + 4-6 giờ training
   - **Yêu cầu**: Thu thập ảnh hành vi bình thường/gian lận

3. **Fine-tune LLM** (Rất nâng cao)
   - Môn học rất chuyên sâu (Y, Luật, v.v.)
   - Cần thuật ngữ chuyên môn đặc biệt
   - **Timeline**: 1-2 tuần
   - **Yêu cầu**: Dataset lớn (>1000 câu hỏi chất lượng cao)

---

## 2. Thông Số MacBook 12-inch 2017

### Cấu Hình
```
- CPU: Intel Core m3 (1.2GHz) hoặc m5/m7
- RAM: 8GB LPDDR3
- GPU: Intel HD Graphics 615 (integrated)
- Storage: SSD 256GB/512GB
- macOS: Có thể chạy đến macOS Monterey (12.x)
```

### Đánh Giá Khả Năng Training

| Tác Vụ | MacBook 12" 2017 | Google Colab Free | Khuyến Nghị |
|--------|------------------|-------------------|-------------|
| **CAT Calibration** | ✅ Tốt (1-2 giờ) | ✅ Rất tốt (10-20 phút) | MacBook OK |
| **Anti-Cheat Training** | ⚠️ Chậm (6-12 giờ) | ✅ Nhanh (1-2 giờ) | Dùng Colab |
| **Fine-tune LLM** | ❌ Không khả thi | ⚠️ Giới hạn RAM | Cloud service |
| **Development** | ✅ Tốt | ❌ Không phù hợp | MacBook |

**Kết Luận:**
- ✅ CAT Calibration: Train trên MacBook
- ✅ Anti-Cheat: Dùng Google Colab (nhanh hơn, free)
- ❌ Fine-tune LLM: Cần cloud service có phí (hoặc không cần làm)

---

## 3. So Sánh: MacBook vs Google Colab

### 3.1. Training Trên MacBook

**Ưu Điểm:**
- ✅ Làm việc offline
- ✅ Không giới hạn thời gian session
- ✅ Data riêng tư trên máy
- ✅ Tốt cho development & testing

**Nhược Điểm:**
- ❌ Chậm hơn (không có GPU mạnh)
- ❌ Pin yếu (cần cắm điện)
- ❌ Nhiệt độ cao khi training
- ❌ Giới hạn RAM (8GB)

**Phù Hợp Cho:**
- CAT calibration với dataset nhỏ (<10,000 records)
- Development và testing code
- Experiment nhỏ

### 3.2. Training Trên Google Colab

**Ưu Điểm:**
- ✅ FREE GPU (Tesla T4/K80)
- ✅ Nhanh hơn nhiều (5-10x)
- ✅ RAM lớn (12-16GB)
- ✅ Không lo nhiệt độ/pin
- ✅ Pre-installed libraries

**Nhược Điểm:**
- ❌ Giới hạn 12 giờ/session
- ❌ Cần internet tốt
- ❌ Data upload/download chậm
- ❌ Có thể bị disconnect

**Phù Hợp Cho:**
- Anti-cheat model training
- CAT calibration với dataset lớn
- Experiment nhiều hyperparameters

### 3.3. Khuyến Nghị

```
┌──────────────────────────────────────────────┐
│  WORKFLOW KHUYẾN NGHỊ:                       │
│                                              │
│  1. Development & Testing → MacBook          │
│  2. CAT Calibration (nhỏ) → MacBook         │
│  3. CAT Calibration (lớn) → Google Colab    │
│  4. Anti-Cheat Training → Google Colab       │
│  5. Fine-tuning LLM → Không cần (dùng API)  │
└──────────────────────────────────────────────┘
```

---

## 4. Setup Environment

### 4.1. Setup Trên MacBook

#### Bước 1: Cài Đặt Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Bước 2: Cài Đặt Python 3.10+
```bash
brew install python@3.10
python3 --version  # Kiểm tra version
```

#### Bước 3: Tạo Virtual Environment
```bash
# Di chuyển đến thư mục dự án
cd ~/Intelligence-Test

# Tạo virtual environment
python3 -m venv venv

# Kích hoạt
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip
```

#### Bước 4: Cài Đặt Dependencies
```bash
# Cho CAT calibration
pip install numpy pandas scikit-learn matplotlib

# Cho Anti-Cheat (nếu cần)
pip install tensorflow opencv-python pillow

# Cho data processing
pip install jupyter notebook
```

#### Bước 5: Kiểm Tra
```bash
python3 -c "import numpy; print('NumPy:', numpy.__version__)"
python3 -c "import pandas; print('Pandas:', pandas.__version__)"
python3 -c "import sklearn; print('Scikit-learn:', sklearn.__version__)"
```

### 4.2. Setup Google Colab (Không Cần Cài Gì!)

**Chỉ cần:**
1. Truy cập: https://colab.research.google.com
2. Đăng nhập Google
3. Tạo notebook mới
4. Bắt đầu code!

**Enable GPU (FREE):**
```
Runtime → Change runtime type → GPU → Save
```

---

## 5. Dataset - Lấy Ở Đâu?

### 5.1. Dataset Cho CAT Model

#### A. Từ Hệ Thống Của Bạn (Khuyến Nghị)
```javascript
// Export data từ Analytics Dashboard
1. Login as instructor
2. Vào Analytics Dashboard
3. Chọn exam
4. Click "Export Data" → Download CSV

File CSV sẽ có format:
student_id, question_id, is_correct, time_spent, difficulty
```

**Yêu cầu:**
- Tối thiểu: 100 học sinh × 20 câu = 2,000 responses
- Khuyến nghị: 500 học sinh × 30 câu = 15,000 responses

#### B. Dataset Công Khai (Cho Testing)

**1. IELTS/TOEFL Dataset**
```python
# Example: Kaggle dataset
import pandas as pd

# Download từ Kaggle IELTS Reading dataset
url = "https://www.kaggle.com/datasets/..."
df = pd.read_csv(url)
```

**2. Educational Dataset Repositories**
- [Kaggle Education Datasets](https://www.kaggle.com/datasets?search=education)
- [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/index.php)
- [OpenML](https://www.openml.org/)

**3. Tự Tạo Dataset Giả (Cho Testing)**
```python
import numpy as np
import pandas as pd

# Tạo synthetic data để test
np.random.seed(42)
n_students = 100
n_questions = 50

data = {
    'student_id': np.repeat(range(n_students), n_questions),
    'question_id': np.tile(range(n_questions), n_students),
    'is_correct': np.random.binomial(1, 0.6, n_students * n_questions),
    'difficulty': np.random.uniform(0.2, 0.8, n_questions).repeat(n_students)
}

df = pd.DataFrame(data)
df.to_csv('synthetic_responses.csv', index=False)
```

### 5.2. Dataset Cho Anti-Cheat Model

#### A. Thu Thập Từ Thực Tế
```
1. Tổ chức thi thử với 20-30 học sinh
2. Thu thập ảnh webcam:
   - Normal: Nhìn màn hình, làm bài bình thường (500+ ảnh)
   - Looking away: Nhìn sang chỗ khác (200+ ảnh)
   - Multiple faces: 2+ người trong frame (100+ ảnh)
   - No face: Không có người (100+ ảnh)
3. Label thủ công
```

#### B. Dataset Công Khai

**1. Face Detection Datasets**
- **WIDER FACE**: http://shuoyang1213.me/WIDERFACE/
- **CelebA**: http://mmlab.ie.cuhk.edu.hk/projects/CelebA.html
- **VGGFace2**: https://www.robots.ox.ac.uk/~vgg/data/vgg_face2/

**2. Head Pose Datasets**
- **300W-LP**: http://www.cbsr.ia.ac.cn/users/xiangyuzhu/projects/3DDFA/main.htm
- **AFLW**: https://www.tugraz.at/institute/icg/research/team-bischof/lrs/downloads/aflw/

#### C. Data Augmentation
```python
# Tăng cường data từ ít ảnh
from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    brightness_range=[0.8, 1.2]
)

# Từ 100 ảnh → 1000 ảnh
```

---

## 6. Training CAT Model

### 6.1. Script Training (MacBook)

Tạo file `train_cat_macbook.py`:

```python
"""
CAT Model Calibration Script for MacBook
Optimized for low-end hardware
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
import matplotlib.pyplot as plt
import json
from datetime import datetime

def load_data(csv_path):
    """Load response data from CSV"""
    print(f"📂 Loading data from {csv_path}...")
    df = pd.read_csv(csv_path)
    print(f"✅ Loaded {len(df)} responses")
    return df

def calculate_question_difficulty(df):
    """
    Calculate difficulty for each question based on student responses
    Difficulty = P(incorrect) = 1 - P(correct)
    """
    print("🔍 Calculating question difficulties...")
    
    difficulty_map = {}
    
    for q_id in df['question_id'].unique():
        q_responses = df[df['question_id'] == q_id]
        correct_rate = q_responses['is_correct'].mean()
        
        # Difficulty là xác suất làm SAI
        difficulty = 1 - correct_rate
        
        # Clamp vào [0.1, 0.9] để tránh extreme values
        difficulty = max(0.1, min(0.9, difficulty))
        
        difficulty_map[str(q_id)] = {
            'difficulty': round(difficulty, 3),
            'total_responses': len(q_responses),
            'correct_rate': round(correct_rate, 3)
        }
    
    print(f"✅ Calculated difficulties for {len(difficulty_map)} questions")
    return difficulty_map

def estimate_student_abilities(df):
    """Estimate student ability levels"""
    print("🎓 Estimating student abilities...")
    
    abilities = {}
    
    for student_id in df['student_id'].unique():
        student_responses = df[df['student_id'] == student_id]
        
        # Simple ability = average difficulty of correct answers
        correct_responses = student_responses[student_responses['is_correct'] == 1]
        
        if len(correct_responses) > 0:
            ability = correct_responses['difficulty'].mean()
        else:
            ability = 0.3  # Default low ability
        
        abilities[str(student_id)] = round(ability, 3)
    
    print(f"✅ Estimated abilities for {len(abilities)} students")
    return abilities

def plot_difficulty_distribution(difficulty_map, output_path='difficulty_dist.png'):
    """Plot difficulty distribution"""
    print("📊 Creating visualization...")
    
    difficulties = [d['difficulty'] for d in difficulty_map.values()]
    
    plt.figure(figsize=(10, 6))
    plt.hist(difficulties, bins=20, edgecolor='black', alpha=0.7)
    plt.xlabel('Difficulty')
    plt.ylabel('Number of Questions')
    plt.title('Question Difficulty Distribution')
    plt.axvline(np.mean(difficulties), color='red', linestyle='--', 
                label=f'Mean: {np.mean(difficulties):.3f}')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    print(f"✅ Saved plot to {output_path}")

def save_calibration_results(difficulty_map, abilities, output_path='cat_calibration.json'):
    """Save calibration results"""
    print(f"💾 Saving results to {output_path}...")
    
    results = {
        'calibration_date': datetime.now().isoformat(),
        'total_questions': len(difficulty_map),
        'total_students': len(abilities),
        'questions': difficulty_map,
        'students': abilities,
        'statistics': {
            'mean_difficulty': round(np.mean([d['difficulty'] for d in difficulty_map.values()]), 3),
            'std_difficulty': round(np.std([d['difficulty'] for d in difficulty_map.values()]), 3),
            'mean_ability': round(np.mean(list(abilities.values())), 3)
        }
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Results saved successfully!")
    return results

def main():
    """Main calibration workflow"""
    print("=" * 60)
    print("  CAT MODEL CALIBRATION - MacBook Optimized")
    print("=" * 60)
    print()
    
    # 1. Load data
    csv_path = 'student_responses.csv'  # Thay bằng path của bạn
    df = load_data(csv_path)
    
    # 2. Calculate difficulties
    difficulty_map = calculate_question_difficulty(df)
    
    # 3. Estimate abilities
    abilities = estimate_student_abilities(df)
    
    # 4. Create visualization
    plot_difficulty_distribution(difficulty_map)
    
    # 5. Save results
    results = save_calibration_results(difficulty_map, abilities)
    
    # 6. Summary
    print()
    print("=" * 60)
    print("  CALIBRATION SUMMARY")
    print("=" * 60)
    print(f"📊 Questions calibrated: {results['total_questions']}")
    print(f"👥 Students analyzed: {results['total_students']}")
    print(f"📈 Mean difficulty: {results['statistics']['mean_difficulty']}")
    print(f"📈 Std difficulty: {results['statistics']['std_difficulty']}")
    print(f"🎓 Mean student ability: {results['statistics']['mean_ability']}")
    print()
    print("✅ Calibration complete!")
    print("📁 Files created:")
    print("   - cat_calibration.json (results)")
    print("   - difficulty_dist.png (visualization)")
    print()

if __name__ == '__main__':
    main()
```

### 6.2. Chạy Training Trên MacBook

```bash
# 1. Chuẩn bị data
# Export CSV từ hệ thống hoặc tạo synthetic data

# 2. Kích hoạt virtual environment
source venv/bin/activate

# 3. Chạy script
python3 train_cat_macbook.py

# Expected output:
# ============================================================
#   CAT MODEL CALIBRATION - MacBook Optimized
# ============================================================
# 
# 📂 Loading data from student_responses.csv...
# ✅ Loaded 5000 responses
# 🔍 Calculating question difficulties...
# ✅ Calculated difficulties for 50 questions
# 🎓 Estimating student abilities...
# ✅ Estimated abilities for 100 students
# 📊 Creating visualization...
# ✅ Saved plot to difficulty_dist.png
# 💾 Saving results to cat_calibration.json...
# ✅ Results saved successfully!
# 
# ============================================================
#   CALIBRATION SUMMARY
# ============================================================
# 📊 Questions calibrated: 50
# 👥 Students analyzed: 100
# 📈 Mean difficulty: 0.512
# 📈 Std difficulty: 0.186
# 🎓 Mean student ability: 0.523
# 
# ✅ Calibration complete!

# 4. Import results vào hệ thống
# Copy cat_calibration.json vào src/data/
# Hệ thống sẽ tự động load difficulties
```

### 6.3. Performance trên MacBook 12" 2017

**Estimated Time:**
- 1,000 responses: ~30 giây
- 5,000 responses: ~2 phút
- 10,000 responses: ~5 phút
- 50,000 responses: ~20 phút

**Tips để Nhanh Hơn:**
```bash
# 1. Close các app khác
# 2. Cắm điện
# 3. Tắt Time Machine backup
# 4. Use Activity Monitor để monitor
```

---

## 7. Training Anti-Cheat Model

### 7.1. Khuyến Nghị: Dùng Google Colab

❌ **KHÔNG nên train trên MacBook 12" vì:**
- Không có GPU (chậm 10-50x)
- RAM thấp (8GB)
- Nhiệt độ cao, nguy cơ thermal throttling
- Pin yếu, cần cắm điện suốt

✅ **Dùng Google Colab FREE:**
- GPU T4 miễn phí
- RAM 12-16GB
- Training 6 giờ → 30 phút
- Không lo nhiệt độ

### 7.2. Script Cho Google Colab

**Xem chi tiết tại:** [GOOGLE_COLAB_TRAINING.md](./GOOGLE_COLAB_TRAINING.md)

Quick link: [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/imnothoan/Intelligence-Test/blob/main/notebooks/train_anticheat_colab.ipynb)

---

## 8. Fine-tuning Gemini (Nâng Cao)

### 8.1. Có Cần Fine-tune Không?

**❌ THƯỜNG KHÔNG CẦN!**

Gemini API (free) đã rất tốt cho:
- ✅ Tạo câu hỏi tiếng Việt
- ✅ Chấm điểm tự luận
- ✅ Feedback cho học sinh

**✅ Chỉ fine-tune khi:**
- Môn học CỰC KỲ chuyên sâu (Y khoa, Luật)
- Cần thuật ngữ rất đặc thù
- Có >1,000 câu hỏi chất lượng cao để train

### 8.2. Alternative: Better Prompts

**Thay vì fine-tune, cải thiện prompts:**

```javascript
// BEFORE (prompt đơn giản)
const prompt = `Tạo 5 câu hỏi về Toán lớp 11`;

// AFTER (prompt chi tiết)
const prompt = `
Vai trò: Bạn là giáo viên Toán THPT có 10 năm kinh nghiệm.

Nhiệm vụ: Tạo 5 câu hỏi trắc nghiệm về Đạo hàm (Toán lớp 11)

Yêu cầu:
- Theo chương trình SGK Toán 11 hiện hành
- Mức độ: 2 câu Nhận biết, 2 câu Thông hiểu, 1 câu Vận dụng
- Format: 4 đáp án A, B, C, D
- Đáp án sai phải hợp lý (dễ nhầm lẫn)
- Kèm lời giải chi tiết

Chủ đề cụ thể: Tính đạo hàm của hàm hợp

Output format: JSON array
`;
```

**Kết quả: Chất lượng tăng 3-5x mà không cần train!**

### 8.3. Nếu Thực Sự Cần Fine-tune

**Không thể train trên MacBook 12" hoặc Colab Free!**

**Options:**
1. **Google AI Studio Fine-tuning** (Có phí)
   - https://ai.google.dev/tutorials/python_quickstart
   - ~$0.5-2 per 1000 examples

2. **OpenAI Fine-tuning** (Có phí)
   - GPT-3.5-turbo fine-tuning
   - ~$3-8 per 1000 examples

3. **Hugging Face + RunPod** (Rẻ hơn)
   - Train trên cloud GPU
   - ~$0.3-1/hour

**Recommendation: Dùng better prompts thay vì fine-tune!**

---

## 9. Troubleshooting

### 9.1. MacBook Quá Nóng

**Triệu chứng:**
- Temperature >80°C
- Fan chạy 100%
- Performance giảm (thermal throttling)

**Giải pháp:**
```bash
# 1. Kiểm tra nhiệt độ
sudo powermetrics --samplers smc | grep -i "CPU die temperature"

# 2. Giảm tải
# - Đóng browser
# - Đóng các app không cần
# - Giảm batch size trong code

# 3. Làm mát
# - Để máy ở nơi thoáng mát
# - Dùng đế tản nhiệt
# - Nghỉ 10 phút sau mỗi 30 phút training
```

### 9.2. Out of Memory (RAM)

**Triệu chứng:**
- Python crashes với "MemoryError"
- MacBook lag, swap tăng cao

**Giải pháp:**
```python
# 1. Giảm batch size
BATCH_SIZE = 32  # Thay vì 128

# 2. Load data theo chunks
df = pd.read_csv('data.csv', chunksize=1000)
for chunk in df:
    process(chunk)

# 3. Free memory sau mỗi iteration
import gc
gc.collect()

# 4. Dùng memory-efficient libraries
# - Dask thay vì Pandas cho data lớn
# - Use generators thay vì lists
```

### 9.3. Training Quá Chậm

**Giải pháp:**
```bash
# 1. Switch sang Google Colab
# → Nhanh hơn 5-10x với GPU

# 2. Optimize code
# - Vectorize operations (NumPy)
# - Avoid loops
# - Use Numba JIT

# 3. Sample data
# - Training với 10% data trước
# - Kiểm tra code hoạt động
# - Sau đó mới train full
```

### 9.4. TensorFlow/PyTorch Issues on M1 Macs

**Nếu MacBook 12" là M1 (2020+):**
```bash
# Install TensorFlow for Apple Silicon
pip install tensorflow-macos tensorflow-metal

# Verify
python3 -c "import tensorflow as tf; print(tf.config.list_physical_devices())"
```

**Nếu MacBook 12" 2017 (Intel):**
```bash
# Regular TensorFlow
pip install tensorflow

# Nếu gặp lỗi, dùng version cũ hơn
pip install tensorflow==2.10.0
```

---

## 10. Kết Luận

### Tóm Tắt Workflow

```
┌─────────────────────────────────────────────────┐
│  RECOMMENDED WORKFLOW                            │
├─────────────────────────────────────────────────┤
│  1. Development                → MacBook         │
│  2. Sử dụng hệ thống          → Không cần train │
│  3. CAT Calibration (nhỏ)    → MacBook         │
│  4. CAT Calibration (lớn)    → Google Colab    │
│  5. Anti-Cheat Training       → Google Colab    │
│  6. Fine-tune LLM             → Better prompts  │
└─────────────────────────────────────────────────┘
```

### Key Takeaways

1. ✅ **Hầu hết không cần train** - Hệ thống sẵn sàng dùng
2. ✅ **MacBook OK cho CAT** - Training nhẹ, 1-2 giờ
3. ✅ **Colab cho Deep Learning** - Nhanh hơn, free GPU
4. ✅ **Better prompts > Fine-tuning** - Hiệu quả hơn nhiều
5. ✅ **Ưu tiên dùng API** - Gemini free, chất lượng tốt

### Next Steps

1. **Bắt đầu dùng hệ thống**: `npm install && npm run dev`
2. **Đọc**: [GOOGLE_COLAB_TRAINING.md](./GOOGLE_COLAB_TRAINING.md)
3. **Khi có data**: Train CAT calibration
4. **Advanced**: Tìm hiểu prompt engineering

**Happy Training! 🚀**

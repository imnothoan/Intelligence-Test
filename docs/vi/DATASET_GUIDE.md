# Dataset Sources và Hướng Dẫn Thu Thập Data 📊

## Mục Lục
1. [Dataset cho CAT Model](#1-dataset-cho-cat-model)
2. [Dataset cho Anti-Cheat](#2-dataset-cho-anti-cheat)
3. [Dataset cho Fine-tuning LLM](#3-dataset-cho-fine-tuning-llm)
4. [Tạo Synthetic Data](#4-tạo-synthetic-data)
5. [Tools để Thu Thập Data](#5-tools)

---

## 1. Dataset Cho CAT Model

### 1.1. Từ Hệ Thống Của Bạn (TỐT NHẤT)

**Đây là nguồn data TỐT NHẤT vì:**
- ✅ Phù hợp với học sinh của bạn
- ✅ Chính xác nhất
- ✅ Free

**Cách thu thập:**
```javascript
// Trong Intelligence Test Platform:
1. Login as Instructor
2. Analytics Dashboard
3. Chọn exam đã có học sinh làm
4. Click "Export Data"
5. Download CSV
```

**Format CSV:**
```csv
student_id,question_id,is_correct,time_spent,difficulty,response_date
S001,Q001,1,45,0.5,2024-01-15T10:30:00Z
S001,Q002,0,120,0.7,2024-01-15T10:31:45Z
S002,Q001,1,30,0.5,2024-01-15T11:00:00Z
...
```

**Yêu cầu tối thiểu:**
- **Quick calibration**: 50 học sinh × 20 câu = 1,000 responses
- **Good calibration**: 100 học sinh × 30 câu = 3,000 responses
- **Best calibration**: 200+ học sinh × 50+ câu = 10,000+ responses

**Timeline để thu thập:**
```
Tổ chức 5 kỳ thi (mỗi kỳ 20 học sinh, 30 câu)
→ 5 × 20 × 30 = 3,000 responses
→ Đủ để calibrate CAT
→ Thời gian: 1-2 tháng
```

### 1.2. Dataset Công Khai

#### A. Educational Assessment Datasets

**1. Assistments Dataset**
- **URL**: https://sites.google.com/site/assistmentsdata/
- **Description**: Student responses from math tutoring system
- **Size**: Millions of student-problem interactions
- **Format**: CSV, SQL dump
- **Use case**: Testing CAT algorithm

**2. EdNet Dataset (Korea)**
- **URL**: https://github.com/riiid/ednet
- **Description**: Educational interaction data
- **Size**: 100M+ interactions
- **Format**: CSV
- **Use case**: Large-scale CAT research

**3. PSLC DataShop**
- **URL**: https://pslcdatashop.web.cmu.edu/
- **Description**: Learning science datasets
- **Size**: Various
- **Format**: CSV, XML
- **Use case**: Research and testing

#### B. Standardized Test Data

**1. TIMSS (International Math & Science)**
- **URL**: https://timssandpirls.bc.edu/timss2019/international-database/
- **Description**: International assessment data
- **Use case**: Cross-national comparison

**2. PISA (OECD)**
- **URL**: https://www.oecd.org/pisa/data/
- **Description**: International student assessment
- **Use case**: High-quality test items

#### C. Kaggle Datasets

**Search on Kaggle:**
- "Student performance"
- "Educational data"
- "Test scores"
- "Item response theory"

**Popular datasets:**
- [Student Performance Dataset](https://www.kaggle.com/datasets/larsen0966/student-performance-data-set)
- [MOOC Dropout Prediction](https://www.kaggle.com/datasets/chaitanyakumar6/mooc-dropout-prediction)

### 1.3. Tạo Synthetic Data

**Python script để tạo data giả cho testing:**

```python
import numpy as np
import pandas as pd

def generate_synthetic_cat_data(
    n_students=100,
    n_questions=50,
    ability_mean=0.5,
    ability_std=0.15
):
    """
    Tạo synthetic data dựa trên IRT model
    
    Parameters:
    - n_students: Số lượng học sinh
    - n_questions: Số lượng câu hỏi
    - ability_mean: Ability trung bình của học sinh
    - ability_std: Độ lệch chuẩn của ability
    """
    
    np.random.seed(42)
    
    # Generate student abilities (normally distributed)
    abilities = np.random.normal(ability_mean, ability_std, n_students)
    abilities = np.clip(abilities, 0, 1)  # Clamp to [0, 1]
    
    # Generate question difficulties (uniform distribution)
    difficulties = np.random.uniform(0.2, 0.8, n_questions)
    
    # Generate responses using IRT 1PL model
    data = []
    for s_idx, ability in enumerate(abilities):
        for q_idx, difficulty in enumerate(difficulties):
            # IRT probability: P(correct) = 1 / (1 + exp(-(ability - difficulty)))
            prob_correct = 1 / (1 + np.exp(-(ability - difficulty) * 5))
            
            # Bernoulli trial
            is_correct = np.random.binomial(1, prob_correct)
            
            # Time spent (inversely related to ability - difficulty gap)
            time_base = 60  # seconds
            time_variation = np.random.normal(0, 15)
            time_spent = max(10, time_base + time_variation + 
                           (difficulty - ability) * 50)
            
            data.append({
                'student_id': f'S{s_idx:03d}',
                'question_id': f'Q{q_idx:03d}',
                'is_correct': is_correct,
                'time_spent': int(time_spent),
                'difficulty': round(difficulty, 3),
                'ability': round(ability, 3)
            })
    
    df = pd.DataFrame(data)
    return df

# Generate dataset
df = generate_synthetic_cat_data(n_students=200, n_questions=100)

# Save
df.to_csv('synthetic_cat_data.csv', index=False)

# Summary
print(f"Generated {len(df)} responses")
print(f"Students: {df['student_id'].nunique()}")
print(f"Questions: {df['question_id'].nunique()}")
print(f"Overall accuracy: {df['is_correct'].mean():.2%}")
```

---

## 2. Dataset Cho Anti-Cheat

### 2.1. Thu Thập Từ Thực Tế (Khuyến Nghị)

**Cách tốt nhất: Tổ chức thi thử**

**Plan:**
```
Week 1: Tổ chức thi thử với 20-30 học sinh
- Giải thích: Thu thập data để cải thiện hệ thống
- Có sự đồng ý của học sinh
- Record webcam trong quá trình thi

Week 2: Label data
- Normal behavior: 500+ images
- Looking away: 200+ images  
- Multiple faces: 100+ images
- No face: 100+ images

Week 3: Data augmentation
- Từ 900 images → 5,000+ images

Week 4: Training
```

**Setup thu thập:**
```javascript
// Enable trong exam config
const examConfig = {
  enableAntiCheat: true,
  captureInterval: 5000, // Capture every 5 seconds
  saveImages: true,       // Save for training
  localStoragePath: '/data/anticheat/'
}

// Sau khi thi xong:
// 1. Extract images từ localStorage
// 2. Manual labeling
// 3. Organize into folders
```

### 2.2. Public Datasets

#### A. Face Detection Datasets

**1. WIDER FACE**
- **URL**: http://shuoyang1213.me/WIDERFACE/
- **Size**: 32,203 images, 393,703 faces
- **Use**: Face detection training
- **Download**: Direct link available

**2. CelebA**
- **URL**: http://mmlab.ie.cuhk.edu.hk/projects/CelebA.html
- **Size**: 200,000+ celebrity faces
- **Use**: Face attributes, detection
- **Note**: Large download (1.4GB)

**3. VGGFace2**
- **URL**: https://www.robots.ox.ac.uk/~vgg/data/vgg_face2/
- **Size**: 3.3M images, 9K identities
- **Use**: Face recognition
- **Note**: Requires request form

#### B. Head Pose Datasets

**1. 300W-LP**
- **URL**: http://www.cbsr.ia.ac.cn/users/xiangyuzhu/projects/3DDFA/main.htm
- **Size**: 61,225 images
- **Use**: Head pose estimation
- **Angles**: Yaw, pitch, roll

**2. AFLW (Annotated Facial Landmarks in the Wild)**
- **URL**: https://www.tugraz.at/institute/icg/research/team-bischof/lrs/downloads/aflw/
- **Size**: 25,000+ faces
- **Use**: Facial landmark detection

#### C. Behavior Recognition

**1. UT Interaction Dataset**
- **URL**: http://cvrc.ece.utexas.edu/SDHA2010/Human_Interaction.html
- **Use**: Human interaction recognition

**2. YouTube Faces DB**
- **URL**: https://www.cs.tau.ac.il/~wolf/ytfaces/
- **Size**: 3,425 videos, 1,595 subjects
- **Use**: Face tracking in videos

### 2.3. Pre-trained Models (Khuyến Nghị!)

**Thay vì train từ đầu, dùng pre-trained models:**

**1. BlazeFace (Google) - RECOMMENDED**
```javascript
// Đã tích hợp trong hệ thống
import * as blazeface from '@tensorflow-models/blazeface';

const model = await blazeface.load();
const predictions = await model.estimateFaces(video);
// → Hoạt động tốt, không cần train!
```

**2. MediaPipe Face Detection**
```python
import mediapipe as mp

mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection()

# Super fast, accurate
```

**3. MTCNN**
```python
from mtcnn import MTCNN

detector = MTCNN()
faces = detector.detect_faces(img)
```

**Kết luận: 99% không cần train, dùng pre-trained model!**

---

## 3. Dataset Cho Fine-tuning LLM

### 3.1. Vietnamese Education Datasets

#### A. VLSP (Vietnamese Language and Speech Processing)
- **URL**: https://vlsp.org.vn/
- **Datasets**: Vietnamese NLP datasets
- **Use**: Vietnamese language understanding

#### B. Vietnamese Wikipedia Dump
```bash
# Download
wget https://dumps.wikimedia.org/viwiki/latest/viwiki-latest-pages-articles.xml.bz2

# Extract with WikiExtractor
pip install wikiextractor
python -m wikiextractor.WikiExtractor viwiki-latest-pages-articles.xml.bz2 -o extracted/
```

#### C. PhoBERT Pre-trained Data
- **URL**: https://github.com/VinAIResearch/PhoBERT
- **Use**: Vietnamese BERT models

### 3.2. Question Banks

#### A. Tự Xây Dựng (Khuyến Nghị)

**Collect từ:**
1. **Sách giáo khoa**
   - Digitize câu hỏi cuối chương
   - Format: JSON

2. **Đề thi cũ**
   - Đề thi học kỳ
   - Đề thi chính thức
   - Đề thi thử

3. **Teachers' contributions**
   - Khuyến khích giáo viên đóng góp
   - Gamification: Điểm thưởng

**Format:**
```json
{
  "questions": [
    {
      "id": "Q001",
      "subject": "Toán",
      "grade": 11,
      "chapter": "Chương 2: Đạo hàm",
      "topic": "Đạo hàm cơ bản",
      "question": "Tính đạo hàm của hàm số y = x^2 + 3x - 2",
      "type": "multiple-choice",
      "options": ["A) 2x + 3", "B) x^2 + 3", "C) 2x - 2", "D) 3x + 2"],
      "correct_answer": 0,
      "explanation": "Áp dụng công thức: (x^n)' = n*x^(n-1)...",
      "difficulty": 0.3,
      "cognitive_level": "understand"
    }
  ]
}
```

#### B. Open Educational Resources

**1. Khan Academy**
- **URL**: https://www.khanacademy.org/
- **Note**: May need permission

**2. OpenStax**
- **URL**: https://openstax.org/
- **License**: CC BY
- **Use**: Free textbooks

**3. MIT OpenCourseWare**
- **URL**: https://ocw.mit.edu/
- **Use**: Course materials, problem sets

### 3.3. Synthetic Question Generation

**Use Gemini/GPT to generate training data:**

```python
import google.generativeai as genai

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def generate_question_dataset(subject, grade, chapter, num_questions=100):
    """Generate synthetic questions for fine-tuning"""
    
    prompt = f"""
    Generate {num_questions} high-quality multiple-choice questions for:
    - Subject: {subject}
    - Grade: {grade}
    - Chapter: {chapter}
    
    For each question provide:
    1. Question text
    2. 4 options (A, B, C, D)
    3. Correct answer
    4. Detailed explanation
    5. Difficulty level (easy/medium/hard)
    6. Cognitive level (remember/understand/apply/analyze)
    
    Format as JSON array.
    """
    
    response = model.generate_content(prompt)
    questions = parse_json(response.text)
    
    return questions

# Generate 1000 questions
dataset = []
for chapter in range(1, 11):
    questions = generate_question_dataset("Toán", 11, f"Chương {chapter}", 100)
    dataset.extend(questions)

# Save
with open('synthetic_questions.json', 'w', encoding='utf-8') as f:
    json.dump(dataset, f, indent=2, ensure_ascii=False)
```

---

## 4. Tạo Synthetic Data

### 4.1. Advantages of Synthetic Data

✅ **Ưu điểm:**
- Fast: Tạo trong vài phút
- Free: Không cần thu thập thực tế
- Controlled: Kiểm soát distribution
- Privacy: Không có dữ liệu cá nhân

❌ **Nhược điểm:**
- Less realistic
- May not generalize well
- Need to validate with real data

### 4.2. When to Use

**Use synthetic data khi:**
- Testing algorithm
- Prototyping
- Don't have real data yet
- Supplement real data (augmentation)

**Don't rely solely on synthetic data for:**
- Production models
- High-stakes testing
- Final calibration

### 4.3. Tools

#### A. Python Libraries

```python
# 1. Faker - Generate fake data
from faker import Faker
fake = Faker('vi_VN')  # Vietnamese locale

student_name = fake.name()
student_email = fake.email()

# 2. SDV - Synthetic Data Vault
from sdv.tabular import GaussianCopula

model = GaussianCopula()
model.fit(real_data)
synthetic_data = model.sample(num_rows=1000)

# 3. Numpy/Pandas - Statistical generation
import numpy as np
import pandas as pd

# Generate with specific distribution
scores = np.random.normal(loc=75, scale=10, size=1000)
```

#### B. Image Augmentation

```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    brightness_range=[0.8, 1.2]
)

# From 100 images → 1000 augmented images
```

---

## 5. Tools để Thu Thập và Quản Lý Data

### 5.1. Data Collection Tools

**1. Google Forms**
- Easy survey creation
- Export to CSV
- Free

**2. Qualtrics**
- Advanced surveys
- Academic license available

**3. Custom web scraper**
```python
import requests
from bs4 import BeautifulSoup

# Scrape công khai educational resources
# NOTE: Check terms of service!
```

### 5.2. Data Labeling Tools

**1. Label Studio**
- **URL**: https://labelstud.io/
- **Use**: Image/text labeling
- **Free**: Yes (open source)

**2. CVAT**
- **URL**: https://github.com/opencv/cvat
- **Use**: Computer vision annotation
- **Free**: Yes

**3. Roboflow**
- **URL**: https://roboflow.com/
- **Use**: Image annotation + augmentation
- **Free tier**: Yes

### 5.3. Data Management

**1. DVC (Data Version Control)**
```bash
pip install dvc

dvc init
dvc add data/dataset.csv
git add data/dataset.csv.dvc
git commit -m "Add dataset"
```

**2. Weights & Biases**
- Track experiments
- Version datasets
- Free for individuals

**3. Google Drive / Dropbox**
- Simple cloud storage
- Easy sharing

---

## 6. Best Practices

### 6.1. Data Quality

✅ **Do:**
- Clean data (remove outliers, invalid entries)
- Validate data (check distributions, ranges)
- Document metadata (collection date, source, format)
- Version control datasets

❌ **Don't:**
- Mix datasets from different sources without normalization
- Include biased data
- Use data without permission
- Ignore privacy concerns

### 6.2. Privacy & Ethics

**Guidelines:**
- ✅ Get informed consent from students
- ✅ Anonymize student data (remove PII)
- ✅ Comply with GDPR/local privacy laws
- ✅ Secure storage (encryption)
- ❌ Don't share raw student data
- ❌ Don't use data for other purposes without consent

### 6.3. Dataset Documentation

**Create a dataset README:**
```markdown
# Dataset: Student Responses for CAT Calibration

## Overview
- **Size**: 5,000 responses
- **Students**: 100 unique students
- **Questions**: 50 unique questions
- **Date**: January 2024
- **Source**: Intelligence Test Platform v1.0

## Format
CSV with columns:
- student_id (string)
- question_id (string)
- is_correct (0 or 1)
- time_spent (seconds, integer)
- difficulty (float, 0.0-1.0)

## License
Proprietary - For internal use only

## Contact
data-owner@school.edu
```

---

## 7. Summary

### Quick Reference

| Model | Data Needed | Where to Get | Time to Collect |
|-------|-------------|--------------|-----------------|
| **CAT** | Student responses | Export from app | 1-2 months |
| **Anti-Cheat** | Webcam images | Organize test sessions | 1-2 weeks |
| **LLM Fine-tune** | Question bank | Create + Gemini generate | 2-4 weeks |

### Recommendations

1. **Start with your own data** - Most relevant and accurate
2. **Use pre-trained models** - Don't train from scratch
3. **Supplement with public datasets** - For testing and validation
4. **Synthetic data for prototyping** - Quick start, validate with real data
5. **Better prompts > Fine-tuning** - Often more effective

**Next Steps:**
- [ ] Start collecting data from your exams
- [ ] Organize data into proper format
- [ ] Train CAT model when you have 3,000+ responses
- [ ] Use pre-trained anti-cheat models (no custom training needed!)

📚 **Related Docs:**
- [MacBook Training Guide](./MACBOOK_TRAINING_GUIDE.md)
- [Google Colab Training](./GOOGLE_COLAB_TRAINING.md)
- [Complete Training Guide](./COMPLETE_TRAINING_GUIDE.md)

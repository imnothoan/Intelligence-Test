# Hướng Dẫn Training AI trên Google Colab (MIỄN PHÍ) ☁️

## Mục Lục
1. [Giới Thiệu Google Colab](#1-giới-thiệu)
2. [Setup và Bắt Đầu](#2-setup)
3. [Training CAT Model](#3-training-cat)
4. [Training Anti-Cheat Model](#4-training-anti-cheat)
5. [Tips & Tricks](#5-tips-tricks)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Giới Thiệu Google Colab

### 1.1. Google Colab Là Gì?

**Google Colaboratory (Colab)** là môi trường Jupyter Notebook miễn phí chạy trên cloud của Google.

**Ưu điểm:**
- ✅ **Hoàn toàn MIỄN PHÍ** 
- ✅ **GPU miễn phí** (Tesla T4, P100 hoặc K80)
- ✅ **RAM 12-16GB** (nhiều hơn MacBook)
- ✅ **Pre-installed libraries** (TensorFlow, PyTorch, v.v.)
- ✅ **Không cần cài đặt gì** trên máy
- ✅ **Truy cập mọi lúc** từ browser

**Giới hạn phiên bản FREE:**
- ⚠️ **12 giờ/session** (sau đó bị disconnect)
- ⚠️ **Idle timeout**: 90 phút không hoạt động
- ⚠️ **GPU không đảm bảo** (có thể hết quota)
- ⚠️ **Storage tạm thời** (files xóa sau khi disconnect)

**Colab Pro ($9.99/tháng) - Nâng cao:**
- 24 giờ/session
- GPU ưu tiên (faster GPUs)
- More RAM (up to 32GB)
- Background execution

**Kết luận: FREE version đủ dùng cho Intelligence Test!**

### 1.2. Khi Nào Dùng Colab?

✅ **Dùng Colab khi:**
- Training anti-cheat models (computer vision)
- CAT calibration với dataset lớn (>10,000 records)
- Experiment nhiều hyperparameters
- Machine learning tasks nặng

❌ **Không dùng Colab khi:**
- Development/debugging code (dùng MacBook)
- Quick experiments nhỏ
- Tasks không cần GPU

---

## 2. Setup và Bắt Đầu

### 2.1. Truy Cập Google Colab

1. **Mở trình duyệt**
   - Chrome, Safari, Firefox (khuyến nghị Chrome)

2. **Truy cập Colab**
   - URL: https://colab.research.google.com

3. **Đăng nhập Google**
   - Dùng tài khoản Gmail của bạn
   - Cho phép quyền truy cập

4. **Tạo Notebook mới**
   - Click "New notebook" hoặc "File → New notebook"
   - Notebook sẽ tự động save vào Google Drive

### 2.2. Enable GPU (Quan Trọng!)

```
1. Click "Runtime" (Thời gian chạy) trên menu bar
2. Click "Change runtime type" (Thay đổi loại thời gian chạy)
3. Hardware accelerator: Chọn "GPU"
4. GPU type: "T4" (nếu có option)
5. Click "Save"
```

**Verify GPU:**
```python
# Cell 1: Kiểm tra GPU
import tensorflow as tf

print("GPU Available:", tf.config.list_physical_devices('GPU'))
print("TensorFlow version:", tf.__version__)

# Nếu có GPU, sẽ thấy:
# GPU Available: [PhysicalDevice(name='/physical_device:GPU:0', device_type='GPU')]
```

### 2.3. Mount Google Drive (Lưu Files)

```python
# Cell 2: Mount Google Drive để lưu kết quả
from google.colab import drive
drive.mount('/content/drive')

# Sẽ hiện link để authorize
# Click link → Chọn tài khoản → Copy code → Paste vào Colab
# Output: Mounted at /content/drive
```

**File structure sau khi mount:**
```
/content/drive/MyDrive/
├── Intelligence-Test/
│   ├── datasets/
│   ├── models/
│   └── results/
```

### 2.4. Install Dependencies

```python
# Cell 3: Install thư viện (nếu cần)
!pip install opencv-python-headless
!pip install pillow

# Verify
import cv2
print("OpenCV version:", cv2.__version__)
```

---

## 3. Training CAT Model Trên Colab

### 3.1. Upload Dataset

**Option 1: Upload trực tiếp**
```python
# Cell 4: Upload file
from google.colab import files

print("📤 Please select your CSV file...")
uploaded = files.upload()

# Lấy tên file
filename = list(uploaded.keys())[0]
print(f"✅ Uploaded: {filename}")

# Load data
import pandas as pd
df = pd.read_csv(filename)
print(f"📊 Loaded {len(df)} records")
print(df.head())
```

**Option 2: Từ Google Drive**
```python
# Cell 4: Load từ Google Drive
import pandas as pd

# Đường dẫn file trong Drive
csv_path = '/content/drive/MyDrive/Intelligence-Test/datasets/student_responses.csv'

df = pd.read_csv(csv_path)
print(f"📊 Loaded {len(df)} records")
print(df.head())
```

**Option 3: Download từ URL**
```python
# Cell 4: Download từ internet
import pandas as pd

url = "https://your-server.com/data/student_responses.csv"
df = pd.read_csv(url)
print(f"📊 Loaded {len(df)} records")
```

### 3.2. CAT Calibration Script

```python
# Cell 5: CAT Calibration
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import json
from datetime import datetime

def calculate_question_difficulty(df):
    """Calculate difficulty for each question"""
    print("🔍 Calculating question difficulties...")
    
    difficulty_map = {}
    
    for q_id in df['question_id'].unique():
        q_responses = df[df['question_id'] == q_id]
        correct_rate = q_responses['is_correct'].mean()
        
        # Difficulty = 1 - correct_rate
        difficulty = 1 - correct_rate
        difficulty = max(0.1, min(0.9, difficulty))
        
        difficulty_map[str(q_id)] = {
            'difficulty': round(difficulty, 3),
            'total_responses': len(q_responses),
            'correct_rate': round(correct_rate, 3)
        }
    
    print(f"✅ Calculated difficulties for {len(difficulty_map)} questions")
    return difficulty_map

def estimate_student_abilities(df):
    """Estimate student ability using IRT"""
    print("🎓 Estimating student abilities...")
    
    abilities = {}
    
    for student_id in df['student_id'].unique():
        student_responses = df[df['student_id'] == student_id]
        correct_responses = student_responses[student_responses['is_correct'] == 1]
        
        if len(correct_responses) > 0:
            ability = correct_responses['difficulty'].mean()
        else:
            ability = 0.3
        
        abilities[str(student_id)] = round(ability, 3)
    
    print(f"✅ Estimated abilities for {len(abilities)} students")
    return abilities

def plot_results(difficulty_map, abilities):
    """Create visualizations"""
    print("📊 Creating visualizations...")
    
    fig, axes = plt.subplots(1, 2, figsize=(15, 5))
    
    # Plot 1: Difficulty distribution
    difficulties = [d['difficulty'] for d in difficulty_map.values()]
    axes[0].hist(difficulties, bins=20, edgecolor='black', alpha=0.7, color='skyblue')
    axes[0].set_xlabel('Difficulty')
    axes[0].set_ylabel('Number of Questions')
    axes[0].set_title('Question Difficulty Distribution')
    axes[0].axvline(np.mean(difficulties), color='red', linestyle='--', 
                    label=f'Mean: {np.mean(difficulties):.3f}')
    axes[0].legend()
    axes[0].grid(True, alpha=0.3)
    
    # Plot 2: Ability distribution
    ability_values = list(abilities.values())
    axes[1].hist(ability_values, bins=20, edgecolor='black', alpha=0.7, color='lightgreen')
    axes[1].set_xlabel('Ability')
    axes[1].set_ylabel('Number of Students')
    axes[1].set_title('Student Ability Distribution')
    axes[1].axvline(np.mean(ability_values), color='red', linestyle='--',
                    label=f'Mean: {np.mean(ability_values):.3f}')
    axes[1].legend()
    axes[1].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('cat_calibration_results.png', dpi=300, bbox_inches='tight')
    print("✅ Saved visualization: cat_calibration_results.png")
    plt.show()

def save_results(difficulty_map, abilities):
    """Save calibration results"""
    print("💾 Saving results...")
    
    results = {
        'calibration_date': datetime.now().isoformat(),
        'total_questions': len(difficulty_map),
        'total_students': len(abilities),
        'questions': difficulty_map,
        'students': abilities,
        'statistics': {
            'mean_difficulty': round(np.mean([d['difficulty'] for d in difficulty_map.values()]), 3),
            'std_difficulty': round(np.std([d['difficulty'] for d in difficulty_map.values()]), 3),
            'min_difficulty': round(min([d['difficulty'] for d in difficulty_map.values()]), 3),
            'max_difficulty': round(max([d['difficulty'] for d in difficulty_map.values()]), 3),
            'mean_ability': round(np.mean(list(abilities.values())), 3),
            'std_ability': round(np.std(list(abilities.values())), 3),
        }
    }
    
    # Save to JSON
    with open('cat_calibration.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    # Save to Google Drive
    drive_path = '/content/drive/MyDrive/Intelligence-Test/results/cat_calibration.json'
    with open(drive_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print("✅ Results saved to:")
    print("   - cat_calibration.json (local)")
    print(f"   - {drive_path} (Google Drive)")
    
    return results

# Main execution
print("=" * 70)
print("  CAT MODEL CALIBRATION - Google Colab")
print("=" * 70)
print()

# Calibrate
difficulty_map = calculate_question_difficulty(df)
abilities = estimate_student_abilities(df)

# Visualize
plot_results(difficulty_map, abilities)

# Save
results = save_results(difficulty_map, abilities)

# Summary
print()
print("=" * 70)
print("  CALIBRATION SUMMARY")
print("=" * 70)
print(f"📊 Questions calibrated: {results['total_questions']}")
print(f"👥 Students analyzed: {results['total_students']}")
print(f"📈 Difficulty: {results['statistics']['mean_difficulty']:.3f} ± {results['statistics']['std_difficulty']:.3f}")
print(f"📈 Range: [{results['statistics']['min_difficulty']:.3f}, {results['statistics']['max_difficulty']:.3f}]")
print(f"🎓 Ability: {results['statistics']['mean_ability']:.3f} ± {results['statistics']['std_ability']:.3f}")
print()
print("✅ Calibration complete!")
print()
```

### 3.3. Download Results

```python
# Cell 6: Download results to your computer
from google.colab import files

files.download('cat_calibration.json')
files.download('cat_calibration_results.png')

print("✅ Files downloaded to your Downloads folder")
print("📁 Import cat_calibration.json into your app!")
```

---

## 4. Training Anti-Cheat Model

### 4.1. Upload Training Data

```python
# Cell 7: Upload dataset
from google.colab import files
import zipfile
import os

print("📤 Upload your anti-cheat dataset (ZIP file)...")
print("Expected structure:")
print("  dataset.zip")
print("    ├── normal/       (500+ images)")
print("    ├── looking_away/ (200+ images)")
print("    ├── multiple/     (100+ images)")
print("    └── no_face/      (100+ images)")
print()

uploaded = files.upload()

# Extract ZIP
zip_filename = list(uploaded.keys())[0]
with zipfile.ZipFile(zip_filename, 'r') as zip_ref:
    zip_ref.extractall('dataset')

print("✅ Dataset extracted to 'dataset/' folder")

# Count images
for folder in ['normal', 'looking_away', 'multiple', 'no_face']:
    path = f'dataset/{folder}'
    if os.path.exists(path):
        count = len(os.listdir(path))
        print(f"  {folder}: {count} images")
```

### 4.2. Data Preprocessing

```python
# Cell 8: Prepare data
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import matplotlib.pyplot as plt

# Image parameters
IMG_SIZE = 224
BATCH_SIZE = 32

# Data augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2  # 80% train, 20% validation
)

# Training set
train_generator = train_datagen.flow_from_directory(
    'dataset',
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'
)

# Validation set
val_generator = train_datagen.flow_from_directory(
    'dataset',
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'
)

print("✅ Data prepared")
print(f"Training samples: {train_generator.samples}")
print(f"Validation samples: {val_generator.samples}")
print(f"Classes: {train_generator.class_indices}")
```

### 4.3. Build Model

```python
# Cell 9: Create CNN model
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2

def create_anti_cheat_model(num_classes=4):
    """
    Create anti-cheat detection model using transfer learning
    Classes: normal, looking_away, multiple, no_face
    """
    
    # Use pre-trained MobileNetV2 (faster on GPU)
    base_model = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model
    base_model.trainable = False
    
    # Add custom layers
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    return model

# Create model
model = create_anti_cheat_model(num_classes=4)

# Compile
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

print("✅ Model created successfully")
```

### 4.4. Train Model

```python
# Cell 10: Train model
import time

print("🚀 Starting training...")
print("=" * 70)

# Callbacks
callbacks = [
    keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True
    ),
    keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=3,
        min_lr=1e-7
    ),
    keras.callbacks.ModelCheckpoint(
        'best_model.h5',
        monitor='val_accuracy',
        save_best_only=True
    )
]

# Train
start_time = time.time()

history = model.fit(
    train_generator,
    epochs=20,
    validation_data=val_generator,
    callbacks=callbacks,
    verbose=1
)

training_time = time.time() - start_time

print()
print("=" * 70)
print(f"✅ Training complete in {training_time/60:.2f} minutes")
print(f"Best validation accuracy: {max(history.history['val_accuracy']):.4f}")
```

### 4.5. Evaluate and Visualize

```python
# Cell 11: Plot training history
plt.figure(figsize=(12, 4))

# Accuracy
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Train')
plt.plot(history.history['val_accuracy'], label='Validation')
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.grid(True)

# Loss
plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Train')
plt.plot(history.history['val_loss'], label='Validation')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.savefig('training_history.png', dpi=300)
plt.show()

print("✅ Training visualization saved")
```

### 4.6. Convert to TensorFlow.js

```python
# Cell 12: Convert model for web deployment
!pip install tensorflowjs

import tensorflowjs as tfjs

# Convert
tfjs.converters.save_keras_model(model, 'tfjs_model')

print("✅ Model converted to TensorFlow.js format")
print("📁 Model saved in 'tfjs_model/' folder")

# Zip for download
!zip -r tfjs_model.zip tfjs_model/

# Download
from google.colab import files
files.download('tfjs_model.zip')

print("✅ Download complete!")
print("📦 Extract tfjs_model.zip to your project's /public/models/ folder")
```

### 4.7. Save to Google Drive

```python
# Cell 13: Backup to Google Drive
import shutil

drive_models_path = '/content/drive/MyDrive/Intelligence-Test/models/'

# Create directory if not exists
!mkdir -p "{drive_models_path}"

# Copy files
shutil.copy('best_model.h5', f'{drive_models_path}anti_cheat_model.h5')
shutil.copytree('tfjs_model', f'{drive_models_path}tfjs_model', dirs_exist_ok=True)
shutil.copy('training_history.png', f'{drive_models_path}training_history.png')

print("✅ Models backed up to Google Drive")
print(f"📁 Location: {drive_models_path}")
```

---

## 5. Tips & Tricks

### 5.1. Prevent Timeout

**Problem:** Colab disconnect sau 90 phút idle

**Solutions:**

**Option 1: Auto-click (JavaScript)**
```javascript
// Mở Console (F12) và paste code này
function KeepAlive() {
  console.log("Keeping session alive...");
  document.querySelector("colab-connect-button").click();
}
setInterval(KeepAlive, 60000); // Every 1 minute
```

**Option 2: Print progress**
```python
# Trong training loop
import time

for epoch in range(EPOCHS):
    print(f"Epoch {epoch+1}/{EPOCHS} - {time.strftime('%H:%M:%S')}")
    # Training code...
```

**Option 3: Use callbacks**
```python
class KeepAliveCallback(keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        print(f"✓ Epoch {epoch+1} complete at {time.strftime('%H:%M:%S')}")

# Add to callbacks list
callbacks.append(KeepAliveCallback())
```

### 5.2. Monitor GPU Usage

```python
# Cell: Check GPU memory
!nvidia-smi

# Output shows:
# - GPU type (T4, K80, P100)
# - Memory used/total
# - GPU utilization %
```

### 5.3. Speed Up Training

**1. Use smaller image size:**
```python
IMG_SIZE = 128  # Instead of 224 → 2-3x faster
```

**2. Increase batch size:**
```python
BATCH_SIZE = 64  # Instead of 32 → 1.5x faster
# But watch GPU memory!
```

**3. Use MobilNet instead of ResNet:**
```python
# MobileNetV2: Fast, good enough
# ResNet50: Slower, slightly better accuracy
```

**4. Mixed precision:**
```python
from tensorflow.keras import mixed_precision
mixed_precision.set_global_policy('mixed_float16')
# → 2-3x faster on modern GPUs
```

### 5.4. Save Checkpoints Frequently

```python
# Save every 5 epochs
checkpoint_callback = keras.callbacks.ModelCheckpoint(
    'model_epoch_{epoch:02d}.h5',
    save_freq='epoch',
    period=5
)
```

---

## 6. Troubleshooting

### 6.1. GPU Not Available

**Problem:** `GPU Available: []`

**Solutions:**
```python
# 1. Check runtime type
# Runtime → Change runtime type → GPU

# 2. Check quota
# Bạn có thể hết GPU quota (dùng quá nhiều)
# Đợi vài giờ hoặc dùng tài khoản khác

# 3. Restart runtime
# Runtime → Restart runtime

# 4. Use CPU as fallback
# Training sẽ chậm hơn nhưng vẫn hoạt động
```

### 6.2. Out of Memory

**Problem:** `ResourceExhaustedError: OOM when allocating tensor`

**Solutions:**
```python
# 1. Reduce batch size
BATCH_SIZE = 16  # Or even 8

# 2. Reduce image size
IMG_SIZE = 128

# 3. Clear memory
import gc
import keras.backend as K

K.clear_session()
gc.collect()

# 4. Use mixed precision
from tensorflow.keras import mixed_precision
mixed_precision.set_global_policy('mixed_float16')
```

### 6.3. Session Disconnected

**Problem:** "Runtime disconnected"

**Solutions:**
```python
# 1. Files đã save trong Google Drive vẫn còn
# Mount lại Drive và load checkpoint:

from google.colab import drive
drive.mount('/content/drive')

# Load checkpoint
model = keras.models.load_model('/content/drive/MyDrive/.../best_model.h5')

# Resume training từ checkpoint
history = model.fit(train_gen, epochs=REMAINING_EPOCHS, ...)
```

### 6.4. Import Error

**Problem:** `ModuleNotFoundError: No module named 'xyz'`

**Solution:**
```python
!pip install xyz

# Example:
!pip install opencv-python-headless
!pip install pillow
!pip install tensorflowjs
```

---

## 7. Complete Workflow Example

### 7.1. Quick Start Notebook

```python
# ===== CELL 1: Setup =====
print("🚀 Intelligence Test - Anti-Cheat Model Training")
print("=" * 70)

# Mount Drive
from google.colab import drive
drive.mount('/content/drive')

# Check GPU
import tensorflow as tf
print(f"GPU Available: {tf.config.list_physical_devices('GPU')}")
print(f"TensorFlow: {tf.__version__}")

# ===== CELL 2: Upload Data =====
from google.colab import files
import zipfile

uploaded = files.upload()
zip_file = list(uploaded.keys())[0]

with zipfile.ZipFile(zip_file, 'r') as zip_ref:
    zip_ref.extractall('dataset')

print("✅ Dataset ready")

# ===== CELL 3: Prepare Data =====
from tensorflow.keras.preprocessing.image import ImageDataGenerator

IMG_SIZE = 224
BATCH_SIZE = 32

datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    # ... augmentation params
)

train_gen = datagen.flow_from_directory(
    'dataset',
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'
)

val_gen = datagen.flow_from_directory(
    'dataset',
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'
)

# ===== CELL 4: Build Model =====
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models

base = MobileNetV2(input_shape=(IMG_SIZE, IMG_SIZE, 3),
                   include_top=False, weights='imagenet')
base.trainable = False

model = models.Sequential([
    base,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(4, activation='softmax')
])

model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# ===== CELL 5: Train =====
history = model.fit(
    train_gen,
    epochs=20,
    validation_data=val_gen,
    callbacks=[...]
)

# ===== CELL 6: Convert & Download =====
import tensorflowjs as tfjs
tfjs.converters.save_keras_model(model, 'tfjs_model')

!zip -r tfjs_model.zip tfjs_model/
files.download('tfjs_model.zip')

print("✅ Complete!")
```

---

## 8. Kết Luận

### Summary

**Google Colab là lựa chọn TỐT NHẤT cho:**
- ✅ Training anti-cheat models (computer vision)
- ✅ CAT calibration với dataset lớn
- ✅ Free GPU → Nhanh hơn 5-10x so với MacBook
- ✅ Không cần cài đặt, truy cập mọi lúc

**Workflow:**
```
1. Chuẩn bị data trên máy local
2. Upload lên Colab (hoặc lưu trong Drive)
3. Enable GPU
4. Train model (20-30 phút)
5. Download results
6. Deploy vào app
```

**Next Steps:**
- [ ] Thực hành với CAT calibration
- [ ] Thử training anti-cheat model
- [ ] Đọc thêm: [TensorFlow.js Integration](./TENSORFLOW_JS.md)

**Happy Training on Colab! ☁️🚀**

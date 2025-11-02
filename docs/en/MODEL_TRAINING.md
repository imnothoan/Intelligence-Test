# AI Models Training and API Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [CAT Algorithm Model](#cat-algorithm-model)
3. [Question Generation Model](#question-generation-model)
4. [Anti-Cheat Model](#anti-cheat-model)
5. [LLM API Integration](#llm-api-integration)

---

## Overview

The Intelligence Test system uses multiple AI models:

| Model | Purpose | Technology | Training Required |
|-------|---------|------------|-------------------|
| CAT Algorithm | Adaptive testing | IRT (Item Response Theory) | Yes - calibrate questions |
| Question Generation | Auto-generate questions | LLM API (GPT, Gemini) | No - use API |
| Essay Grading | Grade essays | LLM API | No - use API |
| Anti-Cheat | Detect cheating | Computer Vision | Yes - train custom model |

---

## CAT Algorithm Model

### Introduction

CAT (Computerized Adaptive Testing) uses **Item Response Theory (IRT)** to adjust question difficulty based on student ability.

### How It Works

**1PL IRT Model (Rasch Model):**
```
P(correct) = 1 / (1 + exp(-(ability - difficulty)))
```

- `ability`: Student ability (θ)
- `difficulty`: Question difficulty (b)

### No Training Required (Built-in)

The system includes CAT algorithm built-in, NO need to train a separate model. Just need to:

**Step 1: Assign difficulty to questions**
- 0.0 - 0.3: Easy
- 0.3 - 0.7: Medium
- 0.7 - 1.0: Hard

**Step 2: System automatically**
- Selects appropriate questions
- Estimates ability
- Adjusts difficulty

### Advanced Calibration (Optional)

To calibrate difficulty MORE ACCURATELY based on real data:

#### Requirements
- Python 3.8+
- At least 100-200 responses per question
- Historical test data

#### Step 1: Prepare Data

Create file `responses.csv`:
```csv
student_id,question_id,correct,time_taken
S001,Q001,1,45
S001,Q002,0,60
S002,Q001,1,50
S002,Q002,1,55
...
```

#### Step 2: Install Python Packages

```bash
pip install numpy scipy pandas scikit-learn
```

#### Step 3: Create Training Script

Create file `train_cat_model.py`:

```python
import pandas as pd
import numpy as np
from scipy.optimize import minimize

def rasch_probability(ability, difficulty):
    """Calculate probability of correct answer using Rasch model"""
    return 1 / (1 + np.exp(-(ability - difficulty)))

def log_likelihood(params, responses):
    """Log-likelihood function for optimization"""
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
    """Calibrate question difficulty from data"""
    # Load data
    df = pd.read_csv(csv_file)
    
    # Map IDs to indices
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

#### Step 4: Run Training

```bash
python train_cat_model.py responses.csv
```

Output: `calibrated_difficulties.csv` with calibrated difficulties.

#### Step 5: Import to System

1. Go to **Question Bank** in the application
2. Import/update questions with new difficulties
3. Or use API/script for bulk update

---

## Question Generation Model

### No Training - Use LLM API

The system uses existing LLMs via API. **NO need to train separate model**.

### Option 1: OpenAI API (Paid, High Quality)

#### Step 1: Get API Key
1. Go to: https://platform.openai.com/signup
2. Create account and verify email
3. Go to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy key (starts with `sk-`)

#### Step 2: Add to .env
```env
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
```

#### Step 3: Use in App
- Go to **Question Bank** → **Generate Question**
- Enter topic and requirements
- System automatically calls OpenAI API

**Cost:**
- GPT-3.5 Turbo: $0.001/1K tokens (~500 questions/$1)
- GPT-4: $0.03/1K tokens (~17 questions/$1)

### Option 2: Google Gemini API (Free, Limited)

#### Step 1: Get API Key
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Get API key"
3. Select or create Google Cloud project
4. Copy API key

#### Step 2: Install Package
```bash
npm install @google/generative-ai
```

#### Step 3: Create Service Wrapper

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

#### Step 4: Update .env
```env
VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Free Tier Limits:**
- 60 requests/minute
- 1,500 requests/day

### Option 3: Hugging Face (Free, Open-source)

#### Step 1: Get Token
1. Go to: https://huggingface.co/settings/tokens
2. Create new token
3. Copy token

#### Step 2: Install
```bash
npm install @huggingface/inference
```

#### Step 3: Create Service

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

### Option 4: Ollama (Local, Completely Free)

#### Step 1: Install Ollama
```bash
# MacOS/Linux
curl https://ollama.ai/install.sh | sh

# Windows: Download from ollama.ai
```

#### Step 2: Pull Model
```bash
ollama pull llama2
# Or: ollama pull mistral
```

#### Step 3: Start Server
```bash
ollama serve
```

#### Step 4: Use in App

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

**Advantages:**
- Completely free
- No request limits
- Privacy (runs locally)

**Disadvantages:**
- Needs powerful machine (8GB+ RAM)
- Lower quality than GPT-4

---

## Anti-Cheat Model

### Overview

Anti-Cheat model uses Computer Vision to detect:
- No person in front of camera
- Multiple people at once
- Looking elsewhere
- Unusual movement

### Built-in Model (BlazeFace)

System includes **BlazeFace** from TensorFlow.js:
- Detect faces
- Track head position
- No training required

### Training Custom Model (Advanced)

To get more accurate model for specific cases:

#### Requirements
- Python 3.8+
- TensorFlow 2.x
- Webcam for data collection
- GPU recommended (not required)

#### Step 1: Collect Data

Create script `collect_data.py`:

```python
import cv2
import os
from datetime import datetime

def collect_training_data(output_dir, label):
    """Collect training images"""
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

**Run:**
```bash
python collect_data.py
```

Collect:
- 500-1000 images "normal" (looking at screen normally)
- 500-1000 images "cheat" (looking away, multiple people, etc.)

#### Step 2: Prepare Dataset

```python
# prepare_dataset.py
import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split

def load_images(directory, label):
    """Load and label images"""
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
    """Prepare training and validation sets"""
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

#### Step 3: Train Model

```python
# train_anticheat.py
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

def create_model():
    """Create CNN model for anti-cheat"""
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

**Run:**
```bash
pip install tensorflow opencv-python scikit-learn
python prepare_dataset.py
python train_anticheat.py
```

#### Step 4: Convert to TensorFlow.js

```bash
pip install tensorflowjs

tensorflowjs_converter \
  --input_format=keras \
  models/anticheat_final.h5 \
  public/models/anticheat
```

Creates:
- `public/models/anticheat/model.json`
- `public/models/anticheat/group1-shard1of1.bin`

#### Step 5: Integrate to App

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

## LLM API Integration

### Comparison of Options

| Provider | Free | Quality | Speed | Privacy |
|----------|------|---------|-------|---------|
| OpenAI GPT-4 | ❌ ($) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| OpenAI GPT-3.5 | ❌ ($) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Google Gemini | ✅ (limited) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Hugging Face | ✅ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Ollama (Local) | ✅ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |

### Recommendations

**For production (paid):**
- OpenAI GPT-3.5 Turbo: Best price/quality ratio
- OpenAI GPT-4: For high-quality essay grading

**For development/testing (free):**
- Google Gemini: Best among free options
- Ollama: If you have powerful machine and need privacy

**For small schools (low budget):**
- Gemini for question generation
- BlazeFace (built-in) for anti-cheat
- Manual grading for essays

---

## Best Practices

### Question Generation
1. **Review before use**: Always check AI-generated questions
2. **Diverse prompts**: Try different ways of asking
3. **Set low temperature**: 0.3-0.5 for consistent results
4. **Batch generation**: Generate multiple at once to select best

### CAT Algorithm
1. **Start with medium difficulty**: First question should be at 0.5
2. **Minimum 10 questions**: At least 10 for accurate assessment
3. **Balanced question bank**: Enough questions at all levels
4. **Regular calibration**: Update difficulties periodically

### Anti-Cheat
1. **Inform students**: Notify about monitoring beforehand
2. **Test first**: Test system with small group
3. **Adjust sensitivity**: Adjust threshold appropriately
4. **Manual review**: Carefully review warnings

### Cost Optimization
1. **Cache results**: Cache generated questions
2. **Use cheaper models**: GPT-3.5 instead of GPT-4 when possible
3. **Batch requests**: Combine multiple requests
4. **Local models**: Use Ollama for non-critical tasks

---

## Troubleshooting

### LLM API not working
**Check:**
- Is API key correct
- Do you have credit (OpenAI)
- Do you have quota (Gemini)
- Network connection

### Anti-cheat model not accurate
**Solutions:**
- Collect more training data
- Augment data (flip, rotate, brightness)
- Train more epochs
- Adjust threshold

### CAT algorithm not adaptive
**Causes:**
- Not enough questions at various levels
- Difficulty not assigned correctly
- Bug in code

---

## Reference Documentation

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

**Note**: Training models requires machine learning knowledge. If you lack experience, we recommend using existing models and APIs.

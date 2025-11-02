#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TRAINING ANTI-CHEAT MODEL
==========================

Script này training model CNN để phát hiện hành vi gian lận từ webcam.

YÊU CẦU:
- Python 3.8+
- Dữ liệu đã thu thập (từ collect_anticheat_data.py)
- Packages: tensorflow, opencv-python, numpy, scikit-learn

CÀI ĐẶT:
    pip install tensorflow opencv-python numpy scikit-learn matplotlib

SỬ DỤNG:
    python train_anticheat_model.py

KẾT QUẢ:
- Model: models/anticheat_model.h5
- TensorFlow.js: models/anticheat_tfjs/
"""

import os
import sys
import cv2
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle
import matplotlib.pyplot as plt


def load_images_from_folder(folder, label, target_size=(224, 224)):
    """
    Load ảnh từ folder và gán label
    
    Args:
        folder (str): Đường dẫn folder
        label (int): Label (0=normal, 1=cheat)
        target_size (tuple): Kích thước ảnh output
    
    Returns:
        images, labels: numpy arrays
    """
    images = []
    labels = []
    
    if not os.path.exists(folder):
        print(f"⚠️ Cảnh báo: Folder không tồn tại: {folder}")
        return np.array([]), np.array([])
    
    files = [f for f in os.listdir(folder) if f.endswith(('.jpg', '.jpeg', '.png'))]
    total = len(files)
    
    print(f"📂 Đang load {total} ảnh từ {folder}...")
    
    for idx, filename in enumerate(files):
        filepath = os.path.join(folder, filename)
        
        try:
            # Đọc ảnh
            img = cv2.imread(filepath)
            if img is None:
                print(f"   ⚠️ Bỏ qua file lỗi: {filename}")
                continue
            
            # Resize
            img = cv2.resize(img, target_size)
            
            # Convert BGR to RGB
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            # Normalize [0, 1]
            img = img.astype(np.float32) / 255.0
            
            images.append(img)
            labels.append(label)
            
            # Progress
            if (idx + 1) % 100 == 0:
                print(f"   ✅ Đã load: {idx + 1}/{total}")
                
        except Exception as e:
            print(f"   ❌ Lỗi khi load {filename}: {e}")
            continue
    
    print(f"✅ Hoàn thành! Load được {len(images)} ảnh\n")
    
    return np.array(images), np.array(labels)


def create_model(input_shape=(224, 224, 3)):
    """
    Tạo CNN model cho anti-cheat detection
    
    Args:
        input_shape (tuple): Shape của input image
    
    Returns:
        model: Keras model
    """
    model = keras.Sequential([
        # Input
        layers.Input(shape=input_shape),
        
        # Block 1
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Block 2
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Block 3
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Classifier
        layers.Flatten(),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(1, activation='sigmoid')  # Binary classification
    ])
    
    return model


def plot_training_history(history, output_path='models/training_history.png'):
    """Vẽ biểu đồ training history"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
    
    # Loss
    ax1.plot(history.history['loss'], label='Training Loss')
    ax1.plot(history.history['val_loss'], label='Validation Loss')
    ax1.set_title('Model Loss')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Loss')
    ax1.legend()
    ax1.grid(True)
    
    # Accuracy
    ax2.plot(history.history['accuracy'], label='Training Accuracy')
    ax2.plot(history.history['val_accuracy'], label='Validation Accuracy')
    ax2.set_title('Model Accuracy')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Accuracy')
    ax2.legend()
    ax2.grid(True)
    
    plt.tight_layout()
    plt.savefig(output_path)
    print(f"📊 Đã lưu biểu đồ: {output_path}")


def main():
    """Hàm chính"""
    print("="*70)
    print("🤖 TRAINING ANTI-CHEAT MODEL")
    print("="*70)
    print()
    
    # Cấu hình
    DATA_DIR = "data/anticheat_training"
    NORMAL_DIR = os.path.join(DATA_DIR, "normal")
    CHEAT_DIR = os.path.join(DATA_DIR, "cheat")
    MODEL_DIR = "models"
    
    # Tạo folder models
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Kiểm tra dữ liệu
    print("🔍 KIỂM TRA DỮ LIỆU...")
    print("-"*70)
    
    if not os.path.exists(NORMAL_DIR) or not os.path.exists(CHEAT_DIR):
        print("❌ Lỗi: Chưa có dữ liệu training!")
        print(f"   Cần có folders:")
        print(f"   - {NORMAL_DIR}")
        print(f"   - {CHEAT_DIR}")
        print()
        print("📝 Chạy script sau để thu thập dữ liệu:")
        print("   python collect_anticheat_data.py")
        sys.exit(1)
    
    normal_count = len([f for f in os.listdir(NORMAL_DIR) if f.endswith(('.jpg', '.jpeg', '.png'))])
    cheat_count = len([f for f in os.listdir(CHEAT_DIR) if f.endswith(('.jpg', '.jpeg', '.png'))])
    
    print(f"✅ Tìm thấy dữ liệu:")
    print(f"   - Normal: {normal_count} ảnh")
    print(f"   - Cheat:  {cheat_count} ảnh")
    print(f"   - Total:  {normal_count + cheat_count} ảnh")
    print()
    
    if normal_count < 100 or cheat_count < 100:
        print("⚠️ Cảnh báo: Dữ liệu ít, model có thể không chính xác!")
        print("   Khuyến nghị: Ít nhất 500 ảnh mỗi loại")
        response = input("   Vẫn muốn tiếp tục? (y/n): ")
        if response.lower() != 'y':
            print("❌ Dừng training.")
            sys.exit(0)
        print()
    
    # Load dữ liệu
    print("📥 LOAD DỮ LIỆU...")
    print("-"*70)
    
    X_normal, y_normal = load_images_from_folder(NORMAL_DIR, label=0)
    X_cheat, y_cheat = load_images_from_folder(CHEAT_DIR, label=1)
    
    # Combine và shuffle
    X = np.concatenate([X_normal, X_cheat])
    y = np.concatenate([y_normal, y_cheat])
    X, y = shuffle(X, y, random_state=42)
    
    print(f"📊 Dataset final:")
    print(f"   - Shape: {X.shape}")
    print(f"   - Normal: {np.sum(y == 0)} samples")
    print(f"   - Cheat:  {np.sum(y == 1)} samples")
    print()
    
    # Split train/val/test
    print("✂️ CHIA DỮ LIỆU...")
    print("-"*70)
    
    # Train 70%, Val 15%, Test 15%
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
    )
    
    print(f"✅ Đã chia:")
    print(f"   - Training:   {len(X_train)} samples ({len(X_train)/len(X)*100:.1f}%)")
    print(f"   - Validation: {len(X_val)} samples ({len(X_val)/len(X)*100:.1f}%)")
    print(f"   - Test:       {len(X_test)} samples ({len(X_test)/len(X)*100:.1f}%)")
    print()
    
    # Tạo model
    print("🏗️ TẠO MODEL...")
    print("-"*70)
    
    model = create_model()
    model.summary()
    print()
    
    # Compile
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='binary_crossentropy',
        metrics=['accuracy', 
                 keras.metrics.Precision(name='precision'),
                 keras.metrics.Recall(name='recall')]
    )
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ModelCheckpoint(
            os.path.join(MODEL_DIR, 'best_model.h5'),
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Training
    print("🎯 BẮT ĐẦU TRAINING...")
    print("-"*70)
    print("⏳ Đợi một lát, quá trình có thể mất 10-30 phút...")
    print()
    
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=50,
        batch_size=32,
        callbacks=callbacks,
        verbose=1
    )
    
    print()
    print("✅ TRAINING HOÀN TẤT!")
    print()
    
    # Evaluate
    print("📊 ĐÁNH GIÁ MODEL...")
    print("-"*70)
    
    train_results = model.evaluate(X_train, y_train, verbose=0)
    val_results = model.evaluate(X_val, y_val, verbose=0)
    test_results = model.evaluate(X_test, y_test, verbose=0)
    
    print(f"📈 Kết quả:")
    print(f"   Training Set:")
    print(f"      Loss:      {train_results[0]:.4f}")
    print(f"      Accuracy:  {train_results[1]:.4f}")
    print(f"      Precision: {train_results[2]:.4f}")
    print(f"      Recall:    {train_results[3]:.4f}")
    print()
    print(f"   Validation Set:")
    print(f"      Loss:      {val_results[0]:.4f}")
    print(f"      Accuracy:  {val_results[1]:.4f}")
    print(f"      Precision: {val_results[2]:.4f}")
    print(f"      Recall:    {val_results[3]:.4f}")
    print()
    print(f"   Test Set:")
    print(f"      Loss:      {test_results[0]:.4f}")
    print(f"      Accuracy:  {test_results[1]:.4f}")
    print(f"      Precision: {test_results[2]:.4f}")
    print(f"      Recall:    {test_results[3]:.4f}")
    print()
    
    # Lưu model
    print("💾 LƯU MODEL...")
    print("-"*70)
    
    model_path = os.path.join(MODEL_DIR, 'anticheat_model.h5')
    model.save(model_path)
    print(f"✅ Đã lưu Keras model: {model_path}")
    
    # Vẽ biểu đồ
    plot_training_history(history, os.path.join(MODEL_DIR, 'training_history.png'))
    
    # Convert sang TensorFlow.js
    print()
    print("🔄 CONVERT SANG TENSORFLOW.JS...")
    print("-"*70)
    
    tfjs_path = os.path.join(MODEL_DIR, 'anticheat_tfjs')
    
    try:
        import tensorflowjs as tfjs
        tfjs.converters.save_keras_model(model, tfjs_path)
        print(f"✅ Đã convert thành công: {tfjs_path}")
        print()
        print(f"📁 Files TensorFlow.js:")
        for file in os.listdir(tfjs_path):
            print(f"   - {file}")
    except ImportError:
        print("⚠️ Chưa cài tensorflowjs!")
        print("   Cài đặt: pip install tensorflowjs")
        print("   Sau đó chạy:")
        print(f"   tensorflowjs_converter --input_format=keras {model_path} {tfjs_path}")
    
    # Hướng dẫn tiếp theo
    print()
    print("="*70)
    print("🎉 HOÀN TẤT!")
    print("="*70)
    print()
    print("📝 BƯỚC TIẾP THEO:")
    print("   1. Copy folder models/anticheat_tfjs/ vào:")
    print("      Intelligence-Test/public/models/anticheat-custom/")
    print()
    print("   2. Update code trong src/services/antiCheatService.ts:")
    print("      const model = await tf.loadLayersModel('/models/anticheat-custom/model.json');")
    print()
    print("   3. Restart app và test!")
    print()
    print("💡 TIP: Test accuracy > 90% là tốt. Nếu thấp hơn, thu thập thêm dữ liệu.")
    print()


if __name__ == '__main__':
    main()

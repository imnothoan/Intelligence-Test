#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
THU THẬP DỮ LIỆU TRAINING CHO ANTI-CHEAT MODEL
================================================

Script này giúp bạn thu thập ảnh từ webcam để training model anti-cheat custom.

YÊU CẦU:
- Python 3.8+
- Webcam
- Packages: opencv-python

CÀI ĐẶT:
    pip install opencv-python numpy

SỬ DỤNG:
    python collect_anticheat_data.py

HƯỚNG DẪN:
1. Chạy script này
2. Chọn loại dữ liệu muốn thu thập (normal hoặc cheat)
3. Nhấn SPACE để chụp ảnh
4. Nhấn Q để kết thúc
5. Lặp lại để thu thập đủ dữ liệu (khuyến nghị 500-1000 ảnh mỗi loại)

LƯU Ý:
- Thu thập ảnh "normal": Ngồi nhìn màn hình bình thường, ít di chuyển
- Thu thập ảnh "cheat": Nhìn đi chỗ khác, nhiều người, rời khỏi camera
"""

import cv2
import os
from datetime import datetime


def collect_images(label, output_dir, target_count=500):
    """
    Thu thập ảnh từ webcam
    
    Args:
        label (str): Loại dữ liệu ('normal' hoặc 'cheat')
        output_dir (str): Thư mục lưu ảnh
        target_count (int): Số lượng ảnh mục tiêu
    """
    # Tạo thư mục nếu chưa có
    os.makedirs(output_dir, exist_ok=True)
    
    # Đếm số ảnh hiện có
    existing_count = len([f for f in os.listdir(output_dir) if f.endswith('.jpg')])
    count = existing_count
    
    # Mở webcam (0 = camera mặc định)
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Lỗi: Không thể mở webcam!")
        print("   Kiểm tra:")
        print("   1. Webcam đã được kết nối chưa?")
        print("   2. Có ứng dụng nào đang dùng webcam không?")
        return
    
    print(f"\n{'='*60}")
    print(f"📸 THU THẬP DỮ LIỆU: {label.upper()}")
    print(f"{'='*60}")
    print(f"📁 Thư mục lưu: {output_dir}")
    print(f"📊 Đã có: {existing_count} ảnh")
    print(f"🎯 Mục tiêu: {target_count} ảnh")
    print(f"")
    print(f"HƯỚNG DẪN:")
    
    if label == 'normal':
        print(f"  ✅ Ngồi nhìn màn hình như đang làm bài thi")
        print(f"  ✅ Giữ đầu ổn định, không di chuyển nhiều")
        print(f"  ✅ Ánh sáng đủ để nhìn rõ khuôn mặt")
    else:
        print(f"  ⚠️ Hành động gian lận:")
        print(f"     - Nhìn sang bên (như đọc tài liệu)")
        print(f"     - Nhìn xuống (như xem điện thoại)")
        print(f"     - Rời khỏi camera")
        print(f"     - Có 2 người cùng ngồi")
    
    print(f"")
    print(f"PHÍM TẮT:")
    print(f"  [SPACE] - Chụp ảnh")
    print(f"  [Q]     - Thoát")
    print(f"{'='*60}\n")
    
    try:
        while True:
            # Đọc frame từ webcam
            ret, frame = cap.read()
            
            if not ret:
                print("❌ Lỗi: Không thể đọc frame từ webcam!")
                break
            
            # Tính phần trăm hoàn thành
            progress = min(100, int((count / target_count) * 100))
            remaining = max(0, target_count - count)
            
            # Vẽ thông tin lên ảnh
            info_text = f"{label.upper()} - {count}/{target_count} ({progress}%)"
            cv2.putText(frame, info_text, 
                       (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 
                       0.8, (0, 255, 0), 2)
            
            # Vẽ hướng dẫn
            cv2.putText(frame, "Press SPACE to capture, Q to quit", 
                       (10, frame.shape[0] - 20), cv2.FONT_HERSHEY_SIMPLEX, 
                       0.6, (255, 255, 255), 2)
            
            # Vẽ progress bar
            bar_width = int((frame.shape[1] - 20) * (count / target_count))
            cv2.rectangle(frame, (10, 60), (bar_width, 80), (0, 255, 0), -1)
            cv2.rectangle(frame, (10, 60), (frame.shape[1] - 10, 80), (255, 255, 255), 2)
            
            # Hiển thị
            cv2.imshow(f'Thu thập dữ liệu - {label}', frame)
            
            # Xử lý phím
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord(' '):  # Space = chụp
                # Tạo tên file với timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
                filename = f"{label}_{timestamp}.jpg"
                filepath = os.path.join(output_dir, filename)
                
                # Lưu ảnh
                cv2.imwrite(filepath, frame)
                count += 1
                
                print(f"✅ [{count:04d}] Đã lưu: {filename} ({remaining-1} còn lại)")
                
                if count >= target_count:
                    print(f"\n🎉 Hoàn thành! Đã thu thập đủ {target_count} ảnh!")
                    break
                    
            elif key == ord('q'):  # Q = thoát
                print(f"\n⏹️  Dừng thu thập. Đã có {count} ảnh.")
                break
    
    except KeyboardInterrupt:
        print(f"\n⏹️  Dừng bởi người dùng. Đã có {count} ảnh.")
    
    finally:
        # Dọn dẹp
        cap.release()
        cv2.destroyAllWindows()
        
        print(f"\n{'='*60}")
        print(f"📊 TỔNG KẾT:")
        print(f"   Đã thu thập: {count} ảnh")
        print(f"   Lưu tại: {output_dir}")
        print(f"{'='*60}\n")


def main():
    """Hàm chính"""
    print("="*60)
    print("🎥 CÔNG CỤ THU THẬP DỮ LIỆU ANTI-CHEAT")
    print("="*60)
    
    # Tạo thư mục data chính
    base_dir = "data/anticheat_training"
    os.makedirs(base_dir, exist_ok=True)
    
    while True:
        print("\nChọn loại dữ liệu muốn thu thập:")
        print("  1. Normal behavior (hành vi bình thường)")
        print("  2. Cheating behavior (hành vi gian lận)")
        print("  3. Thoát")
        
        choice = input("\nLựa chọn (1/2/3): ").strip()
        
        if choice == '1':
            output_dir = os.path.join(base_dir, "normal")
            collect_images('normal', output_dir)
        elif choice == '2':
            output_dir = os.path.join(base_dir, "cheat")
            collect_images('cheat', output_dir)
        elif choice == '3':
            print("👋 Tạm biệt!")
            break
        else:
            print("❌ Lựa chọn không hợp lệ!")
    
    # Hiển thị tổng kết
    normal_dir = os.path.join(base_dir, "normal")
    cheat_dir = os.path.join(base_dir, "cheat")
    
    normal_count = len([f for f in os.listdir(normal_dir) if f.endswith('.jpg')]) if os.path.exists(normal_dir) else 0
    cheat_count = len([f for f in os.listdir(cheat_dir) if f.endswith('.jpg')]) if os.path.exists(cheat_dir) else 0
    
    print("\n" + "="*60)
    print("📊 TỔNG KẾT TOÀN BỘ:")
    print("="*60)
    print(f"  Normal behavior:   {normal_count} ảnh")
    print(f"  Cheating behavior: {cheat_count} ảnh")
    print(f"  Tổng cộng:         {normal_count + cheat_count} ảnh")
    print("="*60)
    
    if normal_count >= 500 and cheat_count >= 500:
        print("\n✅ Đủ dữ liệu để training! Bước tiếp theo:")
        print("   python train_anticheat_model.py")
    else:
        print(f"\n⚠️ Cần thêm dữ liệu:")
        if normal_count < 500:
            print(f"   - Normal: cần thêm {500 - normal_count} ảnh")
        if cheat_count < 500:
            print(f"   - Cheat: cần thêm {500 - cheat_count} ảnh")
    
    print()


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CALIBRATE CAT ALGORITHM - ĐỘ KHÓ CÂU HỎI
==========================================

Script này calibrate độ khó câu hỏi dựa trên dữ liệu thực từ học sinh.

YÊU CẦU:
- Python 3.8+
- File CSV với responses của học sinh
- Packages: pandas, numpy, scipy

CÀI ĐẶT:
    pip install pandas numpy scipy

FORMAT FILE INPUT (responses.csv):
    student_id,question_id,correct
    S001,Q001,1
    S001,Q002,0
    S002,Q001,1
    ...

CÁCH LẤY DỮ LIỆU:
1. Vào Analytics Dashboard trong app
2. Export "Student Responses" dưới dạng CSV
3. Đặt tên file: responses.csv
4. Chạy script này

SỬ DỤNG:
    python calibrate_cat.py responses.csv
"""

import sys
import pandas as pd
import numpy as np
from scipy.optimize import minimize
import warnings
warnings.filterwarnings('ignore')


def simple_calibration(df):
    """
    Calibration đơn giản: difficulty = 1 - tỷ lệ đúng
    
    Phương pháp này không cần training phức tạp, phù hợp cho:
    - Ít dữ liệu (< 100 responses/question)
    - Cần kết quả nhanh
    - Độ chính xác vừa phải
    
    Args:
        df: DataFrame với columns [student_id, question_id, correct]
    
    Returns:
        DataFrame với difficulty cho từng câu hỏi
    """
    print("📊 CALIBRATION ĐƠN GIẢN (Tỷ lệ đúng)")
    print("-"*70)
    
    # Tính tỷ lệ đúng cho mỗi câu hỏi
    question_stats = df.groupby('question_id').agg({
        'correct': ['mean', 'count']
    }).reset_index()
    
    question_stats.columns = ['question_id', 'correct_rate', 'n_attempts']
    
    # Difficulty = 1 - correct_rate
    # Càng nhiều người đúng (correct_rate cao) → difficulty thấp
    question_stats['difficulty'] = 1 - question_stats['correct_rate']
    
    # Normalize về range [0, 1]
    min_diff = question_stats['difficulty'].min()
    max_diff = question_stats['difficulty'].max()
    
    if max_diff > min_diff:
        question_stats['difficulty_normalized'] = (
            (question_stats['difficulty'] - min_diff) / (max_diff - min_diff)
        )
    else:
        question_stats['difficulty_normalized'] = 0.5
    
    # Phân loại
    def classify_difficulty(diff):
        if diff < 0.3:
            return 'Easy'
        elif diff < 0.7:
            return 'Medium'
        else:
            return 'Hard'
    
    question_stats['category'] = question_stats['difficulty_normalized'].apply(classify_difficulty)
    
    return question_stats


def irt_calibration(df):
    """
    Calibration nâng cao: IRT 1PL (Rasch Model)
    
    Phương pháp này chính xác hơn nhưng cần:
    - Nhiều dữ liệu (> 100 responses/question)
    - Thời gian tính toán lâu hơn
    
    Args:
        df: DataFrame với columns [student_id, question_id, correct]
    
    Returns:
        DataFrame với difficulty cho từng câu hỏi
    """
    print("🎯 CALIBRATION NÂNG CAO (IRT 1PL)")
    print("-"*70)
    
    # Map IDs to indices
    students = df['student_id'].unique()
    questions = df['question_id'].unique()
    
    student_map = {s: i for i, s in enumerate(students)}
    question_map = {q: i for i, q in enumerate(questions)}
    
    df['student_idx'] = df['student_id'].map(student_map)
    df['question_idx'] = df['question_id'].map(question_map)
    
    n_students = len(students)
    n_questions = len(questions)
    
    print(f"   Số học sinh:  {n_students}")
    print(f"   Số câu hỏi:   {n_questions}")
    print(f"   Số responses: {len(df)}")
    print()
    
    # Khởi tạo parameters
    # [abilities (students), difficulties (questions)]
    initial_params = np.random.randn(n_students + n_questions) * 0.1
    
    def rasch_probability(ability, difficulty):
        """Xác suất trả lời đúng theo Rasch model"""
        return 1 / (1 + np.exp(-(ability - difficulty)))
    
    def log_likelihood(params):
        """Hàm log-likelihood để tối ưu"""
        abilities = params[:n_students]
        difficulties = params[n_students:]
        
        ll = 0
        for _, row in df.iterrows():
            s_idx = row['student_idx']
            q_idx = row['question_idx']
            correct = row['correct']
            
            prob = rasch_probability(abilities[s_idx], difficulties[q_idx])
            prob = np.clip(prob, 1e-10, 1 - 1e-10)  # Tránh log(0)
            
            ll += correct * np.log(prob) + (1 - correct) * np.log(1 - prob)
        
        return -ll  # Negative vì minimize
    
    # Optimize
    print("⏳ Đang tối ưu parameters...")
    print("   (Có thể mất vài phút...)")
    
    result = minimize(
        log_likelihood,
        initial_params,
        method='L-BFGS-B',
        options={'maxiter': 1000, 'disp': False}
    )
    
    if not result.success:
        print("⚠️ Cảnh báo: Optimization không hội tụ hoàn toàn")
        print(f"   Message: {result.message}")
    
    # Extract parameters
    abilities = result.x[:n_students]
    difficulties = result.x[n_students:]
    
    # Normalize difficulties về [0, 1]
    min_diff = difficulties.min()
    max_diff = difficulties.max()
    
    if max_diff > min_diff:
        normalized_difficulties = (difficulties - min_diff) / (max_diff - min_diff)
    else:
        normalized_difficulties = np.full_like(difficulties, 0.5)
    
    # Tạo DataFrame kết quả
    results = pd.DataFrame({
        'question_id': questions,
        'difficulty_raw': difficulties,
        'difficulty_normalized': normalized_difficulties
    })
    
    # Phân loại
    def classify_difficulty(diff):
        if diff < 0.3:
            return 'Easy'
        elif diff < 0.7:
            return 'Medium'
        else:
            return 'Hard'
    
    results['category'] = results['difficulty_normalized'].apply(classify_difficulty)
    
    # Tính stats
    question_counts = df.groupby('question_id').size().reset_index(name='n_attempts')
    results = results.merge(question_counts, on='question_id')
    
    return results


def main():
    """Hàm chính"""
    print("="*70)
    print("🎯 CALIBRATE CAT ALGORITHM - ĐỘ KHÓ CÂU HỎI")
    print("="*70)
    print()
    
    # Kiểm tra arguments
    if len(sys.argv) < 2:
        print("❌ Lỗi: Thiếu file dữ liệu!")
        print()
        print("Sử dụng:")
        print("   python calibrate_cat.py <file_responses.csv>")
        print()
        print("Ví dụ:")
        print("   python calibrate_cat.py responses.csv")
        print()
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    # Kiểm tra file tồn tại
    try:
        df = pd.read_csv(input_file)
    except FileNotFoundError:
        print(f"❌ Lỗi: Không tìm thấy file: {input_file}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Lỗi khi đọc file: {e}")
        sys.exit(1)
    
    print(f"📂 Đang xử lý file: {input_file}")
    print()
    
    # Kiểm tra columns
    required_columns = ['student_id', 'question_id', 'correct']
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        print(f"❌ Lỗi: File thiếu columns: {missing_columns}")
        print()
        print("File cần có format:")
        print("   student_id,question_id,correct")
        print("   S001,Q001,1")
        print("   S001,Q002,0")
        print("   ...")
        sys.exit(1)
    
    # Stats
    print("📊 THÔNG TIN DỮ LIỆU:")
    print("-"*70)
    print(f"   Tổng responses:  {len(df)}")
    print(f"   Số học sinh:     {df['student_id'].nunique()}")
    print(f"   Số câu hỏi:      {df['question_id'].nunique()}")
    print(f"   Tỷ lệ đúng:      {df['correct'].mean():.2%}")
    print()
    
    # Kiểm tra dữ liệu đủ không
    responses_per_question = len(df) / df['question_id'].nunique()
    
    if responses_per_question < 30:
        print("⚠️ CẢNH BÁO: Dữ liệu ít!")
        print(f"   Trung bình: {responses_per_question:.1f} responses/câu hỏi")
        print("   Khuyến nghị: Ít nhất 50-100 responses/câu hỏi")
        print("   → Sử dụng calibration đơn giản")
        print()
        use_simple = True
    elif responses_per_question < 100:
        print("💡 Gợi ý: Có thể dùng cả 2 phương pháp")
        print(f"   Trung bình: {responses_per_question:.1f} responses/câu hỏi")
        print()
        choice = input("   Chọn phương pháp (1=Đơn giản, 2=IRT nâng cao, 3=Cả hai): ")
        use_simple = choice != '2'
        use_irt = choice in ['2', '3']
    else:
        print("✅ Dữ liệu tốt! Sử dụng IRT nâng cao")
        print(f"   Trung bình: {responses_per_question:.1f} responses/câu hỏi")
        print()
        use_simple = False
        use_irt = True
    
    # Calibrate
    results_list = []
    
    if use_simple or not 'use_irt' in locals():
        print()
        results_simple = simple_calibration(df)
        results_simple.to_csv('difficulties_simple.csv', index=False)
        print(f"✅ Đã lưu: difficulties_simple.csv")
        results_list.append(('Simple', results_simple))
    
    if 'use_irt' in locals() and use_irt:
        print()
        results_irt = irt_calibration(df)
        results_irt.to_csv('difficulties_irt.csv', index=False)
        print(f"✅ Đã lưu: difficulties_irt.csv")
        results_list.append(('IRT', results_irt))
    
    # Hiển thị kết quả
    print()
    print("="*70)
    print("📊 KẾT QUẢ CALIBRATION")
    print("="*70)
    
    for method_name, results in results_list:
        print()
        print(f"📈 Phương pháp: {method_name}")
        print("-"*70)
        
        # Stats
        easy = (results['category'] == 'Easy').sum()
        medium = (results['category'] == 'Medium').sum()
        hard = (results['category'] == 'Hard').sum()
        
        print(f"   Phân bố độ khó:")
        print(f"      Easy:   {easy} câu ({easy/len(results)*100:.1f}%)")
        print(f"      Medium: {medium} câu ({medium/len(results)*100:.1f}%)")
        print(f"      Hard:   {hard} câu ({hard/len(results)*100:.1f}%)")
        print()
        
        # Sample
        print("   Sample (5 câu đầu):")
        display_cols = ['question_id', 'difficulty_normalized', 'category']
        if 'n_attempts' in results.columns:
            display_cols.append('n_attempts')
        print(results[display_cols].head().to_string(index=False))
    
    # Hướng dẫn tiếp theo
    print()
    print("="*70)
    print("📝 BƯỚC TIẾP THEO:")
    print("="*70)
    print()
    print("1. Mở file CSV vừa tạo (difficulties_*.csv)")
    print("2. Vào app → Question Bank")
    print("3. Update độ khó (difficulty_normalized) cho từng câu hỏi")
    print()
    print("💡 TIP:")
    print("   - Easy (0.0-0.3): Câu dễ cho học sinh yếu")
    print("   - Medium (0.3-0.7): Câu trung bình")
    print("   - Hard (0.7-1.0): Câu khó cho học sinh giỏi")
    print()
    print("   Hệ thống CAT sẽ tự động chọn câu phù hợp với từng học sinh!")
    print()


if __name__ == '__main__':
    main()

"""
CAT Algorithm - Question Difficulty Calibration Script
Uses Item Response Theory (IRT) to calibrate question difficulties from student responses
"""

import pandas as pd
import numpy as np
from scipy.optimize import minimize
import argparse
import os

def rasch_probability(ability, difficulty):
    """
    Calculate probability of correct answer using 1PL Rasch model
    
    Args:
        ability: Student ability parameter (theta)
        difficulty: Question difficulty parameter (b)
    
    Returns:
        Probability of correct response (0 to 1)
    """
    return 1 / (1 + np.exp(-(ability - difficulty)))

def log_likelihood(params, responses):
    """
    Log-likelihood function for IRT parameter estimation
    
    Args:
        params: Combined array of [abilities, difficulties]
        responses: DataFrame with student_idx, question_idx, correct columns
    
    Returns:
        Negative log-likelihood (for minimization)
    """
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
        
        # Avoid log(0) errors
        prob = np.clip(prob, 1e-10, 1 - 1e-10)
        
        ll += correct * np.log(prob) + (1 - correct) * np.log(1 - prob)
    
    return -ll  # Negative for minimization

def calibrate_questions(csv_file, output_file='calibrated_difficulties.csv'):
    """
    Calibrate question difficulties from historical response data
    
    Args:
        csv_file: Path to CSV file with columns: student_id, question_id, correct
        output_file: Path for output CSV file
    
    Returns:
        DataFrame with question_id, difficulty, raw_difficulty
    """
    print(f"Loading data from {csv_file}...")
    df = pd.read_csv(csv_file)
    
    # Validate required columns
    required_cols = ['student_id', 'question_id', 'correct']
    if not all(col in df.columns for col in required_cols):
        raise ValueError(f"CSV must contain columns: {required_cols}")
    
    # Convert correct to binary
    df['correct'] = df['correct'].astype(int)
    
    # Map IDs to indices
    students = df['student_id'].unique()
    questions = df['question_id'].unique()
    
    student_map = {s: i for i, s in enumerate(students)}
    question_map = {q: i for i, q in enumerate(questions)}
    
    df['student_idx'] = df['student_id'].map(student_map)
    df['question_idx'] = df['question_id'].map(question_map)
    
    n_students = len(students)
    n_questions = len(questions)
    
    print(f"Students: {n_students}")
    print(f"Questions: {n_questions}")
    print(f"Responses: {len(df)}")
    
    # Check if we have enough data
    responses_per_question = df.groupby('question_id').size()
    min_responses = responses_per_question.min()
    
    # Minimum recommended responses for reliable calibration
    MIN_RECOMMENDED_RESPONSES = 50
    OPTIMAL_RESPONSES = 100
    
    if min_responses < MIN_RECOMMENDED_RESPONSES:
        print(f"WARNING: Minimum responses per question is {min_responses}")
        print(f"Recommend at least {OPTIMAL_RESPONSES}-200 responses per question for accurate calibration")
        print("Results may be unreliable with fewer responses")
    
    # Initial parameters (random small values)
    initial_params = np.random.randn(n_students + n_questions) * 0.1
    
    # Optimize
    print("\nTraining IRT model...")
    print("This may take several minutes...")
    
    result = minimize(
        log_likelihood,
        initial_params,
        args=(df,),
        method='BFGS',
        options={
            'maxiter': 1000,
            'disp': True,
            'gtol': 1e-5
        }
    )
    
    if not result.success:
        print("WARNING: Optimization did not converge fully")
        print(f"Message: {result.message}")
    
    # Extract parameters
    abilities = result.x[:n_students]
    difficulties = result.x[n_students:]
    
    # Normalize difficulties to 0-1 range for use in CAT algorithm
    min_diff = difficulties.min()
    max_diff = difficulties.max()
    
    # Threshold for detecting if difficulties are too similar (lack of variation)
    MIN_DIFFICULTY_RANGE = 0.01
    
    if max_diff - min_diff < MIN_DIFFICULTY_RANGE:
        print("WARNING: Very small range of difficulties detected")
        print("All questions appear to have similar difficulty")
        print("This may indicate insufficient data or homogeneous question set")
        normalized_difficulties = np.full_like(difficulties, 0.5)
    else:
        normalized_difficulties = (difficulties - min_diff) / (max_diff - min_diff)
    
    # Create results dataframe
    results = pd.DataFrame({
        'question_id': questions,
        'difficulty': normalized_difficulties,
        'raw_difficulty': difficulties,
        'responses_count': [len(df[df['question_id'] == q]) for q in questions],
        'correct_rate': [df[df['question_id'] == q]['correct'].mean() for q in questions]
    })
    
    # Sort by difficulty
    results = results.sort_values('difficulty')
    
    # Save results
    results.to_csv(output_file, index=False)
    
    print(f"\n{'='*60}")
    print("Calibration complete!")
    print(f"Results saved to: {output_file}")
    print(f"{'='*60}\n")
    
    # Print summary statistics
    print("Difficulty Distribution:")
    print(f"  Easy (0.0-0.3):   {(normalized_difficulties < 0.3).sum()} questions")
    print(f"  Medium (0.3-0.7): {((normalized_difficulties >= 0.3) & (normalized_difficulties < 0.7)).sum()} questions")
    print(f"  Hard (0.7-1.0):   {(normalized_difficulties >= 0.7).sum()} questions")
    
    print("\nSample results:")
    print(results.head(10).to_string(index=False))
    
    return results

def generate_sample_data(output_file='sample_responses.csv', n_students=50, n_questions=30):
    """
    Generate sample response data for testing
    
    Args:
        output_file: Path for output CSV file
        n_students: Number of students
        n_questions: Number of questions
    """
    print(f"Generating sample data with {n_students} students and {n_questions} questions...")
    
    # Generate random abilities and difficulties
    abilities = np.random.randn(n_students)
    difficulties = np.linspace(-2, 2, n_questions)
    
    responses = []
    
    for s in range(n_students):
        for q in range(n_questions):
            # Rasch model probability
            prob = rasch_probability(abilities[s], difficulties[q])
            correct = int(np.random.random() < prob)
            
            responses.append({
                'student_id': f'S{s+1:03d}',
                'question_id': f'Q{q+1:03d}',
                'correct': correct,
                'time_taken': int(np.random.uniform(30, 180))  # 30-180 seconds
            })
    
    df = pd.DataFrame(responses)
    df.to_csv(output_file, index=False)
    
    print(f"Sample data saved to: {output_file}")
    print(f"Total responses: {len(df)}")
    print(f"Responses per question: {len(df) // n_questions}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Calibrate question difficulties using IRT'
    )
    parser.add_argument(
        'input_file',
        nargs='?',
        help='CSV file with student responses (student_id, question_id, correct)'
    )
    parser.add_argument(
        '--output',
        default='calibrated_difficulties.csv',
        help='Output CSV file (default: calibrated_difficulties.csv)'
    )
    parser.add_argument(
        '--generate-sample',
        action='store_true',
        help='Generate sample data for testing'
    )
    parser.add_argument(
        '--sample-students',
        type=int,
        default=50,
        help='Number of students in sample data (default: 50)'
    )
    parser.add_argument(
        '--sample-questions',
        type=int,
        default=30,
        help='Number of questions in sample data (default: 30)'
    )
    
    args = parser.parse_args()
    
    if args.generate_sample:
        generate_sample_data(
            'sample_responses.csv',
            args.sample_students,
            args.sample_questions
        )
        print("\nNow run: python train_cat_model.py sample_responses.csv")
    elif args.input_file:
        if not os.path.exists(args.input_file):
            print(f"Error: File not found: {args.input_file}")
            exit(1)
        
        results = calibrate_questions(args.input_file, args.output)
        
        print("\n" + "="*60)
        print("Next steps:")
        print("1. Review the calibrated difficulties")
        print("2. Import them into your question bank")
        print("3. Update question difficulty values in the app")
        print("="*60)
    else:
        parser.print_help()
        print("\nExamples:")
        print("  # Generate sample data")
        print("  python train_cat_model.py --generate-sample")
        print()
        print("  # Calibrate from your data")
        print("  python train_cat_model.py responses.csv")
        print()
        print("  # Calibrate with custom output")
        print("  python train_cat_model.py responses.csv --output my_calibration.csv")

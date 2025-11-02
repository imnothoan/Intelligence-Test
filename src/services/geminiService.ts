import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { Question } from '@/types';

/**
 * Gemini AI Service (Google's Free Generative AI)
 * 
 * This service provides free AI capabilities using Google's Gemini API
 * - Free tier: 60 requests/minute, no credit card required
 * - Supports Vietnamese language very well
 * - Perfect for educational applications
 */

// Constants
const PLACEHOLDER_API_KEY = 'your_gemini_api_key_here';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    if (this.apiKey && this.apiKey !== PLACEHOLDER_API_KEY) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  /**
   * Check if Gemini is available
   */
  isAvailable(): boolean {
    return this.model !== null;
  }

  /**
   * Generate questions based on topic and difficulty
   * @param topic The subject/topic for questions
   * @param count Number of questions to generate
   * @param difficulty Difficulty level (0.0 to 1.0)
   * @param type Question type ('multiple-choice' or 'essay')
   * @param language Language for generation ('vi' for Vietnamese, 'en' for English)
   */
  async generateQuestions(
    topic: string,
    count: number = 5,
    difficulty: number = 0.5,
    type: 'multiple-choice' | 'essay' = 'multiple-choice',
    language: 'vi' | 'en' = 'vi'
  ): Promise<Question[]> {
    if (!this.model) {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
    }

    try {
      const prompt = this.buildQuestionGenerationPrompt(topic, count, difficulty, type, language);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseGeneratedQuestions(text, topic, difficulty, type);
    } catch (error) {
      console.error('Error generating questions with Gemini:', error);
      throw error;
    }
  }

  /**
   * Grade an essay using Gemini AI
   * @param question The essay question
   * @param studentAnswer The student's answer
   * @param rubric Optional grading rubric
   * @param maxScore Maximum possible score
   */
  async gradeEssay(
    question: string,
    studentAnswer: string,
    rubric?: string,
    maxScore: number = 100
  ): Promise<{
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    breakdown?: Record<string, number>;
  }> {
    if (!this.model) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const prompt = this.buildEssayGradingPrompt(question, studentAnswer, rubric, maxScore);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseEssayGradingResult(text, maxScore);
    } catch (error) {
      console.error('Error grading essay with Gemini:', error);
      throw error;
    }
  }

  /**
   * Generate feedback for a student's answer
   */
  async generateFeedback(
    question: string,
    studentAnswer: string,
    correctAnswer?: string
  ): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const prompt = `
Bạn là một giáo viên chuyên nghiệp. Hãy đưa ra phản hồi chi tiết cho câu trả lời của học sinh.

Câu hỏi: ${question}

Câu trả lời của học sinh: ${studentAnswer}

${correctAnswer ? `Đáp án đúng: ${correctAnswer}` : ''}

Hãy đưa ra phản hồi:
1. Đánh giá câu trả lời
2. Điểm mạnh (nếu có)
3. Điểm cần cải thiện
4. Gợi ý để học tốt hơn

Phản hồi của bạn:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating feedback with Gemini:', error);
      throw error;
    }
  }

  /**
   * Generate a summary or explanation of a topic
   */
  async generateExplanation(topic: string, level: 'basic' | 'intermediate' | 'advanced' = 'intermediate'): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const levelText = {
        basic: 'cơ bản, dễ hiểu',
        intermediate: 'trung bình',
        advanced: 'nâng cao, chuyên sâu'
      }[level];

      const prompt = `Hãy giải thích về "${topic}" ở mức độ ${levelText}. Sử dụng ví dụ cụ thể và dễ hiểu.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating explanation with Gemini:', error);
      throw error;
    }
  }

  /**
   * Build prompt for question generation
   */
  private buildQuestionGenerationPrompt(
    topic: string,
    count: number,
    difficulty: number,
    type: 'multiple-choice' | 'essay',
    language: 'vi' | 'en'
  ): string {
    const difficultyLabel = difficulty < 0.3 ? 'dễ' : difficulty < 0.7 ? 'trung bình' : 'khó';
    
    if (type === 'multiple-choice') {
      if (language === 'vi') {
        return `Tạo ${count} câu hỏi trắc nghiệm về "${topic}" ở mức độ ${difficultyLabel}.

Yêu cầu:
- Mỗi câu hỏi có 4 đáp án (A, B, C, D)
- Chỉ có 1 đáp án đúng
- Các đáp án phải hợp lý và gây nhầm lẫn
- Đảm bảo chất lượng học thuật

Trả về dưới dạng JSON array với cấu trúc:
[
  {
    "question": "Nội dung câu hỏi",
    "options": ["A) Đáp án A", "B) Đáp án B", "C) Đáp án C", "D) Đáp án D"],
    "correctAnswer": 0,
    "explanation": "Giải thích ngắn gọn"
  }
]

Chỉ trả về JSON, không thêm text khác.`;
      } else {
        return `Generate ${count} multiple-choice questions about "${topic}" at ${difficultyLabel} difficulty level.

Requirements:
- Each question has 4 options (A, B, C, D)
- Only one correct answer
- Distractors should be plausible
- Ensure academic quality

Return as JSON array with structure:
[
  {
    "question": "Question text",
    "options": ["A) Option A", "B) Option B", "C) Option C", "D) Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation"
  }
]

Return only JSON, no additional text.`;
      }
    } else {
      if (language === 'vi') {
        return `Tạo ${count} câu hỏi tự luận về "${topic}" ở mức độ ${difficultyLabel}.

Yêu cầu:
- Câu hỏi mở, yêu cầu phân tích và giải thích
- Liệt kê các điểm chính cần có trong câu trả lời
- Đề xuất tiêu chí chấm điểm

Trả về dưới dạng JSON array với cấu trúc:
[
  {
    "question": "Nội dung câu hỏi tự luận",
    "keyPoints": ["Điểm 1", "Điểm 2", "Điểm 3"],
    "rubric": "Tiêu chí chấm điểm",
    "suggestedLength": "100-200 từ"
  }
]

Chỉ trả về JSON, không thêm text khác.`;
      } else {
        return `Generate ${count} essay questions about "${topic}" at ${difficultyLabel} difficulty level.

Requirements:
- Open-ended questions requiring analysis
- List key points for ideal answers
- Suggest grading rubric

Return as JSON array with structure:
[
  {
    "question": "Essay question text",
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "rubric": "Grading criteria",
    "suggestedLength": "100-200 words"
  }
]

Return only JSON, no additional text.`;
      }
    }
  }

  /**
   * Build prompt for essay grading
   */
  private buildEssayGradingPrompt(
    question: string,
    studentAnswer: string,
    rubric: string | undefined,
    maxScore: number
  ): string {
    return `Bạn là giáo viên chuyên nghiệp đang chấm bài tự luận.

Câu hỏi: "${question}"

Bài làm của học sinh:
"${studentAnswer}"

${rubric ? `Tiêu chí chấm điểm:\n${rubric}` : `
Tiêu chí chấm điểm (${maxScore} điểm):
- Nội dung: 40%
- Cấu trúc và logic: 30%
- Ngữ pháp và chính tả: 20%
- Sáng tạo và độc đáo: 10%
`}

Yêu cầu trả về JSON với cấu trúc:
{
  "score": 85,
  "feedback": "Nhận xét tổng quát về bài làm",
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "improvements": ["Cần cải thiện 1", "Cần cải thiện 2"],
  "breakdown": {
    "content": 35,
    "structure": 28,
    "grammar": 18,
    "creativity": 9
  }
}

Chỉ trả về JSON, không thêm text khác.`;
  }

  /**
   * Parse generated questions from Gemini response
   */
  private parseGeneratedQuestions(
    text: string,
    topic: string,
    difficulty: number,
    type: 'multiple-choice' | 'essay'
  ): Question[] {
    try {
      // Extract JSON from the response (handle markdown code blocks)
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring(7);
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.substring(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.substring(0, jsonText.length - 3);
      }
      
      jsonText = jsonText.trim();
      
      // Try to find JSON array with more precise pattern
      // Look for array that starts with [ and ends with ] at the same nesting level
      const arrayMatch = jsonText.match(/\[\s*\{[\s\S]*?\}\s*\]/);
      if (!arrayMatch) {
        throw new Error('No JSON array found in response');
      }

      const parsed = JSON.parse(arrayMatch[0]);
      
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }

      return parsed.map((q: any, index: number) => {
        if (type === 'multiple-choice') {
          return {
            id: `gemini-mc-${Date.now()}-${index}`,
            type: 'multiple-choice' as const,
            question: q.question,
            options: q.options || [],
            correctAnswer: q.correctAnswer ?? 0,
            difficulty,
            topic,
            points: 10,
          };
        } else {
          return {
            id: `gemini-essay-${Date.now()}-${index}`,
            type: 'essay' as const,
            question: q.question,
            difficulty,
            topic,
            points: 20,
            keyPoints: q.keyPoints,
            rubric: q.rubric,
          };
        }
      });
    } catch (error) {
      console.error('Error parsing generated questions:', error);
      console.log('Raw response:', text);
      throw new Error(`Failed to parse Gemini response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse essay grading result
   */
  private parseEssayGradingResult(
    text: string,
    maxScore: number
  ): {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    breakdown?: Record<string, number>;
  } {
    try {
      // Extract JSON from the response
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring(7);
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.substring(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.substring(0, jsonText.length - 3);
      }
      
      jsonText = jsonText.trim();
      
      // Try to find JSON object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        score: Math.min(parsed.score || 0, maxScore),
        feedback: parsed.feedback || 'No feedback provided',
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || [],
        breakdown: parsed.breakdown,
      };
    } catch (error) {
      console.error('Error parsing essay grading result:', error);
      console.log('Raw response:', text);
      
      // Return default result if parsing fails
      return {
        score: 0,
        feedback: 'Unable to parse grading result. Please check the response format.',
        strengths: [],
        improvements: [],
      };
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

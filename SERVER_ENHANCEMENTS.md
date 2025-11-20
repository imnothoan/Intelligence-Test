# Server Enhancements - PDF Upload Feature

## Overview
Added comprehensive PDF upload functionality to the Intelligence Test Server, allowing teachers to upload PDF documents and automatically generate exam questions from the content using Google Gemini AI.

## New Server Features Implemented

### 1. PDF Service (`src/services/pdfService.ts`)
**Purpose**: Handle PDF file parsing and question generation from PDF content

**Key Methods**:
- `extractText(pdfBuffer)`: Extract text content from PDF files
- `generateQuestionsFromPDF(pdfBuffer, params)`: Generate questions from PDF using Gemini AI
- `validatePDF(file)`: Validate PDF file (type, size constraints)
- `extractMetadata(pdfBuffer)`: Get PDF metadata (pages, title, author)

**Features**:
- Supports PDFs up to 10MB
- Handles long documents (truncates to ~30,000 characters for AI processing)
- Returns structured question data ready for database insertion
- Comprehensive error handling

### 2. Enhanced Gemini Service (`src/services/geminiService.ts`)
**New Method**: `generateQuestionsFromContent(params)`

**Capabilities**:
- Generate questions from custom content (PDF text)
- Context-aware prompts that reference source material
- Support for both multiple-choice and essay questions
- Custom instructions support for specific requirements
- Difficulty level control

**Prompt Engineering**:
- Direct references to document content in generated questions
- Explanations tied to source material
- Vietnamese and English language support

### 3. PDF Controller (`src/controllers/pdfController.ts`)
**Endpoints Implemented**:

#### POST `/api/pdf/generate-questions`
- Upload PDF and generate questions
- Parameters: count, type, difficulty, language, grade_level, subject, customInstructions
- Returns: Array of generated questions with metadata
- Requires: Instructor role authentication

#### POST `/api/pdf/extract-text`
- Upload PDF and extract all text content
- Returns: Extracted text + metadata
- Useful for preview before question generation

#### POST `/api/pdf/metadata`
- Get PDF file metadata without extracting content
- Returns: Pages, file size, title, author, subject

### 4. PDF Routes (`src/routes/pdfRoutes.ts`)
**Configuration**:
- Multer middleware for file uploads (memory storage)
- 10MB file size limit
- PDF-only file type validation
- Authentication and role-based access control
- Integrated with existing auth middleware

### 5. Type Updates (`src/types/index.ts`)
**Extended QuestionGenerationRequest**:
```typescript
interface QuestionGenerationRequest {
  // ... existing fields ...
  custom_content?: string;      // For PDF-based generation
  custom_instructions?: string; // Additional AI instructions
}
```

## Dependencies Added
```json
{
  "pdf-parse": "^1.1.1",      // PDF text extraction
  "multer": "^1.4.5",          // File upload handling
  "@types/multer": "^1.4.12"   // TypeScript types
}
```

## Integration with Main App
Updated `src/app.ts`:
```typescript
import pdfRoutes from './routes/pdfRoutes.js';
app.use(`${apiPrefix}/pdf`, pdfRoutes);
```

## Usage Example

### Frontend Request (JavaScript/TypeScript)
```typescript
const formData = new FormData();
formData.append('pdf', pdfFile);
formData.append('count', '10');
formData.append('type', 'multiple-choice');
formData.append('difficulty', '0.6');
formData.append('language', 'vi');
formData.append('customInstructions', 'Focus on key concepts');

const response = await fetch('http://localhost:3000/api/pdf/generate-questions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

const result = await response.json();
// result.data.questions contains generated questions
```

### Sample Response
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "type": "multiple-choice",
        "question_text": "Theo tài liệu, định nghĩa nào sau đây đúng về...",
        "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
        "correct_answer": 2,
        "difficulty": 0.6,
        "topic": "Content from uploaded document",
        "explanation": "Dựa vào phần... trong tài liệu..."
      }
    ],
    "count": 10,
    "source": "pdf",
    "filename": "chapter_5.pdf"
  }
}
```

## Security Features
- ✅ Authentication required (JWT)
- ✅ Role-based access (instructor only)
- ✅ File type validation (PDF only)
- ✅ File size limits (10MB max)
- ✅ Rate limiting (inherited from app configuration)
- ✅ Input sanitization and validation

## Error Handling
- Invalid file type → 400 Bad Request
- File too large → 400 Bad Request
- Missing file → 400 Bad Request
- PDF parsing error → 500 Internal Server Error
- AI generation error → 500 Internal Server Error
- All errors return structured JSON with descriptive messages

## Performance Considerations
- File stored in memory (not disk) for quick processing
- PDF truncated to 30,000 characters to respect Gemini token limits
- Async processing for non-blocking operations
- Proper error cleanup and memory management

## Testing Recommendations
1. **Unit Tests** (to be added):
   - PDF validation logic
   - Text extraction with various PDF formats
   - Question generation with different parameters

2. **Integration Tests** (to be added):
   - Full upload-to-question workflow
   - Error scenarios (invalid files, network issues)
   - Authentication and authorization

3. **Manual Testing**:
   - Upload educational PDFs (textbooks, lecture notes)
   - Test with different file sizes (small, medium, near-limit)
   - Test with different languages (Vietnamese, English)
   - Verify generated questions reference PDF content accurately

## Future Enhancements
- [ ] Support for batch PDF processing
- [ ] PDF text preprocessing (remove headers/footers, clean formatting)
- [ ] Image/diagram extraction from PDFs
- [ ] OCR support for scanned PDFs
- [ ] Question difficulty analysis based on content complexity
- [ ] Caching frequently used PDFs
- [ ] Background job queue for large PDF processing
- [ ] Export questions directly to question bank

## Client-Side Implementation Needed
To complete this feature, the client application needs:

1. **PDF Upload Component** in teacher dashboard
2. **Progress indicator** during upload and processing
3. **Preview generated questions** before adding to question bank
4. **Edit/modify questions** before final save
5. **Batch save to question bank** functionality

See `CLIENT_PDF_UPLOAD_REQUIREMENTS.md` for detailed implementation guide.

# Client-Side PDF Upload Implementation Guide

## Overview
This document outlines the requirements for implementing PDF upload functionality in the Intelligence Test client application, enabling teachers to upload educational documents and automatically generate exam questions.

## Required UI Components

### 1. PDF Upload Component (`src/components/PDFUploadModal.tsx`)

**Purpose**: Modal dialog for uploading PDFs and configuring question generation

**Features**:
- File drag & drop zone
- File browser button
- PDF file validation (client-side)
- Upload progress indicator
- Configuration form for question generation parameters

**Props Interface**:
```typescript
interface PDFUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsGenerated: (questions: Question[]) => void;
}
```

**Form Fields**:
- File upload (PDF only, max 10MB)
- Question count slider (1-50)
- Question type radio (Multiple-choice / Essay)
- Difficulty slider (0-1, with labels: Easy/Medium/Hard)
- Language select (Vietnamese / English)
- Grade level select (Elementary/Middle/High School/University)
- Subject select (Math/Science/Literature/History/English)
- Custom instructions textarea (optional)

### 2. Question Preview Component (`src/components/QuestionPreviewGrid.tsx`)

**Purpose**: Display and edit generated questions before saving

**Features**:
- Grid/list view of generated questions
- Inline editing capability
- Individual question delete
- Bulk select for saving
- Export to question bank button

**Sample UI Layout**:
```
┌────────────────────────────────────────┐
│  Question 1/10                    [×]  │
│  ─────────────────────────────────────  │
│  Q: What is the main concept...        │
│  A) Option A    B) Option B            │
│  C) Option C    D) Option D ✓          │
│  ─────────────────────────────────────  │
│  Difficulty: ███░░ (0.6)               │
│  [Edit] [Delete]                       │
└────────────────────────────────────────┘
```

### 3. Integration in Question Bank Page

**Location**: `src/pages/QuestionBank.tsx`

**Add Button**:
```typescript
<button onClick={() => setShowPDFUpload(true)}>
  <UploadIcon />
  Generate from PDF
</button>
```

**Workflow**:
1. Teacher clicks "Generate from PDF" button
2. PDF Upload Modal opens
3. Teacher uploads PDF and configures settings
4. System shows loading state during AI generation
5. Generated questions appear in Preview Grid
6. Teacher reviews, edits if needed
7. Teacher saves selected questions to question bank

## API Integration

### Service File: `src/services/pdfService.ts`

```typescript
import { apiClient } from './apiClient';
import type { Question } from '@/types';

export interface PDFUploadParams {
  file: File;
  count: number;
  type: 'multiple-choice' | 'essay';
  difficulty: number;
  language: 'vi' | 'en';
  grade_level?: string;
  subject?: string;
  customInstructions?: string;
}

export interface PDFUploadResponse {
  questions: Partial<Question>[];
  count: number;
  source: string;
  filename: string;
}

export const pdfService = {
  /**
   * Upload PDF and generate questions
   */
  async uploadAndGenerateQuestions(params: PDFUploadParams): Promise<PDFUploadResponse> {
    const formData = new FormData();
    formData.append('pdf', params.file);
    formData.append('count', params.count.toString());
    formData.append('type', params.type);
    formData.append('difficulty', params.difficulty.toString());
    formData.append('language', params.language);
    
    if (params.grade_level) formData.append('grade_level', params.grade_level);
    if (params.subject) formData.append('subject', params.subject);
    if (params.customInstructions) formData.append('customInstructions', params.customInstructions);

    const response = await apiClient.post('/pdf/generate-questions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Extract text from PDF for preview
   */
  async extractText(file: File): Promise<{ text: string; metadata: any }> {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await apiClient.post('/pdf/extract-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Get PDF metadata
   */
  async getMetadata(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await apiClient.post('/pdf/metadata', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
};
```

## State Management

### Add to Zustand Store (`src/store/apiStore.ts`)

```typescript
interface PDFState {
  isUploadingPDF: boolean;
  generatedQuestions: Question[];
  pdfUploadError: string | null;
}

const usePDFStore = create<PDFState>((set) => ({
  isUploadingPDF: false,
  generatedQuestions: [],
  pdfUploadError: null,

  uploadPDF: async (params: PDFUploadParams) => {
    set({ isUploadingPDF: true, pdfUploadError: null });
    try {
      const result = await pdfService.uploadAndGenerateQuestions(params);
      set({ 
        generatedQuestions: result.questions,
        isUploadingPDF: false 
      });
      return result;
    } catch (error) {
      set({ 
        pdfUploadError: error.message,
        isUploadingPDF: false 
      });
      throw error;
    }
  },

  clearGeneratedQuestions: () => {
    set({ generatedQuestions: [], pdfUploadError: null });
  }
}));
```

## Error Handling

**Client-Side Validation**:
```typescript
function validatePDFFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Please upload a PDF file' };
  }

  // Check file size (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  // Check if file is empty
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  return { valid: true };
}
```

**Error Display**:
- Show toast notifications for errors
- Display inline error messages in form
- Provide retry option on failure
- Log errors for debugging

## UX Considerations

### Loading States
1. **Upload Phase**: "Uploading PDF..." (progress bar)
2. **Processing Phase**: "Extracting content..." (spinner)
3. **Generation Phase**: "Generating questions with AI..." (animated icon)
4. **Preview Phase**: "Loading preview..." (skeleton loader)

### Success States
- ✅ "PDF uploaded successfully!"
- ✅ "Generated X questions from your document"
- ✅ "Questions saved to question bank"

### User Guidance
- Tooltip explaining PDF requirements
- Example PDFs for testing
- Help text for each configuration option
- Preview of first few lines of extracted text

## Accessibility

- ✅ ARIA labels for all interactive elements
- ✅ Keyboard navigation support
- ✅ Screen reader announcements for status changes
- ✅ Focus management in modals
- ✅ Error messages properly associated with form fields

## Mobile Responsiveness

- Responsive modal sizing
- Touch-friendly buttons and sliders
- Simplified form layout on small screens
- Mobile file picker integration

## Testing Checklist

- [ ] Upload valid PDF (< 10MB)
- [ ] Upload PDF exceeding size limit
- [ ] Upload non-PDF file
- [ ] Generate questions with various settings
- [ ] Edit generated questions
- [ ] Delete individual questions
- [ ] Save questions to question bank
- [ ] Handle API errors gracefully
- [ ] Test with slow network (loading states)
- [ ] Test with Vietnamese and English PDFs
- [ ] Test with different subject materials

## Sample Educational PDFs for Testing

**Recommended Test Files**:
1. Short lecture notes (2-3 pages)
2. Textbook chapter excerpt (5-10 pages)
3. Study guide with bullet points
4. Research paper abstract
5. Educational handout with diagrams

**Create Test PDFs With**:
- Clear section headings
- Numbered concepts
- Examples and explanations
- Vietnamese and English content
- Mixed difficulty levels

## Implementation Priority

### Phase 1 (MVP):
1. ✅ Basic PDF upload component
2. ✅ Question generation API integration
3. ✅ Simple question preview list
4. ✅ Save to question bank

### Phase 2 (Enhanced):
5. ⬜ Drag & drop file upload
6. ⬜ Real-time text extraction preview
7. ⬜ Advanced editing capabilities
8. ⬜ Batch operations

### Phase 3 (Advanced):
9. ⬜ PDF viewer integration
10. ⬜ Highlight source text for each question
11. ⬜ Question quality scoring
12. ⬜ Template saving for repeated uploads

## Performance Optimization

- Lazy load PDF upload component
- Debounce file validation
- Show progress for large uploads
- Cache generated questions temporarily
- Optimize re-renders in preview grid

## Security Considerations

- Client-side file validation before upload
- HTTPS required for file transmission
- JWT token in Authorization header
- No sensitive data in localStorage
- Sanitize file names before display

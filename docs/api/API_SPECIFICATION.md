# Intelligence Test Server - API Specification

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [WebSocket API](#websocket-api)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)

## Overview

The Intelligence Test Server provides a RESTful API and WebSocket connections for the Intelligence Test Platform. It handles:

- User authentication and authorization
- Exam management and delivery
- Class and student management
- Real-time monitoring and anti-cheat detection
- Question bank management
- Analytics and reporting

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

### Response Format
All API responses follow this standard format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Authentication

### Register User
Create a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "student" // or "instructor"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "student",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  }
}
```

### Login
Authenticate a user.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "student"
}
```

**Response**: Same as register response

### Refresh Token
Get a new access token using a refresh token.

**Endpoint**: `POST /auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "expiresIn": 3600
  }
}
```

### Logout
Invalidate tokens.

**Endpoint**: `POST /auth/logout`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

### Get Current User
Get authenticated user information.

**Endpoint**: `GET /auth/me`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## API Endpoints

### Users

#### Get User
**Endpoint**: `GET /users/:userId`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

#### Update User
**Endpoint**: `PUT /users/:userId`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "name": "John Updated",
  "avatar": "base64_image_data"
}
```

#### Get User by Email
**Endpoint**: `GET /users/email/:email`

**Headers**: `Authorization: Bearer {token}`

---

### Exams

#### Create Exam
**Endpoint**: `POST /exams`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "title": "Midterm Math Exam",
  "description": "Covering chapters 1-5",
  "instructorId": "instructor_123",
  "classId": "class_456",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1,
      "difficulty": 0.3,
      "topic": "Basic Math",
      "points": 10
    }
  ],
  "duration": 60,
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T12:00:00Z",
  "isAdaptive": false,
  "antiCheatEnabled": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "exam_789",
    "title": "Midterm Math Exam",
    "createdAt": "2024-01-01T00:00:00Z",
    ...
  }
}
```

#### Get Exam
**Endpoint**: `GET /exams/:examId`

**Headers**: `Authorization: Bearer {token}`

#### Update Exam
**Endpoint**: `PUT /exams/:examId`

**Headers**: `Authorization: Bearer {token}`

**Request Body**: Partial exam object

#### Delete Exam
**Endpoint**: `DELETE /exams/:examId`

**Headers**: `Authorization: Bearer {token}`

#### Get Exams by Instructor
**Endpoint**: `GET /exams/instructor/:instructorId`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Response**:
```json
{
  "success": true,
  "data": {
    "data": [/* exams */],
    "total": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

#### Get Exams by Class
**Endpoint**: `GET /exams/class/:classId`

**Headers**: `Authorization: Bearer {token}`

#### Get Available Exams for Student
**Endpoint**: `GET /exams/student/:studentId/available`

**Headers**: `Authorization: Bearer {token}`

---

### Classes

#### Create Class
**Endpoint**: `POST /classes`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "name": "Math Class 10A",
  "description": "Advanced Mathematics",
  "instructorId": "instructor_123",
  "students": [],
  "exams": []
}
```

#### Get Class
**Endpoint**: `GET /classes/:classId`

**Headers**: `Authorization: Bearer {token}`

#### Update Class
**Endpoint**: `PUT /classes/:classId`

**Headers**: `Authorization: Bearer {token}`

#### Delete Class
**Endpoint**: `DELETE /classes/:classId`

**Headers**: `Authorization: Bearer {token}`

#### Get Classes by Instructor
**Endpoint**: `GET /classes/instructor/:instructorId`

**Headers**: `Authorization: Bearer {token}`

#### Add Student to Class
**Endpoint**: `POST /classes/:classId/students`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "studentId": "student_456"
}
```

#### Remove Student from Class
**Endpoint**: `DELETE /classes/:classId/students/:studentId`

**Headers**: `Authorization: Bearer {token}`

---

### Questions

#### Create Question
**Endpoint**: `POST /questions`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "type": "multiple-choice",
  "question": "What is the capital of Vietnam?",
  "options": ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hue"],
  "correctAnswer": 0,
  "difficulty": 0.3,
  "topic": "Geography",
  "points": 10,
  "gradeLevel": {
    "system": "high-school",
    "grade": 10
  },
  "subject": {
    "main": "Geography"
  },
  "tags": ["Vietnam", "Geography", "Capitals"]
}
```

#### Get Question
**Endpoint**: `GET /questions/:questionId`

**Headers**: `Authorization: Bearer {token}`

#### Update Question
**Endpoint**: `PUT /questions/:questionId`

**Headers**: `Authorization: Bearer {token}`

#### Delete Question
**Endpoint**: `DELETE /questions/:questionId`

**Headers**: `Authorization: Bearer {token}`

#### Search Questions
**Endpoint**: `GET /questions/search`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `topic` (optional): Filter by topic
- `difficulty` (optional): Filter by difficulty (0.0-1.0)
- `type` (optional): Filter by type
- `tags` (optional): Comma-separated tags
- `page` (optional): Page number
- `pageSize` (optional): Items per page

**Response**: Paginated list of questions

---

### Exam Attempts

#### Start Exam Attempt
**Endpoint**: `POST /exams/:examId/attempts`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "attempt_123",
    "examId": "exam_789",
    "studentId": "student_456",
    "answers": {},
    "startTime": "2024-01-15T10:05:00Z",
    "status": "in-progress",
    "warnings": []
  }
}
```

#### Get Exam Attempt
**Endpoint**: `GET /attempts/:attemptId`

**Headers**: `Authorization: Bearer {token}`

#### Update Exam Attempt
**Endpoint**: `PUT /attempts/:attemptId`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "answers": {
    "question_1": "answer_value",
    "question_2": "answer_value"
  }
}
```

#### Submit Exam Attempt
**Endpoint**: `POST /attempts/:attemptId/submit`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "answers": {
    "question_1": "answer_value",
    "question_2": "answer_value"
  }
}
```

**Response**: Complete attempt with score

#### Get Attempts by Exam
**Endpoint**: `GET /exams/:examId/attempts`

**Headers**: `Authorization: Bearer {token}`

#### Get Attempts by Student
**Endpoint**: `GET /students/:studentId/attempts`

**Headers**: `Authorization: Bearer {token}`

---

### Anti-Cheat & Monitoring

#### Report Cheat Warning
**Endpoint**: `POST /attempts/:attemptId/warnings`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "attemptId": "attempt_123",
  "type": "look-away",
  "timestamp": "2024-01-15T10:15:00Z",
  "severity": "medium",
  "snapshot": "base64_image_data"
}
```

#### Get Active Exam Sessions
**Endpoint**: `GET /exams/:examId/sessions/active`

**Headers**: `Authorization: Bearer {token}`

**Response**: List of in-progress attempts

#### Get Flagged Attempts
**Endpoint**: `GET /exams/:examId/attempts/flagged`

**Headers**: `Authorization: Bearer {token}`

---

### Analytics

#### Get Exam Statistics
**Endpoint**: `GET /exams/:examId/statistics`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "data": {
    "examId": "exam_789",
    "totalAttempts": 25,
    "averageScore": 78.5,
    "completionRate": 96.0,
    "averageTime": 45,
    "scoreDistribution": {
      "0-20": 1,
      "21-40": 2,
      "41-60": 5,
      "61-80": 10,
      "81-100": 7
    }
  }
}
```

#### Get Question Analytics
**Endpoint**: `GET /exams/:examId/analytics/questions`

**Headers**: `Authorization: Bearer {token}`

#### Get Student Performance
**Endpoint**: `GET /students/:studentId/performance`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `timeRange` (optional): "7d", "30d", "90d", "all"

---

### Health Check

#### Server Health
**Endpoint**: `GET /health`

**Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:00:00Z",
    "uptime": 86400,
    "version": "1.0.0"
  }
}
```

---

## WebSocket API

### Connection
Connect to WebSocket for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws/monitoring/{examId}');

// Authenticate
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'your_access_token'
  }));
};
```

### Message Types

#### Client → Server

**Exam Progress Update**:
```json
{
  "type": "exam_progress",
  "data": {
    "attemptId": "attempt_123",
    "studentId": "student_456",
    "examId": "exam_789",
    "progress": 50,
    "currentQuestion": 5,
    "timeRemaining": 1800,
    "warnings": 0
  },
  "timestamp": 1642234567000
}
```

**Cheat Warning**:
```json
{
  "type": "cheat_warning",
  "data": {
    "attemptId": "attempt_123",
    "warning": {
      "type": "look-away",
      "severity": "medium",
      "timestamp": "2024-01-15T10:15:00Z",
      "snapshot": "base64_image"
    }
  },
  "timestamp": 1642234567000
}
```

#### Server → Client

**Student Joined**:
```json
{
  "type": "student_joined",
  "data": {
    "studentId": "student_456",
    "examId": "exam_789",
    "timestamp": "2024-01-15T10:05:00Z"
  }
}
```

**Answer Submitted**:
```json
{
  "type": "answer_submitted",
  "data": {
    "attemptId": "attempt_123",
    "questionId": "question_1",
    "timestamp": "2024-01-15T10:10:00Z"
  }
}
```

---

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'instructor' | 'student';
  avatar?: string;
  createdAt: Date;
}
```

### Exam
```typescript
interface Exam {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  classId: string;
  questions: Question[];
  duration: number; // in minutes
  startTime: Date;
  endTime: Date;
  isAdaptive: boolean;
  antiCheatEnabled: boolean;
  createdAt: Date;
}
```

### Question
```typescript
interface Question {
  id: string;
  type: 'multiple-choice' | 'essay' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  difficulty: number; // 0-1 scale
  topic: string;
  points: number;
  tags?: string[];
  createdAt?: Date;
}
```

### ExamAttempt
```typescript
interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  answers: Record<string, string>;
  score?: number;
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'flagged';
  warnings: CheatWarning[];
}
```

### CheatWarning
```typescript
interface CheatWarning {
  id: string;
  attemptId: string;
  type: 'look-away' | 'multiple-faces' | 'no-face' | 'tab-switch';
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  snapshot?: string; // base64 image
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {
    // Additional error information
  }
}
```

### HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

### Common Error Codes
- `AUTH_FAILED`: Authentication failed
- `INVALID_TOKEN`: Token is invalid or expired
- `PERMISSION_DENIED`: User lacks required permissions
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `VALIDATION_ERROR`: Request data validation failed
- `DUPLICATE_RESOURCE`: Resource already exists
- `EXAM_NOT_ACTIVE`: Exam is not currently active
- `ATTEMPT_ALREADY_EXISTS`: User already has an active attempt

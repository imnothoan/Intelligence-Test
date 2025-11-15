# Database Schema - Intelligence Test Server

## Overview

This document describes the complete database schema for the Intelligence Test Platform.

## Supported Databases

- **PostgreSQL** 14+ (Recommended for production)
- **MongoDB** 5+ (Alternative NoSQL option)

---

## PostgreSQL Schema

### 1. Users Table

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('instructor', 'student')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Classes Table

```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    students JSONB DEFAULT '[]'::jsonb,
    exams JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_classes_instructor ON classes(instructor_id);
CREATE INDEX idx_classes_students ON classes USING GIN(students);
CREATE INDEX idx_classes_created_at ON classes(created_at);

-- Updated_at trigger
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Questions Table

```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('multiple-choice', 'essay', 'true-false', 'fill-blank')),
    question TEXT NOT NULL,
    options JSONB,
    correct_answer VARCHAR(255),
    difficulty DECIMAL(3,2) NOT NULL CHECK (difficulty >= 0 AND difficulty <= 1),
    topic VARCHAR(255) NOT NULL,
    points INTEGER NOT NULL CHECK (points > 0),
    grade_level JSONB,
    subject JSONB,
    cognitive_level JSONB,
    tags JSONB DEFAULT '[]'::jsonb,
    source VARCHAR(255),
    explanation TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_questions_topic ON questions(topic);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_tags ON questions USING GIN(tags);
CREATE INDEX idx_questions_created_by ON questions(created_by);
CREATE INDEX idx_questions_created_at ON questions(created_at);

-- Full-text search index
CREATE INDEX idx_questions_fts ON questions USING GIN(to_tsvector('english', question));

-- Updated_at trigger
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4. Exams Table

```sql
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    questions JSONB NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_adaptive BOOLEAN DEFAULT FALSE,
    anti_cheat_enabled BOOLEAN DEFAULT FALSE,
    
    -- Enhanced metadata
    target_audience JSONB,
    syllabus JSONB,
    question_distribution JSONB,
    total_points INTEGER,
    passing_score DECIMAL(5,2),
    allow_review BOOLEAN DEFAULT TRUE,
    shuffle_questions BOOLEAN DEFAULT FALSE,
    shuffle_options BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_dates CHECK (end_time > start_time)
);

-- Indexes
CREATE INDEX idx_exams_instructor ON exams(instructor_id);
CREATE INDEX idx_exams_class ON exams(class_id);
CREATE INDEX idx_exams_dates ON exams(start_time, end_time);
CREATE INDEX idx_exams_is_adaptive ON exams(is_adaptive);
CREATE INDEX idx_exams_created_at ON exams(created_at);

-- Updated_at trigger
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Exam Attempts Table

```sql
CREATE TABLE exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    answers JSONB DEFAULT '{}'::jsonb,
    score DECIMAL(5,2),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed', 'flagged', 'abandoned')),
    warnings JSONB DEFAULT '[]'::jsonb,
    
    -- CAT algorithm state
    cat_state JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Prevent multiple active attempts
    CONSTRAINT unique_active_attempt UNIQUE (exam_id, student_id, status)
);

-- Indexes
CREATE INDEX idx_attempts_exam ON exam_attempts(exam_id);
CREATE INDEX idx_attempts_student ON exam_attempts(student_id);
CREATE INDEX idx_attempts_status ON exam_attempts(status);
CREATE INDEX idx_attempts_created_at ON exam_attempts(created_at);

-- Updated_at trigger
CREATE TRIGGER update_exam_attempts_updated_at BEFORE UPDATE ON exam_attempts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 6. Cheat Warnings Table

```sql
CREATE TABLE cheat_warnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('look-away', 'multiple-faces', 'no-face', 'tab-switch')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    snapshot TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_warnings_attempt ON cheat_warnings(attempt_id);
CREATE INDEX idx_warnings_type ON cheat_warnings(type);
CREATE INDEX idx_warnings_severity ON cheat_warnings(severity);
CREATE INDEX idx_warnings_timestamp ON cheat_warnings(timestamp);
```

### 7. Refresh Tokens Table

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Auto-delete expired tokens (run periodically)
CREATE OR REPLACE FUNCTION delete_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM refresh_tokens WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;
```

---

## MongoDB Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  passwordHash: String,
  name: String,
  role: String (enum: ['instructor', 'student']),
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### classes
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  instructorId: ObjectId (ref: 'users'),
  students: [ObjectId] (ref: 'users'),
  exams: [ObjectId] (ref: 'exams'),
  createdAt: Date,
  updatedAt: Date
}
```

#### questions
```javascript
{
  _id: ObjectId,
  type: String (enum: ['multiple-choice', 'essay', 'true-false', 'fill-blank']),
  question: String,
  options: [String],
  correctAnswer: Mixed,
  difficulty: Number (0-1),
  topic: String,
  points: Number,
  gradeLevel: {
    system: String,
    grade: Number,
    semester: Number
  },
  subject: {
    main: String,
    chapter: String,
    lesson: String,
    topic: String
  },
  cognitiveLevel: {
    level: String,
    vietnameseLabel: String
  },
  tags: [String],
  source: String,
  explanation: String,
  createdBy: ObjectId (ref: 'users'),
  createdAt: Date,
  updatedAt: Date
}
```

#### exams
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  instructorId: ObjectId (ref: 'users'),
  classId: ObjectId (ref: 'classes'),
  questions: [Mixed], // Embedded question objects
  duration: Number,
  startTime: Date,
  endTime: Date,
  isAdaptive: Boolean,
  antiCheatEnabled: Boolean,
  targetAudience: Object,
  syllabus: Object,
  questionDistribution: Object,
  totalPoints: Number,
  passingScore: Number,
  allowReview: Boolean,
  shuffleQuestions: Boolean,
  shuffleOptions: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### examAttempts
```javascript
{
  _id: ObjectId,
  examId: ObjectId (ref: 'exams'),
  studentId: ObjectId (ref: 'users'),
  answers: Object, // Map of questionId -> answer
  score: Number,
  startTime: Date,
  endTime: Date,
  status: String (enum: ['in-progress', 'completed', 'flagged', 'abandoned']),
  warnings: [Object],
  catState: Object,
  createdAt: Date,
  updatedAt: Date
}
```

#### cheatWarnings
```javascript
{
  _id: ObjectId,
  attemptId: ObjectId (ref: 'examAttempts'),
  type: String (enum: ['look-away', 'multiple-faces', 'no-face', 'tab-switch']),
  timestamp: Date,
  severity: String (enum: ['low', 'medium', 'high']),
  snapshot: String,
  metadata: Object,
  createdAt: Date
}
```

#### refreshTokens
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users'),
  token: String (unique),
  expiresAt: Date,
  createdAt: Date,
  revoked: Boolean,
  revokedAt: Date
}
```

---

## Sample Data

### Insert Sample Instructor

```sql
-- PostgreSQL
INSERT INTO users (email, password_hash, name, role) VALUES
('instructor@test.com', '$2b$10$...hashed_password...', 'Test Instructor', 'instructor');

-- MongoDB
db.users.insertOne({
  email: 'instructor@test.com',
  passwordHash: '$2b$10$...hashed_password...',
  name: 'Test Instructor',
  role: 'instructor',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### Insert Sample Student

```sql
-- PostgreSQL
INSERT INTO users (email, password_hash, name, role) VALUES
('student@test.com', '$2b$10$...hashed_password...', 'Test Student', 'student');

-- MongoDB
db.users.insertOne({
  email: 'student@test.com',
  passwordHash: '$2b$10$...hashed_password...',
  name: 'Test Student',
  role: 'student',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

---

## Migration Scripts

### PostgreSQL Migration

Save as `migrations/001_initial_schema.sql`:

```sql
-- Run this file to create the initial database schema
\i migrations/001_initial_schema.sql
```

Or use a migration tool like:
- **node-pg-migrate**
- **Knex.js**
- **TypeORM**
- **Sequelize**

### MongoDB Indexes

```javascript
// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

db.classes.createIndex({ instructorId: 1 });
db.classes.createIndex({ students: 1 });

db.questions.createIndex({ type: 1 });
db.questions.createIndex({ topic: 1 });
db.questions.createIndex({ difficulty: 1 });
db.questions.createIndex({ tags: 1 });
db.questions.createIndex({ question: 'text' }); // Full-text search

db.exams.createIndex({ instructorId: 1 });
db.exams.createIndex({ classId: 1 });
db.exams.createIndex({ startTime: 1, endTime: 1 });

db.examAttempts.createIndex({ examId: 1 });
db.examAttempts.createIndex({ studentId: 1 });
db.examAttempts.createIndex({ status: 1 });
db.examAttempts.createIndex({ examId: 1, studentId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'in-progress' } });

db.cheatWarnings.createIndex({ attemptId: 1 });
db.cheatWarnings.createIndex({ type: 1 });
db.cheatWarnings.createIndex({ severity: 1 });

db.refreshTokens.createIndex({ userId: 1 });
db.refreshTokens.createIndex({ token: 1 }, { unique: true });
db.refreshTokens.createIndex({ expiresAt: 1 });
```

---

## Backup and Restore

### PostgreSQL

```bash
# Backup
pg_dump -U your_db_user intelligence_test > backup.sql

# Restore
psql -U your_db_user intelligence_test < backup.sql
```

### MongoDB

```bash
# Backup
mongodump --db intelligence_test --out ./backup

# Restore
mongorestore --db intelligence_test ./backup/intelligence_test
```

---

## Performance Optimization

### PostgreSQL

1. **Vacuum regularly**:
```sql
VACUUM ANALYZE;
```

2. **Monitor slow queries**:
```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1s
SELECT pg_reload_conf();
```

3. **Add indexes for common queries**

### MongoDB

1. **Use projection** to limit returned fields
2. **Limit result size** with `.limit()`
3. **Use covered queries** when possible
4. **Monitor with**:
```javascript
db.setProfilingLevel(1, { slowms: 100 });
db.system.profile.find().pretty();
```

---

## Security Considerations

1. **Never store plain text passwords** - Always use bcrypt or similar
2. **Use parameterized queries** - Prevent SQL injection
3. **Validate input** - Sanitize all user input
4. **Limit query results** - Prevent memory issues
5. **Use connection pooling** - Better performance and resource management
6. **Regular backups** - Automated daily backups
7. **Monitor database logs** - Watch for suspicious activity

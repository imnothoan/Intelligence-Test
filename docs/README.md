# Intelligence Test Platform - Comprehensive Documentation

## 📚 Available Documentation

This directory contains detailed guides for setting up and using the Intelligence Test Platform.

### Languages / Ngôn ngữ

- **🇬🇧 [English Documentation](./en/)** - Complete guides in English
- **🇻🇳 [Tài liệu Tiếng Việt](./vi/)** - Hướng dẫn đầy đủ bằng tiếng Việt

---

## 📖 Documentation Index

### 1. Firebase Setup / Cài Đặt Firebase

Complete guide to setting up Firebase backend for the platform.

**English:** [docs/en/FIREBASE_SETUP.md](./en/FIREBASE_SETUP.md)  
**Tiếng Việt:** [docs/vi/FIREBASE_SETUP.md](./vi/FIREBASE_SETUP.md)

**Topics covered:**
- Creating Firebase project
- Configuring Authentication, Firestore, and Storage
- Getting and using Firebase JSON configuration
- Setting up security rules
- Testing connection
- Troubleshooting common issues

### 2. Model Training & API Integration / Training Model & Tích Hợp API

Comprehensive guide for training AI models and integrating LLM APIs.

**English:** [docs/en/MODEL_TRAINING.md](./en/MODEL_TRAINING.md)  
**Tiếng Việt:** [docs/vi/MODEL_TRAINING.md](./vi/MODEL_TRAINING.md)

**Topics covered:**

#### CAT Algorithm
- How IRT (Item Response Theory) works
- Question difficulty calibration
- Training scripts and examples

#### Question Generation Models
- OpenAI API integration (GPT-3.5, GPT-4)
- Google Gemini API (free tier)
- Hugging Face models
- Ollama (local, free)
- Cost comparison and recommendations

#### Anti-Cheat Models
- Built-in BlazeFace model
- Training custom computer vision models
- Data collection and preparation
- Model training with TensorFlow
- Converting to TensorFlow.js
- Integration into the platform

#### Essay Grading
- Using LLM APIs for automated grading
- Best practices and prompt engineering

---

## 🚀 Quick Start

### For Vietnamese Users / Người dùng Việt Nam

1. **Cài đặt Firebase:**
   ```bash
   # Đọc hướng dẫn chi tiết
   cat docs/vi/FIREBASE_SETUP.md
   ```

2. **Training và API:**
   ```bash
   # Đọc hướng dẫn training models
   cat docs/vi/MODEL_TRAINING.md
   ```

### For English Users

1. **Setup Firebase:**
   ```bash
   # Read detailed guide
   cat docs/en/FIREBASE_SETUP.md
   ```

2. **Training and APIs:**
   ```bash
   # Read model training guide
   cat docs/en/MODEL_TRAINING.md
   ```

---

## 📁 File Structure

```
docs/
├── README.md                      # This file
├── en/                            # English documentation
│   ├── FIREBASE_SETUP.md         # Firebase setup guide
│   └── MODEL_TRAINING.md         # Model training guide
├── vi/                            # Vietnamese documentation
│   ├── FIREBASE_SETUP.md         # Hướng dẫn cài đặt Firebase
│   └── MODEL_TRAINING.md         # Hướng dẫn training models
└── examples/                      # Example files
    ├── firebase-config.example.ts # Firebase config template
    └── training-scripts/          # Training script examples
```

---

## 🎯 What Each Document Covers

### Firebase Setup Guide

**Target Audience:** All users setting up the platform  
**Difficulty:** Beginner  
**Time Required:** 30-60 minutes

Learn how to:
- ✅ Create a Firebase project from scratch
- ✅ Configure all necessary services
- ✅ Get the Firebase JSON configuration
- ✅ Add configuration to your application
- ✅ Set up security rules for production
- ✅ Test and troubleshoot the connection

### Model Training Guide

**Target Audience:** Advanced users, developers  
**Difficulty:** Intermediate to Advanced  
**Time Required:** Varies by model

Learn how to:
- ✅ Understand different AI models in the system
- ✅ Calibrate CAT algorithm question difficulties
- ✅ Integrate various LLM APIs (OpenAI, Gemini, etc.)
- ✅ Train custom anti-cheat computer vision models
- ✅ Choose the right API/model for your needs
- ✅ Optimize costs and performance

---

## 💡 Key Concepts

### Firebase
- **Free Tier:** Sufficient for small to medium schools
- **Backend Services:** Authentication, Database, Storage
- **Real-time Sync:** Live updates across devices

### CAT Algorithm
- **Adaptive Testing:** Questions adjust to student ability
- **IRT Model:** Item Response Theory based
- **Calibration:** Optional but recommended for accuracy

### LLM APIs
- **OpenAI:** Paid, highest quality
- **Gemini:** Free tier available, good quality
- **Ollama:** Free, local, complete privacy
- **Use Cases:** Question generation, essay grading

### Anti-Cheat
- **Built-in:** BlazeFace face detection
- **Custom Models:** Train for specific scenarios
- **Privacy:** Inform students, follow regulations

---

## 🔗 Additional Resources

### Official Documentation
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [React Documentation](https://react.dev)

### Video Tutorials
Coming soon! Check the main README for updates.

### Community
- [GitHub Issues](https://github.com/imnothoan/Intelligence-Test/issues)
- [Discussions](https://github.com/imnothoan/Intelligence-Test/discussions)

---

## 🤝 Contributing to Documentation

Found an error or want to improve the docs?

1. Fork the repository
2. Edit the relevant markdown file
3. Submit a pull request
4. Follow the existing format and style

### Translation Guidelines

When translating:
- Keep technical terms consistent
- Maintain the same structure and formatting
- Include code examples unchanged
- Test all commands and code snippets

---

## 📞 Support

Need help?

1. **Check documentation first** - Most questions are answered here
2. **Search existing issues** - Someone may have had the same problem
3. **Open a new issue** - Provide details and error messages
4. **In-app User Guide** - Click "User Guide" in the application

---

## 📝 License

This documentation is part of the Intelligence Test Platform project and is licensed under the MIT License.

---

**Last Updated:** November 2025  
**Version:** 2.0  
**Maintainer:** [@imnothoan](https://github.com/imnothoan)

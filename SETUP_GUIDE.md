# LUXEN Smart Business Manager - Complete Setup Guide

## প্রজেক্ট ওভারভিউ

LUXEN Smart Business Manager হল একটি সম্পূর্ণ LED বাল্ব উৎপাদন ব্যবসার জন্য তৈরি করা Progressive Web Application (PWA)। এটি Firebase এবং Python Flask backend ব্যবহার করে তৈরি।

## প্রজেক্ট স্ট্রাকচার

```
LUXEN/
├── luxen_backend/          # Python Flask Backend
│   ├── app/
│   │   ├── models/         # Firestore models
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
│   ├── config/             # Configuration files
│   └── requirements.txt    # Python dependencies
├── luxen_web_app/          # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # State management
│   │   └── services/       # API services
│   └── package.json        # Node.js dependencies
└── SETUP_GUIDE.md         # This file
```

## প্রয়োজনীয় সফটওয়্যার

### 1. Node.js (v16 বা তার উপরে)
```bash
# Windows
# Download from https://nodejs.org/

# macOS
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Python (v3.8 বা তার উপরে)
```bash
# Windows
# Download from https://python.org/

# macOS
brew install python

# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

### 3. Firebase CLI
```bash
npm install -g firebase-tools
```

## Backend Setup (Python Flask)

### 1. Backend ডিরেক্টরিতে যান
```bash
cd luxen_backend
```

### 2. Virtual Environment তৈরি করুন
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Dependencies ইনস্টল করুন
```bash
pip install -r requirements.txt
```

### 4. Environment Variables সেটআপ করুন
```bash
# env.example ফাইল কপি করুন
cp env.example .env

# .env ফাইল এডিট করুন এবং আপনার Firebase credentials যোগ করুন
```

### 5. Firebase Service Account Key যোগ করুন
- Firebase Console থেকে service account key ডাউনলোড করুন
- `serviceAccountKey.json` নামে backend ফোল্ডারে রাখুন

### 6. Backend চালু করুন
```bash
python run.py
```

Backend `http://localhost:5000` এ চালু হবে।

## Frontend Setup (React)

### 1. Frontend ডিরেক্টরিতে যান
```bash
cd luxen_web_app
```

### 2. Dependencies ইনস্টল করুন
```bash
npm install
```

### 3. Environment Variables সেটআপ করুন
```bash
# env.example ফাইল কপি করুন
cp env.example .env

# .env ফাইল এডিট করুন এবং আপনার Firebase credentials যোগ করুন
```

### 4. Frontend চালু করুন
```bash
npm start
```

Frontend `http://localhost:3000` এ চালু হবে।

## Firebase Setup

### 1. Firebase Project তৈরি করুন
1. [Firebase Console](https://console.firebase.google.com/) এ যান
2. "Add project" ক্লিক করুন
3. Project name: `luxen-business-manager`
4. Google Analytics enable করুন

### 2. Authentication সেটআপ করুন
1. Firebase Console > Authentication > Sign-in method
2. Email/Password enable করুন

### 3. Firestore Database সেটআপ করুন
1. Firebase Console > Firestore Database
2. "Create database" ক্লিক করুন
3. Security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Storage সেটআপ করুন
1. Firebase Console > Storage
2. "Get started" ক্লিক করুন
3. Security rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Web App Configuration
1. Firebase Console > Project Settings > General
2. "Add app" > Web app
3. App nickname: `LUXEN Web App`
4. Configuration object কপি করুন

## Deployment Options

### 1. Backend Deployment (Heroku)
```bash
# Heroku CLI ইনস্টল করুন
# https://devcenter.heroku.com/articles/heroku-cli

# Heroku app তৈরি করুন
heroku create luxen-backend

# Environment variables সেট করুন
heroku config:set FLASK_ENV=production
heroku config:set FIREBASE_PROJECT_ID=your-project-id
# ... অন্যান্য environment variables

# Deploy করুন
git add .
git commit -m "Deploy backend"
git push heroku main
```

### 2. Frontend Deployment (Firebase Hosting)
```bash
# Firebase project initialize করুন
firebase init hosting

# Build করুন
npm run build

# Deploy করুন
firebase deploy
```

## Development Commands

### Backend Commands
```bash
# Development server
python run.py

# Production server
gunicorn -w 4 -b 0.0.0.0:5000 run:app

# Install new package
pip install package-name
pip freeze > requirements.txt
```

### Frontend Commands
```bash
# Development server
npm start

# Build for production
npm run build

# Test
npm test

# Install new package
npm install package-name
```

## Troubleshooting

### Common Issues

1. **Firebase Authentication Error**
   - Firebase credentials সঠিকভাবে সেট করা হয়েছে কিনা চেক করুন
   - Service account key file path সঠিক কিনা চেক করুন

2. **CORS Error**
   - Backend CORS configuration চেক করুন
   - Frontend API URL সঠিক কিনা চেক করুন

3. **Module Import Error**
   - Virtual environment activate করা হয়েছে কিনা চেক করুন
   - Dependencies সঠিকভাবে ইনস্টল করা হয়েছে কিনা চেক করুন

4. **Port Already in Use**
   - অন্য port ব্যবহার করুন
   - Running processes kill করুন

### Logs চেক করা
```bash
# Backend logs
tail -f logs/app.log

# Frontend logs
# Browser Developer Tools > Console
```

## Production Checklist

- [ ] Environment variables সেট করা হয়েছে
- [ ] Firebase security rules সেট করা হয়েছে
- [ ] CORS properly configured
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Database indexes created
- [ ] SSL certificates configured
- [ ] Backup strategy implemented

## Support

যদি কোনো সমস্যা হয়, দয়া করে:
1. Error logs চেক করুন
2. Console output দেখুন
3. Network requests verify করুন
4. Firebase Console check করুন

## Features

### Implemented Features
- ✅ User Authentication (Firebase Auth)
- ✅ Production Management
- ✅ Sales Management
- ✅ Expense Tracking
- ✅ Warranty Management
- ✅ Investment Tracking
- ✅ Reports & Analytics
- ✅ AI Chat Assistant
- ✅ Responsive Design
- ✅ Dark/Light Mode
- ✅ Multi-language Support (English/Bangla)

### Future Enhancements
- 📱 Mobile App (React Native)
- 🔔 Push Notifications
- 📊 Advanced Analytics
- 🤖 Machine Learning Predictions
- 💳 Payment Integration
- 📧 Email Notifications
- 🔐 Advanced Security Features

---

**Note**: এই setup guide সম্পূর্ণ প্রজেক্ট চালু করার জন্য প্রয়োজনীয় সব steps রয়েছে। যদি কোনো সমস্যা হয়, দয়া করে error messages এবং logs সহ আমাদের জানান।


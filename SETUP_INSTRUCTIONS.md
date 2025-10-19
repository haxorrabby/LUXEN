# LUXEN Smart Business Manager - Setup Instructions

## Project Overview
LUXEN Smart Business Manager is a comprehensive business management system for LED bulb manufacturing companies. It includes both a React frontend and Python Flask backend with Firebase integration.

## Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- Firebase account
- Git

## Backend Setup (Python Flask)

### 1. Navigate to Backend Directory
```bash
cd luxen_backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Firebase Configuration
1. Go to Firebase Console (https://console.firebase.google.com)
2. Create a new project or use existing
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate new private key and download JSON file
6. Rename the file to `serviceAccountKey.json` and place in `luxen_backend/` directory

### 5. Environment Variables
Create a `.env` file in `luxen_backend/` directory:
```env
FLASK_ENV=development
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json
FIREBASE_PROJECT_ID=your-firebase-project-id
```

### 6. Run Backend Server
```bash
python run.py
```
The backend will run on http://localhost:5000

## Frontend Setup (React)

### 1. Navigate to Frontend Directory
```bash
cd luxen_web_app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration
1. In Firebase Console, go to Project Settings > General
2. Add a web app to your project
3. Copy the Firebase configuration
4. Create a `.env` file in `luxen_web_app/` directory:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 4. Update Firebase Config
Edit `luxen_web_app/src/config/firebase.js` and replace the placeholder values with your actual Firebase configuration.

### 5. Run Frontend Development Server
```bash
npm start
```
The frontend will run on http://localhost:3000

## Features

### 1. Dashboard
- Business overview with key metrics
- Sales, expenses, and profit tracking
- Quick action buttons
- Interactive charts

### 2. Production Management
- Add production batches
- Track production costs
- Monitor batch status
- Production analytics

### 3. Sales Management
- Record sales transactions
- Customer information tracking
- Payment method tracking
- Sales analytics

### 4. Expense Management
- Categorized expense tracking
- Vendor management
- Expense analytics by category
- Monthly expense predictions

### 5. Warranty Management
- Warranty claim tracking
- Customer warranty requests
- Replacement tracking
- Warranty analytics

### 6. Investment Management
- Owner and partner management
- Investment tracking
- Profit sharing calculations
- ROI analysis

### 7. Reports & Analytics
- Comprehensive business reports
- Export functionality (CSV)
- Print reports
- Interactive charts and graphs

### 8. AI Assistant (LUXEN Assistant)
- Chat-based business queries
- Multi-language support (English/Bangla)
- Business data analysis
- Intelligent responses

## Authentication
- Firebase Authentication
- Email/Password login
- User registration
- Protected routes

## Database
- Firebase Firestore
- Real-time data synchronization
- User-specific data isolation
- Automatic data validation

## Deployment

### Frontend Deployment (Firebase Hosting)
```bash
cd luxen_web_app
npm run build
firebase deploy
```

### Backend Deployment (Cloud Run/Railway/Heroku)
1. Update environment variables for production
2. Deploy using your preferred platform
3. Update frontend API_BASE_URL to production URL

## Troubleshooting

### Common Issues:
1. **Firebase Connection Error**: Check service account key and project ID
2. **CORS Error**: Ensure backend CORS is configured for frontend URL
3. **Authentication Error**: Verify Firebase Auth configuration
4. **API Connection Error**: Check if backend is running and accessible

### Development Tips:
1. Use browser developer tools for debugging
2. Check Firebase Console for data
3. Monitor backend logs for errors
4. Test API endpoints with Postman

## Support
For technical support or questions, please check the documentation or contact the development team.

## License
This project is proprietary software for LUXEN business management.

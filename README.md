# LUXEN Smart Business Manager

A comprehensive business management system designed specifically for LED bulb manufacturing companies. This full-stack application provides complete business operations management with AI-powered insights.

## 🚀 Features

### 📊 Dashboard
- Real-time business metrics
- Interactive charts and graphs
- Quick action buttons
- Profit/loss tracking

### 🏭 Production Management
- Production batch tracking
- Cost management
- Inventory monitoring
- Quality control

### 💰 Sales Management
- Sales transaction recording
- Customer management
- Payment tracking
- Revenue analytics

### 💸 Expense Management
- Categorized expense tracking
- Vendor management
- Monthly expense predictions
- Cost analysis

### 🛡️ Warranty Management
- Warranty claim processing
- Customer support tracking
- Replacement management
- Warranty analytics

### 💼 Investment Management
- Owner/partner management
- Investment tracking
- Profit sharing calculations
- ROI analysis

### 📈 Reports & Analytics
- Comprehensive business reports
- Export functionality (CSV)
- Print-ready reports
- Interactive dashboards

### 🤖 AI Assistant (LUXEN Assistant)
- Intelligent business queries
- Multi-language support (English/Bangla)
- Real-time data analysis
- Smart recommendations

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Chart.js** - Data visualization
- **Firebase** - Authentication & Database

### Backend
- **Python 3.8+** - Core language
- **Flask** - Web framework
- **Firebase Admin SDK** - Database operations
- **Scikit-learn** - Machine learning
- **NumPy** - Data processing

### Database
- **Firebase Firestore** - NoSQL database
- **Real-time synchronization**
- **User-specific data isolation**

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- Firebase account
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd LUXEN
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm run install-all

# Or install separately:
# Frontend
cd luxen_web_app && npm install

# Backend
cd luxen_backend && pip install -r requirements.txt
```

### 3. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Download service account key
5. Place `serviceAccountKey.json` in `luxen_backend/` directory

### 4. Environment Configuration

#### Backend (.env in luxen_backend/)
```env
FLASK_ENV=development
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json
FIREBASE_PROJECT_ID=your-firebase-project-id
```

#### Frontend (.env in luxen_web_app/)
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 5. Run the Application

#### Option 1: Run Both Together
```bash
npm run dev
```

#### Option 2: Run Separately
```bash
# Terminal 1 - Backend
npm run start-backend

# Terminal 2 - Frontend
npm run start-frontend
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📱 Usage

### 1. User Registration/Login
- Create an account or login with existing credentials
- Firebase handles authentication securely

### 2. Dashboard Overview
- View business metrics and KPIs
- Access quick actions
- Monitor business performance

### 3. Data Management
- Add production batches
- Record sales transactions
- Track expenses
- Manage warranty claims
- Add business owners/investors

### 4. AI Assistant
- Click the chat icon in the top navigation
- Ask questions about your business
- Get insights in English or Bangla
- Receive data-driven recommendations

### 5. Reports & Analytics
- Generate comprehensive reports
- Export data to CSV
- Print reports
- View interactive charts

## 🔧 Development

### Project Structure
```
LUXEN/
├── luxen_web_app/          # React Frontend
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── pages/         # Page Components
│   │   ├── services/      # API Services
│   │   ├── redux/         # State Management
│   │   └── config/        # Configuration
│   └── public/            # Static Assets
├── luxen_backend/         # Python Backend
│   ├── app/
│   │   ├── routes/        # API Routes
│   │   ├── services/      # Business Logic
│   │   └── models/        # Data Models
│   └── config/            # Configuration
└── docs/                  # Documentation
```

### Available Scripts

#### Root Level
- `npm run install-all` - Install all dependencies
- `npm run dev` - Run both frontend and backend
- `npm run start-backend` - Run backend only
- `npm run start-frontend` - Run frontend only
- `npm run build` - Build for production
- `npm run deploy` - Deploy to Firebase

#### Frontend (luxen_web_app/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run deploy` - Deploy to Firebase

#### Backend (luxen_backend/)
- `python run.py` - Start Flask server
- `pip install -r requirements.txt` - Install dependencies

## 🚀 Deployment

### Frontend Deployment (Firebase Hosting)
```bash
cd luxen_web_app
npm run build
firebase deploy
```

### Backend Deployment
Deploy to your preferred platform:
- **Google Cloud Run**
- **Railway**
- **Heroku**
- **AWS**
- **DigitalOcean**

Update the frontend API_BASE_URL to point to your deployed backend.

## 🔒 Security Features

- Firebase Authentication
- User-specific data isolation
- Secure API endpoints
- Input validation
- CORS protection

## 🌐 Multi-language Support

- English interface
- Bangla (Bengali) interface
- AI Assistant supports both languages
- Dynamic language switching

## 📊 Analytics & Insights

- Real-time business metrics
- Predictive analytics
- Expense forecasting
- Profit/loss analysis
- Owner profit sharing calculations

## 🛠️ Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check service account key
   - Verify project ID
   - Ensure Firestore is enabled

2. **CORS Error**
   - Verify backend CORS configuration
   - Check API_BASE_URL in frontend

3. **Authentication Issues**
   - Check Firebase Auth configuration
   - Verify API keys

4. **API Connection Error**
   - Ensure backend is running
   - Check network connectivity
   - Verify API endpoints

### Debug Mode
- Check browser developer tools
- Monitor backend logs
- Use Firebase Console for data verification

## 📞 Support

For technical support or questions:
- Check the documentation
- Review troubleshooting guide
- Contact development team

## 📄 License

This project is proprietary software for LUXEN business management.

## 🤝 Contributing

This is a proprietary project. For contributions, please contact the development team.

---

**LUXEN Smart Business Manager** - Empowering LED manufacturing businesses with intelligent management solutions.

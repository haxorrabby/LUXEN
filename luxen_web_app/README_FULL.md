# LUXEN Smart Business Manager (React + Python/Flask)

**A complete, free, web-based business management system for LED bulb companies.**

![LUXEN](https://img.shields.io/badge/LUXEN-Smart%20Business%20Manager-6200EE?style=flat-square)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Python](https://img.shields.io/badge/Python-Flask-3776AB?style=flat-square&logo=python)
![Firebase](https://imgshields.io/badge/Firestore-Latest-FFCA28?style=flat-square&logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🎯 Overview

LUXEN Smart Business Manager is a **Progressive Web App (PWA)** built with a **React frontend** and a **Python/Flask backend**. It provides a comprehensive, free, and open-source solution for managing LED bulb manufacturing operations, including production, sales, expenses, warranty, and owner investments.

### Core Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js + Material UI | Responsive, modern UI/UX (PWA) |
| **Backend** | Python + Flask | Business logic, calculations, and AI processing |
| **Database** | Firestore | Real-time NoSQL data storage |
| **Authentication** | Firebase Auth | Secure user login |
| **Cloud Storage** | Google Drive API | File backup and sync |
| **AI Assistant** | Python/Flask Custom Logic | Intelligent, contextual responses in Bangla/English |
| **Hosting** | Firebase Hosting (Frontend), Cloud Run/Render (Backend) | Free, scalable hosting solutions |

## 🚀 Quick Start (Full Stack)

### Prerequisites

- Node.js v16+
- Python 3.11+
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase Project and Google Cloud Project

### Step 1: Clone the Repositories

You will need to set up two separate directories: `luxen_web_app` (Frontend) and `luxen_backend` (Backend).

### Step 2: Backend Setup (`luxen_backend`)

1.  **Install Python Dependencies:**
    ```bash
    cd luxen_backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```
2.  **Configure Environment:**
    - Get your Firebase Service Account Key and save it as `serviceAccountKey.json` in `luxen_backend/`.
    - Copy `.env.example` to `.env` and fill in your details.
3.  **Run Backend:**
    ```bash
    python run.py
    # Backend runs on http://localhost:5000
    ```

### Step 3: Frontend Setup (`luxen_web_app`)

1.  **Install Node Dependencies:**
    ```bash
    cd luxen_web_app
    npm install
    ```
2.  **Configure Environment:**
    - Copy `.env.example` to `.env.local` and fill in your Firebase and Google API keys.
    - **Crucially**, ensure the `API_BASE_URL` in `src/services/ApiService.js` points to your backend:
      ```javascript
      // src/services/ApiService.js
      const API_BASE_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/api' // Points to your local Python backend
        : 'YOUR_DEPLOYED_PYTHON_BACKEND_URL/api';
      ```
3.  **Run Frontend:**
    ```bash
    npm start
    # Frontend runs on http://localhost:3000
    ```

### Step 4: Deployment

1.  **Deploy Backend:** Use the provided `Dockerfile` to deploy `luxen_backend` to a service like Google Cloud Run or Render.
2.  **Deploy Frontend:** Deploy `luxen_web_app` to Firebase Hosting.

For a detailed guide, see the `docs/deployment/SETUP_GUIDE.md` in the `luxen_web_app` directory and the `README.md` in the `luxen_backend` directory.

---

## 📋 Core Modules

The application covers all critical business functions:

| Module | Purpose | Backend Endpoint |
| :--- | :--- | :--- |
| **Dashboard** | Real-time metrics and overview | `/api/business/dashboard-metrics` |
| **Investment** | Owner share calculation | `/api/business/owner-shares` |
| **Expenses** | Expense tracking and prediction | `/api/business/expenses/predict` |
| **AI Chat** | Intelligent business queries | `/api/ai/chat` |
| **Production/Sales/Warranty** | CRUD operations (Direct Firestore) | N/A (Handled by Frontend) |
| **Reports** | Monthly P&L, exports (PDF/XLSX) | `/api/reports/monthly` |

---

## 🤖 LUXEN AI Assistant (Python)

The AI Assistant is powered by the Python backend for robust, contextual responses.

- **Endpoint:** `/api/ai/chat`
- **Logic:** `luxen_backend/app/services/ai_service.py`
- **Functionality:** Answers business questions in both Bangla and English by fetching and analyzing real-time data from Firestore.

---

## 📚 Documentation

- **Frontend Setup:** `luxen_web_app/docs/deployment/SETUP_GUIDE.md`
- **Backend Setup:** `luxen_backend/README.md`
- **Database Schema:** `luxen_web_app/docs/database/FIRESTORE_SCHEMA.md`
- **Seed Data:** `luxen_web_app/docs/database/SEED_DATA.json`

---

## 📄 License

This project is licensed under the MIT License.


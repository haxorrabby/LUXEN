# LUXEN Smart Business Manager - Full Stack Setup Guide (React + Python/Flask)

This guide provides the complete setup instructions for the LUXEN Smart Business Manager, which uses a **React Frontend** and a **Python/Flask Backend** with **Firestore** as the database.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Firebase Configuration](#firebase-configuration)
4. [Python Backend Setup](#python-backend-setup)
5. [React Frontend Setup](#react-frontend-setup)
6. [Deployment](#deployment)

---

## 1. Prerequisites

- **Node.js** (v16 or higher)
- **Python** (3.11 or higher)
- **npm** or **yarn**
- **Git**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **A Firebase Project** (with Firestore and Auth enabled)

---

## 2. Project Structure

The project is split into two main folders:

- **`luxen_web_app`**: Contains the React frontend code (PWA).
- **`luxen_backend`**: Contains the Python/Flask backend code.

---

## 3. Firebase Configuration

### Step 3.1: Set up Firebase Project

1.  Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2.  Enable **Firestore Database** and **Authentication** (Email/Password).
3.  Apply the security rules from `luxen_web_app/firestore.rules`.
4.  Create the indexes from `luxen_web_app/firestore.indexes.json`.

### Step 3.2: Get Service Account Key (For Python Backend)

1.  Go to **Project Settings** → **Service Accounts**.
2.  Click "Generate New Private Key".
3.  Save the downloaded JSON file as **`serviceAccountKey.json`** in the root of the **`luxen_backend`** folder.

### Step 3.3: Get Web API Keys (For React Frontend)

1.  Go to **Project Settings** → **General**.
2.  Under "Your apps," select the Web app.
3.  Copy the configuration object (apiKey, projectId, etc.) for the React setup.

---

## 4. Python Backend Setup (`luxen_backend`)

The backend handles all advanced logic (Owner Shares, Expense Prediction, AI Chat).

### Step 4.1: Installation

```bash
cd luxen_backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 4.2: Environment Configuration

1.  Ensure you have placed **`serviceAccountKey.json`** in the `luxen_backend` root.
2.  Copy `.env.example` to **`.env`** and configure:
    ```
    # .env
    FLASK_ENV=development
    FLASK_HOST=0.0.0.0
    FLASK_PORT=5000
    GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
    # ... fill in other Firebase details if deploying to a non-GCP service
    ```

### Step 4.3: Run Locally

```bash
python run.py
# The backend will start on http://localhost:5000
```

---

## 5. React Frontend Setup (`luxen_web_app`)

The frontend is the PWA interface.

### Step 5.1: Installation

```bash
cd luxen_web_app
npm install
```

### Step 5.2: Environment Configuration

1.  Copy `.env.example` to **`.env.local`** and fill in the Firebase Web API keys (from Step 3.3).
2.  **Crucially, set the backend URL:**
    ```
    # .env.local
    # ... your Firebase keys ...
    
    # Set the URL for the Python Backend API
    REACT_APP_PYTHON_API_URL=http://localhost:5000/api 
    ```
3.  **Update `src/services/ApiService.js`** to use this new environment variable for the `API_BASE_URL`.

### Step 5.3: Run Locally

```bash
npm start
# The frontend will start on http://localhost:3000
```

---

## 6. Deployment

### Step 6.1: Deploy Python Backend (Cloud Run/Render)

The backend must be deployed first to get its public URL.

1.  **Build Docker Image:**
    ```bash
    cd luxen_backend
    docker build -t gcr.io/your-project-id/luxen-backend:latest .
    ```
2.  **Push to Registry:**
    ```bash
    docker push gcr.io/your-project-id/luxen-backend:latest
    ```
3.  **Deploy to Cloud Run:** Deploy the image to Google Cloud Run. **Note:** You will need to pass the contents of your `serviceAccountKey.json` as environment variables (`FIREBASE_PRIVATE_KEY`, etc.) to Cloud Run.
4.  **Get Public URL:** Once deployed, note the public URL (e.g., `https://luxen-backend-xxxxxx-uc.a.run.app`).

### Step 6.2: Deploy React Frontend (Firebase Hosting)

1.  **Update Frontend URL:** In `luxen_web_app/.env.local`, replace the local URL with the deployed backend URL:
    ```
    REACT_APP_PYTHON_API_URL=https://luxen-backend-xxxxxx-uc.a.run.app/api
    ```
2.  **Build React App:**
    ```bash
    cd luxen_web_app
    npm run build
    ```
3.  **Deploy to Firebase Hosting:**
    ```bash
    firebase deploy --only hosting
    ```

Your PWA will now be live on Firebase Hosting, communicating with your Python backend on Cloud Run.

---

## 7. Importing Seed Data

To test with sample data, use the script in the `luxen_web_app` folder:

```bash
# Ensure you are in the luxen_web_app directory
node scripts/importSeedData.js
```
**Note:** This script uses the Firebase Admin SDK, so you must have the `serviceAccountKey.json` and the `firebase-admin` package installed in the `luxen_web_app` directory to run it.

---

## 8. Troubleshooting

- **404/Network Error:** Ensure the `REACT_APP_PYTHON_API_URL` in your frontend is exactly correct and points to the deployed backend's `/api` endpoint.
- **CORS Error:** Double-check that your Python backend's CORS configuration allows requests from your deployed Firebase Hosting URL.
- **AI Chat Error:** Ensure the Python backend is running and the `/api/ai/chat` endpoint is accessible.


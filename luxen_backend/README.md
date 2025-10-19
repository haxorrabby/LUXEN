# LUXEN Smart Business Manager - Python Backend

## 🎯 Overview

This is the Python/Flask backend for the LUXEN Smart Business Manager PWA. It handles all business logic, data processing, and the AI Assistant functionality, utilizing **Firestore** as the primary data source.

### Key Features
- **Business Logic:** Calculates owner profit shares and predicts next month's expenses.
- **AI Assistant:** Provides intelligent, contextual responses in Bangla and English.
- **Data Access:** Securely interacts with Firestore using the Firebase Admin SDK.
- **Deployment Ready:** Includes `requirements.txt` and `Dockerfile` for easy deployment to services like Google Cloud Run, Heroku, or Render.

## 🏗️ Architecture

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Framework** | Flask | Web application framework |
| **Database** | Firestore | Real-time data storage |
| **Data Access** | `firebase-admin` | Secure connection to Firestore |
| **Business Logic** | Python (`scikit-learn`, `numpy`) | Owner shares, expense prediction |
| **AI/NLP** | Python (`re`, custom logic) | LUXEN Assistant response generation |
| **Deployment** | Docker, Gunicorn | Containerization and production serving |

## 🚀 Quick Start (Local Development)

### Prerequisites

- Python 3.11+
- `pip` (Python package installer)
- A Firebase Project with Firestore enabled
- A service account key file (`serviceAccountKey.json`) from your Firebase project.

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url> luxen_backend
cd luxen_backend
```

### Step 2: Set up Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

1.  Obtain your Firebase Service Account Key and save it as `serviceAccountKey.json` in the root of the `luxen_backend` directory.
2.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
3.  Edit the `.env` file and fill in your configuration details. The `GOOGLE_APPLICATION_CREDENTIALS` should point to your service account key file:
    ```
    # .env
    FLASK_ENV=development
    FLASK_HOST=0.0.0.0
    FLASK_PORT=5000
    GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
    # ... other Firebase/Google Drive configs ...
    ```

### Step 4: Run the Application

```bash
python run.py
```

The backend will start on `http://localhost:5000`.

## 🐳 Deployment (Google Cloud Run / Render)

This backend is designed for containerized deployment.

### Step 1: Build the Docker Image

```bash
docker build -t luxen-backend:latest .
```

### Step 2: Run Locally (Docker)

```bash
# Replace with your actual path to serviceAccountKey.json
docker run -p 5000:5000 \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/serviceAccountKey.json \
  -v /path/to/your/serviceAccountKey.json:/app/serviceAccountKey.json \
  luxen-backend:latest
```

### Step 3: Deploy to Cloud Run

1.  Push the image to a container registry (e.g., Google Artifact Registry or Docker Hub).
2.  Deploy the container to Google Cloud Run.
3.  Ensure you set the environment variables from your `.env` file during deployment. For Cloud Run, you should pass the service account key contents as environment variables (`FIREBASE_PRIVATE_KEY`, etc.) instead of mounting the file.

---

## 📞 API Endpoints

All endpoints are prefixed with `/api`.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | GET | Health check. |
| `/api/business/owner-shares` | GET | Calculates and returns owner profit shares. |
| `/api/business/expenses/predict` | GET | Predicts next month's expenses. |
| `/api/business/dashboard-metrics` | GET | Aggregates and returns core business metrics. |
| `/api/ai/chat` | POST | Chat with the LUXEN Assistant. |
| `/api/auth/verify-token` | POST | Placeholder for Firebase token verification. |

---

## 📚 Documentation

- **`app/services/business_service.py`**: Detailed logic for calculations.
- **`app/services/ai_service.py`**: AI Assistant logic and language detection.
- **`app/models/firestore_models.py`**: Data access layer.

---

## 🛠️ Troubleshooting

- **CORS Error:** Ensure the `CORS_ORIGINS` in your Flask app factory includes the URL of your React frontend.
- **Firebase Initialization Error:** Double-check the path to `serviceAccountKey.json` and ensure the file is valid.
- **Dependency Error:** Make sure you have installed all packages from `requirements.txt`.

---

## 📄 License

This project is open-source and available under the MIT License.


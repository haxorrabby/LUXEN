import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Global Firestore client
db = None


def initialize_firebase():
    """Initialize Firebase Admin SDK."""
    global db
    
    if firebase_admin._apps:
        # Firebase already initialized
        db = firestore.client()
        return
    
    # Try to initialize with service account key
    service_account_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    
    if service_account_path and os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    else:
        # Try to initialize with environment variables (for Cloud Run)
        try:
            cred_dict = {
                "type": "service_account",
                "project_id": os.getenv('FIREBASE_PROJECT_ID'),
                "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
                "private_key": os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n'),
                "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
                "client_id": os.getenv('FIREBASE_CLIENT_ID'),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            }
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
        except Exception as e:
            raise Exception(f"Failed to initialize Firebase: {str(e)}")
    
    db = firestore.client()


def get_db():
    """Get Firestore client instance."""
    global db
    if db is None:
        initialize_firebase()
    return db


def get_auth():
    """Get Firebase Auth instance."""
    return auth


from flask import Flask
from flask_cors import CORS
from config.firebase_config import initialize_firebase
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_app(config_name='development'):
    """Application factory function."""
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "http://localhost:5000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize Firebase
    initialize_firebase()
    logger.info("Firebase initialized successfully")
    
    # Register blueprints
    from app.routes import auth_routes, business_routes, report_routes, ai_routes
    
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(business_routes.bp)
    app.register_blueprint(report_routes.bp)
    app.register_blueprint(ai_routes.bp)
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy', 'message': 'LUXEN Backend is running'}, 200
    
    logger.info("Application created successfully")
    return app


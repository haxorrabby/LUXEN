#!/usr/bin/env python3
"""
LUXEN Smart Business Manager - Python Backend
Main entry point for the Flask application.
"""

import os
from dotenv import load_dotenv
from app import create_app
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


def main():
    """Main function to run the Flask app."""
    
    # Create the Flask app
    app = create_app()
    
    # Get configuration
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'production') == 'development'
    
    logger.info(f"Starting LUXEN Backend on {host}:{port}")
    logger.info(f"Debug mode: {debug}")
    
    # Run the app
    app.run(host=host, port=port, debug=debug)


if __name__ == '__main__':
    main()


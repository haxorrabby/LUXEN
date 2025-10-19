from flask import Blueprint, jsonify, request
from app.services.business_service import BusinessService
import logging

logger = logging.getLogger(__name__)

bp = Blueprint('business', __name__, url_prefix='/api/business')
business_service = BusinessService()


@bp.route('/owner-shares', methods=['GET'])
def get_owner_shares():
    """Get owner profit shares calculation."""
    try:
        result = business_service.calculate_owner_shares()
        return jsonify(result), 200 if result.get('success') else 400
    except Exception as e:
        logger.error(f"Error in get_owner_shares: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/expenses/predict', methods=['GET'])
def predict_expenses():
    """Predict next month's expenses."""
    try:
        result = business_service.predict_next_month_expenses()
        return jsonify(result), 200 if result.get('success') else 400
    except Exception as e:
        logger.error(f"Error in predict_expenses: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/dashboard-metrics', methods=['GET'])
def get_dashboard_metrics():
    """Get all dashboard metrics."""
    try:
        result = business_service.get_dashboard_metrics()
        return jsonify(result), 200 if result.get('success') else 400
    except Exception as e:
        logger.error(f"Error in get_dashboard_metrics: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


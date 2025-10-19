from flask import Blueprint, jsonify, request
from app.services.ai_service import AIService
from app.services.business_service import BusinessService
import logging

logger = logging.getLogger(__name__)

bp = Blueprint('ai', __name__, url_prefix='/api/ai')
business_service = BusinessService()


@bp.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint for LUXEN Assistant."""
    try:
        data = request.get_json()
        user_input = data.get('message', '')
        
        if not user_input:
            return jsonify({'success': False, 'error': 'Message is required'}), 400
        
        # Get current business data
        metrics_result = business_service.get_dashboard_metrics()
        if not metrics_result.get('success'):
            return jsonify({'success': False, 'error': 'Failed to fetch business data'}), 500
        
        business_data = metrics_result.get('metrics', {})
        
        # Get owner shares for additional context
        shares_result = business_service.calculate_owner_shares()
        if shares_result.get('success'):
            owners_data = []
            for share in shares_result.get('shares', []):
                owners_data.append({
                    'name': share.get('name'),
                    'investment': share.get('investmentAmount'),
                    'percentage': share.get('ownershipPercentage')
                })
            business_data['owners'] = owners_data
        
        # Generate response
        response = AIService.generate_response(user_input, business_data)
        
        return jsonify({
            'success': True,
            'response': response,
            'language': AIService.detect_language(user_input)
        }), 200
    
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


from app.models.firestore_models import (
    OwnerModel, ProductionModel, SalesModel, 
    ExpenseModel, WarrantyModel
)
import logging
from typing import Dict, Any, List
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class BusinessService:
    """Service for business logic calculations."""
    
    def __init__(self):
        self.owner_model = OwnerModel()
        self.production_model = ProductionModel()
        self.sales_model = SalesModel()
        self.expense_model = ExpenseModel()
        self.warranty_model = WarrantyModel()
    
    def calculate_owner_shares(self) -> Dict[str, Any]:
        """Calculate profit shares for all owners based on investment."""
        try:
            owners = self.owner_model.get_all_owners()
            sales = self.sales_model.get_all_sales()
            production = self.production_model.get_all_batches()
            expenses = self.expense_model.get_all_expenses()
            
            # Calculate totals
            total_sales = sum(s.get('totalAmount', 0) for s in sales)
            total_production = sum(p.get('totalCost', 0) for p in production)
            total_expenses = sum(e.get('amount', 0) for e in expenses)
            
            profit_loss = total_sales - total_production - total_expenses
            total_investment = sum(o.get('investmentAmount', 0) for o in owners)
            
            # Calculate shares
            shares = []
            for owner in owners:
                investment = owner.get('investmentAmount', 0)
                ownership_percentage = (investment / total_investment * 100) if total_investment > 0 else 0
                profit_share = (profit_loss * ownership_percentage / 100)
                
                shares.append({
                    'name': owner.get('name', 'Unknown'),
                    'email': owner.get('email', ''),
                    'investmentAmount': investment,
                    'ownershipPercentage': round(ownership_percentage, 2),
                    'profitShare': round(profit_share, 2),
                    'roi': round((profit_share / investment * 100), 2) if investment > 0 else 0
                })
            
            return {
                'success': True,
                'shares': shares,
                'totalInvestment': total_investment,
                'totalProfitLoss': profit_loss,
                'totalSales': total_sales,
                'totalProduction': total_production,
                'totalExpenses': total_expenses
            }
        except Exception as e:
            logger.error(f"Error calculating owner shares: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def predict_next_month_expenses(self) -> Dict[str, Any]:
        """Predict next month's expenses using linear regression."""
        try:
            expenses = self.expense_model.get_all_expenses()
            
            if not expenses:
                return {
                    'success': True,
                    'historicalData': {},
                    'predictedNextMonth': 0,
                    'confidence': 'Low'
                }
            
            # Group expenses by month
            monthly_totals = {}
            for expense in expenses:
                created_at = expense.get('createdAt')
                if isinstance(created_at, datetime):
                    month_key = created_at.strftime('%Y-%m')
                else:
                    month_key = str(created_at)[:7]
                
                if month_key not in monthly_totals:
                    monthly_totals[month_key] = 0
                monthly_totals[month_key] += expense.get('amount', 0)
            
            sorted_months = sorted(monthly_totals.keys())
            values = [monthly_totals[m] for m in sorted_months]
            n = len(values)
            
            if n < 2:
                # Not enough data for prediction
                return {
                    'success': True,
                    'historicalData': monthly_totals,
                    'predictedNextMonth': values[0] if values else 0,
                    'confidence': 'Low'
                }
            
            # Simple linear regression
            x_values = list(range(1, n + 1))
            sum_x = sum(x_values)
            sum_y = sum(values)
            sum_xy = sum(x * y for x, y in zip(x_values, values))
            sum_x2 = sum(x ** 2 for x in x_values)
            
            # Calculate slope and intercept
            denominator = (n * sum_x2 - sum_x ** 2)
            if denominator == 0:
                slope = 0
            else:
                slope = (n * sum_xy - sum_x * sum_y) / denominator
            
            intercept = (sum_y - slope * sum_x) / n
            
            # Predict for next month
            prediction = intercept + slope * (n + 1)
            prediction = max(0, prediction)  # Ensure non-negative
            
            # Determine confidence
            if n >= 3:
                confidence = 'High'
            elif n == 2:
                confidence = 'Medium'
            else:
                confidence = 'Low'
            
            return {
                'success': True,
                'historicalData': monthly_totals,
                'predictedNextMonth': round(prediction, 2),
                'confidence': confidence,
                'monthsAnalyzed': n
            }
        except Exception as e:
            logger.error(f"Error predicting expenses: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def get_dashboard_metrics(self) -> Dict[str, Any]:
        """Get all dashboard metrics."""
        try:
            sales = self.sales_model.get_all_sales()
            production = self.production_model.get_all_batches()
            expenses = self.expense_model.get_all_expenses()
            warranty = self.warranty_model.get_all_claims()
            
            total_sales = sum(s.get('totalAmount', 0) for s in sales)
            total_production = sum(p.get('totalCost', 0) for p in production)
            total_expenses = sum(e.get('amount', 0) for e in expenses)
            profit_loss = total_sales - total_production - total_expenses
            
            warranty_replaced = sum(1 for w in warranty if w.get('replaced', False))
            warranty_pending = len(warranty) - warranty_replaced
            
            return {
                'success': True,
                'metrics': {
                    'totalSales': total_sales,
                    'totalExpenses': total_expenses,
                    'totalProduction': total_production,
                    'profitLoss': profit_loss,
                    'salesCount': len(sales),
                    'expenseCount': len(expenses),
                    'productionCount': len(production),
                    'warrantyCount': len(warranty),
                    'warrantyReplaced': warranty_replaced,
                    'warrantyPending': warranty_pending
                }
            }
        except Exception as e:
            logger.error(f"Error getting dashboard metrics: {str(e)}")
            return {'success': False, 'error': str(e)}


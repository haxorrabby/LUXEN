import logging
import re
from typing import Dict, Any

logger = logging.getLogger(__name__)


class AIService:
    """Service for AI-powered responses (LUXEN Assistant)."""
    
    @staticmethod
    def detect_language(text: str) -> str:
        """Detect if text is in Bangla or English."""
        # Simple heuristic: check for Bangla Unicode characters
        bangla_pattern = re.compile(r'[\u0980-\u09FF]')
        if bangla_pattern.search(text):
            return 'bn'
        return 'en'
    
    @staticmethod
    def generate_response(user_input: str, business_data: Dict[str, Any]) -> str:
        """Generate a response based on user input and business data."""
        
        input_lower = user_input.lower()
        language = AIService.detect_language(user_input)
        
        # ============================================
        # SALES QUERIES
        # ============================================
        if any(keyword in input_lower for keyword in ['sale', 'বিক্রয়', 'revenue', 'আয়']):
            total_sales = business_data.get('totalSales', 0)
            sales_count = business_data.get('salesCount', 0)
            
            if language == 'bn':
                return f"আপনার মোট বিক্রয় {total_sales:,.0f} টাকা। এ পর্যন্ত {sales_count}টি বিক্রয় লেনদেন রেকর্ড করা হয়েছে।"
            else:
                return f"Your total sales are ৳{total_sales:,.0f}. You have recorded {sales_count} sales transactions so far."
        
        # ============================================
        # PROFIT/LOSS QUERIES
        # ============================================
        if any(keyword in input_lower for keyword in ['profit', 'লাভ', 'loss', 'ক্ষতি']):
            total_sales = business_data.get('totalSales', 0)
            total_expenses = business_data.get('totalExpenses', 0)
            total_production = business_data.get('totalProduction', 0)
            profit_loss = total_sales - total_expenses - total_production
            
            if language == 'bn':
                status = 'লাভ' if profit_loss >= 0 else 'ক্ষতি'
                return f"আপনার ব্যবসায় {status} হয়েছে {abs(profit_loss):,.0f} টাকা। বিক্রয়: {total_sales:,.0f} টাকা, খরচ: {(total_expenses + total_production):,.0f} টাকা।"
            else:
                status = 'profit' if profit_loss >= 0 else 'loss'
                return f"Your business has made a {status} of ৳{abs(profit_loss):,.0f}. Sales: ৳{total_sales:,.0f}, Costs: ৳{(total_expenses + total_production):,.0f}."
        
        # ============================================
        # EXPENSE QUERIES
        # ============================================
        if any(keyword in input_lower for keyword in ['expense', 'খরচ', 'cost']):
            total_expenses = business_data.get('totalExpenses', 0)
            expense_count = business_data.get('expenseCount', 0)
            
            if language == 'bn':
                return f"আপনার মোট খরচ {total_expenses:,.0f} টাকা। এ পর্যন্ত {expense_count}টি খরচ রেকর্ড করা হয়েছে।"
            else:
                return f"Your total expenses are ৳{total_expenses:,.0f}. You have recorded {expense_count} expense entries."
        
        # ============================================
        # PRODUCTION QUERIES
        # ============================================
        if any(keyword in input_lower for keyword in ['production', 'উৎপাদন', 'batch', 'ব্যাচ']):
            total_production = business_data.get('totalProduction', 0)
            production_count = business_data.get('productionCount', 0)
            
            if language == 'bn':
                return f"আপনার মোট উৎপাদন খরচ {total_production:,.0f} টাকা। এ পর্যন্ত {production_count}টি ব্যাচ তৈরি করা হয়েছে।"
            else:
                return f"Your total production cost is ৳{total_production:,.0f}. You have created {production_count} production batches."
        
        # ============================================
        # WARRANTY QUERIES
        # ============================================
        if any(keyword in input_lower for keyword in ['warranty', 'ওয়ারেন্টি', 'claim', 'দাবি']):
            warranty_count = business_data.get('warrantyCount', 0)
            warranty_replaced = business_data.get('warrantyReplaced', 0)
            warranty_pending = warranty_count - warranty_replaced
            
            if language == 'bn':
                return f"মোট ওয়ারেন্টি দাবি: {warranty_count}টি। প্রতিস্থাপিত: {warranty_replaced}টি, অপেক্ষমান: {warranty_pending}টি।"
            else:
                return f"Total warranty claims: {warranty_count}. Replaced: {warranty_replaced}, Pending: {warranty_pending}."
        
        # ============================================
        # OWNER/INVESTMENT QUERIES
        # ============================================
        if any(keyword in input_lower for keyword in ['owner', 'মালিক', 'investment', 'বিনিয়োগ', 'share', 'অংশ']):
            owners = business_data.get('owners', [])
            
            if not owners:
                if language == 'bn':
                    return "এখনও কোনো মালিক যোগ করা হয়নি।"
                else:
                    return "No owners have been added yet."
            
            response = 'মালিক তথ্য:\n' if language == 'bn' else 'Owner Information:\n'
            
            for owner in owners:
                name = owner.get('name', 'Unknown')
                investment = owner.get('investment', 0)
                percentage = owner.get('percentage', 0)
                
                if language == 'bn':
                    response += f"{name}: {investment:,.0f} টাকা ({percentage:.2f}%)\n"
                else:
                    response += f"{name}: ৳{investment:,.0f} ({percentage:.2f}%)\n"
            
            return response
        
        # ============================================
        # GREETING QUERIES
        # ============================================
        if any(keyword in input_lower for keyword in ['hello', 'hi', 'হ্যালো', 'হাই', 'নমস্কার']):
            if language == 'bn':
                return "আপনাকে স্বাগতম! আমি LUXEN সহায়ক। আপনার ব্যবসায়িক প্রশ্নের উত্তর দিতে এখানে আছি। আপনি বিক্রয়, খরচ, লাভ, উৎপাদন বা ওয়ারেন্টি সম্পর্কে জিজ্ঞাসা করতে পারেন।"
            else:
                return "Welcome! I'm LUXEN Assistant. I'm here to help you with your business questions. You can ask me about sales, expenses, profit, production, or warranty."
        
        # ============================================
        # HELP QUERIES
        # ============================================
        if any(keyword in input_lower for keyword in ['help', 'সাহায্য', 'what can', 'কি করতে পারি']):
            if language == 'bn':
                return "আমি আপনাকে এই বিষয়গুলিতে সাহায্য করতে পারি:\n- বিক্রয় এবং আয় সম্পর্কে প্রশ্ন\n- খরচ এবং ব্যয় সম্পর্কে প্রশ্ন\n- লাভ এবং ক্ষতি গণনা\n- উৎপাদন ব্যাচ তথ্য\n- ওয়ারেন্টি দাবি পরিসংখ্যান\n- মালিক এবং বিনিয়োগ তথ্য"
            else:
                return "I can help you with:\n- Sales and revenue questions\n- Expenses and costs\n- Profit and loss calculations\n- Production batch information\n- Warranty claim statistics\n- Owner and investment information"
        
        # ============================================
        # DEFAULT RESPONSE
        # ============================================
        if language == 'bn':
            return "দুঃখিত, আমি এই প্রশ্নটি বুঝতে পারছি না। আপনি বিক্রয়, খরচ, লাভ, উৎপাদন বা ওয়ারেন্টি সম্পর্কে জিজ্ঞাসা করতে পারেন।"
        else:
            return "I didn't understand that question. You can ask me about sales, expenses, profit, production, or warranty."


from config.firebase_config import get_db
from datetime import datetime
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class FirestoreModel:
    """Base Firestore model class."""
    
    def __init__(self, collection_name: str):
        self.collection_name = collection_name
        self.db = get_db()
    
    def add(self, data: Dict[str, Any], doc_id: Optional[str] = None) -> str:
        """Add a document to the collection."""
        try:
            data['createdAt'] = datetime.utcnow()
            if doc_id:
                self.db.collection(self.collection_name).document(doc_id).set(data)
                return doc_id
            else:
                _, doc_ref = self.db.collection(self.collection_name).add(data)
                return doc_ref.id
        except Exception as e:
            logger.error(f"Error adding document to {self.collection_name}: {str(e)}")
            raise
    
    def get(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Get a single document."""
        try:
            doc = self.db.collection(self.collection_name).document(doc_id).get()
            if doc.exists:
                return {**doc.to_dict(), 'id': doc.id}
            return None
        except Exception as e:
            logger.error(f"Error getting document from {self.collection_name}: {str(e)}")
            raise
    
    def get_all(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all documents from the collection."""
        try:
            docs = self.db.collection(self.collection_name).limit(limit).stream()
            return [{**doc.to_dict(), 'id': doc.id} for doc in docs]
        except Exception as e:
            logger.error(f"Error getting documents from {self.collection_name}: {str(e)}")
            raise
    
    def query(self, field: str, operator: str, value: Any) -> List[Dict[str, Any]]:
        """Query documents with a condition."""
        try:
            query = self.db.collection(self.collection_name)
            
            if operator == '==':
                query = query.where(field, '==', value)
            elif operator == '<':
                query = query.where(field, '<', value)
            elif operator == '<=':
                query = query.where(field, '<=', value)
            elif operator == '>':
                query = query.where(field, '>', value)
            elif operator == '>=':
                query = query.where(field, '>=', value)
            elif operator == '!=':
                query = query.where(field, '!=', value)
            
            docs = query.stream()
            return [{**doc.to_dict(), 'id': doc.id} for doc in docs]
        except Exception as e:
            logger.error(f"Error querying {self.collection_name}: {str(e)}")
            raise
    
    def update(self, doc_id: str, data: Dict[str, Any]) -> bool:
        """Update a document."""
        try:
            data['updatedAt'] = datetime.utcnow()
            self.db.collection(self.collection_name).document(doc_id).update(data)
            return True
        except Exception as e:
            logger.error(f"Error updating document in {self.collection_name}: {str(e)}")
            raise
    
    def delete(self, doc_id: str) -> bool:
        """Delete a document."""
        try:
            self.db.collection(self.collection_name).document(doc_id).delete()
            return True
        except Exception as e:
            logger.error(f"Error deleting document from {self.collection_name}: {str(e)}")
            raise


class OwnerModel(FirestoreModel):
    """Owner model for managing owner data."""
    
    def __init__(self):
        super().__init__('owners')
    
    def get_all_owners(self) -> List[Dict[str, Any]]:
        """Get all owners."""
        return self.get_all()


class ProductionModel(FirestoreModel):
    """Production model for managing production batches."""
    
    def __init__(self):
        super().__init__('production')
    
    def get_all_batches(self) -> List[Dict[str, Any]]:
        """Get all production batches."""
        return self.get_all()


class SalesModel(FirestoreModel):
    """Sales model for managing sales transactions."""
    
    def __init__(self):
        super().__init__('sales')
    
    def get_all_sales(self) -> List[Dict[str, Any]]:
        """Get all sales."""
        return self.get_all()


class ExpenseModel(FirestoreModel):
    """Expense model for managing expenses."""
    
    def __init__(self):
        super().__init__('expenses')
    
    def get_all_expenses(self) -> List[Dict[str, Any]]:
        """Get all expenses."""
        return self.get_all()
    
    def get_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get expenses by category."""
        return self.query('category', '==', category)


class WarrantyModel(FirestoreModel):
    """Warranty model for managing warranty claims."""
    
    def __init__(self):
        super().__init__('warranty')
    
    def get_all_claims(self) -> List[Dict[str, Any]]:
        """Get all warranty claims."""
        return self.get_all()


class ReportModel(FirestoreModel):
    """Report model for managing reports."""
    
    def __init__(self):
        super().__init__('reports')
    
    def get_all_reports(self) -> List[Dict[str, Any]]:
        """Get all reports."""
        return self.get_all()


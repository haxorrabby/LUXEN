import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

class ExpenseService {
  static async addExpense(expenseData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...expenseData };
    } catch (error) {
      throw new Error(`Error adding expense: ${error.message}`);
    }
  }

  static async updateExpense(id, expenseData) {
    try {
      const docRef = doc(db, 'expenses', id);
      await updateDoc(docRef, {
        ...expenseData,
        updatedAt: serverTimestamp(),
      });
      return { id, ...expenseData };
    } catch (error) {
      throw new Error(`Error updating expense: ${error.message}`);
    }
  }

  static async deleteExpense(id) {
    try {
      await deleteDoc(doc(db, 'expenses', id));
      return id;
    } catch (error) {
      throw new Error(`Error deleting expense: ${error.message}`);
    }
  }

  static async getUserExpenses(userId) {
    try {
      const q = query(collection(db, 'expenses'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Error fetching expenses: ${error.message}`);
    }
  }

  static async getExpensesByCategory(userId, category) {
    try {
      const q = query(
        collection(db, 'expenses'),
        where('userId', '==', userId),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Error fetching expenses by category: ${error.message}`);
    }
  }

  static async getExpenseReport(userId, startDate, endDate) {
    try {
      const q = query(
        collection(db, 'expenses'),
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );
      const querySnapshot = await getDocs(q);
      const expenses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate totals by category
      const categoryTotals = expenses.reduce((acc, expense) => {
        const category = expense.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
        return acc;
      }, {});

      return {
        expenses,
        categoryTotals,
        totalExpenses: Object.values(categoryTotals).reduce((a, b) => a + b, 0),
      };
    } catch (error) {
      throw new Error(`Error generating expense report: ${error.message}`);
    }
  }
}

export default ExpenseService;
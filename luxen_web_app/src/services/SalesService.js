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

class SalesService {
  static async addSale(saleData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'sales'), {
        ...saleData,
        userId,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...saleData, status: 'pending' };
    } catch (error) {
      throw new Error(`Error adding sale: ${error.message}`);
    }
  }

  static async updateSale(id, saleData) {
    try {
      const docRef = doc(db, 'sales', id);
      await updateDoc(docRef, {
        ...saleData,
        updatedAt: serverTimestamp(),
      });
      return { id, ...saleData };
    } catch (error) {
      throw new Error(`Error updating sale: ${error.message}`);
    }
  }

  static async deleteSale(id) {
    try {
      await deleteDoc(doc(db, 'sales', id));
      return id;
    } catch (error) {
      throw new Error(`Error deleting sale: ${error.message}`);
    }
  }

  static async getUserSales(userId) {
    try {
      const q = query(collection(db, 'sales'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Error fetching sales: ${error.message}`);
    }
  }

  static async generateInvoice(saleId) {
    try {
      const saleDoc = await doc(db, 'sales', saleId);
      // Add invoice generation logic here
      await updateDoc(saleDoc, {
        invoiceGenerated: true,
        updatedAt: serverTimestamp(),
      });
      return { success: true, saleId };
    } catch (error) {
      throw new Error(`Error generating invoice: ${error.message}`);
    }
  }
}

export default SalesService;
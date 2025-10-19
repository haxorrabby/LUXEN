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

class ProductionService {
  static async addProduction(productionData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'production'), {
        ...productionData,
        userId,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...productionData, status: 'pending' };
    } catch (error) {
      throw new Error(`Error adding production: ${error.message}`);
    }
  }

  static async updateProductionStatus(id, status) {
    try {
      const docRef = doc(db, 'production', id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      return { id, status };
    } catch (error) {
      throw new Error(`Error updating production status: ${error.message}`);
    }
  }

  static async deleteProduction(id) {
    try {
      await deleteDoc(doc(db, 'production', id));
      return id;
    } catch (error) {
      throw new Error(`Error deleting production: ${error.message}`);
    }
  }

  static async getUserProductions(userId) {
    try {
      const q = query(collection(db, 'production'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Error fetching productions: ${error.message}`);
    }
  }
}

export default ProductionService;
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

class WarrantyService {
  static async addWarranty(warrantyData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'warranty'), {
        ...warrantyData,
        userId,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...warrantyData, status: 'pending' };
    } catch (error) {
      throw new Error(`Error adding warranty: ${error.message}`);
    }
  }

  static async updateWarrantyStatus(id, status) {
    try {
      const docRef = doc(db, 'warranty', id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      return { id, status };
    } catch (error) {
      throw new Error(`Error updating warranty status: ${error.message}`);
    }
  }

  static async deleteWarranty(id) {
    try {
      await deleteDoc(doc(db, 'warranty', id));
      return id;
    } catch (error) {
      throw new Error(`Error deleting warranty: ${error.message}`);
    }
  }

  static async getUserWarranties(userId) {
    try {
      const q = query(collection(db, 'warranty'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Error fetching warranties: ${error.message}`);
    }
  }

  static async processWarrantyClaim(id, claimData) {
    try {
      const docRef = doc(db, 'warranty', id);
      await updateDoc(docRef, {
        ...claimData,
        status: 'processing',
        updatedAt: serverTimestamp(),
      });
      return { id, ...claimData, status: 'processing' };
    } catch (error) {
      throw new Error(`Error processing warranty claim: ${error.message}`);
    }
  }
}

export default WarrantyService;
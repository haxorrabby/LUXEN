import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Async thunks for fetching data
export const fetchBusinessData = createAsyncThunk(
  'business/fetchBusinessData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getState().auth.user?.uid;
      
      if (!userId) {
        return rejectWithValue('User not authenticated');
      }


      const [owners, productions, sales, expenses, warranties, reports] = await Promise.all([

        getDocs(query(collection(db, 'owners'), where('userId', '==', userId))),
        getDocs(query(collection(db, 'production'), where('userId', '==', userId))),
        getDocs(query(collection(db, 'sales'), where('userId', '==', userId))),
        getDocs(query(collection(db, 'expenses'), where('userId', '==', userId))),
               getDocs(query(collection(db, 'warranty'), where('userId', '==', userId))),

        getDocs(query(collection(db, 'reports'), where('userId', '==', userId))),



        getDocs(collection(db, 'reports')),
      ]);

      const mapDocs = (querySnapshot) => 
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      return {
        owners: mapDocs(owners),
        productions: mapDocs(productions),
        sales: mapDocs(sales),
        expenses: mapDocs(expenses),
        warranties: mapDocs(warranties),
        reports: mapDocs(reports),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Owner management actions
export const addOwner = createAsyncThunk(
  'business/addOwner',
  async (ownerData, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'owners'), {
        ...ownerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...ownerData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOwner = createAsyncThunk(
  'business/updateOwner',
  async ({ id, ownerData }, { rejectWithValue }) => {
    try {
      const ownerRef = doc(db, 'owners', id);
      await updateDoc(ownerRef, {
        ...ownerData,
        updatedAt: serverTimestamp(),
      });
      return { id, ...ownerData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOwner = createAsyncThunk(
  'business/deleteOwner',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'owners', id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add production batch
// Production operations
export const addProduction = createAsyncThunk(
  'business/addProduction',
  async ({ productionData, userId }, { rejectWithValue }) => {
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
      return rejectWithValue(error.message);
    }
  }
);

export const updateProductionStatus = createAsyncThunk(
  'business/updateProductionStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'production', id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduction = createAsyncThunk(
  'business/deleteProduction',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'production', id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Sales operations
export const addSale = createAsyncThunk(
  'business/addSale',
  async ({ saleData, userId }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'sales'), {
        ...saleData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...saleData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSale = createAsyncThunk(
  'business/updateSale',
  async ({ id, saleData }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'sales', id);
      await updateDoc(docRef, {
        ...saleData,
        updatedAt: serverTimestamp(),
      });
      return { id, ...saleData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSale = createAsyncThunk(
  'business/deleteSale',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'sales', id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Expense operations
export const addExpense = createAsyncThunk(
  'business/addExpense',
  async ({ expenseData, userId }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...expenseData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExpense = createAsyncThunk(
  'business/updateExpense',
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'expenses', id);
      await updateDoc(docRef, {
        ...expenseData,
        updatedAt: serverTimestamp(),
      });
      return { id, ...expenseData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'business/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Warranty operations
export const addWarrantyClaim = createAsyncThunk(
  'business/addWarrantyClaim',
  async ({ warrantyData, userId }, { rejectWithValue }) => {
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
      return rejectWithValue(error.message);
    }
  }
);

export const updateWarrantyStatus = createAsyncThunk(
  'business/updateWarrantyStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'warranty', id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteWarrantyClaim = createAsyncThunk(
  'business/deleteWarrantyClaim',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'warranty', id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWarrantyClaim = createAsyncThunk(
  'business/updateWarrantyClaim',
  async (warrantyData, { rejectWithValue }) => {
    try {
      if (!warrantyData.id) {
        return rejectWithValue('Warranty ID is required for updates.');
      }
      const warrantyRef = doc(db, 'warranty', warrantyData.id);
      await updateDoc(warrantyRef, {
        ...warrantyData,
        updatedAt: serverTimestamp(),
      });
      return warrantyData;
    } catch (error) {
      console.error('Error updating warranty claim:', error);
      return rejectWithValue(error.message);
    }
  }
);




// Report operations
export const addReport = createAsyncThunk(
  'business/addReport',
  async ({ reportData, userId }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'reports'), {
        ...reportData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...reportData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  owners: [],
  productions: [],
  sales: [],
  expenses: [],
  warranties: [],
  reports: [],
  isLoading: false,
  error: null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch business data
      .addCase(fetchBusinessData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.owners = action.payload.owners;
        state.productions = action.payload.productions;
        state.sales = action.payload.sales;
        state.expenses = action.payload.expenses;
        state.warranties = action.payload.warranties;
        state.reports = action.payload.reports;
        state.error = null;
      })
      .addCase(fetchBusinessData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // updateProductionStatus will be handled in full reducers below
      // Add owner
      .addCase(addOwner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.owners.push(action.payload);
      })
      .addCase(addOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update owner
      .addCase(updateOwner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.owners.findIndex(owner => owner.id === action.payload.id);
        if (index !== -1) {
          state.owners[index] = action.payload;
        }
      })
      .addCase(updateOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete owner
      .addCase(deleteOwner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.owners = state.owners.filter(owner => owner.id !== action.payload);
      })
      .addCase(deleteOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add production
      .addCase(addProduction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productions.push(action.payload);
      })
      .addCase(addProduction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add sale
      .addCase(addSale.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales.push(action.payload);
      })
      .addCase(addSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update sale
      .addCase(updateSale.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.sales.findIndex(sale => sale.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete sale
      .addCase(deleteSale.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales = state.sales.filter(sale => sale.id !== action.payload);
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add expense
      .addCase(addExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses.push(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update expense
      .addCase(updateExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete expense
      .addCase(deleteExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add warranty claim
      .addCase(addWarrantyClaim.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addWarrantyClaim.fulfilled, (state, action) => {
        state.isLoading = false;
        state.warranties.push(action.payload);
      })
      .addCase(addWarrantyClaim.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
            // Delete warranty
      .addCase(deleteWarrantyClaim.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteWarrantyClaim.fulfilled, (state, action) => {
        state.isLoading = false;
        state.warranties = state.warranties.filter(warranty => warranty.id !== action.payload);
      })
      .addCase(deleteWarrantyClaim.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
            // Update warranty
      .addCase(updateWarrantyClaim.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateWarrantyClaim.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.warranties.findIndex(warranty => warranty.id === action.payload.id);
        if (index !== -1) {
          state.warranties[index] = action.payload;
        }
      })

      // Update warranty status
      .addCase(updateWarrantyStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWarrantyStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.warranties.findIndex(warranty => warranty.id === action.payload.id);
        if (index !== -1) {
          state.warranties[index].status = action.payload.status;
        }
      })
      .addCase(updateWarrantyStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update production status
      .addCase(updateProductionStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProductionStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.productions.findIndex(production => production.id === action.payload.id);
        if (index !== -1) {
          state.productions[index].status = action.payload.status;
        }
      })
      .addCase(updateProductionStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete production
      .addCase(deleteProduction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productions = state.productions.filter(production => production.id !== action.payload);
      })
      .addCase(deleteProduction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add report
      .addCase(addReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports.push(action.payload);
      })
      .addCase(addReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = businessSlice.actions;
export default businessSlice.reducer;

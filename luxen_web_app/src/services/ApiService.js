import axios from 'axios';
import { store } from '../redux/store';
import { showSnackbar } from '../redux/slices/uiSlice';

// Base URL for the Python/Flask API
// Replace with your deployed backend URL or use the local development URL
// Replace with your deployed function URL or use the emulator URL
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api'
  : 'YOUR_DEPLOYED_PYTHON_BACKEND_URL/api'; // e.g., https://luxen-backend.onrender.com/api

const ApiService = {
  /**
   * Fetches the owner profit shares from the backend.
   * @returns {Promise<Object>} The response data containing shares and totals.
   */
  getOwnerShares: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/business/owner-shares`);
      return response.data;
    } catch (error) {
      console.error('Error fetching owner shares:', error);
      store.dispatch(showSnackbar({ message: 'Failed to fetch owner shares from API.', severity: 'error' }));
      throw error;
    }
  },

  /**
   * Fetches the predicted next month's expenses.
   * @returns {Promise<Object>} The response data containing prediction and historical data.
   */
  getExpensePrediction: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/business/expenses/predict`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense prediction:', error);
      store.dispatch(showSnackbar({ message: 'Failed to fetch expense prediction from API.', severity: 'error' }));
      throw error;
    }
  },

  /**
   * Fetches the dashboard metrics from the Python backend.
   * @returns {Promise<Object>} The response data containing all aggregated metrics.
   */
  getDashboardMetrics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/business/dashboard-metrics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      store.dispatch(showSnackbar({ message: 'Failed to fetch dashboard metrics from API.', severity: 'error' }));
      throw error;
    }
  },

  /**
   * Sends a message to the LUXEN AI Chat Assistant.
   * @param {string} message - The user's message.
   * @returns {Promise<Object>} The response from the AI Assistant.
   */
  chatWithAI: async (message) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/chat`, { message });
      return response.data;
    } catch (error) {
      console.error('Error chatting with AI:', error);
      store.dispatch(showSnackbar({ message: 'Failed to connect with AI Assistant.', severity: 'error' }));
      throw error;
    }
  },

  /**
   * Placeholder for Google Drive upload function call (if needed for server-side processing).
   * Note: We are primarily using the client-side GoogleDriveService for direct upload.
   */
  uploadToDrive: async (fileName, fileContent) => {
    try {
      // This is a placeholder for server-side GDrive upload, the client-side GDriveService is preferred.
      const response = await axios.post(`${API_BASE_URL}/reports/drive-upload`, {
        fileName,
        fileContent,
      });
      return response.data;
    } catch (error) {
      console.error('Error in API Drive upload:', error);
      store.dispatch(showSnackbar({ message: 'Failed to call backend Drive upload API.', severity: 'error' }));
      throw error;
    }
  },
};

export default ApiService;


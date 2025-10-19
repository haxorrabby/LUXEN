import { gapi } from 'gapi-script';
import { showSnackbar } from '../redux/slices/uiSlice';
import { store } from '../redux/store';

// Google API Client ID and Scopes
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.file'; // Only files created by this app

const GoogleDriveService = {
  /**
   * Initializes the Google API client library.
   */
  initClient: () => {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', () => {
        try {
          gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          }).then(() => {
            resolve(true);
          }, (error) => {
            console.error('Error initializing gapi client:', error);
            reject(error);
          });
        } catch (error) {
          console.error('Error loading gapi:', error);
          reject(error);
        }
      });
    });
  },

  /**
   * Handles user sign-in.
   */
  signIn: () => {
    return gapi.auth2.getAuthInstance().signIn();
  },

  /**
   * Checks if the user is currently signed in.
   */
  isSignedIn: () => {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  },

  /**
   * Gets or creates the parent folder for LUXEN data.
   * @param {string} folderName - The name of the folder to find/create.
   * @returns {Promise<string>} The ID of the folder.
   */
  getOrCreateFolder: async (folderName) => {
    const q = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and 'root' in parents and trashed=false`;
    
    try {
      // Search for the folder
      let response = await gapi.client.drive.files.list({
        q: q,
        fields: 'files(id, name)',
      });

      let files = response.result.files;
      if (files.length > 0) {
        return files[0].id; // Folder found
      } else {
        // Folder not found, create it
        const fileMetadata = {
          'name': folderName,
          'mimeType': 'application/vnd.google-apps.folder',
        };
        response = await gapi.client.drive.files.create({
          resource: fileMetadata,
          fields: 'id',
        });
        return response.result.id; // New folder created
      }
    } catch (error) {
      console.error('Error getting or creating folder:', error);
      store.dispatch(showSnackbar({ message: 'Error syncing with Google Drive.', severity: 'error' }));
      throw error;
    }
  },

  /**
   * Uploads a file to Google Drive.
   * @param {string} fileName - The name of the file.
   * @param {string} mimeType - The MIME type of the file (e.g., 'application/pdf').
   * @param {Blob} content - The file content as a Blob.
   * @param {string} subfolder - The subfolder name (e.g., 'Sales').
   */
  uploadFile: async (fileName, mimeType, content, subfolder) => {
    if (!GoogleDriveService.isSignedIn()) {
      await GoogleDriveService.signIn();
    }

    const luxenFolderId = await GoogleDriveService.getOrCreateFolder('LUXEN_BUSINESS_DATA');
    const subfolderId = await GoogleDriveService.getOrCreateFolder(subfolder);
    
    // Move subfolder under luxenFolderId (optional, but good practice)
    // For simplicity, we assume the subfolder is created in root for now.

    const fileMetadata = {
      'name': fileName,
      'mimeType': mimeType,
      'parents': [subfolderId],
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
    form.append('file', content);

    try {
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + gapi.auth.getToken().access_token }),
        body: form,
      });

      if (!response.ok) {
        throw new Error(`Google Drive upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      store.dispatch(showSnackbar({ message: `${fileName} uploaded to Drive successfully!`, severity: 'success' }));
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      store.dispatch(showSnackbar({ message: `Failed to upload ${fileName} to Drive.`, severity: 'error' }));
      throw error;
    }
  },
};

export default GoogleDriveService;


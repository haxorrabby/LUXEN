# LUXEN Smart Business Manager - Complete Setup & Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Firebase Configuration](#firebase-configuration)
4. [Google Drive API Setup](#google-drive-api-setup)
5. [Running the Application](#running-the-application)
6. [Deploying to Firebase Hosting](#deploying-to-firebase-hosting)
7. [Importing Seed Data](#importing-seed-data)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Firebase CLI** - Install with `npm install -g firebase-tools`
- A **Google Cloud Project** - [Create one](https://console.cloud.google.com/)
- A **Firebase Project** - [Create one](https://console.firebase.google.com/)

---

## Local Development Setup

### Step 1: Clone or Extract the Project

```bash
# If you have a git repository
git clone <your-repo-url>
cd luxen_web_app

# Or extract the project folder
cd luxen_web_app
```

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend (Cloud Functions) dependencies
cd functions
npm install
cd ..
```

### Step 3: Create Environment File

Copy the `.env.example` file to `.env.local` and fill in your Firebase and Google API credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_API_KEY=your_google_api_key
REACT_APP_USE_EMULATOR=false
```

---

## Firebase Configuration

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: `luxen-business-manager`
4. Follow the setup wizard
5. Enable Google Analytics (optional)

### Step 2: Set Up Firebase Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. (Optional) Enable other providers like Google, GitHub, etc.

### Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (you'll set security rules later)
4. Select your region (closest to your users)
5. Click "Enable"

### Step 4: Set Up Firestore Security Rules

1. In Firestore, go to **Rules**
2. Replace the default rules with the content from `firestore.rules`
3. Click "Publish"

### Step 5: Create Firestore Indexes

1. In Firestore, go to **Indexes**
2. Import the indexes from `firestore.indexes.json` or create them manually:

| Collection | Fields | Order |
| :--- | :--- | :--- |
| production | createdAt | Descending |
| sales | createdAt | Descending |
| expenses | category (Asc), createdAt (Desc) | Mixed |
| warranty | replaced (Asc), createdAt (Desc) | Mixed |
| reports | year (Desc), month (Desc) | Mixed |

### Step 6: Get Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Click **Service Accounts**
3. Click "Generate New Private Key" (for backend use)
4. Save this file as `serviceAccountKey.json` in the project root (add to `.gitignore`)
5. Copy your Web API credentials to `.env.local`

---

## Google Drive API Setup

### Step 1: Enable Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Library**
4. Search for "Google Drive API"
5. Click "Enable"

### Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for local development)
   - `https://your-firebase-hosting-url.web.app` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000/` (for local development)
   - `https://your-firebase-hosting-url.web.app/` (for production)
6. Copy the **Client ID** and **API Key** to `.env.local`

### Step 3: Test Google Drive Integration

The app will prompt users to sign in with their Google account when they first try to sync with Google Drive. Ensure the OAuth consent screen is configured:

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose "External" for User Type
3. Fill in the required information
4. Add test users if in development mode

---

## Running the Application

### Local Development

```bash
# Start the React development server
npm start

# The app will open at http://localhost:3000
```

### Emulator (Optional - for testing without Firebase)

```bash
# Start Firebase emulators
firebase emulators:start

# In another terminal, start React with emulator enabled
REACT_APP_USE_EMULATOR=true npm start
```

---

## Deploying to Firebase Hosting

### Step 1: Build the React App

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Step 2: Initialize Firebase Hosting

```bash
firebase init hosting
```

When prompted:
- Select your Firebase project
- Use `build` as the public directory
- Configure as a single-page app (SPA): **Yes**

### Step 3: Deploy Cloud Functions (Optional)

```bash
firebase deploy --only functions
```

### Step 4: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

### Step 5: View Deployment

```bash
firebase open hosting:site
```

---

## Importing Seed Data

### Step 1: Prepare Credentials

Ensure `serviceAccountKey.json` is in the project root:

```bash
# If you haven't downloaded it yet, get it from Firebase Console
# Project Settings → Service Accounts → Generate New Private Key
```

### Step 2: Run Import Script

```bash
node scripts/importSeedData.js
```

The script will import sample data for:
- 2 owners (রহিম আহমেদ, করিম হোসেন)
- 2 production batches
- 2 sales transactions
- 4 expense entries
- 2 warranty claims
- 1 monthly report

### Step 3: Verify Data

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Open **Firestore Database**
3. Verify that all collections have data

---

## Troubleshooting

### Issue: "Firebase is not initialized"

**Solution**: Ensure your `.env.local` file has correct Firebase credentials and the app is restarted.

```bash
# Check your .env.local
cat .env.local

# Restart the development server
npm start
```

### Issue: "Google Drive API not working"

**Solution**: 
1. Verify that Google Drive API is enabled in Google Cloud Console
2. Check that OAuth credentials are correct in `.env.local`
3. Ensure the redirect URI matches your app's URL
4. Clear browser cache and cookies

### Issue: "Firestore security rules rejected request"

**Solution**: 
1. Verify that the user is authenticated
2. Check the security rules in `firestore.rules`
3. Ensure the user's UID matches the document path (for owner documents)

### Issue: "Cloud Functions returning 404"

**Solution**:
1. Deploy the functions: `firebase deploy --only functions`
2. Update the API base URL in `src/services/ApiService.js` with your deployed function URL
3. Check the function logs: `firebase functions:log`

### Issue: "PWA not installing on mobile"

**Solution**:
1. Ensure the app is served over HTTPS (Firebase Hosting does this automatically)
2. Verify `manifest.json` is properly linked in `public/index.html`
3. Check browser console for manifest errors
4. Try adding to home screen from the browser menu

---

## Production Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] Firebase security rules are properly configured
- [ ] Google Drive API credentials are set up
- [ ] Firestore indexes are created
- [ ] Cloud Functions are deployed
- [ ] Seed data is imported (or users have created their own data)
- [ ] App is tested on mobile and desktop browsers
- [ ] PWA manifest is configured
- [ ] HTTPS is enabled (automatic with Firebase Hosting)
- [ ] Firebase backup is enabled (optional)
- [ ] Monitoring and logging are set up

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Google Drive API Documentation](https://developers.google.com/drive)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)

---

## Support

For issues or questions, please refer to the troubleshooting section above or check the official documentation links provided.

**Happy coding! 🚀**


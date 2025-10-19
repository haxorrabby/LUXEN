# Setting up Firebase Authentication

To resolve the "auth/operation-not-allowed" error, you need to enable Email/Password authentication in your Firebase project:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`luxen-d03e1`)
3. In the left sidebar, click "Authentication"
4. Go to the "Sign-in method" tab
5. Click "Email/Password" in the providers list
6. Enable the "Email/Password" provider by toggling the switch
7. Click "Save"

After enabling Email/Password authentication:
1. Stop the React development server (if running)
2. Start it again: `npm start`
3. Try signing up or logging in again

## Verifying Firebase Configuration

Your current Firebase configuration in the web app looks correct:
- Project ID: luxen-d03e1
- Auth Domain: luxen-d03e1.firebaseapp.com

The error you're seeing is specifically about authentication methods not being enabled in the Firebase Console, not about API keys or configuration.
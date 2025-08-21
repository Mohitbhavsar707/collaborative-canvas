// Firebase Configuration Template
// Copy this to firebase-config.js and fill in your Firebase project details

// Method 1: Set these as global window variables (for development)
window.FIREBASE_API_KEY = "YOUR_API_KEY_HERE";
window.FIREBASE_AUTH_DOMAIN = "your-project.firebaseapp.com";
window.FIREBASE_DATABASE_URL = "https://your-project-default-rtdb.firebaseio.com";
window.FIREBASE_PROJECT_ID = "your-project-id";
window.FIREBASE_STORAGE_BUCKET = "your-project.appspot.com";
window.FIREBASE_MESSAGING_SENDER_ID = "123456789";
window.FIREBASE_APP_ID = "your-app-id";

// Method 2: For production deployment (Vercel)
// Set these as environment variables in your Vercel dashboard:
// - FIREBASE_API_KEY
// - FIREBASE_AUTH_DOMAIN  
// - FIREBASE_DATABASE_URL
// - FIREBASE_PROJECT_ID
// - FIREBASE_STORAGE_BUCKET
// - FIREBASE_MESSAGING_SENDER_ID
// - FIREBASE_APP_ID

// Instructions:
// 1. Go to your Firebase project console
// 2. Click the gear icon → Project Settings
// 3. Scroll to "Your apps" and copy the config values
// 4. Either create firebase-config.js with the values above
//    OR set them as environment variables in your hosting platform

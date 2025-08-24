// Vercel API endpoint to inject Firebase config as client-side variables
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  // Helper to safely get and clean environment variables
  const getEnvVar = (key, fallback = '') => {
    const value = process.env[key] || fallback;
    // Remove quotes if they exist and clean the value
    const cleaned = value.toString().trim().replace(/^["']|["']$/g, '');
    return JSON.stringify(cleaned);
  };

  // Get Firebase config from environment variables
  const apiKey = getEnvVar('FIREBASE_API_KEY', 'demo-key');
  const authDomain = getEnvVar('FIREBASE_AUTH_DOMAIN', 'demo-project.firebaseapp.com');
  const databaseURL = getEnvVar('FIREBASE_DATABASE_URL', 'https://demo-project-default-rtdb.firebaseio.com');
  const projectId = getEnvVar('FIREBASE_PROJECT_ID', 'demo-project');
  let storageBucket = getEnvVar('FIREBASE_STORAGE_BUCKET', 'demo-project.appspot.com');
  const messagingSenderId = getEnvVar('FIREBASE_MESSAGING_SENDER_ID', '123456789');
  const appId = getEnvVar('FIREBASE_APP_ID', 'demo-app-id');

  // Fix storage bucket format if needed
  if (storageBucket.includes('.firebasestorage.app')) {
    storageBucket = storageBucket.replace('.firebasestorage.app', '.appspot.com');
  }

  // Generate the config script
  const configScript = `
// Firebase configuration injected from Vercel environment variables
// Generated at: ${new Date().toISOString()}

console.log('🔥 Loading Firebase config from Vercel environment variables...');

// Set global Firebase config variables
window.FIREBASE_API_KEY = ${apiKey};
window.FIREBASE_AUTH_DOMAIN = ${authDomain};
window.FIREBASE_DATABASE_URL = ${databaseURL};
window.FIREBASE_PROJECT_ID = ${projectId};
window.FIREBASE_STORAGE_BUCKET = ${storageBucket};
window.FIREBASE_MESSAGING_SENDER_ID = ${messagingSenderId};
window.FIREBASE_APP_ID = ${appId};

// Debug info (only show in development)
if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
  console.log('🔧 Firebase Config Debug:', {
    apiKey: window.FIREBASE_API_KEY ? 'Set (hidden)' : 'Missing',
    authDomain: window.FIREBASE_AUTH_DOMAIN,
    databaseURL: window.FIREBASE_DATABASE_URL,
    projectId: window.FIREBASE_PROJECT_ID,
    storageBucket: window.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID,
    appId: window.FIREBASE_APP_ID ? 'Set (hidden)' : 'Missing'
  });
}

console.log('🔥 Firebase config loaded successfully from environment variables!');
`;

  // Send the JavaScript response
  res.status(200).send(configScript);
}
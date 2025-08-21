// Vercel API endpoint to inject Firebase config as client-side variables
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-store');

  // Helper to normalize and JSON.stringify safely
  const clean = (val, fallback) => {
    let v = (val ?? fallback ?? '').toString().trim();
    v = v.replace(/^['"]+/, '').replace(/['"]+$/, ''); // remove accidental extra quotes
    return JSON.stringify(v);
  };

  // Ensure storage bucket always uses .appspot.com
  let storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com';
  if (storageBucket.endsWith('.firebasestorage.app')) {
    storageBucket = storageBucket.replace('.firebasestorage.app', '.appspot.com');
  }

  const configScript = `
// Firebase configuration injected from Vercel environment variables
// version: ${Date.now()}
window.FIREBASE_API_KEY = ${clean(process.env.FIREBASE_API_KEY, "demo-key")};
window.FIREBASE_AUTH_DOMAIN = ${clean(process.env.FIREBASE_AUTH_DOMAIN, "demo.firebaseapp.com")};
window.FIREBASE_DATABASE_URL = ${clean(process.env.FIREBASE_DATABASE_URL, "https://demo.firebaseio.com")};
window.FIREBASE_PROJECT_ID = ${clean(process.env.FIREBASE_PROJECT_ID, "demo-project")};
window.FIREBASE_STORAGE_BUCKET = ${clean(storageBucket, "demo.appspot.com")};
window.FIREBASE_MESSAGING_SENDER_ID = ${clean(process.env.FIREBASE_MESSAGING_SENDER_ID, "123456789")};
window.FIREBASE_APP_ID = ${clean(process.env.FIREBASE_APP_ID, "demo-app-id")};

console.log('🔥 Firebase config loaded from Vercel environment variables');
`;

  res.status(200).send(configScript);
}


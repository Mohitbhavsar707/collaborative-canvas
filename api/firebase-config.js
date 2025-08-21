// Vercel API endpoint to inject Firebase config as client-side variables
export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/javascript');
    
    // Generate JavaScript that sets window variables
    // Remove quotes from environment variables since they're already strings
    const configScript = `
// Firebase configuration injected from Vercel environment variables
window.FIREBASE_API_KEY = ${JSON.stringify(process.env.FIREBASE_API_KEY || 'demo-api-key')};
window.FIREBASE_AUTH_DOMAIN = ${JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com')};
window.FIREBASE_DATABASE_URL = ${JSON.stringify(process.env.FIREBASE_DATABASE_URL || 'https://demo-project-default-rtdb.firebaseio.com')};
window.FIREBASE_PROJECT_ID = ${JSON.stringify(process.env.FIREBASE_PROJECT_ID || 'demo-project')};
window.FIREBASE_STORAGE_BUCKET = ${JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com')};
window.FIREBASE_MESSAGING_SENDER_ID = ${JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID || '123456789')};
window.FIREBASE_APP_ID = ${JSON.stringify(process.env.FIREBASE_APP_ID || 'demo-app-id')};

console.log('🔥 Firebase config loaded from Vercel environment variables');
    `.trim();
    
    res.status(200).send(configScript);
};

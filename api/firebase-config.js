// Vercel API endpoint to inject Firebase config as client-side variables
export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/javascript');

    // Helper to clean env vars that may have been saved with extra quotes in Vercel
    const clean = (val, fallback) => {
        let v = (val ?? fallback ?? '').toString().trim();
        // strip any surrounding single or double quotes repeatedly
        v = v.replace(/^['"]+/, '').replace(/['"]+$/, '');
        return JSON.stringify(v);
    };

    // Generate JavaScript that sets window variables
    const configScript = `
// Firebase configuration injected from Vercel environment variables
// version: ${Date.now()}
window.FIREBASE_API_KEY = ${clean(process.env.FIREBASE_API_KEY, 'demo-api-key')};
window.FIREBASE_AUTH_DOMAIN = ${clean(process.env.FIREBASE_AUTH_DOMAIN, 'demo-project.firebaseapp.com')};
window.FIREBASE_DATABASE_URL = ${clean(process.env.FIREBASE_DATABASE_URL, 'https://demo-project-default-rtdb.firebaseio.com')};
window.FIREBASE_PROJECT_ID = ${clean(process.env.FIREBASE_PROJECT_ID, 'demo-project')};
window.FIREBASE_STORAGE_BUCKET = ${clean(process.env.FIREBASE_STORAGE_BUCKET, 'demo-project.appspot.com')};
window.FIREBASE_MESSAGING_SENDER_ID = ${clean(process.env.FIREBASE_MESSAGING_SENDER_ID, '123456789')};
window.FIREBASE_APP_ID = ${clean(process.env.FIREBASE_APP_ID, 'demo-app-id')};

console.log('🔥 Firebase config loaded from Vercel environment variables');
    `.trim();

    res.status(200).send(configScript);
};

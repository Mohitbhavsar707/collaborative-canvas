// Firebase utilities for collaborative canvas
import { ref, set, get, onValue, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Wait for Firebase to be initialized
function waitForFirebase() {
    return new Promise((resolve) => {
        const checkFirebase = () => {
            if (window.firebaseDatabase) {
                resolve(window.firebaseDatabase);
            } else {
                setTimeout(checkFirebase, 100);
            }
        };
        checkFirebase();
    });
}

// Firebase utilities class
class FirebaseUtils {
    constructor() {
        this.database = null;
        this.canvasRef = null;
        this.usersRef = null;
        this.currentUser = null;
        this.init();
    }
    
    async init() {
        try {
            this.database = await waitForFirebase();
            this.canvasRef = ref(this.database, 'canvas');
            this.usersRef = ref(this.database, 'users');
            console.log('🔥 Firebase utilities initialized');
        } catch (error) {
            console.error('Error initializing Firebase utilities:', error);
        }
    }
    
    // Save canvas as imageData (Base64 PNG) to Firebase
    async saveCanvas(canvasElement, username = 'Anonymous') {
        if (!this.database) {
            console.warn('Firebase not ready yet');
            return false;
        }
        
        try {
            const imageData = canvasElement.toDataURL("image/png"); // 👈 export canvas to Base64 PNG
            const saveData = {
                imageData: imageData,
                timestamp: serverTimestamp(),
                editor: username,
                version: Date.now()
            };
            
            await set(this.canvasRef, saveData);
            console.log('🌍 Canvas saved to Firebase');
            return true;
        } catch (error) {
            console.error('Error saving to Firebase:', error);
            return false;
        }
    }
    
    // Load canvas imageData from Firebase
    async loadCanvas() {
        if (!this.database) {
            console.warn('Firebase not ready yet');
            return null;
        }
        
        try {
            const snapshot = await get(this.canvasRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log('🌍 Canvas loaded from Firebase');
                return data; // will contain { imageData, timestamp, editor, version }
            } else {
                console.log('No canvas data found in Firebase');
                return null;
            }
        } catch (error) {
            console.error('Error loading from Firebase:', error);
            return null;
        }
    }
    
    // Set up real-time listener for canvas changes
    onCanvasChange(callback) {
        if (!this.database) {
            console.warn('Firebase not ready for listeners');
            return () => {}; // Return empty unsubscribe function
        }
        
        try {
            const unsubscribe = onValue(this.canvasRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    if (data && data.imageData) {
                        callback(data); // callback receives { imageData, ... }
                    }
                }
            });
            
            console.log('🔥 Real-time listener set up');
            return unsubscribe;
        } catch (error) {
            console.error('Error setting up listener:', error);
            return () => {}; // Return empty unsubscribe function
        }
    }
    
    // Update user presence
    async updateUserPresence(username, isActive = true) {
        if (!this.database) return false;
        
        try {
            const userRef = ref(this.database, `users/${this.getUserId(username)}`);
            await set(userRef, {
                name: username,
                lastSeen: serverTimestamp(),
                active: isActive
            });
            return true;
        } catch (error) {
            console.error('Error updating user presence:', error);
            return false;
        }
    }
    
    // Get simple user ID from username
    getUserId(username) {
        return username.replace(/[^\w]/g, '_').toLowerCase() || 'anonymous';
    }
    
    // Listen to active users
    onUsersChange(callback) {
        if (!this.database) return () => {};
        
        try {
            const unsubscribe = onValue(this.usersRef, (snapshot) => {
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    callback(Object.values(users));
                } else {
                    callback([]);
                }
            });
            
            return unsubscribe;
        } catch (error) {
            console.error('Error setting up users listener:', error);
            return () => {};
        }
    }
}

// Create global instance
window.firebaseUtils = new FirebaseUtils();

export default FirebaseUtils;

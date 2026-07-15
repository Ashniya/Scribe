import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Admin Service Account (from env in prod, or file locally)
let serviceAccountKey;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
    serviceAccountKey = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../ScribeServiceAccountKey.json'), 'utf8')
    );
}

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey)
    });
    console.log('✅ Firebase Admin initialized with Firestore');
} else {
    console.log('ℹ️ Firebase Admin already initialized');
}

// Get Firestore instance
const db = admin.firestore();

export default admin;
export { db };
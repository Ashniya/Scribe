import admin from '../config/firebase.js';
import { findUserByFirebaseUid, createUser } from '../services/user.service.js';

export const protect = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];

            // Verify Firebase token (Firebase used ONLY for auth)
            const decodedToken = await admin.auth().verifyIdToken(token);

            // Fetch MongoDB User to ensure we have latest profile data (photoURL, displayName) and correct _id
            const mongoUser = await findUserByFirebaseUid(decodedToken.uid);

            if (mongoUser) {
                // Attach MongoDB user document
                req.user = mongoUser;
                // Ensure uid is available for compatibility
                req.user.uid = mongoUser.firebaseUid;
            } else {
                // User authenticated in Firebase but not in MongoDB
                // Create the user in MongoDB now (Auto-Sync)
                console.log('✨ Creating new MongoDB user for Firebase UID:', decodedToken.uid);

                const newUser = await createUser({
                    firebaseUid: decodedToken.uid,
                    email: decodedToken.email,
                    displayName: decodedToken.name || decodedToken.email.split('@')[0],
                    photoURL: decodedToken.picture || null,
                    provider: 'firebase'
                });

                req.user = newUser;
                console.log('✅ User created and synced:', newUser.username);
            }

            next();
        } catch (error) {
            console.error('❌ Firebase auth error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed',
                error: error.message
            });
        }
    } else {
        console.log('❌ No token provided');
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};
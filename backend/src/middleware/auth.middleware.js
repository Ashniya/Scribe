import admin from '../config/firebase-admin.js';


import { findUserByFirebaseUid } from '../services/user.service.js';

export const protect = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            // console.log('🔐 Token received, length:', token.length);

            // Verify Firebase token (Firebase used ONLY for auth)
            // console.log('🔍 Verifying Firebase token...');
            const decodedToken = await admin.auth().verifyIdToken(token);
            // console.log('✅ Token verified for user:', decodedToken.email);

            // Fetch MongoDB User to ensure we have latest profile data (photoURL, displayName) and correct _id
            const mongoUser = await findUserByFirebaseUid(decodedToken.uid);

            if (mongoUser) {
                // Attach MongoDB user document
                req.user = mongoUser;
                // Ensure uid is available for compatibility if needed (User model has firebaseUid)
                req.user.uid = mongoUser.firebaseUid;
                // console.log('✅ Auth successful (MongoDB user):', req.user.email);
            } else {
                // Fallback to Firebase token data if not in MongoDB (e.g. first login before sync)
                console.warn('⚠️ User not found in MongoDB, falling back to Firebase token data');
                req.user = {
                    _id: decodedToken.uid, // WARNING: This is a string, not ObjectId. Might break partials expecting ObjectId.
                    uid: decodedToken.uid,
                    email: decodedToken.email,
                    displayName: decodedToken.name || decodedToken.email.split('@')[0],
                    photoURL: decodedToken.picture || null
                };
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
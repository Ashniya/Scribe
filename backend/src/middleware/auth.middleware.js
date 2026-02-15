import admin from '../config/firebase.js';

export const protect = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            console.log('🔐 Token received, length:', token.length);

            // Verify Firebase token (Firebase used ONLY for auth)
            console.log('🔍 Verifying Firebase token...');
            const decodedToken = await admin.auth().verifyIdToken(token);
            console.log('✅ Token verified for user:', decodedToken.email);

            // Attach user info from Firebase token directly
            req.user = {
                _id: decodedToken.uid,
                uid: decodedToken.uid,
                email: decodedToken.email,
                displayName: decodedToken.name || decodedToken.email.split('@')[0],
                photoURL: decodedToken.picture || null
            };

            console.log('✅ Authentication successful for:', req.user.email);
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
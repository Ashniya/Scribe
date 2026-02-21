import express from 'express';
import { db } from '../config/firebase.js';
import admin from '../config/firebase.js';

const router = express.Router();

// Test Firestore connection
router.get('/firestore', async (req, res) => {
    try {
        console.log('🧪 Testing Firestore connection...');

        // Try to write a test document
        const testRef = db.collection('users').doc('connection-test');
        await testRef.set({
            timestamp: new Date(),
            message: 'Connection test successful'
        });

        // Try to read it back
        const doc = await testRef.get();
        const data = doc.data();

        // Clean up
        await testRef.delete();

        res.json({
            success: true,
            message: 'Firestore connection is working!',
            data: data
        });
    } catch (error) {
        console.error('❌ Firestore connection error:', error);
        res.status(500).json({
            success: false,
            message: 'Firestore connection failed',
            error: error.message
        });
    }
});

// Test Firebase Auth token verification
router.post('/verify-token', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'No token provided'
            });
        }

        console.log('🧪 Testing token verification...');
        console.log('Token length:', token.length);

        const decodedToken = await admin.auth().verifyIdToken(token);

        res.json({
            success: true,
            message: 'Token verified successfully!',
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name
            }
        });
    } catch (error) {
        console.error('❌ Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Token verification failed',
            error: error.message,
            errorCode: error.code
        });
    }
});

// Test complete auth flow
router.post('/test-auth-flow', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'No token provided'
            });
        }

        console.log('🧪 Testing complete auth flow...');

        // Step 1: Verify token
        console.log('Step 1: Verifying token...');
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('✅ Token verified for:', decodedToken.email);

        // Step 2: Check Firestore connection
        console.log('Step 2: Testing Firestore...');
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', decodedToken.email).limit(1).get();
        console.log('✅ Firestore query executed, found:', snapshot.size, 'users');

        res.json({
            success: true,
            message: 'Complete auth flow working!',
            steps: {
                tokenVerified: true,
                firestoreConnected: true,
                userExists: !snapshot.empty
            },
            user: {
                email: decodedToken.email,
                uid: decodedToken.uid
            }
        });
    } catch (error) {
        console.error('❌ Auth flow test error:', error);
        res.status(500).json({
            success: false,
            message: 'Auth flow test failed',
            error: error.message,
            errorCode: error.code
        });
    }
});

export default router;

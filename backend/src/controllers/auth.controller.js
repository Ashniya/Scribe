// backend/src/controllers/auth.controller.js
import {
  createUser,
  findUserByEmail,
  findUserByFirebaseUid,
  updateUserByFirebaseUid
} from '../services/user.service.js';

// @desc    Register / sync user after Firebase signup
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, displayName, photoURL, firebaseUid, provider } = req.body;

    if (!email || !firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'Email and firebaseUid are required'
      });
    }

    // Check if user already exists (by Firebase UID first, then email)
    let user = await findUserByFirebaseUid(firebaseUid);

    if (!user) {
      user = await findUserByEmail(email);
    }

    if (user) {
      // User exists — update their info and return
      user = await updateUserByFirebaseUid(firebaseUid, {
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL,
        lastActive: new Date()
      }) || user;

      return res.status(200).json({
        success: true,
        message: 'User synced',
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          username: user.username
        }
      });
    }

    // Create new MongoDB user
    const newUser = await createUser({
      email,
      displayName,
      photoURL,
      firebaseUid,
      provider: provider || 'firebase',
      providerId: firebaseUid
    });

    console.log('✅ MongoDB user created:', newUser.email, '| username:', newUser.username);

    res.status(201).json({
      success: true,
      message: 'User registered',
      user: {
        id: newUser._id,
        email: newUser.email,
        displayName: newUser.displayName,
        photoURL: newUser.photoURL,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get current logged in user (from MongoDB via Firebase UID)
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // req.user._id is set to Firebase UID by auth middleware
    const firebaseUid = req.user.uid || req.user._id;

    let user = await findUserByFirebaseUid(firebaseUid);

    // If not found by UID, try email (fallback)
    if (!user && req.user.email) {
      user = await findUserByEmail(req.user.email);
    }

    if (!user) {
      // Auto-create user if they authenticated but don't have a MongoDB record yet
      console.log('⚠️  User not in MongoDB, auto-creating:', req.user.email);
      user = await createUser({
        email: req.user.email,
        displayName: req.user.displayName,
        photoURL: req.user.photoURL,
        firebaseUid: firebaseUid,
        provider: 'firebase'
      });
      console.log('✅ Auto-created MongoDB user:', user.email);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('❌ Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Google Auth sync
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { email, displayName, photoURL, uid } = req.body;

    let user = await findUserByFirebaseUid(uid);

    if (!user) {
      user = await findUserByEmail(email);
    }

    if (!user) {
      user = await createUser({
        email,
        displayName,
        photoURL,
        firebaseUid: uid,
        provider: 'google',
        providerId: uid
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        username: user.username
      }
    });
  } catch (error) {
    console.error('❌ Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Keep login/register stubs for compatibility
export const login = async (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Use Firebase Auth for login. Call /api/auth/register to sync your user.'
  });
};
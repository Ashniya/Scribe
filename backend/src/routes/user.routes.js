// backend/src/routes/user.routes.js
import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * Create/Register user in MongoDB after Firebase signup
 * This should be called from frontend after Firebase signup
 */
router.post('/register', async (req, res) => {
  try {
    const { firebaseUid, email, displayName, username } = req.body;

    // Validation
    if (!firebaseUid || !email || !displayName || !username) {
      return res.status(400).json({
        error: 'Missing required fields: firebaseUid, email, displayName, username'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { firebaseUid },
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.firebaseUid === firebaseUid) {
        // User already registered, return existing user
        return res.json({
          success: true,
          message: 'User already registered',
          user: existingUser.getPublicProfile()
        });
      }

      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      if (existingUser.username === username.toLowerCase()) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return res.status(400).json({
        error: 'Username must be 3-30 characters and contain only letters, numbers, and underscores'
      });
    }

    // Create new user in MongoDB
    const newUser = new User({
      firebaseUid,
      email: email.toLowerCase(),
      displayName,
      username: username.toLowerCase(),
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser.getPublicProfile()
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

/**
 * Check if username is available
 */
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Validate username format
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return res.json({
        available: false,
        message: 'Username must be 3-30 characters and contain only letters, numbers, and underscores'
      });
    }

    const existingUser = await User.findOne({
      username: username.toLowerCase()
    });

    res.json({
      available: !existingUser,
      message: existingUser ? 'Username already taken' : 'Username available'
    });
  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({ error: 'Failed to check username' });
  }
});

/**
 * Search users by username or display name
 */
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        error: 'Search query must be at least 2 characters'
      });
    }

    console.log('Search Query:', q);
    const queryObj = {
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ]
    };
    console.log('Query Object:', JSON.stringify(queryObj));
    const users = await User.find(queryObj)
      .select('username displayName photoURL bio followerCount isVerified')
      .limit(parseInt(limit));
    console.log('Found users:', users.length);

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

/**
 * Get suggested users to follow
 */
router.get('/suggested', protect, async (req, res) => {
  try {
    const currentUser = req.user;
    const limit = parseInt(req.query.limit) || 5;

    // Find users that current user is not following
    const suggestedUsers = await User.find({
      _id: {
        $ne: currentUser._id,
        $nin: currentUser.following
      }
    })
      .select('username displayName photoURL bio followerCount isVerified')
      .sort({ followerCount: -1 }) // Sort by popularity
      .limit(limit);

    res.json({
      success: true,
      users: suggestedUsers
    });
  } catch (error) {
    console.error('Get suggested users error:', error);
    res.status(500).json({ error: 'Failed to get suggested users' });
  }
});

export default router;
// backend/src/services/user.service.js
import User from '../models/User.js';

// Create a new user in MongoDB
export const createUser = async (userData) => {
  const { email, displayName, photoURL, provider, providerId, firebaseUid } = userData;

  // Generate a unique username from displayName or email
  let baseUsername = (displayName || email.split('@')[0])
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .slice(0, 25);

  // Make sure username is unique - append random suffix if taken
  let username = baseUsername;
  let attempts = 0;
  while (await User.findOne({ username })) {
    username = `${baseUsername}_${Math.floor(Math.random() * 9999)}`;
    if (attempts++ > 10) break;
  }

  const user = await User.create({
    email,
    displayName: displayName || email.split('@')[0],
    photoURL: photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}&background=89986d&color=fff`,
    provider: provider || 'firebase',
    providerId: providerId || null,
    firebaseUid: firebaseUid || providerId || null,
    username,
  });

  return user;
};

// Find user by email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() });
};

// Find user by MongoDB _id
export const findUserById = async (userId) => {
  return await User.findById(userId);
};

// Find user by Firebase UID
export const findUserByFirebaseUid = async (firebaseUid) => {
  return await User.findOne({ firebaseUid });
};

// Find user by username
export const findUserByUsername = async (username) => {
  return await User.findOne({ username: username.toLowerCase() });
};

// Update user
export const updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

// Update user by Firebase UID
export const updateUserByFirebaseUid = async (firebaseUid, updateData) => {
  return await User.findOneAndUpdate(
    { firebaseUid },
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

// Compare password (kept for compatibility, not used with Firebase auth)
export const comparePassword = async (enteredPassword, hashedPassword) => {
  const bcrypt = await import('bcryptjs');
  return await bcrypt.default.compare(enteredPassword, hashedPassword);
};
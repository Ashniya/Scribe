import express from 'express';
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  uploadAvatar,
  uploadCoverImage,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  subscribeUser,
  unsubscribeUser,
  getUserActivity
} from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// Public routes
router.get('/activity/:userId', getUserActivity);
router.get('/@:username', getUserProfile);
router.get('/@:username/followers', getFollowers);
router.get('/@:username/following', getFollowing);

// Protected routes
router.use(protect);
router.get('/me', getMyProfile);
router.put('/me', updateProfile);
router.post('/me/avatar', upload.single('avatar'), uploadAvatar);
router.post('/me/cover', upload.single('cover'), uploadCoverImage);
router.post('/follow/:userId', followUser);
router.delete('/follow/:userId', unfollowUser);
router.post('/subscribe/:userId', subscribeUser);
router.delete('/subscribe/:userId', unsubscribeUser);

export default router;
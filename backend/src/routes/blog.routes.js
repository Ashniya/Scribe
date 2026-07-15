import express from 'express';
const router = express.Router();
import {
    createBlogPost,
    getAllBlogs,
    getMyBlogs,
    getBlog,
    updateBlogPost,
    deleteBlogPost,
    likeBlog,
    saveBlogPost,
    getStatsForUser,
    repostBlogPost,
    trackReadTimeController,
    getBlogBySlug,
    getBlogsByUserId,
    getLikedBlogsByUserId
} from '../controllers/blog.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// Public routes
router.get('/', getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Protected specific routes (MUST come before /:id)
router.get('/user/my-blogs', protect, getMyBlogs);
router.get('/user/stats', protect, getStatsForUser);
router.get('/user/:userId/blogs', getBlogsByUserId);
router.get('/user/:userId/liked', getLikedBlogsByUserId);

// Public single blog route
router.get('/:id', getBlog);

// Protected routes (apply middleware to all subsequent routes)
router.use(protect);

router.post('/', createBlogPost);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);
router.post('/:id/like', likeBlog);
router.post('/:id/save', saveBlogPost);
router.post('/:id/repost', repostBlogPost);
router.post('/:id/track-time', trackReadTimeController);

export default router;

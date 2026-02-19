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
    getStatsForUser
} from '../controllers/blog.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// Public routes
router.get('/', getAllBlogs);

// Protected user-specific routes — MUST come before /:id to avoid being shadowed
router.get('/user/my-blogs', protect, getMyBlogs);
router.get('/user/stats', protect, getStatsForUser);

// Public single blog route (comes after specific routes)
router.get('/:id', getBlog);

// Protected routes (require auth)
router.post('/', protect, createBlogPost);
router.put('/:id', protect, updateBlogPost);
router.delete('/:id', protect, deleteBlogPost);
router.post('/:id/like', protect, likeBlog);

export default router;

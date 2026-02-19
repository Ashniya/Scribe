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
<<<<<<< HEAD
    getStatsForUser
=======
    saveBlogPost,
    getStatsForUser,
    repostBlogPost,
    trackReadTimeController
>>>>>>> origin/feature/aditi
} from '../controllers/blog.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// Public routes
router.get('/', getAllBlogs);
<<<<<<< HEAD

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
=======
router.get('/:id', getBlog);

// Protected routes
router.use(protect);
router.post('/', createBlogPost);
router.get('/user/my-blogs', getMyBlogs);
router.get('/user/stats', getStatsForUser);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);
router.post('/:id/like', likeBlog);
router.post('/:id/save', saveBlogPost);

router.post('/:id/repost', repostBlogPost);
router.post('/:id/track-time', trackReadTimeController);
>>>>>>> origin/feature/aditi

export default router;

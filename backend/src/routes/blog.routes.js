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
router.get('/:id', getBlog);

// Protected routes
router.use(protect);
router.post('/', createBlogPost);
router.get('/user/my-blogs', getMyBlogs);
router.get('/user/stats', getStatsForUser);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);
router.post('/:id/like', likeBlog);

export default router;

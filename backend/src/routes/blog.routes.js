import express from 'express';
const router = express.Router();
import {
    createBlog,
    getAllBlogs,
    getMyBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    getUserStats
} from '../controllers/blog.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlog);

// Protected routes
router.use(protect);
router.post('/', createBlog);
router.get('/user/my-blogs', getMyBlogs);
router.get('/user/stats', getUserStats);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.post('/:id/like', likeBlog);

export default router;

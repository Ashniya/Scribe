import express from 'express';
import { createComment, getCommentsByBlog, deleteComment } from '../services/comment.service.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Get comments for a blog
router.get('/:blogId', async (req, res, next) => {
    try {
        const comments = await getCommentsByBlog(req.params.blogId);
        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        next(error);
    }
});

// Protected: Add a comment
router.post('/:blogId', protect, async (req, res, next) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }

        const comment = await createComment({
            blogId: req.params.blogId,
            authorId: req.user._id,
            authorName: req.user.displayName || req.user.email.split('@')[0],
            authorEmail: req.user.email,
            authorPhotoURL: req.user.photoURL || null,
            content: content.trim()
        });

        res.status(201).json({
            success: true,
            data: comment
        });
    } catch (error) {
        next(error);
    }
});

// Protected: Delete a comment
router.delete('/:commentId', protect, async (req, res, next) => {
    try {
        const result = await deleteComment(req.params.commentId, req.user._id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        if (error.message === 'Not authorized to delete this comment') {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
});

export default router;

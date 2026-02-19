import {
    createBlog,
    findAllPublishedBlogs,
    findBlogsByAuthor,
    findBlogById,
    updateBlog,
    deleteBlog,
    incrementViews,
    toggleLike,
    getUserStats
} from '../services/blog.service.js';

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Private
export const createBlogPost = async (req, res, next) => {
    try {
        console.log('Request Body:', req.body);
        const { title, content, category, tags, coverImage } = req.body;

        const blog = await createBlog({
            title,
            content,
            category,
            tags,
            coverImage,
            author: req.user._id,
            authorName: req.user.displayName || req.user.email.split('@')[0],
            authorEmail: req.user.email,
            authorPhotoURL: req.user.photoURL || null
        });

        res.status(201).json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error("SAVE ERROR 👉", error);

        // Mongoose validation errors (missing title/content, etc.)
        if (error?.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                details: Object.values(error.errors || {}).map(e => e.message)
            });
        }

        // Connection / buffering timeouts often show up as MongoServerSelectionError
        const message = error?.message || 'Failed to save blog';
        return res.status(500).json({
            success: false,
            message: 'Failed to save blog',
            error: process.env.NODE_ENV !== 'production' ? message : undefined
        });
    }
};

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await findAllPublishedBlogs(50);

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's blogs
// @route   GET /api/blogs/my-blogs
// @access  Private
export const getMyBlogs = async (req, res, next) => {
    try {
        const blogs = await findBlogsByAuthor(req.user._id);

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = async (req, res, next) => {
    try {
        const blog = await findBlogById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Increment views
        await incrementViews(req.params.id);
        blog.views = (blog.views || 0) + 1;

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlogPost = async (req, res, next) => {
    try {
        let blog = await findBlogById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Make sure user is blog owner
        if (blog.authorId !== req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this blog'
            });
        }

        blog = await updateBlog(req.params.id, req.body);

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlogPost = async (req, res, next) => {
    try {
        const blog = await findBlogById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Make sure user is blog owner
        if (blog.authorId !== req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this blog'
            });
        }

        await deleteBlog(req.params.id);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Like/Unlike blog
// @route   POST /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req, res, next) => {
    try {
        const blog = await findBlogById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        const result = await toggleLike(req.params.id, req.user._id);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user stats
// @route   GET /api/blogs/stats/user
// @access  Private
export const getStatsForUser = async (req, res, next) => {
    try {
        const stats = await getUserStats(req.user._id);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

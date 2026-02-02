import Blog from '../models/Blog.js';

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res, next) => {
    try {
        const { title, content, category, tags, coverImage } = req.body;

        const blog = await Blog.create({
            title,
            content,
            category,
            tags,
            coverImage,
            author: req.user._id,
            authorName: req.user.displayName || req.user.email.split('@')[0],
            authorEmail: req.user.email
        });

        res.status(201).json({
            success: true,
            data: blog
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({ published: true })
            .populate('author', 'displayName email')
            .sort({ publishedAt: -1 })
            .limit(50);

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
        const blogs = await Blog.find({ author: req.user._id })
            .sort({ createdAt: -1 });

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
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'displayName email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Increment views
        blog.views += 1;
        await blog.save();

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
export const updateBlog = async (req, res, next) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Make sure user is blog owner
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this blog'
            });
        }

        blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

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
export const deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Make sure user is blog owner
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this blog'
            });
        }

        await blog.deleteOne();

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
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        const likeIndex = blog.likes.indexOf(req.user._id);

        if (likeIndex > -1) {
            // Unlike
            blog.likes.splice(likeIndex, 1);
        } else {
            // Like
            blog.likes.push(req.user._id);
        }

        await blog.save();

        res.status(200).json({
            success: true,
            data: {
                likes: blog.likes.length,
                isLiked: likeIndex === -1
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user stats
// @route   GET /api/blogs/stats/user
// @access  Private
export const getUserStats = async (req, res, next) => {
    try {
        const blogs = await Blog.find({ author: req.user._id });

        const stats = {
            totalPosts: blogs.length,
            totalViews: blogs.reduce((sum, blog) => sum + blog.views, 0),
            totalLikes: blogs.reduce((sum, blog) => sum + blog.likes.length, 0),
            followers: 0
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

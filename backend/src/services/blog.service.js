import Blog from '../models/Blog.js';

// Helper function to strip HTML tags
const stripHtml = (html) => {
    return html.replace(/<[^>]*>?/gm, '');
};

// Helper function to calculate read time
const calculateReadTime = (content) => {
    const plainText = stripHtml(content);
    const wordsPerMinute = 200;
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
};

// Helper function to generate excerpt
const generateExcerpt = (content, maxLength = 200) => {
    const plainText = stripHtml(content);
    return plainText.substring(0, maxLength).trim() + '...';
};

export const createBlog = async (blogData) => {
    const { title, content, category, tags, coverImage, author, authorName, authorEmail, authorPhotoURL } = blogData;

    const readTime = calculateReadTime(content);
    const excerpt = generateExcerpt(content);

    const blog = await Blog.create({
        title,
        content,
        excerpt,
        category: category || 'General',
        tags: tags || [],
        coverImage: coverImage || null,
        authorId: author,
        authorName,
        authorEmail,
        authorPhotoURL: authorPhotoURL || null,
        readTime,
        views: 0,
        likes: [],
        likescount: 0,
        commentscount: 0,
        published: true,
        publishedAt: new Date()
    });

    return {
        _id: blog._id,
        ...blog.toObject()
    };
};

export const findAllPublishedBlogs = async (limit = 50, query = null) => {
    let filter = { published: true };

    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { excerpt: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } },
            { authorName: { $regex: query, $options: 'i' } }
        ];
    }

    const blogs = await Blog.find(filter)
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();

    return blogs;
};

export const findBlogsByAuthor = async (authorId) => {
    const blogs = await Blog.find({ authorId })
        .sort({ createdAt: -1 })
        .lean();

    return blogs;
};

export const findBlogById = async (blogId) => {
    const blog = await Blog.findById(blogId).lean();
    return blog || null;
};

export const updateBlog = async (blogId, updateData) => {
    // Recalculate read time and excerpt if content is updated
    if (updateData.content) {
        updateData.readTime = calculateReadTime(updateData.content);
        if (!updateData.excerpt) {
            updateData.excerpt = generateExcerpt(updateData.content);
        }
    }

    const blog = await Blog.findByIdAndUpdate(
        blogId,
        { ...updateData },
        { new: true, runValidators: true }
    ).lean();

    return blog;
};

export const deleteBlog = async (blogId) => {
    await Blog.findByIdAndDelete(blogId);
};

export const incrementViews = async (blogId) => {
    await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
};

export const toggleLike = async (blogId, userId) => {
    const blog = await Blog.findById(blogId);

    if (!blog) return null;

    const likes = blog.likes || [];
    const likeIndex = likes.indexOf(userId);

    let isLiked;
    if (likeIndex > -1) {
        likes.splice(likeIndex, 1);
        isLiked = false;
    } else {
        likes.push(userId);
        isLiked = true;
    }

    blog.likes = likes;
    blog.likescount = likes.length;
    await blog.save();

    return {
        likes: likes.length,
        isLiked
    };
};

export const toggleSave = async (blogId, userId) => {
    const blog = await Blog.findById(blogId);

    if (!blog) return null;

    const saves = blog.saves || [];
    const saveIndex = saves.indexOf(userId);
    let isSaved = false;

    if (saveIndex > -1) {
        // Unsave
        saves.splice(saveIndex, 1);
        isSaved = false;
    } else {
        // Save
        saves.push(userId);
        isSaved = true;
    }

    blog.saves = saves;
    blog.saveCount = saves.length;
    await blog.save();

    // Also update User's savedPosts
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);

    if (user) {
        if (isSaved) {
            if (!user.savedPosts.includes(blogId)) {
                user.savedPosts.push(blogId);
            }
        } else {
            user.savedPosts = user.savedPosts.filter(id => id.toString() !== blogId.toString());
        }
        await user.save();
    }

    return {
        saveCount: saves.length,
        isSaved
    };
};

export const repostBlog = async (originalBlogId, userId) => {
    const originalBlog = await Blog.findById(originalBlogId);
    if (!originalBlog) throw new Error('Original blog not found');

    // Prevent reposting a repost (link to original instead)
    const sourceBlogId = originalBlog.isRepost ? originalBlog.originalPostId : originalBlog._id;
    const sourceAuthorId = originalBlog.isRepost ? originalBlog.originalAuthor : originalBlog.authorId;

    // Check if already reposted by this user
    const existingRepost = await Blog.findOne({
        repostedBy: userId,
        originalPostId: sourceBlogId
    });

    if (existingRepost) {
        throw new Error('You have already reposted this story');
    }

    const User = (await import('../models/User.js')).default;
    const reposter = await User.findById(userId);

    // Resolve original author's MongoDB _id if sourceAuthorId is a Firebase UID
    let resolvedOriginalAuthorId = sourceAuthorId;
    const mongoose = (await import('mongoose')).default;

    if (!mongoose.Types.ObjectId.isValid(sourceAuthorId)) {
        const originalUser = await User.findOne({ firebaseUid: sourceAuthorId });
        if (originalUser) {
            resolvedOriginalAuthorId = originalUser._id;
        } else {
            console.warn(`Could not resolve original author ID: ${sourceAuthorId}`);
            // Fallback or throw? For now let it fail if strict, or set null?
            // If schema requires ObjectId, this will still fail if we leave it as string.
            // But if we can't find the user, we can't link effectively.
        }
    }

    const repost = new Blog({
        title: originalBlog.title,
        content: originalBlog.content,
        excerpt: originalBlog.excerpt,
        category: originalBlog.category,
        tags: originalBlog.tags,
        coverImage: originalBlog.coverImage,
        authorId: originalBlog.authorId, // Keep original string ID for display/consistency if needed
        authorName: originalBlog.authorName,
        authorEmail: originalBlog.authorEmail,
        authorPhotoURL: originalBlog.authorPhotoURL,
        readTime: originalBlog.readTime,

        isRepost: true,
        originalAuthor: resolvedOriginalAuthorId,
        originalPostId: sourceBlogId,
        repostedBy: userId,
        repostedAt: new Date(),

        views: 0,
        likes: [],
        likescount: 0,
        commentscount: 0,
        published: true,
        publishedAt: new Date()
    });

    await repost.save();
    return repost;
};

export const updateReadTime = async (blogId, durationSeconds) => {
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) return { success: false, message: 'Blog not found' };

        blog.totalReadTime = (blog.totalReadTime || 0) + durationSeconds;

        // Count as a "read" if duration is significant (> 30s or > 50% of estimated read time)
        const estimatedSeconds = (blog.readTime || 1) * 60;
        if (durationSeconds > 30 || durationSeconds > (estimatedSeconds * 0.5)) {
            blog.totalReads = (blog.totalReads || 0) + 1;
        }

        await blog.save();
        return { success: true };
    } catch (error) {
        console.error('Update Read Time Error:', error);
        return { success: false, error: error.message };
    }
};

export const getUserStats = async (authorId) => {
    const blogs = await findBlogsByAuthor(authorId);

    const stats = {
        totalPosts: blogs.length,
        totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
        totalLikes: blogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0),
        followers: 0
    };

    return stats;
};

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

export const findAllPublishedBlogs = async (limit = 50) => {
    const blogs = await Blog.find({ published: true })
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

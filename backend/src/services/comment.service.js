import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';

export const createComment = async (commentData) => {
    const { blogId, authorId, authorName, authorEmail, authorPhotoURL, content } = commentData;

    const comment = await Comment.create({
        blogId,
        authorId,
        authorName,
        authorEmail,
        authorPhotoURL: authorPhotoURL || null,
        content
    });

    // Increment comment count on the blog
    await Blog.findByIdAndUpdate(blogId, { $inc: { commentscount: 1 } });

    return comment.toObject();
};

export const getCommentsByBlog = async (blogId) => {
    const comments = await Comment.find({ blogId })
        .sort({ createdAt: -1 })
        .lean();

    return comments;
};

export const deleteComment = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);

    if (!comment) return null;

    if (comment.authorId !== userId) {
        throw new Error('Not authorized to delete this comment');
    }

    await Comment.findByIdAndDelete(commentId);

    // Decrement comment count on the blog
    await Blog.findByIdAndUpdate(comment.blogId, { $inc: { commentscount: -1 } });

    return { deleted: true };
};

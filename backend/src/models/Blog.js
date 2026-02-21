import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    excerpt: {
        type: String
    },
    category: {
        type: String,
        default: 'General'
    },
    tags: {
        type: [String],
        default: []
    },
    coverImage: {
        type: String,
        default: null
    },
    authorId: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    authorPhotoURL: {
        type: String,
        default: null
    },
    readTime: {
        type: Number,
        default: 1
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: [String],
        default: []
    },
    likescount: {
        type: Number,
        default: 0
    },
    commentscount: {
        type: Number,
        default: 0
    },
    published: {
        type: Boolean,
        default: true
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    totalReadTime: {
        type: Number,
        default: 0
    },
    totalReads: {
        type: Number,
        default: 0
    },

    // New Features
    isRepost: {
        type: Boolean,
        default: false
    },
    originalAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    originalPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    },
    repostedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    repostedAt: {
        type: Date
    },
    saves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    saveCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

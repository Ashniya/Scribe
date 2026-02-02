import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    excerpt: {
        type: String,
        maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    category: {
        type: String,
        default: 'General'
    },
    tags: [{
        type: String
    }],
    coverImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop'
    },
    readTime: {
        type: Number, // in minutes
        default: 5
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    published: {
        type: Boolean,
        default: true
    },
    publishedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate read time before saving
blogSchema.pre('save', function (next) {
    if (this.content) {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / wordsPerMinute);

        // Generate excerpt if not provided
        if (!this.excerpt) {
            this.excerpt = this.content.substring(0, 200) + '...';
        }
    }
    next();
});

export default mongoose.model('Blog', blogSchema);

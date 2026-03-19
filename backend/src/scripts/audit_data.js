
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, '../.env.backend') });

import Blog from '../models/Blog.js';
import User from '../models/User.js';

async function audit() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('CONNECTED');

        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ published: true });
        console.log(`TOTAL BLOGS: ${totalBlogs}`);
        console.log(`PUBLISHED BLOGS: ${publishedBlogs}`);

        const sampleBlogs = await Blog.find().limit(5).lean();
        sampleBlogs.forEach((b, i) => {
            console.log(`BLOG ${i}: title="${b.title}", authorId=${b.authorId}, type=${typeof b.authorId}, published=${b.published}`);
        });

        const usersWithBlogs = await Blog.distinct('authorId');
        console.log(`UNIQUE AUTHOR IDs IN BLOGS: ${usersWithBlogs.join(', ')}`);

        const totalUsers = await User.countDocuments();
        console.log(`TOTAL USERS: ${totalUsers}`);
        const sampleUsers = await User.find().limit(5).lean();
        sampleUsers.forEach((u, i) => {
            console.log(`USER ${i}: email=${u.email}, _id=${u._id}, firebaseUid=${u.firebaseUid}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

audit();

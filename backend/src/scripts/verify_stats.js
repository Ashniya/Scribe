import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from '../models/Blog.js';
import User from '../models/User.js';

dotenv.config(); // Use default .env

const verifyStats = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to DB');

        // Get a user to test with
        const user = await User.findOne();
        if (!user) {
            console.log('❌ No users found to test with.');
            process.exit(0);
        }

        const userId = user._id;
        console.log(`🔍 Testing stats for user: ${user.username} (${userId})`);

        // Check if query matches
        const count = await Blog.countDocuments({
            $or: [
                { authorId: userId },
                { authorId: userId.toString() }
            ]
        });

        console.log(`📊 Matched ${count} blogs for this user.`);

        // Test the service logic
        const { getUserStats } = await import('../services/blog.service.js');
        const stats = await getUserStats(user);
        console.log('📈 Stats Result:', JSON.stringify(stats, null, 2));

        await mongoose.disconnect();
        console.log('✅ Verification complete');
        process.exit(0);
    } catch (err) {
        console.error('❌ Verification failed:', err);
        process.exit(1);
    }
};

verifyStats();

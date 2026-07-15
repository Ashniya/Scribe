
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config({ path: '.env.backend' });

// Hardcode for test since env might be tricky in this context
const MONGODB_URI = 'mongodb+srv://aditi:Universe27@scribe-cluster.ltzbd0x.mongodb.net/scribe?retryWrites=true&w=majority';
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const listUsers = async () => {
    await connectDB();
    try {
        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(user => {
            console.log(`- ${user.username} (${user.displayName})`);
        });
    } catch (error) {
        console.error('Error listing users:', error);
    } finally {
        process.exit();
    }
};

listUsers();

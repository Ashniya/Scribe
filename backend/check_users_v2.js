
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();
dotenv.config({ path: '.env.backend' });

const checkUsers = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI is missing');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const users = await User.find({});
        console.log(`\nFound ${users.length} users in MongoDB:`);

        users.forEach(u => {
            console.log(`- ${u.username} (${u.email}) [FirebaseUID: ${u.firebaseUid || 'N/A'}]`);
        });

        // Check specific users mentioned by user
        const specificEmails = [
            'abcd@gmail.com',
            'abc@gmail.com',
            'ashniyaalosious@gmail.com',
            'vaibhavv894@gmail.com',
            'aditiverma11448@gmail.com'
        ];

        console.log('\nChecking specific Firebase emails:');
        specificEmails.forEach(email => {
            const found = users.find(u => u.email === email);
            console.log(`${email}: ${found ? '✅ FOUND' : '❌ MISSING'}`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkUsers();

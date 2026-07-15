
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';
import User from './src/models/User.js';

dotenv.config();
dotenv.config({ path: '.env.backend' });

const serviceAccount = JSON.parse(
    fs.readFileSync('./ScribeServiceAccountKey.json', 'utf8')
);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const syncUsers = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI is missing');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        console.log('📥 Fetching users from Firebase...');
        const listUsersResult = await admin.auth().listUsers(1000);
        const firebaseUsers = listUsersResult.users;
        console.log(`Found ${firebaseUsers.length} users in Firebase.`);

        let createdCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        for (const fbUser of firebaseUsers) {
            const email = fbUser.email ? fbUser.email.toLowerCase() : null;
            if (!email) {
                console.log(`⚠️ Skipping user without email: ${fbUser.uid}`);
                continue;
            }

            // Check if user exists in MongoDB
            let user = await User.findOne({
                $or: [
                    { firebaseUid: fbUser.uid },
                    { email: email }
                ]
            });

            if (!user) {
                // CREATE NEW USER
                console.log(`🆕 Creating user: ${email} (${fbUser.displayName || 'No Name'})`);

                let username = email.split('@')[0].replace(/[^a-z0-9_]/g, '_');
                // Ensure username uniqueness
                let counter = 1;
                while (await User.findOne({ username })) {
                    username = `${email.split('@')[0].replace(/[^a-z0-9_]/g, '_')}${counter}`;
                    counter++;
                }

                user = new User({
                    firebaseUid: fbUser.uid,
                    email: email,
                    displayName: fbUser.displayName || username,
                    username: username,
                    photoURL: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.displayName || username)}&background=random`,
                    provider: 'firebase', // Or deduce from providerData
                    isVerified: fbUser.emailVerified
                });

                await user.save();
                createdCount++;
            } else {
                // Update existing user if missing firebaseUid
                if (!user.firebaseUid) {
                    console.log(`🔄 Updating user (adding identifiers): ${email}`);
                    user.firebaseUid = fbUser.uid;
                    await user.save();
                    updatedCount++;
                } else {
                    // console.log(`cw Skipped existing user: ${email}`);
                    skippedCount++;
                }
            }
        }

        console.log('\n-----------------------------------');
        console.log(`Sync Complete:`);
        console.log(`✅ Created: ${createdCount}`);
        console.log(`🔄 Updated: ${updatedCount}`);
        console.log(`⏭️ Skipped: ${skippedCount}`);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('Check Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

syncUsers();

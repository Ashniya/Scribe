/**
 * Migration: Fix authorId on old blog documents
 * 
 * Old blogs were created with authorId set to a Firebase UID string (e.g. "C4iLZMOCSPf9Kn0bwFiizLuiga13").
 * The Blog schema expects authorId to be a MongoDB ObjectId referencing the User model.
 * 
 * This script:
 *   1. Finds all blogs where authorId is not a valid ObjectId (i.e., stored as a Firebase UID)
 *   2. For each, finds the matching User by firebaseUid
 *   3. Updates blog.authorId to the User's MongoDB _id
 * 
 * Usage (from backend directory):
 *   node src/scripts/migrate-authorid.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env.backend') });

import Blog from '../models/Blog.js';
import User from '../models/User.js';

async function migrate() {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI not set in .env.backend');
        process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Fetch all blogs as plain objects
    const allBlogs = await Blog.find({}).lean();

    let fixed = 0;
    let skipped = 0;
    let notFound = 0;

    for (const blog of allBlogs) {
        const authorId = blog.authorId?.toString();
        if (!authorId) { skipped++; continue; }

        // If it's already a valid ObjectId, no action needed
        if (mongoose.Types.ObjectId.isValid(authorId) && authorId.length === 24) {
            skipped++;
            continue;
        }

        // authorId is a Firebase UID — find the matching User
        const user = await User.findOne({ firebaseUid: authorId }).lean();
        if (!user) {
            console.warn(`  ⚠️  No User found for Firebase UID: ${authorId} (blog: "${blog.title}")`);
            notFound++;
            continue;
        }

        await Blog.updateOne(
            { _id: blog._id },
            {
                $set: {
                    authorId: user._id,
                    // Also backfill slug if missing
                    ...(blog.slug ? {} : {
                        slug: blog.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '')
                            + '-' + blog._id.toString().slice(-6)
                    })
                }
            }
        );

        console.log(`  ✅ Fixed: "${blog.title}" → authorId set to ${user._id} (${user.displayName})`);
        fixed++;
    }

    console.log(`\n📊 Migration complete:`);
    console.log(`   Fixed:     ${fixed} blogs`);
    console.log(`   Skipped:   ${skipped} blogs (already had valid ObjectId)`);
    console.log(`   Not found: ${notFound} blogs (Firebase user not in MongoDB)`);

    await mongoose.disconnect();
    process.exit(0);
}

migrate().catch((err) => {
    console.error('❌ Migration failed:', err);
    mongoose.disconnect();
    process.exit(1);
});


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root (parent of scripts/)
dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;

console.log('Testing MongoDB Connection...');
console.log('URI:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'undefined'); // Hide password in logs

if (!uri) {
    console.error('❌ MONGODB_URI is missing in .env');
    process.exit(1);
}

const connect = async () => {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Connection Successful!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        console.error('Full Error:', error);
        process.exit(1);
    }
};

connect();

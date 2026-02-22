import mongoose from 'mongoose';

const connectDB = async (retryCount = 0) => {
    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 5000;

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('❌ MONGODB_URI is not set. Add it to backend/.env');
            return; // Don't crash the server, just skip DB
        }

        // Common setup mistake: leaving the placeholder in the URI
        if (
            uri.includes('<db_password>') ||
            uri.includes('<password>') ||
            uri.includes('YOUR_ATLAS_PASSWORD')
        ) {
            console.error('❌ MONGODB_URI still contains a password placeholder.');
            return;
        }

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        if (retryCount < MAX_RETRIES) {
            console.log(`🔄 Retrying DB connection in ${RETRY_DELAY_MS / 1000}s... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
            setTimeout(() => connectDB(retryCount + 1), RETRY_DELAY_MS);
        } else {
            console.error('❌ Max DB retries reached. Server is running WITHOUT database. Publishing will fail until DB is restored.');
        }
    }
};

export default connectDB;

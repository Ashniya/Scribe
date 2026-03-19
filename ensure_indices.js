const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

async function run() {
    dotenv.config({ path: path.join(__dirname, 'backend', '.env.backend') });
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to', uri.split('@').pop());

    await mongoose.connect(uri);
    console.log('Connected');

    const Blog = mongoose.model('Blog', new mongoose.Schema({
        publishedAt: Date,
        authorId: mongoose.Schema.Types.Mixed
    }, { strict: false }));

    const count = await Blog.countDocuments();
    console.log('Count:', count);

    console.log('Ensuring indices...');
    await Blog.collection.createIndex({ publishedAt: -1 });
    await Blog.collection.createIndex({ authorId: 1 });
    await Blog.collection.createIndex({ createdAt: -1 });
    console.log('Indices created');

    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});

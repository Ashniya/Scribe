
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './src/models/Blog.js';

dotenv.config();

const DISTRIBUTION = {
    "Self Improvement": 20,
    "Study / Productivity": 15,
    "Tech": 15,
    "Career / Placement": 12,
    "Mental Health / Mindset": 12,
    "Student Life": 10,
    "Motivation / Life Lessons": 10,
    "Finance / Money Basics": 8,
    "Communication Skills": 8,
    "Health / Lifestyle": 8,
    "AI / Future Tech": 6,
    "Coding Basics": 6
};

// Content Templates to ensure variety and relevance
const TEMPLATES = {
    "Self Improvement": [
        { title: "Atomic Habits for Success", content: "Small changes can lead to remarkable results. Focus on getting 1% better every day." },
        { title: "The Power of Morning Routines", content: "Start your day with intention. A solid morning routine sets the tone for everything else." },
        { title: "Overcoming Procrastination", content: "Stop waiting for the perfect moment. Action cures fear and procrastination." },
        { title: "Journaling for Mental Clarity", content: "Writing down your thoughts helps clear your mind and organize your life." },
        { title: "Building Unshakeable Confidence", content: "Confidence comes from competence. Learn, practice, and master your craft." }
    ],
    "Study / Productivity": [
        { title: "The Pomodoro Technique Guide", content: "Boost your focus by working in short, intense bursts followed by breaks." },
        { title: "Active Recall Study Method", content: "Don't just re-read. Test yourself. This is the most effective way to learn." },
        { title: "Deep Work in a Distracted World", content: "Master the art of focusing on cognitively demanding tasks without distraction." },
        { title: "Digital Note-Taking Systems", content: "Organize your knowledge effectively using tools like Notion or Obsidian." }
    ],
    "Tech": [
        { title: "The State of Web Development", content: "How modern frameworks like React and Next.js are changing how we build the web." },
        { title: "Understanding Cloud Computing", content: "AWS, Azure, and Google Cloud: What you need to know about the backbone of the internet." },
        { title: "Cybersecurity Best Practices", content: "Protect your digital identity with strong passwords and 2FA." },
        { title: "The Rise of Open Source", content: "Why contributing to open source software benefits your career and the community." }
    ],
    "Career / Placement": [
        { title: "Acing the Technical Interview", content: "Data structures and algorithms are just one part. Communication is key." },
        { title: "Resume Tips for 2024", content: "Keep it concise, quantify your achievements, and tailor it to the job description." },
        { title: "Networking for Introverts", content: "Building professional relationships doesn't have to be scary or fake." },
        { title: "Negotiating Your Salary", content: "Don't leave money on the table. Know your worth and ask for it confidently." }
    ],
    "Mental Health / Mindset": [
        { title: "Managing Academic Stress", content: "Burnout is real. Learn to recognize the signs and take breaks before you break." },
        { title: "The Growth Mindset", content: "Believe that your abilities can be developed through dedication and hard work." },
        { title: "Practicing Mindfulness", content: "Stay present in the moment to reduce anxiety and improve focus." }
    ],
    "Student Life": [
        { title: "Balancing Work and Study", content: "Time management tips for students juggling part-time jobs and classes." },
        { title: "Budgeting for Students", content: "How to save money on textbooks, food, and entertainment." },
        { title: "Making the Most of College", content: "Join clubs, meet new people, and step out of your comfort zone." }
    ],
    "Motivation / Life Lessons": [
        { title: "Lessons from Failure", content: "Failure is not the opposite of success; it's part of the journey." },
        { title: "Finding Your Passion", content: "Explore different interests until you find what lights you up." },
        { title: "The Value of Patience", content: "Great things take time. Don't rush the process." }
    ],
    "Finance / Money Basics": [
        { title: "Introduction to Investing", content: "Compound interest is the eighth wonder of the world. Start early." },
        { title: "Smart Saving Strategies", content: "Pay yourself first. Automate your savings to build wealth effortlessly." },
        { title: "Understanding Credit Scores", content: "Your credit score impacts your financial future. Use credit wisely." }
    ],
    "Communication Skills": [
        { title: "Public Speaking 101", content: "Conquer your fear of public speaking with preparation and practice." },
        { title: "The Art of Listening", content: "Listening is more important than speaking. Seek first to understand." },
        { title: "Effective Email Communication", content: "Write clear, concise, and professional emails that get responses." }
    ],
    "Health / Lifestyle": [
        { title: "Clean Eating for Beginners", content: "Fuel your body with whole foods for sustained energy and health." },
        { title: "The Importance of Sleep", content: "Sleep is when your brain consolidates learning. Prioritize rest." },
        { title: "Fitness for Busy People", content: "Short, high-intensity workouts can be just as effective as long gym sessions." }
    ],
    "AI / Future Tech": [
        { title: "Generative AI Revolution", content: "How tools like ChatGPT and Midjourney are transforming creativity." },
        { title: "Ethics in AI", content: "Addressing the bias and privacy concerns in artificial intelligence." },
        { title: "The Future of Work with AI", content: "Will robots take our jobs? Or will they help us do them better?" }
    ],
    "Coding Basics": [
        { title: "Python vs JavaScript", content: "Which language should you learn first? A comparison for beginners." },
        { title: "Understanding APIs", content: "How software talks to software: REST, GraphQL, and Webhooks." },
        { title: "Git and Version Control", content: "Save your work and collaborate with others using Git and GitHub." }
    ]
};

// Placeholder images source
const getImage = (category, seed) => `https://picsum.photos/seed/${category.replace(/[^a-z]/gi, '')}${seed}/800/600`;

const AUTHORS = [
    { name: "John Doe", email: "john@example.com", id: "seed-1" },
    { name: "Jane Smith", email: "jane@example.com", id: "seed-2" },
    { name: "Alex Johnson", email: "alex@example.com", id: "seed-3" },
    { name: "Emily Davis", email: "emily@example.com", id: "seed-4" },
    { name: "Michael Brown", email: "michael@example.com", id: "seed-5" }
];

const generateBlogs = () => {
    const blogs = [];

    Object.entries(DISTRIBUTION).forEach(([category, count]) => {
        const templates = TEMPLATES[category] || [{ title: `${category} Guide`, content: `Essential insights about ${category}.` }];

        for (let i = 0; i < count; i++) {
            const template = templates[i % templates.length];
            const author = AUTHORS[i % AUTHORS.length];

            // Add slight variation to title if we run out of templates
            const suffix = Math.floor(i / templates.length) > 0 ? ` - Vol ${Math.floor(i / templates.length) + 1}` : "";

            blogs.push({
                title: `${template.title}${suffix}`,
                content: `${template.content} \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
                excerpt: template.content,
                category: category,
                tags: [category, "Guide", "Learn"],
                coverImage: getImage(category, i),
                authorId: author.id,
                authorName: author.name,
                authorEmail: author.email,
                readTime: Math.floor(Math.random() * 10) + 3,
                views: Math.floor(Math.random() * 2000) + 100,
                likescount: Math.floor(Math.random() * 500),
                publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)) // Random date in last 30 days
            });
        }
    });

    return blogs;
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Optional: Clear existing blogs to ensure exact distribution
        await Blog.deleteMany({ authorId: /^seed-/ });
        console.log('🧹 Cleared previous seed data');

        const blogs = generateBlogs();
        console.log(`🌱 Seeding ${blogs.length} blogs based on requested distribution...`);

        const docs = await Blog.insertMany(blogs);
        console.log(`✅ Successfully seeded ${docs.length} blogs!`);

        // Log distribution check
        const distribution = {};
        docs.forEach(b => {
            distribution[b.category] = (distribution[b.category] || 0) + 1;
        });
        console.table(distribution);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();

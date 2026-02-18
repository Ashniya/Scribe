import Blog from '../models/Blog.js';
import User from '../models/User.js';

// @desc    Get current user's stats
// @route   GET /api/stats/my-stats
// @access  Private
export const getMyStats = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // 1. Get User Data (Followers, Subscribers)
        const user = await User.findById(userId)
            .select('followerCount subscriberCount');

        // 2. Get Blog Data (Views, Likes, Reads, ReadTime)
        const blogs = await Blog.find({ authorId: userId });

        let totalViews = 0;
        let totalLikes = 0;
        let totalReads = 0; // Assuming 'reads' is a field or we estimate it
        let totalReadTime = 0; // Total time people spent reading (sum of views * readTime?) 
        // Note: Real "time spent" tracking requires a separate "TimeMeasurement" model or analytics service.
        // For now, we can approximate: totalReadTime = sum(views * blog.readTime)

        blogs.forEach(blog => {
            totalViews += (blog.views || 0);
            totalLikes += (blog.likescount || 0);
            totalReads += (blog.totalReads || 0);
            totalReadTime += (blog.totalReadTime || 0);
        });

        // Calculate Engagement
        const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : 0;

        // 3. Growth Data (Mock for now, or aggregate by date if we had a History model)
        // In a real app, we'd query an Analytics/Events collection.
        const growthData = [
            { name: 'Jan', subscribers: Math.floor(user.subscriberCount * 0.2), reads: Math.floor(totalReads * 0.1) },
            { name: 'Feb', subscribers: Math.floor(user.subscriberCount * 0.35), reads: Math.floor(totalReads * 0.25) },
            { name: 'Mar', subscribers: Math.floor(user.subscriberCount * 0.5), reads: Math.floor(totalReads * 0.4) },
            { name: 'Apr', subscribers: Math.floor(user.subscriberCount * 0.7), reads: Math.floor(totalReads * 0.6) },
            { name: 'May', subscribers: Math.floor(user.subscriberCount * 0.85), reads: Math.floor(totalReads * 0.8) },
            { name: 'Jun', subscribers: user.subscriberCount, reads: totalReads },
        ];

        // 4. Top Posts
        const topPosts = blogs
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 3)
            .map(blog => ({
                id: blog._id,
                title: blog.title,
                views: blog.views || 0,
                reads: blog.totalReads || 0,
                engagement: (blog.views > 0 ? ((blog.likescount / blog.views) * 100).toFixed(1) : 0) + '%'
            }));

        res.status(200).json({
            success: true,
            data: {
                subscriberCount: user.subscriberCount || 0,
                followerCount: user.followerCount || 0,
                totalReads,
                totalViews,
                engagement: engagementRate + '%',
                totalReadTime: (totalReadTime / 3600).toFixed(1) + ' hrs',
                growthData,
                topPosts
            }
        });

    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

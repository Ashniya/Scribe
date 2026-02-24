import Blog from '../models/Blog.js';
import User from '../models/User.js';

// Helper: build growth data from real blog dates
const buildGrowthData = (blogs, range) => {
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (range === 'weekly') {
        // Last 7 days, grouped by day
        const buckets = {};
        const labels = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
            const label = dayNames[d.getDay()];
            buckets[key] = { name: label, reads: 0, views: 0 };
            labels.push(key);
        }

        blogs.forEach(blog => {
            const created = new Date(blog.createdAt);
            const key = created.toISOString().slice(0, 10);
            if (buckets[key]) {
                buckets[key].reads += (blog.totalReads || 0);
                buckets[key].views += (blog.views || 0);
            }
        });

        return labels.map(key => buckets[key]);

    } else if (range === 'yearly') {
        // Group by year
        const buckets = {};
        const years = new Set();

        blogs.forEach(blog => {
            const year = new Date(blog.createdAt).getFullYear().toString();
            years.add(year);
            if (!buckets[year]) {
                buckets[year] = { name: year, reads: 0, views: 0 };
            }
            buckets[year].reads += (blog.totalReads || 0);
            buckets[year].views += (blog.views || 0);
        });

        // Sort years chronologically
        const sortedYears = [...years].sort();
        return sortedYears.map(y => buckets[y]);

    } else {
        // Monthly (default): last 12 months
        const buckets = {};
        const labels = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = monthNames[d.getMonth()];
            buckets[key] = { name: label, reads: 0, views: 0 };
            labels.push(key);
        }

        blogs.forEach(blog => {
            const created = new Date(blog.createdAt);
            const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`;
            if (buckets[key]) {
                buckets[key].reads += (blog.totalReads || 0);
                buckets[key].views += (blog.views || 0);
            }
        });

        return labels.map(key => buckets[key]);
    }
};

// @desc    Get current user's stats
// @route   GET /api/stats/my-stats?range=weekly|monthly|yearly
// @access  Private
export const getMyStats = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const range = req.query.range || 'monthly'; // weekly, monthly, yearly

        // 1. Get User Data (Followers, Subscribers)
        const user = await User.findById(userId)
            .select('followerCount subscriberCount');

        // 2. Get Blog Data (Views, Likes, Reads, ReadTime)
        const blogs = await Blog.find({ authorId: userId });

        let totalViews = 0;
        let totalLikes = 0;
        let totalReads = 0;
        let totalReadTime = 0;

        blogs.forEach(blog => {
            totalViews += (blog.views || 0);
            totalLikes += (blog.likescount || 0);
            totalReads += (blog.totalReads || 0);
            totalReadTime += (blog.totalReadTime || 0);
        });

        // Calculate Engagement
        const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : 0;

        // 3. Real Growth Data — aggregated from actual blog dates
        const growthData = buildGrowthData(blogs, range);

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

import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    AreaChart,
    Area
} from 'recharts';
import {
    Users,
    BookOpen,
    TrendingUp,
    Clock,
    MapPin,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Bell
} from 'lucide-react';
import { getMyStats } from '../utils/api';

export default function StatsContent() {
    const { isDark } = useContext(ThemeContext);
    const [timeRange, setTimeRange] = useState('monthly'); // weekly, monthly, yearly
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getMyStats();
                if (res.success) {
                    setStatsData(res.data);
                }
            } catch (err) {
                console.error('Failed to load stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Helper for soft text colors
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const borderColor = isDark ? 'border-slate-800' : 'border-gray-100';

    if (loading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'} flex justify-center items-center`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-scribe-pink"></div>
            </div>
        );
    }

    if (!statsData) return null;

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'} pb-20`}>
            <div className="mx-auto w-full md:w-5/12 lg:w-4/12 xl:w-1/3 transition-all duration-300 px-4 pt-8">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className={`text-4xl font-serif font-bold mb-2 ${textPrimary}`}>
                        Insights
                    </h1>
                    <p className={`text-sm ${textSecondary} font-sans`}>
                        Track your growth and audience engagement.
                    </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                    <MetricCard
                        title="Followers"
                        value={statsData.followerCount ?? statsData.followerCount ?? 0}
                        icon={Bell}
                        isDark={isDark}
                    />
                    <MetricCard
                        title="Total Reads"
                        value={statsData.totalReads}
                        icon={BookOpen}
                        isDark={isDark}
                    />
                    <MetricCard
                        title="Engagement"
                        value={statsData.engagement}
                        icon={TrendingUp}
                        isDark={isDark}
                    />
                    <MetricCard
                        title="Read Time"
                        value={statsData.totalReadTime}
                        icon={Clock}
                        isDark={isDark}
                    />
                </div>

                {/* Main Growth Graph */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-2xl font-serif font-bold ${textPrimary}`}>Growth</h2>
                        <div className={`flex gap-2 text-xs font-medium bg-gray-100 dark:bg-slate-800 p-1 rounded-full`}>
                            {['Weekly', 'Monthly', 'Yearly'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTimeRange(t.toLowerCase())}
                                    className={`px-3 py-1 rounded-full transition ${timeRange === t.toLowerCase() ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={statsData.growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e5e7eb'} opacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ color: isDark ? '#fff' : '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="subscribers"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="reads"
                                    stroke="#94a3b8"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className={`text-xs text-center mt-4 ${textSecondary}`}>
                        <span className="text-scribe-green font-medium">● Subscribers</span>
                        <span className="mx-2">vs</span>
                        <span className="text-slate-400 font-medium">● Reads</span>
                    </p>
                </div>

                {/* Top Posts */}
                <div className="space-y-12">
                    <div>
                        <h2 className={`text-2xl font-serif font-bold mb-6 ${textPrimary}`}>Top Posts</h2>
                        <div className="space-y-4">
                            {statsData.topPosts.length > 0 ? (
                                statsData.topPosts.map((post, index) => (
                                    <div key={post.id} className={`group p-4 rounded-xl border transition hover:shadow-sm ${borderColor} ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mb-2 ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-100 text-gray-700' : 'bg-orange-50 text-orange-700'}`}>
                                                    #{index + 1}
                                                </div>
                                                <h3 className={`font-serif font-medium text-lg leading-tight mb-2 ${textPrimary}`}>
                                                    {post.title}
                                                </h3>
                                                <div className={`flex gap-4 text-xs ${textSecondary}`}>
                                                    <span>{post.views} views</span>
                                                    <span>{post.reads} reads</span>
                                                </div>
                                            </div>
                                            <div className={`text-xl font-bold ${textPrimary} opacity-50 group-hover:opacity-100 transition`}>
                                                {post.engagement}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={`text-center py-8 ${textSecondary}`}>No posts yet.</div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Simple Metric Card Component
function MetricCard({ title, value, change, icon: Icon, isDark, trend }) {
    return (
        <div className={`p-4 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-100 bg-gray-50/50'} relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</span>
                <Icon className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <div className={`text-2xl font-bold mb-1 font-serif ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
            {change && (
                <div className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-scribe-green' : 'text-red-500'}`}>
                    {trend === 'up' ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                    {change}
                </div>
            )}
        </div>
    );
}

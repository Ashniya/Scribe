import React, { useState, useEffect, useContext } from 'react';
import { ArrowLeft, Heart, MessageSquare, Bookmark, Eye, Clock, Send, Trash2, MoreVertical, Edit3, Pin, Settings, BarChart3, EyeOff, MessageCircleOff, Share2, Linkedin, Instagram, Twitter, Facebook } from 'lucide-react';
import { auth } from '../config/firebase.js';

export default function ArticleView({ article, isDark, onClose, onLike, onSave, isLiked, isSaved, currentUser }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showArticleMenu, setShowArticleMenu] = useState(false);

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/comments/${article._id}`);
                const data = await res.json();
                if (data.success) {
                    setComments(data.data);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoadingComments(false);
            }
        };
        fetchComments();
    }, [article._id]);

    // Post comment
    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        const user = auth.currentUser;
        if (!user) {
            alert('Please log in to comment.');
            return;
        }

        setSubmitting(true);
        try {
            const token = await user.getIdToken(true);
            const res = await fetch(`http://localhost:5000/api/comments/${article._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newComment.trim() })
            });
            const data = await res.json();
            if (data.success) {
                setComments(prev => [data.data, ...prev]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete comment
    const handleDeleteComment = async (commentId) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const token = await user.getIdToken(true);
            const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setComments(prev => prev.filter(c => c._id !== commentId));
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Simple markdown-like rendering
    const renderContent = (text) => {
        if (!text) return '';
        return text
            .split('\n')
            .map((line, i) => {
                let html = line
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/_(.+?)_/g, '<em>$1</em>')
                    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-scribe-green underline" target="_blank" rel="noopener">$1</a>')
                    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl my-4" />')
                    .replace(/^• (.+)/, '<li class="ml-4">$1</li>');

                if (html.trim() === '') {
                    return <br key={i} />;
                }
                return <p key={i} className="mb-3" dangerouslySetInnerHTML={{ __html: html }} />;
            });
    };

    const timeAgo = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr}h ago`;
        const diffDay = Math.floor(diffHr / 24);
        if (diffDay < 30) return `${diffDay}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'} transition-colors`}>
            {/* Top Bar */}
            <div className={`sticky top-0 z-10 border-b ${isDark ? 'bg-slate-900/95 backdrop-blur border-slate-700' : 'bg-white/95 backdrop-blur border-gray-200'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={onLike}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition text-sm ${isLiked
                                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                                    : isDark ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                                {article.likescount || article.likes?.length || 0}
                            </button>
                            <button
                                onClick={onSave}
                                className={`p-2 rounded-full transition ${isSaved
                                    ? 'text-scribe-green'
                                    : isDark ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-scribe-green' : ''}`} />
                            </button>

                            {/* Article Menu (only for article owner) */}
                            {currentUser?.uid === article.authorId && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowArticleMenu(!showArticleMenu)}
                                        className={`p-2 rounded-full transition ${isDark ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>

                                    {showArticleMenu && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setShowArticleMenu(false)} />
                                            <div className={`absolute right-0 top-12 z-20 w-64 rounded-lg shadow-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                                                <button
                                                    onClick={() => { setShowArticleMenu(false); alert('Edit story - Coming soon!'); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isDark ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                    <span className="text-sm">Edit story</span>
                                                </button>
                                                <button
                                                    onClick={() => { setShowArticleMenu(false); alert('Pinned to profile!'); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isDark ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                                                >
                                                    <Pin className="w-4 h-4" />
                                                    <span className="text-sm">Pin this story to your profile</span>
                                                </button>
                                                <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`} />
                                                <button
                                                    onClick={() => { setShowArticleMenu(false); alert('Story settings - Coming soon!'); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isDark ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span className="text-sm">Story settings</span>
                                                </button>
                                                <button
                                                    onClick={() => { setShowArticleMenu(false); alert(`Views: ${article.views || 0}\nLikes: ${article.likescount || 0}\nComments: ${comments.length}`); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isDark ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                                                >
                                                    <BarChart3 className="w-4 h-4" />
                                                    <span className="text-sm">Story stats</span>
                                                </button>
                                                <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`} />
                                                <button
                                                    onClick={() => { setShowArticleMenu(false); alert('Highlights hidden'); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isDark ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                                                >
                                                    <EyeOff className="w-4 h-4" />
                                                    <span className="text-sm">Hide highlights</span>
                                                </button>
                                                <button
                                                    onClick={() => { setShowArticleMenu(false); alert('Responses hidden'); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isDark ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                                                >
                                                    <MessageCircleOff className="w-4 h-4" />
                                                    <span className="text-sm">Hide responses</span>
                                                </button>
                                                <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`} />
                                                <button
                                                    onClick={() => { setShowArticleMenu(false); if (confirm('Delete this story?')) alert('Story deleted!'); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition rounded-b-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-sm">Delete story</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
                {/* Category */}
                <div className="mb-4">
                    <span className="text-sm font-medium text-scribe-green px-3 py-1 rounded-full bg-scribe-green/10">
                        {article.category || 'General'}
                    </span>
                </div>

                {/* Title */}
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {article.title}
                </h1>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-8">
                    {article.authorPhotoURL ? (
                        <img
                            src={article.authorPhotoURL}
                            alt={article.authorName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-slate-600"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-bold text-lg">
                            {article.authorName?.[0]?.toUpperCase() || '?'}
                        </div>
                    )}
                    <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {article.authorName}
                        </h3>
                        <div className={`flex items-center gap-3 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {article.readTime} min read
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {article.views || 0} views
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cover Image */}
                {article.coverImage && (
                    <div className="mb-10 rounded-2xl overflow-hidden">
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full max-h-[500px] object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className={`prose prose-lg max-w-none leading-relaxed text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {renderContent(article.content)}
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bottom Actions */}
                <div className={`mt-12 pt-8 border-t flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition border ${isLiked
                                ? 'text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                                : isDark ? 'text-gray-400 border-slate-700 hover:bg-slate-800' : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
                            <span>{isLiked ? 'Liked' : 'Like'}</span>
                            <span className="font-medium">{article.likescount || article.likes?.length || 0}</span>
                        </button>
                        <span className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            <MessageSquare className="w-5 h-5" />
                            {comments.length} comments
                        </span>
                    </div>
                    <button
                        onClick={onSave}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition border ${isSaved
                            ? 'text-scribe-green border-scribe-green/30 bg-scribe-green/10'
                            : isDark ? 'text-gray-400 border-slate-700 hover:bg-slate-800' : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-scribe-green' : ''}`} />
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                </div>

                {/* Share Section */}
                <div className={`mt-8 pt-8 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Share2 className="w-5 h-5" />
                        Share this story
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {/* LinkedIn */}
                        <button
                            onClick={() => {
                                const url = encodeURIComponent(window.location.href);
                                const title = encodeURIComponent(article.title);
                                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${isDark ? 'bg-[#0077B5] hover:bg-[#006399] text-white' : 'bg-[#0077B5] hover:bg-[#006399] text-white'
                                }`}
                        >
                            <Linkedin className="w-4 h-4" />
                            <span>LinkedIn</span>
                        </button>

                        {/* Twitter */}
                        <button
                            onClick={() => {
                                const url = encodeURIComponent(window.location.href);
                                const text = encodeURIComponent(article.title);
                                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${isDark ? 'bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white' : 'bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white'
                                }`}
                        >
                            <Twitter className="w-4 h-4" />
                            <span>Twitter</span>
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={() => {
                                const url = encodeURIComponent(window.location.href);
                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${isDark ? 'bg-[#1877F2] hover:bg-[#166fe5] text-white' : 'bg-[#1877F2] hover:bg-[#166fe5] text-white'
                                }`}
                        >
                            <Facebook className="w-4 h-4" />
                            <span>Facebook</span>
                        </button>

                        {/* WhatsApp */}
                        <button
                            onClick={() => {
                                const url = encodeURIComponent(window.location.href);
                                const text = encodeURIComponent(`Check out this article: ${article.title}`);
                                window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${isDark ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white' : 'bg-[#25D366] hover:bg-[#20bd5a] text-white'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            <span>WhatsApp</span>
                        </button>

                        {/* Copy Link */}
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                }`}
                        >
                            <Share2 className="w-4 h-4" />
                            <span>Copy Link</span>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className={`mt-12 pt-8 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <MessageSquare className="w-5 h-5" />
                        Comments ({comments.length})
                    </h3>

                    {/* Comment Input */}
                    <div className={`mb-8 p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-start gap-3">
                            {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                    {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || '?'}
                                </div>
                            )}
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={currentUser ? "Write a comment..." : "Log in to comment"}
                                    disabled={!currentUser}
                                    rows={3}
                                    className={`w-full resize-none rounded-lg px-4 py-3 text-sm outline-none transition ${isDark
                                        ? 'bg-slate-700 text-white placeholder-gray-500 border-slate-600 focus:border-slate-500'
                                        : 'bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:border-gray-300'
                                        } border`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                            handlePostComment();
                                        }
                                    }}
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Ctrl+Enter to submit
                                    </span>
                                    <button
                                        onClick={handlePostComment}
                                        disabled={!newComment.trim() || submitting || !currentUser}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${newComment.trim() && !submitting && currentUser
                                            ? 'bg-gradient-to-r from-scribe-green to-scribe-sage text-white hover:shadow-md'
                                            : isDark ? 'bg-slate-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <Send className="w-4 h-4" />
                                        {submitting ? 'Posting...' : 'Comment'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    {loadingComments ? (
                        <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Loading comments...
                        </div>
                    ) : comments.length === 0 ? (
                        <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
                            <p>No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className={`flex gap-3 p-4 rounded-xl transition ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}
                                >
                                    {comment.authorPhotoURL ? (
                                        <img src={comment.authorPhotoURL} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-scribe-sage to-scribe-mint flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                            {comment.authorName?.[0]?.toUpperCase() || '?'}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {comment.authorName}
                                            </span>
                                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {timeAgo(comment.createdAt)}
                                            </span>
                                            {currentUser?.uid === comment.authorId && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="ml-auto text-gray-400 hover:text-red-500 transition p-1"
                                                    title="Delete comment"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}

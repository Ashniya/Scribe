import React, { useState, useEffect, useContext } from 'react';
import {
    X,
    Heart,
    MessageSquare,
    Share2,
    Bookmark,
    MoreHorizontal,
    Trash2,
    Send,
    Edit3,
    Trash
} from 'lucide-react';
import { format } from 'date-fns';
import FloatingReaction from './FloatingReaction';
import { getComments, addComment, likeComment, deleteComment } from '../utils/api';
import { ThemeContext } from '../context/ThemeContext';

export default function ArticleView({
    article,
    onClose,
    onLike,
    onSave,
    isLiked,
    isSaved,
    currentUser,
    onEdit,
    onDelete
}) {
    // Context for Theme (Lamp functionality)
    const { isDark, setIsDark } = useContext(ThemeContext);

    // State
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [isSwinging, setIsSwinging] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    // Floating reaction state
    const [showLikeReaction, setShowLikeReaction] = useState(false);
    const [showSaveReaction, setShowSaveReaction] = useState(false);

    // Fetch comments when article opens
    useEffect(() => {
        if (article?._id) {
            fetchComments();
        }
    }, [article?._id]);

    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            const response = await getComments(article._id);
            if (response.success) {
                setComments(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleThemeToggle = () => {
        setIsDark(!isDark);
        setIsSwinging(true);
        setTimeout(() => setIsSwinging(false), 1000);
    };

    const handleLike = () => {
        if (!isLiked) {
            setShowLikeReaction(true);
            setTimeout(() => setShowLikeReaction(false), 2500);
        }
        onLike();
    };

    const handleSave = () => {
        if (!isSaved) {
            setShowSaveReaction(true);
            setTimeout(() => setShowSaveReaction(false), 2500);
        }
        onSave();
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim()) return;
        try {
            const response = await addComment(article._id, commentText);
            if (response.success) {
                setComments([response.data, ...comments]);
                setCommentText('');
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const response = await likeComment(commentId);
            if (response.success) {
                setComments(comments.map(c =>
                    c._id === commentId ? response.data : c
                ));
            }
        } catch (error) {
            console.error("Failed to like comment", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await deleteComment(commentId);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: `Check out this article: ${article.title}`,
                url: window.location.href, // Or construct specific URL
            }).catch(console.error);
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    if (!article) return null;

    return (
        <div className={`fixed inset-0 z-[60] overflow-hidden ${isDark ? 'bg-slate-900/95' : 'bg-scribe-green/95'} backdrop-blur-sm`}>
            {/* Background elements for "desk" feel */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                backgroundImage: isDark
                    ? 'radial-gradient(circle at 50% 50%, #334155 1px, transparent 1px)'
                    : 'radial-gradient(circle at 50% 50%, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }}></div>

            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
            </div>

            {/* Scribe Title - Top Left */}
            <div className="fixed top-8 left-8 z-[70]">
                <h1 className="text-3xl font-bold text-white font-serif tracking-wide drop-shadow-md">
                    Scribe
                </h1>
            </div>

            <FloatingReaction type="like" active={showLikeReaction} />
            <FloatingReaction type="save" active={showSaveReaction} />

            {/* Lamp Toggle - Positioned Top Right */}
            <div className="fixed top-0 right-14 z-[70]">
                <button
                    onClick={handleThemeToggle}
                    className="relative w-20 h-32 flex flex-col items-center group"
                    aria-label="Toggle theme"
                >
                    <div className="w-0.5 h-10 bg-gray-800 dark:bg-gray-400 transition-colors duration-300"></div>
                    <div className={`relative ${isSwinging ? 'animate-lamp-swing' : ''}`}>
                        {!isDark && (
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 h-40 overflow-visible pointer-events-none">
                                <div className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-yellow-200/80 via-yellow-100/40 to-transparent transform -translate-x-1/2 animate-pulse" style={{ animationDuration: '2s' }}></div>
                                <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 -rotate-20" style={{ animationDuration: '2.2s' }}></div>
                                <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 -rotate-35 animate-pulse" style={{ animationDuration: '2.5s' }}></div>
                                <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/60 via-yellow-100/30 to-transparent transform origin-top -translate-x-1/2 rotate-20 animate-pulse" style={{ animationDuration: '2.3s' }}></div>
                                <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-200/40 via-yellow-100/20 to-transparent transform origin-top -translate-x-1/2 rotate-35 animate-pulse" style={{ animationDuration: '2.6s' }}></div>
                            </div>
                        )}
                        <svg width="60" height="50" viewBox="0 0 60 50" className="relative drop-shadow-lg">
                            <rect x="27" y="0" width="6" height="4" fill={isDark ? "#374151" : "#1f2937"} rx="1" />
                            <path d="M 15 6 L 45 6 L 50 18 Q 50 20, 48 20 L 12 20 Q 10 20, 10 18 Z" fill={isDark ? "#374151" : "#1f2937"} stroke={isDark ? "#1f2937" : "#111827"} strokeWidth="1" className="transition-all duration-500" />
                            <ellipse cx="30" cy="20" rx="19" ry="2" fill={isDark ? "#1f2937" : "#111827"} opacity="0.8" />
                            {!isDark && (
                                <>
                                    <circle cx="30" cy="26" r="6" fill="#fef3c7" opacity="0.9" className="animate-pulse" />
                                    <circle cx="30" cy="26" r="4" fill="url(#bulbGradientView)" />
                                    <circle cx="29" cy="25" r="1.5" fill="#fffbeb" />
                                </>
                            )}
                            <defs>
                                <radialGradient id="bulbGradientView" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#fef3c7" />
                                    <stop offset="100%" stopColor="#fde68a" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                </button>
            </div>

            {/* Main Scrollable Area */}
            <div className="absolute inset-0 overflow-y-auto">
                <div className="min-h-full py-12 px-4 flex justify-center">

                    {/* "Letter" Container */}
                    <div className={`
                        relative w-full max-w-3xl mx-auto 
                        shadow-2xl rounded-xl overflow-hidden
                        transition-all duration-300
                        ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-900'}
                        ${showComments ? 'mr-[400px]' : ''} 
                    `}>
                        {/* Header Controls */}
                        <div className={`sticky top-0 left-0 right-0 h-16 border-b flex items-center justify-between px-6 z-40 ${isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-gray-100'} backdrop-blur-md`}>
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2 mr-16"> {/* Margin right to avoid overlap with lamp if needed, though lamp is fixed to window */}
                                <button className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition ${isSaved ? 'text-green-600' : isDark ? 'text-gray-400' : 'text-gray-500'}`} onClick={handleSave}>
                                    <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                                        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition ${showMoreMenu || isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>

                                    {showMoreMenu && (
                                        <div className={`absolute right-0 top-full mt-2 w-48 py-2 rounded-xl shadow-xl border transform origin-top-right transition-all animate-fadeIn ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                                            {currentUser && (article.authorEmail === currentUser.email) ? (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            console.log('Edit story button clicked in ArticleView');
                                                            setShowMoreMenu(false);
                                                            if (onEdit) {
                                                                console.log('Calling onEdit prop from ArticleView with:', article);
                                                                onEdit(article);
                                                            } else {
                                                                console.warn('onEdit prop is missing in ArticleView');
                                                            }
                                                        }}
                                                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        Edit story
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            console.log('Delete story button clicked in ArticleView');
                                                            setShowMoreMenu(false);
                                                            if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
                                                                if (onDelete) onDelete(article._id);
                                                            }
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                        Delete story
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setShowMoreMenu(false);
                                                        // Report logic could go here
                                                        alert('Report submitted. Thank you.');
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                                >
                                                    Report story
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Article Content */}
                        <article className="px-8 py-10 md:px-12 md:py-12">
                            {/* Header */}
                            <header className="mb-8">
                                <h1 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'} font-serif`}>
                                    {article.title}
                                </h1>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Author avatar — falls back through multiple field names */}
                                        {(() => {
                                            const avatarSrc =
                                                article.authorImage ||
                                                article.authorPhotoURL ||
                                                article.authorId?.photoURL ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author || article.authorName || 'Author')}&background=6B7280&color=fff`;
                                            return (
                                                <img
                                                    src={avatarSrc}
                                                    alt={article.author || article.authorName || 'Author'}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=A`; }}
                                                />
                                            );
                                        })()}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {article.author || article.authorName || article.authorId?.displayName || 'Anonymous'}
                                                </h3>
                                                <button
                                                    onClick={() => setIsFollowing(!isFollowing)}
                                                    className={`text-sm font-medium ${isFollowing ? 'text-gray-500' : 'text-green-600 hover:text-green-700'}`}
                                                >
                                                    {isFollowing ? 'Following' : 'Follow'}
                                                </button>
                                            </div>
                                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {/* readTime is a number from DB, format it nicely */}
                                                <span>{article.readTime ? `${article.readTime} min read` : '5 min read'}</span>
                                                <span className="mx-2">·</span>
                                                <span>
                                                    {(() => {
                                                        const d = article.date || article.publishedAt || article.createdAt;
                                                        try { return d ? format(new Date(d), 'MMM d, yyyy') : 'Recently'; }
                                                        catch { return 'Recently'; }
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            {/* Cover Image */}
                            {(article.coverImage || article.image) && (
                                <div className="aspect-video w-full mb-12 rounded-lg overflow-hidden shadow-md">
                                    <img
                                        src={article.coverImage || article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            )}

                            {/* Body */}
                            <div className={`prose prose-lg max-w-none mb-12 font-serif 
                                ${isDark ? 'prose-invert prose-p:text-slate-300 prose-headings:text-slate-100' : 'prose-p:text-gray-700 prose-headings:text-gray-900'}
                            `}>
                                <div dangerouslySetInnerHTML={{ __html: article.content }} />
                            </div>

                            {/* Interactions Footer */}
                            <div className={`border-t pt-8 mt-12 flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={handleLike}
                                        className={`flex items-center gap-2 group ${isLiked ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-600'} transition`}
                                    >
                                        <div className={`p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition ${isLiked ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                                            <Heart className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} />
                                        </div>
                                        <span className="font-medium">{(article.likescount || article.claps || 0)} likes</span>
                                    </button>

                                    <button
                                        onClick={() => setShowComments(!showComments)}
                                        className={`flex items-center gap-2 group ${isDark ? 'text-gray-400' : 'text-gray-600'} transition`}
                                    >
                                        <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <span className="font-medium">{comments.length} comments</span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>

            {/* Comments Sidebar */}
            <div className={`
                fixed inset-y-0 right-0 w-[400px] z-[65] 
                transform transition-transform duration-300 ease-in-out shadow-2xl
                ${showComments ? 'translate-x-0' : 'translate-x-full'}
                ${isDark ? 'bg-slate-900 border-l border-slate-800' : 'bg-white border-l border-gray-200'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Responses ({comments.length})
                        </h2>
                        <button
                            onClick={() => setShowComments(false)}
                            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700">
                        {loadingComments ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            </div>
                        ) : (!comments || comments.length === 0) ? (
                            <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No responses yet.</p>
                                <p className="text-sm">Be the first to respond.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment._id} className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={comment.authorPhotoURL || "https://ui-avatars.com/api/?name=" + comment.authorName}
                                                alt={comment.authorName}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>
                                                        {comment.authorName}
                                                    </h4>
                                                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                                                        {format(new Date(comment.createdAt), 'MMM d')}
                                                    </span>
                                                </div>
                                                <p className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-gray-700'} break-words whitespace-pre-wrap`}>
                                                    {comment.content}
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => handleLikeComment(comment._id)}
                                                        className={`flex items-center gap-1.5 text-xs font-medium transition
                                                            ${(comment.likes && currentUser && comment.likes.includes(currentUser.uid))
                                                                ? 'text-red-500'
                                                                : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700')
                                                            }
                                                        `}
                                                    >
                                                        <Heart className="w-3.5 h-3.5" fill={(comment.likes && currentUser && comment.likes.includes(currentUser.uid)) ? "currentColor" : "none"} />
                                                        <span>{comment.likeCount || 0}</span>
                                                    </button>
                                                    {currentUser && currentUser.uid === comment.authorId && (
                                                        <button
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className={`text-xs ${isDark ? 'text-slate-500 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition ml-auto`}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Comment Input */}
                    <div className={`p-6 border-t ${isDark ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'}`}>
                        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={currentUser?.photoURL || "https://ui-avatars.com/api/?name=Me"}
                                    className="w-8 h-8 rounded-full"
                                    alt="User"
                                />
                                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                    {currentUser?.displayName || 'You'}
                                </span>
                            </div>
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="What are your thoughts?"
                                className={`w-full bg-transparent resize-none border-none outline-none focus:ring-0 p-0 text-sm h-24 ${isDark ? 'text-white placeholder-slate-500' : 'text-gray-900 placeholder-gray-400'}`}
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleSubmitComment}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2
                                        ${commentText.trim()
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'
                                        }
                                    `}
                                    disabled={!commentText.trim()}
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    Respond
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


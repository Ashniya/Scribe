import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ArticleView from '../components/ArticleView';
import { getBlogById, likeBlog } from '../utils/api';
import LoginPromptModal from '../components/LoginPromptModal';

export default function ArticlePage() {
    const { id, slug } = useParams();
    const { isDark } = useContext(ThemeContext);
    const { currentUser, mongoUser } = useAuth();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [savedBlogs, setSavedBlogs] = useState(() => {
        try { return JSON.parse(localStorage.getItem('savedBlogs') || '[]'); } catch { return []; }
    });
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                // Use id param directly — simple and reliable
                const articleId = id;
                if (!articleId) {
                    setError('No article ID provided');
                    setLoading(false);
                    return;
                }
                const res = await getBlogById(articleId);
                if (res && res._id) {
                    setArticle(res);
                } else if (res && res.data) {
                    setArticle(res.data);
                } else {
                    setError('Article not found');
                }
            } catch (err) {
                console.error('Error fetching article:', err);
                setError('Failed to load article');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleProtectedAction = (action) => {
        if (!currentUser) {
            setShowLoginPrompt(true);
            return;
        }
        action();
    };

    const handleLike = async () => {
        handleProtectedAction(async () => {
            if (!article) return;
            try {
                const res = await likeBlog(article._id);
                if (res.success) {
                    const userIdStr = String(mongoUser?._id || currentUser?._id || '');
                    setArticle(prev => ({
                        ...prev,
                        likes: res.data.isLiked
                            ? [...(prev.likes || []), userIdStr].filter((v, i, a) => v && String(a.indexOf(v)) === String(i))
                            : (prev.likes || []).filter(id => String(id) !== userIdStr),
                        likescount: res.data.likes,
                        claps: res.data.likes // Sync claps field used in ArticleView
                    }));
                }
            } catch (error) {
                console.error('Like error:', error);
            }
        });
    };

    const handleSave = async () => {
        handleProtectedAction(async () => {
            if (!article) return;
            const isSaved = savedBlogs.includes(article._id);
            const newSaved = isSaved
                ? savedBlogs.filter(id => id !== article._id)
                : [...savedBlogs, article._id];

            setSavedBlogs(newSaved);
            localStorage.setItem('savedBlogs', JSON.stringify(newSaved));
            // Optional: call API to save to DB
        });
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex justify-center items-center ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scribe-green"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen flex flex-col justify-center items-center ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
                <h2 className="text-2xl font-bold mb-4">{error}</h2>
                <button onClick={() => navigate('/dashboard')} className="text-scribe-green hover:underline">
                    Go to Dashboard
                </button>
            </div>
        );
    }

    if (!article) return null;

    return (
        <>
            <ArticleView
                article={article}
                isDark={isDark}
                isPage={true}
                currentUser={currentUser}
                onClose={handleBack}
                onLike={handleLike}
                onSave={handleSave}
                isLiked={Boolean((mongoUser?._id || currentUser?._id) && article.likes?.map(String).includes(String(mongoUser?._id || currentUser?._id)))}
                isSaved={savedBlogs.includes(article._id)}
            />
            {showLoginPrompt && (
                <LoginPromptModal
                    isOpen={showLoginPrompt}
                    onClose={() => setShowLoginPrompt(false)}
                />
            )}
        </>
    );
}

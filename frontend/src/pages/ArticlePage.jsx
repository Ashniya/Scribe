import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ArticleView from '../components/ArticleView';
import { getBlogById, saveBlog, likeBlog } from '../utils/api'; // Assuming these exist or use fetch directly

export default function ArticlePage() {
    const { slug } = useParams();
    const { isDark } = useContext(ThemeContext);
    const { currentUser } = useAuth();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                // Extract ID from slug (format: title-id)
                // The ID is the last part after the last hyphen
                const id = slug.split('-').pop();

                if (!id || id.length < 24) {
                    throw new Error('Invalid article ID');
                }

                const res = await getBlogById(id);
                if (res.success) {
                    setArticle(res.data);
                } else {
                    setError('Article not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load article');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleLike = async () => {
        if (!article || !currentUser) return;
        // Optimistic update
        // Implemented in Dashboard/ArticleView logic usually
        // Here we can just call API and refresh or update state
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
        <ArticleView
            article={article}
            isDark={isDark}
            isPage={true}
            currentUser={currentUser}
            onClose={handleBack}
        // Add onLike, onSave handlers if needed, ArticleView usually expects them
        // For now, let's assume ArticleView handles internal logic or we need to pass them
        // Re-using logic from Dashboard would differ slightly
        />
    );
}

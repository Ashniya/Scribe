import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ArticleView from '../components/ArticleView';
import { getBlogById } from '../utils/api';

export default function ArticlePage() {
    const { id, slug } = useParams();
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
        />
    );
}

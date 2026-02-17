import { auth } from '../config/firebase.js';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Bold, Italic, List, Link as LinkIcon, Image as ImageIcon, Save, Type, Quote, X } from 'lucide-react';

export default function Editor({ onClose, isDark }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [publishing, setPublishing] = useState(false);
    const contentRef = useRef(null);

    // Focus editor on mount
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.focus();
        }
    }, []);

    // Core formatting function using execCommand for WYSIWYG support
    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value);
        if (contentRef.current) {
            setContent(contentRef.current.innerHTML);
            contentRef.current.focus();
        }
    };

    const handleFormat = (e, command, value = null) => {
        e.preventDefault(); // Prevent loss of focus
        execCmd(command, value);
    };

    const handleLink = (e) => {
        e.preventDefault();
        const url = prompt('Enter URL:');
        if (url) execCmd('createLink', url);
    };

    const handleImage = (e) => {
        e.preventDefault();
        const url = prompt('Enter image URL:');
        if (url) execCmd('insertImage', url);
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            execCmd('bold');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            execCmd('italic');
        }
    };

    const handlePublish = async () => {
        if (!title.trim()) {
            alert('Please add a title!');
            return;
        }

        // Check text content to avoid publishing empty HTML tags
        const plainText = contentRef.current?.innerText || '';
        if (!plainText.trim() && !content.includes('<img')) {
            alert('Please add some content!');
            return;
        }

        setPublishing(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                alert('Please log in to publish articles!');
                return;
            }

            const token = await user.getIdToken(true);
            const response = await fetch('http://localhost:5000/api/blogs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    content, // Sending HTML content
                    category: 'General',
                    tags: [],
                    coverImage: coverImageUrl.trim() || null,
                    published: true
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to publish');
            }

            alert("Article published successfully!");
            onClose(); // Close editor
        } catch (error) {
            console.error('Publish error:', error);
            alert(`Error: ${error.message || "Failed to publish article"}`);
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex flex-col ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Top Navigation Bar */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition ${isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Drafting
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition
                            ${publishing ? 'bg-green-600 opacity-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'}`}
                    >
                        {publishing ? 'Publishing...' : 'Publish'}
                    </button>
                    <button onClick={onClose} className="hidden md:block">
                        <X className={`w-6 h-6 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`} />
                    </button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-12">
                    {/* Cover Image Input */}
                    <div className="mb-8 group">
                        {coverImageUrl ? (
                            <div className="relative mb-4 rounded-xl overflow-hidden shadow-sm">
                                <img src={coverImageUrl} alt="Cover" className="w-full max-h-[400px] object-cover" />
                                <button
                                    onClick={() => setCoverImageUrl('')}
                                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder="Add a cover image URL (optional)"
                                value={coverImageUrl}
                                onChange={(e) => setCoverImageUrl(e.target.value)}
                                className={`w-full p-3 rounded-lg text-sm mb-4 outline-none transition
                                    ${isDark ? 'bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-700' : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white border border-transparent focus:border-gray-200'}`}
                            />
                        )}
                    </div>

                    {/* Title Input */}
                    <textarea
                        placeholder="Title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        rows={1}
                        className={`w-full text-4xl md:text-5xl font-serif font-bold mb-6 bg-transparent outline-none resize-none overflow-hidden placeholder-opacity-50
                            ${isDark ? 'placeholder-gray-600 text-white' : 'placeholder-gray-300 text-gray-900'}`}
                    />

                    {/* Formatting Toolbar - Sticky */}
                    <div className={`sticky top-0 z-40 mb-6 py-2 flex items-center gap-1 border-b backdrop-blur-sm transition-colors
                        ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-gray-100 bg-white/80'}`}>

                        <ToolbarButton onClick={(e) => handleFormat(e, 'bold')} icon={Bold} label="Bold" isDark={isDark} />
                        <ToolbarButton onClick={(e) => handleFormat(e, 'italic')} icon={Italic} label="Italic" isDark={isDark} />
                        <div className={`w-px h-5 mx-2 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                        <ToolbarButton onClick={(e) => handleFormat(e, 'insertUnorderedList')} icon={List} label="List" isDark={isDark} />
                        <ToolbarButton onClick={handleLink} icon={LinkIcon} label="Link" isDark={isDark} />
                        <ToolbarButton onClick={handleImage} icon={ImageIcon} label="Image" isDark={isDark} />
                    </div>

                    {/* WYSIWYG Content Area */}
                    <div
                        ref={contentRef}
                        contentEditable
                        onInput={(e) => setContent(e.currentTarget.innerHTML)}
                        onKeyDown={handleKeyDown}
                        className={`min-h-[500px] text-xl leading-relaxed outline-none prose max-w-none
                            ${isDark ? 'prose-invert text-gray-300' : 'text-gray-800'}
                            empty:before:content-[attr(placeholder)] empty:before:text-gray-400 cursor-text`}
                        placeholder="Tell your story..."
                        style={{ whiteSpace: 'pre-wrap' }}
                    />
                </div>
            </div>
        </div>
    );
}

// Helper Component for Toolbar Buttons
function ToolbarButton({ onClick, icon: Icon, label, isDark }) {
    return (
        <button
            onMouseDown={onClick} // Use onMouseDown to prevent focus loss from editor
            className={`p-2 rounded-lg transition-colors
                ${isDark ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            title={label}
        >
            <Icon className="w-5 h-5" strokeWidth={2} />
        </button>
    );
}

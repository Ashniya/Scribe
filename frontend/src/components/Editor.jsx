import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Image as ImageIcon,
    Link as LinkIcon,
    Quote,
    Code,
    Heading1,
    Heading2,
    X,
    Save,
    Send,
    Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { createBlog, uploadImage } from '../utils/api';

export default function Editor({ onClose, isDark: propIsDark }) {
    const { currentUser, mongoUser } = useAuth();
    // Use context for theme to ensure sync with ArticleView/App
    const themeContext = useContext(ThemeContext);
    const isDark = themeContext ? themeContext.isDark : propIsDark;
    const setIsDark = themeContext ? themeContext.setIsDark : () => { };

    const [isSwinging, setIsSwinging] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [category, setCategory] = useState('General');
    const [tags, setTags] = useState('');
    const [status, setStatus] = useState('draft');
    const [error, setError] = useState('');
    const [activeFormats, setActiveFormats] = useState({});

    const contentEditableRef = useRef(null);
    const fileInputRef = useRef(null);

    // Categories
    const categories = [
        'General', 'Technology', 'Health', 'Writing', 'Productivity',
        'Business', 'Lifestyle', 'Design', 'Programming', 'Science'
    ];

    // Save selection so toolbar clicks don't lose it
    const savedSelectionRef = useRef(null);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
        }
    };

    const restoreSelection = () => {
        const sel = window.getSelection();
        if (savedSelectionRef.current && sel) {
            sel.removeAllRanges();
            sel.addRange(savedSelectionRef.current);
        }
    };

    const checkActiveFormats = () => {
        if (!document) return;
        const block = document.queryCommandValue('formatBlock').toLowerCase();
        const formats = {
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            insertUnorderedList: document.queryCommandState('insertUnorderedList'),
            insertOrderedList: document.queryCommandState('insertOrderedList'),
            h2: block === 'h2',
            h3: block === 'h3',
            blockquote: block === 'blockquote',
            pre: block === 'pre',
        };
        setActiveFormats(formats);
    };

    const handleFormat = (command, value = null) => {
        // Restore focus + selection before running command
        contentEditableRef.current.focus();
        restoreSelection();

        if (command === 'formatBlock') {
            const currentBlock = document.queryCommandValue('formatBlock').toLowerCase();
            const tag = value.toLowerCase();
            if (currentBlock === tag) {
                // Toggle off — revert to paragraph
                document.execCommand('formatBlock', false, '<p>');
            } else {
                document.execCommand('formatBlock', false, `<${tag}>`);
            }
        } else {
            document.execCommand(command, false, value);
        }

        checkActiveFormats();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setCoverImage(file);
        } catch (err) {
            console.error('Error handling image:', err);
            setError('Failed to process image');
        }
    };

    const handlePublish = async () => {
        if (!title.trim()) {
            setError('Please enter a title');
            return;
        }
        if (!contentEditableRef.current.innerText.trim()) {
            setError('Please write some content');
            return;
        }

        setStatus('publishing');
        setError('');

        try {
            let uploadedImageUrl = null;
            if (coverImage) {
                const uploadResult = await uploadImage(coverImage);
                if (uploadResult.success) {
                    uploadedImageUrl = uploadResult.url;
                } else {
                    throw new Error('Failed to upload cover image');
                }
            }

            const blogData = {
                title,
                content: contentEditableRef.current.innerHTML,
                excerpt: contentEditableRef.current.innerText.slice(0, 150) + '...',
                category: category || 'General',
                tags: tags.split(',').map(t => t.trim()).filter(t => t),
                coverImage: uploadedImageUrl,
            };

            const result = await createBlog(blogData);

            if (result.success) {
                setStatus('published');
                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error(result.message || 'Failed to publish');
            }

        } catch (err) {
            console.error('Publish error:', err);
            setError(err.message || 'Something went wrong');
            setStatus('draft');
        }
    };

    const handleThemeToggle = () => {
        if (setIsDark) {
            setIsDark(!isDark);
            setIsSwinging(true);
            setTimeout(() => setIsSwinging(false), 1000);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex flex-col ${isDark ? 'bg-slate-900' : 'bg-scribe-green'} overflow-y-auto transition-colors duration-300`}>

            {/* Background Animation */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
            </div>

            {/* Scribe Title - Top Left */}
            <div className="fixed top-6 left-8 z-[60]">
                <h1 className="text-4xl font-bold text-white font-serif tracking-wide drop-shadow-md">
                    Scribe
                </h1>
            </div>

            {/* Lamp Toggle - Top Right */}
            <div className="fixed top-0 right-14 z-[60] hidden md:block">
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
                            </div>
                        )}
                        <svg width="60" height="50" viewBox="0 0 60 50" className="relative drop-shadow-lg">
                            <rect x="27" y="0" width="6" height="4" fill={isDark ? "#374151" : "#1f2937"} rx="1" />
                            <path d="M 15 6 L 45 6 L 50 18 Q 50 20, 48 20 L 12 20 Q 10 20, 10 18 Z" fill={isDark ? "#374151" : "#1f2937"} stroke={isDark ? "#1f2937" : "#111827"} strokeWidth="1" />
                            <ellipse cx="30" cy="20" rx="19" ry="2" fill={isDark ? "#1f2937" : "#111827"} opacity="0.8" />
                            {!isDark && (
                                <>
                                    <circle cx="30" cy="26" r="6" fill="#fef3c7" opacity="0.9" className="animate-pulse" />
                                    <circle cx="30" cy="26" r="4" fill="#fde68a" />
                                </>
                            )}
                        </svg>
                    </div>
                </button>
            </div>

            {/* Main Scrollable Area - The "Desk" */}
            <div className="relative py-12 px-4 flex justify-center z-10">
                {/* The "Letter Paper" */}
                <div className={`w-full max-w-3xl rounded-none md:rounded-lg shadow-2xl flex flex-col overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'} transition-all duration-300`}>

                    {/* Editor Header (Inside the paper) */}
                    <div className={`h-16 flex items-center justify-between px-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Draft in {currentUser?.displayName || 'Guest'}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePublish}
                                disabled={status === 'publishing' || status === 'published'}
                                className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {status === 'publishing' ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Publishing...
                                    </>
                                ) : status === 'published' ? (
                                    <>
                                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                        Published!
                                    </>
                                ) : (
                                    'Publish'
                                )}
                            </button>
                            <button className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Cover Image — edge-to-edge, no padding */}
                    <div className="group relative flex-shrink-0">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />

                        {imagePreview ? (
                            <div className="relative w-full h-64 md:h-80 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                <img src={imagePreview} alt="Cover" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <span className="text-white font-medium flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5" /> Change Cover
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="px-8 md:px-12 pt-6">
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className={`flex items-center gap-2 text-sm transition px-4 py-2 rounded-lg border border-dashed ${isDark ? 'border-slate-600 text-gray-400 hover:text-white hover:border-slate-500' : 'border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-400'}`}
                                >
                                    <ImageIcon className="w-5 h-5" />
                                    <span>Add a cover image</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Editor Body — padded content */}
                    <div className="flex-1 px-8 md:px-12 pb-12 pt-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Title */}
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full text-4xl md:text-5xl font-bold border-none outline-none bg-transparent placeholder-gray-300 dark:placeholder-gray-700 mb-6 font-serif ${isDark ? 'text-white' : 'text-gray-900'}`}
                        />

                        {/* Categories & Tags */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={`px-3 py-1.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-green-500/20 ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-gray-200'
                                    : 'bg-white border-gray-200 text-gray-700'
                                    }`}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Tags (comma separated)"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className={`px-3 py-1.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-green-500/20 flex-1 ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                    }`}
                            />
                        </div>

                        {/* Toolbar */}
                        <div className={`flex items-center gap-1 p-2 mb-4 rounded-lg border transition-colors ${isDark
                            ? 'bg-slate-800/90 border-slate-700'
                            : 'bg-white/90 border-gray-200'
                            }`}>
                            <ToolbarButton icon={Bold} onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }} isDark={isDark} isActive={activeFormats.bold} />
                            <ToolbarButton icon={Italic} onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }} isDark={isDark} isActive={activeFormats.italic} />
                            <div className={`w-px h-4 mx-1 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
                            <ToolbarButton icon={Heading1} onMouseDown={(e) => { e.preventDefault(); handleFormat('formatBlock', 'h2'); }} isDark={isDark} isActive={activeFormats.h2} />
                            <ToolbarButton icon={Heading2} onMouseDown={(e) => { e.preventDefault(); handleFormat('formatBlock', 'h3'); }} isDark={isDark} isActive={activeFormats.h3} />
                            <div className={`w-px h-4 mx-1 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
                            <ToolbarButton icon={Quote} onMouseDown={(e) => { e.preventDefault(); handleFormat('formatBlock', 'blockquote'); }} isDark={isDark} isActive={activeFormats.blockquote} />
                            <ToolbarButton icon={Code} onMouseDown={(e) => { e.preventDefault(); handleFormat('formatBlock', 'pre'); }} isDark={isDark} isActive={activeFormats.pre} />
                            <ToolbarButton icon={List} onMouseDown={(e) => { e.preventDefault(); handleFormat('insertUnorderedList'); }} isDark={isDark} isActive={activeFormats.insertUnorderedList} />
                            <ToolbarButton icon={ListOrdered} onMouseDown={(e) => { e.preventDefault(); handleFormat('insertOrderedList'); }} isDark={isDark} isActive={activeFormats.insertOrderedList} />
                        </div>

                        {/* Helper Hint */}
                        <div className={`text-xs mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Select text to format
                        </div>

                        {/* Content Editable Area */}
                        <div
                            ref={contentEditableRef}
                            contentEditable
                            className={`editor-content min-h-[70vh] outline-none text-lg leading-relaxed max-w-none font-serif ${isDark ? 'text-gray-300' : 'text-gray-800'}`}
                            placeholder="Tell your story..."
                            onInput={(e) => setContent(e.currentTarget.innerHTML)}
                            onKeyUp={checkActiveFormats}
                            onMouseUp={() => { saveSelection(); checkActiveFormats(); }}
                            onKeyDown={saveSelection}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolbarButton({ icon: Icon, onMouseDown, isDark, isActive }) {
    return (
        <button
            onMouseDown={onMouseDown}
            className={`p-1.5 rounded transition ${isActive
                ? (isDark ? 'bg-slate-700 text-green-400' : 'bg-gray-100 text-green-600')
                : (isDark ? 'text-gray-400 hover:text-white hover:bg-slate-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100')
                }`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}

// Icons helper
function MoreHorizontal({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    );
}

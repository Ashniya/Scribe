import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
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
    Loader,
    Underline,
    Strikethrough
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { createBlog, updateBlog, uploadImage } from '../utils/api';

export default function Editor({ onClose, isDark: propIsDark, editData }) {
    const { currentUser, mongoUser } = useAuth();
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
    const [status, setStatus] = useState(editData ? 'editing' : 'draft');
    const [error, setError] = useState('');
    const [activeFormats, setActiveFormats] = useState({});
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    const contentEditableRef = useRef(null);
    const fileInputRef = useRef(null);

    const categories = [
        'General', 'Technology', 'Health', 'Writing', 'Productivity',
        'Business', 'Lifestyle', 'Design', 'Programming', 'Science'
    ];

    // ─── Update word/char count ──────────────────────────────────────────────────
    const updateCounts = useCallback(() => {
        if (!contentEditableRef.current) return;
        const text = contentEditableRef.current.innerText || '';
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        setWordCount(words.length);
        setCharCount(text.length);
    }, []);

    // Initialize editor with editData if provided
    useEffect(() => {
        if (editData) {
            setTitle(editData.title || '');
            setCategory(editData.category || 'General');
            setTags(editData.tags ? editData.tags.join(', ') : '');
            if (editData.coverImage) {
                setImagePreview(editData.coverImage);
            }
            if (contentEditableRef.current && editData.content) {
                contentEditableRef.current.innerHTML = editData.content;
                updateCounts();
            }
        }
    }, [editData, updateCounts]);

    // ─── Selection Management ────────────────────────────────────────────────────
    const savedSelectionRef = useRef(null);

    const saveSelection = useCallback(() => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
        }
    }, []);

    const restoreSelection = useCallback(() => {
        const sel = window.getSelection();
        if (savedSelectionRef.current && sel) {
            sel.removeAllRanges();
            sel.addRange(savedSelectionRef.current.cloneRange());
        }
    }, []);

    // ─── Check active formats ────────────────────────────────────────────────────
    const checkActiveFormats = useCallback(() => {
        if (!document || !contentEditableRef.current) return;
        try {
            const block = document.queryCommandValue('formatBlock').toLowerCase().replace(/[<>]/g, '');
            setActiveFormats({
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                strikethrough: document.queryCommandState('strikethrough'),
                insertUnorderedList: document.queryCommandState('insertUnorderedList'),
                insertOrderedList: document.queryCommandState('insertOrderedList'),
                h2: block === 'h2',
                h3: block === 'h3',
                blockquote: block === 'blockquote',
                pre: block === 'pre',
            });
        } catch (e) { /* ignore */ }
    }, []);


    // ─── Format handler ──────────────────────────────────────────────────────────
    const handleFormat = useCallback((command, value = null) => {
        const editor = contentEditableRef.current;
        if (!editor) return;

        // Always focus editor first, then restore selection
        editor.focus();
        restoreSelection();

        if (command === 'formatBlock') {
            const currentBlock = document.queryCommandValue('formatBlock')
                .toLowerCase()
                .replace(/[<>]/g, '');
            const tag = value.toLowerCase();

            if (currentBlock === tag) {
                // Toggle OFF: revert to paragraph
                document.execCommand('formatBlock', false, '<p>');
            } else {
                document.execCommand('formatBlock', false, `<${tag}>`);
            }
        } else {
            // For bold, italic, underline, lists — execCommand is already a toggle
            document.execCommand(command, false, value);
        }

        // Re-save the selection after formatting
        setTimeout(() => {
            saveSelection();
            checkActiveFormats();
        }, 0);
    }, [restoreSelection, saveSelection, checkActiveFormats]);

    // ─── Keyboard shortcuts ──────────────────────────────────────────────────────
    const handleKeyDown = useCallback((e) => {
        saveSelection();

        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    handleFormat('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    handleFormat('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    handleFormat('underline');
                    break;
                default:
                    break;
            }
        }
    }, [saveSelection, handleFormat]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setCoverImage(file);
        } catch (err) {
            console.error('Error handling image:', err);
            setError('Failed to process image');
        }
    };

    const handlePublish = async () => {
        if (!title.trim()) { setError('Please enter a title'); return; }
        if (!contentEditableRef.current.innerText.trim()) { setError('Please write some content'); return; }
        if (!category) { setError('Please select a category'); return; }

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
                coverImage: uploadedImageUrl || (editData ? editData.coverImage : null),
            };

            const result = editData
                ? await updateBlog(editData._id, blogData)
                : await createBlog(blogData);

            if (result.success) {
                setStatus('published');
                setTimeout(() => { onClose(); window.location.reload(); }, 1500);
            } else {
                throw new Error(result.message || (editData ? 'Failed to update' : 'Failed to publish'));
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

            {/* Background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
            </div>

            {/* Scribe Title */}
            <div className="fixed top-6 left-8 z-[60]">
                <h1 className="text-4xl font-bold text-white font-serif tracking-wide drop-shadow-md">Scribe</h1>
            </div>

            {/* Lamp Toggle */}
            <div className="fixed top-0 right-14 z-[60] hidden md:block">
                <button onClick={handleThemeToggle} className="relative w-20 h-32 flex flex-col items-center group" aria-label="Toggle theme">
                    <div className="w-0.5 h-10 bg-gray-800 dark:bg-gray-400 transition-colors duration-300" />
                    <div className={`relative ${isSwinging ? 'animate-lamp-swing' : ''}`}>
                        {!isDark && (
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 h-40 overflow-visible pointer-events-none">
                                <div className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-yellow-200/80 via-yellow-100/40 to-transparent transform -translate-x-1/2 animate-pulse" style={{ animationDuration: '2s' }} />
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

            {/* Main area */}
            <div className="relative py-12 px-4 flex justify-center z-10">
                <div className={`w-full max-w-3xl rounded-none md:rounded-xl shadow-2xl flex flex-col overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'} transition-all duration-300`}
                    style={{ animation: 'editorSlideUp 0.5s cubic-bezier(.16,1,.3,1) both' }}>

                    {/* Editor Header */}
                    <div className={`h-16 flex items-center justify-between px-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                            <button onClick={onClose}
                                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${isDark ? 'text-gray-400 hover:bg-slate-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                                <X className="w-5 h-5" />
                            </button>
                            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Draft · {currentUser?.displayName || 'Guest'}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Word count */}
                            <span className={`text-xs hidden sm:block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {wordCount} words
                            </span>

                            <button onClick={handlePublish}
                                disabled={status === 'publishing' || status === 'published'}
                                className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full text-sm font-semibold hover:from-green-700 hover:to-emerald-600 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                                {status === 'publishing' ? (
                                    <><Loader className="w-4 h-4 animate-spin" /> {editData ? 'Updating...' : 'Publishing...'}</>
                                ) : status === 'published' ? (
                                    <><div className="w-2 h-2 bg-white rounded-full animate-ping" /> {editData ? 'Updated!' : 'Published!'}</>
                                ) : (
                                    <><Send className="w-3.5 h-3.5" /> {editData ? 'Update' : 'Publish'}</>
                                )}
                            </button>
                            <button className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${isDark ? 'text-gray-400 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="group relative flex-shrink-0">
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        {imagePreview ? (
                            <div className="relative w-full h-64 md:h-80 cursor-pointer overflow-hidden" onClick={() => fileInputRef.current.click()}>
                                <img src={imagePreview} alt="Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="text-white font-medium flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full">
                                        <ImageIcon className="w-4 h-4" /> Change Cover
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="px-8 md:px-12 pt-6">
                                <button onClick={() => fileInputRef.current.click()}
                                    className={`flex items-center gap-2 text-sm transition-all duration-200 px-4 py-2 rounded-lg border border-dashed hover:scale-[1.02] active:scale-100 ${isDark ? 'border-slate-600 text-gray-400 hover:text-white hover:border-slate-500 hover:bg-slate-700/30' : 'border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50'}`}>
                                    <ImageIcon className="w-5 h-5" />
                                    <span>Add a cover image</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Editor Body */}
                    <div className="flex-1 px-8 md:px-12 pb-12 pt-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                <X className="w-4 h-4 flex-shrink-0" /> {error}
                            </div>
                        )}

                        {/* Title */}
                        <input type="text" placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full text-4xl md:text-5xl font-bold border-none outline-none bg-transparent placeholder-gray-300 dark:placeholder-gray-700 mb-6 font-serif transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}
                        />

                        {/* Category & Tags */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <select value={category} onChange={(e) => setCategory(e.target.value)}
                                className={`px-3 py-1.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-green-500/30 transition-all duration-200 cursor-pointer hover:border-green-400 ${isDark ? 'bg-slate-700 border-slate-600 text-gray-200' : 'bg-white border-gray-200 text-gray-700'}`}>
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <input type="text" placeholder="Tags (comma separated)"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className={`px-3 py-1.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-green-500/30 flex-1 transition-all duration-200 hover:border-green-400 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
                            />
                        </div>

                        {/* ─── Toolbar ───────────────────────────────────────────────── */}
                        <div className={`flex flex-wrap items-center gap-0.5 p-2 mb-4 rounded-xl border shadow-sm transition-all duration-300 sticky top-2 z-10 backdrop-blur-sm ${isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-gray-200'}`}>

                            <ToolbarGroup>
                                <ToolbarButton icon={Bold} label="Bold (Ctrl+B)"
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }}
                                    isDark={isDark} isActive={activeFormats.bold} />
                                <ToolbarButton icon={Italic} label="Italic (Ctrl+I)"
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }}
                                    isDark={isDark} isActive={activeFormats.italic} />
                                <ToolbarButton icon={Underline} label="Underline (Ctrl+U)"
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('underline'); }}
                                    isDark={isDark} isActive={activeFormats.underline} />
                                <ToolbarButton icon={Strikethrough} label="Strikethrough"
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('strikethrough'); }}
                                    isDark={isDark} isActive={activeFormats.strikethrough} />
                            </ToolbarGroup>

                            <ToolbarDivider isDark={isDark} />

                            <ToolbarGroup>
                                <ToolbarButton icon={Heading1} label="Heading 1"
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('formatBlock', 'h2'); }}
                                    isDark={isDark} isActive={activeFormats.h2} />
                                <ToolbarButton icon={Heading2} label="Heading 2"
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('formatBlock', 'h3'); }}
                                    isDark={isDark} isActive={activeFormats.h3} />
                            </ToolbarGroup>

                            <ToolbarDivider isDark={isDark} />

                            <ToolbarGroup>
                                <ToolbarButton icon={Quote} label="Blockquote"
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('formatBlock', 'blockquote'); }}
                                    isDark={isDark} isActive={activeFormats.blockquote} />
                                <ToolbarButton icon={Code} label="Code Block"
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('formatBlock', 'pre'); }}
                                    isDark={isDark} isActive={activeFormats.pre} />
                            </ToolbarGroup>

                            <ToolbarDivider isDark={isDark} />

                            <ToolbarGroup>
                                <ToolbarButton icon={List} label="Bullet List"
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('insertUnorderedList'); }}
                                    isDark={isDark} isActive={activeFormats.insertUnorderedList} />
                                <ToolbarButton icon={ListOrdered} label="Numbered List"
                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('insertOrderedList'); }}
                                    isDark={isDark} isActive={activeFormats.insertOrderedList} />
                            </ToolbarGroup>

                            {/* Shortcut hint */}
                            <div className={`ml-auto text-xs pr-1 hidden sm:block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                Select text to format
                            </div>
                        </div>

                        {/* Content Area */}
                        <div
                            ref={contentEditableRef}
                            contentEditable
                            suppressContentEditableWarning
                            className={`editor-content min-h-[65vh] outline-none text-lg leading-relaxed max-w-none font-serif focus:outline-none ${isDark ? 'text-gray-300' : 'text-gray-800'}`}
                            placeholder="Tell your story..."
                            onInput={(e) => { setContent(e.currentTarget.innerHTML); updateCounts(); }}
                            onKeyUp={() => { checkActiveFormats(); }}
                            onMouseUp={() => { saveSelection(); checkActiveFormats(); }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => checkActiveFormats()}
                        />

                        {/* Footer stats */}
                        <div className={`flex items-center justify-between mt-6 pt-4 border-t text-xs ${isDark ? 'border-slate-700 text-gray-600' : 'border-gray-100 text-gray-400'}`}>
                            <span>{wordCount} words · {charCount} characters</span>
                            <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide-up animation */}
            <style>{`
                @keyframes editorSlideUp {
                    from { opacity: 0; transform: translateY(32px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .editor-content:empty:before {
                    content: attr(placeholder);
                    color: ${isDark ? '#4b5563' : '#d1d5db'};
                    pointer-events: none;
                    position: absolute;
                }
                .editor-content h2 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0 0.5rem; }
                .editor-content h3 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; }
                .editor-content blockquote {
                    border-left: 4px solid #6ee7b7;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    color: ${isDark ? '#9ca3af' : '#6b7280'};
                    font-style: italic;
                }
                .editor-content pre {
                    background: ${isDark ? '#0f172a' : '#f8fafc'};
                    border: 1px solid ${isDark ? '#334155' : '#e2e8f0'};
                    border-radius: 0.5rem;
                    padding: 1rem;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.875rem;
                    overflow-x: auto;
                    margin: 1rem 0;
                }
                .editor-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
                .editor-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
                .editor-content b, .editor-content strong { font-weight: 700; }
                .editor-content i, .editor-content em { font-style: italic; }
                .editor-content u { text-decoration: underline; }
                .editor-content s { text-decoration: line-through; }
                .editor-content p { margin: 0.5rem 0; }
            `}</style>
        </div>
    );
}

function ToolbarGroup({ children }) {
    return <div className="flex items-center">{children}</div>;
}

function ToolbarDivider({ isDark }) {
    return <div className={`w-px h-5 mx-1.5 flex-shrink-0 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />;
}

function ToolbarButton({ icon: Icon, onMouseDown, isDark, isActive, label }) {
    return (
        <button
            onMouseDown={onMouseDown}
            title={label}
            className={`relative p-2 rounded-lg transition-all duration-150 group flex items-center justify-center ${isActive
                ? (isDark
                    ? 'bg-emerald-900/40 text-emerald-400 shadow-inner'
                    : 'bg-green-50 text-green-700 shadow-inner')
                : (isDark
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100')
                }`}
        >
            <Icon className="w-4 h-4" />
            {/* Active underline indicator */}
            {isActive && (
                <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-green-600'}`} />
            )}
            {/* Tooltip */}
            {label && (
                <span className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 ${isDark ? 'bg-slate-900 text-gray-200' : 'bg-gray-900 text-white'}`}>
                    {label}
                </span>
            )}
        </button>
    );
}

function MoreHorizontal({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    );
}

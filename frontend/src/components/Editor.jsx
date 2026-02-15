import { auth } from '../config/firebase.js';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Bold, Italic, List, Link as LinkIcon, Image as ImageIcon, Save, Eye, EyeOff, Type, Quote } from 'lucide-react';

export default function Editor({ onClose, isDark }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [showInlineToolbar, setShowInlineToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const contentRef = useRef(null);

    // Core formatting: runs on mousedown BEFORE focus can shift
    const applyFormat = (e, before, after = '') => {
        e.preventDefault(); // Keep focus on textarea
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.substring(start, end);

        const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
        setContent(newContent);

        // Restore cursor position after React re-renders
        requestAnimationFrame(() => {
            textarea.focus();
            if (selected.length > 0) {
                const pos = start + before.length + selected.length + after.length;
                textarea.setSelectionRange(pos, pos);
            } else {
                const pos = start + before.length;
                textarea.setSelectionRange(pos, pos);
            }
        });
    };

    const applyList = (e) => {
        e.preventDefault();
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const lineStart = content.lastIndexOf('\n', start - 1) + 1;
        const newContent = content.substring(0, lineStart) + '• ' + content.substring(lineStart);
        setContent(newContent);

        requestAnimationFrame(() => {
            textarea.focus();
            const pos = start + 2;
            textarea.setSelectionRange(pos, pos);
        });
    };

    const applyLink = (e) => {
        e.preventDefault();
        const textarea = contentRef.current;
        if (!textarea) return;
        const savedStart = textarea.selectionStart;
        const savedEnd = textarea.selectionEnd;

        setTimeout(() => {
            const url = prompt('Enter URL:');
            if (url) {
                const text = prompt('Enter link text:') || url;
                const selected = content.substring(savedStart, savedEnd);
                const linkText = selected.length > 0 ? selected : text;
                const markdown = `[${linkText}](${url})`;
                const newContent = content.substring(0, savedStart) + markdown + content.substring(savedEnd);
                setContent(newContent);
                requestAnimationFrame(() => {
                    textarea.focus();
                    const pos = savedStart + markdown.length;
                    textarea.setSelectionRange(pos, pos);
                });
            }
        }, 0);
    };

    const applyImage = (e) => {
        e.preventDefault();
        const textarea = contentRef.current;
        if (!textarea) return;
        const savedStart = textarea.selectionStart;
        const savedEnd = textarea.selectionEnd;

        setTimeout(() => {
            const url = prompt('Enter image URL:');
            if (url) {
                const alt = prompt('Enter image description:') || 'Image';
                const markdown = `![${alt}](${url})\n`;
                const newContent = content.substring(0, savedStart) + markdown + content.substring(savedEnd);
                setContent(newContent);
                requestAnimationFrame(() => {
                    textarea.focus();
                    const pos = savedStart + markdown.length;
                    textarea.setSelectionRange(pos, pos);
                });
            }
        }, 0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            applyFormat(e, '    ');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            applyFormat(e, '**', '**');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            applyFormat(e, '_', '_');
        }
    };

    // Handle text selection to show inline toolbar
    const handleTextSelect = () => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start !== end) {
            // Text is selected
            const rect = textarea.getBoundingClientRect();
            const textBeforeSelection = content.substring(0, start);
            const lines = textBeforeSelection.split('\n').length;

            setToolbarPosition({
                top: rect.top - 60,
                left: rect.left + (rect.width / 2)
            });
            setShowInlineToolbar(true);
        } else {
            setShowInlineToolbar(false);
        }
    };

    const handlePublish = async () => {
        console.log('🚀 Starting article publish...');

        if (!title.trim()) {
            alert('Please add a title!');
            return;
        }
        if (!content.trim()) {
            alert('Please add some content!');
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                alert('Please log in to publish articles!');
                return;
            }

            console.log('👤 Publishing as:', user.email);
            const token = await user.getIdToken(true);

            const response = await fetch('http://localhost:5000/api/blogs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    content,
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

            console.log('✅ Article published! ID:', data.data._id);
            alert("Article published successfully!");
            setTitle('');
            setContent('');
            setCoverImageUrl('');
            onClose();
        } catch (error) {
            console.error('❌ Publish error:', error);
            alert(`Error: ${error.message || "Failed to publish article"}`);
        }
    };

    // Render markdown for preview
    const renderMarkdown = (text) => {
        if (!text) return '';
        return text
            .split('\n')
            .map((line, i) => {
                // Check for headings first
                if (line.startsWith('## ')) {
                    return `<h2 class="text-3xl font-bold mt-6 mb-4">${line.substring(3)}</h2>`;
                }
                if (line.startsWith('> ')) {
                    return `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">${line.substring(2)}</blockquote>`;
                }

                let html = line
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/_(.+?)_/g, '<em>$1</em>')
                    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-scribe-green underline" target="_blank" rel="noopener">$1</a>')
                    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl my-4" />')
                    .replace(/^• (.+)/, '<li class="ml-4">$1</li>');

                if (html.trim() === '') {
                    return '<br />';
                }
                return `<p class="mb-3">${html}</p>`;
            })
            .join('');
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'} transition-colors`}>
            {/* Top Bar */}
            <div className={`sticky top-0 z-10 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Dashboard</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${showPreview
                                    ? 'bg-scribe-green/10 text-scribe-green'
                                    : isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                                title={showPreview ? "Hide preview" : "Show preview"}
                            >
                                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Preview'}</span>
                            </button>
                            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {content.split(/\s+/).filter(w => w.length > 0).length} words
                            </span>
                            <button
                                onClick={handlePublish}
                                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-scribe-green to-scribe-sage text-white font-medium rounded-full hover:shadow-lg transition"
                            >
                                <Save className="w-4 h-4" />
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full text-4xl sm:text-5xl font-bold mb-6 outline-none ${isDark ? 'bg-slate-900 text-white placeholder-gray-600' : 'bg-white text-gray-900 placeholder-gray-400'}`}
                />

                {/* Cover Image URL Input */}
                <div className={`mb-6 flex items-center gap-3 p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                    <ImageIcon className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                        type="text"
                        placeholder="Cover image URL (optional)"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        className={`flex-1 text-sm outline-none ${isDark ? 'bg-slate-800 text-white placeholder-gray-500' : 'bg-gray-50 text-gray-900 placeholder-gray-400'}`}
                    />
                    {coverImageUrl && (
                        <button onClick={() => setCoverImageUrl('')} className="text-xs text-red-400 hover:text-red-500">
                            Clear
                        </button>
                    )}
                </div>

                {/* Cover Image Preview */}
                {coverImageUrl && (
                    <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                        <img
                            src={coverImageUrl}
                            alt="Cover preview"
                            className="w-full max-h-64 object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                            onLoad={(e) => { e.target.style.display = 'block'; }}
                        />
                    </div>
                )}

                {/* Toolbar - ALL buttons use onMouseDown to act before focus shifts */}
                <div className={`flex items-center gap-2 mb-6 pb-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <button
                        onMouseDown={(e) => applyFormat(e, '**', '**')}
                        title="Bold (Ctrl+B)"
                        className={`p-2 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-slate-800 text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                    >
                        <Bold className="w-5 h-5" />
                    </button>
                    <button
                        onMouseDown={(e) => applyFormat(e, '_', '_')}
                        title="Italic (Ctrl+I)"
                        className={`p-2 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-slate-800 text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                    >
                        <Italic className="w-5 h-5" />
                    </button>
                    <button
                        onMouseDown={applyList}
                        title="Bullet List"
                        className={`p-2 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-slate-800 text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                    <button
                        onMouseDown={applyLink}
                        title="Insert Link"
                        className={`p-2 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-slate-800 text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                    >
                        <LinkIcon className="w-5 h-5" />
                    </button>
                    <button
                        onMouseDown={applyImage}
                        title="Insert Image"
                        className={`p-2 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-slate-800 text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>

                    <div className="ml-auto">
                        <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Markdown supported
                        </span>
                    </div>
                </div>

                {/* Content Input - Split view when preview is on */}
                <div className={`${showPreview ? 'grid grid-cols-2 gap-6' : ''}`}>
                    {/* Editor */}
                    <div className={showPreview ? 'border-r pr-6' : ''} style={showPreview ? { borderColor: isDark ? '#334155' : '#e5e7eb' } : {}}>
                        <textarea
                            ref={contentRef}
                            placeholder="Tell your story..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onSelect={handleTextSelect}
                            onMouseUp={handleTextSelect}
                            className={`w-full min-h-[500px] text-xl leading-relaxed outline-none resize-none ${isDark ? 'bg-slate-900 text-white placeholder-gray-600' : 'bg-white text-gray-900 placeholder-gray-400'}`}
                        />
                    </div>

                    {/* Live Preview */}
                    {showPreview && (
                        <div className="overflow-y-auto">
                            <div className={`text-xs font-semibold mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                LIVE PREVIEW
                            </div>
                            <div
                                className={`prose prose-lg max-w-none ${isDark ? 'prose-invert' : ''}`}
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                            />
                            {!content && (
                                <p className={`text-gray-400 italic`}>
                                    Your formatted content will appear here...
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Helper Text */}
                {!showPreview && (
                    <div className={`mt-8 p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Formatting Tips:</h4>
                        <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <li>• <strong>Bold</strong>: Select text → Click B or Ctrl+B</li>
                            <li>• <em>Italic</em>: Select text → Click I or Ctrl+I</li>
                            <li>• Bullet list: Click the list button</li>
                            <li>• Links: Click the link button</li>
                            <li>• Images: Click the image button or paste cover URL above</li>
                            <li>• <strong className="text-scribe-green">💡 Click "Preview" to see your formatted text!</strong></li>
                        </ul>
                    </div>
                )
                }

                {/* Inline Formatting Toolbar */}
                {showInlineToolbar && (
                    <div
                        className="fixed z-50 bg-gray-900 text-white rounded-lg shadow-2xl px-2 py-1.5 flex items-center gap-1"
                        style={{
                            top: `${toolbarPosition.top}px`,
                            left: `${toolbarPosition.left}px`,
                            transform: 'translateX(-50%)'
                        }}
                        onMouseDown={(e) => e.preventDefault()} // Prevent losing selection
                    >
                        <button
                            onMouseDown={(e) => {
                                applyFormat(e, '**', '**');
                                setTimeout(() => setShowInlineToolbar(false), 100);
                            }}
                            className="p-2 hover:bg-gray-700 rounded transition"
                            title="Bold"
                        >
                            <Bold className="w-4 h-4" />
                        </button>
                        <button
                            onMouseDown={(e) => {
                                applyFormat(e, '_', '_');
                                setTimeout(() => setShowInlineToolbar(false), 100);
                            }}
                            className="p-2 hover:bg-gray-700 rounded transition"
                            title="Italic"
                        >
                            <Italic className="w-4 h-4" />
                        </button>
                        <button
                            onMouseDown={(e) => {
                                applyLink(e);
                                setTimeout(() => setShowInlineToolbar(false), 100);
                            }}
                            className="p-2 hover:bg-gray-700 rounded transition"
                            title="Link"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-700 mx-1" />
                        <button
                            onMouseDown={(e) => {
                                e.preventDefault();
                                const textarea = contentRef.current;
                                if (!textarea) return;
                                const start = textarea.selectionStart;
                                const lineStart = content.lastIndexOf('\n', start - 1) + 1;
                                const newContent = content.substring(0, lineStart) + '## ' + content.substring(lineStart);
                                setContent(newContent);
                                setTimeout(() => setShowInlineToolbar(false), 100);
                            }}
                            className="p-2 hover:bg-gray-700 rounded transition"
                            title="Heading"
                        >
                            <Type className="w-4 h-4" />
                        </button>
                        <button
                            onMouseDown={(e) => {
                                e.preventDefault();
                                const textarea = contentRef.current;
                                if (!textarea) return;
                                const start = textarea.selectionStart;
                                const lineStart = content.lastIndexOf('\n', start - 1) + 1;
                                const newContent = content.substring(0, lineStart) + '> ' + content.substring(lineStart);
                                setContent(newContent);
                                setTimeout(() => setShowInlineToolbar(false), 100);
                            }}
                            className="p-2 hover:bg-gray-700 rounded transition"
                            title="Quote"
                        >
                            <Quote className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

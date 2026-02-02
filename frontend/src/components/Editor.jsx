import React, { useState, useRef } from 'react';
import { ArrowLeft, Bold, Italic, List, Link as LinkIcon, Image as ImageIcon, Save } from 'lucide-react';

export default function Editor({ onClose, isDark }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const contentRef = useRef(null);

    const handleSave = () => {
        if (!title.trim()) {
            alert('Please add a title!');
            return;
        }
        if (!content.trim()) {
            alert('Please add some content!');
            return;
        }
        alert(`Article published!\n\nTitle: ${title}\nContent: ${content.substring(0, 100)}...`);
        onClose();
    };

    const insertFormatting = (before, after = '') => {
        const textarea = contentRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);

        setContent(newText);

        // Set cursor position after insertion
        setTimeout(() => {
            textarea.focus();
            const newPosition = start + before.length + selectedText.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    const handleBold = () => {
        insertFormatting('**', '**');
    };

    const handleItalic = () => {
        insertFormatting('_', '_');
    };

    const handleList = () => {
        const textarea = contentRef.current;
        const start = textarea.selectionStart;
        const lines = content.substring(0, start).split('\n');
        const currentLineStart = content.lastIndexOf('\n', start - 1) + 1;

        const newText = content.substring(0, currentLineStart) + '• ' + content.substring(currentLineStart);
        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
    };

    const handleLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            const text = prompt('Enter link text:') || url;
            insertFormatting(`[${text}](${url})`);
        }
    };

    const handleImage = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            const alt = prompt('Enter image description:') || 'Image';
            insertFormatting(`![${alt}](${url})\n`);
        }
    };

    const handleKeyDown = (e) => {
        // Tab key support
        if (e.key === 'Tab') {
            e.preventDefault();
            insertFormatting('    '); // 4 spaces
        }

        // Ctrl/Cmd + B for bold
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            handleBold();
        }

        // Ctrl/Cmd + I for italic
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            handleItalic();
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'} transition-colors`}>
            {/* Top Bar */}
            <div className={`sticky top-0 z-10 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Dashboard</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {content.split(/\s+/).filter(w => w.length > 0).length} words
                            </span>
                            <button
                                onClick={handleSave}
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
                    className={`w-full text-4xl sm:text-5xl font-bold mb-6 outline-none ${isDark ? 'bg-slate-900 text-white placeholder-gray-600' : 'bg-white text-gray-900 placeholder-gray-400'
                        }`}
                />

                {/* Toolbar */}
                <div className={`flex items-center gap-2 mb-6 pb-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <button
                        onClick={handleBold}
                        title="Bold (Ctrl+B)"
                        className={`p-2 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-slate-800 text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                    >
                        <Bold className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleItalic}
                        title="Italic (Ctrl+I)"
                        className={`p-2 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-slate-800 text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                    >
                        <Italic className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleList}
                        title="Bullet List"
                        className={`p-2 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-slate-800 text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleLink}
                        title="Insert Link"
                        className={`p-2 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-slate-800 text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                    >
                        <LinkIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleImage}
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

                {/* Content Input */}
                <textarea
                    ref={contentRef}
                    placeholder="Tell your story..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full min-h-[500px] text-xl leading-relaxed outline-none resize-none ${isDark ? 'bg-slate-900 text-white placeholder-gray-600' : 'bg-white text-gray-900 placeholder-gray-400'
                        }`}
                />

                {/* Helper Text */}
                <div className={`mt-8 p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Formatting Tips:</h4>
                    <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <li>• <strong>Bold</strong>: **text** or Ctrl+B</li>
                        <li>• <em>Italic</em>: _text_ or Ctrl+I</li>
                        <li>• Bullet list: Click the list button</li>
                        <li>• Links: Click the link button</li>
                        <li>• Images: Click the image button</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

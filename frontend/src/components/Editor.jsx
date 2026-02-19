import { auth } from '../config/firebase.js';
import React, { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft, Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Plus,
    Save, Type, Quote, X, Underline, AlignLeft, AlignCenter, AlignRight,
    Heading1, Heading2, Code, FileText, Video, Music, File, Bookmark as BookmarkIcon,
    ChevronDown
} from 'lucide-react';
import { apiCall } from '../servicies/api.js';

export default function Editor({ onClose, isDark, editBlog = null }) {
    const [title, setTitle] = useState(editBlog?.title || '');
    const [content, setContent] = useState(editBlog?.content || '');
    const [coverImageUrl, setCoverImageUrl] = useState(editBlog?.coverImage || '');
    const [publishing, setPublishing] = useState(false);
    const [showMediaMenu, setShowMediaMenu] = useState(false);
    const [mediaMenuPosition, setMediaMenuPosition] = useState({ x: 0, y: 0 });
    const contentRef = useRef(null);
    const fileInputRef = useRef(null);
    const coverFileInputRef = useRef(null);
    const savedRangeRef = useRef(null);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [formatState, setFormatState] = useState({
        bold: false,
        italic: false,
        underline: false,
        ul: false,
        ol: false,
        h1: false,
        h2: false
    });

    // Focus editor on mount and pre-fill content when editing
    useEffect(() => {
        if (contentRef.current) {
            if (editBlog?.content) {
                contentRef.current.innerHTML = editBlog.content;
            }
            contentRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const update = () => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;
            const range = selection.getRangeAt(0);
            const container = range.commonAncestorContainer;
            const el = container.nodeType === 3 ? container.parentElement : container;
            if (!contentRef.current || !el || !contentRef.current.contains(el)) return;

            const formatBlock = (document.queryCommandValue('formatBlock') || '')
                .toString()
                .replace(/[<>]/g, '')
                .toLowerCase();

            setFormatState({
                bold: !!document.queryCommandState('bold'),
                italic: !!document.queryCommandState('italic'),
                underline: !!document.queryCommandState('underline'),
                ul: !!document.queryCommandState('insertUnorderedList'),
                ol: !!document.queryCommandState('insertOrderedList'),
                h1: formatBlock === 'h1',
                h2: formatBlock === 'h2'
            });
        };

        document.addEventListener('selectionchange', update);
        return () => document.removeEventListener('selectionchange', update);
    }, []);

    const saveSelection = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const el = container.nodeType === 3 ? container.parentElement : container;
        if (!contentRef.current || !el || !contentRef.current.contains(el)) return;

        savedRangeRef.current = range.cloneRange();
    };

    const restoreSelection = () => {
        const range = savedRangeRef.current;
        if (!range) return false;
        const selection = window.getSelection();
        if (!selection) return false;
        selection.removeAllRanges();
        selection.addRange(range);
        return true;
    };

    // Convert file to base64 data URL
    const fileToDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Handle cover image upload
    const handleCoverImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('Image size should be less than 5MB');
            return;
        }

        try {
            const dataURL = await fileToDataURL(file);
            setCoverImageUrl(dataURL);
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Failed to load image');
        } finally {
            // allow re-uploading same file
            e.target.value = '';
        }
    };

    const openImagePicker = (e) => {
        e.preventDefault();
        // keep caret position so we can insert where user was typing
        saveSelection();
        setTimeout(() => fileInputRef.current?.click(), 0);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('Image size should be less than 5MB');
            return;
        }

        try {
            const dataURL = await fileToDataURL(file);
            restoreSelection();
            insertImageAtCursor(dataURL);
            setShowMediaMenu(false);
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Failed to load image');
        } finally {
            // allow re-uploading same file
            e.target.value = '';
        }
    };

    // Insert image at cursor position
    const insertImageAtCursor = (src) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) {
            if (!restoreSelection()) return;
        }

        const range = selection.getRangeAt(0);
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '8px';
        img.style.margin = '16px 0';

        range.deleteContents();
        range.insertNode(img);

        // Move cursor after image
        range.setStartAfter(img);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        if (contentRef.current) {
            setContent(contentRef.current.innerHTML);
            contentRef.current.focus();
        }
    };

    // Core formatting function using execCommand for WYSIWYG support
    const execCmd = (command, value = null) => {
        contentRef.current?.focus();
        document.execCommand(command, false, value);
        if (contentRef.current) {
            setContent(contentRef.current.innerHTML);
            contentRef.current.focus();
        }
    };

    const applyBlockStyle = (el, tagName) => {
        if (!el) return;
        if (tagName === 'h1') {
            el.style.fontSize = '2.25rem';
            el.style.fontWeight = '800';
            el.style.lineHeight = '1.15';
            el.style.margin = '1rem 0 0.75rem';
        } else if (tagName === 'h2') {
            el.style.fontSize = '1.75rem';
            el.style.fontWeight = '800';
            el.style.lineHeight = '1.2';
            el.style.margin = '0.9rem 0 0.6rem';
        } else {
            el.style.fontSize = '';
            el.style.fontWeight = '';
            el.style.lineHeight = '';
            el.style.margin = '';
        }
    };

    const toggleHeading = (tagName) => (e) => {
        e.preventDefault();
        contentRef.current?.focus();
        restoreSelection();

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        let el = node.nodeType === 3 ? node.parentElement : node;
        if (!el) return;

        // Find closest block within editor
        const blockTags = new Set(['P', 'DIV', 'H1', 'H2', 'BLOCKQUOTE', 'PRE', 'LI']);
        while (el && contentRef.current && el !== contentRef.current && !blockTags.has(el.tagName)) {
            el = el.parentElement;
        }

        if (!el || el === contentRef.current) {
            // Fallback: try execCommand
            execCmd('formatBlock', `<${tagName}>`);
            return;
        }

        const currentTag = el.tagName.toLowerCase();
        const newTag = currentTag === tagName ? 'p' : tagName;
        const replacement = document.createElement(newTag);

        // Move children
        while (el.firstChild) replacement.appendChild(el.firstChild);
        applyBlockStyle(replacement, newTag);

        el.parentNode.replaceChild(replacement, el);

        // Put caret at end
        const newRange = document.createRange();
        newRange.selectNodeContents(replacement);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);

        if (contentRef.current) {
            setContent(contentRef.current.innerHTML);
            contentRef.current.focus();
        }
    };

    // Improved list handler - indents entire line
    const handleList = (e) => {
        e.preventDefault();
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;

        // Check if we're in a list already
        let listItem = container.nodeType === 3 ? container.parentElement : container;
        while (listItem && listItem.nodeName !== 'LI' && listItem.nodeName !== 'UL' && listItem.nodeName !== 'OL') {
            listItem = listItem.parentElement;
        }

        if (listItem && listItem.nodeName === 'LI') {
            // Already in a list, just toggle
            execCmd('insertUnorderedList');
        } else {
            // Create new list
            execCmd('insertUnorderedList');
        }
    };

    const handleFormat = (e, command, value = null) => {
        e.preventDefault();
        execCmd(command, value);
    };

    // Handle link insertion
    const handleLinkClick = (e) => {
        e.preventDefault();
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText) {
            setLinkText(selectedText);
        } else {
            setLinkText('');
        }
        setShowLinkInput(true);
    };

    const insertLink = () => {
        if (!linkUrl.trim()) {
            alert('Please enter a URL');
            return;
        }

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        if (linkText.trim()) {
            // Replace selected text with link
            const link = document.createElement('a');
            link.href = linkUrl;
            link.textContent = linkText;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            range.deleteContents();
            range.insertNode(link);
        } else {
            // Insert link at cursor
            execCmd('createLink', linkUrl);
        }

        setShowLinkInput(false);
        setLinkUrl('');
        setLinkText('');

        if (contentRef.current) {
            setContent(contentRef.current.innerHTML);
            contentRef.current.focus();
        }
    };

    // Handle media menu
    const handleMediaMenu = (e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        setMediaMenuPosition({
            x: rect.left,
            y: rect.bottom + 8
        });
        setShowMediaMenu(!showMediaMenu);
    };

    const handleMediaOption = (type) => {
        setShowMediaMenu(false);

        switch (type) {
            case 'image':
                openImagePicker({ preventDefault: () => { } });
                break;
            case 'link':
                handleLinkClick({ preventDefault: () => { } });
                break;
            case 'video':
                const videoUrl = prompt('Enter video URL (YouTube, Vimeo, etc.):');
                if (videoUrl) {
                    insertVideoAtCursor(videoUrl);
                }
                break;
            case 'code':
                insertCodeBlock();
                break;
            case 'quote':
                execCmd('formatBlock', 'blockquote');
                break;
            default:
                break;
        }
    };

    const insertVideoAtCursor = (url) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const videoContainer = document.createElement('div');
        videoContainer.style.margin = '16px 0';
        videoContainer.style.position = 'relative';
        videoContainer.style.paddingBottom = '56.25%'; // 16:9 aspect ratio
        videoContainer.style.height = '0';
        videoContainer.style.overflow = 'hidden';
        videoContainer.style.borderRadius = '8px';

        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;

        videoContainer.appendChild(iframe);
        range.deleteContents();
        range.insertNode(videoContainer);

        if (contentRef.current) {
            setContent(contentRef.current.innerHTML);
            contentRef.current.focus();
        }
    };

    const insertCodeBlock = () => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const codeBlock = document.createElement('pre');
        codeBlock.style.backgroundColor = isDark ? '#1e293b' : '#f1f5f9';
        codeBlock.style.padding = '16px';
        codeBlock.style.borderRadius = '8px';
        codeBlock.style.overflow = 'auto';
        codeBlock.style.margin = '16px 0';
        codeBlock.style.fontFamily = 'monospace';
        codeBlock.style.fontSize = '14px';

        const code = document.createElement('code');
        code.textContent = selection.toString() || '// Your code here';
        codeBlock.appendChild(code);

        range.deleteContents();
        range.insertNode(codeBlock);

        if (contentRef.current) {
            setContent(contentRef.current.innerHTML);
            contentRef.current.focus();
        }
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
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            execCmd('underline');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            handleLinkClick(e);
        }
        // Tab for indentation
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            execCmd('indent');
        }
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            execCmd('outdent');
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

            if (editBlog) {
                // Edit mode: update existing blog
                await apiCall(`/api/blogs/${editBlog._id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        title,
                        content,
                        category: editBlog.category || 'General',
                        tags: editBlog.tags || [],
                        coverImage: coverImageUrl.trim() || null,
                    })
                });
                alert('Article updated successfully!');
            } else {
                // Create mode: publish new blog
                await apiCall('/api/blogs', {
                    method: 'POST',
                    body: JSON.stringify({
                        title,
                        content,
                        category: 'General',
                        tags: [],
                        coverImage: coverImageUrl.trim() || null,
                        published: true
                    })
                });
                alert('Article published successfully!');
            }
            onClose(); // Close editor
        } catch (error) {
            console.error('Publish error:', error);
            alert(`Error: ${error.message || "Failed to save article"}`);
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex flex-col ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Hidden file inputs */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
            <input
                type="file"
                ref={coverFileInputRef}
                accept="image/*"
                onChange={handleCoverImageUpload}
                style={{ display: 'none' }}
            />

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
                        {editBlog ? 'Editing' : 'Drafting'}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition
                            ${publishing ? 'bg-green-600 opacity-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'}`}
                    >
                        {publishing ? (editBlog ? 'Updating...' : 'Publishing...') : (editBlog ? 'Update' : 'Publish')}
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
                                <img src={coverImageUrl} alt="Cover" className="w-full max-h-[240px] object-cover" />
                                <button
                                    onClick={() => setCoverImageUrl('')}
                                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => coverFileInputRef.current?.click()}
                                className={`w-full p-8 rounded-xl border-2 border-dashed transition text-center
                                    ${isDark
                                        ? 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                <ImageIcon className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Click to upload cover image from your computer
                                </p>
                            </button>
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

                        <ToolbarButton active={formatState.bold} onClick={(e) => handleFormat(e, 'bold')} icon={Bold} label="Bold (Ctrl+B)" isDark={isDark} />
                        <ToolbarButton active={formatState.italic} onClick={(e) => handleFormat(e, 'italic')} icon={Italic} label="Italic (Ctrl+I)" isDark={isDark} />
                        <ToolbarButton active={formatState.underline} onClick={(e) => handleFormat(e, 'underline')} icon={Underline} label="Underline (Ctrl+U)" isDark={isDark} />
                        <div className={`w-px h-5 mx-2 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />

                        <ToolbarButton active={formatState.h1} onClick={toggleHeading('h1')} icon={Heading1} label="Heading 1" isDark={isDark} />
                        <ToolbarButton active={formatState.h2} onClick={toggleHeading('h2')} icon={Heading2} label="Heading 2" isDark={isDark} />
                        <div className={`w-px h-5 mx-2 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />

                        <ToolbarButton active={formatState.ul} onClick={handleList} icon={List} label="Bullet List" isDark={isDark} />
                        <ToolbarButton active={formatState.ol} onClick={(e) => handleFormat(e, 'insertOrderedList')} icon={ListOrdered} label="Numbered List" isDark={isDark} />
                        <div className={`w-px h-5 mx-2 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />

                        <ToolbarButton onClick={(e) => handleFormat(e, 'justifyLeft')} icon={AlignLeft} label="Align Left" isDark={isDark} />
                        <ToolbarButton onClick={(e) => handleFormat(e, 'justifyCenter')} icon={AlignCenter} label="Align Center" isDark={isDark} />
                        <ToolbarButton onClick={(e) => handleFormat(e, 'justifyRight')} icon={AlignRight} label="Align Right" isDark={isDark} />
                        <div className={`w-px h-5 mx-2 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />

                        {/* Insert Image (local file) */}
                        <ToolbarButton onClick={openImagePicker} icon={ImageIcon} label="Insert image" isDark={isDark} />

                        {/* Media Menu Button */}
                        <div className="relative">
                            <ToolbarButton
                                onClick={handleMediaMenu}
                                icon={Plus}
                                label="Insert"
                                isDark={isDark}
                                showDropdown={showMediaMenu}
                            />
                            {showMediaMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setShowMediaMenu(false)}
                                    />
                                    <div
                                        className={`absolute left-0 top-full mt-2 w-56 rounded-lg shadow-xl border py-2 z-40
                                            ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                                        style={{
                                            left: mediaMenuPosition.x - 200,
                                            top: mediaMenuPosition.y
                                        }}
                                    >
                                        <MediaMenuItem
                                            icon={ImageIcon}
                                            label="Image"
                                            onClick={() => handleMediaOption('image')}
                                            isDark={isDark}
                                        />
                                        <MediaMenuItem
                                            icon={LinkIcon}
                                            label="Link"
                                            onClick={() => handleMediaOption('link')}
                                            isDark={isDark}
                                        />
                                        <MediaMenuItem
                                            icon={Video}
                                            label="Video"
                                            onClick={() => handleMediaOption('video')}
                                            isDark={isDark}
                                        />
                                        <MediaMenuItem
                                            icon={Code}
                                            label="Code block"
                                            onClick={() => handleMediaOption('code')}
                                            isDark={isDark}
                                        />
                                        <MediaMenuItem
                                            icon={Quote}
                                            label="Quote"
                                            onClick={() => handleMediaOption('quote')}
                                            isDark={isDark}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Link Input Modal */}
                    {showLinkInput && (
                        <>
                            <div
                                className="fixed inset-0 z-50 bg-black/50"
                                onClick={() => {
                                    setShowLinkInput(false);
                                    setLinkUrl('');
                                    setLinkText('');
                                }}
                            />
                            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 p-6 rounded-xl shadow-xl
                                ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Insert Link
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Link Text
                                        </label>
                                        <input
                                            type="text"
                                            value={linkText}
                                            onChange={(e) => setLinkText(e.target.value)}
                                            placeholder="Link text"
                                            className={`w-full px-3 py-2 rounded-lg border outline-none
                                                ${isDark
                                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            URL
                                        </label>
                                        <input
                                            type="url"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            className={`w-full px-3 py-2 rounded-lg border outline-none
                                                ${isDark
                                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => {
                                                setShowLinkInput(false);
                                                setLinkUrl('');
                                                setLinkText('');
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition
                                                ${isDark
                                                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={insertLink}
                                            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition"
                                        >
                                            Insert
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* WYSIWYG Content Area */}
                    <div
                        ref={contentRef}
                        contentEditable
                        onInput={(e) => setContent(e.currentTarget.innerHTML)}
                        onKeyDown={handleKeyDown}
                        className={`editor-content min-h-[500px] text-xl leading-relaxed outline-none max-w-none
                            ${isDark ? 'prose-invert text-gray-300' : 'text-gray-800'}
                            empty:before:content-[attr(placeholder)] empty:before:text-gray-400 cursor-text`}
                        placeholder="Tell your story..."
                        style={{ whiteSpace: 'pre-wrap' }}
                    />

                    {/* Local styles for headings/lists (Tailwind preflight resets them) */}
                    <style>{`
                      .editor-content h1 { font-size: 2.25rem; font-weight: 800; line-height: 1.15; margin: 1rem 0 0.75rem; }
                      .editor-content h2 { font-size: 1.75rem; font-weight: 800; line-height: 1.2; margin: 0.9rem 0 0.6rem; }
                      .editor-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
                      .editor-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
                      .editor-content li { margin: 0.25rem 0; }
                      .editor-content a { color: ${isDark ? '#34d399' : '#059669'}; text-decoration: underline; }
                      .editor-content u { text-decoration: underline !important; }
                      .editor-content s { text-decoration: line-through !important; }
                      .editor-content b, .editor-content strong { font-weight: bold !important; }
                      .editor-content i, .editor-content em { font-style: italic !important; }
                    `}</style>
                </div>
            </div>
        </div>
    );
}

// Helper Component for Toolbar Buttons
function ToolbarButton({ onClick, icon: Icon, label, isDark, showDropdown, active }) {
    return (
        <button
            onMouseDown={onClick}
            className={`p-2 rounded-lg transition-colors relative
                ${active || showDropdown
                    ? isDark ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-900'
                    : isDark ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }
            `}
            title={label}
        >
            <Icon className="w-5 h-5" strokeWidth={2} />
        </button>
    );
}

// Media Menu Item Component
function MediaMenuItem({ icon: Icon, label, onClick, isDark }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                ${isDark
                    ? 'text-gray-300 hover:bg-slate-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
        >
            <Icon className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import {
    Send,
    MoreVertical,
    Phone,
    Video,
    Info,
    Image as ImageIcon,
    Smile,
    Search,
    ArrowLeft,
    Check,
    CheckCheck,
    Clock
} from 'lucide-react';
import {
    getConversations,
    getMessages,
    sendMessage,
    markConversationAsRead,
    getOrCreateConversation
} from '../utils/messageapi';

export default function MessagesContent({ initialConversationId }) {
    const { currentUser, mongoUser } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

    // Initialize socket with authentication
    useEffect(() => {
        if (!currentUser) return;

        const initSocket = async () => {
            const token = await currentUser.getIdToken();

            const newSocket = io('http://localhost:5000', {
                auth: { token }
            });

            newSocket.on('connect', () => {
                console.log('✅ Socket connected');
            });

            newSocket.on('connect_error', (error) => {
                console.error('❌ Socket connection failed:', error.message);
            });

            setSocket(newSocket);
        };

        initSocket();

        return () => {
            if (socket) socket.close();
        };
    }, [currentUser]);

    // Handle window resize for responsive view
    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch conversations
    useEffect(() => {
        if (currentUser) {
            fetchConversations();
        }
    }, [currentUser]);

    // Handle initial conversation (e.g. from profile)
    useEffect(() => {
        if (initialConversationId && conversations.length > 0) {
            const conv = conversations.find(c => c._id === initialConversationId);
            if (conv) {
                handleSelectConversation(conv);
            }
        }
    }, [initialConversationId, conversations]);

    // Socket listeners
    useEffect(() => {
        if (!socket || !mongoUser) return;

        const handleNewMessage = (data) => {
            const { conversationId, message } = data;

            // Update messages if this conversation is open
            if (selectedConversation?._id === conversationId) {
                setMessages(prev => {
                    // Remove optimistic message if exists
                    const filtered = prev.filter(m => !m.isOptimistic);
                    return [...filtered, message];
                });

                // Mark as read immediately if we are looking at it and it's from other user
                const senderId = message.sender?._id || message.sender;
                if (senderId !== mongoUser._id) {
                    markRead(conversationId);
                }
            }

            // Update conversation list (move to top, update last message)
            setConversations(prev => {
                const updated = [...prev];
                const index = updated.findIndex(c => c._id === conversationId);

                if (index > -1) {
                    const conv = updated[index];
                    const senderId = message.sender?._id || message.sender;
                    const isFromMe = senderId === mongoUser._id;
                    const isConversationOpen = selectedConversation?._id === conversationId;

                    // Remove and add to top
                    updated.splice(index, 1);
                    updated.unshift({
                        ...conv,
                        lastMessage: {
                            text: message.text,
                            sender: senderId,
                            timestamp: message.createdAt || new Date()
                        },
                        unreadCount: (isConversationOpen || isFromMe)
                            ? 0
                            : (conv.unreadCount || 0) + 1
                    });
                }
                return updated;
            });
        };

        socket.on('new-message', handleNewMessage);

        return () => {
            socket.off('new-message', handleNewMessage);
        };
    }, [socket, selectedConversation, mongoUser]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Join/leave conversation room
    useEffect(() => {
        if (socket && selectedConversation) {
            socket.emit('join-conversation', selectedConversation._id);

            return () => {
                socket.emit('leave-conversation', selectedConversation._id);
            };
        }
    }, [selectedConversation, socket]);

    const fetchConversations = async () => {
        try {
            const res = await getConversations();
            if (res.success) {
                setConversations(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        } finally {
            setLoading(false);
        }
    };

    const markRead = async (convId) => {
        try {
            await markConversationAsRead(convId);
            setConversations(prev => prev.map(c =>
                c._id === convId ? { ...c, unreadCount: 0 } : c
            ));
        } catch (err) {
            console.error("Failed to mark read", err);
        }
    };

    const handleSelectConversation = async (conv) => {
        setSelectedConversation(conv);
        setMessages([]); // Clear old messages

        // Mark as read
        if (conv.unreadCount > 0) {
            markRead(conv._id);
        }

        try {
            const res = await getMessages(conv._id);
            if (res.success) {
                setMessages(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedConversation) return;

        const text = inputText.trim();
        setInputText(''); // Optimistic clear

        // Optimistic message
        const tempMessage = {
            _id: `temp-${Date.now()}`,
            conversationId: selectedConversation._id,
            sender: {
                _id: mongoUser?._id,
                displayName: mongoUser?.displayName,
                photoURL: mongoUser?.photoURL
            },
            text,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };

        setMessages(prev => [...prev, tempMessage]);

        try {
            const res = await sendMessage(selectedConversation._id, text);
            if (res.success) {
                // Socket event will handle adding the real message
                // Remove optimistic message
                setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
            } else {
                // Remove temp message on failure
                setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
                setInputText(text); // Restore input
                alert('Failed to send message');
            }
        } catch (error) {
            console.error("Send failed", error);
            setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
            setInputText(text);
            alert('Failed to send message');
        }
    };

    // Helper to getting other participant
    const getOtherParticipant = (conv) => {
        return conv.participants.find(p => p._id !== mongoUser?._id) || conv.participants[0];
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full text-gray-500">
                Loading conversations...
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white dark:bg-slate-900">
            {/* Sidebar List */}
            <div className={`${isMobileView && selectedConversation ? 'hidden' : 'block'} w-full lg:w-80 border-r border-gray-200 dark:border-slate-800 flex flex-col`}>
                <div className="p-4 border-b border-gray-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages"
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 ring-scribe-green"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No conversations yet. Start chatting by visiting someone's profile!
                        </div>
                    ) : (
                        conversations.map(conv => {
                            const other = getOtherParticipant(conv);
                            const isActive = selectedConversation?._id === conv._id;
                            const isUnread = conv.unreadCount > 0;

                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${isActive ? 'bg-blue-50 dark:bg-slate-800/50' : ''}`}
                                >
                                    <div className="relative">
                                        <img
                                            src={other.photoURL || `https://ui-avatars.com/api/?name=${other.displayName}&background=random`}
                                            alt=""
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`font-medium truncate ${isUnread ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {other.displayName}
                                            </h3>
                                            <span className={`text-xs ${isUnread ? 'text-scribe-green font-bold' : 'text-gray-500'}`}>
                                                {conv.lastMessage?.timestamp ? new Date(conv.lastMessage.timestamp).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-sm truncate ${isUnread ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
                                                {conv.lastMessage?.sender === mongoUser?._id ? 'You: ' : ''}
                                                {conv.lastMessage?.text || 'Started a conversation'}
                                            </p>
                                            {isUnread && (
                                                <span className="w-5 h-5 flex items-center justify-center bg-scribe-green text-white text-xs rounded-full flex-shrink-0 ml-2">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`${isMobileView && !selectedConversation ? 'hidden' : 'flex'} flex-1 flex-col bg-white dark:bg-slate-950`}>
                {selectedConversation ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {isMobileView && (
                                    <button onClick={() => setSelectedConversation(null)} className="mr-2">
                                        <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                    </button>
                                )}
                                <img
                                    src={getOtherParticipant(selectedConversation).photoURL ||
                                        `https://ui-avatars.com/api/?name=${getOtherParticipant(selectedConversation).displayName}&background=random`}
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        {getOtherParticipant(selectedConversation).displayName}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        @{getOtherParticipant(selectedConversation).username}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-500">
                                <button><Phone className="w-5 h-5 hover:text-gray-900 dark:hover:text-white" /></button>
                                <button><Video className="w-5 h-5 hover:text-gray-900 dark:hover:text-white" /></button>
                                <button><Info className="w-5 h-5 hover:text-gray-900 dark:hover:text-white" /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 my-10">
                                    <p>Say hello to start the conversation!</p>
                                </div>
                            )}
                            {messages.map((msg) => {
                                const senderId = msg.sender?._id || msg.sender;
                                const isMe = senderId === mongoUser?._id;

                                return (
                                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div
                                                className={`px-4 py-2 rounded-2xl text-sm ${isMe
                                                    ? 'bg-scribe-green text-white rounded-br-none'
                                                    : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-none shadow-sm'
                                                    } ${msg.isOptimistic ? 'opacity-60' : ''}`}
                                            >
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition">
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition">
                                    <Smile className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 ring-scribe-green"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="p-2 bg-scribe-green text-white rounded-full hover:bg-scribe-emerald transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5 pl-0.5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Send className="w-10 h-10 text-scribe-green" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your Messages</h3>
                        <p className="text-center max-w-md">
                            Send private messages to other writers. Select a conversation to start chatting!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
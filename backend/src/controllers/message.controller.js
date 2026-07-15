import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Get all conversations for the current user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('participants', 'displayName photoURL username email')
      .populate('lastMessage.sender', 'displayName photoURL')
      .sort({ 'lastMessage.timestamp': -1 });

    // Format response with unread counts
    const formatted = conversations.map(conv => ({
      _id: conv._id,
      participants: conv.participants,
      lastMessage: conv.lastMessage,
      unreadCount: conv.getUnreadCount(userId),
      updatedAt: conv.updatedAt
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
};

// Get or create conversation with a specific user
export const getOrCreateConversation = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.params;

    // Validate user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findBetweenUsers(currentUserId, userId);

    // If not, create new conversation
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, userId],
        unreadCount: new Map([
          [currentUserId.toString(), 0],
          [userId.toString(), 0]
        ])
      });

      conversation = await conversation.populate('participants', 'displayName photoURL username email');
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Get/create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get or create conversation'
    });
  }
};

// Get messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;
    const { limit = 50, before } = req.query;

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to conversation'
      });
    }

    // Build query
    const query = {
      conversationId,
      isDeleted: false
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    // Fetch messages
    const messages = await Message.find(query)
      .populate('sender', 'displayName photoURL username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { conversationId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId
    });

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to conversation'
      });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      sender: senderId,
      text: text.trim()
    });

    // Populate sender info
    await message.populate('sender', 'displayName photoURL username');

    // Update conversation's last message
    conversation.lastMessage = {
      text: text.trim(),
      sender: senderId,
      timestamp: new Date()
    };

    // Increment unread count for other participant(s)
    const otherParticipants = conversation.participants.filter(
      p => p.toString() !== senderId.toString()
    );

    for (const participantId of otherParticipants) {
      await conversation.incrementUnread(participantId);
    }

    await conversation.save();

    // Emit socket event (will be handled by socket.io)
    if (req.io) {
      req.io.to(conversationId.toString()).emit('new-message', {
        conversationId,
        message
      });
    }

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Mark conversation as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Reset unread count for this user
    await conversation.resetUnread(userId);

    // Mark all unread messages as read
    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Conversation marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark as read'
    });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId
    });

    if (!message) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized or message not found'
      });
    }

    message.isDeleted = true;
    message.text = 'This message was deleted';
    await message.save();

    // Emit socket event
    if (req.io) {
      req.io.to(message.conversationId.toString()).emit('message-deleted', {
        messageId,
        conversationId: message.conversationId
      });
    }

    res.json({
      success: true,
      message: 'Message deleted'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
};

// Get total unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId
    });

    let totalUnread = 0;
    conversations.forEach(conv => {
      totalUnread += conv.getUnreadCount(userId);
    });

    res.json({
      success: true,
      data: { unreadCount: totalUnread }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};
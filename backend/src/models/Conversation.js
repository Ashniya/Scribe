import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    text: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: Date
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Index for fast lookups
conversationSchema.index({ participants: 1 });

// Method to find conversation between two users
conversationSchema.statics.findBetweenUsers = async function(user1Id, user2Id) {
  return await this.findOne({
    participants: { $all: [user1Id, user2Id], $size: 2 }
  }).populate('participants', 'displayName photoURL username email');
};

// Method to get unread count for a user
conversationSchema.methods.getUnreadCount = function(userId) {
  return this.unreadCount.get(userId.toString()) || 0;
};

// Method to increment unread count
conversationSchema.methods.incrementUnread = async function(userId) {
  const count = this.unreadCount.get(userId.toString()) || 0;
  this.unreadCount.set(userId.toString(), count + 1);
  await this.save();
};

// Method to reset unread count
conversationSchema.methods.resetUnread = async function(userId) {
  this.unreadCount.set(userId.toString(), 0);
  await this.save();
};

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
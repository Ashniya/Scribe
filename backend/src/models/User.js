import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Firebase Integration
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,  // Allows null for non-Firebase users
    index: true
  },

  // Basic Info (from teammate's model)
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true
  },

  displayName: {
    type: String,
    required: true,
    trim: true
  },

  // Legacy auth fields (keep for compatibility)
  password: {
    type: String,
    select: false
  },

  provider: {
    type: String,
    enum: ['email', 'google', 'github', 'firebase'],
    default: 'firebase'
  },

  providerId: {
    type: String
  },

  photoURL: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=random'
  },

  // Profile Fields (your additions)
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },

  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },

  coverImage: {
    type: String,
    default: ''
  },

  // Social Links
  socialLinks: {
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' }
  },

  location: {
    type: String,
    default: ''
  },

  occupation: {
    type: String,
    default: ''
  },

  // Follow System (Social)
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  followerCount: {
    type: Number,
    default: 0
  },

  followingCount: {
    type: Number,
    default: 0
  },

  // Subscription System (Email)
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  subscribedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  subscriberCount: {
    type: Number,
    default: 0
  },

  subscribedToCount: {
    type: Number,
    default: 0
  },

  // Saved Posts & Reading Lists
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'  // References Blog model
  }],

  readingLists: [{
    name: String,
    description: String,
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }],
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],

  // Stats (syncs with Blog data)
  totalPosts: {
    type: Number,
    default: 0
  },

  totalViews: {
    type: Number,
    default: 0
  },

  // Settings
  emailNotifications: {
    newFollower: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    likes: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false }
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
// userSchema.index({ username: 1 }); // Already indexed by unique: true
// userSchema.index({ email: 1 });    // Already indexed by unique: true
// userSchema.index({ firebaseUid: 1 }); // Already indexed by index: true

// Virtual for profile URL
userSchema.virtual('profileUrl').get(function () {
  return `/@${this.username}`;
});

// Method to check if user follows another user
userSchema.methods.isFollowing = function (userId) {
  return this.following.includes(userId);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    username: this.username,
    displayName: this.displayName,
    bio: this.bio,
    photoURL: this.photoURL,
    coverImage: this.coverImage,
    socialLinks: this.socialLinks,
    location: this.location,
    occupation: this.occupation,
    followerCount: this.followerCount,
    followingCount: this.followingCount,
    totalPosts: this.totalPosts,
    totalViews: this.totalViews,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
    profileUrl: this.profileUrl
  };
};

export default mongoose.model('User', userSchema);
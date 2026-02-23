import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

// ... (previous code)

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user profile by username
// @route   GET /api/profile/@:username
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile/me
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { displayName, username, bio, location, occupation, socialLinks } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      // Check username uniqueness BEFORE assigning
      if (username && username !== user.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'Username already taken' });
        }
        user.username = username;
      }

      user.displayName = displayName || user.displayName;
      user.bio = bio !== undefined ? bio : user.bio;
      user.location = location !== undefined ? location : user.location;
      user.occupation = occupation !== undefined ? occupation : user.occupation;
      user.socialLinks = socialLinks || user.socialLinks;

      const updatedUser = await user.save();
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Upload Avatar
// @route   POST /api/profile/me/avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // In a real app, upload to S3/Cloudinary. Here we assume local upload (already handled by multer in route) yields a path.
    // But since we strictly use Firebase Auth, we might want to store URL.
    // For local dev with multer:
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const user = await User.findById(req.user._id);
    user.photoURL = avatarUrl;
    user.avatar = avatarUrl; // Keep both for now
    await user.save();

    res.json({ success: true, avatar: avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Upload Cover Image
// @route   POST /api/profile/me/cover
// @access  Private
export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const coverUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const user = await User.findById(req.user._id);
    user.coverImage = coverUrl;
    await user.save();

    res.json({ success: true, coverImage: coverUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get Followers
// @route   GET /api/profile/@:username/followers
// @access  Public
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const followers = await User.find({ _id: { $in: user.followers } })
      .select('displayName username photoURL bio');

    res.json({ success: true, users: followers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get Following
// @route   GET /api/profile/@:username/following
// @access  Public
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const following = await User.find({ _id: { $in: user.following } })
      .select('displayName username photoURL bio');

    res.json({ success: true, users: following });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get User Activity (Comments, Posts)
// @route   GET /api/profile/activity/:userId
// @access  Public
export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Get recent posts
    const posts = await Blog.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 2. Get recent comments
    const comments = await Comment.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('blogId', 'title slug') // Get blog title
      .lean();

    const activity = [
      ...posts.map(post => ({
        type: 'post',
        data: post,
        createdAt: post.createdAt
      })),
      ...comments.map(comment => ({
        type: 'comment',
        data: comment,
        createdAt: comment.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10); // Keep top 10 combined

    res.status(200).json({
      success: true,
      data: activity
    });

  } catch (error) {
    console.error('Get Activity Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
// @route   POST /api/profile/follow/:userId
// @access  Private
// Helper to resolve user ID (handles ObjectId vs Firebase UID)
const resolveUser = async (idOrUid) => {
  const mongoose = (await import('mongoose')).default;
  if (mongoose.Types.ObjectId.isValid(idOrUid)) {
    const user = await User.findById(idOrUid);
    if (user) return user;
  }
  return await User.findOne({ firebaseUid: idOrUid });
};

// @route   POST /api/profile/follow/:userId
// @access  Private
export const followUser = async (req, res) => {
  try {
    const userToFollow = await resolveUser(req.params.userId);
    const currentUser = await resolveUser(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'Current user not found' });
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ success: false, message: 'Already following this user' });
    }

    // Update arrays and counts
    currentUser.following.push(userToFollow._id);
    currentUser.followingCount = (currentUser.followingCount || 0) + 1;

    userToFollow.followers.push(currentUser._id);
    userToFollow.followerCount = (userToFollow.followerCount || 0) + 1;

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: `You are now following ${userToFollow.displayName}`,
      data: {
        isFollowing: true,
        followerCount: userToFollow.followerCount
      }
    });

  } catch (error) {
    console.error('Follow Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/profile/follow/:userId
// @access  Private
// @desc    Unfollow a user
// @route   DELETE /api/profile/follow/:userId
// @access  Private
export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await resolveUser(req.params.userId);
    const currentUser = await resolveUser(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'Current user not found' });
    }

    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ success: false, message: 'You are not following this user' });
    }

    // Remove from arrays and update counts
    currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow._id.toString());
    currentUser.followingCount = Math.max(0, (currentUser.followingCount || 1) - 1);

    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());
    userToUnfollow.followerCount = Math.max(0, (userToUnfollow.followerCount || 1) - 1);

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      message: `Unfollowed ${userToUnfollow.displayName}`,
      data: {
        isFollowing: false,
        followerCount: userToUnfollow.followerCount
      }
    });

  } catch (error) {
    console.error('Unfollow Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Subscribe to a user (Email notifications)
// @route   POST /api/profile/subscribe/:userId
// @access  Private
// @desc    Subscribe to a user (Email notifications)
// @route   POST /api/profile/subscribe/:userId
// @access  Private
export const subscribeUser = async (req, res) => {
  try {
    const userToSub = await resolveUser(req.params.userId);
    const currentUser = await resolveUser(req.user._id);

    if (!userToSub) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'Current user not found' });
    }

    if (userToSub._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot subscribe to yourself' });
    }

    if (currentUser.subscribedTo.includes(userToSub._id)) {
      return res.status(400).json({ success: false, message: 'Already subscribed to this user' });
    }

    currentUser.subscribedTo.push(userToSub._id);
    currentUser.subscribedToCount = (currentUser.subscribedToCount || 0) + 1;

    userToSub.subscribers.push(currentUser._id);
    userToSub.subscriberCount = (userToSub.subscriberCount || 0) + 1;

    await currentUser.save();
    await userToSub.save();

    res.status(200).json({
      success: true,
      message: `Subscribed to ${userToSub.displayName}`,
      data: {
        isSubscribed: true,
        subscriberCount: userToSub.subscriberCount
      }
    });

  } catch (error) {
    console.error('Subscribe Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Unsubscribe from a user
// @route   DELETE /api/profile/subscribe/:userId
// @access  Private
// @desc    Unsubscribe from a user
// @route   DELETE /api/profile/subscribe/:userId
// @access  Private
export const unsubscribeUser = async (req, res) => {
  try {
    const userToUnsub = await resolveUser(req.params.userId);
    const currentUser = await resolveUser(req.user._id);

    if (!userToUnsub) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'Current user not found' });
    }

    if (!currentUser.subscribedTo.includes(userToUnsub._id)) {
      return res.status(400).json({ success: false, message: 'Not subscribed to this user' });
    }

    currentUser.subscribedTo = currentUser.subscribedTo.filter(id => id.toString() !== userToUnsub._id.toString());
    currentUser.subscribedToCount = Math.max(0, (currentUser.subscribedToCount || 1) - 1);

    userToUnsub.subscribers = userToUnsub.subscribers.filter(id => id.toString() !== currentUser._id.toString());
    userToUnsub.subscriberCount = Math.max(0, (userToUnsub.subscriberCount || 1) - 1);

    await currentUser.save();
    await userToUnsub.save();

    res.status(200).json({
      success: true,
      message: `Unsubscribed from ${userToUnsub.displayName}`,
      data: {
        isSubscribed: false,
        subscriberCount: userToUnsub.subscriberCount
      }
    });

  } catch (error) {
    console.error('Unsubscribe Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


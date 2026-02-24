// // frontend/src/utils/api.js
// import { auth } from '../config/firebase';

// const API_URL = 'http://localhost:5000/api';

// // Helper to get auth token
// const getAuthToken = async () => {
//   const user = auth.currentUser;
//   if (!user) throw new Error('Not authenticated');
//   return await user.getIdToken();
// };

// // Helper for API calls
// const apiCall = async (endpoint, options = {}) => {
//   try {
//     const token = await getAuthToken();
//     const response = await fetch(`${API_URL}${endpoint}`, {
//       ...options,
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         ...options.headers,
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || data.error || 'API call failed');
//     }

//     return data;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };

// // ============= AUTH APIs =============

// export const registerUser = async (userData) => {
//   const response = await fetch(`${API_URL}/auth/register`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(userData),
//   });
//   return response.json();
// };

// export const getCurrentUser = async () => {
//   return apiCall('/auth/me');
// };

// // ============= PROFILE APIs =============

// export const getMyProfile = async () => {
//   return apiCall('/profile/me');
// };

// export const getUserProfile = async (username) => {
//   const response = await fetch(`${API_URL}/profile/@${username}`);
//   return response.json();
// };

// export const updateProfile = async (profileData) => {
//   return apiCall('/profile/me', {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(profileData),
//   });
// };

// export const uploadAvatar = async (imageFile) => {
//   const token = await getAuthToken();
//   const formData = new FormData();
//   formData.append('avatar', imageFile);

//   try {
//     const response = await fetch(`${API_URL}/profile/me/avatar`, {
//       method: 'POST',
//       headers: { 'Authorization': `Bearer ${token}` },
//       body: formData,
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || data.details || 'Failed to upload avatar');
//     }

//     return data;
//   } catch (error) {
//     console.error('Avatar upload error:', error);
//     throw error;
//   }
// };

// export const uploadCoverImage = async (imageFile) => {
//   const token = await getAuthToken();
//   const formData = new FormData();
//   formData.append('cover', imageFile);

//   try {
//     const response = await fetch(`${API_URL}/profile/me/cover`, {
//       method: 'POST',
//       headers: { 'Authorization': `Bearer ${token}` },
//       body: formData,
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || data.details || 'Failed to upload cover image');
//     }

//     return data;
//   } catch (error) {
//     console.error('Cover upload error:', error);
//     throw error;
//   }
// };

// export const uploadImage = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve({ success: true, url: reader.result });
//     reader.onerror = (error) => reject({ success: false, message: 'Failed to read file' });
//   });
// };

// export const followUser = async (userId) => {
//   return apiCall(`/profile/follow/${userId}`, { method: 'POST' });
// };

// export const unfollowUser = async (userId) => {
//   return apiCall(`/profile/follow/${userId}`, { method: 'DELETE' });
// };

// export const getFollowers = async (username, page = 1) => {
//   const response = await fetch(`${API_URL}/profile/@${username}/followers?page=${page}`);
//   return response.json();
// };

// export const getFollowing = async (username, page = 1) => {
//   const response = await fetch(`${API_URL}/profile/@${username}/following?page=${page}`);
//   return response.json();
// };

// export const subscribeUser = async (userId) => {
//   return apiCall(`/profile/subscribe/${userId}`, { method: 'POST' });
// };

// export const unsubscribeUser = async (userId) => {
//   return apiCall(`/profile/subscribe/${userId}`, { method: 'DELETE' });
// };

// export const getUserActivity = async (userId) => {
//   const response = await fetch(`${API_URL}/profile/activity/${userId}`);
//   return response.json();
// };

// export const saveBlog = async (blogId) => {
//   return apiCall(`/blogs/${blogId}/save`, { method: 'POST' });
// };

// export const getMyStats = async () => {
//   return apiCall('/stats/my-stats');
// };

// // ============= USER APIs =============

// export const checkUsername = async (username) => {
//   const response = await fetch(`${API_URL}/users/check-username/${username}`);
//   return response.json();
// };

// export const searchUsers = async (query, limit = 10) => {
//   const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}&limit=${limit}`);
//   return response.json();
// };

// export const getSuggestedUsers = async (limit = 5) => {
//   return apiCall(`/users/suggested?limit=${limit}`);
// };

// export const searchBlogs = async (query) => {
//   const response = await fetch(`${API_URL}/blogs?q=${encodeURIComponent(query)}`);
//   return response.json();
// };

// // ============= BLOG APIs =============

// export const getAllBlogs = async (page = 1, limit = 20) => {
//   const response = await fetch(`${API_URL}/blogs?page=${page}&limit=${limit}`);
//   return response.json();
// };

// export const getMyBlogs = async () => {
//   return apiCall('/blogs/my-blogs');
// };

// export const createBlog = async (blogData) => {
//   return apiCall('/blogs', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(blogData),
//   });
// };

// export const getBlogById = async (blogId) => {
//   const response = await fetch(`${API_URL}/blogs/${blogId}`);
//   return response.json();
// };

// export const repostBlog = async (blogId) => {
//   return apiCall(`/blogs/${blogId}/repost`, { method: 'POST' });
// };

// export const trackReadTime = async (blogId, duration) => {
//   return apiCall(`/blogs/${blogId}/track-time`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ duration }),
//     keepalive: true
//   });
// };

// // ============= COMMENT APIs =============

// export const getComments = async (blogId) => {
//   const response = await fetch(`${API_URL}/comments/${blogId}`);
//   return response.json();
// };

// export const addComment = async (blogId, content) => {
//   return apiCall(`/comments/${blogId}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ content }),
//   });
// };

// export const likeComment = async (commentId) => {
//   return apiCall(`/comments/${commentId}/like`, {
//     method: 'PUT'
//   });
// };

// export const deleteComment = async (commentId) => {
//   return apiCall(`/comments/${commentId}`, {
//     method: 'DELETE'
//   });
// };

// export default {
//   registerUser,
//   getCurrentUser,
//   getMyProfile,
//   getUserProfile,
//   updateProfile,
//   uploadAvatar,
//   uploadCoverImage,
//   uploadImage,
//   followUser,
//   unfollowUser,
//   getFollowers,
//   getFollowing,
//   checkUsername,
//   searchUsers,
//   searchBlogs,
//   getSuggestedUsers,
//   getAllBlogs,
//   getMyBlogs,
//   createBlog,
//   subscribeUser,
//   unsubscribeUser,
//   getUserActivity,
//   saveBlog,
//   getMyStats,
//   getBlogById,
//   repostBlog,
//   trackReadTime,
//   getComments,
//   addComment,
//   likeComment,
//   deleteComment
// };
// frontend/src/utils/api.js
import { auth } from '../config/firebase';

const API_URL = 'http://localhost:5000/api';

// Helper to get auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return await user.getIdToken();
};

// Helper for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============= AUTH APIs =============

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const getCurrentUser = async () => {
  return apiCall('/auth/me');
};

// ============= PROFILE APIs =============

export const getMyProfile = async () => {
  return apiCall('/profile/me');
};

export const getUserProfile = async (username) => {
  const response = await fetch(`${API_URL}/profile/@${username}`);
  return response.json();
};

export const updateProfile = async (profileData) => {
  return apiCall('/profile/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
};

export const uploadAvatar = async (imageFile) => {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append('avatar', imageFile);

  try {
    const response = await fetch(`${API_URL}/profile/me/avatar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.details || 'Failed to upload avatar');
    }

    return data;
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw error;
  }
};

export const uploadCoverImage = async (imageFile) => {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append('cover', imageFile);

  try {
    const response = await fetch(`${API_URL}/profile/me/cover`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.details || 'Failed to upload cover image');
    }

    return data;
  } catch (error) {
    console.error('Cover upload error:', error);
    throw error;
  }
};

// KEPT FROM feature/aditi - helper for base64 image uploads
export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({ success: true, url: reader.result });
    reader.onerror = (error) => reject({ success: false, message: 'Failed to read file' });
  });
};

export const followUser = async (userId) => {
  return apiCall(`/profile/follow/${userId}`, { method: 'POST' });
};

export const unfollowUser = async (userId) => {
  return apiCall(`/profile/follow/${userId}`, { method: 'DELETE' });
};

export const getFollowers = async (username, page = 1) => {
  const response = await fetch(`${API_URL}/profile/@${username}/followers?page=${page}`);
  return response.json();
};

export const getFollowing = async (username, page = 1) => {
  const response = await fetch(`${API_URL}/profile/@${username}/following?page=${page}`);
  return response.json();
};

export const subscribeUser = async (userId) => {
  return apiCall(`/profile/subscribe/${userId}`, { method: 'POST' });
};

export const unsubscribeUser = async (userId) => {
  return apiCall(`/profile/subscribe/${userId}`, { method: 'DELETE' });
};

export const getUserActivity = async (userId) => {
  const response = await fetch(`${API_URL}/profile/activity/${userId}`);
  return response.json();
};

export const saveBlog = async (blogId) => {
  return apiCall(`/blogs/${blogId}/save`, { method: 'POST' });
};

export const getMyStats = async (range) => {
  return apiCall(`/stats/my-stats?range=${range}`);
};

// ============= USER APIs =============

export const checkUsername = async (username) => {
  const response = await fetch(`${API_URL}/users/check-username/${username}`);
  return response.json();
};

export const searchUsers = async (query, limit = 10) => {
  const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  return response.json();
};

export const getSuggestedUsers = async (limit = 5) => {
  return apiCall(`/users/suggested?limit=${limit}`);
};

export const searchBlogs = async (query) => {
  const response = await fetch(`${API_URL}/blogs?q=${encodeURIComponent(query)}`);
  return response.json();
};

// ============= BLOG APIs =============

export const getAllBlogs = async (page = 1, limit = 20) => {
  const response = await fetch(`${API_URL}/blogs?page=${page}&limit=${limit}`);
  return response.json();
};

export const getMyBlogs = async () => {
  return apiCall('/blogs/user/my-blogs');
};

export const getBlogBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/blogs/slug/${slug}`);
  return response.json();
};

export const createBlog = async (blogData) => {
  return apiCall('/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData),
  });
};

export const getBlogById = async (blogId) => {
  const response = await fetch(`${API_URL}/blogs/${blogId}`);
  return response.json();
};

export const repostBlog = async (blogId) => {
  return apiCall(`/blogs/${blogId}/repost`, { method: 'POST' });
};

export const trackReadTime = async (blogId, duration) => {
  return apiCall(`/blogs/${blogId}/track-time`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration }),
    keepalive: true
  });
};

// KEPT FROM merge-test-aditi - like blog function
export const likeBlog = async (blogId) => {
  return apiCall(`/blogs/${blogId}/like`, { method: 'POST' });
};

export const deleteBlog = async (blogId) => {
  return apiCall(`/blogs/${blogId}`, { method: 'DELETE' });
};

export const updateBlog = async (blogId, blogData) => {
  return apiCall(`/blogs/${blogId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData),
  });
};

// ============= COMMENT APIs =============

export const getComments = async (blogId) => {
  const response = await fetch(`${API_URL}/comments/${blogId}`);
  return response.json();
};

export const addComment = async (blogId, content) => {
  return apiCall(`/comments/${blogId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
};

export const likeComment = async (commentId) => {
  return apiCall(`/comments/${commentId}/like`, {
    method: 'PUT'
  });
};

export const deleteComment = async (commentId) => {
  return apiCall(`/comments/${commentId}`, {
    method: 'DELETE'
  });
};

export default {
  registerUser,
  getCurrentUser,
  getMyProfile,
  getUserProfile,
  updateProfile,
  uploadAvatar,
  uploadCoverImage,
  uploadImage,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkUsername,
  searchUsers,
  searchBlogs,
  getSuggestedUsers,
  getAllBlogs,
  getMyBlogs,
  createBlog,
  subscribeUser,
  unsubscribeUser,
  getUserActivity,
  saveBlog,
  getMyStats,
  getBlogById,
  repostBlog,
  trackReadTime,
  likeBlog,
  deleteBlog,
  updateBlog,
  getComments,
  addComment,
  likeComment,
  deleteComment
};
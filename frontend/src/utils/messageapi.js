import { auth } from '../config/firebase';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Get all conversations
export const getConversations = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/messages/conversations`, { headers });
  return await res.json();
};

// Get or create conversation with a user
export const getOrCreateConversation = async (userId) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/messages/conversations/with/${userId}`, { headers });
  return await res.json();
};

// Get messages in a conversation
export const getMessages = async (conversationId, limit = 50, before = null) => {
  const headers = await getAuthHeaders();
  const url = new URL(`${API_URL}/messages/conversations/${conversationId}/messages`);
  url.searchParams.append('limit', limit);
  if (before) url.searchParams.append('before', before);
  
  const res = await fetch(url, { headers });
  return await res.json();
};

// Send a message
export const sendMessage = async (conversationId, text) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/messages/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ conversationId, text })
  });
  return await res.json();
};

// Mark conversation as read
export const markConversationAsRead = async (conversationId) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/messages/conversations/${conversationId}/read`, {
    method: 'PUT',
    headers
  });
  return await res.json();
};

// Delete a message
export const deleteMessage = async (messageId) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/messages/messages/${messageId}`, {
    method: 'DELETE',
    headers
  });
  return await res.json();
};

// Get unread count
export const getUnreadCount = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/messages/unread-count`, { headers });
  return await res.json();
};
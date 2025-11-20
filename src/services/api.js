/**
 * Real API Client for NoJob Backend
 * Replaces mockAPI.js with actual HTTP calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Helper function to get auth token
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Helper function to make authenticated requests
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  async register(userData) {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Save token and user
    if (response.success) {
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  async login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Save token and user
    if (response.success) {
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  async logout() {
    await apiRequest('/auth/logout', { method: 'POST' });
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  async getCurrentUser() {
    const response = await apiRequest('/auth/me');
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return response;
  },
};

// ============================================
// USERS API
// ============================================

export const usersAPI = {
  async getProfiles() {
    const response = await apiRequest('/users/profiles');
    return response.data;
  },

  async getUserById(userId) {
    const response = await apiRequest(`/users/${userId}`);
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  },

  async uploadPhoto(photoUrl) {
    const response = await apiRequest('/users/photos', {
      method: 'POST',
      body: JSON.stringify({ photoUrl }),
    });
    return response.data;
  },

  async deletePhoto(index) {
    const response = await apiRequest(`/users/photos/${index}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  async addEmergencyContact(contact) {
    const response = await apiRequest('/users/emergency-contact', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
    return response.data;
  },

  async deleteEmergencyContact(contactId) {
    await apiRequest(`/users/emergency-contact/${contactId}`, {
      method: 'DELETE',
    });
  },

  async deleteAccount() {
    await apiRequest('/users/account', { method: 'DELETE' });
    localStorage.clear();
  },
};

// ============================================
// MATCHING API
// ============================================

export const matchingAPI = {
  async likeUser(userId) {
    const response = await apiRequest(`/matching/like/${userId}`, {
      method: 'POST',
    });
    return response.data;
  },

  async passUser(userId) {
    const response = await apiRequest(`/matching/pass/${userId}`, {
      method: 'POST',
    });
    return response.data;
  },

  async getMatches() {
    const response = await apiRequest('/matching/matches');
    return response.data;
  },

  async unmatch(userId) {
    await apiRequest(`/matching/unmatch/${userId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// CHAT API
// ============================================

export const chatAPI = {
  async getConversations() {
    const response = await apiRequest('/chat/conversations');
    return response.data;
  },

  async getMessages(userId) {
    const response = await apiRequest(`/chat/${userId}/messages`);
    return response.data;
  },

  async sendMessage(userId, text) {
    const response = await apiRequest(`/chat/${userId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response.data;
  },

  async markAsRead(messageId) {
    await apiRequest(`/chat/messages/${messageId}/read`, {
      method: 'PUT',
    });
  },

  async deleteMessage(messageId) {
    await apiRequest(`/chat/messages/${messageId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// SAFETY API
// ============================================

export const safetyAPI = {
  async reportUser(reportData) {
    const response = await apiRequest('/safety/report', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
    return response.data;
  },

  async triggerPanic(location) {
    const response = await apiRequest('/safety/panic', {
      method: 'POST',
      body: JSON.stringify(location),
    });
    return response.data;
  },

  async blockUser(userId) {
    await apiRequest(`/safety/block/${userId}`, {
      method: 'POST',
    });
  },

  async unblockUser(userId) {
    await apiRequest(`/safety/block/${userId}`, {
      method: 'DELETE',
    });
  },

  async getBlockedUsers() {
    const response = await apiRequest('/safety/blocked');
    return response.data;
  },
};

// ============================================
// SUPPORT API
// ============================================

export const supportAPI = {
  async setupSupport(recipientId, amount) {
    const response = await apiRequest('/support/setup', {
      method: 'POST',
      body: JSON.stringify({ recipientId, amount }),
    });
    return response.data;
  },

  async getActiveSupport() {
    const response = await apiRequest('/support/active');
    return response.data;
  },

  async releaseFunds(supportId) {
    const response = await apiRequest(`/support/${supportId}/release`, {
      method: 'POST',
    });
    return response.data;
  },

  async cancelSupport(supportId) {
    await apiRequest(`/support/${supportId}/cancel`, {
      method: 'POST',
    });
  },

  async getSupportStatus(supportId) {
    const response = await apiRequest(`/support/${supportId}/status`);
    return response.data;
  },

  async getSupportHistory() {
    const response = await apiRequest('/support/history');
    return response.data;
  },
};

// Export all APIs
export default {
  auth: authAPI,
  users: usersAPI,
  matching: matchingAPI,
  chat: chatAPI,
  safety: safetyAPI,
  support: supportAPI,
};


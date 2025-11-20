// Mock API Service
// This service simulates all backend API calls with mock data
// It will be replaced with real API calls when the backend is ready

import {
  mockUsers,
  mockMatches,
  mockMessages,
  mockLikes,
  mockReports,
  mockSupports,
  mockMeetings,
  mockEmergencyContacts
} from './mockData';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  async login(email, password) {
    await delay();
    const allUsers = [...mockUsers.women, ...mockUsers.men];
    const user = allUsers.find(u => u.email === email);
    
    if (user) {
      return {
        success: true,
        user,
        token: 'mock-jwt-token-' + user.id
      };
    }
    
    return { success: false, error: 'Usuário não encontrado' };
  },

  async register(userData) {
    await delay();
    const newUser = {
      id: 'user-' + Date.now(),
      ...userData,
      verified: {
        document: false,
        selfie: false,
        video: false
      }
    };
    
    if (userData.userType === 'woman') {
      mockUsers.women.push(newUser);
    } else {
      mockUsers.men.push(newUser);
    }
    
    return {
      success: true,
      user: newUser,
      token: 'mock-jwt-token-' + newUser.id
    };
  },

  async logout() {
    await delay(200);
    return { success: true };
  }
};

// ============================================
// USER API
// ============================================

export const userAPI = {
  async getProfile(userId) {
    await delay();
    const allUsers = [...mockUsers.women, ...mockUsers.men];
    const user = allUsers.find(u => u.id === userId);
    return { success: true, user };
  },

  async updateProfile(userId, updates) {
    await delay();
    const allUsers = [...mockUsers.women, ...mockUsers.men];
    const userIndex = allUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      allUsers[userIndex] = { ...allUsers[userIndex], ...updates };
      return { success: true, user: allUsers[userIndex] };
    }
    
    return { success: false, error: 'Usuário não encontrado' };
  },

  async getProfiles(userType, filters = {}) {
    await delay();
    const profiles = userType === 'woman' ? mockUsers.men : mockUsers.women;
    return { success: true, profiles };
  }
};

// ============================================
// MATCHING API
// ============================================

export const matchingAPI = {
  async like(userId, likedUserId) {
    await delay();
    const newLike = {
      id: 'like-' + Date.now(),
      userId,
      likedUserId,
      likedAt: new Date()
    };
    mockLikes.push(newLike);
    
    // Check if it's a match
    const reciprocalLike = mockLikes.find(
      l => l.userId === likedUserId && l.likedUserId === userId
    );
    
    if (reciprocalLike) {
      const newMatch = {
        id: 'match-' + Date.now(),
        userId,
        matchedUserId: likedUserId,
        matchedAt: new Date(),
        hasSupport: false,
        supportStatus: null
      };
      mockMatches.push(newMatch);
      return { success: true, match: true, matchData: newMatch };
    }
    
    return { success: true, match: false };
  },

  async getMatches(userId) {
    await delay();
    const matches = mockMatches.filter(
      m => m.userId === userId || m.matchedUserId === userId
    );
    return { success: true, matches };
  },

  async getLikes(userId) {
    await delay();
    const likes = mockLikes.filter(l => l.likedUserId === userId);
    return { success: true, likes };
  }
};

// ============================================
// CHAT API
// ============================================

export const chatAPI = {
  async getMessages(matchId) {
    await delay();
    const messages = mockMessages[matchId] || [];
    return { success: true, messages };
  },

  async sendMessage(matchId, senderId, text) {
    await delay();

    if (!mockMessages[matchId]) {
      mockMessages[matchId] = [];
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      senderId,
      text,
      timestamp: new Date(),
      flagged: false
    };

    mockMessages[matchId].push(newMessage);
    return { success: true, message: newMessage };
  }
};

// ============================================
// VERIFICATION API (KYC)
// ============================================

export const verificationAPI = {
  async uploadDocument(userId, documentFile) {
    await delay(1000);
    return {
      success: true,
      documentUrl: 'mock-document-url-' + userId,
      verified: true
    };
  },

  async uploadSelfie(userId, selfieFile) {
    await delay(1000);
    return {
      success: true,
      selfieUrl: 'mock-selfie-url-' + userId,
      verified: true
    };
  },

  async uploadVideo(userId, videoFile) {
    await delay(2000);
    return {
      success: true,
      videoUrl: 'mock-video-url-' + userId,
      verified: true
    };
  },

  async getVerificationStatus(userId) {
    await delay();
    const allUsers = [...mockUsers.women, ...mockUsers.men];
    const user = allUsers.find(u => u.id === userId);
    return {
      success: true,
      verified: user?.verified || { document: false, selfie: false, video: false }
    };
  }
};

// ============================================
// SUPPORT/PAYMENT API
// ============================================

export const supportAPI = {
  async createSupport(fromUserId, toUserId, amount) {
    await delay();
    const newSupport = {
      id: 'support-' + Date.now(),
      fromUserId,
      toUserId,
      amount,
      status: 'in_custody',
      createdAt: new Date(),
      releaseAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
      hoursRemaining: 48
    };
    mockSupports.push(newSupport);
    return { success: true, support: newSupport };
  },

  async getSupports(userId) {
    await delay();
    const supports = mockSupports.filter(
      s => s.fromUserId === userId || s.toUserId === userId
    );
    return { success: true, supports };
  },

  async freezeSupport(supportId, reason) {
    await delay();
    const support = mockSupports.find(s => s.id === supportId);
    if (support) {
      support.status = 'frozen';
      support.freezeReason = reason;
      return { success: true, support };
    }
    return { success: false, error: 'Apoio não encontrado' };
  },

  async releaseSupport(supportId) {
    await delay();
    const support = mockSupports.find(s => s.id === supportId);
    if (support) {
      support.status = 'released';
      support.releasedAt = new Date();
      return { success: true, support };
    }
    return { success: false, error: 'Apoio não encontrado' };
  }
};

// ============================================
// REPORT/SAFETY API
// ============================================

export const safetyAPI = {
  async createReport(reportData) {
    await delay();
    const newReport = {
      id: 'report-' + Date.now(),
      ...reportData,
      createdAt: new Date(),
      status: 'pending'
    };
    mockReports.push(newReport);

    // Auto-freeze support if exists
    const support = mockSupports.find(
      s => (s.fromUserId === reportData.reportedUserId || s.toUserId === reportData.reportedUserId) &&
           s.status === 'in_custody'
    );

    if (support) {
      support.status = 'frozen';
      support.freezeReason = 'Denúncia recebida';
    }

    return { success: true, report: newReport };
  },

  async getReports(userId) {
    await delay();
    const reports = mockReports.filter(r => r.reporterId === userId);
    return { success: true, reports };
  },

  async panicButton(userId, location) {
    await delay(100);
    // Simulate emergency alert
    console.log('🚨 PANIC BUTTON ACTIVATED', { userId, location, timestamp: new Date() });
    return {
      success: true,
      emergencyId: 'emergency-' + Date.now(),
      message: 'Autoridades notificadas. Ajuda está a caminho.'
    };
  },

  async addEmergencyContact(userId, contactData) {
    await delay();
    const newContact = {
      id: 'contact-' + Date.now(),
      userId,
      ...contactData
    };
    mockEmergencyContacts.push(newContact);
    return { success: true, contact: newContact };
  },

  async getEmergencyContacts(userId) {
    await delay();
    const contacts = mockEmergencyContacts.filter(c => c.userId === userId);
    return { success: true, contacts };
  }
};

// ============================================
// MEETING API
// ============================================

export const meetingAPI = {
  async scheduleMeeting(meetingData) {
    await delay();
    const newMeeting = {
      id: 'meeting-' + Date.now(),
      ...meetingData,
      status: 'scheduled',
      createdAt: new Date()
    };
    mockMeetings.push(newMeeting);
    return { success: true, meeting: newMeeting };
  },

  async checkIn(meetingId, userId, location) {
    await delay();
    const meeting = mockMeetings.find(m => m.id === meetingId);
    if (meeting) {
      meeting.checkIn = {
        userId,
        location,
        timestamp: new Date()
      };
      meeting.status = 'in_progress';
      return { success: true, meeting };
    }
    return { success: false, error: 'Encontro não encontrado' };
  },

  async confirmSafety(meetingId, userId) {
    await delay();
    const meeting = mockMeetings.find(m => m.id === meetingId);
    if (meeting) {
      meeting.safetyConfirmed = {
        userId,
        timestamp: new Date()
      };
      return { success: true, meeting };
    }
    return { success: false, error: 'Encontro não encontrado' };
  },

  async getMeetings(userId) {
    await delay();
    const meetings = mockMeetings.filter(
      m => m.userId === userId || m.withUserId === userId
    );
    return { success: true, meetings };
  }
};

// ============================================
// AI MODERATION API
// ============================================

export const moderationAPI = {
  async analyzeMessage(text) {
    await delay(300);

    // Simple pattern detection
    const sexualKeywords = ['sexo', 'transar', 'cama', 'nude', 'nua'];
    const manipulationKeywords = ['se não', 'tem que', 'obrigada a', 'senão'];

    const lowerText = text.toLowerCase();
    const hasSexualContent = sexualKeywords.some(word => lowerText.includes(word));
    const hasManipulation = manipulationKeywords.some(word => lowerText.includes(word));

    return {
      success: true,
      flagged: hasSexualContent || hasManipulation,
      reasons: [
        ...(hasSexualContent ? ['Conteúdo sexual detectado'] : []),
        ...(hasManipulation ? ['Padrão de manipulação detectado'] : [])
      ],
      severity: hasSexualContent ? 'high' : hasManipulation ? 'medium' : 'low'
    };
  },

  async getFlaggedMessages(userId) {
    await delay();
    const allMessages = Object.values(mockMessages).flat();
    const flagged = allMessages.filter(m => m.flagged);
    return { success: true, messages: flagged };
  }
};

// ============================================
// GOALS/RESTART PLAN API
// ============================================

export const goalsAPI = {
  async createGoal(userId, goalData) {
    await delay();
    const allUsers = [...mockUsers.women, ...mockUsers.men];
    const user = allUsers.find(u => u.id === userId);

    if (user) {
      user.goals = {
        ...goalData,
        progress: 0,
        createdAt: new Date()
      };
      return { success: true, goal: user.goals };
    }

    return { success: false, error: 'Usuário não encontrado' };
  },

  async updateGoalProgress(userId, progress) {
    await delay();
    const allUsers = [...mockUsers.women, ...mockUsers.men];
    const user = allUsers.find(u => u.id === userId);

    if (user && user.goals) {
      user.goals.progress = progress;
      return { success: true, goal: user.goals };
    }

    return { success: false, error: 'Meta não encontrada' };
  },

  async getGoal(userId) {
    await delay();
    const allUsers = [...mockUsers.women, ...mockUsers.men];
    const user = allUsers.find(u => u.id === userId);
    return { success: true, goal: user?.goals || null };
  }
};

// Export all APIs as a single object
export default {
  auth: authAPI,
  user: userAPI,
  matching: matchingAPI,
  chat: chatAPI,
  verification: verificationAPI,
  support: supportAPI,
  safety: safetyAPI,
  meeting: meetingAPI,
  moderation: moderationAPI,
  goals: goalsAPI
};


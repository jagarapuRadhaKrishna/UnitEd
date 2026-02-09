/**
 * API Configuration
 * Central configuration for all API calls
 */

// Backend API base URL
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
export const API_VERSION = 'v1';
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    registerStudent: `${API_URL}/auth/register/student`,
    registerFaculty: `${API_URL}/auth/register/faculty`,
    login: `${API_URL}/auth/login`,
    logout: `${API_URL}/auth/logout`,
    refreshToken: `${API_URL}/auth/refresh`,
    forgotPassword: `${API_URL}/auth/forgot-password`,
    resetPassword: `${API_URL}/auth/reset-password`,
    checkEmailAvailability: `${API_URL}/auth/check-email`,
    checkRollNumberAvailability: `${API_URL}/auth/check-roll-number`,
  },
  
  // User/Profile
  user: {
    profile: `${API_URL}/users/profile`,
    updateProfile: `${API_URL}/users/profile`,
    updatePassword: `${API_URL}/users/password`,
    uploadProfilePicture: `${API_URL}/users/profile-picture`,
    uploadResume: `${API_URL}/users/resume`,
    getById: (id: string) => `${API_URL}/users/${id}`,
    search: `${API_URL}/users/search`,
    skills: `${API_URL}/users/skills`,
    removeSkill: (skillId: string) => `${API_URL}/users/skills/${skillId}`,
    projects: `${API_URL}/users/projects`,
    updateProject: (projectId: string) => `${API_URL}/users/projects/${projectId}`,
    deleteProject: (projectId: string) => `${API_URL}/users/projects/${projectId}`,
    achievements: `${API_URL}/users/achievements`,
    updateAchievement: (achievementId: string) => `${API_URL}/users/achievements/${achievementId}`,
    deleteAchievement: (achievementId: string) => `${API_URL}/users/achievements/${achievementId}`,
    deactivate: `${API_URL}/users/deactivate`,
  },
  
  // Posts/Opportunities
  posts: {
    create: `${API_URL}/posts`,
    getAll: `${API_URL}/posts`,
    getById: (id: string) => `${API_URL}/posts/${id}`,
    update: (id: string) => `${API_URL}/posts/${id}`,
    delete: (id: string) => `${API_URL}/posts/${id}`,
    close: (id: string) => `${API_URL}/posts/${id}/close`,
    getRecommended: `${API_URL}/posts/recommended`,
  },
  
  // Applications
  applications: {
    submit: `${API_URL}/applications`,
    getReceived: `${API_URL}/applications/received`,
    getSent: `${API_URL}/applications/sent`,
    accept: (id: string) => `${API_URL}/applications/${id}/accept`,
    reject: (id: string) => `${API_URL}/applications/${id}/reject`,
    withdraw: (id: string) => `${API_URL}/applications/${id}/withdraw`,
    getById: (id: string) => `${API_URL}/applications/${id}`,
  },
  
  // Invitations
  invitations: {
    getRecommendedCandidates: (postId: string) => `${API_URL}/invitations/posts/${postId}/recommended-candidates`,
    send: `${API_URL}/invitations`,
    getSent: `${API_URL}/invitations/sent`,
    getReceived: `${API_URL}/invitations/received`,
    accept: (id: string) => `${API_URL}/invitations/${id}/accept`,
    decline: (id: string) => `${API_URL}/invitations/${id}/decline`,
    getById: (id: string) => `${API_URL}/invitations/${id}`,
  },
  
  // Chatrooms
  chatrooms: {
    getUserChatrooms: `${API_URL}/chatrooms`,
    getById: (id: string) => `${API_URL}/chatrooms/${id}`,
    create: `${API_URL}/chatrooms`,
    getMessages: (id: string) => `${API_URL}/chatrooms/${id}/messages`,
    sendMessage: (id: string) => `${API_URL}/chatrooms/${id}/messages`,
    addMember: (id: string) => `${API_URL}/chatrooms/${id}/members`,
    leave: (id: string) => `${API_URL}/chatrooms/${id}/leave`,
  },
  
  // Notifications
  notifications: {
    getAll: `${API_URL}/notifications`,
    markAsRead: (id: string) => `${API_URL}/notifications/${id}/read`,
    markAllAsRead: `${API_URL}/notifications/read-all`,
    clearAll: `${API_URL}/notifications/clear`,
  },
  
  // Dashboard
  dashboard: {
    getStats: `${API_URL}/dashboard`,
    getActivityTimeline: `${API_URL}/dashboard/activity`,
  },
};

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Helper function to get auth headers
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// HTTP Methods helper
export const apiClient = {
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  async post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  async put<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  async patch<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
};

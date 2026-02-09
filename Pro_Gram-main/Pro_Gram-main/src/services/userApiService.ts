/**
 * User/Profile API Service
 */

import { API_ENDPOINTS, apiClient } from '../config/api';

export interface UpdateProfileData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  contactNo?: string;
  bio?: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
  leetcode?: string;
  location?: string;
  cgpa?: number;
  experience?: string;
  // Faculty specific
  designation?: string;
  officeLocation?: string;
  researchInterests?: string[];
  publications?: string[];
  patents?: string[];
  awards?: string[];
}

export const userService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<{ success: boolean; data: any }> {
    return apiClient.get(API_ENDPOINTS.user.profile);
  },

  /**
   * Update profile
   */
  async updateProfile(data: UpdateProfileData): Promise<{ success: boolean; data: any }> {
    return apiClient.put(API_ENDPOINTS.user.updateProfile, data);
  },

  /**
   * Update password
   */
  async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return apiClient.put(API_ENDPOINTS.user.updatePassword, {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file: File): Promise<{ success: boolean; data: { profilePicture: string } }> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await fetch(API_ENDPOINTS.user.uploadProfilePicture, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload profile picture');
    }
    
    return response.json();
  },

  /**
   * Upload resume
   */
  async uploadResume(file: File): Promise<{ success: boolean; data: { resumeUrl: string } }> {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await fetch(API_ENDPOINTS.user.uploadResume, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload resume');
    }
    
    return response.json();
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<{ success: boolean; data: any }> {
    return apiClient.get(API_ENDPOINTS.user.getById(id));
  },

  /**
   * Search users
   */
  async searchUsers(params: {
    query?: string;
    role?: string;
    skills?: string[];
    department?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: { users: any[]; total: number } }> {
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.append('query', params.query);
    if (params.role) queryParams.append('role', params.role);
    if (params.skills) queryParams.append('skills', params.skills.join(','));
    if (params.department) queryParams.append('department', params.department);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    return apiClient.get(`${API_ENDPOINTS.user.search}?${queryParams.toString()}`);
  },

  /**
   * Add skills
   */
  async addSkills(skills: string[]): Promise<{ success: boolean; data: any }> {
    return apiClient.post(API_ENDPOINTS.user.skills, { skills });
  },

  /**
   * Remove skill
   */
  async removeSkill(skillId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(API_ENDPOINTS.user.removeSkill(skillId));
  },

  /**
   * Add project
   */
  async addProject(project: {
    title: string;
    description: string;
    link?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ success: boolean; data: any }> {
    return apiClient.post(API_ENDPOINTS.user.projects, project);
  },

  /**
   * Update project
   */
  async updateProject(projectId: string, data: any): Promise<{ success: boolean; data: any }> {
    return apiClient.put(API_ENDPOINTS.user.updateProject(projectId), data);
  },

  /**
   * Delete project
   */
  async deleteProject(projectId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(API_ENDPOINTS.user.deleteProject(projectId));
  },

  /**
   * Add achievement
   */
  async addAchievement(achievement: {
    title: string;
    description?: string;
    date?: string;
  }): Promise<{ success: boolean; data: any }> {
    return apiClient.post(API_ENDPOINTS.user.achievements, achievement);
  },

  /**
   * Update achievement
   */
  async updateAchievement(achievementId: string, data: any): Promise<{ success: boolean; data: any }> {
    return apiClient.put(API_ENDPOINTS.user.updateAchievement(achievementId), data);
  },

  /**
   * Delete achievement
   */
  async deleteAchievement(achievementId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(API_ENDPOINTS.user.deleteAchievement(achievementId));
  },
};

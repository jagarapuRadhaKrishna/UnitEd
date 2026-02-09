/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { API_ENDPOINTS, apiClient, setAuthToken, removeAuthToken } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterStudentData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  contactNo: string;
  gender: string;
  rollNumber: string;
  department: string;
  yearOfGraduation: number;
  skills: string[];
  projects?: Array<{
    title: string;
    description: string;
    link?: string;
    startDate?: string;
    endDate?: string;
  }>;
  achievements?: Array<{
    title: string;
    description?: string;
    date?: string;
  }>;
  experience?: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
  leetcode?: string;
  cgpa?: number;
  bio?: string;
  location?: string;
}

export interface RegisterFacultyData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  contactNo: string;
  gender: string;
  employeeId: string;
  designation: string;
  dateOfJoining: string;
  totalExperience: number;
  industryExperience: number;
  teachingExperience: number;
  qualification: string;
  specialization: string[];
  skills: string[];
  publications?: string[];
  patents?: string[];
  awards?: string[];
  bio?: string;
  officeLocation?: string;
  researchInterests?: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  /**
   * Student registration
   */
  async registerStudent(data: RegisterStudentData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.registerStudent,
      data
    );
    
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Faculty registration
   */
  async registerFaculty(data: RegisterFacultyData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.registerFaculty,
      data
    );
    
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );
    
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } finally {
      removeAuthToken();
      localStorage.removeItem('user');
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.refreshToken,
      { refreshToken }
    );
    
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken);
    }
    
    return response;
  },

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post(API_ENDPOINTS.auth.forgotPassword, { email });
  },

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post(API_ENDPOINTS.auth.resetPassword, { token, newPassword });
  },

  /**
   * Check email availability
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    return apiClient.get(`${API_ENDPOINTS.auth.checkEmailAvailability}?email=${email}`);
  },

  /**
   * Check roll number availability
   */
  async checkRollNumberAvailability(rollNumber: string): Promise<{ available: boolean }> {
    return apiClient.get(`${API_ENDPOINTS.auth.checkRollNumberAvailability}?rollNumber=${rollNumber}`);
  },
};

/**
 * Local Storage Authentication Service
 * Handles user registration, login, and data persistence using browser's localStorage
 * Data is encrypted/obfuscated to prevent easy inspection
 */

import type { User } from '../types';
import { secureStorage } from './secureStorageService';

// Storage keys (these will be encrypted in localStorage)
const STORAGE_KEYS = {
  USERS: 'united_users_db',
  CURRENT_USER: 'united_current_user',
  SESSION_TOKEN: 'united_session_token',
} as const;

// User credentials stored in localStorage
interface StoredUser {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  role: 'student' | 'faculty';
  profile: User;
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  // Common fields
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  contactNo: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  role: 'student' | 'faculty';
  skills: string[];
  profilePictureUrl?: string;
  
  // Student specific
  rollNumber?: string;
  department?: string;
  yearOfGraduation?: number;
  experience?: number;
  portfolio?: string;
  projects?: Array<{ title: string; description: string; link?: string }>;
  achievements?: string[];
  resumeUrl?: string;
  
  // Faculty specific
  employeeId?: string;
  designation?: string;
  dateOfJoining?: string;
  qualification?: string;
  specialization?: string;
  totalExperience?: number;
  teachingExperience?: number;
  industryExperience?: number;
  researchProjects?: Array<{ title: string; description: string; doi?: string }>;
  cvUrl?: string;
}

class LocalStorageAuthService {
  /**
   * Initialize the users database if it doesn't exist
   */
  private initializeDatabase(): void {
    if (!secureStorage.hasItem(STORAGE_KEYS.USERS)) {
      secureStorage.setItem(STORAGE_KEYS.USERS, []);
    }
  }

  /**
   * Get all users from localStorage
   */
  private getAllUsers(): StoredUser[] {
    this.initializeDatabase();
    const users = secureStorage.getItem<StoredUser[]>(STORAGE_KEYS.USERS);
    return users || [];
  }

  /**
   * Save users to localStorage
   */
  private saveUsers(users: StoredUser[]): void {
    secureStorage.setItem(STORAGE_KEYS.USERS, users);
  }

  /**
   * Generate a unique user ID
   */
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a session token
   */
  private generateSessionToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  /**
   * Hash password (simple implementation - in production use bcrypt or similar)
   */
  private hashPassword(password: string): string {
    // Simple hash for demo purposes
    // In production, use a proper hashing library like bcrypt
    return btoa(password);
  }

  /**
   * Verify password
   */
  private verifyPassword(inputPassword: string, storedPassword: string): boolean {
    return this.hashPassword(inputPassword) === storedPassword;
  }

  /**
   * Register a new user
   */
  async registerUser(data: RegisterData): Promise<{ user: User; token: string }> {
    this.initializeDatabase();
    const users = this.getAllUsers();

    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Check if roll number exists (for students)
    if (data.role === 'student' && data.rollNumber) {
      const existingRollNumber = users.find(
        u => u.role === 'student' && (u.profile as any).rollNumber === data.rollNumber
      );
      if (existingRollNumber) {
        throw new Error('Roll number already registered');
      }
    }

    // Check if employee ID exists (for faculty)
    if (data.role === 'faculty' && data.employeeId) {
      const existingEmployeeId = users.find(
        u => u.role === 'faculty' && (u.profile as any).employeeId === data.employeeId
      );
      if (existingEmployeeId) {
        throw new Error('Employee ID already registered');
      }
    }

    // Create user profile
    const userId = this.generateUserId();
    const now = new Date().toISOString();

    let userProfile: User;

    if (data.role === 'student') {
      userProfile = {
        id: userId,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        role: 'student',
        contactNo: data.contactNo,
        gender: data.gender,
        skills: data.skills,
        profilePicture: data.profilePictureUrl || `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=random`,
        bio: '',
        location: '',
        linkedin: '',
        github: '',
        rollNumber: data.rollNumber!,
        department: data.department!,
        yearOfGraduation: data.yearOfGraduation!,
        cgpa: '0',
        experience: data.experience?.toString(),
        portfolio: data.portfolio,
        projects: data.projects?.map((p, idx) => ({
          id: `proj_${idx}`,
          title: p.title,
          description: p.description,
          link: p.link,
        })) || [],
        achievements: data.achievements?.map((a, idx) => ({
          id: `ach_${idx}`,
          title: a,
        })) || [],
        resumeUrl: data.resumeUrl,
        leetcode: '',
        createdAt: now,
        updatedAt: now,
      };
    } else {
      userProfile = {
        id: userId,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        role: 'faculty',
        contactNo: data.contactNo,
        gender: data.gender,
        skills: data.skills,
        profilePicture: data.profilePictureUrl || `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=random`,
        bio: '',
        location: '',
        linkedin: '',
        github: '',
        employeeId: data.employeeId!,
        designation: data.designation!,
        dateOfJoining: data.dateOfJoining || now,
        qualification: data.qualification || '',
        specialization: data.specialization ? [data.specialization] : [],
        totalExperience: data.totalExperience || 0,
        teachingExperience: data.teachingExperience || 0,
        industryExperience: data.industryExperience || 0,
        projects: data.researchProjects?.map((p, idx) => ({
          id: `proj_${idx}`,
          title: p.title,
          description: p.description,
          link: p.doi,
        })) || [],
        achievements: [],
        portfolio: '',
        createdAt: now,
        updatedAt: now,
      };
    }

    // Create stored user with hashed password
    const storedUser: StoredUser = {
      id: userId,
      email: data.email,
      password: this.hashPassword(data.password),
      role: data.role,
      profile: userProfile,
      createdAt: now,
      updatedAt: now,
    };

    // Save to users database
    users.push(storedUser);
    this.saveUsers(users);

    // Generate session token
    const token = this.generateSessionToken();

    // Set current user and token (encrypted)
    secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, userProfile);
    secureStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);

    return { user: userProfile, token };
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    this.initializeDatabase();
    const users = this.getAllUsers();

    // Find user by email
    const storedUser = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (!storedUser) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    if (!this.verifyPassword(credentials.password, storedUser.password)) {
      throw new Error('Invalid email or password');
    }

    // Generate new session token
    const token = this.generateSessionToken();

    // Update last login time
    storedUser.updatedAt = new Date().toISOString();
    this.saveUsers(users);

    // Set current user and token (encrypted)
    secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, storedUser.profile);
    secureStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);

    return { user: storedUser.profile, token };
  }

  /**
   * Logout user
   */
  logout(): void {
    secureStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    secureStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  }

  /**
   * Get current user from session
   */
  getCurrentUser(): User | null {
    const user = secureStorage.getItem<User>(STORAGE_KEYS.CURRENT_USER);
    const token = secureStorage.getItem<string>(STORAGE_KEYS.SESSION_TOKEN);
    
    if (!user || !token) {
      return null;
    }

    return user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update profile
    const updatedProfile = {
      ...users[userIndex].profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    } as User;

    users[userIndex].profile = updatedProfile;
    users[userIndex].updatedAt = new Date().toISOString();
    
    this.saveUsers(users);

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, updatedProfile);
    }

    return updatedProfile;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Verify old password
    if (!this.verifyPassword(oldPassword, users[userIndex].password)) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    users[userIndex].password = this.hashPassword(newPassword);
    users[userIndex].updatedAt = new Date().toISOString();
    
    this.saveUsers(users);
  }

  /**
   * Check if email is available
   */
  isEmailAvailable(email: string): boolean {
    const users = this.getAllUsers();
    return !users.some(u => u.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Check if roll number is available
   */
  isRollNumberAvailable(rollNumber: string): boolean {
    const users = this.getAllUsers();
    return !users.some(u => u.role === 'student' && (u.profile as any).rollNumber === rollNumber);
  }

  /**
   * Check if employee ID is available
   */
  isEmployeeIdAvailable(employeeId: string): boolean {
    const users = this.getAllUsers();
    return !users.some(u => u.role === 'faculty' && (u.profile as any).employeeId === employeeId);
  }

  /**
   * Get all registered users (for admin purposes)
   */
  getAllRegisteredUsers(): Array<{ id: string; email: string; role: string; name: string }> {
    const users = this.getAllUsers();
    return users.map(u => ({
      id: u.id,
      email: u.email,
      role: u.role,
      name: `${u.profile.firstName} ${u.profile.lastName}`,
    }));
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string, password: string): Promise<void> {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Verify password
    if (!this.verifyPassword(password, users[userIndex].password)) {
      throw new Error('Password is incorrect');
    }

    // Remove user
    users.splice(userIndex, 1);
    this.saveUsers(users);

    // Logout if it's the current user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.logout();
    }
  }

  /**
   * Reset password (for demo - in production this would use email verification)
   */
  async resetPassword(email: string, newPassword: string): Promise<void> {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      throw new Error('Email not found');
    }

    users[userIndex].password = this.hashPassword(newPassword);
    users[userIndex].updatedAt = new Date().toISOString();
    
    this.saveUsers(users);
  }

  /**
   * Clear all data (for testing purposes)
   */
  clearAllData(): void {
    secureStorage.removeItem(STORAGE_KEYS.USERS);
    secureStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    secureStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  }
}

// Export singleton instance
export const localStorageAuthService = new LocalStorageAuthService();

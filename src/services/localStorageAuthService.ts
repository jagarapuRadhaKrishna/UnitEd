import type { User } from '../types/united';
import { secureStorage } from './secureStorageService';

const STORAGE_KEYS = {
  USERS: 'united_users_db',
  CURRENT_USER: 'united_current_user',
  SESSION_TOKEN: 'united_session_token',
} as const;

interface StoredUser {
  id: string;
  email: string;
  password: string;
  role: 'student' | 'faculty';
  profile: User;
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
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
  rollNumber?: string;
  department?: string;
  yearOfGraduation?: number;
  experience?: number;
  portfolio?: string;
  projects?: Array<{ title: string; description: string; link?: string }>;
  achievements?: string[];
  resumeUrl?: string;
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
  private initializeDatabase(): void {
    if (!secureStorage.hasItem(STORAGE_KEYS.USERS)) {
      secureStorage.setItem(STORAGE_KEYS.USERS, []);
    }
  }

  private getAllUsers(): StoredUser[] {
    this.initializeDatabase();
    return secureStorage.getItem<StoredUser[]>(STORAGE_KEYS.USERS) || [];
  }

  private saveUsers(users: StoredUser[]): void {
    secureStorage.setItem(STORAGE_KEYS.USERS, users);
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  private hashPassword(password: string): string {
    return btoa(password);
  }

  private verifyPassword(inputPassword: string, storedPassword: string): boolean {
    return this.hashPassword(inputPassword) === storedPassword;
  }

  async registerUser(data: RegisterData): Promise<{ user: User; token: string }> {
    this.initializeDatabase();
    const users = this.getAllUsers();

    const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existingUser) throw new Error('Email already registered');

    if (data.role === 'student' && data.rollNumber) {
      const exists = users.find(u => u.role === 'student' && (u.profile as any).rollNumber === data.rollNumber);
      if (exists) throw new Error('Roll number already registered');
    }

    if (data.role === 'faculty' && data.employeeId) {
      const exists = users.find(u => u.role === 'faculty' && (u.profile as any).employeeId === data.employeeId);
      if (exists) throw new Error('Employee ID already registered');
    }

    const userId = this.generateUserId();
    const now = new Date().toISOString();

    let userProfile: User;

    if (data.role === 'student') {
      userProfile = {
        id: userId, firstName: data.firstName, middleName: data.middleName, lastName: data.lastName,
        email: data.email, role: 'student', contactNo: data.contactNo, gender: data.gender,
        skills: data.skills,
        profilePicture: data.profilePictureUrl || `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=random`,
        bio: '', location: '', linkedin: '', github: '',
        rollNumber: data.rollNumber!, department: data.department!, yearOfGraduation: data.yearOfGraduation!,
        cgpa: '0', experience: data.experience?.toString(), portfolio: data.portfolio,
        projects: data.projects?.map((p, idx) => ({ id: `proj_${idx}`, title: p.title, description: p.description, link: p.link })) || [],
        achievements: data.achievements?.map((a, idx) => ({ id: `ach_${idx}`, title: a })) || [],
        resumeUrl: data.resumeUrl, leetcode: '', createdAt: now, updatedAt: now,
      };
    } else {
      userProfile = {
        id: userId, firstName: data.firstName, middleName: data.middleName, lastName: data.lastName,
        email: data.email, role: 'faculty', contactNo: data.contactNo, gender: data.gender,
        skills: data.skills,
        profilePicture: data.profilePictureUrl || `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=random`,
        bio: '', location: '', linkedin: '', github: '',
        employeeId: data.employeeId!, designation: data.designation!,
        dateOfJoining: data.dateOfJoining || now, qualification: data.qualification || '',
        specialization: data.specialization ? [data.specialization] : [],
        totalExperience: data.totalExperience || 0, teachingExperience: data.teachingExperience || 0,
        industryExperience: data.industryExperience || 0,
        projects: data.researchProjects?.map((p, idx) => ({ id: `proj_${idx}`, title: p.title, description: p.description, link: p.doi })) || [],
        achievements: [], portfolio: '', createdAt: now, updatedAt: now,
      };
    }

    const storedUser: StoredUser = {
      id: userId, email: data.email, password: this.hashPassword(data.password),
      role: data.role, profile: userProfile, createdAt: now, updatedAt: now,
    };

    users.push(storedUser);
    this.saveUsers(users);

    const token = this.generateSessionToken();
    secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, userProfile);
    secureStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);

    return { user: userProfile, token };
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    this.initializeDatabase();
    const users = this.getAllUsers();
    const storedUser = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());

    if (!storedUser) throw new Error('Invalid email or password');
    if (!this.verifyPassword(credentials.password, storedUser.password)) throw new Error('Invalid email or password');

    const token = this.generateSessionToken();
    storedUser.updatedAt = new Date().toISOString();
    this.saveUsers(users);

    secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, storedUser.profile);
    secureStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);

    return { user: storedUser.profile, token };
  }

  logout(): void {
    secureStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    secureStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  }

  getCurrentUser(): User | null {
    const user = secureStorage.getItem<User>(STORAGE_KEYS.CURRENT_USER);
    const token = secureStorage.getItem<string>(STORAGE_KEYS.SESSION_TOKEN);
    if (!user || !token) return null;
    return user;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    const updatedProfile = { ...users[userIndex].profile, ...updates, updatedAt: new Date().toISOString() } as User;
    users[userIndex].profile = updatedProfile;
    users[userIndex].updatedAt = new Date().toISOString();
    this.saveUsers(users);

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, updatedProfile);
    }
    return updatedProfile;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    if (!this.verifyPassword(oldPassword, users[userIndex].password)) throw new Error('Current password is incorrect');

    users[userIndex].password = this.hashPassword(newPassword);
    users[userIndex].updatedAt = new Date().toISOString();
    this.saveUsers(users);
  }

  isEmailAvailable(email: string): boolean {
    const users = this.getAllUsers();
    return !users.some(u => u.email.toLowerCase() === email.toLowerCase());
  }

  isRollNumberAvailable(rollNumber: string): boolean {
    const users = this.getAllUsers();
    return !users.some(u => u.role === 'student' && (u.profile as any).rollNumber === rollNumber);
  }

  isEmployeeIdAvailable(employeeId: string): boolean {
    const users = this.getAllUsers();
    return !users.some(u => u.role === 'faculty' && (u.profile as any).employeeId === employeeId);
  }

  getAllRegisteredUsers(): Array<{ id: string; email: string; role: string; name: string }> {
    const users = this.getAllUsers();
    return users.map(u => ({ id: u.id, email: u.email, role: u.role, name: `${u.profile.firstName} ${u.profile.lastName}` }));
  }

  async deleteAccount(userId: string, password: string): Promise<void> {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    if (!this.verifyPassword(password, users[userIndex].password)) throw new Error('Password is incorrect');

    users.splice(userIndex, 1);
    this.saveUsers(users);

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) this.logout();
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) throw new Error('Email not found');

    users[userIndex].password = this.hashPassword(newPassword);
    users[userIndex].updatedAt = new Date().toISOString();
    this.saveUsers(users);
  }

  clearAllData(): void {
    secureStorage.removeItem(STORAGE_KEYS.USERS);
    secureStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    secureStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  }
}

export const localStorageAuthService = new LocalStorageAuthService();

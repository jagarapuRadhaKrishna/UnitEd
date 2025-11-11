import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, StudentProfile, FacultyProfile } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegistrationData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  error: string | null;
}

interface RegistrationData {
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse user data');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Simulate API call to verify token
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Check if user exists in localStorage (simulating database)
      const registeredUsersKey = 'registeredUsers';
      const registeredUsersData = localStorage.getItem(registeredUsersKey);
      const registeredUsers = registeredUsersData ? JSON.parse(registeredUsersData) : [];
      
      // Find user by email
      const foundUser = registeredUsers.find((u: any) => u.email === email);
      
      if (!foundUser) {
        throw new Error('User not found. Please register first.');
      }
      
      // Check password (in real app, this would be hashed)
      if (foundUser.password !== password) {
        throw new Error('Invalid password.');
      }
      
      // Remove password before storing in session
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store auth data
      localStorage.setItem('authToken', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      setUser(userWithoutPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegistrationData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Check if user already exists
      const registeredUsersKey = 'registeredUsers';
      const registeredUsersData = localStorage.getItem(registeredUsersKey);
      const registeredUsers = registeredUsersData ? JSON.parse(registeredUsersData) : [];
      
      // Check for duplicate email
      const existingUser = registeredUsers.find((u: any) => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email already registered. Please login instead.');
      }
      
      // Create new user
      const newUser: any = {
        id: Math.random().toString(36).substr(2, 9),
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        contactNo: userData.contactNo,
        gender: userData.gender,
        skills: userData.skills,
        projects: userData.projects || [],
        achievements: userData.achievements || [],
        profilePictureUrl: userData.profilePictureUrl,
        role: userData.role,
        ...(userData.role === 'student' ? {
          rollNumber: userData.rollNumber!,
          department: userData.department!,
          yearOfGraduation: userData.yearOfGraduation!,
          experience: userData.experience || 0,
          portfolio: userData.portfolio,
          resumeUrl: userData.resumeUrl
        } : {
          employeeId: userData.employeeId!,
          designation: userData.designation!,
          dateOfJoining: userData.dateOfJoining!,
          qualification: userData.qualification!,
          specialization: userData.specialization!,
          totalExperience: userData.totalExperience || 0,
          industryExperience: userData.industryExperience || 0,
          teachingExperience: userData.teachingExperience || 0,
          researchProjects: userData.researchProjects || [],
          cvUrl: userData.cvUrl
        })
      };
      
      // Save to "database"
      registeredUsers.push(newUser);
      localStorage.setItem(registeredUsersKey, JSON.stringify(registeredUsers));
      
      // Remove password before storing in session
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Store auth data
      localStorage.setItem('authToken', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      setUser(userWithoutPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    setUser(null);
    
    // Redirect to login page
    window.location.href = '/login';
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates } as User;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      setError('Failed to update profile');
      throw new Error('Profile update failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authService, RegisterStudentData, RegisterFacultyData } from '../services/authApiService';
import { userService } from '../services/userApiService';
import { localStorageAuthService } from '../services/localStorageAuthService';

// Check if we should use local storage (when API is not available)
const USE_LOCAL_STORAGE = true; // Set to false to use API backend

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
    // Check for stored auth token and fetch fresh user data
    const checkAuth = async () => {
      if (USE_LOCAL_STORAGE) {
        // Use local storage
        const user = localStorageAuthService.getCurrentUser();
        if (user) {
          setUser(user);
        }
        setIsLoading(false);
      } else {
        // Use API backend
        const token = localStorage.getItem('accessToken');
        
        if (token) {
          try {
            // Fetch fresh user data from API
            const response = await userService.getProfile();
            setUser(response.data);
          } catch (err) {
            console.error('Failed to fetch user data:', err);
            // Token might be expired, clear it
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (USE_LOCAL_STORAGE) {
        // Use local storage
        const response = await localStorageAuthService.login({ email, password });
        setUser(response.user);
      } else {
        // Use API backend
        const response = await authService.login({ email, password });
        setUser(response.data.user);
      }
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
      if (USE_LOCAL_STORAGE) {
        // Use local storage
        const response = await localStorageAuthService.registerUser(userData);
        setUser(response.user);
      } else {
        // Use API backend
        let response;
        
        if (userData.role === 'student') {
          // Prepare student data
          const studentData: RegisterStudentData = {
            firstName: userData.firstName,
            middleName: userData.middleName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            contactNo: userData.contactNo,
            gender: userData.gender,
            rollNumber: userData.rollNumber!,
            department: userData.department!,
            yearOfGraduation: userData.yearOfGraduation!,
            skills: userData.skills,
            projects: userData.projects,
            achievements: userData.achievements?.map(title => ({ title })),
            experience: userData.experience?.toString(),
            portfolio: userData.portfolio,
            bio: '',
          };
          
          response = await authService.registerStudent(studentData);
        } else {
          // Prepare faculty data
          const facultyData: RegisterFacultyData = {
            firstName: userData.firstName,
            middleName: userData.middleName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            contactNo: userData.contactNo,
            gender: userData.gender,
            employeeId: userData.employeeId!,
            designation: userData.designation!,
            dateOfJoining: userData.dateOfJoining || new Date().toISOString(),
            totalExperience: userData.totalExperience || 0,
            industryExperience: userData.industryExperience || 0,
            teachingExperience: userData.teachingExperience || 0,
            qualification: userData.qualification || '',
            specialization: userData.specialization ? [userData.specialization] : [],
            skills: userData.skills,
            bio: '',
          };
          
          response = await authService.registerFaculty(facultyData);
        }
        
        setUser(response.data.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (USE_LOCAL_STORAGE) {
        localStorageAuthService.logout();
      } else {
        await authService.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      if (USE_LOCAL_STORAGE) {
        const updatedUser = await localStorageAuthService.updateProfile(user.id, updates);
        setUser(updatedUser);
      } else {
        const response = await userService.updateProfile(updates as any);
        setUser(response.data);
      }
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
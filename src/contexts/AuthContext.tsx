import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Profile shape matching the profiles table
export interface Profile {
  id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  email: string | null;
  role: 'student' | 'faculty';
  contact_no: string | null;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | null;
  skills: string[] | null;
  profile_picture_url: string | null;
  bio: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  leetcode: string | null;
  portfolio: string | null;
  roll_number: string | null;
  department: string | null;
  year_of_graduation: number | null;
  cgpa: string | null;
  experience: string | null;
  employee_id: string | null;
  designation: string | null;
  date_of_joining: string | null;
  qualification: string | null;
  specialization: string[] | null;
  total_experience: number | null;
  teaching_experience: number | null;
  industry_experience: number | null;
  projects: any[] | null;
  achievements: any[] | null;
  resume_url: string | null;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
}

// Compat layer: map Profile to the old User shape used by components
export interface AppUser {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role: 'student' | 'faculty';
  contactNo?: string;
  gender?: string;
  skills: string[];
  profilePicture?: string;
  bio?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  portfolio?: string;
  rollNumber?: string;
  department?: string;
  yearOfGraduation?: number;
  cgpa?: string;
  experience?: string;
  employeeId?: string;
  designation?: string;
  dateOfJoining?: string;
  qualification?: string;
  specialization?: string[];
  totalExperience?: number;
  teachingExperience?: number;
  industryExperience?: number;
  projects?: any[];
  achievements?: any[];
  resumeUrl?: string;
  coverLetter?: string;
  coverPhoto?: string;
  createdAt?: string;
  updatedAt?: string;
}

function profileToAppUser(p: Profile): AppUser {
  return {
    id: p.id,
    firstName: p.first_name || '',
    middleName: p.middle_name || undefined,
    lastName: p.last_name || '',
    email: p.email || '',
    role: p.role,
    contactNo: p.contact_no || undefined,
    gender: p.gender || undefined,
    skills: p.skills || [],
    profilePicture: p.profile_picture_url || undefined,
    bio: p.bio || undefined,
    location: p.location || undefined,
    linkedin: p.linkedin || undefined,
    github: p.github || undefined,
    leetcode: p.leetcode || undefined,
    portfolio: p.portfolio || undefined,
    rollNumber: p.roll_number || undefined,
    department: p.department || undefined,
    yearOfGraduation: p.year_of_graduation || undefined,
    cgpa: p.cgpa || undefined,
    experience: p.experience || undefined,
    employeeId: p.employee_id || undefined,
    designation: p.designation || undefined,
    dateOfJoining: p.date_of_joining || undefined,
    qualification: p.qualification || undefined,
    specialization: p.specialization || undefined,
    totalExperience: p.total_experience || undefined,
    teachingExperience: p.teaching_experience || undefined,
    industryExperience: p.industry_experience || undefined,
    projects: p.projects || undefined,
    achievements: p.achievements || undefined,
    resumeUrl: p.resume_url || undefined,
    coverLetter: p.cover_letter || undefined,
    coverPhoto: (p as any).cover_photo_url || undefined,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export interface RegisterData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  contactNo?: string;
  gender?: string;
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

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<AppUser>) => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userId: string): Promise<AppUser | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error || !data) return null;
    return profileToAppUser(data as Profile);
  };

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sess) => {
      setSession(sess);
      if (sess?.user) {
        // Use setTimeout to avoid potential deadlock with Supabase client
        setTimeout(async () => {
          const profile = await fetchProfile(sess.user.id);
          setUser(profile);
          setIsLoading(false);
        }, 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session: sess }, error: sessionError }) => {
      if (sessionError) {
        // Stale/invalid session (e.g. after project rename) – clear it
        console.warn('Session restore failed, signing out:', sessionError.message);
        supabase.auth.signOut().finally(() => {
          setUser(null);
          setSession(null);
          setIsLoading(false);
        });
        return;
      }
      setSession(sess);
      if (sess?.user) {
        fetchProfile(sess.user.id).then(profile => {
          setUser(profile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      console.error('Login error:', err);
      setError(msg);
      throw err;
    } finally {
      // Keep UI responsive; auth listener will finalize state after session arrives
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Build metadata with ALL profile fields so the trigger saves them
      const metadata: Record<string, any> = {
        role: userData.role,
        first_name: userData.firstName,
        middle_name: userData.middleName || null,
        last_name: userData.lastName,
        contact_no: userData.contactNo || null,
        gender: userData.gender || null,
        skills: userData.skills,
        profile_picture_url: userData.profilePictureUrl || null,
        portfolio: userData.portfolio || null,
      };

      if (userData.role === 'student') {
        metadata.roll_number = userData.rollNumber || null;
        metadata.department = userData.department || null;
        metadata.year_of_graduation = userData.yearOfGraduation?.toString() || null;
        metadata.experience = userData.experience?.toString() || null;
        metadata.projects = userData.projects?.filter(p => p.title).map((p, i) => ({
          id: `proj_${i}`, title: p.title, description: p.description, link: p.link,
        })) || [];
        metadata.achievements = userData.achievements?.filter(a => a).map((a, i) => ({
          id: `ach_${i}`, title: a,
        })) || [];
        metadata.resume_url = userData.resumeUrl || null;
      } else {
        metadata.employee_id = userData.employeeId || null;
        metadata.designation = userData.designation || null;
        metadata.date_of_joining = userData.dateOfJoining || null;
        metadata.qualification = userData.qualification || null;
        metadata.specialization = userData.specialization || null;
        metadata.total_experience = userData.totalExperience?.toString() || null;
        metadata.teaching_experience = userData.teachingExperience?.toString() || null;
        metadata.industry_experience = userData.industryExperience?.toString() || null;
        metadata.projects = userData.researchProjects?.filter(p => p.title).map((p, i) => ({
          id: `proj_${i}`, title: p.title, description: p.description, link: p.doi,
        })) || userData.projects?.filter(p => p.title).map((p, i) => ({
          id: `proj_${i}`, title: p.title, description: p.description, link: p.link,
        })) || [];
        metadata.resume_url = userData.cvUrl || null;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: metadata,
        },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Registration failed - no user returned');

      // Persist extended profile fields into profiles table for immediate availability (projects, achievements, etc.)
      const profilePayload: Record<string, any> = {
        id: authData.user.id,
        first_name: userData.firstName,
        middle_name: userData.middleName || null,
        last_name: userData.lastName,
        email: userData.email,
        role: userData.role,
        contact_no: userData.contactNo || null,
        gender: userData.gender || null,
        skills: userData.skills,
        profile_picture_url: userData.profilePictureUrl || null,
        portfolio: userData.portfolio || null,
        bio: null,
        location: null,
        linkedin: null,
        github: null,
        leetcode: null,
        cover_photo_url: null,
      };

      if (userData.role === 'student') {
        profilePayload.roll_number = userData.rollNumber || null;
        profilePayload.department = userData.department || null;
        profilePayload.year_of_graduation = userData.yearOfGraduation || null;
        profilePayload.experience = userData.experience?.toString() || null;
        profilePayload.projects = metadata.projects;
        profilePayload.achievements = metadata.achievements;
        profilePayload.resume_url = metadata.resume_url || null;
      } else {
        profilePayload.employee_id = userData.employeeId || null;
        profilePayload.designation = userData.designation || null;
        profilePayload.date_of_joining = userData.dateOfJoining || null;
        profilePayload.qualification = userData.qualification || null;
        profilePayload.specialization = userData.specialization || null;
        profilePayload.total_experience = userData.totalExperience?.toString() || null;
        profilePayload.teaching_experience = userData.teachingExperience?.toString() || null;
        profilePayload.industry_experience = userData.industryExperience?.toString() || null;
        profilePayload.projects = metadata.projects;
        profilePayload.achievements = metadata.achievements || [];
        profilePayload.resume_url = metadata.resume_url || null;
      }

      const { error: profileError } = await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });
      if (profileError) {
        // Don't block signup if profile upsert fails (avoids "user already registered" on retry)
        console.error('Profile upsert error after signup:', profileError);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      console.error('Registration error:', err);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    window.location.href = '/login';
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user) return;
    setError(null);
    try {
      // Map camelCase to snake_case
      const dbUpdates: Record<string, any> = {};
      if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
      if (updates.middleName !== undefined) dbUpdates.middle_name = updates.middleName;
      if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
      if (updates.contactNo !== undefined) dbUpdates.contact_no = updates.contactNo;
      if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
      if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
      if (updates.profilePicture !== undefined) dbUpdates.profile_picture_url = updates.profilePicture;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.linkedin !== undefined) dbUpdates.linkedin = updates.linkedin;
      if (updates.github !== undefined) dbUpdates.github = updates.github;
      if (updates.leetcode !== undefined) dbUpdates.leetcode = updates.leetcode;
      if (updates.portfolio !== undefined) dbUpdates.portfolio = updates.portfolio;
      if (updates.department !== undefined) dbUpdates.department = updates.department;
      if (updates.designation !== undefined) dbUpdates.designation = updates.designation;
      if (updates.projects !== undefined) dbUpdates.projects = updates.projects;
      if (updates.achievements !== undefined) dbUpdates.achievements = updates.achievements;
      if (updates.resumeUrl !== undefined) dbUpdates.resume_url = updates.resumeUrl;
      if (updates.coverLetter !== undefined) dbUpdates.cover_letter = updates.coverLetter;
      if (updates.coverPhoto !== undefined) dbUpdates.cover_photo_url = updates.coverPhoto;

      const { error: updateError } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Re-fetch to get the updated profile
      const refreshed = await fetchProfile(user.id);
      if (refreshed) setUser(refreshed);
    } catch (err) {
      setError('Failed to update profile');
      throw new Error('Profile update failed');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated: !!user && !!session,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

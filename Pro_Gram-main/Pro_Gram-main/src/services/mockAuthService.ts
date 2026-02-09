/**
 * Mock Authentication Service
 * Provides dummy login/registration without backend
 */

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

// Mock users database
const MOCK_USERS = [
  {
    id: '1',
    email: 'johndoe.22.cse@anits.edu.in',
    password: 'student123',
    role: 'student',
    firstName: 'John',
    lastName: 'Doe',
    contactNo: '1234567890',
    gender: 'Male',
    rollNumber: 'STU001',
    department: 'Computer Science',
    yearOfGraduation: 2026,
    skills: ['JavaScript', 'React', 'Node.js'],
    bio: 'Computer Science student passionate about web development',
    profilePictureUrl: 'https://ui-avatars.com/api/?name=John+Doe',
  },
  {
    id: '2',
    email: 'janesmith.cse@anits.edu.in',
    password: 'faculty123',
    role: 'faculty',
    firstName: 'Jane',
    lastName: 'Smith',
    contactNo: '0987654321',
    gender: 'Female',
    employeeId: 'FAC001',
    designation: 'Professor',
    department: 'Computer Science',
    qualification: 'PhD in Computer Science',
    specialization: ['Machine Learning', 'AI'],
    totalExperience: 10,
    teachingExperience: 8,
    industryExperience: 2,
    skills: ['Python', 'Machine Learning', 'Data Science'],
    bio: 'Experienced professor specializing in AI and ML',
    profilePictureUrl: 'https://ui-avatars.com/api/?name=Jane+Smith',
  },
  {
    id: '3',
    email: 'adminuser.20.cse@anits.edu.in',
    password: 'admin123',
    role: 'student',
    firstName: 'Admin',
    lastName: 'User',
    contactNo: '5555555555',
    gender: 'Other',
    rollNumber: 'ADM001',
    department: 'Computer Science',
    yearOfGraduation: 2024,
    skills: ['Management', 'Leadership'],
    bio: 'Admin account for testing',
    profilePictureUrl: 'https://ui-avatars.com/api/?name=Admin+User',
  },
];

// Helper to generate mock token
const generateMockToken = (userId: string): string => {
  return `mock_token_${userId}_${Date.now()}`;
};

// Helper to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  /**
   * Student registration - accepts any data and creates mock user
   */
  async registerStudent(data: RegisterStudentData): Promise<AuthResponse> {
    await delay();
    
    // Generate email in format: fullname.batchyear.dept@anits.edu.in
    // Extract batch year from yearOfGraduation (e.g., 2026 -> 22)
    const admissionYear = data.yearOfGraduation - 4; // Assuming 4-year course
    const batchYear = admissionYear.toString().slice(-2); // Just the year (e.g., 22)
    
    // Create full name (remove spaces and convert to lowercase)
    const fullName = `${data.firstName}${data.lastName}`.toLowerCase().replace(/\s+/g, '');
    
    // Get department abbreviation (e.g., "Computer Science" -> "cse")
    const deptMap: { [key: string]: string } = {
      'computer science': 'cse',
      'information technology': 'it',
      'electronics and communication': 'ece',
      'electrical and electronics': 'eee',
      'mechanical': 'mech',
      'civil': 'civil',
      'chemical': 'chem',
    };
    const deptAbbr = deptMap[data.department.toLowerCase()] || data.department.toLowerCase().slice(0, 3);
    
    const generatedEmail = `${fullName}.${batchYear}.${deptAbbr}@anits.edu.in`;
    
    const newUser = {
      id: `student_${Date.now()}`,
      email: data.email || generatedEmail, // Use provided email or generate one
      generatedEmail: generatedEmail, // Store the generated format
      password: data.password,
      role: 'student',
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      contactNo: data.contactNo,
      gender: data.gender,
      rollNumber: data.rollNumber,
      department: data.department,
      yearOfGraduation: data.yearOfGraduation,
      skills: data.skills,
      projects: data.projects || [],
      achievements: data.achievements || [],
      experience: data.experience,
      portfolio: data.portfolio,
      github: data.github,
      linkedin: data.linkedin,
      leetcode: data.leetcode,
      cgpa: data.cgpa,
      bio: data.bio || '',
      location: data.location,
      profilePictureUrl: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}`,
      createdAt: new Date().toISOString(),
    };

    const accessToken = generateMockToken(newUser.id);
    const refreshToken = generateMockToken(`refresh_${newUser.id}`);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    return {
      success: true,
      message: 'Student registered successfully',
      data: {
        user: newUser,
        accessToken,
        refreshToken,
      },
    };
  },

  /**
   * Faculty registration - accepts any data and creates mock user
   */
  async registerFaculty(data: RegisterFacultyData): Promise<AuthResponse> {
    await delay();
    
    // Generate email in format: fullnamesurname.dept@anits.edu.in
    // Create full name with surname (remove spaces and convert to lowercase)
    const fullName = `${data.firstName}${data.lastName}`.toLowerCase().replace(/\s+/g, '');
    
    // Get department abbreviation
    const deptMap: { [key: string]: string } = {
      'computer science': 'cse',
      'information technology': 'it',
      'electronics and communication': 'ece',
      'electrical and electronics': 'eee',
      'mechanical': 'mech',
      'civil': 'civil',
      'chemical': 'chem',
    };
    
    // Try to get department from specialization if not directly available
    let deptAbbr = 'cse'; // default
    if (data.specialization && data.specialization.length > 0) {
      const spec = data.specialization[0].toLowerCase();
      deptAbbr = deptMap[spec] || spec.slice(0, 3);
    }
    
    const generatedEmail = `${fullName}.${deptAbbr}@anits.edu.in`;
    
    const newUser = {
      id: `faculty_${Date.now()}`,
      email: data.email || generatedEmail, // Use provided email or generate one
      generatedEmail: generatedEmail, // Store the generated format
      password: data.password,
      role: 'faculty',
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      contactNo: data.contactNo,
      gender: data.gender,
      employeeId: data.employeeId,
      designation: data.designation,
      department: 'Computer Science',
      dateOfJoining: data.dateOfJoining,
      totalExperience: data.totalExperience,
      industryExperience: data.industryExperience,
      teachingExperience: data.teachingExperience,
      qualification: data.qualification,
      specialization: data.specialization,
      skills: data.skills,
      publications: data.publications || [],
      patents: data.patents || [],
      awards: data.awards || [],
      bio: data.bio || '',
      officeLocation: data.officeLocation,
      researchInterests: data.researchInterests || [],
      profilePictureUrl: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}`,
      createdAt: new Date().toISOString(),
    };

    const accessToken = generateMockToken(newUser.id);
    const refreshToken = generateMockToken(`refresh_${newUser.id}`);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    return {
      success: true,
      message: 'Faculty registered successfully',
      data: {
        user: newUser,
        accessToken,
        refreshToken,
      },
    };
  },

  /**
   * Login - checks against mock users or any email/password combination
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay();

    // Check if credentials match any mock user
    const user = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      const accessToken = generateMockToken(user.id);
      const refreshToken = generateMockToken(`refresh_${user.id}`);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        message: 'Login successful',
        data: {
          user,
          accessToken,
          refreshToken,
        },
      };
    }

    // If no match found, allow any login (for testing)
    const mockUser = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      password: credentials.password,
      role: 'student',
      firstName: 'Test',
      lastName: 'User',
      contactNo: '0000000000',
      gender: 'Other',
      rollNumber: 'TEST001',
      department: 'General',
      yearOfGraduation: 2025,
      skills: [],
      bio: 'Test user account',
      profilePictureUrl: `https://ui-avatars.com/api/?name=Test+User`,
    };

    const accessToken = generateMockToken(mockUser.id);
    const refreshToken = generateMockToken(`refresh_${mockUser.id}`);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(mockUser));

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: mockUser,
        accessToken,
        refreshToken,
      },
    };
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    await delay(200);
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      const user = JSON.parse(userStr);
      const accessToken = generateMockToken(user.id);
      const refreshToken = generateMockToken(`refresh_${user.id}`);
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return {
        success: true,
        message: 'Token refreshed',
        data: { user, accessToken, refreshToken },
      };
    }

    throw new Error('No user found');
  },

  /**
   * Forgot password - always succeeds
   */
  async forgotPassword(_email: string): Promise<{ success: boolean; message: string }> {
    await delay();
    return {
      success: true,
      message: 'Password reset email sent (mock)',
    };
  },

  /**
   * Reset password - always succeeds
   */
  async resetPassword(_token: string, _newPassword: string): Promise<{ success: boolean; message: string }> {
    await delay();
    return {
      success: true,
      message: 'Password reset successful (mock)',
    };
  },

  /**
   * Check email availability - always available
   */
  async checkEmailAvailability(_email: string): Promise<{ available: boolean }> {
    await delay(200);
    return { available: true };
  },

  /**
   * Check roll number availability - always available
   */
  async checkRollNumberAvailability(_rollNumber: string): Promise<{ available: boolean }> {
    await delay(200);
    return { available: true };
  },
};

/**
 * Mock credentials for testing:
 * 
 * Student Account:
 * - Email: johndoe.22.cse@anits.edu.in
 * - Password: student123
 * 
 * Faculty Account:
 * - Email: janesmith.cse@anits.edu.in
 * - Password: faculty123
 * 
 * Admin Account:
 * - Email: adminuser.20.cse@anits.edu.in
 * - Password: admin123
 * 
 * Email Format:
 * - Student: fullname.batchyear.dept@anits.edu.in (e.g., godavarthivedaaksharee.22.csd@anits.edu.in)
 * - Faculty: fullnamesurname.dept@anits.edu.in (e.g., janesmith.cse@anits.edu.in)
 * 
 * Or use any email/password combination - all logins will succeed!
 */

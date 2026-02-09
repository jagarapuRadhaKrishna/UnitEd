// User Types
export interface BaseUser {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string; // University email
  contactNo: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  profilePicture?: string;
  skills: string[];
  projects: ProjectDetail[];
  achievements: Achievement[];
  resumeUrl?: string;
  resume?: string;
  coverLetter?: string;
  leetcode?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  location?: string;
  bio?: string;
  role: 'student' | 'faculty';
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentProfile extends BaseUser {
  role: 'student';
  rollNumber: string; // Format: A*********** (12 digits)
  department: string;
  yearOfGraduation: number;
  experience?: string; // General experience description
  cgpa?: string; // CGPA out of 10
}

export interface FacultyProfile extends BaseUser {
  role: 'faculty';
  employeeId: string; // Format: 100*** (6 digits)
  designation: string;
  dateOfJoining: string;
  totalExperience: number; // In years
  industryExperience: number; // In years
  teachingExperience: number; // In years
  qualification: string; // Highest qualification
  specialization: string[]; // Areas of specialization
}

export type User = StudentProfile | FacultyProfile;

// Project Detail Type (for user profiles)
export interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  link?: string;
  skills?: string[];
  duration?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
}

// Achievement Type
export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
  issuer?: string;
  link?: string;
  category?: 'award' | 'certification' | 'publication' | 'competition' | 'other';
}

// Legacy Project Type (for opportunities/posts)
export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  skills: string[];
  duration?: string;
}

// Skill Requirement Type
export interface SkillRequirement {
  skill: string;
  requiredCount: number;
  acceptedCount?: number;
}

// Post/Opportunity Types
export interface Post {
  id: string;
  title: string;
  description: string;
  purpose: 'Research Work' | 'Projects' | 'Hackathons';
  skillRequirements: SkillRequirement[];
  author: {
    id: string;
    name: string;
    type: 'student' | 'faculty';
    avatar?: string;
  };
  createdAt: string;
  deadline?: string; // Post deadline (ISO date string)
  maxMembers?: number; // Maximum number of members
  currentMembers: number; // Current accepted members count
  applications: Application[];
  status: 'active' | 'filled' | 'closed' | 'archived';
  chatroomEnabled: boolean;
  chatroomId?: string;
  chatGraceDays?: number; // Days after deadline before chat is deleted (default 7)
  expiresAt?: string; // Calculated: deadline + chatGraceDays
}

// Invitation Types (NEW - for owner inviting candidates)
export interface Invitation {
  id: string;
  postId: string;
  post: {
    id: string;
    title: string;
    purpose: string;
    deadline?: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  inviterId: string; // Owner who sent invite
  inviter: {
    id: string;
    name: string;
    avatar?: string;
  };
  inviteeId: string; // Candidate being invited
  invitee: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    skills: string[];
  };
  status: 'pending' | 'cancelled' | 'accepted' | 'declined';
  createdAt: string;
  seenAt?: string; // When invitee viewed the invitation
  respondedAt?: string; // When invitee accepted/declined
}

// Application Types (EXTENDED)
export interface Application {
  id: string;
  postId: string;
  post?: {
    id: string;
    title: string;
    purpose: string;
    status: string;
    author: {
      id: string;
      name: string;
    };
  };
  applicantId: string;
  applicant: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    skills: string[];
    profile: Partial<User>;
    cgpa?: string;
    department?: string;
    year?: string;
  };
  appliedForSkill?: string; // Optional - specific skill
  resume?: string; // Resume file/URL
  coverLetter?: string; // Cover letter text
  answers: ApplicationAnswer[];
  status: 'applied' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
  isRecommended?: boolean; // AI-recommended candidate
  matchScore?: number; // 0-100 matching score
  appliedAt: string;
  updatedAt?: string;
  reviewedAt?: string; // When owner accepted/rejected
}

export interface ApplicationAnswer {
  question: string;
  answer: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'application_received' | 'application_accepted' | 'application_rejected' | 
        'invitation_received' | 'chatroom_invite' | 'chatroom_created' | 'chatroom_expiring' |
        'new_message' | 'connection_request' | 'connection_accepted' | 
        'post_closed' | 'post_filled';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  relatedUserId?: string; // For connection-related notifications
  relatedPostId?: string; // For post-related notifications
  relatedChatroomId?: string; // For chat-related notifications
}

// Connection Request Types
export interface ConnectionRequest {
  id: string;
  senderId: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'faculty';
    avatar?: string;
    department?: string;
    designation?: string;
    skills: string[];
  };
  receiverId: string;
  message?: string; // Optional message when sending request
  status: 'pending' | 'accepted' | 'ignored';
  createdAt: string;
  updatedAt?: string;
}

// Chatroom Types (EXTENDED for project-scoped chats)
export interface Chatroom {
  id: string;
  postId: string;
  post: {
    id: string;
    title: string;
    purpose: string;
    deadline?: string;
  };
  postTitle: string; // Legacy - kept for backward compatibility
  members: ChatMember[];
  messages: Message[];
  status: 'active' | 'read_only' | 'deleted'; // Lifecycle management
  createdAt: string;
  lastActivity: string;
  expiresAt?: string; // When chat will be deleted (post.deadline + grace days)
  deletedAt?: string; // Soft delete timestamp
}

export interface ChatMember {
  userId: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'member'; // owner = post creator, member = accepted applicant
  joinedAt: string;
  lastSeenAt?: string;
}

export interface ChatParticipant {
  chatId: string;
  userId: string;
  joinedAt: string;
}

export interface Message {
  id: string;
  chatroomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'file' | 'system'; // system = auto-generated messages
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  read: boolean;
  readBy?: string[]; // Array of user IDs who read this message
}

// Skills Database
export const AVAILABLE_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP',
  'Swift', 'Kotlin', 'R', 'MATLAB', 'Scala', 'Perl',
  
  // Web Development
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'ASP.NET', 'HTML', 'CSS', 'Sass', 'Bootstrap', 'Tailwind CSS', 'jQuery',
  
  // Mobile Development
  'React Native', 'Flutter', 'iOS Development', 'Android Development', 'Xamarin',
  
  // Databases
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'Firebase',
  'DynamoDB', 'Cassandra', 'Neo4j',
  
  // DevOps & Cloud
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
  'Terraform', 'Ansible', 'Linux', 'Nginx', 'Apache',
  
  // Data Science & AI
  'Machine Learning', 'Deep Learning', 'Neural Networks', 'TensorFlow', 'PyTorch',
  'Scikit-learn', 'Pandas', 'NumPy', 'Data Analysis', 'Data Visualization', 'NLP',
  'Computer Vision', 'Reinforcement Learning',
  
  // Design
  'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
  'Wireframing', 'Prototyping',
  
  // Other Technical
  'Git', 'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'Testing',
  'Cybersecurity', 'Blockchain', 'IoT', 'AR/VR', 'Game Development',
  
  // Soft Skills
  'Leadership', 'Communication', 'Project Management', 'Problem Solving', 'Team Collaboration',
  'Critical Thinking', 'Research', 'Technical Writing', 'Presentation'
] as const;

export type Skill = typeof AVAILABLE_SKILLS[number];

// Departments
export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics and Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Business Administration',
  'Economics',
  'Management',
  'Other',
] as const;

export type Department = typeof DEPARTMENTS[number];

// Faculty Designations
export const FACULTY_DESIGNATIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
] as const;

export type FacultyDesignation = typeof FACULTY_DESIGNATIONS[number];

// Qualifications
export const QUALIFICATIONS = [
  'Ph.D.',
  'M.Tech',
  'M.S.',
  'M.Phil',
  'B.Tech',
  'B.E.',
  'MBA',
  'MCA',
  'M.Sc.',
  'B.Sc.',
  'Other',
] as const;

export type Qualification = typeof QUALIFICATIONS[number];

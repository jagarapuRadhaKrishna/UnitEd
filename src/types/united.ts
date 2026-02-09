// User Types
export interface BaseUser {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
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
  rollNumber: string;
  department: string;
  yearOfGraduation: number;
  experience?: string;
  cgpa?: string;
}

export interface FacultyProfile extends BaseUser {
  role: 'faculty';
  employeeId: string;
  designation: string;
  dateOfJoining: string;
  totalExperience: number;
  industryExperience: number;
  teachingExperience: number;
  qualification: string;
  specialization: string[];
}

export type User = StudentProfile | FacultyProfile;

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

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
  issuer?: string;
  link?: string;
  category?: 'award' | 'certification' | 'publication' | 'competition' | 'other';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  skills: string[];
  duration?: string;
}

export interface SkillRequirement {
  skill: string;
  requiredCount: number;
  acceptedCount?: number;
}

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
  deadline?: string;
  maxMembers?: number;
  currentMembers: number;
  applications: Application[];
  status: 'active' | 'filled' | 'closed' | 'archived';
  chatroomEnabled: boolean;
  chatroomId?: string;
  chatGraceDays?: number;
  expiresAt?: string;
}

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
  inviterId: string;
  inviter: {
    id: string;
    name: string;
    avatar?: string;
  };
  inviteeId: string;
  invitee: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    skills: string[];
  };
  status: 'pending' | 'cancelled' | 'accepted' | 'declined';
  createdAt: string;
  seenAt?: string;
  respondedAt?: string;
}

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
  appliedForSkill?: string;
  resume?: string;
  coverLetter?: string;
  answers: ApplicationAnswer[];
  status: 'applied' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
  isRecommended?: boolean;
  matchScore?: number;
  appliedAt: string;
  updatedAt?: string;
  reviewedAt?: string;
}

export interface ApplicationAnswer {
  question: string;
  answer: string;
}

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
  relatedUserId?: string;
  relatedPostId?: string;
  relatedChatroomId?: string;
}

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
  message?: string;
  status: 'pending' | 'accepted' | 'ignored';
  createdAt: string;
  updatedAt?: string;
}

export interface Chatroom {
  id: string;
  postId: string;
  post: {
    id: string;
    title: string;
    purpose: string;
    deadline?: string;
  };
  postTitle: string;
  members: ChatMember[];
  messages: Message[];
  status: 'active' | 'read_only' | 'deleted';
  createdAt: string;
  lastActivity: string;
  expiresAt?: string;
  deletedAt?: string;
}

export interface ChatMember {
  userId: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'member';
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
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  read: boolean;
  readBy?: string[];
}

export const AVAILABLE_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP',
  'Swift', 'Kotlin', 'R', 'MATLAB', 'Scala', 'Perl',
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'ASP.NET', 'HTML', 'CSS', 'Sass', 'Bootstrap', 'Tailwind CSS', 'jQuery',
  'React Native', 'Flutter', 'iOS Development', 'Android Development', 'Xamarin',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'Firebase',
  'DynamoDB', 'Cassandra', 'Neo4j',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
  'Terraform', 'Ansible', 'Linux', 'Nginx', 'Apache',
  'Machine Learning', 'Deep Learning', 'Neural Networks', 'TensorFlow', 'PyTorch',
  'Scikit-learn', 'Pandas', 'NumPy', 'Data Analysis', 'Data Visualization', 'NLP',
  'Computer Vision', 'Reinforcement Learning',
  'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
  'Wireframing', 'Prototyping',
  'Git', 'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'Testing',
  'Cybersecurity', 'Blockchain', 'IoT', 'AR/VR', 'Game Development',
  'Leadership', 'Communication', 'Project Management', 'Problem Solving', 'Team Collaboration',
  'Critical Thinking', 'Research', 'Technical Writing', 'Presentation'
] as const;

export type Skill = typeof AVAILABLE_SKILLS[number];

export const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics and Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Biotechnology', 'Mathematics', 'Physics',
  'Chemistry', 'Business Administration', 'Economics', 'Management', 'Other',
] as const;

export type Department = typeof DEPARTMENTS[number];

export const FACULTY_DESIGNATIONS = [
  'Professor', 'Associate Professor', 'Assistant Professor',
] as const;

export type FacultyDesignation = typeof FACULTY_DESIGNATIONS[number];

export const QUALIFICATIONS = [
  'Ph.D.', 'M.Tech', 'M.S.', 'M.Phil', 'B.Tech', 'B.E.', 'MBA', 'MCA', 'M.Sc.', 'B.Sc.', 'Other',
] as const;

export type Qualification = typeof QUALIFICATIONS[number];

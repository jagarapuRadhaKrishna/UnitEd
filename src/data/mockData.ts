import type { Post } from '../types/united';

export const profileImages = {
  madhuri: 'https://ui-avatars.com/api/?name=Madhuri&background=2563EB&color=fff',
  annanya: 'https://ui-avatars.com/api/?name=Annanya&background=6C47FF&color=fff',
  vedhakshi: 'https://ui-avatars.com/api/?name=Vedhakshi&background=F97316&color=fff',
  maaroof: 'https://ui-avatars.com/api/?name=Maaroof&background=10B981&color=fff',
  krishna: 'https://ui-avatars.com/api/?name=Krishna&background=F59E0B&color=fff',
  satwika: 'https://ui-avatars.com/api/?name=Satwika&background=EF4444&color=fff',
  chandrika: 'https://ui-avatars.com/api/?name=Chandrika&background=8B5CF6&color=fff',
  background: '/placeholder.svg'
};

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'AI & Machine Learning Research Assistant',
    description: 'We are looking for dedicated Research Assistants to join our AI & Machine Learning research team. Work on cutting-edge neural network architectures and deep learning applications.',
    purpose: 'Research Work',
    skillRequirements: [
      { skill: 'Python', requiredCount: 2, acceptedCount: 0 },
      { skill: 'Machine Learning', requiredCount: 2, acceptedCount: 0 },
      { skill: 'Neural Networks', requiredCount: 1, acceptedCount: 0 }
    ],
    author: { id: 'f1', name: 'Madhuri', type: 'faculty', avatar: profileImages.madhuri },
    createdAt: '2025-11-01T10:00:00Z',
    applications: [],
    status: 'active',
    chatroomEnabled: false,
    currentMembers: 0
  },
  {
    id: '2',
    title: 'Sustainability Project Collaboration',
    description: 'Seeking passionate students for a cross-disciplinary sustainability project focused on developing eco-friendly solutions for campus waste management.',
    purpose: 'Projects',
    skillRequirements: [
      { skill: 'Environmental Science', requiredCount: 2, acceptedCount: 0 },
      { skill: 'Data Analysis', requiredCount: 1, acceptedCount: 0 },
      { skill: 'Research', requiredCount: 1, acceptedCount: 0 }
    ],
    author: { id: 'f2', name: 'Annanya', type: 'faculty', avatar: profileImages.annanya },
    createdAt: '2025-11-02T15:30:00Z',
    applications: [],
    status: 'active',
    chatroomEnabled: false,
    currentMembers: 0
  },
  {
    id: '3',
    title: 'Smart City Hackathon Team',
    description: 'Looking for talented developers and designers to participate in the upcoming Smart City Hackathon. Build innovative solutions for urban challenges.',
    purpose: 'Hackathons',
    skillRequirements: [
      { skill: 'React', requiredCount: 2, acceptedCount: 0 },
      { skill: 'Node.js', requiredCount: 1, acceptedCount: 0 },
      { skill: 'UI/UX Design', requiredCount: 1, acceptedCount: 0 },
      { skill: 'IoT', requiredCount: 1, acceptedCount: 0 }
    ],
    author: { id: 's1', name: 'Vedhakshi', type: 'student', avatar: profileImages.vedhakshi },
    createdAt: '2025-11-03T09:15:00Z',
    applications: [],
    status: 'active',
    chatroomEnabled: false,
    currentMembers: 0
  },
  {
    id: '4',
    title: 'Blockchain Research Project',
    description: 'Join our team exploring blockchain applications in academic credential verification. Experience with distributed systems preferred.',
    purpose: 'Research Work',
    skillRequirements: [
      { skill: 'Blockchain', requiredCount: 2, acceptedCount: 0 },
      { skill: 'JavaScript', requiredCount: 1, acceptedCount: 0 },
      { skill: 'Cryptography', requiredCount: 1, acceptedCount: 0 }
    ],
    author: { id: 'f3', name: 'Maaroof', type: 'faculty', avatar: profileImages.maaroof },
    createdAt: '2025-11-04T14:00:00Z',
    applications: [],
    status: 'active',
    chatroomEnabled: false,
    currentMembers: 0
  },
  {
    id: '5',
    title: 'Data Science Workshop Team',
    description: 'Looking for enthusiastic students to join our data science workshop. Learn advanced analytics and visualization techniques.',
    purpose: 'Projects',
    skillRequirements: [
      { skill: 'Python', requiredCount: 2, acceptedCount: 0 },
      { skill: 'Data Visualization', requiredCount: 1, acceptedCount: 0 },
      { skill: 'Statistics', requiredCount: 1, acceptedCount: 0 }
    ],
    author: { id: 's2', name: 'Krishna', type: 'student', avatar: profileImages.krishna },
    createdAt: '2025-11-05T11:00:00Z',
    applications: [],
    status: 'active',
    chatroomEnabled: false,
    currentMembers: 0
  },
  {
    id: '6',
    title: 'Mobile App Development Research',
    description: 'Research opportunity in mobile application development focusing on cross-platform solutions and performance optimization.',
    purpose: 'Research Work',
    skillRequirements: [
      { skill: 'React Native', requiredCount: 2, acceptedCount: 0 },
      { skill: 'Mobile Development', requiredCount: 1, acceptedCount: 0 },
      { skill: 'Performance Testing', requiredCount: 1, acceptedCount: 0 }
    ],
    author: { id: 'f4', name: 'Satwika', type: 'faculty', avatar: profileImages.satwika },
    createdAt: '2025-11-06T13:30:00Z',
    applications: [],
    status: 'active',
    chatroomEnabled: false,
    currentMembers: 0
  },
  {
    id: '7',
    title: 'Web3 Development Hackathon',
    description: 'Join our team for the Web3 hackathon. Build decentralized applications and explore blockchain technology.',
    purpose: 'Hackathons',
    skillRequirements: [
      { skill: 'Solidity', requiredCount: 2, acceptedCount: 0 },
      { skill: 'Web3.js', requiredCount: 1, acceptedCount: 0 },
      { skill: 'Smart Contracts', requiredCount: 1, acceptedCount: 0 }
    ],
    author: { id: 's3', name: 'Chandrika', type: 'student', avatar: profileImages.chandrika },
    createdAt: '2025-11-07T16:00:00Z',
    applications: [],
    status: 'active',
    chatroomEnabled: false,
    currentMembers: 0
  }
];

export const getUserOwnedPosts = (currentUser: any): Post[] => {
  if (!currentUser) return [];

  const userName = currentUser.firstName && currentUser.lastName
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : currentUser.name || 'User';

  const userId = currentUser.id || 'current-user';

  if (currentUser.role === 'faculty') {
    return [
      {
        id: `my-post-f1-${userId}`,
        title: 'Advanced Machine Learning Research',
        description: 'Seeking talented students for a research project on advanced neural network architectures and deep learning optimization techniques.',
        purpose: 'Research Work',
        skillRequirements: [
          { skill: 'Python', requiredCount: 2, acceptedCount: 1 },
          { skill: 'TensorFlow', requiredCount: 1, acceptedCount: 0 },
          { skill: 'Deep Learning', requiredCount: 1, acceptedCount: 0 }
        ],
        author: { id: userId, name: userName, type: 'faculty' },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        applications: [],
        status: 'active',
        chatroomEnabled: false,
        currentMembers: 1
      },
      {
        id: `my-post-f2-${userId}`,
        title: 'Computer Vision Research Lab',
        description: 'Looking for motivated students to join our computer vision research lab.',
        purpose: 'Research Work',
        skillRequirements: [
          { skill: 'Computer Vision', requiredCount: 2, acceptedCount: 1 },
          { skill: 'OpenCV', requiredCount: 1, acceptedCount: 1 },
          { skill: 'Python', requiredCount: 1, acceptedCount: 0 },
          { skill: 'PyTorch', requiredCount: 1, acceptedCount: 0 }
        ],
        author: { id: userId, name: userName, type: 'faculty' },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        applications: [],
        status: 'active',
        chatroomEnabled: false,
        currentMembers: 2
      },
      {
        id: `my-post-f3-${userId}`,
        title: 'Natural Language Processing Project',
        description: 'Research opportunity in NLP focusing on sentiment analysis and language models.',
        purpose: 'Research Work',
        skillRequirements: [
          { skill: 'NLP', requiredCount: 1, acceptedCount: 0 },
          { skill: 'Python', requiredCount: 1, acceptedCount: 0 },
          { skill: 'Machine Learning', requiredCount: 1, acceptedCount: 0 }
        ],
        author: { id: userId, name: userName, type: 'faculty' },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        applications: [],
        status: 'active',
        chatroomEnabled: false,
        currentMembers: 0
      },
    ];
  }

  return [
    {
      id: `my-post-s1-${userId}`,
      title: 'Full-Stack Web Development Team',
      description: 'Building a social networking platform for students.',
      purpose: 'Projects',
      skillRequirements: [
        { skill: 'React', requiredCount: 2, acceptedCount: 2 },
        { skill: 'Node.js', requiredCount: 2, acceptedCount: 1 },
        { skill: 'MongoDB', requiredCount: 1, acceptedCount: 0 },
        { skill: 'TypeScript', requiredCount: 1, acceptedCount: 0 }
      ],
      author: { id: userId, name: userName, type: 'student' },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applications: [],
      status: 'active',
      chatroomEnabled: false,
      currentMembers: 3
    },
    {
      id: `my-post-s2-${userId}`,
      title: 'Mobile App Development Project',
      description: 'Creating a campus navigation app with AR features.',
      purpose: 'Projects',
      skillRequirements: [
        { skill: 'React Native', requiredCount: 2, acceptedCount: 1 },
        { skill: 'Flutter', requiredCount: 1, acceptedCount: 1 },
        { skill: 'UI/UX Design', requiredCount: 1, acceptedCount: 0 },
        { skill: 'AR', requiredCount: 1, acceptedCount: 0 }
      ],
      author: { id: userId, name: userName, type: 'student' },
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      applications: [],
      status: 'active',
      chatroomEnabled: false,
      currentMembers: 2
    },
    {
      id: `my-post-s3-${userId}`,
      title: 'AI Hackathon Team 2025',
      description: 'Forming a team for the upcoming AI hackathon.',
      purpose: 'Hackathons',
      skillRequirements: [
        { skill: 'Python', requiredCount: 2, acceptedCount: 1 },
        { skill: 'AI/ML', requiredCount: 1, acceptedCount: 0 },
        { skill: 'OpenAI API', requiredCount: 1, acceptedCount: 0 },
        { skill: 'Problem Solving', requiredCount: 1, acceptedCount: 0 }
      ],
      author: { id: userId, name: userName, type: 'student' },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      applications: [],
      status: 'active',
      chatroomEnabled: false,
      currentMembers: 1
    },
  ];
};

export const getAllPosts = (currentUser?: any): Post[] => {
  const userPosts = getUserOwnedPosts(currentUser);
  return [...mockPosts, ...userPosts];
};

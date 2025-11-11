import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Search, Filter, Users, Calendar, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockPosts as importedMockPosts, getUserOwnedPosts } from '../data/mockData';

interface Post {
  id: string;
  title: string;
  description: string;
  author: {
    id?: string;
    name: string;
    avatar?: string;
    type: 'Student' | 'Faculty';
  };
  skills: string[];
  requiredMembers: number;
  acceptedMembers: number;
  purpose: 'Research' | 'Project' | 'Hackathon';
  createdAt: string;
  isOwned: boolean;
}

// Map imported posts to the format expected by this component
const mockPosts: Post[] = importedMockPosts.map(post => ({
  id: post.id,
  title: post.title,
  description: post.description,
  author: {
    id: post.author.id,
    name: post.author.name,
    avatar: post.author.avatar,
    type: post.author.type === 'faculty' ? 'Faculty' : 'Student',
  },
  skills: post.skillRequirements.map(sr => sr.skill),
  requiredMembers: post.skillRequirements.reduce((sum, sr) => sum + sr.requiredCount, 0),
  acceptedMembers: post.skillRequirements.reduce((sum, sr) => sum + (sr.acceptedCount || 0), 0),
  purpose: post.purpose as 'Research' | 'Project' | 'Hackathon',
  createdAt: post.createdAt,
  isOwned: false,
}));

// Helper function to convert user-owned posts to Home component format
const mapUserOwnedPosts = (currentUser: any): Post[] => {
  const userPosts = getUserOwnedPosts(currentUser);
  return userPosts.map(post => ({
    id: post.id,
    title: post.title,
    description: post.description,
    author: {
      id: post.author.id,
      name: post.author.name,
      avatar: post.author.avatar,
      type: post.author.type === 'faculty' ? 'Faculty' : 'Student',
    },
    skills: post.skillRequirements.map(sr => sr.skill),
    requiredMembers: post.skillRequirements.reduce((sum, sr) => sum + sr.requiredCount, 0),
    acceptedMembers: post.skillRequirements.reduce((sum, sr) => sum + (sr.acceptedCount || 0), 0),
    purpose: post.purpose as 'Research' | 'Project' | 'Hackathon',
    createdAt: post.createdAt,
    isOwned: true,
  }));
};

// Add some additional demo posts for variety
const additionalPosts: Post[] = [
  {
    id: 'demo-1',
    title: 'AI Research Project',
    description: 'Looking for team members to work on machine learning for healthcare applications.',
    author: {
      name: 'Dr. Smith',
      type: 'Faculty',
    },
    skills: ['Machine Learning', 'Python', 'TensorFlow'],
    requiredMembers: 4,
    acceptedMembers: 3,
    purpose: 'Research',
    createdAt: '2024-11-06',
    isOwned: false,
  },
  {
    id: 'demo-2',
    title: 'Web Development Team',
    description: 'Building an e-commerce platform using React and Node.js.',
    author: {
      name: 'John Doe',
      type: 'Student',
    },
    skills: ['React', 'Node.js', 'MongoDB'],
    requiredMembers: 3,
    acceptedMembers: 2,
    purpose: 'Project',
    createdAt: '2024-11-05',
    isOwned: true,
  },
  {
    id: 'demo-3',
    title: 'Hackathon Team 2024',
    description: 'Smart campus solutions for the upcoming national hackathon.',
    author: {
      name: 'Sarah Johnson',
      type: 'Student',
    },
    skills: ['IoT', 'React', 'Firebase'],
    requiredMembers: 5,
    acceptedMembers: 5,
    purpose: 'Hackathon',
    createdAt: '2024-11-04',
    isOwned: false,
  },
  {
    id: 'demo-4',
    title: 'Blockchain Research Initiative',
    description: 'Exploring decentralized applications and smart contract development for academic use cases.',
    author: {
      name: 'Prof. Anderson',
      type: 'Faculty',
    },
    skills: ['Blockchain', 'Solidity', 'Web3.js'],
    requiredMembers: 3,
    acceptedMembers: 1,
    purpose: 'Research',
    createdAt: '2024-11-06',
    isOwned: false,
  },
  {
    id: 'demo-5',
    title: 'Mobile App Development',
    description: 'Creating a cross-platform mobile app for student collaboration and resource sharing.',
    author: {
      name: 'Emily Chen',
      type: 'Student',
    },
    skills: ['React Native', 'TypeScript', 'Firebase'],
    requiredMembers: 4,
    acceptedMembers: 2,
    purpose: 'Project',
    createdAt: '2024-11-05',
    isOwned: false,
  },
  {
    id: 'demo-6',
    title: 'Data Science Workshop Team',
    description: 'Preparing materials and hands-on projects for upcoming data science workshop series.',
    author: {
      name: 'Dr. Martinez',
      type: 'Faculty',
    },
    skills: ['Python', 'Data Analysis', 'Machine Learning'],
    requiredMembers: 3,
    acceptedMembers: 3,
    purpose: 'Research',
    createdAt: '2024-11-05',
    isOwned: false,
  },
  {
    id: 'demo-7',
    title: 'Cybersecurity Challenge',
    description: 'Form a team to compete in the national cybersecurity competition. Focus on ethical hacking and network security.',
    author: {
      name: 'Alex Turner',
      type: 'Student',
    },
    skills: ['Cybersecurity', 'Networking', 'Linux'],
    requiredMembers: 4,
    acceptedMembers: 3,
    purpose: 'Hackathon',
    createdAt: '2024-11-04',
    isOwned: false,
  },
  {
    id: 'demo-8',
    title: 'UI/UX Design Project',
    description: 'Redesigning campus portal with modern design principles and accessibility standards.',
    author: {
      name: 'Jessica Lee',
      type: 'Student',
    },
    skills: ['Figma', 'UI/UX Design', 'User Research'],
    requiredMembers: 3,
    acceptedMembers: 1,
    purpose: 'Project',
    createdAt: '2024-11-03',
    isOwned: false,
  },
  {
    id: 'demo-9',
    title: 'Climate Tech Innovation',
    description: 'Developing IoT solutions for monitoring and reducing campus carbon footprint.',
    author: {
      name: 'Dr. Green',
      type: 'Faculty',
    },
    skills: ['IoT', 'Data Analytics', 'Sustainability'],
    requiredMembers: 5,
    acceptedMembers: 2,
    purpose: 'Research',
    createdAt: '2024-11-03',
    isOwned: false,
  },
  {
    id: 'demo-10',
    title: 'Game Development Jam',
    description: 'Create an educational game in 48 hours! Join our team for the upcoming game jam.',
    author: {
      name: 'Mike Ross',
      type: 'Student',
    },
    skills: ['Unity', 'C#', 'Game Design'],
    requiredMembers: 4,
    acceptedMembers: 4,
    purpose: 'Hackathon',
    createdAt: '2024-11-02',
    isOwned: false,
  },
  {
    id: 'demo-11',
    title: 'Cloud Architecture Project',
    description: 'Building scalable microservices architecture on AWS for enterprise applications.',
    author: {
      name: 'Prof. Kumar',
      type: 'Faculty',
    },
    skills: ['AWS', 'Docker', 'Kubernetes'],
    requiredMembers: 3,
    acceptedMembers: 2,
    purpose: 'Research',
    createdAt: '2024-11-02',
    isOwned: false,
  },
  {
    id: 'demo-12',
    title: 'AR/VR Education Platform',
    description: 'Developing immersive learning experiences using augmented and virtual reality technologies.',
    author: {
      name: 'David Park',
      type: 'Student',
    },
    skills: ['Unity', 'AR/VR', 'C#'],
    requiredMembers: 4,
    acceptedMembers: 1,
    purpose: 'Project',
    createdAt: '2024-11-01',
    isOwned: false,
  },
];

// Combine imported posts with additional demo posts
const allMockPosts = [...mockPosts, ...additionalPosts];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get active tab from navigation state, default to 0 (All Posts)
  const initialTab = (location.state as any)?.activeTab ?? 0;
  const [filterTab, setFilterTab] = useState(initialTab);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Get user's skills for filtering
  const userSkills = user?.skills || [];
  
  // Get user's owned posts and combine with all posts
  const userOwnedPosts = mapUserOwnedPosts(user);
  const allPostsWithUserPosts = [...allMockPosts, ...userOwnedPosts];

  const allSkills = Array.from(new Set(allPostsWithUserPosts.flatMap((post) => post.skills)));

  const handleFilterChange = (_event: React.SyntheticEvent, newValue: number) => {
    setFilterTab(newValue);
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const filteredPosts = allPostsWithUserPosts.filter((post) => {
    // Search filter
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Get current user for ownership check
    const currentUser: any = user || JSON.parse(localStorage.getItem('user') || '{}');
    
    // Check if this is the user's own post
    const isMyPost = 
      (currentUser.id && currentUser.id === post.author.id) || 
      (currentUser.firstName && currentUser.lastName && 
       `${currentUser.firstName} ${currentUser.lastName}` === post.author.name) ||
      (currentUser.email && currentUser.email === post.author.name);
    
    // For faculty users, ONLY show their own posts (My Posts tab)
    if (currentUser.role === 'faculty') {
      // Faculty can only see their own posts regardless of tab
      return matchesSearch && isMyPost;
    }
    
    // For student users, continue with normal filtering
    // Tab filter
    let matchesTab = true;
    if (filterTab === 0) {
      // All Posts: exclude user's own posts
      matchesTab = !isMyPost;
    } else if (filterTab === 1) {
      // Skill-based: posts matching selected skills, excluding user's own posts
      const matchesSkills = selectedSkills.length === 0 ||
        selectedSkills.some((skill) => post.skills.includes(skill));
      matchesTab = matchesSkills && !isMyPost;
    } else if (filterTab === 2) {
      // My Posts: ONLY show user's created posts
      matchesTab = isMyPost;
    }

    // For "All Posts" and "Skill-based" tabs, filter by user's skills to show relevant posts
    const matchesUserSkills = (filterTab === 0 || filterTab === 1) ? 
      (userSkills.length === 0 || post.skills.some((postSkill) => userSkills.includes(postSkill))) : 
      true;

    return matchesSearch && matchesTab && matchesUserSkills;
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                Welcome back, {user?.firstName || 'User'}! 👋
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                {user?.role === 'faculty' 
                  ? 'Viewing your created posts'
                  : `Showing opportunities matching your skills: ${userSkills.length > 0 ? userSkills.join(', ') : 'No skills added yet'}`
                }
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/create-post')}
              sx={{
                backgroundColor: '#6C47FF',
                textTransform: 'none',
                px: 3,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#5A3AD6',
                },
              }}
            >
              Create Post
            </Button>
          </Stack>

          {/* Skills Info Banner */}
          {userSkills.length === 0 && user?.role !== 'faculty' && (
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#FEF3C7', border: '1px solid #FBBF24' }}>
              <Typography variant="body2" sx={{ color: '#92400E', fontWeight: 500 }}>
                💡 Tip: Add skills to your profile to see personalized opportunities! 
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/settings/profile')}
                  sx={{ 
                    ml: 1,
                    textTransform: 'none',
                    color: '#6C47FF',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(108, 71, 255, 0.1)',
                    },
                  }}
                >
                  Update Profile
                </Button>
              </Typography>
            </Paper>
          )}
          {/* Search Bar */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <TextField
              fullWidth
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color="#6B7280" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
          </Paper>

          {/* Filter Tabs - Hidden for faculty users */}
          {user?.role !== 'faculty' && (
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
              <Tabs
                value={filterTab}
                onChange={handleFilterChange}
                sx={{
                  borderBottom: '1px solid #E5E7EB',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                  },
                }}
              >
                <Tab label="All Posts" />
                <Tab label="Skill-Based" />
                <Tab label="My Posts" />
              </Tabs>

              {/* Skill Filter (shown only when Skill-Based tab is active) */}
              {filterTab === 1 && (
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Filter size={18} color="#6B7280" />
                    <Typography variant="subtitle2" sx={{ color: '#6B7280' }}>
                      Filter by skills:
                    </Typography>
                  </Stack>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {allSkills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onClick={() => handleSkillToggle(skill)}
                        sx={{
                          backgroundColor: selectedSkills.includes(skill) ? '#6C47FF' : '#F3F4F6',
                          color: selectedSkills.includes(skill) ? '#FFFFFF' : '#111827',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: selectedSkills.includes(skill) ? '#5A3AD6' : '#E5E7EB',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>
          )}

          {/* My Posts Heading for Faculty */}
          {user?.role === 'faculty' && filteredPosts.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
                My Posts
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mt: 0.5 }}>
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </Typography>
            </Box>
          )}

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                No posts found
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                Try adjusting your filters or search terms
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 2.5,
              }}
            >
              {filteredPosts.map((post, index) => {
                // Check if this post belongs to the current user
                const currentUser: any = user || JSON.parse(localStorage.getItem('user') || '{}');
                const isMyPost = 
                  (currentUser.id && currentUser.id === post.author.id) || 
                  currentUser.name === post.author.name ||
                  (currentUser.firstName && currentUser.firstName === post.author.name.split(' ')[0]);
                
                return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      border: '1px solid #E5E7EB',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, pb: 1, flex: 1 }}>
                      <Stack spacing={1.5}>
                        {/* My Post Badge */}
                        {isMyPost && (
                          <Chip
                            label="📌 My Post"
                            size="small"
                            sx={{
                              width: 'fit-content',
                              height: 22,
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              backgroundColor: '#FEF3C7',
                              color: '#D97706',
                              border: '1px solid #FBBF24',
                            }}
                          />
                        )}
                        
                        {/* Title and Author */}
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.3 }}>
                            {post.title}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>
                              by {post.author.name}
                            </Typography>
                            <Chip
                              label={post.author.type}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                backgroundColor: '#EFF6FF',
                                color: '#2563EB',
                              }}
                            />
                          </Stack>
                        </Box>

                        {/* Purpose Chip */}
                        <Chip
                          label={post.purpose}
                          size="small"
                          sx={{
                            width: 'fit-content',
                            height: 22,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            backgroundColor: '#F0FDF4',
                            color: '#16A34A',
                          }}
                        />

                        {/* Description */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#4B5563', 
                            fontSize: '0.85rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {post.description}
                        </Typography>

                        {/* Skills */}
                        <Stack direction="row" flexWrap="wrap" gap={0.5}>
                          {post.skills.slice(0, 3).map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: '#F3F4F6',
                                color: '#374151',
                              }}
                            />
                          ))}
                          {post.skills.length > 3 && (
                            <Chip
                              label={`+${post.skills.length - 3}`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: '#E5E7EB',
                                color: '#6B7280',
                              }}
                            />
                          )}
                        </Stack>

                        {/* Members and Date */}
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Users size={14} color="#6B7280" />
                            <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
                              {post.acceptedMembers}/{post.requiredMembers}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Calendar size={14} color="#6B7280" />
                            <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
                              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </CardContent>

                    {/* Actions */}
                    <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1, flexDirection: 'column' }}>
                      <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                        <Button
                          fullWidth
                          size="small"
                          variant="contained"
                          onClick={() => navigate(`/post/${post.id}`)}
                          sx={{
                            textTransform: 'none',
                            backgroundColor: '#6C47FF',
                            fontSize: '0.85rem',
                            py: 0.75,
                            '&:hover': {
                              backgroundColor: '#5A3AD6',
                            },
                          }}
                        >
                          View
                        </Button>
                        {post.acceptedMembers === post.requiredMembers && (
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            startIcon={<MessageSquare size={16} />}
                            onClick={() => navigate(`/chatroom/${post.id}`)}
                            sx={{
                              textTransform: 'none',
                              borderColor: '#6C47FF',
                              color: '#6C47FF',
                              fontSize: '0.85rem',
                              py: 0.75,
                              '&:hover': {
                                borderColor: '#5A3AD6',
                                backgroundColor: '#F5F3FF',
                              },
                            }}
                          >
                            Chat
                          </Button>
                        )}
                      </Stack>
                      {/* View Matched Candidates Button - Only visible for user's own posts */}
                      {isMyPost && (
                        <Button
                          fullWidth
                          size="small"
                          variant="contained"
                          startIcon={<Users size={16} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/post/${post.id}/candidates`);
                          }}
                          sx={{
                            textTransform: 'none',
                            backgroundColor: '#10B981',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            py: 0.75,
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: '#059669',
                            },
                          }}
                        >
                          🎯 View Matched Candidates ({post.requiredMembers - post.acceptedMembers} needed)
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </motion.div>
              );
              })}
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home;

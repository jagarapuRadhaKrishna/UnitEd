import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Avatar,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { mockPosts } from '../data/mockData';
import {
  ArrowLeft,
  Search,
  Star,
  Briefcase,
  Mail,
  UserPlus,
  Eye,
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  type: 'Student' | 'Faculty';
  department: string;
  matchScore: number;
  skills: { name: string; level: number }[];
  experience: string[];
  projects: number;
  collaborations: number;
  rating: number;
  availability: string;
  bio: string;
}

const CandidateRecommendations: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  // Find the post from mockData
  const postData = mockPosts.find(p => p.id === postId);
  
  // If post not found, show error
  if (!postData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Post not found</Typography>
        <Button onClick={() => navigate('/home')} startIcon={<ArrowLeft />} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  // Extract post data
  const post = {
    id: postData.id,
    title: postData.title,
    requiredSkills: postData.skillRequirements.map(sr => sr.skill),
    requiredMembers: postData.skillRequirements.reduce((sum, sr) => sum + sr.requiredCount, 0),
    acceptedMembers: postData.skillRequirements.reduce((sum, sr) => sum + (sr.acceptedCount || 0), 0),
    authorType: postData.author.type,
  };

  // Generate dynamic candidates based on post skills and author type
  // If author is faculty, show students; if author is student, show both students and faculty
  const generateCandidates = useMemo(() => {
    const skills = post.requiredSkills;
    const isAuthorFaculty = post.authorType === 'faculty';
    
    // Profile images
    const profileImages = {
      madhuri: 'file:///C:/Users/user/Downloads/PIC%203.jpg',
      annanya: 'file:///C:/Users/user/Downloads/PIC2.jpg',
      vedhakshi: 'file:///C:/Users/user/Downloads/PIC1.jpg',
      maaroof: 'file:///C:/Users/user/Documents/me%20in%20swag.jpg',
      krishna: 'file:///C:/Users/user/Documents/pic%20of%20me%20.jpg',
      satwika: 'file:///C:/Users/user/Documents/cute%20of%20me%20.jpg',
      chandrika: 'file:///C:/Users/user/Downloads/6293645.jpg',
    };
    
    // Base candidate pool
    const studentCandidates = [
      {
        id: 's1',
        name: 'Madhuri',
        avatar: profileImages.madhuri,
        type: 'Student' as const,
        department: 'Computer Science',
        year: '3rd Year',
        bio: 'Passionate about technology and innovation. Love working on challenging projects.',
      },
      {
        id: 's2',
        name: 'Annanya',
        avatar: profileImages.annanya,
        type: 'Student' as const,
        department: 'Data Science',
        year: '4th Year',
        bio: 'Data science enthusiast with strong analytical skills. Kaggle competition winner.',
      },
      {
        id: 's3',
        name: 'Vedhakshi',
        avatar: profileImages.vedhakshi,
        type: 'Student' as const,
        department: 'Software Engineering',
        year: '2nd Year',
        bio: 'Full-stack developer with experience in modern web technologies.',
      },
      {
        id: 's4',
        name: 'Maaroof',
        avatar: profileImages.maaroof,
        type: 'Student' as const,
        department: 'Computer Engineering',
        year: '3rd Year',
        bio: 'Hardware and software integration specialist. IoT enthusiast.',
      },
      {
        id: 's5',
        name: 'Krishna',
        avatar: profileImages.krishna,
        type: 'Student' as const,
        department: 'Artificial Intelligence',
        year: '4th Year',
        bio: 'AI researcher focusing on neural networks and deep learning.',
      },
      {
        id: 's6',
        name: 'Satwika',
        avatar: profileImages.satwika,
        type: 'Student' as const,
        department: 'Cybersecurity',
        year: '3rd Year',
        bio: 'Security expert with certifications in ethical hacking.',
      },
      {
        id: 's7',
        name: 'Chandrika',
        avatar: profileImages.chandrika,
        type: 'Student' as const,
        department: 'UI/UX Design',
        year: '2nd Year',
        bio: 'Creative designer with a passion for user-centered design.',
      },
      {
        id: 's8',
        name: 'Madhuri',
        avatar: profileImages.madhuri,
        type: 'Student' as const,
        department: 'Game Development',
        year: '4th Year',
        bio: 'Game developer with expertise in Unity and Unreal Engine.',
      },
    ];

    const facultyCandidates = [
      {
        id: 'f1',
        name: 'Dr. Annanya',
        avatar: profileImages.annanya,
        type: 'Faculty' as const,
        department: 'Computer Science',
        position: 'Associate Professor',
        bio: 'Research focus on machine learning and AI. Published 50+ papers.',
      },
      {
        id: 'f2',
        name: 'Prof. Vedhakshi',
        avatar: profileImages.vedhakshi,
        type: 'Faculty' as const,
        department: 'Data Science',
        position: 'Professor',
        bio: 'Expert in data analytics and statistical modeling. 15 years experience.',
      },
      {
        id: 'f3',
        name: 'Dr. Maaroof',
        avatar: profileImages.maaroof,
        type: 'Faculty' as const,
        department: 'Software Engineering',
        position: 'Assistant Professor',
        bio: 'Specialist in software architecture and design patterns.',
      },
      {
        id: 'f4',
        name: 'Prof. Krishna',
        avatar: profileImages.krishna,
        type: 'Faculty' as const,
        department: 'Cybersecurity',
        position: 'Associate Professor',
        bio: 'Network security and cryptography expert. Former industry consultant.',
      },
    ];

    // Choose candidate pool based on author type
    let candidatePool = isAuthorFaculty ? studentCandidates : [...studentCandidates, ...facultyCandidates];

    // Generate skill matches for each candidate based on post skills
    return candidatePool.map((candidate, index) => {
      // Generate skills that match the post requirements
      const candidateSkills = skills.map((skill, skillIndex) => {
        // Vary skill levels to create realistic match scores
        const baseLevel = 70 + Math.floor(Math.random() * 20);
        const bonus = (index + skillIndex) % 2 === 0 ? 10 : 0;
        return {
          name: skill,
          level: Math.min(95, baseLevel + bonus),
        };
      });

      // Calculate match score based on skill levels
      const matchScore = Math.floor(
        candidateSkills.reduce((sum, s) => sum + s.level, 0) / candidateSkills.length
      );

      // Add relevant experience
      const experience = [
        candidate.type === 'Student' 
          ? `${skills[0]} Project Experience` 
          : `Teaching ${skills[0]}`,
        candidate.type === 'Student'
          ? 'Hackathon Participant'
          : 'Research Publications',
        candidate.type === 'Student'
          ? 'Internship Experience'
          : 'Industry Consultant',
      ];

      return {
        ...candidate,
        matchScore,
        skills: candidateSkills,
        experience,
        projects: 5 + index,
        collaborations: 8 + index * 2,
        rating: 4.5 + (index % 5) * 0.1,
        availability: index % 3 === 0 ? 'Available' : 'Partially Available',
      };
    }).sort((a, b) => b.matchScore - a.matchScore); // Sort by match score
  }, [post.requiredSkills, post.authorType]);

  const recommendedCandidates = generateCandidates;

  const [sentInvitations, setSentInvitations] = useState<Set<string>>(new Set());

  const handleInvite = (candidateId: string) => {
    setSentInvitations(new Set([...sentInvitations, candidateId]));
  };

  const filteredCandidates = recommendedCandidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 80) return '#6C47FF';
    if (score >= 70) return '#F59E0B';
    return '#6B7280';
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', py: 4 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3, color: '#6B7280' }}
          >
            Back
          </Button>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Recommended Candidates
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              AI-powered suggestions for: <strong>{post.title}</strong>
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ backgroundColor: '#F0F9FF', border: '1px solid #BFDBFE' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Positions Open
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {post.requiredMembers - post.acceptedMembers} / {post.requiredMembers}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Recommended
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {recommendedCandidates.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Invitations Sent
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {sentInvitations.size}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Search and Filters */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by name, skills, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color="#6B7280" />
                  </InputAdornment>
                ),
              }}
            />

            <Tabs value={selectedTab} onChange={(_e, v) => setSelectedTab(v)} sx={{ mt: 2 }}>
              <Tab label="All Candidates" />
              <Tab label="Best Match" />
              <Tab label="Most Experienced" />
            </Tabs>
          </Paper>

          {/* Candidates List */}
          <Grid container spacing={3}>
            {filteredCandidates.map((candidate) => (
              <Grid item xs={12} key={candidate.id}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ '&:hover': { boxShadow: 4 }, transition: 'all 0.3s' }}>
                    <CardContent>
                      <Grid container spacing={3}>
                        {/* Avatar and Basic Info */}
                        <Grid item xs={12} md={3}>
                          <Stack alignItems="center" spacing={1}>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    backgroundColor: '#10B981',
                                    border: '2px solid white',
                                  }}
                                />
                              }
                            >
                              <Avatar src={candidate.avatar} sx={{ width: 100, height: 100 }} />
                            </Badge>
                            <Typography variant="h6" fontWeight={600} textAlign="center">
                              {candidate.name}
                            </Typography>
                            <Stack direction="row" spacing={0.5}>
                              <Chip label={candidate.type} size="small" />
                              <Chip label={candidate.availability} size="small" color="success" />
                            </Stack>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Star size={16} fill="#F59E0B" color="#F59E0B" />
                              <Typography variant="body2" fontWeight={600}>
                                {candidate.rating}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>

                        {/* Details */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {candidate.department}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {candidate.bio}
                          </Typography>

                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Skills Match
                          </Typography>
                          <Grid container spacing={1} sx={{ mb: 2 }}>
                            {candidate.skills.map((skill, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                                <Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption">{skill.name}</Typography>
                                    <Typography variant="caption">{skill.level}%</Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={skill.level}
                                    sx={{
                                      height: 6,
                                      borderRadius: 3,
                                      backgroundColor: '#E5E7EB',
                                      '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#6C47FF',
                                      },
                                    }}
                                  />
                                </Box>
                              </Grid>
                            ))}
                          </Grid>

                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Experience
                          </Typography>
                          <Stack spacing={0.5}>
                            {candidate.experience.map((exp, idx) => (
                              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Briefcase size={14} color="#6B7280" />
                                <Typography variant="caption" color="text.secondary">
                                  {exp}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Grid>

                        {/* Match Score and Actions */}
                        <Grid item xs={12} md={3}>
                          <Stack spacing={2} alignItems="center">
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                Match Score
                              </Typography>
                              <Box
                                sx={{
                                  width: 80,
                                  height: 80,
                                  borderRadius: '50%',
                                  border: `4px solid ${getMatchScoreColor(candidate.matchScore)}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mt: 1,
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  fontWeight={700}
                                  sx={{ color: getMatchScoreColor(candidate.matchScore) }}
                                >
                                  {candidate.matchScore}%
                                </Typography>
                              </Box>
                            </Box>

                            <Divider sx={{ width: '100%' }} />

                            <Stack spacing={1} sx={{ width: '100%' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">
                                  Projects
                                </Typography>
                                <Typography variant="caption" fontWeight={600}>
                                  {candidate.projects}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">
                                  Collaborations
                                </Typography>
                                <Typography variant="caption" fontWeight={600}>
                                  {candidate.collaborations}
                                </Typography>
                              </Box>
                            </Stack>

                            <Divider sx={{ width: '100%' }} />

                            <Stack spacing={1} sx={{ width: '100%' }}>
                              <Button
                                variant="contained"
                                fullWidth
                                size="small"
                                startIcon={<UserPlus size={16} />}
                                disabled={sentInvitations.has(candidate.id)}
                                onClick={() => handleInvite(candidate.id)}
                                sx={{
                                  backgroundColor: '#6C47FF',
                                  '&:hover': { backgroundColor: '#5A3AD6' },
                                }}
                              >
                                {sentInvitations.has(candidate.id) ? 'Invited' : 'Invite'}
                              </Button>
                              <Button
                                variant="outlined"
                                fullWidth
                                size="small"
                                startIcon={<Eye size={16} />}
                                onClick={() => navigate(`/profile/${candidate.id}`)}
                                sx={{
                                  borderColor: '#6C47FF',
                                  color: '#6C47FF',
                                  '&:hover': {
                                    borderColor: '#5A3AD6',
                                    backgroundColor: '#F3F4F6',
                                  },
                                }}
                              >
                                View Profile
                              </Button>
                              <Button
                                variant="text"
                                fullWidth
                                size="small"
                                startIcon={<Mail size={16} />}
                                sx={{ color: '#6B7280' }}
                              >
                                Message
                              </Button>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CandidateRecommendations;



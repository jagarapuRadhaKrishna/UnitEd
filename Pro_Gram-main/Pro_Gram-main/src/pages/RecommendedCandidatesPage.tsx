import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Avatar,
  Stack,
  Chip,
  Card,
  CardContent,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserCheck, Eye, Filter } from 'lucide-react';
import { getAllPosts } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { createInvitation } from '../services/invitationService';

interface Candidate {
  id: string;
  name: string;
  avatar?: string;
  role: 'student' | 'faculty';
  department?: string;
  position?: string;
  year?: string;
  cgpa?: string;
  skills: string[];
  matchPercentage: number;
}

const RecommendedCandidatesPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invitedCandidateIds, setInvitedCandidateIds] = useState<Set<string>>(new Set());
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Filter states
  const [matchPercentageRange, setMatchPercentageRange] = useState<number[]>([30, 100]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const allPosts = getAllPosts(user);
  const post = allPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Post not found</Typography>
        <Button onClick={() => navigate('/home')} startIcon={<ArrowLeft />} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  // Check if current user is the post author
  const isAuthor = user?.id === post.author.id;

  if (!isAuthor) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Access Denied</Typography>
        <Typography sx={{ mt: 2 }}>Only the post author can view recommended candidates.</Typography>
        <Button onClick={() => navigate(`/post/${postId}`)} startIcon={<ArrowLeft />} sx={{ mt: 2 }}>
          Back to Post
        </Button>
      </Container>
    );
  }

  // Get matched candidates based on post author type
  const getMatchedCandidates = (): Candidate[] => {
    const postSkills = post.skillRequirements.map(sr => sr.skill.toLowerCase());
    
    // If faculty posted, show only students
    // If student posted, show both students and faculty
    const candidatesByRole = post.author.type === 'faculty' 
      ? getStudentCandidates() 
      : [...getStudentCandidates(), ...getFacultyCandidates()];

    return candidatesByRole.map(candidate => {
      const candidateSkills = candidate.skills.map(s => s.toLowerCase());
      const matchingSkills = candidateSkills.filter(skill => 
        postSkills.some(postSkill => postSkill.includes(skill) || skill.includes(postSkill))
      );
      const matchPercentage = postSkills.length > 0 
        ? Math.round((matchingSkills.length / postSkills.length) * 100)
        : 0;

      return { ...candidate, matchPercentage };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  const getStudentCandidates = (): Candidate[] => {
    return [
      {
        id: 'student-1',
        name: 'Madhuri',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: 'student',
        department: 'Computer Science',
        year: '3rd Year',
        cgpa: '8.9',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
      },
      {
        id: 'student-2',
        name: 'Maroof Khan',
        avatar: 'https://i.pravatar.cc/150?img=12',
        role: 'student',
        department: 'Information Technology',
        year: '4th Year',
        cgpa: '9.2',
        skills: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
      },
      {
        id: 'student-3',
        name: 'vedakshri',
        avatar: 'https://i.pravatar.cc/150?img=9',
        role: 'student',
        department: 'Computer Science',
        year: '2nd Year',
        cgpa: '8.5',
        skills: ['Java', 'Python', 'UI/UX Design', 'React'],
      },
      {
        id: 'student-4',
        name: 'Rahul Sharma',
        avatar: 'https://i.pravatar.cc/150?img=15',
        role: 'student',
        department: 'Computer Science',
        year: '3rd Year',
        cgpa: '9.0',
        skills: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'Kubernetes'],
      },
      {
        id: 'student-5',
        name: 'Priya Patel',
        avatar: 'https://i.pravatar.cc/150?img=26',
        role: 'student',
        department: 'Data Science',
        year: '4th Year',
        cgpa: '9.3',
        skills: ['Python', 'R', 'Machine Learning', 'Data Visualization', 'SQL'],
      },
      {
        id: 'student-6',
        name: 'Arjun Mehta',
        avatar: 'https://i.pravatar.cc/150?img=18',
        role: 'student',
        department: 'Information Technology',
        year: '2nd Year',
        cgpa: '8.7',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'],
      },
      {
        id: 'student-7',
        name: 'Sneha Reddy',
        avatar: 'https://i.pravatar.cc/150?img=24',
        role: 'student',
        department: 'Computer Science',
        year: '3rd Year',
        cgpa: '8.8',
        skills: ['Python', 'Django', 'PostgreSQL', 'REST API', 'Git'],
      },
      {
        id: 'student-8',
        name: 'Karthik Kumar',
        avatar: 'https://i.pravatar.cc/150?img=13',
        role: 'student',
        department: 'AI & ML',
        year: '4th Year',
        cgpa: '9.1',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'],
      },
      {
        id: 'student-9',
        name: 'Ananya Singh',
        avatar: 'https://i.pravatar.cc/150?img=28',
        role: 'student',
        department: 'Computer Science',
        year: '3rd Year',
        cgpa: '8.6',
        skills: ['React Native', 'Flutter', 'Firebase', 'Mobile Development'],
      },
      {
        id: 'student-10',
        name: 'Vivek Joshi',
        avatar: 'https://i.pravatar.cc/150?img=11',
        role: 'student',
        department: 'Information Technology',
        year: '2nd Year',
        cgpa: '8.4',
        skills: ['C++', 'Python', 'Algorithms', 'Data Structures', 'Competitive Programming'],
      },
    ];
  };

  const getFacultyCandidates = (): Candidate[] => {
    return [
      {
        id: 'faculty-1',
        name: 'Satwika ',
        avatar: 'https://i.pravatar.cc/150?img=33',
        role: 'faculty',
        department: 'Computer Science',
        position: 'Associate Professor',
        skills: ['Machine Learning', 'AI', 'Deep Learning', 'Research'],
      },
      {
        id: 'faculty-2',
        name: 'annanya',
        avatar: 'https://i.pravatar.cc/150?img=44',
        role: 'faculty',
        department: 'Information Systems',
        position: 'Assistant Professor',
        skills: ['Data Science', 'Python', 'Statistics', 'R'],
      },
      {
        id: 'faculty-3',
        name: 'Dr. Rajesh Kumar',
        avatar: 'https://i.pravatar.cc/150?img=51',
        role: 'faculty',
        department: 'Computer Science',
        position: 'Professor',
        skills: ['Cloud Computing', 'AWS', 'Azure', 'DevOps', 'Microservices'],
      },
      {
        id: 'faculty-4',
        name: 'Dr. Meera Iyer',
        avatar: 'https://i.pravatar.cc/150?img=47',
        role: 'faculty',
        department: 'Data Science',
        position: 'Associate Professor',
        skills: ['Big Data', 'Hadoop', 'Spark', 'Data Analytics', 'Python'],
      },
      {
        id: 'faculty-5',
        name: 'Prof. Amit Verma',
        avatar: 'https://i.pravatar.cc/150?img=56',
        role: 'faculty',
        department: 'Information Technology',
        position: 'Assistant Professor',
        skills: ['Web Development', 'JavaScript', 'React', 'Node.js', 'Full Stack'],
      },
    ];
  };

  const handleInvite = async (candidateId: string, candidateName: string) => {
    if (!user?.id || !post.id) return;

    try {
      createInvitation(post.id, user.id, candidateId);

      setInvitedCandidateIds(prev => new Set([...prev, candidateId]));
      setSnackbarMessage(`Invitation sent to ${candidateName}`);
      setTimeout(() => setSnackbarMessage(''), 3000);
    } catch (error) {
      console.error('Error sending invitation:', error);
      setSnackbarMessage('Failed to send invitation');
      setTimeout(() => setSnackbarMessage(''), 3000);
    }
  };

  const handleInviteAll = async () => {
    if (!user?.id || !post.id) return;

    try {
      // Get all candidates that haven't been invited yet
      const candidatesToInvite = filteredCandidates.filter(
        candidate => !invitedCandidateIds.has(candidate.id)
      );

      if (candidatesToInvite.length === 0) {
        setSnackbarMessage('All candidates have already been invited');
        setTimeout(() => setSnackbarMessage(''), 3000);
        return;
      }

      // Send invitations to all candidates
      candidatesToInvite.forEach(candidate => {
        createInvitation(post.id, user.id, candidate.id);
      });

      // Update invited candidates
      const newInvitedIds = new Set([
        ...invitedCandidateIds,
        ...candidatesToInvite.map(c => c.id)
      ]);
      setInvitedCandidateIds(newInvitedIds);

      setSnackbarMessage(`Invitations sent to ${candidatesToInvite.length} candidate(s)`);
      setTimeout(() => setSnackbarMessage(''), 3000);
    } catch (error) {
      console.error('Error sending invitations:', error);
      setSnackbarMessage('Failed to send invitations');
      setTimeout(() => setSnackbarMessage(''), 3000);
    }
  };

  const candidates = getMatchedCandidates();

  // Get all unique skills from candidates
  const allSkills = Array.from(new Set(candidates.flatMap(c => c.skills)));

  // Apply filters
  const filteredCandidates = candidates.filter(candidate => {
    // Filter by match percentage
    const matchesPercentage = 
      candidate.matchPercentage >= matchPercentageRange[0] && 
      candidate.matchPercentage <= matchPercentageRange[1];

    // Filter by selected skills (if any skills are selected)
    const matchesSkills = 
      selectedSkills.length === 0 || 
      selectedSkills.some(skill => candidate.skills.includes(skill));

    return matchesPercentage && matchesSkills;
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', py: 4 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 2.5, md: 3 } }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate(`/post/${postId}`)}
            sx={{ mb: 3, color: '#6B7280' }}
          >
            Back to Post
          </Button>

          <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
              Recommended Candidates
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B7280', mb: 2 }}>
              For: <strong>{post.title}</strong>
            </Typography>
            <Chip 
              label={`${filteredCandidates.length} of ${candidates.length} Matches`} 
              sx={{ 
                backgroundColor: '#6C47FF', 
                color: 'white',
                fontWeight: 600,
              }} 
            />
          </Paper>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Filter size={20} color="#6C47FF" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filters
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              {/* Match Percentage Filter */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Match Percentage: {matchPercentageRange[0]}% - {matchPercentageRange[1]}%
                </Typography>
                <Slider
                  value={matchPercentageRange}
                  onChange={(_, newValue) => setMatchPercentageRange(newValue as number[])}
                  valueLabelDisplay="auto"
                  min={30}
                  max={100}
                  sx={{
                    color: '#6C47FF',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#6C47FF',
                    },
                  }}
                />
              </Grid>

              {/* Skills Filter */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Skills</InputLabel>
                  <Select
                    multiple
                    value={selectedSkills}
                    onChange={(e) => setSelectedSkills(e.target.value as string[])}
                    input={<OutlinedInput label="Filter by Skills" />}
                    renderValue={(selected) => (selected as string[]).join(', ')}
                  >
                    {allSkills.map((skill) => (
                      <MenuItem key={skill} value={skill}>
                        <Checkbox checked={selectedSkills.indexOf(skill) > -1} />
                        <ListItemText primary={skill} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 3 }} flexWrap="wrap">
              {/* Clear Filters Button */}
              {(matchPercentageRange[0] !== 30 || matchPercentageRange[1] !== 100 || selectedSkills.length > 0) && (
                <Button
                  onClick={() => {
                    setMatchPercentageRange([30, 100]);
                    setSelectedSkills([]);
                  }}
                  sx={{ color: '#6C47FF' }}
                >
                  Clear All Filters
                </Button>
              )}
              
              {/* Invite All Button */}
              <Button
                variant="contained"
                startIcon={<UserCheck size={18} />}
                onClick={handleInviteAll}
                disabled={filteredCandidates.length === 0 || filteredCandidates.every(c => invitedCandidateIds.has(c.id))}
                sx={{
                  backgroundColor: '#6C47FF',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#5A3AD9',
                  },
                  '&:disabled': {
                    backgroundColor: '#E5E7EB',
                    color: '#9CA3AF',
                  },
                }}
              >
                Invite All
              </Button>
            </Stack>
          </Paper>
        </motion.div>

        {/* Candidates List */}
        {filteredCandidates.length > 0 ? (
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            <Grid 
              container 
              spacing={3}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 3,
                '@media (max-width: 900px)': {
                  gridTemplateColumns: 'repeat(2, 1fr)',
                },
                '@media (max-width: 600px)': {
                  gridTemplateColumns: '1fr',
                },
              }}
            >
              {filteredCandidates.map((candidate, index) => (
                <Box key={candidate.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card sx={{ 
                      borderRadius: 2, 
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                      height: '185px',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#FFFFFF',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#6C47FF',
                        boxShadow: '0 4px 8px rgba(108, 71, 255, 0.15)',
                        transform: 'translateY(-2px)',
                      },
                    }}>
                    <CardContent sx={{ 
                      flex: 1,
                      display: 'flex', 
                      flexDirection: 'column',
                      p: 1.5,
                      '&:last-child': { pb: 1.5 },
                    }}>
                      {/* Header with Avatar and Info */}
                      <Stack direction="row" spacing={1.2} alignItems="flex-start" sx={{ mb: 1 }}>
                        <Avatar
                          src={candidate.avatar}
                          sx={{ 
                            width: 40, 
                            height: 50, 
                            flexShrink: 0,
                            border: '2px solid #6C47FF',
                          }}
                        >
                          {candidate.name.charAt(0)}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#1A202C',
                              fontSize: '0.825rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              mb: 0.15,
                              lineHeight: 1.1,
                            }}
                          >
                            {candidate.name}
                          </Typography>
                          
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#4A5568', 
                              display: 'block',
                              fontSize: '0.6rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              mb: 0.15,
                              lineHeight: 1.1,
                            }}
                          >
                            {candidate.role === 'student' 
                              ? `${candidate.year} • ${candidate.department}`
                              : `${candidate.position} • ${candidate.department}`
                            }
                          </Typography>

                          {/* CGPA for students - Fixed height to maintain consistency */}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#2D3748',
                              fontWeight: 600,
                              fontSize: '0.6rem',
                              lineHeight: 1.1,
                              minHeight: '10px',
                              display: 'block',
                            }}
                          >
                            {candidate.role === 'student' && candidate.cgpa ? `CGPA: ${candidate.cgpa}` : '\u00A0'}
                          </Typography>
                        </Box>

                        {/* Match Badge */}
                        <Box
                          sx={{
                            backgroundColor: candidate.matchPercentage >= 70 ? '#10B981' : '#F59E0B',
                            color: '#FFFFFF',
                            borderRadius: 1,
                            px: 0.75,
                            py: 0.25,
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            flexShrink: 0,
                            lineHeight: 1,
                          }}
                        >
                          {candidate.matchPercentage}%
                        </Box>
                      </Stack>

                      {/* Skills */}
                      <Box sx={{ mb: 0.75, minHeight: 36, maxHeight: 36, overflow: 'hidden' }}>
                        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.4 }}>
                          {candidate.skills.slice(0, 4).map((skill) => (
                            <Box
                              key={skill}
                              sx={{
                                backgroundColor: '#F3F4F6',
                                border: '1px solid #E5E7EB',
                                borderRadius: 0.75,
                                px: 0.75,
                                py: 0.25,
                                fontSize: '0.6rem',
                                color: '#374151',
                                fontWeight: 600,
                                lineHeight: 1,
                              }}
                            >
                              {skill}
                            </Box>
                          ))}
                          {candidate.skills.length > 4 && (
                            <Box
                              sx={{
                                backgroundColor: '#E5E7EB',
                                borderRadius: 0.75,
                                px: 0.75,
                                py: 0.25,
                                fontSize: '0.6rem',
                                color: '#4B5563',
                                fontWeight: 700,
                                lineHeight: 1,
                              }}
                            >
                              +{candidate.skills.length - 4}
                            </Box>
                          )}
                        </Stack>
                      </Box>

                      {/* Action Buttons */}
                      <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/candidate/${candidate.id}`, { state: { postId: post.id } })}
                          fullWidth
                          sx={{
                            borderColor: '#D1D5DB',
                            borderWidth: 1,
                            color: '#4B5563',
                            fontSize: '0.65rem',
                            py: 0.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            minHeight: 'auto',
                            '&:hover': {
                              borderColor: '#6C47FF',
                              borderWidth: 1,
                              backgroundColor: '#F9FAFB',
                              color: '#6C47FF',
                            },
                          }}
                        >
                          View
                        </Button>

                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleInvite(candidate.id, candidate.name)}
                          disabled={invitedCandidateIds.has(candidate.id)}
                          fullWidth
                          sx={{
                            backgroundColor: invitedCandidateIds.has(candidate.id) ? '#9CA3AF' : '#6C47FF',
                            color: '#FFFFFF',
                            fontSize: '0.65rem',
                            py: 0.5,
                            fontWeight: 700,
                            textTransform: 'none',
                            minHeight: 'auto',
                            boxShadow: 'none',
                            '&:hover': {
                              backgroundColor: invitedCandidateIds.has(candidate.id) ? '#9CA3AF' : '#5A3AD6',
                              boxShadow: 'none',
                            },
                            '&:disabled': {
                              backgroundColor: '#9CA3AF',
                              color: '#FFFFFF',
                            },
                          }}
                        >
                          {invitedCandidateIds.has(candidate.id) ? 'Invited ✓' : 'Invite'}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
            </Grid>
          </Box>
        ) : (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#6B7280' }}>
              No matching candidates found
            </Typography>
          </Paper>
        )}

        {/* Snackbar Message */}
        {snackbarMessage && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              backgroundColor: '#10B981',
              color: 'white',
              px: 3,
              py: 2,
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            {snackbarMessage}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default RecommendedCandidatesPage;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Avatar,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Checkbox,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Grid,
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllPosts } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { createInvitation, getPostInvitations } from '../services/invitationService';
import { getUserApplications } from '../services/applicationService';
import {
  ArrowLeft,
  Users,
  Calendar,
  Target,
  Award,
  CheckCircle,
  Upload,
  Send,
  Mail,
  Star,
  Briefcase,
  UserCheck,
  MessageSquare,
} from 'lucide-react';

const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [openForwardDialog, setOpenForwardDialog] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [forwardMessage, setForwardMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Application form fields
  const [experience, setExperience] = useState('');
  const [relevantProjects, setRelevantProjects] = useState('');
  const [skillProficiency, setSkillProficiency] = useState('');
  const [motivation, setMotivation] = useState('');
  const [availability, setAvailability] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // Invitation state
  const [invitedCandidateIds, setInvitedCandidateIds] = useState<Set<string>>(new Set());
  const [loadingInvitations, setLoadingInvitations] = useState(false);

  // Get all posts including user-specific ones
  const allPosts = getAllPosts(user);
  
  // Find the actual post based on ID
  const postData = allPosts.find(p => p.id === id);
  
  // If post not found, use first post as fallback or show error
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

  // Mock post data for display - extend the mockPost data
  const post = {
    id: postData.id,
    title: postData.title,
    description: postData.description,
    fullDescription: postData.description + ' This is an exciting opportunity to collaborate and learn new skills while contributing to meaningful work.',
    author: {
      name: postData.author.name,
      type: postData.author.type === 'faculty' ? 'Faculty' : 'Student',
      department: postData.author.type === 'faculty' ? 'Computer Science' : undefined,
      avatar: postData.author.avatar,
    },
    purpose: postData.purpose,
    skills: postData.skillRequirements.map(sr => sr.skill),
    requiredMembers: postData.skillRequirements.reduce((sum, sr) => sum + sr.requiredCount, 0),
    acceptedMembers: postData.skillRequirements.reduce((sum, sr) => sum + (sr.acceptedCount || 0), 0),
    applicants: postData.applications?.length || 0,
    status: postData.status === 'active' ? 'Open' : 'Closed',
    duration: '6 months',
    commitment: '10-15 hours/week',
    startDate: '2024-02-01',
    createdAt: '2024-01-15',
    requirements: [
      'Strong programming skills in Python',
      'Understanding of machine learning fundamentals',
      'Experience with deep learning frameworks',
      'Good communication and teamwork skills',
      'Commitment for the full duration',
    ],
    deliverables: [
      'Research paper submission',
      'Working prototype/demo',
      'Weekly progress reports',
      'Final presentation',
    ],
  };

  const handleApply = async () => {
    if (!user?.id) {
      setSnackbar({ open: true, message: 'You must be logged in to apply', severity: 'error' });
      return;
    }

    try {
      const { createApplication } = await import('../services/applicationService');
      
      await createApplication({
        postId: post.id,
        applicantId: user.id,
        coverLetter: motivation,
        resume: resumeFile ? await fileToBase64(resumeFile) : undefined,
        answers: [
          { question: 'Experience', answer: experience },
          { question: 'Relevant Projects', answer: relevantProjects },
          { question: 'Skill Proficiency', answer: skillProficiency },
          { question: 'Availability', answer: availability },
        ],
      });

      setHasApplied(true);
      setOpenApplyDialog(false);
      
      // Reset form
      setExperience('');
      setRelevantProjects('');
      setSkillProficiency('');
      setMotivation('');
      setAvailability('');
      setApplicationMessage('');
      setResumeFile(null);
      
      setSnackbar({ 
        open: true, 
        message: 'Application submitted successfully!', 
        severity: 'success' 
      });
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to submit application', 
        severity: 'error' 
      });
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
    }
  };

  // Check if current user is the post author
  // Use multiple checks to handle different data structures
  const isAuthor = user?.id === postData.author.id || 
    user?.email === postData.author.name || 
    `${user?.firstName} ${user?.lastName}` === postData.author.name ||
    user?.firstName === postData.author.name.split(' ')[0];

  // Debug logging
  console.log('Post Author:', postData.author);
  console.log('Current User:', user);
  console.log('Is Author:', isAuthor);

  // Load existing invitations
  useEffect(() => {
    if (isAuthor && post.id && user?.id) {
      const invitations = getPostInvitations(post.id);
      const invitedIds = new Set(invitations.map(inv => inv.inviteeId));
      setInvitedCandidateIds(invitedIds);
    }
  }, [isAuthor, post.id, user?.id]);

  // Check if user has already applied (for students)
  useEffect(() => {
    if (user?.id && post.id) {
      const userApps = getUserApplications(user.id);
      const hasAppliedToPost = userApps.some((app: any) => app.postId === post.id);
      setHasApplied(hasAppliedToPost);
    }
  }, [user?.id, post.id]);

  // Handle invite candidate
  const handleInvite = async (candidateId: string) => {
    if (!user?.id || !isAuthor) {
      setSnackbar({ open: true, message: 'Only post authors can send invitations', severity: 'error' });
      return;
    }

    setLoadingInvitations(true);
    try {
      await createInvitation(post.id, user.id, candidateId);
      setInvitedCandidateIds(prev => new Set([...prev, candidateId]));
      setSnackbar({ open: true, message: 'Invitation sent successfully!', severity: 'success' });
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Failed to send invitation', severity: 'error' });
    } finally {
      setLoadingInvitations(false);
    }
  };

  // Get skill-matched users for recommended candidates (enhanced with dummy data)
  const getMatchedUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const postSkills = post.skills;
    const postAuthorType = post.author.type; // 'Faculty' or 'Student'
    
    // Determine which user types to show based on post author
    // If faculty created the post, show only students
    // If student created the post, show both students and faculty
    const allowedRoles = postAuthorType === 'Faculty' 
      ? ['student'] 
      : ['student', 'faculty'];
    
    // Filter users who have matching skills and appropriate role
    const matchedUsers = registeredUsers.filter((regUser: any) => {
      // Don't show the current user
      if (regUser.id === user?.id) return false;
      
      // Check if user role is allowed
      if (!allowedRoles.includes(regUser.role)) return false;
      
      const userSkills = regUser.skills || [];
      const matchingSkills = postSkills.filter((skill: string) => 
        userSkills.some((userSkill: string) => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      
      return matchingSkills.length > 0;
    });
    
    // Add dummy recommended candidates for showcase
    const dummyStudents = [
      {
        id: '1',
        name: 'Akhil Satish',
        email: 'akhil.satish@anits.edu.in',
        role: 'student',
        skills: postSkills.slice(0, 3),
        avatar: 'AS',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        cgpa: '9.2',
        experience: '2 years in web development',
        projects: 3,
        achievements: ['Best Project Award 2024', 'Hackathon Winner'],
        bio: 'Passionate full-stack developer with experience in React and Node.js. Looking for research opportunities.',
        github: 'https://github.com/akhilsatish',
        linkedin: 'https://linkedin.com/in/akhil-satish',
        portfolio: 'https://akhilsatish.dev',
        matchScore: 95,
      },
      {
        id: '2',
        name: 'Annanya',
        email: 'annanya@anits.edu.in',
        role: 'student',
        skills: [...postSkills.slice(1, 3), 'Docker', 'AWS'],
        avatar: 'A',
        department: 'Electronics & Communication Engineering',
        year: '4th Year',
        cgpa: '8.9',
        experience: 'Intern at Tech Corp',
        projects: 5,
        achievements: ['Google Code Jam Finalist', 'Published Research Paper'],
        bio: 'Final year student specializing in machine learning and cloud technologies.',
        github: 'https://github.com/annanya',
        linkedin: 'https://linkedin.com/in/annanya',
        portfolio: 'https://annanya.tech',
        matchScore: 88,
      },
      {
        id: '3',
        name: 'Satwika',
        email: 'satwika@anits.edu.in',
        role: 'student',
        skills: postSkills.slice(0, 2),
        avatar: 'S',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        cgpa: '9.5',
        experience: '3 internships completed',
        projects: 7,
        achievements: ['Smart India Hackathon Winner', 'Dean\'s List'],
        bio: 'Enthusiastic about AI/ML and data science. Active contributor to open source.',
        github: 'https://github.com/satwika',
        linkedin: 'https://linkedin.com/in/satwika',
        portfolio: 'https://satwika.dev',
        matchScore: 92,
      },
      {
        id: '4',
        name: 'Madhuri',
        email: 'madhuri@anits.edu.in',
        role: 'student',
        skills: [...postSkills, 'Kubernetes'],
        avatar: 'M',
        department: 'Information Technology',
        year: '4th Year',
        cgpa: '8.7',
        experience: 'Teaching Assistant for Web Dev course',
        projects: 4,
        achievements: ['ACM ICPC Regionalist', 'Open Source Contributor'],
        bio: 'Backend developer with strong problem-solving skills. Love building scalable systems.',
        github: 'https://github.com/madhuri',
        linkedin: 'https://linkedin.com/in/madhuri',
        portfolio: 'https://madhuri.dev',
        matchScore: 85,
      },
    ];

    // Add dummy faculty candidates if student is the author
    const dummyFaculty = postAuthorType !== 'Faculty' ? [
      {
        id: 'f1',
        name: 'Dr. Jennifer Smith',
        email: 'j.smith@anits.edu.in',
        role: 'faculty',
        skills: postSkills,
        avatar: 'JS',
        department: 'Computer Science & Engineering',
        position: 'Associate Professor',
        experience: '12 years in academia and research',
        projects: 15,
        achievements: ['Best Teacher Award 2023', 'Published 40+ Research Papers'],
        bio: 'Expert in AI/ML with focus on deep learning applications. Mentor for multiple student projects.',
        github: 'https://github.com/drjsmith',
        linkedin: 'https://linkedin.com/in/dr-jennifer-smith',
        portfolio: 'https://drjsmith.edu',
        matchScore: 93,
      },
      {
        id: 'f2',
        name: 'Prof. Rajesh Kumar',
        email: 'r.kumar@anits.edu.in',
        role: 'faculty',
        skills: postSkills.slice(0, 2),
        avatar: 'RK',
        department: 'Information Technology',
        position: 'Professor',
        experience: '18 years teaching and research',
        projects: 20,
        achievements: ['Excellence in Research Award', 'Department Head'],
        bio: 'Specializing in software engineering and web technologies. Passionate about collaborative projects.',
        github: 'https://github.com/profrkumar',
        linkedin: 'https://linkedin.com/in/prof-rajesh-kumar',
        portfolio: 'https://profrkumar.edu',
        matchScore: 87,
      },
    ] : [];

    // Filter dummy candidates based on post author type
    const filteredDummyStudents = allowedRoles.includes('student') ? dummyStudents : [];
    const filteredDummyFaculty = allowedRoles.includes('faculty') ? dummyFaculty : [];
    
    // Combine real matched users with dummy candidates
    const realUsers = matchedUsers.map((u: any) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      role: u.role,
      skills: u.skills || [],
      avatar: u.profilePicture || `${u.firstName[0]}${u.lastName[0]}`,
      department: u.department || 'Computer Science',
      year: u.role === 'student' ? (u.year || '3rd Year') : undefined,
      position: u.role === 'faculty' ? (u.position || 'Professor') : undefined,
      cgpa: u.role === 'student' ? (u.cgpa || '8.5') : undefined,
      experience: u.experience || (u.role === 'faculty' ? '10+ years' : 'Student'),
      projects: u.projects?.length || 0,
      achievements: u.achievements || [],
      bio: u.bio || (u.role === 'faculty' ? 'Faculty at ANITS' : 'Student at ANITS'),
      github: u.github,
      linkedin: u.linkedin,
      portfolio: u.portfolio,
      matchScore: calculateMatchScore(u.skills || [], postSkills),
    }));
    
    // Sort by match score
    return [...realUsers, ...filteredDummyStudents, ...filteredDummyFaculty].sort((a, b) => b.matchScore - a.matchScore);
  };

  const calculateMatchScore = (userSkills: string[], postSkills: string[]) => {
    const matchingSkills = postSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    return Math.min(100, (matchingSkills.length / postSkills.length) * 100 + Math.random() * 10);
  };

  const handleViewCandidate = (candidate: any) => {
    navigate(`/candidate/${candidate.id}`);
  };

  const handleForwardToUsers = () => {
    if (selectedUsers.length === 0) {
      setSnackbar({ open: true, message: 'Please select at least one user', severity: 'error' });
      return;
    }

    // Create chatroom or send message to selected users
    // For now, we'll just show a success message
    setSnackbar({ 
      open: true, 
      message: `Post forwarded to ${selectedUsers.length} user(s) successfully!`, 
      severity: 'success' 
    });
    
    setOpenForwardDialog(false);
    setSelectedUsers([]);
    setForwardMessage('');
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const progress = (post.acceptedMembers / post.requiredMembers) * 100;
  const isTeamComplete = post.acceptedMembers === post.requiredMembers;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="md" sx={{ pt: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => {
              if (isAuthor) {
                navigate('/home', { state: { activeTab: 2 } }); // Tab 2 is "My Posts"
              } else {
                navigate(-1);
              }
            }}
            sx={{
              mb: 2,
              textTransform: 'none',
              color: '#6B7280',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#6C47FF',
              },
            }}
          >
            {isAuthor ? 'Back to My Posts' : 'Back to Posts'}
          </Button>

          {/* Main Card */}
          <Paper sx={{ p: 4, borderRadius: 2, mb: 3 }}>
            {/* Header */}
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#6C47FF',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                {post.author.avatar}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#111827' }}>
                  {post.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    By {post.author.name}
                  </Typography>
                  <Chip
                    label={post.author.type}
                    size="small"
                    sx={{
                      height: 22,
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                    }}
                  />
                  <Chip
                    label={post.author.department}
                    size="small"
                    sx={{
                      height: 22,
                      backgroundColor: '#F3F4F6',
                      color: '#374151',
                    }}
                  />
                </Stack>
              </Box>
              <Chip
                label={post.purpose}
                sx={{
                  height: 32,
                  fontWeight: 600,
                  backgroundColor: '#F0FDF4',
                  color: '#16A34A',
                }}
              />
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
                Project Overview
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', lineHeight: 1.7, mb: 2 }}>
                {post.description}
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', lineHeight: 1.7 }}>
                {post.fullDescription}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Details Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 3,
                mb: 3,
              }}
            >
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Users size={20} color="#6C47FF" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                    Team Size
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#6B7280', pl: 4 }}>
                  {post.acceptedMembers}/{post.requiredMembers} members
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    ml: 4,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#E5E7EB',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: isTeamComplete ? '#10B981' : '#6C47FF',
                    },
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Target size={20} color="#6C47FF" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                    Duration
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#6B7280', pl: 4 }}>
                  {post.duration}
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Calendar size={20} color="#6C47FF" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                    Start Date
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#6B7280', pl: 4 }}>
                  {new Date(post.startDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircle size={20} color="#6C47FF" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                    Commitment
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: '#6B7280', pl: 4 }}>
                  {post.commitment}
                </Typography>
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Required Skills */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Award size={20} color="#6C47FF" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                  Required Skills
                </Typography>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {post.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    sx={{
                      backgroundColor: '#F5F3FF',
                      color: '#6C47FF',
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Requirements */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
                Requirements
              </Typography>
              <Stack spacing={1}>
                {post.requirements.map((req, index) => (
                  <Stack key={index} direction="row" spacing={1}>
                    <Typography sx={{ color: '#6C47FF' }}>•</Typography>
                    <Typography variant="body2" sx={{ color: '#4B5563' }}>
                      {req}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            {/* Deliverables */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
                Expected Deliverables
              </Typography>
              <Stack spacing={1}>
                {post.deliverables.map((item, index) => (
                  <Stack key={index} direction="row" spacing={1}>
                    <Typography sx={{ color: '#10B981' }}>✓</Typography>
                    <Typography variant="body2" sx={{ color: '#4B5563' }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              {isAuthor ? (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Users size={20} />}
                  onClick={() => navigate(`/post/${post.id}/candidates`)}
                  sx={{
                    backgroundColor: '#6C47FF',
                    textTransform: 'none',
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#5A3AD6',
                    },
                  }}
                >
                  View Suggested Candidates ({post.requiredMembers - post.acceptedMembers} positions open)
                </Button>
              ) : isTeamComplete ? (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<MessageSquare size={20} />}
                  onClick={() => navigate(`/chatroom/${post.id}`)}
                  sx={{
                    backgroundColor: '#6C47FF',
                    textTransform: 'none',
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#5A3AD6',
                    },
                  }}
                >
                  Join Team Chat
                </Button>
              ) : (
                <>
                  {/* Post Author: Show button to view recommended candidates */}
                  {isAuthor ? (
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/post/${post.id}/candidates`)}
                      sx={{
                        flex: 1,
                        backgroundColor: '#6C47FF',
                        color: 'white',
                        py: 1.5,
                        px: 4,
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#5A3AD6',
                        },
                      }}
                    >
                      View Recommended Candidates
                    </Button>
                  ) : user?.role === 'faculty' ? (
                    /* Faculty users (non-authors) cannot apply - show message */
                    <Box sx={{ textAlign: 'center', flex: 1, py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Faculty members can create posts but cannot apply to them
                      </Typography>
                    </Box>
                  ) : (
                    /* Students (non-authors): Show Apply button */
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={hasApplied ? <CheckCircle size={20} /> : undefined}
                      onClick={() => !hasApplied && setOpenApplyDialog(true)}
                      disabled={hasApplied}
                      sx={{
                        backgroundColor: hasApplied ? '#10B981' : '#6C47FF',
                        textTransform: 'none',
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: hasApplied ? '#10B981' : '#5A3AD6',
                        },
                        '&:disabled': {
                          backgroundColor: '#10B981',
                          color: '#FFFFFF',
                          opacity: 1,
                        },
                      }}
                    >
                      {hasApplied ? 'Applied' : 'Apply Now'}
                    </Button>
                  )}
                </>
              )}
              <Button
                variant="outlined"
                onClick={() => navigate('/home')}
                sx={{
                  borderColor: '#6C47FF',
                  color: '#6C47FF',
                  textTransform: 'none',
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#5A3AD6',
                    backgroundColor: '#F5F3FF',
                  },
                }}
              >
                Browse More
              </Button>
            </Stack>
          </Paper>

          {/* Application Dialog */}
          <Dialog open={openApplyDialog} onClose={() => setOpenApplyDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Apply to {post.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mt: 0.5 }}>
                Please provide detailed information about your background and experience
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 1 }}>
                {/* Question 1: Years of Experience */}
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600, color: '#111827' }}>
                    1. How many years of experience do you have with the required skills?
                  </FormLabel>
                  <Select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Select experience level</MenuItem>
                    <MenuItem value="less-than-1">Less than 1 year</MenuItem>
                    <MenuItem value="1-2">1-2 years</MenuItem>
                    <MenuItem value="2-3">2-3 years</MenuItem>
                    <MenuItem value="3-5">3-5 years</MenuItem>
                    <MenuItem value="5-plus">5+ years</MenuItem>
                  </Select>
                </FormControl>

                {/* Question 2: Skill Proficiency */}
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600, color: '#111827' }}>
                    2. Rate your proficiency in the key skills: {post.skills.slice(0, 3).join(', ')}
                  </FormLabel>
                  <Select
                    value={skillProficiency}
                    onChange={(e) => setSkillProficiency(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Select proficiency level</MenuItem>
                    <MenuItem value="beginner">Beginner - Still learning the basics</MenuItem>
                    <MenuItem value="intermediate">Intermediate - Can work independently</MenuItem>
                    <MenuItem value="advanced">Advanced - Can mentor others</MenuItem>
                    <MenuItem value="expert">Expert - Industry-recognized proficiency</MenuItem>
                  </Select>
                </FormControl>

                {/* Question 3: Relevant Projects */}
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600, color: '#111827' }}>
                    3. Describe 1-2 relevant projects you've worked on that relate to this opportunity
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Describe your relevant projects, technologies used, and your role..."
                    value={relevantProjects}
                    onChange={(e) => setRelevantProjects(e.target.value)}
                  />
                </FormControl>

                {/* Question 4: Motivation */}
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600, color: '#111827' }}>
                    4. Why are you interested in this {post.purpose.toLowerCase()} project?
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Share your motivation and what you hope to gain from this experience..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                  />
                </FormControl>

                {/* Question 5: Availability */}
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600, color: '#111827' }}>
                    5. What is your weekly time commitment availability?
                  </FormLabel>
                  <Select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Select availability</MenuItem>
                    <MenuItem value="5-10">5-10 hours/week</MenuItem>
                    <MenuItem value="10-15">10-15 hours/week</MenuItem>
                    <MenuItem value="15-20">15-20 hours/week</MenuItem>
                    <MenuItem value="20-plus">20+ hours/week</MenuItem>
                  </Select>
                </FormControl>

                {/* Resume Upload */}
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600, color: '#111827' }}>
                    Upload Resume/CV (Optional)
                  </FormLabel>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Upload size={20} />}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#E5E7EB',
                      color: '#6B7280',
                      justifyContent: 'flex-start',
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#6C47FF',
                        backgroundColor: '#F5F3FF',
                      },
                    }}
                  >
                    {resumeFile ? resumeFile.name : 'Choose file (PDF, DOC, DOCX)'}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {resumeFile && (
                    <Typography variant="caption" sx={{ color: '#10B981', mt: 1 }}>
                      ✓ File uploaded: {resumeFile.name}
                    </Typography>
                  )}
                </FormControl>

                {/* Additional Message */}
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1, fontWeight: 600, color: '#111827' }}>
                    Additional Message (Optional)
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Any additional information you'd like to share..."
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                  />
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={() => {
                  setOpenApplyDialog(false);
                  // Reset form
                  setExperience('');
                  setRelevantProjects('');
                  setSkillProficiency('');
                  setMotivation('');
                  setAvailability('');
                  setApplicationMessage('');
                  setResumeFile(null);
                }}
                sx={{
                  textTransform: 'none',
                  color: '#6B7280',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                variant="contained"
                disabled={!experience || !skillProficiency || !relevantProjects || !motivation || !availability}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#6C47FF',
                  '&:hover': {
                    backgroundColor: '#5A3AD6',
                  },
                }}
              >
                Submit Application
              </Button>
            </DialogActions>
          </Dialog>

          {/* Candidate Profile Dialog - Removed (Now using dedicated CandidateProfile page at /candidate/:id) */}

          {/* Forward to Matched Users Dialog - For Faculty (Keep for backward compatibility) */}
          <Dialog open={openForwardDialog} onClose={() => setOpenForwardDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              Forward Post to Matched Students
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                Select students whose skills match this post to forward via chat
              </Typography>
              
              <List sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid #E5E7EB', borderRadius: 1, mb: 2 }}>
                {getMatchedUsers().map((matchedUser: any) => (
                  <ListItem
                    key={matchedUser.id}
                    onClick={() => toggleUserSelection(matchedUser.id)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#F9FAFB' },
                      borderBottom: '1px solid #F3F4F6',
                    }}
                  >
                    <Checkbox
                      checked={selectedUsers.includes(matchedUser.id)}
                      sx={{ mr: 1 }}
                    />
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: '#6C47FF' }}>
                        {matchedUser.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={matchedUser.name}
                      secondary={
                        <>
                          <Typography variant="caption" display="block" sx={{ color: '#6B7280' }}>
                            {matchedUser.email}
                          </Typography>
                          <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
                            {matchedUser.skills.slice(0, 3).map((skill: string) => (
                              <Chip key={skill} label={skill} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                            ))}
                            {matchedUser.skills.length > 3 && (
                              <Chip label={`+${matchedUser.skills.length - 3}`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                            )}
                          </Stack>
                        </>
                      }
                    />
                  </ListItem>
                ))}
                {getMatchedUsers().length === 0 && (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      No students found with matching skills
                    </Typography>
                  </Box>
                )}
              </List>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Message (optional)"
                placeholder="Add a personalized message..."
                value={forwardMessage}
                onChange={(e) => setForwardMessage(e.target.value)}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                onClick={() => {
                  setOpenForwardDialog(false);
                  setSelectedUsers([]);
                  setForwardMessage('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleForwardToUsers}
                variant="contained"
                startIcon={<Send size={18} />}
                disabled={selectedUsers.length === 0}
                sx={{
                  backgroundColor: '#6C47FF',
                  '&:hover': { backgroundColor: '#5A3AD6' },
                }}
              >
                Forward to {selectedUsers.length} Student{selectedUsers.length !== 1 ? 's' : ''}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PostDetailPage;

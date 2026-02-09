import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Stack,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle,
  XCircle,
  MessageCircle,
  Star,
  Mail,
  Phone,
  Award,
} from 'lucide-react';
import { ThemeProvider } from '@mui/material/styles';
import unitedTheme from '../theme/unitedTheme';

interface Applicant {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  skills: string[];
  matchScore: number;
  isAIRecommended: boolean;
  appliedDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  experience: number;
  portfolio?: string;
}

interface OpportunityPost {
  id: string;
  title: string;
  purpose: 'Research' | 'Project' | 'Hackathon';
  description: string;
  requiredSkills: string[];
  requiredMembers: number;
  acceptedMembers: number;
  applicants: Applicant[];
  postedDate: string;
  deadline: string;
  chatroomEnabled: boolean;
  chatroomId?: string;
}

// Mock data
const mockPosts: OpportunityPost[] = [
  {
    id: '1',
    title: 'AI-Powered Healthcare Chatbot Development',
    purpose: 'Project',
    description: 'Building an AI chatbot for patient preliminary diagnosis.',
    requiredSkills: ['Python', 'Machine Learning', 'NLP', 'Flask'],
    requiredMembers: 4,
    acceptedMembers: 3,
    postedDate: '2025-11-05',
    deadline: '2025-11-20',
    chatroomEnabled: false,
    applicants: [
      {
        id: '1',
        name: 'Amit Sharma',
        email: 'amit.sharma.csd@anits.edu.in',
        rollNumber: 'A00000000001',
        department: 'Computer Science',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'NLP'],
        matchScore: 95,
        isAIRecommended: true,
        appliedDate: '2025-11-06',
        status: 'Accepted',
        experience: 2,
        portfolio: 'https://amit-portfolio.com',
      },
      {
        id: '2',
        name: 'Priya Reddy',
        email: 'priya.reddy.csd@anits.edu.in',
        rollNumber: 'A00000000002',
        department: 'Computer Science',
        skills: ['Python', 'Flask', 'React', 'NLP'],
        matchScore: 88,
        isAIRecommended: true,
        appliedDate: '2025-11-06',
        status: 'Accepted',
        experience: 1,
      },
      {
        id: '3',
        name: 'Rahul Kumar',
        email: 'rahul.kumar.cse@anits.edu.in',
        rollNumber: 'A00000000003',
        department: 'Computer Science',
        skills: ['Java', 'Spring Boot', 'MySQL'],
        matchScore: 45,
        isAIRecommended: false,
        appliedDate: '2025-11-07',
        status: 'Pending',
        experience: 1,
      },
      {
        id: '4',
        name: 'Sneha Patel',
        email: 'sneha.patel.csd@anits.edu.in',
        rollNumber: 'A00000000004',
        department: 'Computer Science',
        skills: ['Python', 'Machine Learning', 'PyTorch', 'Flask'],
        matchScore: 92,
        isAIRecommended: true,
        appliedDate: '2025-11-07',
        status: 'Accepted',
        experience: 2,
        portfolio: 'https://sneha-ml.com',
      },
      {
        id: '5',
        name: 'Vikram Singh',
        email: 'vikram.singh.csd@anits.edu.in',
        rollNumber: 'A00000000005',
        department: 'Computer Science',
        skills: ['Python', 'Data Science', 'NLP'],
        matchScore: 78,
        isAIRecommended: true,
        appliedDate: '2025-11-07',
        status: 'Pending',
        experience: 1,
      },
    ],
  },
  {
    id: '2',
    title: 'Smart Campus IoT System',
    purpose: 'Research',
    description: 'Research on IoT sensors for campus automation.',
    requiredSkills: ['Arduino', 'IoT', 'Python', 'MQTT'],
    requiredMembers: 3,
    acceptedMembers: 3,
    postedDate: '2025-11-03',
    deadline: '2025-11-25',
    chatroomEnabled: true,
    chatroomId: 'chat-iot-001',
    applicants: [
      {
        id: '6',
        name: 'Ananya Iyer',
        email: 'ananya.iyer.ece@anits.edu.in',
        rollNumber: 'A00000000006',
        department: 'Electronics',
        skills: ['Arduino', 'IoT', 'Embedded Systems', 'Python'],
        matchScore: 90,
        isAIRecommended: true,
        appliedDate: '2025-11-04',
        status: 'Accepted',
        experience: 2,
      },
      {
        id: '7',
        name: 'Karthik Menon',
        email: 'karthik.menon.ece@anits.edu.in',
        rollNumber: 'A00000000007',
        department: 'Electronics',
        skills: ['IoT', 'MQTT', 'Raspberry Pi', 'Python'],
        matchScore: 87,
        isAIRecommended: true,
        appliedDate: '2025-11-04',
        status: 'Accepted',
        experience: 1,
      },
      {
        id: '8',
        name: 'Divya Nair',
        email: 'divya.nair.eee@anits.edu.in',
        rollNumber: 'A00000000008',
        department: 'Electrical Engineering',
        skills: ['Arduino', 'Sensors', 'Python', 'Data Analytics'],
        matchScore: 85,
        isAIRecommended: true,
        appliedDate: '2025-11-05',
        status: 'Accepted',
        experience: 2,
      },
    ],
  },
];

const PostManagementDashboard: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<OpportunityPost | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [applicantDialogOpen, setApplicantDialogOpen] = useState(false);

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setApplicantDialogOpen(true);
  };

  const handleAcceptApplicant = (postId: string, applicantId: string) => {
    // In real app, would call API
    console.log(`Accepting applicant ${applicantId} for post ${postId}`);
    alert('Applicant accepted successfully!');
  };

  const handleRejectApplicant = (postId: string, applicantId: string) => {
    // In real app, would call API
    console.log(`Rejecting applicant ${applicantId} for post ${postId}`);
    alert('Applicant rejected');
  };

  const handleEnableChatroom = (postId: string) => {
    // In real app, would call API
    console.log(`Enabling chatroom for post ${postId}`);
    alert('Chatroom has been created! All accepted members have been notified.');
  };

  return (
    <ThemeProvider theme={unitedTheme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                My Posts
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Review applications and manage your posts
              </Typography>
            </Box>
          </motion.div>

          {/* Posts List */}
          <Stack spacing={4}>
            {mockPosts.map((post, index) => {
              const aiRecommendedApplicants = post.applicants.filter((a) => a.isAIRecommended);
              const pendingApplicants = post.applicants.filter((a) => a.status === 'Pending');
              const canEnableChatroom = post.acceptedMembers === post.requiredMembers && !post.chatroomEnabled;

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ overflow: 'visible' }}>
                    <CardContent>
                      <Stack spacing={3}>
                        {/* Post Header */}
                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                                {post.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                                {post.description}
                              </Typography>

                              {/* Skills */}
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {post.requiredSkills.map((skill) => (
                                  <Chip
                                    key={skill}
                                    label={skill}
                                    size="small"
                                    sx={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}
                                  />
                                ))}
                              </Stack>
                            </Box>

                            <Chip
                              label={post.purpose}
                              sx={{
                                backgroundColor: '#F3F4F6',
                                fontWeight: 600,
                              }}
                            />
                          </Stack>
                        </Box>

                        {/* Progress Bar */}
                        <Box>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                              Team Progress
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                              {post.acceptedMembers}/{post.requiredMembers} members
                            </Typography>
                          </Stack>
                          <Box
                            sx={{
                              height: 8,
                              backgroundColor: '#E5E7EB',
                              borderRadius: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(post.acceptedMembers / post.requiredMembers) * 100}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              style={{
                                height: '100%',
                                backgroundColor: post.acceptedMembers === post.requiredMembers ? '#10B981' : '#2563EB',
                              }}
                            />
                          </Box>
                        </Box>

                        {/* AI Recommendations Section */}
                        {aiRecommendedApplicants.length > 0 && (
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: '#EFF6FF',
                              border: '2px solid #2563EB',
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                              <Star size={20} color="#2563EB" fill="#2563EB" />
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2563EB' }}>
                                AI-Recommended Candidates ({aiRecommendedApplicants.length})
                              </Typography>
                            </Stack>

                            <List sx={{ p: 0 }}>
                              {aiRecommendedApplicants.slice(0, 3).map((applicant) => (
                                <ListItem
                                  key={applicant.id}
                                  sx={{
                                    backgroundColor: 'white',
                                    borderRadius: 1,
                                    mb: 1,
                                    '&:last-child': { mb: 0 },
                                  }}
                                  secondaryAction={
                                    applicant.status === 'Pending' ? (
                                      <Stack direction="row" spacing={1}>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleAcceptApplicant(post.id, applicant.id)}
                                          sx={{ color: '#10B981' }}
                                        >
                                          <CheckCircle size={20} />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleRejectApplicant(post.id, applicant.id)}
                                          sx={{ color: '#EF4444' }}
                                        >
                                          <XCircle size={20} />
                                        </IconButton>
                                      </Stack>
                                    ) : (
                                      <Chip
                                        label={applicant.status}
                                        size="small"
                                        sx={{
                                          backgroundColor: applicant.status === 'Accepted' ? '#D1FAE5' : '#FEE2E2',
                                          color: applicant.status === 'Accepted' ? '#10B981' : '#EF4444',
                                        }}
                                      />
                                    )
                                  }
                                >
                                  <ListItemAvatar>
                                    <Avatar sx={{ backgroundColor: '#2563EB' }}>
                                      {applicant.name.split(' ').map(n => n[0]).join('')}
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography sx={{ fontWeight: 600 }}>{applicant.name}</Typography>
                                        <Chip
                                          label={`${applicant.matchScore}% match`}
                                          size="small"
                                          sx={{
                                            backgroundColor: '#DBEAFE',
                                            color: '#2563EB',
                                            height: 20,
                                            fontSize: '0.75rem',
                                          }}
                                        />
                                      </Stack>
                                    }
                                    secondary={
                                      <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                                        <Typography variant="caption">{applicant.department}</Typography>
                                        <Typography variant="caption">•</Typography>
                                        <Typography variant="caption">
                                          {applicant.skills.slice(0, 3).join(', ')}
                                        </Typography>
                                      </Stack>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        )}

                        <Divider />

                        {/* All Applicants */}
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
                            All Applicants ({post.applicants.length})
                          </Typography>

                          <List sx={{ p: 0 }}>
                            {post.applicants.map((applicant) => (
                              <ListItem
                                key={applicant.id}
                                sx={{
                                  backgroundColor: '#F9FAFB',
                                  borderRadius: 1,
                                  mb: 1,
                                  '&:last-child': { mb: 0 },
                                  cursor: 'pointer',
                                  '&:hover': {
                                    backgroundColor: '#F3F4F6',
                                  },
                                }}
                                onClick={() => handleViewApplicant(applicant)}
                                secondaryAction={
                                  applicant.status === 'Pending' ? (
                                    <Stack direction="row" spacing={1}>
                                      <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<CheckCircle size={16} />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAcceptApplicant(post.id, applicant.id);
                                        }}
                                        sx={{
                                          backgroundColor: '#10B981',
                                          '&:hover': { backgroundColor: '#059669' },
                                        }}
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<XCircle size={16} />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRejectApplicant(post.id, applicant.id);
                                        }}
                                        sx={{
                                          borderColor: '#EF4444',
                                          color: '#EF4444',
                                          '&:hover': { borderColor: '#DC2626', backgroundColor: '#FEE2E2' },
                                        }}
                                      >
                                        Reject
                                      </Button>
                                    </Stack>
                                  ) : (
                                    <Chip
                                      label={applicant.status}
                                      size="small"
                                      sx={{
                                        backgroundColor: applicant.status === 'Accepted' ? '#D1FAE5' : '#FEE2E2',
                                        color: applicant.status === 'Accepted' ? '#10B981' : '#EF4444',
                                        fontWeight: 600,
                                      }}
                                    />
                                  )
                                }
                              >
                                <ListItemAvatar>
                                  <Avatar sx={{ backgroundColor: applicant.isAIRecommended ? '#2563EB' : '#6B7280' }}>
                                    {applicant.name.split(' ').map(n => n[0]).join('')}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                      <Typography sx={{ fontWeight: 600 }}>{applicant.name}</Typography>
                                      {applicant.isAIRecommended && (
                                        <Star size={14} color="#2563EB" fill="#2563EB" />
                                      )}
                                    </Stack>
                                  }
                                  secondary={
                                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                      {applicant.email} • {applicant.department} • {applicant.experience}y exp
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>

                        {/* Enable Chatroom Button */}
                        {canEnableChatroom && (
                          <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                          >
                            <Button
                              fullWidth
                              variant="contained"
                              size="large"
                              startIcon={<MessageCircle />}
                              onClick={() => handleEnableChatroom(post.id)}
                              sx={{
                                backgroundColor: '#10B981',
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                '&:hover': {
                                  backgroundColor: '#059669',
                                },
                              }}
                            >
                              Enable Chatroom - Team Complete!
                            </Button>
                          </motion.div>
                        )}

                        {post.chatroomEnabled && (
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: '#D1FAE5',
                              border: '2px solid #10B981',
                            }}
                          >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <MessageCircle color="#10B981" />
                                <Typography sx={{ fontWeight: 600, color: '#10B981' }}>
                                  Chatroom Active
                                </Typography>
                              </Stack>
                              <Button
                                variant="contained"
                                onClick={() => window.open(`/chatroom/${post.chatroomId}`, '_blank')}
                                sx={{
                                  backgroundColor: '#10B981',
                                  '&:hover': { backgroundColor: '#059669' },
                                }}
                              >
                                Open Chatroom
                              </Button>
                            </Stack>
                          </Paper>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Stack>

          {/* Applicant Detail Dialog */}
          <Dialog
            open={applicantDialogOpen}
            onClose={() => setApplicantDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            {selectedApplicant && (
              <>
                <DialogTitle>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ width: 56, height: 56, backgroundColor: '#2563EB' }}>
                      {selectedApplicant.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {selectedApplicant.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {selectedApplicant.rollNumber} • {selectedApplicant.department}
                      </Typography>
                    </Box>
                  </Stack>
                </DialogTitle>

                <DialogContent>
                  <Stack spacing={3}>
                    {selectedApplicant.isAIRecommended && (
                      <Paper sx={{ p: 2, backgroundColor: '#EFF6FF', border: '1px solid #2563EB' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Star size={18} color="#2563EB" fill="#2563EB" />
                          <Typography sx={{ fontWeight: 600, color: '#2563EB' }}>
                            AI Recommended - {selectedApplicant.matchScore}% Match
                          </Typography>
                        </Stack>
                      </Paper>
                    )}

                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#6B7280', mb: 1 }}>
                        Contact Information
                      </Typography>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Mail size={16} color="#6B7280" />
                          <Typography variant="body2">{selectedApplicant.email}</Typography>
                        </Stack>
                        {selectedApplicant.portfolio && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Award size={16} color="#6B7280" />
                            <Typography variant="body2">{selectedApplicant.portfolio}</Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#6B7280', mb: 1 }}>
                        Skills
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {selectedApplicant.skills.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            sx={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#6B7280', mb: 1 }}>
                        Experience
                      </Typography>
                      <Typography variant="body2">{selectedApplicant.experience} years</Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#6B7280', mb: 1 }}>
                        Applied Date
                      </Typography>
                      <Typography variant="body2">
                        {new Date(selectedApplicant.appliedDate).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#6B7280', mb: 1 }}>
                        Status
                      </Typography>
                      <Chip
                        label={selectedApplicant.status}
                        sx={{
                          backgroundColor:
                            selectedApplicant.status === 'Accepted'
                              ? '#D1FAE5'
                              : selectedApplicant.status === 'Pending'
                              ? '#FEF3C7'
                              : '#FEE2E2',
                          color:
                            selectedApplicant.status === 'Accepted'
                              ? '#10B981'
                              : selectedApplicant.status === 'Pending'
                              ? '#F59E0B'
                              : '#EF4444',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Stack>
                </DialogContent>

                <DialogActions>
                  <Button onClick={() => setApplicantDialogOpen(false)}>Close</Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PostManagementDashboard;

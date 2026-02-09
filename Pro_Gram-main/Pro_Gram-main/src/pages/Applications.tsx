import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, FileText, Users, Calendar, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Application {
  id: string;
  postTitle: string;
  postAuthor: string;
  appliedDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  skills: string[];
  chatroomId?: string;
}

interface YourPost {
  id: string;
  title: string;
  description: string;
  applicants: number;
  accepted: number;
  requiredMembers: number;
  createdAt: string;
  purpose: string;
}

const mockApplications: Application[] = [
  {
    id: '1',
    postTitle: 'AI Research Project',
    postAuthor: 'Dr. Smith',
    appliedDate: '2024-11-05',
    status: 'Accepted',
    skills: ['Machine Learning', 'Python'],
    chatroomId: 'chat-1',
  },
  {
    id: '2',
    postTitle: 'Web Development Team',
    postAuthor: 'John Doe',
    appliedDate: '2024-11-06',
    status: 'Pending',
    skills: ['React', 'Node.js'],
  },
  {
    id: '3',
    postTitle: 'Data Science Project',
    postAuthor: 'Prof. Johnson',
    appliedDate: '2024-11-04',
    status: 'Rejected',
    skills: ['Data Analysis', 'Python'],
  },
];

const mockYourPosts: YourPost[] = [
  {
    id: '1',
    title: 'Mobile App Development',
    description: 'Building a cross-platform mobile app',
    applicants: 8,
    accepted: 2,
    requiredMembers: 3,
    createdAt: '2024-11-01',
    purpose: 'Project',
  },
  {
    id: '2',
    title: 'Hackathon Team Formation',
    description: 'Looking for team members for upcoming hackathon',
    applicants: 12,
    accepted: 4,
    requiredMembers: 5,
    createdAt: '2024-10-28',
    purpose: 'Hackathon',
  },
];

interface ApplicantRequest {
  id: string;
  applicantName: string;
  applicantEmail: string;
  postTitle: string;
  postId: string;
  appliedDate: string;
  skills: string[];
  message: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

const mockRequests: ApplicantRequest[] = [
  {
    id: '1',
    applicantName: 'Jane Smith',
    applicantEmail: 'jane.smith@email.com',
    postTitle: 'Mobile App Development',
    postId: '1',
    appliedDate: '2024-11-06',
    skills: ['React Native', 'Flutter', 'UI/UX'],
    message: 'I have experience in mobile development and would love to contribute to this project.',
    status: 'Pending',
  },
  {
    id: '2',
    applicantName: 'Robert Johnson',
    applicantEmail: 'robert.j@email.com',
    postTitle: 'Mobile App Development',
    postId: '1',
    appliedDate: '2024-11-05',
    skills: ['Swift', 'Kotlin', 'Firebase'],
    message: 'I am interested in working on the backend integration for this mobile app.',
    status: 'Pending',
  },
  {
    id: '3',
    applicantName: 'Emma Davis',
    applicantEmail: 'emma.davis@email.com',
    postTitle: 'Hackathon Team Formation',
    postId: '2',
    appliedDate: '2024-11-04',
    skills: ['Python', 'Machine Learning', 'Data Analysis'],
    message: 'Looking forward to participating in the hackathon with your team!',
    status: 'Pending',
  },
];

const Applications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [withdrawConfirmOpen, setWithdrawConfirmOpen] = useState(false);
  const [requests, setRequests] = useState<ApplicantRequest[]>(mockRequests);

  // Check if user is faculty
  const isFaculty = user?.role === 'faculty';

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (app: Application) => {
    setSelectedApp(app);
    setDetailDialogOpen(true);
  };

  const handleWithdraw = () => {
    // Handle withdrawal logic here
    setWithdrawConfirmOpen(false);
    setDetailDialogOpen(false);
  };

  const handleAcceptRequest = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: 'Accepted' as const } : req
      )
    );
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: 'Rejected' as const } : req
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle size={20} color="#10B981" />;
      case 'Pending':
        return <Clock size={20} color="#F59E0B" />;
      case 'Rejected':
        return <XCircle size={20} color="#EF4444" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return { bg: '#ECFDF5', color: '#10B981' };
      case 'Pending':
        return { bg: '#FEF3C7', color: '#F59E0B' };
      case 'Rejected':
        return { bg: '#FEE2E2', color: '#EF4444' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  const getApplicationStage = (status: string) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Accepted':
        return 2;
      case 'Rejected':
        return 1;
      default:
        return 0;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                backgroundColor: '#6C47FF',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={28} color="#FFFFFF" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                Applications
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Manage your applications and track progress
              </Typography>
            </Box>
          </Stack>

          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                borderBottom: '1px solid #E5E7EB',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                },
              }}
            >
              {/* Hide Applied Posts and Tracking System tabs for faculty */}
              {!isFaculty && <Tab label="Applied Posts" />}
              <Tab label="Your Posts" />
              <Tab label="Requests" />
              {!isFaculty && <Tab label="Tracking System" />}
            </Tabs>
          </Paper>

          {/* Applied Posts Tab - Only for Students */}
          {tabValue === 0 && !isFaculty && (
            <Stack spacing={2}>
              {mockApplications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card sx={{ borderRadius: 2, border: '1px solid #E5E7EB' }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="start">
                        <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                          <Avatar sx={{ width: 48, height: 48, backgroundColor: '#6C47FF' }}>
                            {app.postAuthor.charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {app.postTitle}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                              Posted by {app.postAuthor}
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
                              {app.skills.map((skill) => (
                                <Chip
                                  key={skill}
                                  label={skill}
                                  size="small"
                                  sx={{
                                    fontSize: '0.75rem',
                                    backgroundColor: '#F3F4F6',
                                    color: '#374151',
                                  }}
                                />
                              ))}
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={3}>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Calendar size={16} color="#6B7280" />
                                <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                  Applied {new Date(app.appliedDate).toLocaleDateString()}
                                </Typography>
                              </Stack>
                              <Chip
                                icon={getStatusIcon(app.status) || undefined}
                                label={app.status}
                                size="small"
                                sx={{
                                  backgroundColor: getStatusColor(app.status).bg,
                                  color: getStatusColor(app.status).color,
                                  fontWeight: 600,
                                }}
                              />
                            </Stack>
                          </Box>
                        </Stack>
                        <Stack spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewDetails(app)}
                            sx={{
                              textTransform: 'none',
                              borderColor: '#6C47FF',
                              color: '#6C47FF',
                              '&:hover': {
                                borderColor: '#5A3AD6',
                                backgroundColor: '#F5F3FF',
                              },
                            }}
                          >
                            View Details
                          </Button>
                          {app.status === 'Accepted' && app.chatroomId && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => navigate(`/chatroom/${app.chatroomId}`)}
                              sx={{
                                backgroundColor: '#6C47FF',
                                textTransform: 'none',
                                '&:hover': {
                                  backgroundColor: '#5A3AD6',
                                },
                              }}
                            >
                              Join Chat
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          )}

          {/* Your Posts Tab */}
          {((isFaculty && tabValue === 0) || (!isFaculty && tabValue === 1)) && (
            <Stack spacing={2}>
              {mockYourPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card sx={{ borderRadius: 2, border: '1px solid #E5E7EB' }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {post.title}
                            </Typography>
                            <Chip
                              label={post.purpose}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: '#F0FDF4',
                                color: '#16A34A',
                              }}
                            />
                          </Stack>
                          <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                            {post.description}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Users size={16} color="#6B7280" />
                              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                {post.applicants} applicants
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <CheckCircle size={16} color="#10B981" />
                              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                {post.accepted}/{post.requiredMembers} accepted
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Calendar size={16} color="#6B7280" />
                              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </Typography>
                            </Stack>
                          </Stack>
                          <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                Team Progress
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>
                                {Math.round((post.accepted / post.requiredMembers) * 100)}%
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={(post.accepted / post.requiredMembers) * 100}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#E5E7EB',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor:
                                    post.accepted === post.requiredMembers ? '#10B981' : '#6C47FF',
                                },
                              }}
                            />
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/post/manage/${post.id}`)}
                          sx={{
                            textTransform: 'none',
                            borderColor: '#6C47FF',
                            color: '#6C47FF',
                            ml: 2,
                            '&:hover': {
                              borderColor: '#5A3AD6',
                              backgroundColor: '#F5F3FF',
                            },
                          }}
                        >
                          Manage
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          )}

          {/* Requests Tab */}
          {((isFaculty && tabValue === 1) || (!isFaculty && tabValue === 2)) && (
            <Stack spacing={2}>
              {requests.filter(req => req.status === 'Pending').length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                  <Typography variant="body1" sx={{ color: '#6B7280' }}>
                    No pending requests at the moment
                  </Typography>
                </Paper>
              ) : (
                requests.filter(req => req.status === 'Pending').map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card sx={{ borderRadius: 2, border: '1px solid #E5E7EB' }}>
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              backgroundColor: '#6C47FF',
                              fontSize: '1.25rem',
                              fontWeight: 600,
                            }}
                          >
                            {request.applicantName.split(' ').map(n => n[0]).join('')}
                          </Avatar>

                          <Box sx={{ flexGrow: 1 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                                {request.applicantName}
                              </Typography>
                              <Chip
                                label="New Request"
                                size="small"
                                sx={{
                                  backgroundColor: '#FEF3C7',
                                  color: '#F59E0B',
                                  fontWeight: 600,
                                }}
                              />
                            </Stack>

                            <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                              Applied to: <strong>{request.postTitle}</strong>
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                              {request.applicantEmail} • Applied {new Date(request.appliedDate).toLocaleDateString()}
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                                <Award size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                Skills:
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                {request.skills.map((skill) => (
                                  <Chip
                                    key={skill}
                                    label={skill}
                                    size="small"
                                    sx={{
                                      backgroundColor: '#F5F3FF',
                                      color: '#6C47FF',
                                    }}
                                  />
                                ))}
                              </Stack>
                            </Box>

                            <Paper
                              sx={{
                                p: 2,
                                backgroundColor: '#F9FAFB',
                                borderRadius: 2,
                                mb: 2,
                              }}
                            >
                              <Typography variant="body2" sx={{ color: '#111827', fontStyle: 'italic' }}>
                                "{request.message}"
                              </Typography>
                            </Paper>

                            <Stack direction="row" spacing={2}>
                              <Button
                                variant="contained"
                                startIcon={<CheckCircle size={18} />}
                                onClick={() => handleAcceptRequest(request.id)}
                                sx={{
                                  backgroundColor: '#10B981',
                                  '&:hover': { backgroundColor: '#059669' },
                                  textTransform: 'none',
                                  fontWeight: 600,
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                startIcon={<XCircle size={18} />}
                                onClick={() => handleRejectRequest(request.id)}
                                sx={{
                                  color: '#EF4444',
                                  borderColor: '#EF4444',
                                  '&:hover': {
                                    borderColor: '#DC2626',
                                    backgroundColor: '#FEE2E2',
                                  },
                                  textTransform: 'none',
                                  fontWeight: 600,
                                }}
                              >
                                Reject
                              </Button>
                            </Stack>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </Stack>
          )}

          {/* Tracking System Tab - Only for Students */}
          {tabValue === 3 && !isFaculty && (
            <Stack spacing={2}>
              {mockApplications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card sx={{ borderRadius: 2, border: '1px solid #E5E7EB' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {app.postTitle}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
                        Posted by {app.postAuthor}
                      </Typography>
                      <Stepper
                        activeStep={getApplicationStage(app.status)}
                        alternativeLabel
                      >
                        <Step>
                          <StepLabel>Application Submitted</StepLabel>
                        </Step>
                        <Step>
                          <StepLabel
                            error={app.status === 'Rejected'}
                          >
                            {app.status === 'Rejected' ? 'Rejected' : 'Under Review'}
                          </StepLabel>
                        </Step>
                        <Step>
                          <StepLabel>
                            {app.status === 'Accepted' ? 'Accepted - Join Team' : 'Pending Decision'}
                          </StepLabel>
                        </Step>
                      </Stepper>
                      {app.status === 'Accepted' && (
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                          <Button
                            variant="contained"
                            onClick={() => navigate(`/chatroom/${app.chatroomId}`)}
                            sx={{
                              backgroundColor: '#10B981',
                              textTransform: 'none',
                              px: 4,
                              '&:hover': {
                                backgroundColor: '#059669',
                              },
                            }}
                          >
                            Join Team Chatroom
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          )}
        </motion.div>
      </Container>

      {/* Application Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedApp && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Application Details
                </Typography>
                <IconButton onClick={() => setDetailDialogOpen(false)} size="small">
                  <ArrowLeft size={20} />
                </IconButton>
              </Stack>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#111827' }}>
                    {selectedApp.postTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Posted by {selectedApp.postAuthor}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#111827' }}>
                    Application Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedApp.status) || undefined}
                    label={selectedApp.status}
                    sx={{
                      backgroundColor: getStatusColor(selectedApp.status).bg,
                      color: getStatusColor(selectedApp.status).color,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#111827' }}>
                    Applied Date
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {new Date(selectedApp.appliedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#111827' }}>
                    Required Skills
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {selectedApp.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{
                          backgroundColor: '#F5F3FF',
                          color: '#6C47FF',
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {selectedApp.status === 'Accepted' && selectedApp.chatroomId && (
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: '#ECFDF5',
                      borderRadius: 2,
                      border: '1px solid #10B981',
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle size={24} color="#10B981" />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#10B981' }}>
                          Application Accepted!
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#059669' }}>
                          You can now join the team chatroom to collaborate.
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setDetailDialogOpen(false);
                          navigate(`/chatroom/${selectedApp.chatroomId}`);
                        }}
                        sx={{
                          backgroundColor: '#10B981',
                          '&:hover': { backgroundColor: '#059669' },
                          textTransform: 'none',
                        }}
                      >
                        Join Chat
                      </Button>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              {selectedApp.status === 'Pending' && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setWithdrawConfirmOpen(true)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Withdraw Application
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => setDetailDialogOpen(false)}
                sx={{
                  backgroundColor: '#6C47FF',
                  '&:hover': { backgroundColor: '#5A3AD6' },
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Withdraw Confirmation Dialog */}
      <Dialog open={withdrawConfirmOpen} onClose={() => setWithdrawConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Withdrawal</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            Are you sure you want to withdraw your application? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleWithdraw}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Applications;

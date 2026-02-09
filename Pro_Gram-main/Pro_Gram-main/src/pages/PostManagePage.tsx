import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Avatar,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, CheckCircle, XCircle, Mail, Award } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Applicant {
  id: string;
  name: string;
  email: string;
  appliedDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  skills: string[];
  message: string;
}

const mockApplicants: Applicant[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    appliedDate: '2024-11-05',
    status: 'Pending',
    skills: ['React', 'TypeScript', 'Node.js'],
    message: 'I have 3 years of experience in full-stack development and would love to join this project.',
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    appliedDate: '2024-11-04',
    status: 'Accepted',
    skills: ['Python', 'Machine Learning', 'Data Science'],
    message: 'I\'m passionate about AI and have completed several ML projects.',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    appliedDate: '2024-11-03',
    status: 'Pending',
    skills: ['UI/UX', 'Figma', 'React'],
    message: 'I can help with the frontend and UX design of the application.',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    appliedDate: '2024-11-02',
    status: 'Rejected',
    skills: ['Java', 'Spring Boot'],
    message: 'Interested in backend development for this project.',
  },
];

const PostManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const postDetails = {
    title: 'AI Research Project',
    description: 'Looking for team members to work on machine learning for healthcare applications.',
    requiredMembers: 4,
    acceptedMembers: 1,
  };

  const handleAccept = (applicantId: string) => {
    setApplicants(
      applicants.map((app) =>
        app.id === applicantId ? { ...app, status: 'Accepted' as const } : app
      )
    );
  };

  const handleReject = (applicantId: string) => {
    setApplicants(
      applicants.map((app) =>
        app.id === applicantId ? { ...app, status: 'Rejected' as const } : app
      )
    );
  };

  const handleViewProfile = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setDialogOpen(true);
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

  const pendingApplicants = applicants.filter((app) => app.status === 'Pending');
  const acceptedApplicants = applicants.filter((app) => app.status === 'Accepted');
  const rejectedApplicants = applicants.filter((app) => app.status === 'Rejected');

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
            <IconButton
              onClick={() => navigate('/applications')}
              sx={{
                color: '#6B7280',
                '&:hover': { backgroundColor: '#F3F4F6' },
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                Manage Applicants
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                {postDetails.title}
              </Typography>
            </Box>
          </Stack>

          {/* Post Stats */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Stack direction="row" spacing={4} alignItems="center">
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#6C47FF' }}>
                  {applicants.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Total Applications
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#10B981' }}>
                  {acceptedApplicants.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Accepted
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                  {pendingApplicants.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Pending Review
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
                  Team Progress
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                  {acceptedApplicants.length} / {postDetails.requiredMembers} Members
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Pending Applications */}
          {pendingApplicants.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
                Pending Applications ({pendingApplicants.length})
              </Typography>
              <Stack spacing={2}>
                {pendingApplicants.map((applicant, index) => (
                  <motion.div
                    key={applicant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
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
                            {applicant.name.split(' ').map((n) => n[0]).join('')}
                          </Avatar>

                          <Box sx={{ flexGrow: 1 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                                {applicant.name}
                              </Typography>
                              <Chip
                                label={applicant.status}
                                size="small"
                                sx={{
                                  backgroundColor: getStatusColor(applicant.status).bg,
                                  color: getStatusColor(applicant.status).color,
                                  fontWeight: 600,
                                }}
                              />
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                <Mail size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                {applicant.email}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                Applied: {new Date(applicant.appliedDate).toLocaleDateString()}
                              </Typography>
                            </Stack>

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                                <Award size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                Skills:
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                {applicant.skills.map((skill) => (
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
                                "{applicant.message}"
                              </Typography>
                            </Paper>

                            <Stack direction="row" spacing={2}>
                              <Button
                                variant="contained"
                                startIcon={<CheckCircle size={18} />}
                                onClick={() => handleAccept(applicant.id)}
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
                                onClick={() => handleReject(applicant.id)}
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
                              <Button
                                variant="text"
                                onClick={() => handleViewProfile(applicant)}
                                sx={{
                                  color: '#6C47FF',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                }}
                              >
                                View Profile
                              </Button>
                            </Stack>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            </Box>
          )}

          {/* Accepted Applications */}
          {acceptedApplicants.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
                Accepted Members ({acceptedApplicants.length})
              </Typography>
              <Stack spacing={2}>
                {acceptedApplicants.map((applicant) => (
                  <Card key={applicant.id} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: '#10B981',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                          }}
                        >
                          {applicant.name.split(' ').map((n) => n[0]).join('')}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827' }}>
                            {applicant.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            {applicant.email}
                          </Typography>
                        </Box>
                        <Chip
                          label="Accepted"
                          size="small"
                          icon={<CheckCircle size={14} />}
                          sx={{
                            backgroundColor: '#ECFDF5',
                            color: '#10B981',
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}
        </motion.div>
      </Container>

      {/* Profile Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        {selectedApplicant && (
          <>
            <DialogTitle>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: '#6C47FF',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                  }}
                >
                  {selectedApplicant.name.split(' ').map((n) => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedApplicant.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {selectedApplicant.email}
                  </Typography>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Skills
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {selectedApplicant.skills.map((skill) => (
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
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Application Message
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: '#F9FAFB' }}>
                    <Typography variant="body2">{selectedApplicant.message}</Typography>
                  </Paper>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PostManagePage;

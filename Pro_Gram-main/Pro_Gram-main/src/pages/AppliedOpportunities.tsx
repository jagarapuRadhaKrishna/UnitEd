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
  Tabs,
  Tab,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Calendar, Users, CheckCircle, Clock, XCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import unitedTheme from '../theme/unitedTheme';

interface Application {
  id: string;
  opportunityId: string;
  title: string;
  purpose: 'Research' | 'Project' | 'Hackathon';
  posterName: string;
  appliedDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  requiredSkills: string[];
  chatroomId?: string;
}

// Mock data
const mockApplications: Application[] = [
  {
    id: '1',
    opportunityId: '1',
    title: 'AI-Powered Healthcare Chatbot Development',
    purpose: 'Project',
    posterName: 'Dr. Rajesh Kumar',
    appliedDate: '2025-11-05',
    status: 'Accepted',
    requiredSkills: ['Python', 'Machine Learning', 'NLP'],
    chatroomId: 'chat-001',
  },
  {
    id: '2',
    opportunityId: '2',
    title: 'Smart Campus Navigation System',
    purpose: 'Hackathon',
    posterName: 'Priya Sharma',
    appliedDate: '2025-11-04',
    status: 'Pending',
    requiredSkills: ['React Native', 'ARKit', 'Firebase'],
  },
  {
    id: '3',
    opportunityId: '4',
    title: 'Blockchain-Based Supply Chain Tracking',
    purpose: 'Project',
    posterName: 'Vikram Singh',
    appliedDate: '2025-11-03',
    status: 'Rejected',
    requiredSkills: ['Solidity', 'Ethereum', 'Web3.js'],
  },
  {
    id: '4',
    opportunityId: '5',
    title: 'IoT-Based Smart Agriculture System',
    purpose: 'Research',
    posterName: 'Prof. Anita Desai',
    appliedDate: '2025-11-02',
    status: 'Accepted',
    requiredSkills: ['Arduino', 'IoT', 'Data Analytics'],
    chatroomId: 'chat-002',
  },
  {
    id: '5',
    opportunityId: '6',
    title: 'Mobile App for Mental Health Support',
    purpose: 'Project',
    posterName: 'Karan Mehta',
    appliedDate: '2025-11-01',
    status: 'Pending',
    requiredSkills: ['React Native', 'Node.js', 'MongoDB'],
  },
];

const AppliedOpportunities: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const filterApplications = () => {
    if (selectedTab === 0) return mockApplications; // All
    if (selectedTab === 1) return mockApplications.filter((app) => app.status === 'Pending');
    if (selectedTab === 2) return mockApplications.filter((app) => app.status === 'Accepted');
    if (selectedTab === 3) return mockApplications.filter((app) => app.status === 'Rejected');
    return mockApplications;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Accepted':
        return {
          color: '#10B981',
          bgColor: '#D1FAE5',
          icon: <CheckCircle size={18} />,
        };
      case 'Pending':
        return {
          color: '#F59E0B',
          bgColor: '#FEF3C7',
          icon: <Clock size={18} />,
        };
      case 'Rejected':
        return {
          color: '#EF4444',
          bgColor: '#FEE2E2',
          icon: <XCircle size={18} />,
        };
      default:
        return {
          color: '#6B7280',
          bgColor: '#F3F4F6',
          icon: null,
        };
    }
  };

  const filteredApplications = filterApplications();

  return (
    <ThemeProvider theme={unitedTheme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                My Applications
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Track the status of all your opportunity applications
              </Typography>
            </Box>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                  },
                }}
              >
                <Tab label={`All (${mockApplications.length})`} />
                <Tab
                  label={`Pending (${mockApplications.filter((a) => a.status === 'Pending').length})`}
                />
                <Tab
                  label={`Accepted (${mockApplications.filter((a) => a.status === 'Accepted').length})`}
                />
                <Tab
                  label={`Rejected (${mockApplications.filter((a) => a.status === 'Rejected').length})`}
                />
              </Tabs>
            </Paper>
          </motion.div>

          {/* Applications List */}
          <Stack spacing={3}>
            {filteredApplications.map((application, index) => {
              const statusConfig = getStatusConfig(application.status);

              return (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        {/* Header with Status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                              {application.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                              Posted by <strong>{application.posterName}</strong>
                            </Typography>
                          </Box>

                          <Chip
                            icon={statusConfig.icon || undefined}
                            label={application.status}
                            sx={{
                              backgroundColor: statusConfig.bgColor,
                              color: statusConfig.color,
                              fontWeight: 600,
                              '& .MuiChip-icon': {
                                color: statusConfig.color,
                              },
                            }}
                          />
                        </Box>

                        {/* Skills */}
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {application.requiredSkills.map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              size="small"
                              sx={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}
                            />
                          ))}
                        </Stack>

                        {/* Meta Info */}
                        <Stack
                          direction="row"
                          spacing={3}
                          flexWrap="wrap"
                          sx={{
                            pt: 2,
                            borderTop: '1px solid #E5E7EB',
                          }}
                        >
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Users size={16} color="#6B7280" />
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                              {application.purpose}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Calendar size={16} color="#6B7280" />
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                              Applied: {new Date(application.appliedDate).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Stack>

                        {/* Actions */}
                        {application.status === 'Accepted' && application.chatroomId && (
                          <Box>
                            <Button
                              variant="contained"
                              startIcon={<MessageCircle size={18} />}
                              onClick={() => navigate(`/chatroom/${application.chatroomId}`)}
                              sx={{
                                backgroundColor: '#10B981',
                                '&:hover': {
                                  backgroundColor: '#059669',
                                },
                              }}
                            >
                              Join Chatroom
                            </Button>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Stack>

          {/* Empty State */}
          {filteredApplications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                  No applications found
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
                  You haven't applied to any opportunities yet
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/home')}
                  sx={{
                    backgroundColor: '#2563EB',
                    '&:hover': {
                      backgroundColor: '#1D4ED8',
                    },
                  }}
                >
                  Browse Opportunities
                </Button>
              </Paper>
            </motion.div>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AppliedOpportunities;

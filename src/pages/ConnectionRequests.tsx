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
  Tabs,
  Tab,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import { UserPlus, UserCheck, UserX, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useConnections } from '../contexts/ConnectionContext';

const ConnectionRequests: React.FC = () => {
  const navigate = useNavigate();
  const {
    connectionRequests,
    sentRequests,
    acceptConnectionRequest,
    ignoreConnectionRequest,
    isLoading,
  } = useConnections();

  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleAccept = async (requestId: string, senderName: string) => {
    try {
      await acceptConnectionRequest(requestId);
      setSnackbar({
        open: true,
        message: `You are now connected with ${senderName}! 🎉`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleIgnore = async (requestId: string) => {
    try {
      await ignoreConnectionRequest(requestId);
      setSnackbar({
        open: true,
        message: 'Connection request ignored',
        severity: 'info',
      });
    } catch (error) {
      console.error('Failed to ignore request:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                Connection Requests
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Manage your pending connection requests
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Users size={20} />}
              onClick={() => navigate('/connections')}
              sx={{
                textTransform: 'none',
                borderColor: '#6C47FF',
                color: '#6C47FF',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#5A3AD6',
                  backgroundColor: '#F5F3FF',
                },
              }}
            >
              View All Connections
            </Button>
          </Stack>

          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                borderBottom: '1px solid #E5E7EB',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                },
              }}
            >
              <Tab
                label={`Received (${connectionRequests.length})`}
                icon={<UserPlus size={18} />}
                iconPosition="start"
              />
              <Tab
                label={`Sent (${sentRequests.length})`}
                icon={<Clock size={18} />}
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {/* Received Requests */}
          {activeTab === 0 && (
            <Box>
              {connectionRequests.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                  <UserPlus size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                    No pending requests
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
                    You don't have any connection requests at the moment
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/connections/discover')}
                    sx={{
                      backgroundColor: '#6C47FF',
                      textTransform: 'none',
                      px: 3,
                      '&:hover': {
                        backgroundColor: '#5A3AD6',
                      },
                    }}
                  >
                    Discover People
                  </Button>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  <AnimatePresence>
                    {connectionRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card
                          sx={{
                            borderRadius: 2,
                            border: '1px solid #E5E7EB',
                            transition: 'all 0.3s',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2.5} alignItems="flex-start">
                              {/* Avatar */}
                              <Avatar
                                src={request.sender.avatar}
                                sx={{ width: 64, height: 64, cursor: 'pointer' }}
                                onClick={() => navigate(`/profile/${request.senderId}`)}
                              >
                                {request.sender.firstName[0]}
                                {request.sender.lastName[0]}
                              </Avatar>

                              {/* Content */}
                              <Box sx={{ flex: 1 }}>
                                <Stack spacing={1.5}>
                                  {/* Name and Role */}
                                  <Box>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        '&:hover': { color: '#6C47FF' },
                                        mb: 0.5,
                                      }}
                                      onClick={() => navigate(`/profile/${request.senderId}`)}
                                    >
                                      {request.sender.firstName} {request.sender.lastName}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Chip
                                        label={request.sender.role === 'student' ? 'Student' : 'Faculty'}
                                        size="small"
                                        sx={{
                                          height: 22,
                                          fontSize: '0.75rem',
                                          backgroundColor:
                                            request.sender.role === 'student' ? '#EFF6FF' : '#F0FDF4',
                                          color: request.sender.role === 'student' ? '#2563EB' : '#16A34A',
                                        }}
                                      />
                                      {request.sender.department && (
                                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                          • {request.sender.department}
                                        </Typography>
                                      )}
                                      {request.sender.designation && (
                                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                          • {request.sender.designation}
                                        </Typography>
                                      )}
                                    </Stack>
                                  </Box>

                                  {/* Skills */}
                                  {request.sender.skills.length > 0 && (
                                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                                      {request.sender.skills.slice(0, 5).map((skill) => (
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
                                      {request.sender.skills.length > 5 && (
                                        <Chip
                                          label={`+${request.sender.skills.length - 5}`}
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
                                  )}

                                  {/* Message */}
                                  {request.message && (
                                    <Paper sx={{ p: 1.5, backgroundColor: '#F9FAFB', borderRadius: 1 }}>
                                      <Typography variant="body2" sx={{ color: '#4B5563', fontStyle: 'italic' }}>
                                        "{request.message}"
                                      </Typography>
                                    </Paper>
                                  )}

                                  {/* Time */}
                                  <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                                    Sent{' '}
                                    {new Date(request.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </Typography>
                                </Stack>
                              </Box>

                              {/* Actions */}
                              <Stack direction="column" spacing={1} sx={{ minWidth: 120 }}>
                                <Button
                                  fullWidth
                                  variant="contained"
                                  startIcon={<UserCheck size={16} />}
                                  onClick={() =>
                                    handleAccept(request.id, `${request.sender.firstName} ${request.sender.lastName}`)
                                  }
                                  disabled={isLoading}
                                  sx={{
                                    backgroundColor: '#10B981',
                                    textTransform: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                      backgroundColor: '#059669',
                                    },
                                  }}
                                >
                                  Accept
                                </Button>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  startIcon={<UserX size={16} />}
                                  onClick={() => handleIgnore(request.id)}
                                  disabled={isLoading}
                                  sx={{
                                    textTransform: 'none',
                                    borderColor: '#9CA3AF',
                                    color: '#6B7280',
                                    fontSize: '0.85rem',
                                    '&:hover': {
                                      borderColor: '#6B7280',
                                      backgroundColor: '#F9FAFB',
                                    },
                                  }}
                                >
                                  Ignore
                                </Button>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Stack>
              )}
            </Box>
          )}

          {/* Sent Requests */}
          {activeTab === 1 && (
            <Box>
              {sentRequests.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                  <Clock size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                    No sent requests
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
                    You haven't sent any connection requests yet
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/connections/discover')}
                    sx={{
                      backgroundColor: '#6C47FF',
                      textTransform: 'none',
                      px: 3,
                      '&:hover': {
                        backgroundColor: '#5A3AD6',
                      },
                    }}
                  >
                    Find People to Connect
                  </Button>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  <AnimatePresence>
                    {sentRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card
                          sx={{
                            borderRadius: 2,
                            border: '1px solid #E5E7EB',
                            opacity: 0.9,
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2.5} alignItems="center">
                              {/* Avatar */}
                              <Avatar
                                src={request.sender.avatar}
                                sx={{ width: 56, height: 56, cursor: 'pointer' }}
                                onClick={() => navigate(`/profile/${request.receiverId}`)}
                              >
                                {request.sender.firstName[0]}
                                {request.sender.lastName[0]}
                              </Avatar>

                              {/* Content */}
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  Request sent to user
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                  Sent{' '}
                                  {new Date(request.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </Typography>
                              </Box>

                              {/* Status */}
                              <Chip
                                label="Pending"
                                size="small"
                                icon={<Clock size={14} />}
                                sx={{
                                  backgroundColor: '#FEF3C7',
                                  color: '#92400E',
                                  fontWeight: 600,
                                }}
                              />
                            </Stack>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Stack>
              )}
            </Box>
          )}
        </motion.div>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConnectionRequests;

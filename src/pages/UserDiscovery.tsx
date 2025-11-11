import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  Avatar,
  Button,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { Search, Users, UserPlus, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useConnections } from '../contexts/ConnectionContext';

const UserDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchUsers,
    getPeopleYouMayKnow,
    sendConnectionRequest,
    getConnectionStatus,
    isLoading,
  } = useConnections();

  const [searchQuery, setSearchQuery] = useState('');
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Get search results or recommendations
  const searchResults = useMemo(() => {
    if (searchQuery.trim()) {
      return searchUsers(searchQuery);
    }
    return [];
  }, [searchQuery, searchUsers]);

  const recommendations = useMemo(() => {
    return getPeopleYouMayKnow();
  }, [getPeopleYouMayKnow]);

  const displayUsers = searchQuery.trim() ? searchResults : recommendations;

  const handleConnectClick = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setConnectDialogOpen(true);
  };

  const handleSendRequest = async () => {
    if (!selectedUserId) return;

    try {
      await sendConnectionRequest(selectedUserId, connectionMessage || undefined);
      setSnackbar({
        open: true,
        message: `Connection request sent to ${selectedUserName}!`,
        severity: 'success',
      });
      setConnectDialogOpen(false);
      setConnectionMessage('');
      setSelectedUserId(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send connection request',
        severity: 'error',
      });
    }
  };

  const getStatusButton = (user: any) => {
    const status = getConnectionStatus(user.id);

    switch (status) {
      case 'connected':
        return (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<MessageCircle size={16} />}
            onClick={() => navigate('/chatrooms')}
            sx={{
              textTransform: 'none',
              borderColor: '#6C47FF',
              color: '#6C47FF',
              fontSize: '0.85rem',
              '&:hover': {
                borderColor: '#5A3AD6',
                backgroundColor: '#F5F3FF',
              },
            }}
          >
            Message
          </Button>
        );
      case 'pending_sent':
        return (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Clock size={16} />}
            disabled
            sx={{
              textTransform: 'none',
              borderColor: '#FCD34D',
              color: '#92400E',
              fontSize: '0.85rem',
            }}
          >
            Request Sent
          </Button>
        );
      case 'pending_received':
        return (
          <Button
            fullWidth
            variant="contained"
            startIcon={<CheckCircle size={16} />}
            onClick={() => navigate('/connections/requests')}
            sx={{
              textTransform: 'none',
              backgroundColor: '#10B981',
              fontSize: '0.85rem',
              '&:hover': {
                backgroundColor: '#059669',
              },
            }}
          >
            Respond to Request
          </Button>
        );
      default:
        return (
          <Button
            fullWidth
            variant="contained"
            startIcon={<UserPlus size={16} />}
            onClick={() => handleConnectClick(user.id, `${user.firstName} ${user.lastName}`)}
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              backgroundColor: '#6C47FF',
              fontSize: '0.85rem',
              '&:hover': {
                backgroundColor: '#5A3AD6',
              },
            }}
          >
            Connect
          </Button>
        );
    }
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
                Discover People
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Find and connect with students and faculty
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<UserPlus size={20} />}
                onClick={() => navigate('/connections/requests')}
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
                Requests
              </Button>
              <Button
                variant="contained"
                startIcon={<Users size={20} />}
                onClick={() => navigate('/connections')}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#6C47FF',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#5A3AD6',
                  },
                }}
              >
                My Connections
              </Button>
            </Stack>
          </Stack>

          {/* Search Bar */}
          <Paper sx={{ p: 2.5, mb: 4, borderRadius: 2 }}>
            <TextField
              fullWidth
              placeholder="Search people by name, department, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Section Title */}
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
            {searchQuery.trim() ? `Search Results (${displayUsers.length})` : 'People You May Know'}
          </Typography>

          {searchQuery.trim() && displayUsers.length === 0 && (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
              <Search size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
              <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                No users found
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                Try searching with different keywords
              </Typography>
            </Paper>
          )}

          {/* User Cards Grid */}
          {displayUsers.length > 0 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2.5,
              }}
            >
              <AnimatePresence>
                {displayUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 2,
                        border: '1px solid #E5E7EB',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack spacing={2}>
                          {/* Avatar and Name */}
                          <Stack alignItems="center" spacing={1.5}>
                            <Avatar
                              src={user.avatar}
                              sx={{ width: 72, height: 72, cursor: 'pointer' }}
                              onClick={() => navigate(`/profile/${user.id}`)}
                            >
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </Avatar>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  '&:hover': { color: '#6C47FF' },
                                }}
                                onClick={() => navigate(`/profile/${user.id}`)}
                              >
                                {user.firstName} {user.lastName}
                              </Typography>
                              <Chip
                                label={user.role === 'student' ? 'Student' : 'Faculty'}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  mt: 0.5,
                                  backgroundColor: user.role === 'student' ? '#EFF6FF' : '#F0FDF4',
                                  color: user.role === 'student' ? '#2563EB' : '#16A34A',
                                }}
                              />
                            </Box>
                          </Stack>

                          <Divider />

                          {/* Department/Designation */}
                          <Typography
                            variant="body2"
                            sx={{ color: '#6B7280', fontSize: '0.85rem', textAlign: 'center' }}
                          >
                            {user.department || user.designation || 'No department'}
                          </Typography>

                          {/* Mutual Connections */}
                          {user.mutualConnectionsCount && user.mutualConnectionsCount > 0 && (
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                              <Users size={14} color="#6B7280" />
                              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                {user.mutualConnectionsCount} mutual{' '}
                                {user.mutualConnectionsCount === 1 ? 'connection' : 'connections'}
                              </Typography>
                            </Stack>
                          )}

                          {/* Skills */}
                          {user.skills.length > 0 && (
                            <Stack direction="row" flexWrap="wrap" gap={0.5} justifyContent="center">
                              {user.skills.slice(0, 3).map((skill) => (
                                <Chip
                                  key={skill}
                                  label={skill}
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: '0.65rem',
                                    backgroundColor: '#F3F4F6',
                                    color: '#374151',
                                  }}
                                />
                              ))}
                              {user.skills.length > 3 && (
                                <Chip
                                  label={`+${user.skills.length - 3}`}
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: '0.65rem',
                                    backgroundColor: '#E5E7EB',
                                    color: '#6B7280',
                                  }}
                                />
                              )}
                            </Stack>
                          )}

                          {/* Action Button */}
                          <Stack direction="row" spacing={1}>
                            {getStatusButton(user)}
                            <Button
                              variant="outlined"
                              onClick={() => navigate(`/profile/${user.id}`)}
                              sx={{
                                textTransform: 'none',
                                minWidth: 80,
                                borderColor: '#E5E7EB',
                                color: '#6B7280',
                                fontSize: '0.85rem',
                                '&:hover': {
                                  borderColor: '#9CA3AF',
                                },
                              }}
                            >
                              View
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          )}
        </motion.div>
      </Container>

      {/* Connect Dialog */}
      <Dialog
        open={connectDialogOpen}
        onClose={() => setConnectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Connection Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#6B7280' }}>
            Send a connection request to {selectedUserName}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Add a message (optional)"
            value={connectionMessage}
            onChange={(e) => setConnectionMessage(e.target.value)}
            placeholder="Hi, I'd like to connect with you..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSendRequest}
            variant="contained"
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              backgroundColor: '#6C47FF',
              '&:hover': {
                backgroundColor: '#5A3AD6',
              },
            }}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
    </Box>
  );
};

export default UserDiscovery;

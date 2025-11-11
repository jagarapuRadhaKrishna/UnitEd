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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Search, Users, Mail, UserMinus, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useConnections } from '../contexts/ConnectionContext';

const Connections: React.FC = () => {
  const navigate = useNavigate();
  const { removeConnection, isLoading } = useConnections();
  const { connections } = useConnections();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'faculty'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'recent'>('name');
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  // Filter and sort connections
  const filteredConnections = useMemo(() => {
    let filtered = [...connections];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conn => {
        const fullName = `${conn.connectedUser.firstName} ${conn.connectedUser.lastName}`.toLowerCase();
        const department = conn.connectedUser.department?.toLowerCase() || '';
        const skills = conn.connectedUser.skills?.join(' ').toLowerCase() || '';
        return fullName.includes(query) || department.includes(query) || skills.includes(query);
      });
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(conn => conn.connectedUser.role === roleFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.connectedUser.firstName} ${a.connectedUser.lastName}`;
        const nameB = `${b.connectedUser.firstName} ${b.connectedUser.lastName}`;
        return nameA.localeCompare(nameB);
      } else {
        return new Date(b.connectedAt).getTime() - new Date(a.connectedAt).getTime();
      }
    });

    return filtered;
  }, [connections, searchQuery, roleFilter, sortBy]);

  const handleRemoveClick = (connectionId: string) => {
    setSelectedConnection(connectionId);
    setRemoveDialogOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (selectedConnection) {
      await removeConnection(selectedConnection);
      setRemoveDialogOpen(false);
      setSelectedConnection(null);
    }
  };

  const handleMessage = (_userId: string) => {
    // Navigate to chatrooms or direct message
    navigate(`/chatrooms`);
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
                My Connections
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                {connections.length} {connections.length === 1 ? 'connection' : 'connections'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Users size={20} />}
              onClick={() => navigate('/connections/discover')}
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
              Discover People
            </Button>
          </Stack>

          {/* Filters */}
          <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Search connections by name, department, or skills..."
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
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={roleFilter}
                    label="Role"
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    startAdornment={
                      <InputAdornment position="start">
                        <Filter size={18} color="#6B7280" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="student">Students</MenuItem>
                    <MenuItem value="faculty">Faculty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <MenuItem value="name">Name (A-Z)</MenuItem>
                    <MenuItem value="recent">Recently Connected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Connections List */}
          {filteredConnections.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
              <Users size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
              <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                {searchQuery || roleFilter !== 'all' ? 'No connections found' : 'No connections yet'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
                {searchQuery || roleFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start connecting with people to grow your network'}
              </Typography>
              {!searchQuery && roleFilter === 'all' && (
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
              )}
            </Paper>
          ) : (
            <Grid container spacing={2.5}>
              <AnimatePresence>
                {filteredConnections.map((connection, index) => (
                  <Grid item xs={12} sm={6} md={4} key={connection.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
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
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                              <Avatar
                                src={connection.connectedUser.avatar}
                                sx={{ width: 56, height: 56, cursor: 'pointer' }}
                                onClick={() => navigate(`/profile/${connection.connectedUserId}`)}
                              >
                                {connection.connectedUser.firstName[0]}
                                {connection.connectedUser.lastName[0]}
                              </Avatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    '&:hover': { color: '#6C47FF' },
                                  }}
                                  onClick={() => navigate(`/profile/${connection.connectedUserId}`)}
                                >
                                  {connection.connectedUser.firstName} {connection.connectedUser.lastName}
                                </Typography>
                                <Chip
                                  label={connection.connectedUser.role === 'student' ? 'Student' : 'Faculty'}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    backgroundColor: connection.connectedUser.role === 'student' ? '#EFF6FF' : '#F0FDF4',
                                    color: connection.connectedUser.role === 'student' ? '#2563EB' : '#16A34A',
                                    mt: 0.5,
                                  }}
                                />
                              </Box>
                            </Stack>

                            {/* Department/Designation */}
                            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.85rem' }}>
                              {connection.connectedUser.department || connection.connectedUser.designation || 'No department'}
                            </Typography>

                            {/* Skills */}
                            <Stack direction="row" flexWrap="wrap" gap={0.5}>
                              {connection.connectedUser.skills.slice(0, 3).map((skill) => (
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
                              {connection.connectedUser.skills.length > 3 && (
                                <Chip
                                  label={`+${connection.connectedUser.skills.length - 3}`}
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

                            {/* Connected Date */}
                            <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.7rem' }}>
                              Connected {new Date(connection.connectedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </Typography>

                            {/* Actions */}
                            <Stack direction="row" spacing={1}>
                              <Button
                                fullWidth
                                size="small"
                                variant="outlined"
                                startIcon={<Mail size={16} />}
                                onClick={() => handleMessage(connection.connectedUserId)}
                                sx={{
                                  textTransform: 'none',
                                  borderColor: '#6C47FF',
                                  color: '#6C47FF',
                                  fontSize: '0.8rem',
                                  py: 0.5,
                                  '&:hover': {
                                    borderColor: '#5A3AD6',
                                    backgroundColor: '#F5F3FF',
                                  },
                                }}
                              >
                                Message
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleRemoveClick(connection.id)}
                                sx={{
                                  minWidth: 40,
                                  p: 0.5,
                                  borderColor: '#EF4444',
                                  color: '#EF4444',
                                  '&:hover': {
                                    borderColor: '#DC2626',
                                    backgroundColor: '#FEF2F2',
                                  },
                                }}
                              >
                                <UserMinus size={16} />
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </motion.div>
      </Container>

      {/* Remove Connection Dialog */}
      <Dialog open={removeDialogOpen} onClose={() => setRemoveDialogOpen(false)}>
        <DialogTitle>Remove Connection</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this connection? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemove}
            variant="contained"
            color="error"
            disabled={isLoading}
            sx={{ textTransform: 'none' }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Connections;

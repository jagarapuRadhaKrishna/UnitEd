import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Chip,
  Avatar,
  Grid,
  Divider,
  Alert,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Mail,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Invitation } from '../types';
import {
  getUserInvitations,
  markInvitationSeen,
  respondToInvitation,
} from '../services/invitationService';

const InvitationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  useEffect(() => {
    if (user) {
      loadInvitations();
    }
  }, [user]);

  const loadInvitations = () => {
    if (!user) return;
    const userInvites = getUserInvitations(user.id);
    setInvitations(userInvites);
  };

  const handleViewInvitation = (invitation: Invitation) => {
    // Mark as seen
    if (!invitation.seenAt) {
      markInvitationSeen(invitation.id, user!.id);
      loadInvitations();
    }
    // Navigate to post detail
    navigate(`/post/${invitation.postId}`);
  };

  const handleRespond = (invitationId: string, action: 'accepted' | 'declined') => {
    if (!user) return;
    try {
      respondToInvitation(invitationId, user.id, action);
      loadInvitations();
      
      if (action === 'accepted') {
        // Navigate to post to apply
        const invitation = invitations.find((inv) => inv.id === invitationId);
        if (invitation) {
          navigate(`/post/${invitation.postId}`);
        }
      }
    } catch (error: any) {
      console.error('Error responding to invitation:', error);
      alert(error.message);
    }
  };

  const filteredInvitations = invitations.filter((inv) => {
    if (filter === 'all') return true;
    return inv.status === filter;
  });

  const stats = {
    total: invitations.length,
    pending: invitations.filter((inv) => inv.status === 'pending').length,
    accepted: invitations.filter((inv) => inv.status === 'accepted').length,
    declined: invitations.filter((inv) => inv.status === 'declined').length,
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                My Invitations
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                View and respond to project invitations
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Chip
                icon={<Mail size={16} />}
                label={`${stats.total} Total`}
                sx={{ backgroundColor: '#F3F4F6', fontWeight: 600 }}
              />
              <Chip
                icon={<CheckCircle size={16} />}
                label={`${stats.pending} Pending`}
                color="warning"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Stack>
        </motion.div>

        {/* Filter Tabs */}
        <Paper sx={{ mb: 3, p: 2 }}>
          <Stack direction="row" spacing={2}>
            {(['all', 'pending', 'accepted', 'declined'] as const).map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? 'contained' : 'outlined'}
                onClick={() => setFilter(filterOption)}
                sx={{
                  textTransform: 'capitalize',
                  ...(filter === filterOption && {
                    backgroundColor: '#6C47FF',
                    '&:hover': { backgroundColor: '#5A3AD6' },
                  }),
                }}
              >
                {filterOption}
                {filterOption !== 'all' && ` (${stats[filterOption]})`}
              </Button>
            ))}
          </Stack>
        </Paper>

        {/* Invitations List */}
        {filteredInvitations.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Mail size={64} color="#D1D5DB" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
              No {filter !== 'all' ? filter : ''} invitations
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              {filter === 'pending'
                ? "You don't have any pending invitations"
                : "You haven't received any invitations yet"}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredInvitations.map((invitation, index) => (
              <Grid item xs={12} key={invitation.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    sx={{
                      borderLeft: `4px solid ${
                        invitation.status === 'pending'
                          ? '#F59E0B'
                          : invitation.status === 'accepted'
                          ? '#10B981'
                          : '#6B7280'
                      }`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        {/* Inviter Avatar */}
                        <Avatar
                          src={invitation.inviter.avatar}
                          sx={{
                            width: 64,
                            height: 64,
                            backgroundColor: '#6C47FF',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                          }}
                        >
                          {invitation.inviter.name.split(' ').map((n) => n[0]).join('')}
                        </Avatar>

                        {/* Invitation Details */}
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {invitation.post.title}
                            </Typography>
                            <Chip
                              label={invitation.status}
                              size="small"
                              sx={{
                                textTransform: 'capitalize',
                                backgroundColor:
                                  invitation.status === 'pending'
                                    ? '#FEF3C7'
                                    : invitation.status === 'accepted'
                                    ? '#D1FAE5'
                                    : '#F3F4F6',
                                color:
                                  invitation.status === 'pending'
                                    ? '#92400E'
                                    : invitation.status === 'accepted'
                                    ? '#065F46'
                                    : '#6B7280',
                                fontWeight: 600,
                              }}
                            />
                            {!invitation.seenAt && (
                              <Chip label="New" size="small" color="error" />
                            )}
                          </Stack>

                          <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                            <strong>{invitation.inviter.name}</strong> invited you to apply for this{' '}
                            {invitation.post.purpose.toLowerCase()}
                          </Typography>

                          <Stack direction="row" spacing={3} flexWrap="wrap">
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Calendar size={16} color="#6B7280" />
                              <Typography variant="caption" color="text.secondary">
                                Invited {new Date(invitation.createdAt).toLocaleDateString()}
                              </Typography>
                            </Stack>
                            {invitation.post.deadline && (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Calendar size={16} color="#EF4444" />
                                <Typography variant="caption" sx={{ color: '#EF4444' }}>
                                  Deadline: {new Date(invitation.post.deadline).toLocaleDateString()}
                                </Typography>
                              </Stack>
                            )}
                            {invitation.seenAt && (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Eye size={16} color="#10B981" />
                                <Typography variant="caption" sx={{ color: '#10B981' }}>
                                  Viewed {new Date(invitation.seenAt).toLocaleDateString()}
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>

                    <Divider />

                    <CardActions sx={{ p: 2 }}>
                      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                        <Button
                          variant="outlined"
                          startIcon={<ExternalLink size={16} />}
                          onClick={() => handleViewInvitation(invitation)}
                          sx={{
                            flex: 1,
                            textTransform: 'none',
                            borderColor: '#6C47FF',
                            color: '#6C47FF',
                            '&:hover': {
                              borderColor: '#5A3AD6',
                              backgroundColor: '#F5F3FF',
                            },
                          }}
                        >
                          View Post
                        </Button>

                        {invitation.status === 'pending' && (
                          <>
                            <Button
                              variant="contained"
                              startIcon={<CheckCircle size={16} />}
                              onClick={() => handleRespond(invitation.id, 'accepted')}
                              sx={{
                                flex: 1,
                                textTransform: 'none',
                                backgroundColor: '#10B981',
                                '&:hover': { backgroundColor: '#059669' },
                              }}
                            >
                              Accept & Apply
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<XCircle size={16} />}
                              onClick={() => handleRespond(invitation.id, 'declined')}
                              sx={{
                                textTransform: 'none',
                                borderColor: '#EF4444',
                                color: '#EF4444',
                                '&:hover': {
                                  borderColor: '#DC2626',
                                  backgroundColor: '#FEF2F2',
                                },
                              }}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </Stack>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default InvitationsPage;

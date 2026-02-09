import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Stack,
  Typography,
  Button,
  Chip,
  Avatar,
  Box,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { Invitation } from '../../services/invitationApiService';

interface InvitationCardProps {
  invitation: Invitation;
  type: 'sent' | 'received';
  isLoading?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onView?: () => void;
  index?: number;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  type,
  isLoading = false,
  onAccept,
  onReject,
  onCancel,
  onView,
  index = 0,
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#FEF3C7', text: '#92400E', icon: '#F59E0B' };
      case 'ACCEPTED':
        return { bg: '#D1FAE5', text: '#065F46', icon: '#10B981' };
      case 'REJECTED':
        return { bg: '#FEE2E2', text: '#991B1B', icon: '#EF4444' };
      case 'CANCELLED':
        return { bg: '#F3F4F6', text: '#6B7280', icon: '#9CA3AF' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', icon: '#9CA3AF' };
    }
  };

  const statusColors = getStatusColor(invitation.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card
          sx={{
            borderLeft: `4px solid ${statusColors.icon}`,
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="flex-start">
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  backgroundColor: '#6C47FF',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {type === 'sent'
                  ? invitation.inviteeName?.split(' ')?.map((n: string) => n[0]).join('') || 'U'
                  : invitation.inviterName?.split(' ')?.map((n: string) => n[0]).join('') || 'U'}
              </Avatar>

              {/* Content */}
              <Box sx={{ flex: 1 }}>
                {/* Header */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {invitation.post?.title || 'Project Invitation'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      {type === 'sent' ? 'Invited to' : 'Invited by'}{' '}
                      <strong>
                        {type === 'sent'
                          ? invitation.inviteeName || 'Unknown User'
                          : invitation.inviterName || 'Unknown User'}
                      </strong>
                    </Typography>
                  </Box>
                  <Chip
                    label={invitation.status}
                    size="small"
                    sx={{
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  />
                </Stack>

                {/* Message */}
                {invitation.message && (
                  <Box
                    sx={{
                      my: 2,
                      p: 2,
                      backgroundColor: '#F9FAFB',
                      borderRadius: 1,
                      borderLeft: `3px solid #6C47FF`,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <MessageSquare size={16} color="#6C47FF" style={{ marginTop: 2 }} />
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        {invitation.message}
                      </Typography>
                    </Stack>
                  </Box>
                )}

                {/* Dates */}
                <Stack
                  direction="row"
                  spacing={3}
                  flexWrap="wrap"
                  sx={{ mt: 2, pt: 2, borderTop: '1px solid #E5E7EB' }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Calendar size={14} color="#6B7280" />
                    <Typography variant="caption" color="text.secondary">
                      {type === 'sent' ? 'Sent' : 'Received'}: {formatDate(invitation.createdAt)}
                    </Typography>
                  </Stack>
                  {invitation.respondedAt && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Calendar size={14} color="#10B981" />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#10B981',
                        }}
                      >
                        Responded: {formatDate(invitation.respondedAt)}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Stack>
          </CardContent>

          <Divider />

          {/* Actions */}
          <CardActions sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} sx={{ width: '100%' }} flexWrap="wrap">
              {/* View Post Button */}
              {onView && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={onView}
                  disabled={isLoading}
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
                  View Post
                </Button>
              )}

              {/* For Received Invitations */}
              {type === 'received' && invitation.status === 'PENDING' && (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={16} /> : <CheckCircle size={14} />}
                    onClick={onAccept}
                    disabled={isLoading}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: '#10B981',
                      '&:hover': { backgroundColor: '#059669' },
                      '&:disabled': { backgroundColor: '#D1D5DB' },
                    }}
                  >
                    {isLoading ? 'Processing...' : 'Accept'}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={isLoading ? <CircularProgress size={16} /> : <XCircle size={14} />}
                    onClick={onReject}
                    disabled={isLoading}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#EF4444',
                      color: '#EF4444',
                      '&:hover': {
                        borderColor: '#DC2626',
                        backgroundColor: '#FEF2F2',
                      },
                      '&:disabled': {
                        borderColor: '#D1D5DB',
                        color: '#D1D5DB',
                      },
                    }}
                  >
                    {isLoading ? 'Processing...' : 'Decline'}
                  </Button>
                </>
              )}

              {/* For Sent Invitations */}
              {type === 'sent' && invitation.status === 'PENDING' && onCancel && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={isLoading ? <CircularProgress size={16} /> : <Trash2 size={14} />}
                  onClick={() => setOpenDialog(true)}
                  disabled={isLoading}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#EF4444',
                    color: '#EF4444',
                    ml: 'auto',
                    '&:hover': {
                      borderColor: '#DC2626',
                      backgroundColor: '#FEF2F2',
                    },
                    '&:disabled': {
                      borderColor: '#D1D5DB',
                      color: '#D1D5DB',
                    },
                  }}
                >
                  {isLoading ? 'Processing...' : 'Cancel'}
                </Button>
              )}

              {/* Status Badge for Non-Pending */}
              {invitation.status !== 'PENDING' && (
                <Box sx={{ ml: 'auto' }}>
                  <Chip
                    size="small"
                    label={`${invitation.status} on ${formatDate(invitation.respondedAt || invitation.createdAt)}`}
                    sx={{
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                    }}
                  />
                </Box>
              )}
            </Stack>
          </CardActions>
        </Card>
      </motion.div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cancel Invitation?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this invitation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>No, Keep It</Button>
          <Button
            onClick={() => {
              onCancel?.();
              setOpenDialog(false);
            }}
            color="error"
            variant="contained"
            disabled={isLoading}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InvitationCard;

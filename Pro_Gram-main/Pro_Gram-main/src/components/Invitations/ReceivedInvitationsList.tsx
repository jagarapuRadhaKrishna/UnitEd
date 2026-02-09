import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import { Mail } from 'lucide-react';
import { Invitation, invitationApiService } from '../../services/invitationApiService';
import InvitationCard from './InvitationCard';

const ITEMS_PER_PAGE = 10;

export const ReceivedInvitationsList: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'>('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadInvitations();
  }, [page, statusFilter]);

  const loadInvitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await invitationApiService.getReceivedInvitations(
        page,
        ITEMS_PER_PAGE,
        statusFilter === 'ALL' ? undefined : statusFilter
      );

      if (response.success) {
        setInvitations(response.data || []);
        if (response.pagination) {
          setTotal(response.pagination.total);
        }
      } else {
        setError('Failed to load invitations');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId: string) => {
    setActionLoading(invitationId);
    try {
      const response = await invitationApiService.acceptInvitation(invitationId);
      if (response.success) {
        setSuccessMessage('Invitation accepted! You are now part of the team.');
        loadInvitations();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to accept invitation');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to accept invitation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (invitationId: string) => {
    setActionLoading(invitationId);
    try {
      const response = await invitationApiService.rejectInvitation(invitationId);
      if (response.success) {
        setSuccessMessage('Invitation declined.');
        loadInvitations();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to decline invitation');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to decline invitation');
    } finally {
      setActionLoading(null);
    }
  };

  const stats = {
    total: invitations.length,
    pending: invitations.filter((inv) => inv.status === 'PENDING').length,
    accepted: invitations.filter((inv) => inv.status === 'ACCEPTED').length,
    rejected: invitations.filter((inv) => inv.status === 'REJECTED').length,
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <Box>
      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#F9FAFB' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <Box sx={{ minWidth: 200 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
            >
              <MenuItem value="ALL">All Invitations</MenuItem>
              <MenuItem value="PENDING">Pending - Action Needed</MenuItem>
              <MenuItem value="ACCEPTED">Accepted</MenuItem>
              <MenuItem value="REJECTED">Declined</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </TextField>
          </Box>
          <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ flex: 1 }}>
            {stats.pending > 0 && (
              <Chip
                label={`${stats.pending} Pending - Action Needed`}
                color="warning"
                sx={{ fontWeight: 600 }}
              />
            )}
            {stats.accepted > 0 && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Accepted
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#10B981' }}>
                  {stats.accepted}
                </Typography>
              </Box>
            )}
            {stats.rejected > 0 && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Declined
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#EF4444' }}>
                  {stats.rejected}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!loading && invitations.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#F9FAFB' }}>
          <Mail size={64} color="#D1D5DB" style={{ marginBottom: 16 }} />
          <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
            No received invitations
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
            {statusFilter === 'ALL'
              ? "You haven't received any invitations yet"
              : `You don't have any ${statusFilter.toLowerCase()} invitations`}
          </Typography>
        </Paper>
      )}

      {/* Invitations List */}
      {!loading && invitations.length > 0 && (
        <Stack spacing={2}>
          {invitations.map((invitation, index) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              type="received"
              index={index}
              isLoading={actionLoading === invitation.id}
              onAccept={() => handleAccept(invitation.id)}
              onReject={() => handleReject(invitation.id)}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default ReceivedInvitationsList;

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, Eye, Loader2, MessageCircle, Search, XCircle } from 'lucide-react';

interface AppItem {
  id: string;
  status: string;
  applied_at: string;
  reviewed_at: string | null;
  post_id: string;
  post_title: string;
  post_purpose: string;
}

interface PostSummary {
  id: string;
  title: string;
  purpose: string;
}

const AcceptedApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [applications, setApplications] = useState<AppItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const { data: apps } = await supabase
        .from('applications')
        .select('id, status, applied_at, reviewed_at, post_id')
        .eq('applicant_id', user.id)
        .order('applied_at', { ascending: false });

      if (!apps || apps.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      const postIds = [...new Set(apps.map((a) => a.post_id))];
      const { data: posts } = await supabase.from('posts').select('id, title, purpose').in('id', postIds);

      const postMap: Record<string, PostSummary> = {};
      (posts || []).forEach((p) => {
        postMap[p.id] = p;
      });

      setApplications(
        apps.map((a) => {
          const post = postMap[a.post_id];
          return {
            id: a.id,
            status: a.status,
            applied_at: a.applied_at,
            reviewed_at: a.reviewed_at,
            post_id: a.post_id,
            post_title: post?.title || 'Unknown',
            post_purpose: post?.purpose || '',
          };
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchApplications();
  }, [user?.id, fetchApplications]);

  const statusFilters = ['All', 'accepted', 'applied', 'shortlisted', 'rejected'];

  const filtered = applications.filter((app) => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesSearch = !searchQuery || app.post_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applications.length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    pending: applications.filter((a) => a.status === 'applied').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
  };

  const getStatusVisual = (status: string) => {
    switch (status) {
      case 'accepted':
        return { bg: '#D1FAE5', color: '#10B981', icon: <CheckCircle size={16} /> };
      case 'applied':
        return { bg: '#FEF3C7', color: '#F59E0B', icon: <Clock size={16} /> };
      case 'shortlisted':
        return { bg: '#DBEAFE', color: '#2563EB', icon: <Eye size={16} /> };
      default:
        return { bg: '#FEE2E2', color: '#EF4444', icon: <XCircle size={16} /> };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 18 }}>
        <Loader2 size={34} className="animate-spin" color="#6C47FF" />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.7 }}>
              My Applications
            </Typography>
            <Typography sx={{ color: '#6B7280' }}>Track and manage all your project applications</Typography>
          </Box>
        </motion.div>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 2, mb: 3 }}>
          {[
            { label: 'Total Applications', value: stats.total, color: '#6C47FF' },
            { label: 'Accepted', value: stats.accepted, color: '#10B981' },
            { label: 'Pending', value: stats.pending, color: '#F59E0B' },
            { label: 'Shortlisted', value: stats.shortlisted, color: '#2563EB' },
          ].map((stat) => (
            <Card key={stat.label} sx={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
              <CardContent sx={{ p: 2.2 }}>
                <Typography sx={{ fontSize: 30, fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                <Typography sx={{ color: '#6B7280', fontSize: 14 }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mb: 2.2 }}>
          <TextField
            placeholder="Search by project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: '8px',
              },
            }}
          />

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {statusFilters.map((status) => (
              <Button
                key={status}
                size="small"
                variant={filterStatus === status ? 'contained' : 'outlined'}
                onClick={() => setFilterStatus(status)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#D1D5DB',
                  color: filterStatus === status ? 'white' : '#4B5563',
                  backgroundColor: filterStatus === status ? '#6C47FF' : undefined,
                  '&:hover': { backgroundColor: filterStatus === status ? '#5936E8' : '#F3F4F6' },
                }}
              >
                {status === 'All' ? 'All' : `${status.charAt(0).toUpperCase()}${status.slice(1)}`}
              </Button>
            ))}
          </Stack>
        </Stack>

        <Typography sx={{ fontSize: 14, color: '#6B7280', mb: 1.8 }}>
          Showing {filtered.length} application{filtered.length !== 1 ? 's' : ''}
        </Typography>

        <Stack spacing={2}>
          {filtered.map((app, index) => {
            const status = getStatusVisual(app.status);
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <Card sx={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 0.3 }}>
                          {app.post_title}
                        </Typography>
                        <Typography sx={{ color: '#6B7280', mb: 1.3 }}>{app.post_purpose}</Typography>

                        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ color: '#6B7280', fontSize: 14 }}>
                          <Stack direction="row" spacing={0.6} alignItems="center">
                            <Calendar size={15} />
                            <Typography sx={{ fontSize: 14 }}>Applied: {new Date(app.applied_at).toLocaleDateString()}</Typography>
                          </Stack>
                          {app.reviewed_at && (
                            <Typography sx={{ fontSize: 14 }}>
                              Reviewed: {new Date(app.reviewed_at).toLocaleDateString()}
                            </Typography>
                          )}
                        </Stack>
                      </Box>

                      <Stack spacing={1.1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                        <Chip
                          icon={status.icon}
                          label={app.status}
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            backgroundColor: status.bg,
                            color: status.color,
                            '& .MuiChip-icon': { color: status.color },
                          }}
                        />

                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/post/${app.post_id}`)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              color: '#2563EB',
                              borderColor: '#2563EB',
                            }}
                          >
                            View Post
                          </Button>

                          {app.status === 'accepted' && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<MessageCircle size={14} />}
                              onClick={() => navigate(`/chatroom/${app.post_id}`)}
                              sx={{
                                backgroundColor: '#10B981',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { backgroundColor: '#059669' },
                              }}
                            >
                              Join Chatroom
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <Card sx={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
              <CardContent sx={{ py: 8, textAlign: 'center' }}>
                <Typography sx={{ color: '#6B7280', mb: 2 }}>No applications found</Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/home')}
                  sx={{
                    backgroundColor: '#2563EB',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#1D4ED8' },
                  }}
                >
                  Browse Opportunities
                </Button>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default AcceptedApplicationsPage;

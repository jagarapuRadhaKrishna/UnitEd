import React, { useEffect, useMemo, useState } from 'react';
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
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  Inbox,
  Loader2,
  MessageCircle,
  Send,
  Users,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePalette } from '@/hooks/usePalette';
import { isPostDeadlineReached, syncExpiredPosts, syncPostCurrentMembers } from '@/services/postAvailabilityService';

interface AppItem {
  id: string;
  status: string;
  applied_at: string;
  post_id: string;
  chatroom_id?: string | null;
  post_title: string;
  post_purpose: string;
  author_name: string;
}

interface ReceivedAppItem {
  id: string;
  status: string;
  applied_at: string;
  post_id: string;
  post_title: string;
  applicant_name: string;
  applicant_id: string;
  applied_for_skill: string | null;
}

interface PostSummary {
  id: string;
  title: string;
  purpose: string;
  author_id: string;
  chatroom_id?: string | null;
}

const AppliedOpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark, colors } = usePalette();

  const [applications, setApplications] = useState<AppItem[]>([]);
  const [receivedApps, setReceivedApps] = useState<ReceivedAppItem[]>([]);
  const isFaculty = user?.role === 'faculty';
  const [firstPostId, setFirstPostId] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'sent' | 'received'>(isFaculty ? 'received' : 'sent');
  const [statusTab, setStatusTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'faculty') setViewMode('received');
  }, [user?.role]);

  useEffect(() => {
    if (user?.id) fetchAll();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAll = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await syncExpiredPosts();
      await Promise.all([fetchSentApplications(), fetchReceivedApplications()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentApplications = async () => {
    if (!user?.id) return;

    const { data: apps } = await supabase
      .from('applications')
      .select('id, status, applied_at, post_id')
      .eq('applicant_id', user.id)
      .order('applied_at', { ascending: false });

    if (!apps || apps.length === 0) {
      setApplications([]);
      return;
    }

    const postIds = [...new Set(apps.map((a) => a.post_id))];
    const { data: posts } = await supabase.from('posts').select('id, title, purpose, author_id, chatroom_id').in('id', postIds);
    const authorIds = [...new Set((posts || []).map((p) => p.author_id))];
    const { data: profiles } = await supabase.from('profiles').select('id, first_name, last_name').in('id', authorIds);

    const postMap: Record<string, PostSummary> = {};
    (posts || []).forEach((p) => {
      postMap[p.id] = p;
    });

    const profileMap: Record<string, string> = {};
    (profiles || []).forEach((p) => {
      profileMap[p.id] = `${p.first_name || ''} ${p.last_name || ''}`.trim();
    });

    setApplications(
      apps.map((a) => {
        const post = postMap[a.post_id];
        return {
          id: a.id,
          status: a.status,
          applied_at: a.applied_at,
          post_id: a.post_id,
          chatroom_id: post?.chatroom_id || null,
          post_title: post?.title || 'Unknown',
          post_purpose: post?.purpose || '',
          author_name: post ? profileMap[post.author_id] || 'Unknown' : 'Unknown',
        };
      })
    );
  };

  const fetchReceivedApplications = async () => {
    if (!user?.id) return;

    const { data: myPosts } = await supabase.from('posts').select('id, title').eq('author_id', user.id);
    if (!myPosts || myPosts.length === 0) {
      setFirstPostId(null);
      setReceivedApps([]);
      return;
    }

    setFirstPostId(myPosts[0]?.id || null);

    const postIds = myPosts.map((p) => p.id);
    const postTitleMap = new Map<string, string>();
    myPosts.forEach((p) => {
      postTitleMap.set(p.id, p.title);
    });

    const { data: apps } = await supabase
      .from('applications')
      .select('id, status, applied_at, post_id, applicant_id, applied_for_skill')
      .in('post_id', postIds)
      .order('applied_at', { ascending: false });

    if (!apps || apps.length === 0) {
      setReceivedApps([]);
      return;
    }

    const applicantIds = [...new Set(apps.map((a) => a.applicant_id))];
    const { data: profiles } = await supabase.from('profiles').select('id, first_name, last_name').in('id', applicantIds);

    const nameMap = new Map<string, string>();
    (profiles || []).forEach((p) => {
      nameMap.set(p.id, `${p.first_name || ''} ${p.last_name || ''}`.trim());
    });

    setReceivedApps(
      apps.map((a) => ({
        id: a.id,
        status: a.status,
        applied_at: a.applied_at,
        post_id: a.post_id,
        post_title: postTitleMap.get(a.post_id) || 'Unknown',
        applicant_name: nameMap.get(a.applicant_id) || 'Unknown',
        applicant_id: a.applicant_id,
        applied_for_skill: a.applied_for_skill,
      }))
    );
  };

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('my-apps-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, fetchAll)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const effectiveViewMode = isFaculty ? 'received' : viewMode;

  const filteredSent = useMemo(
    () => (statusTab === 'all' ? applications : applications.filter((a) => a.status === statusTab)),
    [applications, statusTab]
  );

  const filteredReceived = useMemo(
    () => (statusTab === 'all' ? receivedApps : receivedApps.filter((a) => a.status === statusTab)),
    [receivedApps, statusTab]
  );

  const getStatusVisual = (status: string) => {
    switch (status) {
      case 'accepted':
        return { bg: '#D1FAE5', color: '#10B981', icon: <CheckCircle size={16} /> };
      case 'applied':
        return { bg: '#FEF3C7', color: '#F59E0B', icon: <Clock size={16} /> };
      case 'shortlisted':
        return { bg: '#DBEAFE', color: '#2563EB', icon: <Users size={16} /> };
      case 'rejected':
        return { bg: '#FEE2E2', color: '#EF4444', icon: <XCircle size={16} /> };
      case 'withdrawn':
        return { bg: '#F3F4F6', color: '#6B7280', icon: <XCircle size={16} /> };
      default:
        return { bg: '#F3F4F6', color: '#6B7280', icon: <Clock size={16} /> };
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: 'accepted' | 'rejected' | 'shortlisted') => {
    setActionLoading(appId);

    try {
      const app = receivedApps.find((a) => a.id === appId);
      if (app && newStatus !== 'rejected') {
        const { data: post } = await supabase
          .from('posts')
          .select('status, deadline')
          .eq('id', app.post_id)
          .maybeSingle();

        if (!post || post.status !== 'active' || isPostDeadlineReached(post.deadline)) {
          toast.error('This post is no longer accepting new members');
          return;
        }
      }

      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', appId);

      if (error) throw error;
      if (app) {
        const notifTitle =
          newStatus === 'accepted'
            ? 'Application Accepted'
            : newStatus === 'rejected'
              ? 'Application Update'
              : 'Application Shortlisted';

        const notifMessage =
          newStatus === 'accepted'
            ? `Your application for "${app.post_title}" has been accepted! You can now join the chatroom.`
            : newStatus === 'rejected'
              ? `Your application for "${app.post_title}" was not selected.`
              : `Your application for "${app.post_title}" has been shortlisted!`;

        await supabase.from('notifications').insert({
          user_id: app.applicant_id,
          type: `application_${newStatus}`,
          title: notifTitle,
          message: notifMessage,
          link: newStatus === 'accepted' ? '/chatrooms' : '/applications',
          related_post_id: app.post_id,
          related_user_id: user?.id,
        });

        if (newStatus === 'accepted' && user?.id) {
          await createOrJoinChatroom(app.post_id, user.id, app.applicant_id);
        }
      }

      toast.success(`Application ${newStatus} successfully`);
      await fetchAll();
    } catch (err) {
      console.error('Error updating application:', err);
      toast.error('Failed to update application status');
    } finally {
      setActionLoading(null);
    }
  };

  const createOrJoinChatroom = async (postId: string, ownerId: string, applicantId: string) => {
    try {
      const { data: existingChatroom } = await supabase
        .from('chatrooms')
        .select('id')
        .eq('post_id', postId)
        .maybeSingle();

      let chatroomId: string;

      if (existingChatroom) {
        chatroomId = existingChatroom.id;
      } else {
        const { data: newChatroom, error: crError } = await supabase
          .from('chatrooms')
          .insert({ post_id: postId, status: 'active' })
          .select('id')
          .single();

        if (crError || !newChatroom) throw crError;

        chatroomId = newChatroom.id;

        await supabase.from('chatroom_members').insert({
          chatroom_id: chatroomId,
          user_id: ownerId,
          role: 'owner',
        });
      }

      const { data: existingMember } = await supabase
        .from('chatroom_members')
        .select('id')
        .eq('chatroom_id', chatroomId)
        .eq('user_id', applicantId)
        .maybeSingle();

      if (!existingMember) {
        await supabase.from('chatroom_members').insert({
          chatroom_id: chatroomId,
          user_id: applicantId,
          role: 'member',
        });
      }

      await supabase.from('posts').update({ chatroom_id: chatroomId, chatroom_enabled: true }).eq('id', postId);

      await supabase.from('messages').insert({
        chatroom_id: chatroomId,
        sender_id: ownerId,
        content: `${receivedApps.find((a) => a.post_id === postId)?.applicant_name || 'A new member'} has joined the team!`,
        type: 'system',
      });

      await syncPostCurrentMembers(postId);
    } catch (err) {
      console.error('Error creating chatroom:', err);
    }
  };

  const sentPendingCount = applications.filter((a) => a.status === 'applied').length;
  const sentAcceptedCount = applications.filter((a) => a.status === 'accepted').length;
  const sentRejectedCount = applications.filter((a) => a.status === 'rejected').length;

  const receivedPendingCount = receivedApps.filter((a) => a.status === 'applied').length;
  const receivedAcceptedCount = receivedApps.filter((a) => a.status === 'accepted').length;
  const receivedRejectedCount = receivedApps.filter((a) => a.status === 'rejected').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 18 }}>
        <Loader2 size={34} className="animate-spin" color="#6C47FF" />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.bg }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: colors.heading, mb: 0.7 }}>
              {isFaculty ? 'Received Applications' : 'My Applications'}
            </Typography>
            <Typography sx={{ color: colors.subtext }}>
              {isFaculty ? 'Track applications received on your posts' : 'Track sent and received applications'}
            </Typography>
          </Box>
        </motion.div>

        {!isFaculty && (
          <Stack direction="row" spacing={1.2} sx={{ mb: 2 }}>
            <Button
              variant={viewMode === 'sent' ? 'contained' : 'outlined'}
              startIcon={<Send size={16} />}
              onClick={() => {
                setViewMode('sent');
                setStatusTab('all');
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: viewMode === 'sent' ? colors.accent : (isDark ? colors.card : undefined),
                borderColor: isDark ? colors.border : '#D1D5DB',
                color: viewMode === 'sent' ? '#ffffff' : (isDark ? colors.heading : '#4B5563'),
                '&:hover': { backgroundColor: viewMode === 'sent' ? colors.accentHover : (isDark ? colors.card : '#F3F4F6') },
              }}
            >
              Sent ({applications.length})
            </Button>
            <Button
              variant={viewMode === 'received' ? 'contained' : 'outlined'}
              startIcon={<Inbox size={16} />}
              onClick={() => {
                setViewMode('received');
                setStatusTab('all');
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: viewMode === 'received' ? colors.accent : (isDark ? colors.card : undefined),
                borderColor: isDark ? colors.border : '#D1D5DB',
                color: viewMode === 'received' ? '#ffffff' : (isDark ? colors.heading : '#4B5563'),
                '&:hover': { backgroundColor: viewMode === 'received' ? colors.accentHover : (isDark ? colors.card : '#F3F4F6') },
              }}
            >
              Received ({receivedApps.length})
            </Button>
          </Stack>
        )}

        <Card
          sx={{
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            boxShadow: 'none',
            mb: 3,
            backgroundColor: colors.card,
          }}
        >
          <Tabs value={statusTab} onChange={(_, value) => setStatusTab(value)}>
            {effectiveViewMode === 'sent' ? (
              [
                { value: 'all', label: `All (${applications.length})` },
                { value: 'applied', label: `Pending (${sentPendingCount})` },
                { value: 'accepted', label: `Accepted (${sentAcceptedCount})` },
                { value: 'rejected', label: `Rejected (${sentRejectedCount})` },
              ].map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  sx={{ textTransform: 'none', fontWeight: 600, color: colors.heading }}
                />
              ))
            ) : (
              [
                { value: 'all', label: `All (${receivedApps.length})` },
                { value: 'applied', label: `Pending (${receivedPendingCount})` },
                { value: 'accepted', label: `Accepted (${receivedAcceptedCount})` },
                { value: 'rejected', label: `Rejected (${receivedRejectedCount})` },
              ].map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  sx={{ textTransform: 'none', fontWeight: 600, color: colors.heading }}
                />
              ))
            )}
          </Tabs>
        </Card>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${effectiveViewMode}-${statusTab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <Stack spacing={2.2}>
              {effectiveViewMode === 'sent' &&
                filteredSent.map((app, index) => {
                  const status = getStatusVisual(app.status);
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.42, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Card
                        sx={{
                          borderRadius: '12px',
                          border: `1px solid ${colors.border}`,
                          boxShadow: 'none',
                          backgroundColor: colors.card,
                          '&:hover': {
                            boxShadow: isDark ? '0 10px 28px rgba(0,0,0,0.35)' : '0 8px 24px rgba(17,24,39,0.08)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.heading, mb: 0.4 }}>
                                {app.post_title}
                              </Typography>
                              <Typography sx={{ color: colors.subtext, mb: 1.5 }}>
                                Posted by <strong>{app.author_name}</strong>
                              </Typography>

                              <Stack
                                direction="row"
                                spacing={2}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ color: colors.subtext, pt: 1.2, borderTop: `1px solid ${colors.border}` }}
                              >
                                <Stack direction="row" spacing={0.6} alignItems="center">
                                  <Users size={15} />
                                  <Typography sx={{ fontSize: 14 }}>{app.post_purpose}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={0.6} alignItems="center">
                                  <Calendar size={15} />
                                  <Typography sx={{ fontSize: 14 }}>Applied: {new Date(app.applied_at).toLocaleDateString()}</Typography>
                                </Stack>
                              </Stack>
                            </Box>

                            <Stack spacing={1.2} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
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

                              {app.status === 'accepted' && (
                                <Button
                                    variant="contained"
                                    startIcon={<MessageCircle size={16} />}
                                    onClick={() => navigate(`/chatroom/${app.chatroom_id ?? app.post_id}`)}
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
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}

              {effectiveViewMode === 'received' &&
                filteredReceived.map((app, index) => {
                  const status = getStatusVisual(app.status);
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.42, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Card
                        sx={{
                          borderRadius: '12px',
                          border: `1px solid ${colors.border}`,
                          boxShadow: 'none',
                          backgroundColor: colors.card,
                          '&:hover': {
                            boxShadow: isDark ? '0 10px 28px rgba(0,0,0,0.35)' : '0 8px 24px rgba(17,24,39,0.08)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.heading, mb: 0.4 }}>
                                {app.post_title}
                              </Typography>

                              <Typography sx={{ color: colors.subtext, mb: 0.8 }}>
                                From{' '}
                                <Box
                                  component="span"
                                  onClick={() => navigate(`/profile/${app.applicant_id}`)}
                                  sx={{
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    color: colors.accent,
                                    '&:hover': { textDecoration: 'underline' },
                                  }}
                                >
                                  {app.applicant_name}
                                </Box>
                              </Typography>

                              {app.applied_for_skill && (
                                <Typography sx={{ fontSize: 13, color: colors.subtext, mb: 1.3 }}>
                                  Skill: {app.applied_for_skill}
                                </Typography>
                              )}

                              <Stack
                                direction="row"
                                spacing={0.6}
                                alignItems="center"
                                sx={{ color: colors.subtext, pt: 1.2, borderTop: `1px solid ${colors.border}` }}
                              >
                                <Calendar size={15} />
                                <Typography sx={{ fontSize: 14 }}>{new Date(app.applied_at).toLocaleDateString()}</Typography>
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

                              {app.status === 'applied' && (
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    variant="outlined"
                                    disabled={actionLoading === app.id}
                                    onClick={() => handleUpdateStatus(app.id, 'accepted')}
                                    startIcon={actionLoading === app.id ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                                    sx={{
                                      color: '#10B981',
                                      borderColor: '#10B981',
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      backgroundColor: isDark ? colors.card : undefined,
                                      '&:hover': { borderColor: '#059669', backgroundColor: isDark ? colors.card : '#ECFDF5' },
                                    }}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    disabled={actionLoading === app.id}
                                    onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                    startIcon={actionLoading === app.id ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                                    sx={{
                                      color: '#EF4444',
                                      borderColor: '#EF4444',
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      backgroundColor: isDark ? colors.card : undefined,
                                      '&:hover': { borderColor: '#DC2626', backgroundColor: isDark ? colors.card : '#FEF2F2' },
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </Stack>
                              )}
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}

              {((effectiveViewMode === 'sent' && filteredSent.length === 0) ||
                (effectiveViewMode === 'received' && filteredReceived.length === 0)) && (
                <Card
                  sx={{
                    borderRadius: '12px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: 'none',
                    backgroundColor: colors.card,
                  }}
                >
                  <CardContent sx={{ py: 8, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 600, color: colors.heading, mb: 0.8 }}>
                      No applications found
                    </Typography>
                    <Typography sx={{ color: colors.subtext, mb: 2.6 }}>
                      {effectiveViewMode === 'sent'
                        ? "You haven't applied to any opportunities yet"
                        : 'No applications received on your posts yet'}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (effectiveViewMode === 'received' && user?.role === 'faculty' && firstPostId) {
                          navigate(`/post/${firstPostId}/candidates`);
                        } else {
                          navigate('/home');
                        }
                      }}
                      sx={{
                        backgroundColor: colors.accent,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#ffffff',
                        '&:hover': { backgroundColor: colors.accentHover },
                      }}
                    >
                      {effectiveViewMode === 'received' && user?.role === 'faculty' ? 'Browse Candidates' : 'Browse Opportunities'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default AppliedOpportunitiesPage;

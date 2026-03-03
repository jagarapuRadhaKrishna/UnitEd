import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, Mail, Users, XCircle } from 'lucide-react';

interface AppWithProfile {
  id: string;
  applicant_id: string;
  status: string;
  cover_letter: string | null;
  applied_at: string;
  applied_for_skill: string | null;
  applicant: {
    name: string;
    email: string;
    skills: string[];
  };
}

const PostManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [applications, setApplications] = useState<AppWithProfile[]>([]);
  const [postTitle, setPostTitle] = useState('');
  const [totalRequired, setTotalRequired] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: post } = await supabase.from('posts').select('title, skill_requirements').eq('id', id).maybeSingle();

      if (post) {
        setPostTitle(post.title);
        const reqs = (post.skill_requirements as unknown as { requiredCount: number }[]) || [];
        setTotalRequired(reqs.reduce((sum, req) => sum + req.requiredCount, 0));
      }

      const { data: apps } = await supabase
        .from('applications')
        .select('*')
        .eq('post_id', id)
        .order('applied_at', { ascending: false });

      if (apps && apps.length > 0) {
        const applicantIds = [...new Set(apps.map((a) => a.applicant_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, skills')
          .in('id', applicantIds);

        const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

        setApplications(
          apps.map((a) => {
            const profile = profileMap.get(a.applicant_id);
            return {
              id: a.id,
              applicant_id: a.applicant_id,
              status: a.status,
              cover_letter: a.cover_letter,
              applied_at: a.applied_at,
              applied_for_skill: a.applied_for_skill,
              applicant: {
                name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown',
                email: profile?.email || '',
                skills: profile?.skills || [],
              },
            };
          })
        );
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleStatusUpdate = async (appId: string, applicantId: string, status: 'shortlisted' | 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('applications')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', appId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
    toast({ title: `Application ${status}` });

    if (status === 'accepted' && id && user?.id) {
      try {
        const { data: existingChatroom } = await supabase
          .from('chatrooms')
          .select('id')
          .eq('post_id', id)
          .eq('status', 'active')
          .maybeSingle();

        let chatroomId: string;

        if (existingChatroom) {
          chatroomId = existingChatroom.id;
        } else {
          const { data: newChatroom, error: crError } = await supabase
            .from('chatrooms')
            .insert({ post_id: id, status: 'active' })
            .select('id')
            .single();

          if (crError || !newChatroom) throw crError;

          chatroomId = newChatroom.id;

          await supabase.from('chatroom_members').insert({
            chatroom_id: chatroomId,
            user_id: user.id,
            role: 'admin',
          });

          await supabase.from('posts').update({ chatroom_id: chatroomId, chatroom_enabled: true }).eq('id', id);
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

        const app = applications.find((a) => a.id === appId);
        const applicantName = app?.applicant.name || 'A new member';

        await supabase.from('messages').insert({
          chatroom_id: chatroomId,
          sender_id: user.id,
          content: `${applicantName} has been accepted and joined the team!`,
          type: 'system',
        });

        await supabase.from('notifications').insert({
          user_id: applicantId,
          type: 'application_accepted',
          title: 'Application Accepted',
          message: `Your application for "${postTitle}" has been accepted. A chat room is ready!`,
          link: `/chatroom/${chatroomId}`,
          related_post_id: id,
          related_chatroom_id: chatroomId,
        });
      } catch (chatError) {
        console.error('Error adding to chatroom:', chatError);
      }
    }
  };

  const pending = applications.filter((a) => a.status === 'applied' || a.status === 'shortlisted');
  const accepted = applications.filter((a) => a.status === 'accepted');
  const rejected = applications.filter((a) => a.status === 'rejected');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 18 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: '3px solid #E5E7EB',
            borderTopColor: '#6C47FF',
            animation: 'spin 0.8s linear infinite',
            '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="lg" sx={{ py: 3.5 }}>
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2.3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/my-posts')}
            startIcon={<ArrowLeft size={16} />}
            sx={{
              borderColor: '#E5E7EB',
              color: '#6B7280',
              textTransform: 'none',
              '&:hover': { borderColor: '#6C47FF', color: '#6C47FF', backgroundColor: '#F9FAFB' },
            }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.2 }}>
              Manage Applicants
            </Typography>
            <Typography sx={{ color: '#6B7280' }}>{postTitle || 'Post'}</Typography>
          </Box>
        </Stack>

        <Card sx={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'none', mb: 3 }}>
          <CardContent sx={{ p: 2.3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.6} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Box>
                <Typography sx={{ fontSize: 34, fontWeight: 700, color: '#6C47FF' }}>{applications.length}</Typography>
                <Typography sx={{ color: '#6B7280', fontSize: 14 }}>Total Applications</Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

              <Box>
                <Typography sx={{ fontSize: 34, fontWeight: 700, color: '#10B981' }}>{accepted.length}</Typography>
                <Typography sx={{ color: '#6B7280', fontSize: 14 }}>Accepted</Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

              <Box>
                <Typography sx={{ fontSize: 34, fontWeight: 700, color: '#F59E0B' }}>{pending.length}</Typography>
                <Typography sx={{ color: '#6B7280', fontSize: 14 }}>Pending Review</Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

              <Box>
                <Typography sx={{ color: '#6B7280', fontSize: 13, mb: 0.2 }}>Team Progress</Typography>
                <Typography sx={{ fontWeight: 700, color: '#111827' }}>
                  {accepted.length} / {totalRequired} Members
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {pending.length > 0 && (
          <Box sx={{ mb: 3.2 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111827', mb: 1.4 }}>
              Pending Applications ({pending.length})
            </Typography>

            <Stack spacing={1.5}>
              {pending.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: index * 0.04 }}
                >
                  <Card sx={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                    <CardContent sx={{ p: 2.2 }}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: '#6C47FF', fontWeight: 700 }}>
                          {app.applicant.name.split(' ').map((n) => n.charAt(0)).join('')}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontWeight: 700, color: '#111827' }}>{app.applicant.name}</Typography>
                            <Chip
                              icon={<Clock size={14} />}
                              label={app.status}
                              size="small"
                              sx={{
                                textTransform: 'capitalize',
                                backgroundColor: '#FEF3C7',
                                color: '#F59E0B',
                                fontWeight: 600,
                                '& .MuiChip-icon': { color: '#F59E0B' },
                              }}
                            />
                          </Stack>

                          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 1.1, color: '#6B7280' }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Mail size={14} />
                              <Typography sx={{ fontSize: 14 }}>{app.applicant.email}</Typography>
                            </Stack>
                            <Typography sx={{ fontSize: 14 }}>Applied: {new Date(app.applied_at).toLocaleDateString()}</Typography>
                          </Stack>

                          <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap sx={{ mb: 1.1 }}>
                            {app.applicant.skills.slice(0, 6).map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                size="small"
                                sx={{ backgroundColor: '#EEF2FF', color: '#6C47FF', fontWeight: 600, fontSize: 12 }}
                              />
                            ))}
                          </Stack>

                          {app.cover_letter && (
                            <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: '8px', p: 1.2, mb: 1.2 }}>
                              <Typography sx={{ color: '#6B7280', fontStyle: 'italic', fontSize: 14 }}>
                                "{app.cover_letter}"
                              </Typography>
                            </Box>
                          )}

                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Button
                              variant="contained"
                              startIcon={<CheckCircle size={15} />}
                              onClick={() => handleStatusUpdate(app.id, app.applicant_id, 'accepted')}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                backgroundColor: '#10B981',
                                '&:hover': { backgroundColor: '#059669' },
                              }}
                            >
                              Accept
                            </Button>

                            <Button
                              variant="outlined"
                              startIcon={<XCircle size={15} />}
                              onClick={() => handleStatusUpdate(app.id, app.applicant_id, 'rejected')}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                color: '#EF4444',
                                borderColor: '#EF4444',
                                '&:hover': { borderColor: '#DC2626', backgroundColor: '#FEF2F2' },
                              }}
                            >
                              Reject
                            </Button>

                            <Button
                              variant="text"
                              onClick={() => navigate(`/candidate/${app.applicant_id}`)}
                              sx={{ textTransform: 'none', fontWeight: 700, color: '#6C47FF' }}
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

        {accepted.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111827', mb: 1.3 }}>
              Accepted Members ({accepted.length})
            </Typography>
            <Stack spacing={1.2}>
              {accepted.map((app) => (
                <Card key={app.id} sx={{ borderRadius: '10px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.8 }}>
                    <Stack direction="row" spacing={1.3} alignItems="center">
                      <Avatar sx={{ width: 44, height: 44, bgcolor: '#10B981', fontWeight: 700 }}>
                        {app.applicant.name.split(' ').map((n) => n.charAt(0)).join('')}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: '#111827' }}>{app.applicant.name}</Typography>
                        <Typography sx={{ color: '#6B7280', fontSize: 14 }}>{app.applicant.email}</Typography>
                      </Box>
                      <Chip
                        icon={<CheckCircle size={14} />}
                        label="Accepted"
                        size="small"
                        sx={{
                          backgroundColor: '#D1FAE5',
                          color: '#10B981',
                          fontWeight: 700,
                          '& .MuiChip-icon': { color: '#10B981' },
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {rejected.length > 0 && (
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#6B7280', mb: 1.2 }}>
              Rejected ({rejected.length})
            </Typography>
            <Stack spacing={1.2}>
              {rejected.map((app) => (
                <Card
                  key={app.id}
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    boxShadow: 'none',
                    opacity: 0.7,
                  }}
                >
                  <CardContent sx={{ p: 1.6 }}>
                    <Stack direction="row" spacing={1.3} alignItems="center">
                      <Avatar sx={{ width: 40, height: 40, bgcolor: '#F3F4F6', color: '#6B7280', fontWeight: 700 }}>
                        {app.applicant.name.split(' ').map((n) => n.charAt(0)).join('')}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600, color: '#4B5563' }}>{app.applicant.name}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {applications.length === 0 && (
          <Card sx={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#6B7280', mb: 0.7 }}>
                No applications yet
              </Typography>
              <Typography sx={{ color: '#9CA3AF' }}>Share your post to attract applicants</Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default PostManagePage;

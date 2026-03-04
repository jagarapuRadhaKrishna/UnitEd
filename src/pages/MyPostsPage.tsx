import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Calendar, Edit2, Plus, Trash2, Users } from 'lucide-react';

interface SkillRequirement {
  skill: string;
  requiredCount: number;
  acceptedCount?: number;
}

interface MyPost {
  id: string;
  title: string;
  description: string;
  purpose: string;
  status: string;
  skill_requirements: SkillRequirement[];
  created_at: string;
  applicationCount: number;
}

const MyPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMyPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error || !data) {
        setLoading(false);
        return;
      }

      const postIds = data.map((p) => p.id);
      const { data: apps } = await supabase
        .from('applications')
        .select('post_id')
        .in('post_id', postIds.length > 0 ? postIds : ['__none__']);

      const appCounts = new Map<string, number>();
      (apps || []).forEach((a) => {
        appCounts.set(a.post_id, (appCounts.get(a.post_id) || 0) + 1);
      });

      setPosts(
        data.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          purpose: p.purpose,
          status: p.status,
          skill_requirements: (p.skill_requirements as unknown as SkillRequirement[]) || [],
          created_at: p.created_at,
          applicationCount: appCounts.get(p.id) || 0,
        }))
      );
      setLoading(false);
    };

    fetchMyPosts();
  }, [user?.id]);

  const handleDelete = async () => {
    if (!selectedPostId) return;

    setDeleting(true);
    const { error } = await supabase.from('posts').delete().eq('id', selectedPostId);
    setDeleting(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setPosts((prev) => prev.filter((p) => p.id !== selectedPostId));
    setDeleteDialogOpen(false);
    toast({ title: 'Post deleted' });
    navigate('/home', { state: { activeTab: 'my' } });
  };

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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.6 }}>
                My Posts
              </Typography>
              <Typography sx={{ color: '#6B7280' }}>Manage all the posts you've created</Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={() => navigate('/create-post')}
              sx={{
                backgroundColor: '#6C47FF',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#5936E8' },
              }}
            >
              Create Post
            </Button>
          </Stack>
        </motion.div>

        {posts.length === 0 ? (
          <Card sx={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#6B7280', mb: 1.4 }}>
                You haven't created any posts yet
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/create-post')}
                sx={{
                  backgroundColor: '#6C47FF',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#5936E8' },
                }}
              >
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }, gap: 2.2 }}>
            {posts.map((post, index) => {
              const totalRequired = post.skill_requirements.reduce((sum, req) => sum + req.requiredCount, 0);
              const totalAccepted = post.skill_requirements.reduce((sum, req) => sum + (req.acceptedCount || 0), 0);
              const progress = totalRequired > 0 ? (totalAccepted / totalRequired) * 100 : 0;

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      boxShadow: 'none',
                      '&:hover': { boxShadow: '0 8px 24px rgba(17,24,39,0.08)', transform: 'translateY(-2px)' },
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <CardContent sx={{ p: 2.2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Stack direction="row" justifyContent="space-between" spacing={1.2} sx={{ mb: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: '#111827', lineHeight: 1.35 }}>
                          {post.title}
                        </Typography>
                        <Chip
                          label={post.status}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            backgroundColor: post.status === 'active' ? '#D1FAE5' : '#F3F4F6',
                            color: post.status === 'active' ? '#10B981' : '#6B7280',
                            flexShrink: 0,
                          }}
                        />
                      </Stack>

                      <Typography sx={{ color: '#6B7280', fontSize: 14, mb: 1.3 }}>
                        {post.description}
                      </Typography>

                      <Stack spacing={0.8} sx={{ color: '#6B7280', mb: 1.4, fontSize: 13 }}>
                        <Typography sx={{ fontSize: 13 }}>
                          <strong>Purpose:</strong> {post.purpose}
                        </Typography>
                        <Stack direction="row" spacing={0.6} alignItems="center">
                          <Calendar size={13} />
                          <Typography sx={{ fontSize: 13 }}>{new Date(post.created_at).toLocaleDateString()}</Typography>
                        </Stack>
                      </Stack>

                      <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap sx={{ mb: 1.3 }}>
                        {post.skill_requirements.slice(0, 3).map((sr) => (
                          <Chip
                            key={sr.skill}
                            label={sr.skill}
                            size="small"
                            sx={{ backgroundColor: '#EEF2FF', color: '#6C47FF', fontWeight: 600, fontSize: 12 }}
                          />
                        ))}
                        {post.skill_requirements.length > 3 && (
                          <Chip
                            label={`+${post.skill_requirements.length - 3}`}
                            size="small"
                            sx={{ backgroundColor: '#F3F4F6', color: '#6B7280', fontWeight: 600, fontSize: 12 }}
                          />
                        )}
                      </Stack>

                      <Stack direction="row" spacing={2} sx={{ mb: 1.2, color: '#6B7280', fontSize: 13 }}>
                        <Typography sx={{ fontSize: 13 }}><strong>{post.applicationCount}</strong> Applications</Typography>
                        <Typography sx={{ fontSize: 13 }}><strong>{totalAccepted}</strong>/{totalRequired} Members</Typography>
                      </Stack>

                      <Box sx={{ mb: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Team Progress</Typography>
                          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{Math.round(progress)}%</Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#E5E7EB',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: progress >= 100 ? '#10B981' : '#6C47FF',
                            },
                          }}
                        />
                      </Box>

                      <Stack spacing={1} sx={{ mt: 'auto', pt: 1.2, borderTop: '1px solid #E5E7EB' }}>
                        <Button
                          variant="contained"
                          startIcon={<Users size={15} />}
                          onClick={() => navigate(`/post/manage/${post.id}`)}
                          sx={{
                            backgroundColor: '#6C47FF',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { backgroundColor: '#5936E8' },
                          }}
                        >
                          View Applications
                        </Button>

                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            startIcon={<Edit2 size={14} />}
                            onClick={() => navigate(`/edit-post/${post.id}`)}
                            sx={{
                              flex: 1,
                              textTransform: 'none',
                              fontWeight: 600,
                              borderColor: '#D1D5DB',
                              color: '#4B5563',
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Trash2 size={14} />}
                            onClick={() => {
                              setSelectedPostId(post.id);
                              setDeleteDialogOpen(true);
                            }}
                            sx={{
                              flex: 1,
                              textTransform: 'none',
                              fontWeight: 600,
                              borderColor: '#EF4444',
                              color: '#EF4444',
                              '&:hover': { backgroundColor: '#FEF2F2', borderColor: '#DC2626' },
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Box>
        )}

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Post?</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#6B7280' }}>
              Are you sure you want to delete this post? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting} sx={{ textTransform: 'none' }}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyPostsPage;

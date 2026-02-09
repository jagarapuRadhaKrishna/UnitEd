import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2, Users } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '../config/api';

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  status: string;
  createdAt: string;
  _count: {
    applications: number;
    comments: number;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const MyPosts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchMyPosts();
  }, [page]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<any>(
        `${API_ENDPOINTS.posts.getAll}/my-posts?page=${page}&limit=10`
      );
      setPosts(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load your posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (postId: string) => {
    setSelectedPostId(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPostId) return;

    try {
      await apiClient.delete(`${API_ENDPOINTS.posts.getAll}/${selectedPostId}`);
      setPosts(posts.filter(p => p.id !== selectedPostId));
      setDeleteDialogOpen(false);
      setSelectedPostId(null);
    } catch (err: any) {
      setError('Failed to delete post');
      console.error('Error deleting post:', err);
    }
  };

  const handleEditClick = (postId: string) => {
    navigate(`/post/manage/${postId}`);
  };

  const handleViewApplications = (postId: string) => {
    navigate(`/post/manage/${postId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            📝 My Posts
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage all the posts you've created
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {posts.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              You haven't created any posts yet
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/create-post')}
              sx={{ mt: 2 }}
            >
              Create Your First Post
            </Button>
          </Card>
        ) : (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          boxShadow: 4,
                          transform: 'translateY(-4px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {post.title}
                          </Typography>
                          <Chip
                            label={post.status}
                            size="small"
                            color={post.status === 'OPEN' ? 'success' : 'default'}
                            variant="outlined"
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary', mb: 2, minHeight: '40px' }}
                        >
                          {post.description.substring(0, 80)}...
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                            <strong>Category:</strong> {post.category}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                            <strong>Created:</strong> {new Date(post.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                            Required Skills:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {post.requiredSkills.slice(0, 3).map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                            {post.requiredSkills.length > 3 && (
                              <Chip
                                label={`+${post.requiredSkills.length - 3}`}
                                size="small"
                                variant="filled"
                              />
                            )}
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, py: 1 }}>
                          <Typography variant="caption">
                            <strong>{post._count.applications}</strong> Applications
                          </Typography>
                          <Typography variant="caption">
                            <strong>{post._count.comments}</strong> Comments
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ pt: 0 }}>
                        <Button
                          size="small"
                          startIcon={<Users size={18} />}
                          fullWidth
                          variant="contained"
                          onClick={() => handleViewApplications(post.id)}
                        >
                          View Applications
                        </Button>
                      </CardActions>

                      <CardActions sx={{ gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Edit2 size={16} />}
                          variant="outlined"
                          fullWidth
                          onClick={() => handleEditClick(post.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Trash2 size={16} />}
                          color="error"
                          variant="outlined"
                          fullWidth
                          onClick={() => handleDeleteClick(post.id)}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                </motion.div>
              ))}
            </Box>

            {pagination && pagination.pages > 1 && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  Page {page} of {pagination.pages}
                </Typography>
                <Button
                  disabled={page === pagination.pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </Box>
            )}
          </>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Post?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyPosts;

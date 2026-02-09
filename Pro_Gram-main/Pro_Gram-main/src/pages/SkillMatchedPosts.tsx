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
  Avatar,
  Pagination,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '../config/api';

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  author: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  createdAt: string;
  _count: {
    applications: number;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const SkillMatchedPosts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  useEffect(() => {
    fetchMatchedPosts();
  }, [page]);

  const fetchMatchedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<any>(
        `${API_ENDPOINTS.posts.getAll}/matched?page=${page}&limit=10`
      );
      setPosts(response.data);
      setPagination(response.pagination);
      if (response.userSkills) {
        setUserSkills(response.userSkills);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load opportunities');
      console.error('Error loading matched posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPost = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handleApply = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
            🎯 Opportunities Matching Your Skills
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            Find opportunities that match your expertise
          </Typography>
          {userSkills.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Your Skills:</Typography>
              {userSkills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {posts.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              No opportunities matching your skills yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Try updating your skills or check back later for new opportunities
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/profile')}
            >
              Update Your Skills
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
                        cursor: 'pointer',
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={post.author.profilePicture}
                            alt={`${post.author.firstName} ${post.author.lastName}`}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              Posted by
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {post.author.firstName} {post.author.lastName}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {post.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary', mb: 2, minHeight: '50px' }}
                        >
                          {post.description.substring(0, 100)}...
                        </Typography>

                        <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Briefcase size={16} />
                          <Chip
                            label={post.category}
                            size="small"
                            variant="outlined"
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                            Required Skills:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {post.requiredSkills.map((skill) => {
                              const isMatched = userSkills.some(
                                (userSkill) =>
                                  userSkill.toLowerCase() === skill.toLowerCase()
                              );
                              return (
                                <Chip
                                  key={skill}
                                  label={skill}
                                  size="small"
                                  variant={isMatched ? 'filled' : 'outlined'}
                                  color={isMatched ? 'success' : 'default'}
                                  icon={isMatched ? undefined : undefined}
                                />
                              );
                            })}
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, py: 1, color: 'text.secondary' }}>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Calendar size={14} />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption">
                            {post._count.applications} applications
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ gap: 1 }}>
                        <Button
                          size="small"
                          fullWidth
                          variant="contained"
                          onClick={() => handleViewPost(post.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="small"
                          fullWidth
                          variant="outlined"
                          onClick={() => handleApply(post.id)}
                        >
                          Apply
                        </Button>
                      </CardActions>
                    </Card>
                </motion.div>
              ))}
            </Box>

            {pagination && pagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={pagination.pages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default SkillMatchedPosts;

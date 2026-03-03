import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Avatar,
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
import { Clock, Eye, Filter, MessageCircle, Pin, Plus, Search } from 'lucide-react';

interface ForumThread {
  id: string;
  title: string;
  category: string;
  author_name: string;
  created_at: string;
  is_pinned: boolean;
  view_count: number;
  reply_count: number;
}

const categories = ['All', 'Technical', 'Collaboration', 'General', 'Career'];

const ForumsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThreads = async () => {
    const { data: threadData } = await supabase
      .from('forum_threads')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (!threadData) {
      setLoading(false);
      return;
    }

    const authorIds = [...new Set(threadData.map((t) => t.author_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', authorIds.length > 0 ? authorIds : ['__none__']);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.id, `${p.first_name || ''} ${p.last_name || ''}`.trim()])
    );

    const threadIds = threadData.map((t) => t.id);
    const { data: replies } = await supabase
      .from('forum_replies')
      .select('thread_id')
      .in('thread_id', threadIds.length > 0 ? threadIds : ['__none__']);

    const replyCountMap = new Map<string, number>();
    (replies || []).forEach((r) => {
      replyCountMap.set(r.thread_id, (replyCountMap.get(r.thread_id) || 0) + 1);
    });

    setThreads(
      threadData.map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        author_name: profileMap.get(t.author_id) || 'Unknown',
        created_at: t.created_at,
        is_pinned: t.is_pinned || false,
        view_count: t.view_count || 0,
        reply_count: replyCountMap.get(t.id) || 0,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchThreads();

    const channel = supabase
      .channel('forum-threads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_threads' }, fetchThreads)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const filtered = threads.filter((t) => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    return matchSearch && matchCat;
  });

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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                Forums
              </Typography>
              <Typography sx={{ color: '#6B7280' }}>
                Join discussions, share knowledge, and connect with the community
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => navigate('/forum/create')}
              sx={{
                backgroundColor: '#6C47FF',
                px: 2.4,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#5936E8' },
              }}
            >
              New Discussion
            </Button>
          </Stack>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}>
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search discussions..."
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
            <Button
              variant="outlined"
              startIcon={<Filter size={16} />}
              sx={{
                borderColor: '#E5E7EB',
                color: '#374151',
                textTransform: 'none',
                borderRadius: '8px',
                px: 2.2,
              }}
            >
              Filter
            </Button>
          </Stack>
        </motion.div>

        <Stack direction="row" spacing={1} sx={{ mb: 2.5, overflowX: 'auto', pb: 0.8 }}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setActiveCategory(cat)}
              sx={{
                flexShrink: 0,
                borderRadius: '999px',
                px: 0.7,
                backgroundColor: activeCategory === cat ? '#6C47FF' : 'white',
                color: activeCategory === cat ? 'white' : '#374151',
                border: '1px solid',
                borderColor: activeCategory === cat ? '#6C47FF' : '#E5E7EB',
                fontWeight: 600,
                '&:hover': { backgroundColor: activeCategory === cat ? '#5936E8' : '#F3F4F6' },
              }}
            />
          ))}
        </Stack>

        <Typography sx={{ mb: 2, color: '#6B7280', fontSize: 14 }}>
          {filtered.length} discussion{filtered.length !== 1 ? 's' : ''}
        </Typography>

        <Stack spacing={1.75}>
          {filtered.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Card
                onClick={() => navigate(`/forum/${thread.id}`)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#6C47FF',
                    boxShadow: '0 6px 20px rgba(108,71,255,0.12)',
                  },
                  transition: 'all 0.22s ease',
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={1.75} alignItems="flex-start">
                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#EEF2FF', color: '#6C47FF', fontWeight: 700 }}>
                      {thread.author_name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8, flexWrap: 'wrap' }}>
                        {thread.is_pinned && <Pin size={14} color="#F59E0B" />}
                        <Typography sx={{ fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                          {thread.title}
                        </Typography>
                        <Chip
                          label={thread.category}
                          size="small"
                          sx={{
                            height: 22,
                            backgroundColor: '#EEF2FF',
                            color: '#6C47FF',
                            fontWeight: 600,
                          }}
                        />
                      </Stack>

                      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ color: '#6B7280', fontSize: 13 }}>
                        <Typography sx={{ fontSize: 13, color: '#6B7280' }}>{thread.author_name}</Typography>
                        <Typography sx={{ color: '#D1D5DB' }}>•</Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Clock size={13} />
                          <Typography sx={{ fontSize: 13 }}>{timeAgo(thread.created_at)}</Typography>
                        </Stack>
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={2.2} alignItems="center" sx={{ color: '#6B7280' }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <MessageCircle size={15} />
                        <Typography sx={{ fontSize: 13 }}>{thread.reply_count}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Eye size={15} />
                        <Typography sx={{ fontSize: 13 }}>{thread.view_count}</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>

        {filtered.length === 0 && (
          <Card sx={{ borderRadius: '12px', mt: 1, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
            <CardContent sx={{ py: 7, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 600, color: '#6B7280', mb: 0.8 }}>No discussions found</Typography>
              <Typography sx={{ color: '#9CA3AF', fontSize: 14 }}>Try adjusting your search or category filters</Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default ForumsPage;

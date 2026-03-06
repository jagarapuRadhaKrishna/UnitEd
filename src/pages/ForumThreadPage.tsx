import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye, MessageCircle, Send } from 'lucide-react';
import { usePalette } from '@/hooks/usePalette';

interface ThreadData {
  id: string;
  title: string;
  content: string;
  category: string;
  author_name: string;
  created_at: string;
  view_count: number;
}

interface ReplyData {
  id: string;
  content: string;
  author_name: string;
  author_initial: string;
  created_at: string;
}

const ForumThreadPage: React.FC = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [thread, setThread] = useState<ThreadData | null>(null);
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { isDark, colors } = usePalette();

  const repliesEndRef = useRef<HTMLDivElement>(null);

  const fetchThread = async () => {
    if (!threadId) return;

    const { data: threadRow } = await supabase.from('forum_threads').select('*').eq('id', threadId).maybeSingle();

    if (!threadRow) {
      setLoading(false);
      return;
    }

    await supabase
      .from('forum_threads')
      .update({ view_count: (threadRow.view_count || 0) + 1 })
      .eq('id', threadId);

    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', threadRow.author_id)
      .maybeSingle();

    setThread({
      id: threadRow.id,
      title: threadRow.title,
      content: threadRow.content,
      category: threadRow.category,
      author_name: authorProfile ? `${authorProfile.first_name || ''} ${authorProfile.last_name || ''}`.trim() : 'Unknown',
      created_at: threadRow.created_at,
      view_count: (threadRow.view_count || 0) + 1,
    });
  };

  const fetchReplies = async () => {
    if (!threadId) return;

    const { data: replyRows } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (!replyRows) return;

    const authorIds = [...new Set(replyRows.map((r) => r.author_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', authorIds.length > 0 ? authorIds : ['__none__']);

    const profileMap = new Map(
      (profiles || []).map((p) => [
        p.id,
        {
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
          initial: (p.first_name || 'U').charAt(0),
        },
      ])
    );

    setReplies(
      replyRows.map((r) => {
        const profile = profileMap.get(r.author_id);
        return {
          id: r.id,
          content: r.content,
          author_name: profile?.name || 'Unknown',
          author_initial: profile?.initial || 'U',
          created_at: r.created_at,
        };
      })
    );
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchThread(), fetchReplies()]);
      setLoading(false);
    };

    init();

    const channel = supabase
      .channel(`forum-replies-${threadId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'forum_replies', filter: `thread_id=eq.${threadId}` },
        fetchReplies
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [replies.length]);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const handleReply = async () => {
    if (!replyText.trim() || !user?.id || !threadId) return;

    setSubmitting(true);
    const { error } = await supabase.from('forum_replies').insert({
      thread_id: threadId,
      author_id: user.id,
      content: replyText.trim(),
    });
    setSubmitting(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setReplyText('');
    // Immediately refresh so the new reply appears without waiting for realtime
    fetchReplies();
    toast({ title: 'Reply posted!' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 18, backgroundColor: colors.bg }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: `3px solid ${colors.border}`,
            borderTopColor: colors.accent,
            animation: 'spin 0.8s linear infinite',
            '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
          }}
        />
      </Box>
    );
  }

  if (!thread) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Thread not found</Typography>
        <Button variant="outlined" onClick={() => navigate('/forums')}>
          Back to Forums
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.bg }}>
      <Container maxWidth="md" sx={{ py: 3.5 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/forums')}
          startIcon={<ArrowLeft size={16} />}
          sx={{
            mb: 2.5,
            borderColor: colors.border,
            color: colors.heading,
            textTransform: 'none',
            backgroundColor: colors.card,
            '&:hover': { borderColor: colors.accent, color: colors.accent, backgroundColor: colors.card },
          }}
        >
          Back to Forums
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card
            sx={{
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              boxShadow: 'none',
              mb: 2.5,
              backgroundColor: colors.card,
            }}
          >
            <CardContent sx={{ p: 3.2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.3 }}>
                <Chip
                  label={thread.category}
                  size="small"
                  sx={{ backgroundColor: colors.chipBg, color: colors.chipText, fontWeight: 600 }}
                />
              </Stack>

              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.heading, mb: 1.5 }}>
                {thread.title}
              </Typography>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, color: colors.subtext }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: colors.chipBg,
                    color: colors.chipText,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {thread.author_name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography sx={{ color: colors.heading, fontWeight: 600, fontSize: 14 }}>{thread.author_name}</Typography>
                <Typography sx={{ color: colors.border }}>•</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Clock size={13} />
                  <Typography sx={{ fontSize: 13, color: colors.subtext }}>{timeAgo(thread.created_at)}</Typography>
                </Stack>
              </Stack>

              <Typography sx={{ color: colors.heading, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{thread.content}</Typography>

              <Divider sx={{ my: 2, borderColor: colors.border }} />

              <Stack direction="row" spacing={2.5} sx={{ color: colors.subtext }}>
                <Stack direction="row" spacing={0.6} alignItems="center">
                  <MessageCircle size={16} />
                  <Typography sx={{ fontSize: 14 }}>{replies.length} replies</Typography>
                </Stack>
                <Stack direction="row" spacing={0.6} alignItems="center">
                  <Eye size={16} />
                  <Typography sx={{ fontSize: 14 }}>{thread.view_count} views</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        <Typography sx={{ fontSize: 18, fontWeight: 700, color: colors.heading, mb: 1.5 }}>
          Replies ({replies.length})
        </Typography>

        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {replies.map((reply, index) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.04 }}
            >
              <Card
                sx={{
                  borderRadius: '10px',
                  border: `1px solid ${colors.border}`,
                  boxShadow: 'none',
                  backgroundColor: colors.card,
                }}
              >
                <CardContent sx={{ p: 2.2 }}>
                  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: colors.chipBg,
                        color: colors.chipText,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {reply.author_initial.toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.heading }}>{reply.author_name}</Typography>
                    <Typography sx={{ color: colors.border }}>•</Typography>
                    <Typography sx={{ fontSize: 13, color: colors.subtext }}>{timeAgo(reply.created_at)}</Typography>
                  </Stack>
                  <Typography sx={{ color: colors.heading, whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>{reply.content}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {replies.length === 0 && (
            <Card
              sx={{
                borderRadius: '10px',
                border: `1px solid ${colors.border}`,
                boxShadow: 'none',
                backgroundColor: colors.card,
              }}
            >
              <CardContent sx={{ py: 4.5, textAlign: 'center' }}>
                <Typography sx={{ color: colors.subtext }}>No replies yet. Be the first to respond.</Typography>
              </CardContent>
            </Card>
          )}

          <div ref={repliesEndRef} />
        </Stack>

        <Card
          sx={{
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            boxShadow: 'none',
            backgroundColor: colors.card,
          }}
        >
          <CardContent sx={{ p: 2.4 }}>
            <Typography sx={{ fontWeight: 700, color: colors.heading, mb: 1.2 }}>Your Reply</Typography>
            <TextField
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Share your thoughts..."
              fullWidth
              multiline
              minRows={3}
              sx={{
                mb: 1.6,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: colors.inputBg,
                  color: colors.heading,
                  '& fieldset': { borderColor: colors.inputBorder },
                  '&:hover fieldset': { borderColor: colors.accent },
                  '&.Mui-focused fieldset': { borderColor: colors.accent },
                },
                '& .MuiInputBase-input': {
                  color: colors.heading,
                },
                '& .MuiInputBase-input::placeholder': {
                  color: colors.subtext,
                  opacity: 1,
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<Send size={16} />}
              onClick={handleReply}
              disabled={!replyText.trim() || submitting}
              sx={{
                backgroundColor: colors.accent,
                textTransform: 'none',
                fontWeight: 600,
                px: 2.2,
                '&:hover': { backgroundColor: colors.accent },
              }}
            >
              {submitting ? 'Posting...' : 'Post Reply'}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForumThreadPage;


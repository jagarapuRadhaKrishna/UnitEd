import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MessageCircle, Clock, Send, Eye } from 'lucide-react';

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
  const repliesEndRef = useRef<HTMLDivElement>(null);

  const fetchThread = async () => {
    if (!threadId) return;

    const { data: threadRow } = await supabase
      .from('forum_threads')
      .select('*')
      .eq('id', threadId)
      .maybeSingle();

    if (!threadRow) { setLoading(false); return; }

    // Increment view count
    await supabase.from('forum_threads').update({ view_count: (threadRow.view_count || 0) + 1 }).eq('id', threadId);

    // Fetch author
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

    const authorIds = [...new Set(replyRows.map(r => r.author_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', authorIds.length > 0 ? authorIds : ['__none__']);
    const profileMap = new Map((profiles || []).map(p => [p.id, { name: `${p.first_name || ''} ${p.last_name || ''}`.trim(), initial: (p.first_name || 'U')[0] }]));

    setReplies(replyRows.map(r => {
      const profile = profileMap.get(r.author_id);
      return {
        id: r.id,
        content: r.content,
        author_name: profile?.name || 'Unknown',
        author_initial: profile?.initial || 'U',
        created_at: r.created_at,
      };
    }));
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchThread(), fetchReplies()]);
      setLoading(false);
    };
    init();

    // Real-time subscription for replies
    const channel = supabase
      .channel(`forum-replies-${threadId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forum_replies', filter: `thread_id=eq.${threadId}` }, () => {
        fetchReplies();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [threadId]);

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
    toast({ title: 'Reply posted!' });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Thread not found</h2>
        <Button variant="outline" onClick={() => navigate('/forums')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Forums
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <Button variant="ghost" onClick={() => navigate('/forums')} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Forums
      </Button>

      {/* Thread */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{thread.category}</Badge>
          </div>
          <h1 className="text-xl font-bold mb-3">{thread.title}</h1>
          <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">{thread.author_name[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">{thread.author_name}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(thread.created_at)}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{thread.content}</p>
          <Separator className="my-4" />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{replies.length} replies</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{thread.view_count} views</span>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <h3 className="font-semibold mb-3">{replies.length} Replies</h3>
      <div className="space-y-3 mb-6">
        {replies.map(reply => (
          <Card key={reply.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 text-sm">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-muted text-xs">{reply.author_initial}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{reply.author_name}</span>
                <span className="text-muted-foreground">• {timeAgo(reply.created_at)}</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
            </CardContent>
          </Card>
        ))}
        {replies.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No replies yet. Be the first!</p>
        )}
        <div ref={repliesEndRef} />
      </div>

      {/* Reply input */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2">Your Reply</h4>
          <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Share your thoughts..." className="mb-3" rows={3} />
          <Button onClick={handleReply} disabled={!replyText.trim() || submitting} className="bg-primary">
            <Send className="w-4 h-4 mr-2" /> {submitting ? 'Posting...' : 'Post Reply'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumThreadPage;

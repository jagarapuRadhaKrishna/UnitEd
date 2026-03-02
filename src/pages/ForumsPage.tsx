import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Plus, Search, Eye, Clock, Pin } from 'lucide-react';

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

    if (!threadData) { setLoading(false); return; }

    // Fetch author names
    const authorIds = [...new Set(threadData.map(t => t.author_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', authorIds.length > 0 ? authorIds : ['__none__']);
    const profileMap = new Map((profiles || []).map(p => [p.id, `${p.first_name || ''} ${p.last_name || ''}`.trim()]));

    // Fetch reply counts
    const threadIds = threadData.map(t => t.id);
    const { data: replies } = await supabase
      .from('forum_replies')
      .select('thread_id')
      .in('thread_id', threadIds.length > 0 ? threadIds : ['__none__']);
    const replyCountMap = new Map<string, number>();
    (replies || []).forEach(r => replyCountMap.set(r.thread_id, (replyCountMap.get(r.thread_id) || 0) + 1));

    setThreads(threadData.map(t => ({
      id: t.id,
      title: t.title,
      category: t.category,
      author_name: profileMap.get(t.author_id) || 'Unknown',
      created_at: t.created_at,
      is_pinned: t.is_pinned || false,
      view_count: t.view_count || 0,
      reply_count: replyCountMap.get(t.id) || 0,
    })));
    setLoading(false);
  };

  useEffect(() => {
    fetchThreads();

    // Real-time subscription for new threads
    const channel = supabase
      .channel('forum-threads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_threads' }, () => {
        fetchThreads();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
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

  const filtered = threads.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Forums</h1>
          <p className="text-muted-foreground text-sm">Discuss, share knowledge, and connect</p>
        </div>
        <Button 
          onClick={() => navigate('/forum/create')} 
          className="px-6 py-3 rounded-full text-sm font-medium border-0 cursor-pointer shadow-[0_4px_14px_0px_rgba(37,99,235,0.4)] transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 active:translate-y-1 active:shadow-none"
        >
          <Plus className="w-4 h-4 mr-2" /> New Thread
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threads..." className="pl-10" />
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-4">
        <TabsList>
          {categories.map(cat => <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {filtered.map(thread => (
          <Card key={thread.id} className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate(`/forum/${thread.id}`)}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9 mt-0.5">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">{thread.author_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {thread.is_pinned && <Pin className="w-3 h-3 text-united-orange" />}
                    <h3 className="font-semibold text-sm">{thread.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{thread.author_name}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(thread.created_at)}</span>
                    <Badge variant="secondary" className="text-[10px] h-4">{thread.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{thread.reply_count}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{thread.view_count}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No threads found. Start a discussion!</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default ForumsPage;

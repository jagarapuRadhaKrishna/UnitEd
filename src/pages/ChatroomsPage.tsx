import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Clock, ArrowRight, Loader2 } from 'lucide-react';

interface ChatroomItem {
  id: string;
  post_title: string;
  status: string;
  last_activity: string;
  member_count: number;
  last_message: string | null;
  unread_count: number;
}

const ChatroomsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chatrooms, setChatrooms] = useState<ChatroomItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchChatrooms();
  }, [user?.id]);

  const fetchChatrooms = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Get chatrooms user is a member of
      const { data: memberships } = await supabase
        .from('chatroom_members')
        .select('chatroom_id')
        .eq('user_id', user.id);

      if (!memberships || memberships.length === 0) {
        setChatrooms([]);
        setLoading(false);
        return;
      }

      const chatroomIds = memberships.map(m => m.chatroom_id);

      // Get chatroom details with post titles
      const { data: rooms } = await supabase
        .from('chatrooms')
        .select('id, status, last_activity, post_id')
        .in('id', chatroomIds)
        .order('last_activity', { ascending: false });

      if (!rooms || rooms.length === 0) {
        setChatrooms([]);
        setLoading(false);
        return;
      }

      // Get post titles
      const postIds = rooms.map(r => r.post_id);
      const { data: posts } = await supabase
        .from('posts')
        .select('id, title')
        .in('id', postIds);

      const postMap: Record<string, string> = {};
      (posts || []).forEach(p => { postMap[p.id] = p.title; });

      // Get member counts
      const { data: allMembers } = await supabase
        .from('chatroom_members')
        .select('chatroom_id')
        .in('chatroom_id', chatroomIds);

      const memberCountMap: Record<string, number> = {};
      (allMembers || []).forEach(m => { memberCountMap[m.chatroom_id] = (memberCountMap[m.chatroom_id] || 0) + 1; });

      // Get last messages
      const { data: lastMessages } = await supabase
        .from('messages')
        .select('chatroom_id, content, sender_id')
        .in('chatroom_id', chatroomIds)
        .order('created_at', { ascending: false })
        .limit(100);

      const lastMsgMap: Record<string, string> = {};
      (lastMessages || []).forEach(m => {
        if (!lastMsgMap[m.chatroom_id]) lastMsgMap[m.chatroom_id] = m.content;
      });

      const items: ChatroomItem[] = rooms.map(r => ({
        id: r.id,
        post_title: postMap[r.post_id] || 'Unknown Post',
        status: r.status,
        last_activity: r.last_activity,
        member_count: memberCountMap[r.id] || 0,
        last_message: lastMsgMap[r.id] || null,
        unread_count: 0,
      }));

      setChatrooms(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('chatrooms-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chatroom_members' }, () => fetchChatrooms())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchChatrooms())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chat Rooms</h1>
          <p className="text-muted-foreground text-sm">Communicate with your project teams</p>
        </div>
        <Badge variant="secondary" className="text-sm">{chatrooms.length} rooms</Badge>
      </div>

      {chatrooms.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Chat Rooms Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Chat rooms are created automatically when you get accepted into a project or accept an applicant.</p>
            <Button variant="outline" onClick={() => navigate('/home')}>Browse Opportunities</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chatrooms.map(chat => (
            <Card key={chat.id} className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate(`/chatroom/${chat.id}`)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm truncate">{chat.post_title}</p>
                      <Badge variant={chat.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">{chat.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.last_message ? chat.last_message.substring(0, 60) : 'No messages yet'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" /> {chat.member_count}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {new Date(chat.last_activity).toLocaleDateString()}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatroomsPage;

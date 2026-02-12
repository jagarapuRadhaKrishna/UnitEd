import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Users, Clock, ArrowRight, Loader2 } from 'lucide-react';

interface MemberProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  profile_picture_url: string | null;
}

interface ChatroomItem {
  id: string;
  post_title: string;
  status: string;
  last_activity: string;
  member_count: number;
  last_message: string | null;
  unread_count: number;
  members: MemberProfile[];
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

      // Get all members for these chatrooms
      const { data: allMembers } = await supabase
        .from('chatroom_members')
        .select('chatroom_id, user_id')
        .in('chatroom_id', chatroomIds);

      // Get unique member IDs and fetch profiles
      const allMemberIds = [...new Set((allMembers || []).map(m => m.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, profile_picture_url')
        .in('id', allMemberIds);

      const profileMap: Record<string, { first_name: string | null; last_name: string | null; profile_picture_url: string | null }> = {};
      (profiles || []).forEach(p => { profileMap[p.id] = p; });

      // Build member lists per chatroom
      const chatroomMembersMap: Record<string, MemberProfile[]> = {};
      const memberCountMap: Record<string, number> = {};
      (allMembers || []).forEach(m => {
        memberCountMap[m.chatroom_id] = (memberCountMap[m.chatroom_id] || 0) + 1;
        if (!chatroomMembersMap[m.chatroom_id]) chatroomMembersMap[m.chatroom_id] = [];
        const prof = profileMap[m.user_id];
        chatroomMembersMap[m.chatroom_id].push({
          user_id: m.user_id,
          first_name: prof?.first_name || null,
          last_name: prof?.last_name || null,
          profile_picture_url: prof?.profile_picture_url || null,
        });
      });

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
        members: chatroomMembersMap[r.id] || [],
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

  const getInitials = (first: string | null, last: string | null) => {
    return `${(first || '')[0] || ''}${(last || '')[0] || ''}`.toUpperCase() || '?';
  };

  const getFullName = (m: MemberProfile) => {
    return m.first_name || m.last_name || 'Unknown';
  };

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
          {chatrooms.map(chat => {
            // Show all members with first names
            const displayMembers = chat.members || [];

            return (
              <Card key={chat.id} className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate(`/chatroom/${chat.id}`)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Member avatars */}
                    <div className="flex -space-x-2 shrink-0">
                      {displayMembers.slice(0, 3).map((m, i) => (
                        <Avatar key={m.user_id} className="h-10 w-10 border-2 border-background" style={{ zIndex: 3 - i }}>
                          {m.profile_picture_url ? (
                            <AvatarImage src={m.profile_picture_url} alt={getFullName(m)} />
                          ) : null}
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                            {getInitials(m.first_name, m.last_name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {displayMembers.length > 3 && (
                        <Avatar className="h-10 w-10 border-2 border-background">
                          <AvatarFallback className="text-xs bg-muted text-muted-foreground">+{displayMembers.length - 3}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm truncate">
                          {displayMembers.map(m => getFullName(m)).join(' & ')}
                        </p>
                        <Badge variant={chat.status === 'active' ? 'default' : 'secondary'} className="text-[10px] shrink-0">{chat.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.post_title} • {chat.last_message ? chat.last_message.substring(0, 50) : 'No messages yet'}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatroomsPage;

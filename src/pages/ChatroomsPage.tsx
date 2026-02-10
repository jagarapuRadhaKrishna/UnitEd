import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserChatrooms } from '@/services/chatroomService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Clock, ArrowRight } from 'lucide-react';

const ChatroomsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const chatrooms = user ? getUserChatrooms(user.id) : [];

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
            const lastMsg = chat.messages[chat.messages.length - 1];
            const unread = chat.messages.filter(m => !m.readBy?.includes(user!.id) && m.senderId !== user!.id).length;
            return (
              <Card key={chat.id} className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate(`/chatroom/${chat.id}`)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm truncate">{chat.postTitle}</p>
                        {unread > 0 && <Badge className="bg-destructive text-destructive-foreground text-[10px] h-5">{unread}</Badge>}
                        <Badge variant={chat.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">{chat.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {lastMsg ? `${lastMsg.senderName}: ${lastMsg.content.substring(0, 60)}` : 'No messages yet'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" /> {chat.members.length}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {new Date(chat.lastActivity).toLocaleDateString()}
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

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getChatroomById, sendMessage } from '@/services/chatroomService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send, Users, Info } from 'lucide-react';
import type { Message } from '@/types/united';

const ChatroomPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatroom = id ? getChatroomById(id) : undefined;

  useEffect(() => {
    if (chatroom) setMessages([...chatroom.messages]);
  }, [chatroom?.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!chatroom) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold mb-4">Chat room not found</h2>
        <Button variant="outline" onClick={() => navigate('/chatrooms')}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Chatrooms</Button>
      </div>
    );
  }

  const handleSend = () => {
    if (!messageText.trim() || !user?.id) return;
    try {
      const msg = sendMessage({ chatroomId: chatroom.id, senderId: user.id, content: messageText.trim() });
      setMessages(prev => [...prev, msg]);
      setMessageText('');
    } catch (e) { console.error(e); }
  };

  const isReadOnly = chatroom.status !== 'active';

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/chatrooms')}><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h2 className="font-semibold text-sm">{chatroom.postTitle}</h2>
            <p className="text-xs text-muted-foreground">{chatroom.members.length} members • {chatroom.status}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowMembers(!showMembers)}>
          <Users className="w-4 h-4" />
        </Button>
      </div>

      {/* Members panel */}
      {showMembers && (
        <Card className="mb-3">
          <CardContent className="p-3">
            <h4 className="font-semibold text-xs mb-2">Members</h4>
            <div className="space-y-2">
              {chatroom.members.map(m => (
                <div key={m.userId} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={m.avatar} />
                    <AvatarFallback className="text-[10px] bg-primary/10">{m.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{m.name}</span>
                  {m.role === 'owner' && <Badge variant="secondary" className="text-[10px] h-4">Owner</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 border rounded-lg p-3 mb-3">
        <div className="space-y-3">
          {messages.map(msg => {
            const isOwn = msg.senderId === user?.id;
            const isSystem = msg.type === 'system';
            if (isSystem) {
              return (
                <div key={msg.id} className="text-center">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">{msg.content}</span>
                </div>
              );
            }
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg px-3 py-2`}>
                  {!isOwn && <p className="text-[10px] font-semibold mb-0.5 opacity-70">{msg.senderName}</p>}
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      {isReadOnly ? (
        <div className="text-center py-2 text-sm text-muted-foreground bg-muted rounded-lg">
          <Info className="w-4 h-4 inline mr-1" /> This chat room is read-only
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!messageText.trim()} className="bg-primary">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatroomPage;

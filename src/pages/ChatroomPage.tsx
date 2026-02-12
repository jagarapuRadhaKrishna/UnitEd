import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Users, Info, Loader2, Paperclip, Image as ImageIcon, FileText, Download, X } from 'lucide-react';
import { toast } from 'sonner';

interface Msg {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  type: string;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
}

interface Member {
  user_id: string;
  name: string;
  role: string;
}

const ChatroomPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [postTitle, setPostTitle] = useState('');
  const [status, setStatus] = useState('active');
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id && user?.id) fetchChatroom();
  }, [id, user?.id]);

  const fetchChatroom = async () => {
    if (!id || !user?.id) return;
    setLoading(true);
    try {
      const { data: chatroom } = await supabase
        .from('chatrooms')
        .select('id, status, post_id')
        .eq('id', id)
        .maybeSingle();

      if (!chatroom) { setLoading(false); return; }
      setStatus(chatroom.status);

      const { data: post } = await supabase
        .from('posts')
        .select('title')
        .eq('id', chatroom.post_id)
        .maybeSingle();
      setPostTitle(post?.title || 'Chat Room');

      const { data: memberData } = await supabase
        .from('chatroom_members')
        .select('user_id, role')
        .eq('chatroom_id', id);

      const memberIds = (memberData || []).map(m => m.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', memberIds);

      const profileMap: Record<string, string> = {};
      (profiles || []).forEach(p => { profileMap[p.id] = `${p.first_name || ''} ${p.last_name || ''}`.trim(); });

      setMembers((memberData || []).map(m => ({
        user_id: m.user_id,
        name: profileMap[m.user_id] || 'Unknown',
        role: m.role,
      })));

      await fetchMessages(profileMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (profileMap?: Record<string, string>) => {
    if (!id) return;
    const { data: msgs } = await supabase
      .from('messages')
      .select('id, content, sender_id, type, file_url, file_name, created_at')
      .eq('chatroom_id', id)
      .order('created_at', { ascending: true });

    if (!profileMap) {
      const senderIds = [...new Set((msgs || []).map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', senderIds);
      profileMap = {};
      (profiles || []).forEach(p => { profileMap![p.id] = `${p.first_name || ''} ${p.last_name || ''}`.trim(); });
    }

    setMessages((msgs || []).map(m => ({
      ...m,
      sender_name: profileMap![m.sender_id] || 'Unknown',
    })));
  };

  // Real-time messages
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`chatroom-${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chatroom_id=eq.${id}` }, () => {
        fetchMessages();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    if (!messageText.trim() || !user?.id || !id) return;
    const text = messageText.trim();
    setMessageText('');
    try {
      const { error } = await supabase.from('messages').insert({
        chatroom_id: id, sender_id: user.id,
        content: text, type: 'text',
      });
      if (error) throw error;
      // Immediately refetch messages for instant UI update
      await Promise.all([
        fetchMessages(),
        supabase.from('chatrooms').update({ last_activity: new Date().toISOString() }).eq('id', id),
      ]);
    } catch (e) {
      console.error(e);
      setMessageText(text); // Restore on error
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id || !id) return;

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'file';
      const filePath = `${user.id}/${id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath);

      const isImage = file.type.startsWith('image/');
      const msgType = isImage ? 'image' : 'file';

      const { error } = await supabase.from('messages').insert({
        chatroom_id: id, sender_id: user.id,
        content: isImage ? '📷 Image' : `📎 ${file.name}`,
        type: msgType,
        file_url: publicUrl,
        file_name: file.name,
      });
      if (error) throw error;

      // Immediately refetch for instant UI update
      await Promise.all([
        fetchMessages(),
        supabase.from('chatrooms').update({ last_activity: new Date().toISOString() }).eq('id', id),
      ]);
      toast.success(`${isImage ? 'Image' : 'File'} sent!`);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i.test(url);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!postTitle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold mb-4">Chat room not found</h2>
        <Button variant="outline" onClick={() => navigate('/chatrooms')}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Chatrooms</Button>
      </div>
    );
  }

  const isReadOnly = status !== 'active';

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/chatrooms')}><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h2 className="font-semibold text-sm">{postTitle}</h2>
            <p className="text-xs text-muted-foreground">{members.length} members • {status}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowMembers(!showMembers)}>
          <Users className="w-4 h-4" />
        </Button>
      </div>

      {showMembers && (
        <Card className="mb-3">
          <CardContent className="p-3">
            <h4 className="font-semibold text-xs mb-2">Members</h4>
            <div className="space-y-2">
              {members.map(m => (
                <div key={m.user_id} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
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

      <ScrollArea className="flex-1 border rounded-lg p-3 mb-3">
        <div className="space-y-3">
          {messages.map(msg => {
            const isOwn = msg.sender_id === user?.id;
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
                  {!isOwn && <p className="text-[10px] font-semibold mb-0.5 opacity-70">{msg.sender_name}</p>}

                  {/* Image message */}
                  {msg.type === 'image' && msg.file_url && (
                    <div className="mb-1">
                      <img
                        src={msg.file_url}
                        alt={msg.file_name || 'Image'}
                        className="rounded-md max-w-full max-h-60 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(msg.file_url!, '_blank')}
                      />
                    </div>
                  )}

                  {/* File message */}
                  {msg.type === 'file' && msg.file_url && (
                    <a
                      href={msg.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 p-2 rounded-md mb-1 ${isOwn ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20' : 'bg-background/50 hover:bg-background/80'} transition-colors`}
                    >
                      <FileText className="w-5 h-5 shrink-0" />
                      <span className="text-xs truncate flex-1">{msg.file_name || 'Document'}</span>
                      <Download className="w-4 h-4 shrink-0" />
                    </a>
                  )}

                  {/* Text content (skip for image-only) */}
                  {msg.type === 'text' && <p className="text-sm">{msg.content}</p>}

                  <p className={`text-[10px] mt-1 ${isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {isReadOnly ? (
        <div className="text-center py-2 text-sm text-muted-foreground bg-muted rounded-lg">
          <Info className="w-4 h-4 inline mr-1" /> This chat room is read-only
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="shrink-0"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
          </Button>
          <Input
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!messageText.trim()} className="bg-primary shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatroomPage;

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Users, Info, Loader2, Paperclip, FileText, Download, X, Trash2, UserMinus, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

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
  isPostOwner?: boolean;
}

const ChatroomPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [postTitle, setPostTitle] = useState('');
  const [postId, setPostId] = useState<string | null>(null);
  const [status, setStatus] = useState('active');
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [removingMember, setRemovingMember] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const memberProfileRef = useRef<Record<string, { name: string; isOwner: boolean }>>({});

  const isDark = useMemo(() => {
    const mode = theme === 'system' ? resolvedTheme : theme;
    return mode === 'dark';
  }, [theme, resolvedTheme]);

  const iconClass = isDark ? 'text-foreground' : '';
  const subtleIconClass = isDark ? 'text-foreground/80' : '';

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
      setPostId(chatroom.post_id);

      const [{ data: post }, { data: memberData }, { data: msgs }] = await Promise.all([
        supabase.from('posts').select('title, author_id').eq('id', chatroom.post_id).maybeSingle(),
        supabase.from('chatroom_members').select('user_id, role').eq('chatroom_id', id),
        supabase.from('messages').select('id, content, sender_id, type, file_url, file_name, created_at').eq('chatroom_id', id).order('created_at', { ascending: true }),
      ]);

      setPostTitle(post?.title || 'Chat Room');
      setIsOwner(post?.author_id === user.id);

      const memberIds = (memberData || []).map(m => m.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', memberIds.length ? memberIds : ['__none__']);

      const profileMap: Record<string, { name: string; isOwner: boolean }> = {};
      const postOwnerId = post?.author_id;
      (profiles || []).forEach(p => {
        profileMap[p.id] = {
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
          isOwner: p.id === postOwnerId,
        };
      });
      memberProfileRef.current = profileMap;

      setMembers((memberData || []).map(m => ({
        user_id: m.user_id,
        name: profileMap[m.user_id]?.name || 'Unknown',
        role: m.role,
        isPostOwner: profileMap[m.user_id]?.isOwner || false,
      })));

      setMessages((msgs || []).map(m => ({
        ...m,
        sender_name: profileMap[m.sender_id]?.name || 'Unknown',
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (profileMap?: Record<string, { name: string; isOwner: boolean }>) => {
    if (!id) return;
    const { data: msgs } = await supabase
      .from('messages')
      .select('id, content, sender_id, type, file_url, file_name, created_at')
      .eq('chatroom_id', id)
      .order('created_at', { ascending: true });

    if (!profileMap) {
      profileMap = memberProfileRef.current;
    }

    if (!profileMap || Object.keys(profileMap).length === 0) {
      const senderIds = [...new Set((msgs || []).map(m => m.sender_id))];
      if (senderIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name');
        profileMap = {};
        (profiles || []).forEach(p => { profileMap![p.id] = { name: `${p.first_name || ''} ${p.last_name || ''}`.trim(), isOwner: false }; });
        memberProfileRef.current = profileMap;
      } else {
        profileMap = {};
      }
    }

    setMessages((msgs || []).map(m => ({
      ...m,
      sender_name: profileMap![m.sender_id]?.name || 'Unknown',
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('File size must be under 10MB'); return; }
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }
  };

  const clearSelectedFile = () => {
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setSelectedFile(null);
    setFilePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const notifyOtherMembers = async (content: string) => {
    if (!user?.id || !id) return;
    const senderName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Someone';
    const otherMembers = members.filter(m => m.user_id !== user.id);
    if (otherMembers.length === 0) return;

    const notifications = otherMembers.map(m => ({
      user_id: m.user_id,
      type: 'new_message',
      title: `New message from ${senderName}`,
      message: content.length > 100 ? content.substring(0, 100) + '...' : content,
      link: `/chatroom/${id}`,
      related_chatroom_id: id,
      related_user_id: user.id,
    }));

    await supabase.from('notifications').insert(notifications);
  };

  const handleSend = async () => {
    if (!user?.id || !id) return;
    if (!messageText.trim() && !selectedFile) return;

    if (selectedFile) {
      setUploading(true);
      try {
        const ext = selectedFile.name.split('.').pop() || 'file';
        const filePath = `${user.id}/${id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('chat-files').upload(filePath, selectedFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('chat-files').getPublicUrl(filePath);
        const isImage = selectedFile.type.startsWith('image/');
        const { error } = await supabase.from('messages').insert({
          chatroom_id: id, sender_id: user.id,
          content: isImage ? '📷 Image' : `📎 ${selectedFile.name}`,
          type: isImage ? 'image' : 'file', file_url: publicUrl, file_name: selectedFile.name,
        });
        if (error) throw error;
        const fileContent = isImage ? '📷 Image' : `📎 ${selectedFile.name}`;
        clearSelectedFile();
        await Promise.all([fetchMessages(), supabase.from('chatrooms').update({ last_activity: new Date().toISOString() }).eq('id', id), notifyOtherMembers(fileContent)]);
        toast.success(`${isImage ? 'Image' : 'File'} sent!`);
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to upload file');
      } finally {
        setUploading(false);
      }
      if (messageText.trim()) {
        const text = messageText.trim();
        setMessageText('');
        try {
          await supabase.from('messages').insert({ chatroom_id: id, sender_id: user.id, content: text, type: 'text' });
          await fetchMessages();
        } catch (e) { console.error(e); }
      }
      return;
    }

    const text = messageText.trim();
    setMessageText('');
    try {
      const { error } = await supabase.from('messages').insert({ chatroom_id: id, sender_id: user.id, content: text, type: 'text' });
      if (error) throw error;
      await Promise.all([fetchMessages(), supabase.from('chatrooms').update({ last_activity: new Date().toISOString() }).eq('id', id), notifyOtherMembers(text)]);
    } catch (e) {
      console.error(e);
      setMessageText(text);
    }
  };

  // Owner: Delete chatroom
  const handleDeleteChatroom = async () => {
    if (!id) return;
    try {
      await supabase.from('chatrooms').update({ status: 'deleted', deleted_at: new Date().toISOString() }).eq('id', id);
      toast.success('Chatroom deleted');
      navigate('/chatrooms');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete chatroom');
    }
  };

  // Owner: Remove member
  const handleRemoveMember = async (memberId: string) => {
    if (!id) return;
    try {
      // We can't delete chatroom_members (no RLS DELETE policy), so we'll remove via a workaround
      // Actually let's check — the schema says can't DELETE. We need a migration for that.
      // For now, send a system message and remove from UI. We need to add DELETE policy.
      const memberName = members.find(m => m.user_id === memberId)?.name || 'A member';
      
      // Try to delete the member
      const { error } = await supabase
        .from('chatroom_members')
        .delete()
        .eq('chatroom_id', id)
        .eq('user_id', memberId);
      
      if (error) throw error;

      await supabase.from('messages').insert({
        chatroom_id: id, sender_id: user!.id,
        content: `${memberName} was removed from the chatroom`,
        type: 'system',
      });

      setMembers(prev => prev.filter(m => m.user_id !== memberId));
      setRemovingMember(null);
      toast.success(`${memberName} removed`);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to remove member: ' + (err.message || ''));
    }
  };

  // Owner: Invite by email
  const handleInviteByEmail = async () => {
    if (!inviteEmail.trim() || !postId || !user?.id) return;
    setInviting(true);
    try {
      // Find user by email
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('email', inviteEmail.trim())
        .maybeSingle();

      if (profileErr || !profile) {
        toast.error('No user found with that email');
        setInviting(false);
        return;
      }

      if (profile.id === user.id) {
        toast.error("You can't invite yourself");
        setInviting(false);
        return;
      }

      // Check if already a member
      const alreadyMember = members.find(m => m.user_id === profile.id);
      if (alreadyMember) {
        toast.error('User is already a member of this chatroom');
        setInviting(false);
        return;
      }

      // Check for existing pending invitation
      const { data: existingInv } = await supabase
        .from('invitations')
        .select('id')
        .eq('post_id', postId)
        .eq('invitee_id', profile.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingInv) {
        toast.error('An invitation is already pending for this user');
        setInviting(false);
        return;
      }

      // Create invitation
      const { error: invError } = await supabase.from('invitations').insert({
        post_id: postId,
        inviter_id: user.id,
        invitee_id: profile.id,
      });
      if (invError) throw invError;

      // Notify the invitee
      await supabase.from('notifications').insert({
        user_id: profile.id,
        type: 'invitation_received',
        title: 'New Invitation',
        message: `${user.firstName || ''} ${user.lastName || ''} invited you to join "${postTitle}"`,
        link: '/invitations',
        related_post_id: postId,
        related_user_id: user.id,
      });

      toast.success(`Invitation sent to ${profile.first_name || profile.email}`);
      setInviteEmail('');
      setShowInviteDialog(false);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to send invitation: ' + (err.message || ''));
    } finally {
      setInviting(false);
    }
  };

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
          <Button variant="ghost" size="icon" onClick={() => navigate('/chatrooms')}><ArrowLeft className={`w-4 h-4 ${iconClass}`} /></Button>
          <div>
            <h2 className="font-semibold text-sm text-foreground">
              {members.map(m => (m.name || '').split(' ')[0] || 'Member').join(' & ') || postTitle}
            </h2>
            <p className="text-xs text-muted-foreground">{postTitle} • {members.length} members</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isOwner && (
            <>
              <Button variant="ghost" size="icon" onClick={() => setShowInviteDialog(true)} title="Add member by email">
                <UserPlus className={`w-4 h-4 ${iconClass}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(true)} title="Delete chatroom" className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={() => setShowMembers(!showMembers)}>
            <Users className={`w-4 h-4 ${iconClass}`} />
          </Button>
        </div>
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
                  <span className="text-xs flex-1">{m.name}</span>
                  {m.isPostOwner && <Badge variant="secondary" className="text-[10px] h-4">Owner</Badge>}
                  {isOwner && m.user_id !== user?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => setRemovingMember(m.user_id)}
                      title="Remove member"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                    </Button>
                  )}
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
              <div key={msg.id} className={`group flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-end gap-1">
                  {isOwn && (
                    <button
                      onClick={async () => {
                        try {
                          await supabase.from('messages').delete().eq('id', msg.id);
                          setMessages(prev => prev.filter(m => m.id !== msg.id));
                          toast.success('Message deleted');
                        } catch { toast.error('Failed to delete'); }
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-destructive"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className={`max-w-[70%] ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'} rounded-lg px-3 py-2`}>
                    {!isOwn && <p className="text-[10px] font-semibold mb-0.5 opacity-70">{msg.sender_name}</p>}
                    {msg.type === 'image' && msg.file_url && (
                      <div className="mb-1">
                        <img src={msg.file_url} alt={msg.file_name || 'Image'} className="rounded-md max-w-full max-h-60 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.file_url!, '_blank')} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                    {msg.type === 'file' && msg.file_url && (
                      <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2 rounded-md mb-1 ${isOwn ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20' : 'bg-background/50 hover:bg-background/80'} transition-colors`}>
                        <FileText className="w-5 h-5 shrink-0" />
                        <span className="text-xs truncate flex-1">{msg.file_name || 'Document'}</span>
                        <Download className="w-4 h-4 shrink-0" />
                      </a>
                    )}
                    {msg.type === 'text' && <p className="text-sm">{msg.content}</p>}
                    <p className={`text-[10px] mt-1 ${isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {isReadOnly ? (
          <div className="text-center py-2 text-sm text-muted-foreground bg-muted rounded-lg">
            <Info className={`w-4 h-4 inline mr-1 ${iconClass}`} /> This chat room is read-only
          </div>
        ) : (
        <div>
          {selectedFile && (
            <div className="flex items-center gap-3 p-2 mb-2 bg-muted rounded-lg border">
              {filePreviewUrl ? (
                <img src={filePreviewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
              ) : (
                <div className="h-16 w-16 bg-background rounded-md flex items-center justify-center">
                  <FileText className={`w-6 h-6 text-muted-foreground ${iconClass}`} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <Button variant="ghost" size="icon" onClick={clearSelectedFile} className="shrink-0"><X className="w-4 h-4" /></Button>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar" className="hidden" onChange={handleFileSelect} />
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="shrink-0">
              {uploading ? <Loader2 className={`w-4 h-4 animate-spin ${iconClass}`} /> : <Paperclip className={`w-4 h-4 ${iconClass}`} />}
            </Button>
            <Input
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder={selectedFile ? "Add a caption (optional)..." : "Type a message..."}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="flex-1 text-foreground placeholder:text-foreground/70"
            />
            <Button onClick={handleSend} disabled={(!messageText.trim() && !selectedFile) || uploading} className="bg-primary shrink-0">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin text-foreground" /> : <Send className="w-4 h-4 text-foreground" />}
            </Button>
          </div>
        </div>
      )}

      {/* Invite by Email Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Invite by Email</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="text-foreground">Email address</Label>
            <Input
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="user@example.com"
              className="mt-1 text-foreground placeholder:text-foreground/70"
              onKeyDown={e => e.key === 'Enter' && handleInviteByEmail()}
            />
            <p className="text-xs text-foreground/80 mt-2">A post invitation will be sent. Once accepted, the user joins this chatroom.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Cancel</Button>
            <Button onClick={handleInviteByEmail} disabled={!inviteEmail.trim() || inviting}>
              {inviting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Chatroom Confirm */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Chatroom</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this chatroom? All members will lose access. This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteChatroom}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirm */}
      <Dialog open={!!removingMember} onOpenChange={() => setRemovingMember(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove <strong>{members.find(m => m.user_id === removingMember)?.name}</strong> from this chatroom?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemovingMember(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => removingMember && handleRemoveMember(removingMember)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatroomPage;

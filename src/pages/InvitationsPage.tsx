import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, CheckCircle, XCircle, Clock, Calendar, Info, Loader2 } from 'lucide-react';

interface InvitationItem {
  id: string;
  status: string;
  created_at: string;
  inviter_id: string;
  invitee_id: string;
  post_id: string;
  post_title: string;
  post_purpose: string;
  person_name: string;
  person_skills: string[];
}

const InvitationsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sent, setSent] = useState<InvitationItem[]>([]);
  const [received, setReceived] = useState<InvitationItem[]>([]);
  const [tab, setTab] = useState('sent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchInvitations();
  }, [user?.id]);

  const fetchInvitations = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: invitations } = await supabase
        .from('invitations')
        .select('*')
        .or(`inviter_id.eq.${user.id},invitee_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (!invitations || invitations.length === 0) {
        setSent([]);
        setReceived([]);
        setLoading(false);
        return;
      }

      // Fetch related posts and profiles
      const postIds = [...new Set(invitations.map(i => i.post_id))];
      const userIds = [...new Set(invitations.flatMap(i => [i.inviter_id, i.invitee_id]))];

      const [postsRes, profilesRes] = await Promise.all([
        supabase.from('posts').select('id, title, purpose').in('id', postIds),
        supabase.from('profiles').select('id, first_name, last_name, skills').in('id', userIds),
      ]);

      const postMap: Record<string, any> = {};
      (postsRes.data || []).forEach(p => { postMap[p.id] = p; });
      const profileMap: Record<string, any> = {};
      (profilesRes.data || []).forEach(p => { profileMap[p.id] = p; });

      const sentItems: InvitationItem[] = [];
      const receivedItems: InvitationItem[] = [];

      invitations.forEach(inv => {
        const post = postMap[inv.post_id];
        const isSent = inv.inviter_id === user.id;
        const personId = isSent ? inv.invitee_id : inv.inviter_id;
        const person = profileMap[personId];

        const item: InvitationItem = {
          id: inv.id,
          status: inv.status,
          created_at: inv.created_at,
          inviter_id: inv.inviter_id,
          invitee_id: inv.invitee_id,
          post_id: inv.post_id,
          post_title: post?.title || 'Unknown Post',
          post_purpose: post?.purpose || '',
          person_name: person ? `${person.first_name || ''} ${person.last_name || ''}`.trim() : 'Unknown',
          person_skills: person?.skills || [],
        };

        if (isSent) sentItems.push(item);
        else receivedItems.push(item);
      });

      setSent(sentItems);
      setReceived(receivedItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('invitations-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitations' }, () => fetchInvitations())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const handleRespond = async (invitationId: string, action: 'accepted' | 'declined') => {
    try {
      const inv = received.find(i => i.id === invitationId);
      const { error } = await supabase
        .from('invitations')
        .update({ status: action, responded_at: new Date().toISOString() })
        .eq('id', invitationId);
      if (error) throw error;

      // Notify the inviter about the response
      if (inv) {
        await supabase.from('notifications').insert({
          user_id: inv.inviter_id,
          type: action === 'accepted' ? 'invitation_accepted' : 'invitation_declined',
          title: action === 'accepted' ? 'Invitation Accepted! 🎉' : 'Invitation Declined',
          message: `${user?.firstName || ''} ${user?.lastName || ''} ${action} your invitation for "${inv.post_title}"`,
          link: '/invitations',
          related_post_id: inv.post_id,
          related_user_id: user?.id,
        });
      }

      toast({ title: action === 'accepted' ? 'Invitation accepted!' : 'Invitation declined' });
      fetchInvitations();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleCancel = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);
      if (error) throw error;
      toast({ title: 'Invitation cancelled' });
      fetchInvitations();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-secondary text-secondary-foreground',
      accepted: 'bg-accent/20 text-accent-foreground',
      declined: 'bg-destructive/10 text-destructive',
      cancelled: 'bg-muted text-muted-foreground',
    };
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="w-3.5 h-3.5" />,
      accepted: <CheckCircle className="w-3.5 h-3.5" />,
      declined: <XCircle className="w-3.5 h-3.5" />,
      cancelled: <XCircle className="w-3.5 h-3.5" />,
    };
    return (
      <Badge className={`${styles[status] || styles.pending} border-0 capitalize`}>
        <span className="mr-1">{icons[status]}</span> {status}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const InvitationCard = ({ inv, type }: { inv: InvitationItem; type: 'sent' | 'received' }) => (
    <Card className="hover:border-primary/30 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 flex-1">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary text-sm">{inv.person_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm">{inv.person_name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {type === 'sent' ? 'Invited to' : 'Invited you to'}: <strong>{inv.post_title}</strong>
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(inv.created_at).toLocaleDateString()}</span>
                <Badge variant="secondary" className="text-[10px]">{inv.post_purpose}</Badge>
              </div>
              {type === 'sent' && inv.person_skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {inv.person_skills.slice(0, 3).map(s => (
                    <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 ml-4">
            {statusBadge(inv.status)}
            {type === 'sent' && inv.status === 'pending' && (
              <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => handleCancel(inv.id)}>
                Cancel
              </Button>
            )}
            {type === 'received' && inv.status === 'pending' && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleRespond(inv.id, 'accepted')}>Accept</Button>
                <Button size="sm" variant="outline" onClick={() => handleRespond(inv.id, 'declined')}>Decline</Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">👥 Invitations</h1>
        <p className="text-muted-foreground">Manage your team invitations — send invites and view received invitations.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="sent" className="gap-2"><Send className="w-4 h-4" /> I Invited ({sent.length})</TabsTrigger>
          <TabsTrigger value="received" className="gap-2"><Mail className="w-4 h-4" /> They Invited Me ({received.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="mt-4">
          <div className="space-y-3">
            {sent.length === 0 ? (
              <Card className="py-8 text-center"><CardContent><p className="text-muted-foreground">No sent invitations yet</p></CardContent></Card>
            ) : sent.map(inv => <InvitationCard key={inv.id} inv={inv} type="sent" />)}
          </div>
        </TabsContent>

        <TabsContent value="received" className="mt-4">
          <div className="space-y-3">
            {received.length === 0 ? (
              <Card className="py-8 text-center"><CardContent><p className="text-muted-foreground">No received invitations yet</p></CardContent></Card>
            ) : received.map(inv => <InvitationCard key={inv.id} inv={inv} type="received" />)}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-primary/5 border-l-4 border-l-primary">
        <CardContent className="p-4">
          <h4 className="font-semibold text-primary mb-2 flex items-center gap-2"><Info className="w-4 h-4" /> How It Works</h4>
          <p className="text-sm text-primary/80 leading-relaxed">
            • <strong>I Invited</strong>: Shows invitations you've sent. You can cancel pending ones.<br/>
            • <strong>They Invited Me</strong>: Accept to join the team or decline to skip.<br/>
            • <strong>Auto-Disconnect</strong>: When a project closes, team connections auto-disconnect.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationsPage;

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getInvitations, respondToInvitation, cancelInvitation } from '@/services/invitationService';
import type { Invitation } from '@/types/united';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, CheckCircle, XCircle, Clock, Calendar, Info } from 'lucide-react';

const InvitationsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [tab, setTab] = useState('sent');

  const loadInvitations = () => setInvitations(getInvitations());

  useEffect(() => {
    loadInvitations();
    const handler = () => loadInvitations();
    window.addEventListener('invitationUpdate', handler);
    return () => window.removeEventListener('invitationUpdate', handler);
  }, []);

  const sent = invitations.filter(inv => inv.inviterId === user?.id);
  const received = invitations.filter(inv => inv.inviteeId === user?.id);

  const handleRespond = (invitationId: string, action: 'accepted' | 'declined') => {
    if (!user?.id) return;
    try {
      respondToInvitation(invitationId, user.id, action);
      loadInvitations();
      toast({ title: action === 'accepted' ? 'Invitation accepted!' : 'Invitation declined' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleCancel = (invitationId: string) => {
    if (!user?.id) return;
    try {
      cancelInvitation(invitationId, user.id);
      loadInvitations();
      toast({ title: 'Invitation cancelled' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-united-amber/10 text-united-amber',
      accepted: 'bg-united-green/10 text-united-green',
      declined: 'bg-united-red/10 text-united-red',
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

  const InvitationCard = ({ inv, type }: { inv: Invitation; type: 'sent' | 'received' }) => {
    const person = type === 'sent' ? inv.invitee : inv.inviter;
    return (
      <Card className="hover:border-united-purple/30 transition-all">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex gap-3 flex-1">
              <Avatar>
                <AvatarImage src={person.avatar} />
                <AvatarFallback className="bg-united-purple/10 text-united-purple text-sm">{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{person.name}</p>
                {type === 'sent' && 'email' in person && <p className="text-xs text-muted-foreground">{(person as any).email}</p>}
                <p className="text-sm text-muted-foreground mt-1">
                  {type === 'sent' ? 'Invited to' : 'Invited you to'}: <strong>{inv.post.title}</strong>
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(inv.createdAt).toLocaleDateString()}</span>
                  <Badge variant="secondary" className="text-[10px]">{inv.post.purpose}</Badge>
                </div>
                {type === 'sent' && inv.invitee.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {inv.invitee.skills.slice(0, 3).map(s => (
                      <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              {statusBadge(inv.status)}
              {type === 'sent' && inv.status === 'pending' && (
                <Button size="sm" variant="outline" className="text-united-red border-united-red/30 hover:bg-united-red/5" onClick={() => handleCancel(inv.id)}>
                  Cancel
                </Button>
              )}
              {type === 'received' && inv.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" className="bg-united-green hover:bg-united-green/90" onClick={() => handleRespond(inv.id, 'accepted')}>Accept</Button>
                  <Button size="sm" variant="outline" onClick={() => handleRespond(inv.id, 'declined')}>Decline</Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Invitations I've Sent</h3>
            <p className="text-sm text-muted-foreground">Track the status of invitations you've sent to others.</p>
          </div>
          <div className="space-y-3">
            {sent.length === 0 ? (
              <Card className="py-8 text-center"><CardContent><p className="text-muted-foreground">No sent invitations yet</p></CardContent></Card>
            ) : sent.map(inv => <InvitationCard key={inv.id} inv={inv} type="sent" />)}
          </div>
        </TabsContent>

        <TabsContent value="received" className="mt-4">
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Invitations I've Received</h3>
            <p className="text-sm text-muted-foreground">Accept to join a team or decline to skip.</p>
          </div>
          <div className="space-y-3">
            {received.length === 0 ? (
              <Card className="py-8 text-center"><CardContent><p className="text-muted-foreground">No received invitations yet</p></CardContent></Card>
            ) : received.map(inv => <InvitationCard key={inv.id} inv={inv} type="received" />)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Info Box */}
      <Card className="bg-united-purple/5 border-l-4 border-l-united-purple">
        <CardContent className="p-4">
          <h4 className="font-semibold text-united-purple mb-2 flex items-center gap-2"><Info className="w-4 h-4" /> How It Works</h4>
          <p className="text-sm text-united-purple/80 leading-relaxed">
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

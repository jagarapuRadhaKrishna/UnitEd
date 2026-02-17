import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, CheckCircle, Clock, XCircle, MessageCircle, Loader2, Send, Inbox } from 'lucide-react';
import { toast } from 'sonner';

interface AppItem {
  id: string;
  status: string;
  applied_at: string;
  post_id: string;
  post_title: string;
  post_purpose: string;
  author_name: string;
}

interface ReceivedAppItem {
  id: string;
  status: string;
  applied_at: string;
  post_id: string;
  post_title: string;
  applicant_name: string;
  applicant_id: string;
  applied_for_skill: string | null;
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  applied: { color: 'text-secondary-foreground', bg: 'bg-secondary', icon: <Clock className="w-4 h-4" /> },
  shortlisted: { color: 'text-primary', bg: 'bg-primary/10', icon: <Users className="w-4 h-4" /> },
  accepted: { color: 'text-accent-foreground', bg: 'bg-accent/20', icon: <CheckCircle className="w-4 h-4" /> },
  rejected: { color: 'text-destructive', bg: 'bg-destructive/10', icon: <XCircle className="w-4 h-4" /> },
  withdrawn: { color: 'text-muted-foreground', bg: 'bg-muted', icon: <XCircle className="w-4 h-4" /> },
};

const AppliedOpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<AppItem[]>([]);
  const [receivedApps, setReceivedApps] = useState<ReceivedAppItem[]>([]);
  const isFaculty = user?.role === 'faculty';
  const [viewMode, setViewMode] = useState<'sent' | 'received'>(isFaculty ? 'received' : 'sent');
  const [statusTab, setStatusTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Ensure faculty always defaults to 'received' once user loads
  useEffect(() => {
    if (user?.role === 'faculty') setViewMode('received');
  }, [user?.role]);

  useEffect(() => {
    if (user?.id) fetchAll();
  }, [user?.id]);

  const fetchAll = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await Promise.all([fetchSentApplications(), fetchReceivedApplications()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentApplications = async () => {
    if (!user?.id) return;
    const { data: apps } = await supabase
      .from('applications')
      .select('id, status, applied_at, post_id')
      .eq('applicant_id', user.id)
      .order('applied_at', { ascending: false });

    if (!apps || apps.length === 0) { setApplications([]); return; }

    const postIds = [...new Set(apps.map(a => a.post_id))];
    const { data: posts } = await supabase.from('posts').select('id, title, purpose, author_id').in('id', postIds);
    const authorIds = [...new Set((posts || []).map(p => p.author_id))];
    const { data: profiles } = await supabase.from('profiles').select('id, first_name, last_name').in('id', authorIds);

    const postMap: Record<string, any> = {};
    (posts || []).forEach(p => { postMap[p.id] = p; });
    const profileMap: Record<string, string> = {};
    (profiles || []).forEach(p => { profileMap[p.id] = `${p.first_name || ''} ${p.last_name || ''}`.trim(); });

    setApplications(apps.map(a => {
      const post = postMap[a.post_id];
      return {
        id: a.id, status: a.status, applied_at: a.applied_at, post_id: a.post_id,
        post_title: post?.title || 'Unknown', post_purpose: post?.purpose || '',
        author_name: post ? (profileMap[post.author_id] || 'Unknown') : 'Unknown',
      };
    }));
  };

  const fetchReceivedApplications = async () => {
    if (!user?.id) return;
    // Get user's posts first
    const { data: myPosts } = await supabase.from('posts').select('id, title').eq('author_id', user.id);
    if (!myPosts || myPosts.length === 0) { setReceivedApps([]); return; }

    const postIds = myPosts.map(p => p.id);
    const postTitleMap = new Map<string, string>();
    myPosts.forEach(p => postTitleMap.set(p.id, p.title));

    const { data: apps } = await supabase
      .from('applications')
      .select('id, status, applied_at, post_id, applicant_id, applied_for_skill')
      .in('post_id', postIds)
      .order('applied_at', { ascending: false });

    if (!apps || apps.length === 0) { setReceivedApps([]); return; }

    const applicantIds = [...new Set(apps.map(a => a.applicant_id))];
    const { data: profiles } = await supabase.from('profiles').select('id, first_name, last_name').in('id', applicantIds);
    const nameMap = new Map<string, string>();
    (profiles || []).forEach(p => nameMap.set(p.id, `${p.first_name || ''} ${p.last_name || ''}`.trim()));

    setReceivedApps(apps.map(a => ({
      id: a.id, status: a.status, applied_at: a.applied_at, post_id: a.post_id,
      post_title: postTitleMap.get(a.post_id) || 'Unknown',
      applicant_name: nameMap.get(a.applicant_id) || 'Unknown',
      applicant_id: a.applicant_id,
      applied_for_skill: a.applied_for_skill,
    })));
  };

  // Real-time
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('my-apps-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  // Faculty always sees 'received' regardless of viewMode state
  const effectiveViewMode = isFaculty ? 'received' : viewMode;
  const filteredSent = statusTab === 'all' ? applications : applications.filter(a => a.status === statusTab);
  const filteredReceived = statusTab === 'all' ? receivedApps : receivedApps.filter(a => a.status === statusTab);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleUpdateStatus = async (appId: string, newStatus: 'accepted' | 'rejected' | 'shortlisted') => {
    setActionLoading(appId);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', appId);

      if (error) throw error;

      const app = receivedApps.find(a => a.id === appId);
      if (app) {
        // Send notification to the applicant
        const notifTitle = newStatus === 'accepted' ? 'Application Accepted! 🎉' : newStatus === 'rejected' ? 'Application Update' : 'Application Shortlisted';
        const notifMessage = newStatus === 'accepted'
          ? `Your application for "${app.post_title}" has been accepted! You can now join the chatroom.`
          : newStatus === 'rejected'
          ? `Your application for "${app.post_title}" was not selected.`
          : `Your application for "${app.post_title}" has been shortlisted!`;

        await supabase.from('notifications').insert({
          user_id: app.applicant_id,
          type: `application_${newStatus}`,
          title: notifTitle,
          message: notifMessage,
          link: newStatus === 'accepted' ? '/chatrooms' : '/applications',
          related_post_id: app.post_id,
          related_user_id: user?.id,
        });

        // On accept: create or join chatroom for both users
        if (newStatus === 'accepted' && user?.id) {
          await createOrJoinChatroom(app.post_id, user.id, app.applicant_id);
        }
      }

      toast.success(`Application ${newStatus} successfully`);
      await fetchAll();
    } catch (err: any) {
      console.error('Error updating application:', err);
      toast.error('Failed to update application status');
    } finally {
      setActionLoading(null);
    }
  };

  const createOrJoinChatroom = async (postId: string, ownerId: string, applicantId: string) => {
    try {
      // Check if chatroom already exists for this post
      const { data: existingChatroom } = await supabase
        .from('chatrooms')
        .select('id')
        .eq('post_id', postId)
        .maybeSingle();

      let chatroomId: string;

      if (existingChatroom) {
        chatroomId = existingChatroom.id;
      } else {
        // Create new chatroom
        const { data: newChatroom, error: crError } = await supabase
          .from('chatrooms')
          .insert({ post_id: postId, status: 'active' })
          .select('id')
          .single();
        if (crError || !newChatroom) throw crError;
        chatroomId = newChatroom.id;

        // Add owner as member
        await supabase.from('chatroom_members').insert({
          chatroom_id: chatroomId, user_id: ownerId, role: 'owner',
        });
      }

      // Add applicant as member (ignore if already exists)
      const { data: existingMember } = await supabase
        .from('chatroom_members')
        .select('id')
        .eq('chatroom_id', chatroomId)
        .eq('user_id', applicantId)
        .maybeSingle();

      if (!existingMember) {
        await supabase.from('chatroom_members').insert({
          chatroom_id: chatroomId, user_id: applicantId, role: 'member',
        });
      }

      // Update post with chatroom_id
      await supabase.from('posts').update({ chatroom_id: chatroomId, chatroom_enabled: true }).eq('id', postId);

      // Send system message
      await supabase.from('messages').insert({
        chatroom_id: chatroomId, sender_id: ownerId,
        content: `${receivedApps.find(a => a.post_id === postId)?.applicant_name || 'A new member'} has joined the team! 🎉`,
        type: 'system',
      });
    } catch (err) {
      console.error('Error creating chatroom:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{isFaculty ? 'Received Applications' : 'My Applications'}</h1>
        <p className="text-muted-foreground">{isFaculty ? 'Track applications received on your posts' : 'Track sent and received applications'}</p>
      </div>

      {/* Sent / Received toggle - hidden for faculty */}
      {!isFaculty && (
        <div className="flex gap-2 mb-4">
          <Button
            variant={viewMode === 'sent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setViewMode('sent'); setStatusTab('all'); }}
          >
            <Send className="w-4 h-4 mr-1" /> Sent ({applications.length})
          </Button>
          <Button
            variant={viewMode === 'received' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setViewMode('received'); setStatusTab('all'); }}
          >
            <Inbox className="w-4 h-4 mr-1" /> Received ({receivedApps.length})
          </Button>
        </div>
      )}

      <Tabs value={statusTab} onValueChange={setStatusTab} className="mb-6">
        <TabsList>
          {effectiveViewMode === 'sent' ? (
            <>
              <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
              <TabsTrigger value="applied">Pending ({applications.filter(a => a.status === 'applied').length})</TabsTrigger>
              <TabsTrigger value="accepted">Accepted ({applications.filter(a => a.status === 'accepted').length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({applications.filter(a => a.status === 'rejected').length})</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="all">All ({receivedApps.length})</TabsTrigger>
              <TabsTrigger value="applied">Pending ({receivedApps.filter(a => a.status === 'applied').length})</TabsTrigger>
              <TabsTrigger value="accepted">Accepted ({receivedApps.filter(a => a.status === 'accepted').length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({receivedApps.filter(a => a.status === 'rejected').length})</TabsTrigger>
            </>
          )}
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {effectiveViewMode === 'sent' && filteredSent.map(app => {
          const cfg = statusConfig[app.status] || statusConfig.applied;
          return (
            <Card key={app.id} className="hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{app.post_title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Posted by <strong>{app.author_name}</strong></p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {app.post_purpose}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge className={`${cfg.bg} ${cfg.color} border-0 capitalize`}>
                      <span className="mr-1">{cfg.icon}</span> {app.status}
                    </Badge>
                    {app.status === 'accepted' && (
                      <Button size="sm" onClick={() => navigate(`/chatroom/${app.post_id}`)}>
                        <MessageCircle className="w-3.5 h-3.5 mr-1" /> Join Chatroom
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {effectiveViewMode === 'received' && filteredReceived.map(app => {
          const cfg = statusConfig[app.status] || statusConfig.applied;
          return (
            <Card key={app.id} className="hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{app.post_title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      From <strong className="cursor-pointer hover:text-accent" onClick={() => navigate(`/user/${app.applicant_id}`)}>{app.applicant_name}</strong>
                    </p>
                    {app.applied_for_skill && (
                      <p className="text-xs text-muted-foreground mb-2">Skill: {app.applied_for_skill}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(app.applied_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge className={`${cfg.bg} ${cfg.color} border-0 capitalize`}>
                      <span className="mr-1">{cfg.icon}</span> {app.status}
                    </Badge>
                    {app.status === 'applied' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" disabled={actionLoading === app.id} className="text-united-green border-united-green/30 hover:bg-united-green/10" onClick={() => handleUpdateStatus(app.id, 'accepted')}>
                          {actionLoading === app.id ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 mr-1" />} Accept
                        </Button>
                        <Button size="sm" variant="outline" disabled={actionLoading === app.id} className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleUpdateStatus(app.id, 'rejected')}>
                          {actionLoading === app.id ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <XCircle className="w-3.5 h-3.5 mr-1" />} Reject
                        </Button>
                      </div>
                    )}
                    {app.status === 'accepted' && (
                      <span className="text-xs text-united-green font-medium">✓ Accepted</span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="text-xs text-destructive font-medium">✗ Rejected</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {((effectiveViewMode === 'sent' && filteredSent.length === 0) || (effectiveViewMode === 'received' && filteredReceived.length === 0)) && (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="text-lg text-muted-foreground mb-2">No applications found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {effectiveViewMode === 'sent' ? "You haven't applied to any opportunities yet" : "No applications received on your posts yet"}
              </p>
              <Button onClick={() => navigate('/home')}>Browse Opportunities</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppliedOpportunitiesPage;

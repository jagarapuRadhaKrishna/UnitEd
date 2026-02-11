import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, CheckCircle, Clock, XCircle, MessageCircle, Loader2 } from 'lucide-react';

interface AppItem {
  id: string;
  status: string;
  applied_at: string;
  post_id: string;
  post_title: string;
  post_purpose: string;
  author_name: string;
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
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchApplications();
  }, [user?.id]);

  const fetchApplications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: apps } = await supabase
        .from('applications')
        .select('id, status, applied_at, post_id')
        .eq('applicant_id', user.id)
        .order('applied_at', { ascending: false });

      if (!apps || apps.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      const postIds = [...new Set(apps.map(a => a.post_id))];
      const { data: posts } = await supabase
        .from('posts')
        .select('id, title, purpose, author_id')
        .in('id', postIds);

      const authorIds = [...new Set((posts || []).map(p => p.author_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', authorIds);

      const postMap: Record<string, any> = {};
      (posts || []).forEach(p => { postMap[p.id] = p; });
      const profileMap: Record<string, string> = {};
      (profiles || []).forEach(p => { profileMap[p.id] = `${p.first_name || ''} ${p.last_name || ''}`.trim(); });

      setApplications(apps.map(a => {
        const post = postMap[a.post_id];
        return {
          id: a.id,
          status: a.status,
          applied_at: a.applied_at,
          post_id: a.post_id,
          post_title: post?.title || 'Unknown',
          post_purpose: post?.purpose || '',
          author_name: post ? (profileMap[post.author_id] || 'Unknown') : 'Unknown',
        };
      }));
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
      .channel('my-apps-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications', filter: `applicant_id=eq.${user.id}` }, () => fetchApplications())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const filtered = tab === 'all' ? applications : applications.filter(a => a.status === tab);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="text-muted-foreground">Track the status of all your opportunity applications</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
          <TabsTrigger value="applied">Pending ({applications.filter(a => a.status === 'applied').length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({applications.filter(a => a.status === 'accepted').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({applications.filter(a => a.status === 'rejected').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filtered.map(app => {
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

        {filtered.length === 0 && (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="text-lg text-muted-foreground mb-2">No applications found</p>
              <p className="text-sm text-muted-foreground mb-4">You haven't applied to any opportunities yet</p>
              <Button onClick={() => navigate('/home')}>Browse Opportunities</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppliedOpportunitiesPage;

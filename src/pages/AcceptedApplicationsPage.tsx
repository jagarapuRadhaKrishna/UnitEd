import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, Clock, XCircle, Eye, Search, MessageCircle, Calendar, Loader2 } from 'lucide-react';

interface AppItem {
  id: string;
  status: string;
  applied_at: string;
  reviewed_at: string | null;
  post_id: string;
  post_title: string;
  post_purpose: string;
}

const AcceptedApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<AppItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
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
        .select('id, status, applied_at, reviewed_at, post_id')
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
        .select('id, title, purpose')
        .in('id', postIds);

      const postMap: Record<string, any> = {};
      (posts || []).forEach(p => { postMap[p.id] = p; });

      setApplications(apps.map(a => {
        const post = postMap[a.post_id];
        return {
          id: a.id,
          status: a.status,
          applied_at: a.applied_at,
          reviewed_at: a.reviewed_at,
          post_id: a.post_id,
          post_title: post?.title || 'Unknown',
          post_purpose: post?.purpose || '',
        };
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusFilters = ['All', 'accepted', 'applied', 'shortlisted', 'rejected'];
  const filtered = applications.filter(app => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesSearch = !searchQuery || app.post_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applications.length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    pending: applications.filter(a => a.status === 'applied').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'applied': return <Clock className="w-4 h-4" />;
      case 'shortlisted': return <Eye className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-accent/20 text-accent-foreground';
      case 'applied': return 'bg-secondary text-secondary-foreground';
      case 'shortlisted': return 'bg-primary/10 text-primary';
      default: return 'bg-destructive/10 text-destructive';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="text-muted-foreground">Track and manage all your project applications</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Applications', value: stats.total, color: 'text-primary' },
          { label: 'Accepted', value: stats.accepted, color: 'text-accent-foreground' },
          { label: 'Pending', value: stats.pending, color: 'text-secondary-foreground' },
          { label: 'Shortlisted', value: stats.shortlisted, color: 'text-primary' },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by project..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map(status => (
            <Button
              key={status}
              size="sm"
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'All' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">Showing {filtered.length} application{filtered.length !== 1 ? 's' : ''}</p>

      <div className="space-y-4">
        {filtered.map(app => (
          <Card key={app.id} className="hover:border-primary/30 transition-all">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{app.post_title}</h3>
                  <p className="text-sm text-muted-foreground">{app.post_purpose}</p>
                </div>
                <Badge className={`${getStatusStyle(app.status)} border-0 capitalize`}>
                  <span className="mr-1">{getStatusIcon(app.status)}</span> {app.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                {app.reviewed_at && <span>Reviewed: {new Date(app.reviewed_at).toLocaleDateString()}</span>}
              </div>
              <div className="flex gap-2 pt-3 border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full font-medium border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 active:translate-y-1 transition-all duration-300"
                  onClick={() => navigate(`/post/${app.post_id}`)}
                >
                  View Post
                </Button>
                {app.status === 'accepted' && (
                  <Button 
                    size="sm" 
                    className="rounded-full font-medium border-0 cursor-pointer shadow-[0_4px_14px_0px_rgba(37,99,235,0.4)] transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 active:translate-y-1 active:shadow-none"
                    onClick={() => navigate(`/chatroom/${app.post_id}`)}
                  >
                    <MessageCircle className="w-3.5 h-3.5 mr-1" /> Join Chatroom
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">No applications found</p>
              <Button onClick={() => navigate('/home')}>Browse Opportunities</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AcceptedApplicationsPage;

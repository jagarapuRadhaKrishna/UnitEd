import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserApplications } from '@/services/applicationService';
import type { Application } from '@/types/united';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, Clock, XCircle, Eye, Search, MessageCircle, Calendar } from 'lucide-react';

const AcceptedApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    if (user?.id) setApplications(getUserApplications(user.id));
  }, [user?.id]);

  const statusFilters = ['All', 'accepted', 'applied', 'shortlisted', 'rejected'];
  const filtered = applications.filter(app => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesSearch = !searchQuery || (app.post?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
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
      case 'accepted': return 'bg-united-green/10 text-united-green';
      case 'applied': return 'bg-united-amber/10 text-united-amber';
      case 'shortlisted': return 'bg-united-blue/10 text-united-blue';
      default: return 'bg-united-red/10 text-united-red';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="text-muted-foreground">Track and manage all your project applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Applications', value: stats.total, color: 'text-united-purple' },
          { label: 'Accepted', value: stats.accepted, color: 'text-united-green' },
          { label: 'Pending', value: stats.pending, color: 'text-united-amber' },
          { label: 'Shortlisted', value: stats.shortlisted, color: 'text-united-blue' },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filters */}
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
              className={filterStatus === status ? 'bg-united-purple hover:bg-united-purple/90' : ''}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'All' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">Showing {filtered.length} application{filtered.length !== 1 ? 's' : ''}</p>

      {/* Applications List */}
      <div className="space-y-4">
        {filtered.map(app => (
          <Card key={app.id} className="hover:border-united-purple/30 transition-all">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{app.post?.title || 'Untitled'}</h3>
                  <p className="text-sm text-muted-foreground">{app.post?.purpose}</p>
                </div>
                <Badge className={`${getStatusStyle(app.status)} border-0 capitalize`}>
                  <span className="mr-1">{getStatusIcon(app.status)}</span> {app.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                {app.reviewedAt && <span>Reviewed: {new Date(app.reviewedAt).toLocaleDateString()}</span>}
              </div>
              <div className="flex gap-2 pt-3 border-t">
                <Button size="sm" variant="outline" onClick={() => navigate(`/post/${app.postId}`)}>View Post</Button>
                {app.status === 'accepted' && (
                  <Button size="sm" className="bg-united-green hover:bg-united-green/90" onClick={() => navigate(`/chatroom/${app.postId}`)}>
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
              <Button onClick={() => navigate('/home')} className="bg-united-blue hover:bg-united-blue/90">Browse Opportunities</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AcceptedApplicationsPage;

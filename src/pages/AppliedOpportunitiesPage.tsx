import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserApplications } from '@/services/applicationService';
import type { Application } from '@/types/united';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, CheckCircle, Clock, XCircle, MessageCircle } from 'lucide-react';

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  applied: { color: 'text-united-amber', bg: 'bg-united-amber/10', icon: <Clock className="w-4 h-4" /> },
  shortlisted: { color: 'text-primary', bg: 'bg-primary/10', icon: <Users className="w-4 h-4" /> },
  accepted: { color: 'text-united-green', bg: 'bg-united-green/10', icon: <CheckCircle className="w-4 h-4" /> },
  rejected: { color: 'text-united-red', bg: 'bg-united-red/10', icon: <XCircle className="w-4 h-4" /> },
  withdrawn: { color: 'text-muted-foreground', bg: 'bg-muted', icon: <XCircle className="w-4 h-4" /> },
};

const AppliedOpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    if (user?.id) setApplications(getUserApplications(user.id));
  }, [user?.id]);

  const filtered = tab === 'all' ? applications : applications.filter(a => a.status === tab);

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
                    <h3 className="text-lg font-semibold text-foreground mb-1">{app.post?.title || 'Untitled Post'}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Posted by <strong>{app.post?.author.name}</strong></p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {app.applicant.skills.slice(0, 4).map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs bg-primary/5 text-primary">{skill}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {app.post?.purpose}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge className={`${cfg.bg} ${cfg.color} border-0 capitalize`}>
                      <span className="mr-1">{cfg.icon}</span> {app.status}
                    </Badge>
                    {app.status === 'accepted' && (
                      <Button size="sm" onClick={() => navigate(`/chatroom/${app.postId}`)} className="bg-united-green hover:bg-united-green/90">
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

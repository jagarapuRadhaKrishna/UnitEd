import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllPosts } from '@/data/mockData';
import { getPostApplications, updateApplicationStatus } from '@/services/applicationService';
import type { Application } from '@/types/united';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, CheckCircle, XCircle, Mail, Award, Clock } from 'lucide-react';

const PostManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const allPosts = getAllPosts(user);
  const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = [...allPosts, ...storedPosts].find(p => p.id === id);

  useEffect(() => {
    if (id) setApplications(getPostApplications(id));
  }, [id]);

  const handleStatusUpdate = (appId: string, status: 'shortlisted' | 'accepted' | 'rejected') => {
    if (!user?.id) return;
    try {
      updateApplicationStatus(appId, user.id, status);
      if (id) setApplications(getPostApplications(id));
      toast({ title: `Application ${status}` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const pending = applications.filter(a => a.status === 'applied' || a.status === 'shortlisted');
  const accepted = applications.filter(a => a.status === 'accepted');
  const rejected = applications.filter(a => a.status === 'rejected');

  const totalRequired = post?.skillRequirements?.reduce((s: number, r: any) => s + r.requiredCount, 0) || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/applications')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Applicants</h1>
          <p className="text-muted-foreground">{post?.title || 'Post'}</p>
        </div>
      </div>

      {/* Stats */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-3xl font-bold text-united-purple">{applications.length}</p>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <p className="text-3xl font-bold text-united-green">{accepted.length}</p>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <p className="text-3xl font-bold text-united-amber">{pending.length}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Team Progress</p>
              <p className="text-lg font-semibold">{accepted.length} / {totalRequired} Members</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3">Pending Applications ({pending.length})</h3>
          <div className="space-y-3">
            {pending.map(app => (
              <Card key={app.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-5">
                  <div className="flex gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={app.applicant.avatar} />
                      <AvatarFallback className="bg-united-purple text-white font-semibold">{app.applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{app.applicant.name}</p>
                        <Badge className="bg-united-amber/10 text-united-amber border-0 text-xs capitalize">
                          <Clock className="w-3 h-3 mr-1" /> {app.status}
                        </Badge>
                      </div>
                      <div className="flex gap-3 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {app.applicant.email}</span>
                        <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mr-1"><Award className="w-3 h-3" /> Skills:</span>
                        {app.applicant.skills.slice(0, 5).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-[10px] bg-united-purple/5 text-united-purple">{skill}</Badge>
                        ))}
                      </div>
                      {app.coverLetter && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-3">
                          <p className="text-sm italic text-muted-foreground">"{app.coverLetter}"</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-united-green hover:bg-united-green/90" onClick={() => handleStatusUpdate(app.id, 'accepted')}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-united-red border-united-red/30 hover:bg-united-red/5" onClick={() => handleStatusUpdate(app.id, 'rejected')}>
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                        <Button size="sm" variant="ghost" className="text-united-purple" onClick={() => navigate(`/candidate/${app.applicantId}`)}>
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Accepted */}
      {accepted.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3">Accepted Members ({accepted.length})</h3>
          <div className="space-y-2">
            {accepted.map(app => (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-united-green text-white">{app.applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{app.applicant.name}</p>
                      <p className="text-sm text-muted-foreground">{app.applicant.email}</p>
                    </div>
                    <Badge className="bg-united-green/10 text-united-green border-0">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accepted
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <div>
          <h3 className="font-semibold text-muted-foreground mb-3">Rejected ({rejected.length})</h3>
          <div className="space-y-2">
            {rejected.map(app => (
              <Card key={app.id} className="opacity-60">
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted">{app.applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{app.applicant.name}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Rejected</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <p className="text-lg text-muted-foreground">No applications yet</p>
            <p className="text-sm text-muted-foreground mt-1">Share your post to attract applicants</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PostManagePage;

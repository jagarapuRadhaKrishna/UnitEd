import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, FileText, CheckCircle, Clock, Award, Target, Activity, Users, Plus, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalApplicationsSent: number;
  acceptedApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
  postsCreated: number;
  totalApplicationsReceived: number;
  activePostsCount: number;
}

interface RecentPost {
  id: string;
  title: string;
  purpose: string;
  status: string;
  created_at: string;
  applicationCount: number;
}

interface RecentApplication {
  id: string;
  status: string;
  applied_at: string;
  post_title: string;
  post_id: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplicationsSent: 0, acceptedApplications: 0, pendingApplications: 0,
    rejectedApplications: 0, postsCreated: 0, totalApplicationsReceived: 0, activePostsCount: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchDashboard = async () => {
      setLoading(true);

      // Fetch all data in parallel
      const [
        { data: myPosts },
        { data: myApps },
        { data: profile },
      ] = await Promise.all([
        supabase.from('posts').select('*').eq('author_id', user.id).order('created_at', { ascending: false }),
        supabase.from('applications').select('*').eq('applicant_id', user.id).order('applied_at', { ascending: false }),
        supabase.from('profiles').select('skills').eq('id', user.id).maybeSingle(),
      ]);

      const posts = myPosts || [];
      const apps = myApps || [];
      const skills = profile?.skills || [];
      setUserSkills(skills);

      // Get application counts for user's posts
      const postIds = posts.map(p => p.id);
      let receivedApps: any[] = [];
      if (postIds.length > 0) {
        const { data } = await supabase.from('applications').select('post_id, status').in('post_id', postIds);
        receivedApps = data || [];
      }

      // Fetch post titles for user's applications
      const appPostIds = [...new Set(apps.map(a => a.post_id))];
      let postTitleMap = new Map<string, string>();
      if (appPostIds.length > 0) {
        const { data: appPosts } = await supabase.from('posts').select('id, title').in('id', appPostIds);
        (appPosts || []).forEach(p => postTitleMap.set(p.id, p.title));
      }

      // Build app counts per post
      const appCountMap = new Map<string, number>();
      receivedApps.forEach(a => appCountMap.set(a.post_id, (appCountMap.get(a.post_id) || 0) + 1));

      setStats({
        totalApplicationsSent: apps.length,
        acceptedApplications: apps.filter(a => a.status === 'accepted').length,
        pendingApplications: apps.filter(a => a.status === 'applied' || a.status === 'shortlisted').length,
        rejectedApplications: apps.filter(a => a.status === 'rejected').length,
        postsCreated: posts.length,
        totalApplicationsReceived: receivedApps.length,
        activePostsCount: posts.filter(p => p.status === 'active').length,
      });

      setRecentPosts(posts.slice(0, 5).map(p => ({
        id: p.id,
        title: p.title,
        purpose: p.purpose,
        status: p.status,
        created_at: p.created_at,
        applicationCount: appCountMap.get(p.id) || 0,
      })));

      setRecentApplications(apps.slice(0, 5).map(a => ({
        id: a.id,
        status: a.status,
        applied_at: a.applied_at,
        post_title: postTitleMap.get(a.post_id) || 'Unknown Post',
        post_id: a.post_id,
      })));

      setLoading(false);
    };
    fetchDashboard();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const statCards = [
    { icon: FileText, title: 'Applications Sent', value: stats.totalApplicationsSent, color: 'text-accent', bg: 'bg-accent/10', onClick: () => navigate('/applications') },
    { icon: CheckCircle, title: 'Accepted', value: stats.acceptedApplications, color: 'text-united-green', bg: 'bg-united-green/10', onClick: () => navigate('/accepted-applications') },
    { icon: Clock, title: 'Pending', value: stats.pendingApplications, color: 'text-united-amber', bg: 'bg-united-amber/10', onClick: () => navigate('/applications') },
    { icon: Target, title: 'My Posts', value: stats.postsCreated, color: 'text-destructive', bg: 'bg-destructive/10', onClick: () => navigate('/my-posts') },
  ];

  const activityData = [
    { action: 'Sent', count: stats.totalApplicationsSent, color: 'bg-accent' },
    { action: 'Accepted', count: stats.acceptedApplications, color: 'bg-united-green' },
    { action: 'Posts', count: stats.postsCreated, color: 'bg-united-amber' },
    { action: 'Received', count: stats.totalApplicationsReceived, color: 'bg-destructive' },
  ];
  const maxCount = Math.max(...activityData.map(a => a.count), 1);

  const acceptanceRate = stats.totalApplicationsSent > 0
    ? Math.round((stats.acceptedApplications / stats.totalApplicationsSent) * 100) : 0;

  const statusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-united-green/10 text-united-green';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      case 'applied': case 'shortlisted': return 'bg-united-amber/10 text-united-amber';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.firstName || 'User'}! Here's your overview</p>
          </div>
          <Button onClick={() => navigate('/create-post')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus size={16} className="mr-1" /> Create Post
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {statCards.map(({ icon: Icon, title, value, color, bg, onClick }) => (
            <Card
              key={title}
              className="cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              onClick={onClick}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-0.5">{title}</p>
                    <p className="text-3xl font-bold text-foreground">{value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${bg}`}>
                    <Icon size={24} className={color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skills & Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Skills */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} className="text-accent" />
                <h2 className="font-semibold text-foreground">Your Skills</h2>
              </div>
              {userSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userSkills.map(skill => (
                    <Badge key={skill} variant="outline" className="bg-accent/5 border-accent/20 text-accent">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-2">No skills added yet</p>
                  <Button size="sm" variant="outline" onClick={() => navigate('/settings/profile')}>
                    Add Skills
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Bar Chart */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={20} className="text-accent" />
                <h2 className="font-semibold text-foreground">Activity Overview</h2>
              </div>
              <div className="h-44 flex items-end justify-around gap-3 px-2">
                {activityData.map(activity => {
                  const heightPct = (activity.count / maxCount) * 100;
                  return (
                    <div key={activity.action} className="flex-1 flex flex-col items-center justify-end h-full">
                      <span className="text-lg font-bold mb-1 text-foreground">{activity.count}</span>
                      <div
                        className={`w-full rounded-t-lg ${activity.color} hover:opacity-80 hover:-translate-y-1 transition-all duration-300`}
                        style={{ height: `${heightPct}%`, minHeight: '20px' }}
                      />
                      <span className="text-[10px] text-muted-foreground mt-2 text-center leading-tight">{activity.action}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={24} className="text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Performance Summary</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <p className="text-4xl font-bold text-united-green mb-1">{acceptanceRate}%</p>
                <p className="text-sm text-muted-foreground">Acceptance Rate</p>
              </div>
              <div className="text-center p-4">
                <p className="text-4xl font-bold text-accent mb-1">{stats.activePostsCount}</p>
                <p className="text-sm text-muted-foreground">Active Posts</p>
              </div>
              <div className="text-center p-4">
                <p className="text-4xl font-bold text-united-amber mb-1">{stats.totalApplicationsReceived}</p>
                <p className="text-sm text-muted-foreground">Applications Received</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts & Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Posts */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText size={18} /> Recent Posts
                </h2>
                <Button size="sm" variant="ghost" onClick={() => navigate('/my-posts')} className="text-accent text-xs">
                  View All
                </Button>
              </div>
              {recentPosts.length > 0 ? (
                <div className="space-y-3">
                  {recentPosts.map(post => (
                    <div
                      key={post.id}
                      className="p-3 rounded-lg border border-border hover:border-accent/30 cursor-pointer transition-colors"
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium text-sm text-foreground line-clamp-1">{post.title}</h3>
                        <Badge variant={post.status === 'active' ? 'default' : 'secondary'} className="text-[10px] ml-2 shrink-0">
                          {post.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{post.purpose}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {post.applicationCount} apps</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-2">No posts created yet</p>
                  <Button size="sm" onClick={() => navigate('/create-post')}>Create Your First Post</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Eye size={18} /> Recent Applications
                </h2>
                <Button size="sm" variant="ghost" onClick={() => navigate('/applications')} className="text-accent text-xs">
                  View All
                </Button>
              </div>
              {recentApplications.length > 0 ? (
                <div className="space-y-3">
                  {recentApplications.map(app => (
                    <div
                      key={app.id}
                      className="p-3 rounded-lg border border-border hover:border-accent/30 cursor-pointer transition-colors"
                      onClick={() => navigate(`/post/${app.post_id}`)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium text-sm text-foreground line-clamp-1">{app.post_title}</h3>
                        <Badge className={`text-[10px] ml-2 shrink-0 border-0 ${statusColor(app.status)}`}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-2">No applications yet</p>
                  <Button size="sm" onClick={() => navigate('/home')}>Browse Opportunities</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, FileText, CheckCircle, Clock, Award, Target, Activity, Users, Plus, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { isPostDeadlineReached, syncExpiredPosts } from '@/services/postAvailabilityService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, type Variants } from 'framer-motion';
import { useTheme } from 'next-themes';

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
  type: 'sent' | 'received';
  applicant_name?: string;
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
  const { theme, resolvedTheme } = useTheme();

  const isDark = useMemo(() => {
    const mode = theme === 'system' ? resolvedTheme : theme;
    return mode === 'dark';
  }, [theme, resolvedTheme]);

  const colors = useMemo(
    () => ({
      bg: isDark ? '#0b1220' : '#F9FAFB',
      card: isDark ? '#0f172a' : '#ffffff',
      border: isDark ? '#1f2937' : '#E5E7EB',
      heading: isDark ? '#e5e7eb' : '#111827',
      subtext: isDark ? '#9ca3af' : '#6B7280',
      chip: isDark ? '#111827' : '#F3F4F6',
      chipText: isDark ? '#e5e7eb' : '#111827',
      accent: '#6C47FF',
      accentHover: '#5936E8',
    }),
    [isDark]
  );

  useEffect(() => {
    if (!user?.id) return;
    const fetchDashboard = async () => {
      setLoading(true);
      await syncExpiredPosts();

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
      const visiblePosts = posts.filter((post) => post.status === 'active' && !isPostDeadlineReached(post.deadline));
      setUserSkills(skills);

      // Get application counts for user's posts
      const postIds = visiblePosts.map(p => p.id);
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
        postsCreated: visiblePosts.length,
        totalApplicationsReceived: receivedApps.length,
        activePostsCount: visiblePosts.length,
      });

      setRecentPosts(visiblePosts.slice(0, 5).map(p => ({
        id: p.id,
        title: p.title,
        purpose: p.purpose,
        status: p.status,
        created_at: p.created_at,
        applicationCount: appCountMap.get(p.id) || 0,
      })));

      // Build recent applications: combine sent + received
      const sentApps: RecentApplication[] = apps.slice(0, 5).map(a => ({
        id: a.id, status: a.status, applied_at: a.applied_at,
        post_title: postTitleMap.get(a.post_id) || 'Unknown Post',
        post_id: a.post_id, type: 'sent' as const,
      }));

      // Get received applications with applicant names
      let receivedAppsList: RecentApplication[] = [];
      if (receivedApps.length > 0 && postIds.length > 0) {
        const { data: receivedFull } = await supabase
          .from('applications')
          .select('id, status, applied_at, post_id, applicant_id')
          .in('post_id', postIds)
          .order('applied_at', { ascending: false })
          .limit(5);
        if (receivedFull && receivedFull.length > 0) {
          const applicantIds = [...new Set(receivedFull.map(a => a.applicant_id))];
          const { data: applicantProfiles } = await supabase
            .from('profiles').select('id, first_name, last_name').in('id', applicantIds);
          const nameMap = new Map<string, string>();
          (applicantProfiles || []).forEach(p => nameMap.set(p.id, `${p.first_name || ''} ${p.last_name || ''}`.trim()));

          const postTitleMapFull = new Map<string, string>();
          visiblePosts.forEach(p => postTitleMapFull.set(p.id, p.title));

          receivedAppsList = receivedFull.map(a => ({
            id: a.id, status: a.status, applied_at: a.applied_at,
            post_title: postTitleMapFull.get(a.post_id) || 'Unknown Post',
            post_id: a.post_id, type: 'received' as const,
            applicant_name: nameMap.get(a.applicant_id) || 'Unknown',
          }));
        }
      }

      // Merge and sort by date
      const allApps = [...sentApps, ...receivedAppsList]
        .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
        .slice(0, 5);
      setRecentApplications(allApps);

      setLoading(false);
    };
    fetchDashboard();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const statCards = [
    { icon: FileText, title: 'Applications Sent', value: stats.totalApplicationsSent, color: 'text-accent', bg: 'bg-accent/10', onClick: () => navigate('/applications') },
    { icon: CheckCircle, title: 'Accepted', value: stats.acceptedApplications, color: 'text-united-green', bg: 'bg-united-green/10', onClick: () => navigate('/accepted-applications') },
    { icon: Clock, title: 'Pending', value: stats.pendingApplications, color: 'text-united-amber', bg: 'bg-united-amber/10', onClick: () => navigate('/applications') },
    { icon: Target, title: 'My Posts', value: stats.postsCreated, color: 'text-destructive', bg: 'bg-destructive/10', onClick: () => navigate('/home', { state: { activeTab: 'my' } }) },
  ];
  const visibleStatCards = user?.role === 'faculty'
    ? statCards.filter(card => card.title !== 'Applications Sent')
    : statCards;

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

  const dashboardEase: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

  const dashboardSectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: dashboardEase,
      },
    },
  };

  const dashboardContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.12,
      },
    },
  };

  const statCardVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        delay: index * 0.07,
        ease: dashboardEase,
      },
    }),
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, x: -16 },
    show: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.45,
        delay: index * 0.06,
        ease: dashboardEase,
      },
    }),
  };

  const cardStyle = isDark
    ? { backgroundColor: colors.card, borderColor: colors.border, color: colors.heading }
    : undefined;
  const tileStyle = isDark ? { backgroundColor: colors.card, borderColor: colors.border } : undefined;
  const mutedTextStyle = isDark ? { color: colors.subtext } : undefined;
  const headingStyle = isDark ? { color: colors.heading } : undefined;
  const chipStyle = isDark ? { backgroundColor: colors.chip, borderColor: colors.border } : undefined;
  const outlineButtonStyle = isDark ? { backgroundColor: colors.card, borderColor: colors.border } : undefined;
  const primaryButtonStyle = isDark
    ? { backgroundColor: colors.accent, borderColor: colors.accent, color: '#ffffff' }
    : undefined;

  return (
    <div className="min-h-screen bg-background" style={{ backgroundColor: colors.bg }}>
      <motion.div
        className="max-w-6xl mx-auto px-4 pt-6 pb-8"
        initial="hidden"
        animate="show"
        variants={dashboardContainerVariants}
      >
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-6" variants={dashboardSectionVariants}>
          <div>
            <h1 className="text-3xl font-bold text-foreground" style={headingStyle}>Dashboard</h1>
            <p className="text-muted-foreground" style={mutedTextStyle}>Welcome back, {user?.firstName || 'User'}! Here's your overview</p>
          </div>
          <Button
            onClick={() => navigate('/create-post')}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            style={primaryButtonStyle}
          >
            <Plus size={16} className="mr-1" /> Create Post
          </Button>
        </motion.div>

        {/* Stat Cards */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6" variants={dashboardSectionVariants}>
          {visibleStatCards.map(({ icon: Icon, title, value, color, bg, onClick }, index) => (
            <motion.div key={title} variants={statCardVariants} custom={index}>
              <Card
                className="cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                onClick={onClick}
                style={cardStyle}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-0.5" style={mutedTextStyle}>{title}</p>
                      <p className="text-3xl font-bold text-foreground" style={headingStyle}>{value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${bg}`}>
                      <Icon size={24} className={color} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills & Activity */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" variants={dashboardSectionVariants}>
          {/* Skills */}
          <Card style={cardStyle}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} className="text-accent" />
                <h2 className="font-semibold text-foreground" style={headingStyle}>Your Skills</h2>
              </div>
              {userSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userSkills.map(skill => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="bg-accent/5 border-accent/20 text-accent"
                      style={chipStyle}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-2" style={mutedTextStyle}>No skills added yet</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/settings/profile')}
                    style={outlineButtonStyle}
                    className="text-accent"
                  >
                    Add Skills
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Bar Chart */}
          <Card style={cardStyle}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={20} className="text-accent" />
                <h2 className="font-semibold text-foreground" style={headingStyle}>Activity Overview</h2>
              </div>
              <div className="h-44 flex items-end justify-around gap-3 px-2">
                {activityData.map((activity, index) => {
                  const heightPct = (activity.count / maxCount) * 100;
                  return (
                    <div key={activity.action} className="flex-1 flex flex-col items-center justify-end h-full">
                      <span className="text-lg font-bold mb-1 text-foreground" style={headingStyle}>{activity.count}</span>
                      <motion.div
                        className={`w-full rounded-t-lg origin-bottom ${activity.color} hover:opacity-80 hover:-translate-y-1 transition-all duration-300`}
                        style={{ height: `${heightPct}%`, minHeight: '20px' }}
                        initial={{ scaleY: 0, opacity: 0.5 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{
                          duration: 0.7,
                          delay: 0.2 + index * 0.08,
                          ease: dashboardEase,
                        }}
                      />
                      <span className="text-[10px] text-muted-foreground mt-2 text-center leading-tight" style={mutedTextStyle}>
                        {activity.action}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Summary */}
        <motion.div variants={dashboardSectionVariants}>
          <Card className="mb-6" style={cardStyle}>
            <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={24} className="text-accent" />
              <h2 className="text-lg font-semibold text-foreground" style={headingStyle}>Performance Summary</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <p className="text-4xl font-bold text-united-green mb-1" style={headingStyle}>{acceptanceRate}%</p>
                <p className="text-sm text-muted-foreground" style={mutedTextStyle}>Acceptance Rate</p>
              </div>
              <div className="text-center p-4">
                <p className="text-4xl font-bold text-accent mb-1" style={headingStyle}>{stats.activePostsCount}</p>
                <p className="text-sm text-muted-foreground" style={mutedTextStyle}>Active Posts</p>
              </div>
              <div className="text-center p-4">
                <p className="text-4xl font-bold text-united-amber mb-1" style={headingStyle}>{stats.totalApplicationsReceived}</p>
                <p className="text-sm text-muted-foreground" style={mutedTextStyle}>Applications Received</p>
              </div>
            </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Posts & Applications */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={dashboardSectionVariants}>
          {/* Recent Posts */}
          <Card style={cardStyle}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2" style={headingStyle}>
                  <FileText size={18} /> Recent Posts
                </h2>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate('/home', { state: { activeTab: 'my' } })}
                    className="text-accent text-xs"
                    style={outlineButtonStyle}
                >
                  View All
                </Button>
              </div>
              {recentPosts.length > 0 ? (
                <div className="space-y-3">
                  {recentPosts.map((post, index) => (
                    <motion.div key={post.id} variants={listItemVariants} custom={index}>
                      <div
                        className="p-3 rounded-lg border border-border hover:border-accent/30 cursor-pointer transition-colors"
                        onClick={() => navigate(`/post/${post.id}`)}
                        style={tileStyle}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-sm text-foreground line-clamp-1" style={headingStyle}>{post.title}</h3>
                          <Badge variant={post.status === 'active' ? 'default' : 'secondary'} className="text-[10px] ml-2 shrink-0">
                            {post.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground" style={mutedTextStyle}>
                          <span>{post.purpose}</span>
                          <span className="flex items-center gap-1"><Users size={12} /> {post.applicationCount} apps</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-2" style={mutedTextStyle}>No posts created yet</p>
                  <Button size="sm" onClick={() => navigate('/create-post')} style={primaryButtonStyle}>
                    Create Your First Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card style={cardStyle}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2" style={headingStyle}>
                  <Eye size={18} /> Recent Applications
                </h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate('/applications')}
                  className="text-accent text-xs"
                  style={outlineButtonStyle}
                >
                  View All
                </Button>
              </div>
              {recentApplications.length > 0 ? (
                <div className="space-y-3">
                  {recentApplications.map((app, index) => (
                    <motion.div key={app.id} variants={listItemVariants} custom={index}>
                      <div
                        className="p-3 rounded-lg border border-border hover:border-accent/30 cursor-pointer transition-colors"
                        onClick={() => navigate(`/post/${app.post_id}`)}
                        style={tileStyle}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <Badge variant="outline" className={`text-[9px] shrink-0 ${app.type === 'received' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-secondary text-secondary-foreground border-secondary'}`}>
                              {app.type === 'received' ? '📥 Received' : '📤 Sent'}
                            </Badge>
                            <h3 className="font-medium text-sm text-foreground line-clamp-1" style={headingStyle}>{app.post_title}</h3>
                          </div>
                          <Badge className={`text-[10px] ml-2 shrink-0 border-0 ${statusColor(app.status)}`}>
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground" style={mutedTextStyle}>
                          {app.type === 'received' ? `From ${app.applicant_name} - ` : ''}
                          {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-2" style={mutedTextStyle}>No applications yet</p>
                    <Button size="sm" onClick={() => navigate('/home')} style={primaryButtonStyle}>
                      Browse Opportunities
                    </Button>
                  </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;


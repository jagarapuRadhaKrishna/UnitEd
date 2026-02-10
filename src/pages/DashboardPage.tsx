import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, FileText, CheckCircle, Clock, Award, Target, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = {
    totalApplications: 12,
    acceptedApplications: 7,
    pendingApplications: 3,
    rejectedApplications: 2,
    postsCreated: 5,
    collaborations: 8,
    skillsMatched: 15,
    profileViews: 234,
  };

  const statCards = [
    { icon: FileText, title: 'Total Applications', value: stats.totalApplications, color: 'text-accent', bg: 'bg-accent/10' },
    { icon: CheckCircle, title: 'Accepted', value: stats.acceptedApplications, color: 'text-united-green', bg: 'bg-united-green/10' },
    { icon: Clock, title: 'Pending', value: stats.pendingApplications, color: 'text-united-amber', bg: 'bg-united-amber/10' },
    { icon: Target, title: 'Posts Created', value: stats.postsCreated, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  const skills = [
    { name: 'React', level: 85 },
    { name: 'Python', level: 90 },
    { name: 'Machine Learning', level: 70 },
  ];

  const recentActivity = [
    { action: 'Applications', count: 12, color: 'bg-accent' },
    { action: 'Accepted', count: 7, color: 'bg-united-green' },
    { action: 'Posts Created', count: 5, color: 'bg-united-amber' },
    { action: 'Collaborations', count: 8, color: 'bg-destructive' },
  ];

  const maxCount = Math.max(...recentActivity.map(a => a.count));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your activity and progress</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {statCards.map(({ icon: Icon, title, value, color, bg }) => (
            <Card
              key={title}
              className="cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate('/applications')}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {/* Skills Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} className="text-accent" />
                <h2 className="font-semibold text-foreground">Skills Overview</h2>
              </div>
              <div className="space-y-4">
                {skills.map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{skill.name}</span>
                      <span className="text-sm font-semibold text-accent">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-1.5" />
                  </div>
                ))}
              </div>
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
                {recentActivity.map(activity => {
                  const heightPct = (activity.count / maxCount) * 100;
                  return (
                    <div key={activity.action} className="flex-1 flex flex-col items-center justify-end h-full">
                      <span className="text-lg font-bold mb-1" style={{ color: 'hsl(var(--foreground))' }}>{activity.count}</span>
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
        <Card className="mt-4">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={24} className="text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Performance Summary</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <p className="text-4xl font-bold text-united-green mb-1">
                  {Math.round((stats.acceptedApplications / stats.totalApplications) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Acceptance Rate</p>
              </div>
              <div className="text-center p-4">
                <p className="text-4xl font-bold text-accent mb-1">{stats.skillsMatched}</p>
                <p className="text-sm text-muted-foreground">Skills Matched</p>
              </div>
              <div className="text-center p-4">
                <p className="text-4xl font-bold text-united-amber mb-1">{stats.collaborations}</p>
                <p className="text-sm text-muted-foreground">Active Collaborations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

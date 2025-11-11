import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  Award,
  Target,
  Activity,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock user statistics
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

  const handleStatClick = () => {
    // Navigate to applications page
    navigate('/applications');
  };

  const skills = [
    { name: 'React', level: 85 },
    { name: 'Python', level: 90 },
    { name: 'Machine Learning', level: 70 },
  ];

  const recentActivity = [
    { action: 'Applications', count: 12, color: '#6C47FF' },
    { action: 'Accepted', count: 7, color: '#10B981' },
    { action: 'Posts Created', count: 5, color: '#F59E0B' },
    { action: 'Collaborations', count: 8, color: '#EF4444' },
  ];

  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
    bgColor,
    onClick,
  }: {
    icon: any;
    title: string;
    value: number | string;
    color: string;
    bgColor: string;
    onClick?: () => void;
  }) => (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        border: '1px solid #E5E7EB',
        boxShadow: 'none',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transform: onClick ? 'translateY(-4px)' : 'none',
        },
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              backgroundColor: bgColor,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={24} color={color} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: '#111827',
                mb: 1,
                fontSize: '32px'
              }}
            >
              Dashboard
            </Typography>
            <Typography 
              sx={{ 
                color: '#6B7280',
                fontSize: '16px'
              }}
            >
              Welcome back! Here's an overview of your activity and progress
            </Typography>
          </Box>

          {/* Statistics Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
              mb: 2,
            }}
          >
            <StatCard
              icon={FileText}
              title="Total Applications"
              value={stats.totalApplications}
              color="#6C47FF"
              bgColor="#F5F3FF"
              onClick={handleStatClick}
            />
            <StatCard
              icon={CheckCircle}
              title="Accepted"
              value={stats.acceptedApplications}
              color="#10B981"
              bgColor="#ECFDF5"
              onClick={handleStatClick}
            />
            <StatCard
              icon={Clock}
              title="Pending"
              value={stats.pendingApplications}
              color="#F59E0B"
              bgColor="#FEF3C7"
              onClick={handleStatClick}
            />
            <StatCard
              icon={Target}
              title="Posts Created"
              value={stats.postsCreated}
              color="#EF4444"
              bgColor="#FEE2E2"
              onClick={handleStatClick}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 2,
              mt: 3,
            }}
          >
            {/* Skills Progress */}
            <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Award size={20} color="#6C47FF" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827' }}>
                    Skills Overview
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#111827' }}>
                            {skill.name}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#6C47FF' }}>
                            {skill.level}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={skill.level}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#E5E7EB',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#6C47FF',
                            },
                          }}
                        />
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </Paper>
            {/* Recent Activity - Bar Chart */}
            <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Activity size={20} color="#6C47FF" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827' }}>
                    Activity Overview
                  </Typography>
                </Stack>
                <Box sx={{ height: 180 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-end" justifyContent="space-around" sx={{ height: '100%', px: 1 }}>
                    {recentActivity.map((activity, index) => {
                      const maxCount = Math.max(...recentActivity.map(a => a.count));
                      const heightPercentage = (activity.count / maxCount) * 100;
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 700, color: activity.color, mb: 0.5 }}>
                            {activity.count}
                          </Typography>
                          <Box
                            sx={{
                              width: '100%',
                              height: `${heightPercentage}%`,
                              backgroundColor: activity.color,
                              borderRadius: '8px 8px 0 0',
                              minHeight: '20px',
                              transition: 'all 0.3s',
                              '&:hover': {
                                opacity: 0.8,
                                transform: 'translateY(-4px)',
                              },
                            }}
                          />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#6B7280', 
                              mt: 1, 
                              textAlign: 'center',
                              fontSize: '0.7rem',
                              lineHeight: 1.2,
                            }}
                          >
                            {activity.action}
                          </Typography>
                        </motion.div>
                      );
                    })}
                  </Stack>
                </Box>
              </Paper>
          </Box>

          {/* Performance Summary */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <TrendingUp size={24} color="#6C47FF" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                Performance Summary
              </Typography>
            </Stack>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#10B981', mb: 1 }}>
                  {Math.round((stats.acceptedApplications / stats.totalApplications) * 100)}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Acceptance Rate
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#6C47FF', mb: 1 }}>
                  {stats.skillsMatched}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Skills Matched
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#F59E0B', mb: 1 }}>
                  {stats.collaborations}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Active Collaborations
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dashboard;

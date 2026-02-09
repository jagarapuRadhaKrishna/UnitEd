import React from 'react';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  User, Brain, Users, MessageCircle, Target, 
  Lightbulb, Calendar, Bell, Mail, Star, Filter,
  BarChart, Briefcase
} from 'lucide-react';

const features = [
  {
    icon: User,
    title: 'Smart Profiles',
    description: 'Comprehensive profiles with skills, projects, achievements, and resume integration. Showcase your expertise with style.',
    color: '#2563EB',
  },
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Advanced ML algorithms match you with perfect team members and opportunities based on skills, interests, and compatibility.',
    color: '#F97316',
  },
  {
    icon: Users,
    title: 'Team Formation',
    description: 'Create diverse teams with complementary skills. Multi-step posting, role management, and smart candidate recommendations.',
    color: '#10B981',
  },
  {
    icon: MessageCircle,
    title: 'Real-time Chat',
    description: 'Group chats, channels, and direct messaging with file sharing, reactions, and message threading for seamless collaboration.',
    color: '#8B5CF6',
  },
  {
    icon: Target,
    title: 'Personalized Feed',
    description: 'AI-curated feed showing opportunities that match your profile. Smart filters to find exactly what you need.',
    color: '#EC4899',
  },
  {
    icon: Calendar,
    title: 'Events & Forums',
    description: 'Stay updated with academic events, workshops, and hackathons. Engage in discussions through community forums.',
    color: '#8B5CF6',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Real-time alerts for applications, team invitations, messages, and opportunities. Never miss important updates.',
    color: '#EF4444',
  },
  {
    icon: Mail,
    title: 'Email Integration',
    description: 'Automated email notifications for applications, acceptances, and team updates. Stay connected anywhere.',
    color: '#3B82F6',
  },
  {
    icon: BarChart,
    title: 'Analytics Dashboard',
    description: 'Track your application success rate, skill demand, profile views, and engagement metrics with detailed insights.',
    color: '#10B981',
  },
  {
    icon: Filter,
    title: 'Advanced Search',
    description: 'Filter opportunities by skills, department, project type, timeline, and more. Find your perfect match quickly.',
    color: '#6366F1',
  },
  {
    icon: Briefcase,
    title: 'Project Management',
    description: 'Manage your active projects, track team members, monitor progress, and handle applications all in one place.',
    color: '#14B8A6',
  },
  {
    icon: Star,
    title: 'Recommendations',
    description: 'Get personalized suggestions for team members, skills to learn, and projects to join based on your goals.',
    color: '#F59E0B',
  },
];

const FeaturesSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#EFF6FF',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#111827',
              fontWeight: 700,
              mb: 2,
              textAlign: 'center',
            }}
          >
            Powerful Features for Academic Success
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#6B7280',
              textAlign: 'center',
              mb: 6,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            A comprehensive platform with powerful features designed to revolutionize academic collaboration and team building
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: '1px solid #E5E7EB',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        borderColor: feature.color,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          backgroundColor: `${feature.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                        }}
                      >
                        <Icon size={28} color={feature.color} strokeWidth={2} />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          color: '#111827',
                          fontWeight: 600,
                          mb: 1.5,
                        }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6B7280',
                          lineHeight: 1.7,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FeaturesSection;

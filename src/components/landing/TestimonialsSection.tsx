import React from 'react';
import { Box, Container, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';
import type { LandingStats } from '@/hooks/useLandingStats';

const testimonials = [
  {
    name: 'Godavarthi Vedaaksharee',
    role: 'Student',
    department: 'CSD Dept',
    avatar: '/image/godavarthi vedaaksharee.png',
    quote: 'This platform made it much easier to find the right teammates for my academic projects. Instead of searching manually or asking around, I could quickly discover students with the skills needed for my project. The collaboration features also help us communicate and manage tasks effectively, making the entire project workflow more organized and productive.',
  },
  {
    name: 'Jagarapu Radha Krishna',
    role: 'Student',
    department: 'CSD Dept',
    avatar: '/image/krishna.png',
    quote: 'Finding project partners used to take a lot of time, but this platform makes it simple. I can explore different project ideas, join teams, and collaborate with students who share similar interests. It has really improved the way we work together on academic projects.',
  },
  {
    name: 'Annanya',
    role: 'Student',
    department: 'CSD Dept',
    avatar: '',
    quote: 'The platform provides a great space for students to collaborate on projects. From discovering new project opportunities to connecting with teammates, everything is well organized. It helps students focus more on building projects rather than struggling to find the right team.',
  },
];

interface TestimonialsSectionProps {
  stats: LandingStats;
}

const formatStatNumber = (value: number | null) => {
  if (value === null) return '...';
  return value.toLocaleString();
};

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ stats }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const statItems = [
    { number: formatStatNumber(stats.totalUsers), label: 'Active Users' },
    { number: formatStatNumber(stats.totalFaculty), label: 'Faculty Members' },
    { number: formatStatNumber(stats.completedProjects), label: 'Projects Completed' },
    { number: stats.coreFeatures.toLocaleString(), label: 'Core Features' },
  ];

  return (
    <Box
      id="testimonials"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      }}
    >
      <Container maxWidth="lg">
        {/* Stats Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4,
              mb: 10,
            }}
          >
            {statItems.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 10px 30px rgba(37, 99, 235, 0.15)',
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#2563EB',
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#6B7280',
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Testimonials */}
          <Typography
            variant="h2"
            sx={{
              color: '#111827',
              fontWeight: 700,
              mb: 2,
              textAlign: 'center',
            }}
          >
            What Our Users Say
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#6B7280',
              textAlign: 'center',
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Join thousands of students and faculty who are already collaborating
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.15, duration: 0.6 }}
              >
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: '#FFFFFF',
                    height: '100%',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      opacity: 0.1,
                    }}
                  >
                    <Quote size={48} color="#2563EB" />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{
                        width: 56,
                        height: 56,
                        mr: 2,
                        border: '3px solid #2563EB',
                      }}
                    >
                      {testimonial.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#111827',
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6B7280',
                        }}
                      >
                        {testimonial.role}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6B7280',
                        }}
                      >
                        {testimonial.department}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: '#374151',
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                    }}
                  >
                    "{testimonial.quote}"
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;

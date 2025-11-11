import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { UserPlus, Search, Send, Users } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Sign up and build a comprehensive profile with your skills, projects, and interests.',
    number: '01',
  },
  {
    icon: Search,
    title: 'Discover Opportunities',
    description: 'Browse AI-recommended opportunities or post your own project needs.',
    number: '02',
  },
  {
    icon: Send,
    title: 'Apply & Connect',
    description: 'Submit skill-specific applications and wait for approval from opportunity creators.',
    number: '03',
  },
  {
    icon: Users,
    title: 'Collaborate',
    description: 'Join team chatrooms to communicate, share files, and work together on projects.',
    number: '04',
  },
];

const WorkflowSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#DBEAFE',
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
            How It Works
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#6B7280',
              textAlign: 'center',
              mb: 8,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Four simple steps to start collaborating on amazing projects
          </Typography>

          <Box sx={{ position: 'relative' }}>
            {/* Connecting Line */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: 60,
                left: '12.5%',
                right: '12.5%',
                height: 2,
                background: 'linear-gradient(90deg, #2563EB 0%, #F97316 50%, #10B981 100%)',
                zIndex: 0,
              }}
            />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                gap: 4,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{
                      delay: index * 0.2,
                      duration: 0.6,
                      type: 'spring',
                      bounce: 0.4,
                    }}
                  >
                    <Box
                      sx={{
                        textAlign: 'center',
                        position: 'relative',
                      }}
                    >
                      {/* Icon Circle */}
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          border: '3px solid #2563EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                            boxShadow: '0 15px 35px rgba(37, 99, 235, 0.2)',
                          },
                        }}
                      >
                        <Icon size={40} color="#2563EB" strokeWidth={2} />

                        {/* Step Number */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: '#F97316',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '1rem',
                            boxShadow: '0 4px 10px rgba(249, 115, 22, 0.3)',
                          }}
                        >
                          {step.number}
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          color: '#111827',
                          fontWeight: 600,
                          mb: 1.5,
                        }}
                      >
                        {step.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6B7280',
                          lineHeight: 1.7,
                          px: 2,
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default WorkflowSection;

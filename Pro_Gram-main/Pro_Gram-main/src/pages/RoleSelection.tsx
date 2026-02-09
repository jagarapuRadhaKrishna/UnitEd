import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { ThemeProvider } from '@mui/material/styles';
import unitedTheme from '../theme/unitedTheme';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      type: 'student',
      icon: GraduationCap,
      title: 'I am a Student',
      description: 'Find research opportunities, join projects, and collaborate with faculty and peers',
      features: ['Browse opportunities', 'Apply to projects', 'Join teams', 'Build your portfolio'],
      color: '#2563EB',
      path: '/register/student',
    },
    {
      type: 'faculty',
      icon: Briefcase,
      title: 'I am Faculty',
      description: 'Post opportunities, find talented students, and manage research teams',
      features: ['Post opportunities', 'Review applications', 'Manage teams', 'Track progress'],
      color: '#F97316',
      path: '/register/faculty',
    },
  ];

  return (
    <ThemeProvider theme={unitedTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #FEF3C7 100%)',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  color: '#111827',
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Join <Box component="span" sx={{ color: '#2563EB' }}>UnitEd</Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#6B7280',
                  fontWeight: 400,
                }}
              >
                Select your role to get started
              </Typography>
            </Box>

            {/* Role Cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              {roles.map((role, index) => {
                const Icon = role.icon;
                return (
                  <motion.div
                    key={role.type}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.2, duration: 0.6 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 4,
                        border: `2px solid transparent`,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          borderColor: role.color,
                          boxShadow: `0 20px 40px ${role.color}30`,
                        },
                      }}
                      onClick={() => navigate(role.path)}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 3,
                            backgroundColor: `${role.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            mx: 'auto',
                          }}
                        >
                          <Icon size={40} color={role.color} strokeWidth={2} />
                        </Box>

                        <Typography
                          variant="h5"
                          sx={{
                            color: '#111827',
                            fontWeight: 700,
                            mb: 2,
                            textAlign: 'center',
                          }}
                        >
                          {role.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: '#6B7280',
                            mb: 3,
                            textAlign: 'center',
                            lineHeight: 1.7,
                          }}
                        >
                          {role.description}
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                          {role.features.map((feature, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  backgroundColor: role.color,
                                }}
                              />
                              <Typography variant="body2" sx={{ color: '#374151' }}>
                                {feature}
                              </Typography>
                            </Box>
                          ))}
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          endIcon={<ArrowRight size={20} />}
                          sx={{
                            backgroundColor: role.color,
                            py: 1.5,
                            '&:hover': {
                              backgroundColor: role.color,
                              filter: 'brightness(0.9)',
                            },
                          }}
                          onClick={() => navigate(role.path)}
                        >
                          Continue as {role.type === 'student' ? 'Student' : 'Faculty'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </Box>

            {/* Already have account */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Already have an account?{' '}
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#2563EB',
                    fontWeight: 600,
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Login here
                </Button>
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default RoleSelection;

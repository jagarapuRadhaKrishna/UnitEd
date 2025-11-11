import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: 8,
        backgroundColor: '#0f172a',
        backgroundImage: 'url(/pexels-ivan-s-7213362.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'center',
          }}
        >
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 58%' }, maxWidth: { md: '58%' } }}>
            <Box>
              {/* Headline */}
              <Typography
                variant="h1"
                sx={{
                  color: '#FFFFFF',
                  mb: 1,
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                }}
              >
                Unit<Box component="span" sx={{ color: '#2563EB' }}>Ed</Box>
              </Typography>

              {/* Tagline */}
              <Typography
                variant="h4"
                sx={{
                  color: '#FFFFFF',
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: 'linear-gradient(135deg, #FDE047 0%, #F97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Innovate • Create • Elevate
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Join thousands of students and faculty in research, projects, and hackathons.
                AI-powered matching, real-time chat, and powerful features for seamless collaboration.
              </Typography>

              {/* CTA Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight size={20} />}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#2563EB',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    '&:hover': {
                      backgroundColor: '#F3F4F6',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Join Now
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => scrollToSection('about')}
                  sx={{
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 2,
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>

              {/* Stats */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 4,
                  mt: 6,
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { number: '2000+', label: 'Active Students' },
                  { number: '150+', label: 'Faculty Members' },
                  { number: '500+', label: 'Projects Completed' },
                ].map((stat, index) => (
                  <Box key={index}>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#FFFFFF',
                          fontWeight: 700,
                          mb: 0.5,
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: 500,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>


        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;

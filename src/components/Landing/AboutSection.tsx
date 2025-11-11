import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Eye, Heart } from 'lucide-react';

const AboutSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <Box
      id="about"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#DBEAFE',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#111827',
              fontWeight: 700,
              mb: 3,
              textAlign: 'center',
            }}
          >
            About <Box component="span" sx={{ color: '#2563EB' }}>UnitEd</Box>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: '#6B7280',
              textAlign: 'center',
              maxWidth: 900,
              mx: 'auto',
              lineHeight: 1.8,
              fontWeight: 400,
            }}
          >
            UnitEd is a comprehensive academic collaboration platform revolutionizing how students and faculty 
            connect. With powerful features including AI-powered matching, real-time chat, personalized feeds, 
            and smart notifications, we make finding the perfect team effortless. From event management to 
            project analytics—everything you need for academic success, all in one place.
          </Typography>

          <Box
            sx={{
              mt: 6,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            {[
              {
                icon: <Target size={48} />,
                title: 'Our Mission',
                description: 'Empower students and faculty with cutting-edge tools for seamless collaboration and innovation',
              },
              {
                icon: <Eye size={48} />,
                title: 'Our Vision',
                description: 'Building the future of academic networking where AI meets human potential',
              },
              {
                icon: <Heart size={48} />,
                title: 'Our Values',
                description: 'Innovation, excellence, inclusivity, and data-driven decision making for all',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: '#F9FAFB',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#EFF6FF',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 25px rgba(37, 99, 235, 0.1)',
                    },
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {item.icon}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: '#111827', fontWeight: 600, mb: 1.5 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                    {item.description}
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

export default AboutSection;

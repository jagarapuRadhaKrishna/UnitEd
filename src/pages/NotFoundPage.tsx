import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';
import { ThemeProvider } from '@mui/material/styles';
import unitedTheme from '../theme/unitedTheme';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={unitedTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(40px)',
          }}
        />

        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(40px)',
          }}
        />

        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Animated 404 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '6rem', md: '10rem' },
                    fontWeight: 900,
                    color: 'white',
                    textShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    lineHeight: 1,
                    mb: 2,
                  }}
                >
                  404
                </Typography>
              </motion.div>

              {/* Sad Face Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 15,
                  delay: 0.4,
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 3,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    mb: 3,
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    <Frown size={64} color="white" />
                  </motion.div>
                </Box>
              </motion.div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    mb: 2,
                  }}
                >
                  Page Not Found
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    mb: 4,
                    fontSize: '1.1rem',
                  }}
                >
                  Oops! The page you're looking for doesn't exist.
                  <br />
                  It might have been moved or deleted.
                </Typography>
              </motion.div>

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/')}
                  startIcon={<Home />}
                  sx={{
                    backgroundColor: 'white',
                    color: '#2563EB',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: '#F3F4F6',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Go Back Home
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default NotFoundPage;

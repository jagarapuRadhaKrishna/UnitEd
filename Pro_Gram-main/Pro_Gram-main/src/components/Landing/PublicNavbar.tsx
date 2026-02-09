import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const PublicNavbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If user is logged in, redirect to appropriate page
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        navigate('/home');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        boxShadow: 'none',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ py: 1, justifyContent: 'flex-end', px: 0 }}>
          {/* Auth Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#1E40AF',
                },
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                backgroundColor: '#FFFFFF',
                color: '#2563EB',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default PublicNavbar;

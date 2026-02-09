import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock } from 'lucide-react';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import unitedTheme from '../theme/unitedTheme';

const LoginNew: React.FC = () => {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Navigate based on successful login
      navigate('/home');
    } catch (err) {
      setError(authError || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={unitedTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                             radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Paper
              sx={{
                p: 5,
                borderRadius: 4,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Logo & Title */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
                    }}
                  >
                    <GraduationCap size={40} color="#FFFFFF" strokeWidth={2.5} />
                  </Box>
                </motion.div>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1,
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  Sign in to continue to UnitEd
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe.csd@anits.edu.in"
                    required
                    InputProps={{
                      startAdornment: (
                        <Mail size={20} color="#6B7280" style={{ marginRight: 8 }} />
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    InputProps={{
                      startAdornment: (
                        <Lock size={20} color="#6B7280" style={{ marginRight: 8 }} />
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3, textAlign: 'right' }}>
                  <Button
                    component={Link}
                    to="/forgot-password"
                    sx={{
                      color: '#2563EB',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      p: 0,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot Password?
                  </Button>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    backgroundColor: '#2563EB',
                    fontSize: '1rem',
                    fontWeight: 600,
                    mb: 3,
                    '&:hover': {
                      backgroundColor: '#1E40AF',
                    },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                    OR
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Don't have an account?{' '}
                    <Button
                      component={Link}
                      to="/register"
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
                      Register here
                    </Button>
                  </Typography>
                </Box>
              </form>
            </Paper>

            {/* Back to Home */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                component={Link}
                to="/"
                sx={{
                  color: '#FFFFFF',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                ← Back to Home
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginNew;

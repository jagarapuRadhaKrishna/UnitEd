import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Avatar,
  Button,
  Divider,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Globe, Info, User, HelpCircle, Send, CheckCircle } from 'lucide-react';
import { sendEmail } from '../services/emailService';

const About: React.FC = () => {
  const creator = {
    name: 'JAGARAPU RADHA KRISHNA',
    role: 'Full Stack Developer & Creator',
    avatar: 'JRK',
    links: {
      linkedin: 'https://www.linkedin.com/in/jagarapuradhakrishna',
      github: 'https://github.com/jagarapuRadhaKrishna',
      portfolio: 'https://jrk-portfolio.netlify.app/',
      gmail: 'radhakrishna02256@gmail.com',
    },
  };

  const features = [
    {
      title: 'Collaboration Platform',
      description: 'Connect with students and faculty for research, projects, and hackathons',
    },
    {
      title: 'AI-Powered Matching',
      description: 'Intelligent skill-based matching system to find the perfect team members',
    },
    {
      title: 'Real-time Communication',
      description: 'Built-in chat rooms for seamless team collaboration',
    },
    {
      title: 'Application Tracking',
      description: 'Complete tracking system to manage your applications and team formation',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="md" sx={{ pt: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                backgroundColor: '#6C47FF',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Info size={28} color="#FFFFFF" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                About Unit<span style={{ color: '#6C47FF' }}>Ed</span>
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Academic collaboration platform for innovation
              </Typography>
            </Box>
          </Stack>

          {/* Application Info */}
          <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#111827' }}>
              What is UnitEd?
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B5563', mb: 3, lineHeight: 1.8 }}>
              UnitEd is a comprehensive academic collaboration platform designed to bring together
              students, faculty, and researchers. Our platform facilitates seamless team formation for
              research projects, hackathons, and collaborative ventures through AI-powered skill matching
              and real-time communication tools.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
              Key Features
            </Typography>
            <Stack spacing={2}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      border: '1px solid #E5E7EB',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: '#111827' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          </Paper>

          {/* Creator Info */}
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <User size={24} color="#6C47FF" />
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
                Creator Information
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#6C47FF',
                  fontSize: '2rem',
                  fontWeight: 700,
                }}
              >
                {creator.avatar}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                  {creator.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                  {creator.role}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
              Connect with the Creator
            </Typography>

            <Stack spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Linkedin size={20} />}
                href={creator.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.5,
                  borderColor: '#0A66C2',
                  color: '#0A66C2',
                  '&:hover': {
                    borderColor: '#004182',
                    backgroundColor: '#F0F7FF',
                  },
                }}
              >
                <Typography variant="body2" sx={{ ml: 1 }}>
                  LinkedIn: {creator.links.linkedin}
                </Typography>
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Github size={20} />}
                href={creator.links.github}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.5,
                  borderColor: '#24292E',
                  color: '#24292E',
                  '&:hover': {
                    borderColor: '#000000',
                    backgroundColor: '#F6F8FA',
                  },
                }}
              >
                <Typography variant="body2" sx={{ ml: 1 }}>
                  GitHub: {creator.links.github}
                </Typography>
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Globe size={20} />}
                href={creator.links.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.5,
                  borderColor: '#6C47FF',
                  color: '#6C47FF',
                  '&:hover': {
                    borderColor: '#5A3AD6',
                    backgroundColor: '#F5F3FF',
                  },
                }}
              >
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Portfolio: {creator.links.portfolio}
                </Typography>
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Mail size={20} />}
                href={`mailto:${creator.links.gmail}`}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  py: 1.5,
                  borderColor: '#EA4335',
                  color: '#EA4335',
                  '&:hover': {
                    borderColor: '#C5221F',
                    backgroundColor: '#FEF1F0',
                  },
                }}
              >
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Gmail: {creator.links.gmail}
                </Typography>
              </Button>
            </Stack>

            <Box sx={{ mt: 4, p: 3, backgroundColor: '#F0FDF4', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: '#166534', textAlign: 'center' }}>
                💡 Have feedback or suggestions? Feel free to reach out!
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;

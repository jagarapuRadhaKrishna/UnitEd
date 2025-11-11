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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`about-tabpanel-${index}`}
      aria-labelledby={`about-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Send email to creator
      await sendEmail({
        to: 'radhakrishna02256@gmail.com',
        subject: `UnitEd Support Query: ${formData.subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6C47FF 0%, #5A3AD6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; }
              .detail-row { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #6C47FF; }
              .label { font-weight: 600; color: #6C47FF; display: block; margin-bottom: 5px; }
              .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📧 New Support Query</h1>
              </div>
              <div class="content">
                <h2>Help & Support Request</h2>
                <p>You have received a new query from UnitEd platform:</p>
                
                <div class="detail-row">
                  <span class="label">Name:</span>
                  ${formData.name}
                </div>
                
                <div class="detail-row">
                  <span class="label">Email:</span>
                  ${formData.email}
                </div>
                
                <div class="detail-row">
                  <span class="label">Subject:</span>
                  ${formData.subject}
                </div>
                
                <div class="detail-row">
                  <span class="label">Message:</span>
                  <p style="margin-top: 10px; white-space: pre-wrap;">${formData.message}</p>
                </div>
                
                <div class="footer">
                  <p>This query was submitted through the UnitEd About page.</p>
                  <p>Please respond to ${formData.email} at your earliest convenience.</p>
                  <p>© 2025 UnitEd - Academic Collaboration Platform</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending query:', error);
      setSubmitError('Failed to send your query. Please try again or email directly to radhakrishna02256@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', py: 4 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
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

          {/* Tabs Navigation */}
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 2,
                },
                '& .Mui-selected': {
                  color: '#6C47FF',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#6C47FF',
                  height: 3,
                },
              }}
            >
              <Tab 
                icon={<Info size={20} />} 
                iconPosition="start" 
                label="About Application" 
              />
              <Tab 
                icon={<User size={20} />} 
                iconPosition="start" 
                label="Creator Info" 
              />
              <Tab 
                icon={<HelpCircle size={20} />} 
                iconPosition="start" 
                label="Help & Queries" 
              />
            </Tabs>
          </Paper>

          {/* Tab 1: About Application */}
          <TabPanel value={activeTab} index={0}>
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper sx={{ p: 4, borderRadius: 2 }}>
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

                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#111827' }}>
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
                            transition: 'all 0.3s',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(108, 71, 255, 0.15)',
                              transform: 'translateX(8px)',
                              borderColor: '#6C47FF',
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

                  <Box sx={{ mt: 4, p: 3, backgroundColor: '#EEF2FF', borderRadius: 2, border: '1px solid #C7D2FE' }}>
                    <Typography variant="body2" sx={{ color: '#4338CA', textAlign: 'center', fontWeight: 500 }}>
                      💡 Join thousands of students and faculty collaborating on innovative projects!
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </AnimatePresence>
          </TabPanel>

          {/* Tab 2: Creator Info */}
          <TabPanel value={activeTab} index={1}>
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
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
                        Connect on LinkedIn
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
                        View GitHub Profile
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
                        Visit Portfolio Website
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
                        {creator.links.gmail}
                      </Typography>
                    </Button>
                  </Stack>

                  <Box sx={{ mt: 4, p: 3, backgroundColor: '#F0FDF4', borderRadius: 2, border: '1px solid #BBF7D0' }}>
                    <Typography variant="body2" sx={{ color: '#166534', textAlign: 'center', fontWeight: 500 }}>
                      💡 Have feedback or suggestions? Feel free to reach out!
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </AnimatePresence>
          </TabPanel>

          {/* Tab 3: Help & Queries */}
          <TabPanel value={activeTab} index={2}>
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper sx={{ p: 4, borderRadius: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <HelpCircle size={24} color="#6C47FF" />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
                      Help & Support
                    </Typography>
                  </Stack>

                  <Typography variant="body1" sx={{ color: '#6B7280', mb: 4 }}>
                    Have questions, need help, or want to report an issue? Fill out the form below and we'll get back to you as soon as possible.
                  </Typography>

                  {submitSuccess && (
                    <Alert 
                      severity="success" 
                      icon={<CheckCircle size={20} />}
                      sx={{ mb: 3 }}
                      onClose={() => setSubmitSuccess(false)}
                    >
                      Your query has been submitted successfully! We'll respond to your email shortly.
                    </Alert>
                  )}

                  {submitError && (
                    <Alert 
                      severity="error" 
                      sx={{ mb: 3 }}
                      onClose={() => setSubmitError('')}
                    >
                      {submitError}
                    </Alert>
                  )}

                  <form onSubmit={handleSubmitQuery}>
                    <Stack spacing={3}>
                      <TextField
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your full name"
                      />

                      <TextField
                        label="Your Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        fullWidth
                        variant="outlined"
                        placeholder="your.email@example.com"
                        helperText="We'll respond to this email address"
                      />

                      <TextField
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        fullWidth
                        variant="outlined"
                        placeholder="Brief description of your query"
                      />

                      <TextField
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        fullWidth
                        multiline
                        rows={6}
                        variant="outlined"
                        placeholder="Describe your question, issue, or feedback in detail..."
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
                        sx={{
                          py: 1.5,
                          background: 'linear-gradient(135deg, #6C47FF 0%, #5A3AD6 100%)',
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5A3AD6 0%, #4A2FB8 100%)',
                          },
                          '&:disabled': {
                            background: '#9CA3AF',
                          },
                        }}
                      >
                        {isSubmitting ? 'Sending...' : 'Submit Query'}
                      </Button>
                    </Stack>
                  </form>

                  <Divider sx={{ my: 4 }} />

                  <Box sx={{ p: 3, backgroundColor: '#FEF3C7', borderRadius: 2, border: '1px solid #FDE68A' }}>
                    <Typography variant="subtitle2" sx={{ color: '#92400E', fontWeight: 600, mb: 1 }}>
                      📧 Direct Contact
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#78350F' }}>
                      For urgent matters, you can directly email us at: <strong>radhakrishna02256@gmail.com</strong>
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </AnimatePresence>
          </TabPanel>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;

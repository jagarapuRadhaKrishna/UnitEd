import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Avatar,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Award,
  Briefcase,
  GraduationCap,
  MessageCircle,
  UserPlus,
  Github,
  Linkedin,
  Globe,
  UserCheck,
  Clock,
  UserMinus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const isOwnProfile = currentUser?.id === id;

  // Mock user data - In real app, fetch based on id
  const user = {
    id: id || '1',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    type: 'Student',
    department: 'Computer Science',
    year: '3rd Year',
    location: 'Boston, MA',
    email: 'alex.johnson@university.edu',
    bio: 'Passionate computer science student interested in AI, machine learning, and web development. Always eager to collaborate on innovative projects.',
    skills: [
      { name: 'React', level: 85 },
      { name: 'Python', level: 90 },
      { name: 'Machine Learning', level: 75 },
      { name: 'Node.js', level: 80 },
      { name: 'TypeScript', level: 85 },
    ],
    experience: [
      {
        title: 'Software Engineering Intern',
        company: 'Tech Corp',
        period: 'Summer 2024',
        description: 'Developed full-stack web applications using React and Node.js',
      },
      {
        title: 'Research Assistant',
        company: 'University AI Lab',
        period: '2023 - Present',
        description: 'Working on natural language processing research projects',
      },
    ],
    education: [
      {
        degree: 'B.S. Computer Science',
        institution: 'University Name',
        period: '2022 - 2026',
        gpa: '3.8/4.0',
      },
    ],
    projects: [
      {
        title: 'AI Chatbot Platform',
        description: 'Built an intelligent chatbot using transformers and deployed it as a web application',
        technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
        link: 'https://github.com/user/chatbot',
      },
      {
        title: 'E-commerce Dashboard',
        description: 'Created a real-time analytics dashboard for online retailers',
        technologies: ['React', 'Node.js', 'MongoDB', 'D3.js'],
        link: 'https://github.com/user/dashboard',
      },
    ],
    achievements: [
      'Won 1st place in University Hackathon 2024',
      'Published research paper on NLP applications',
      'Dean\'s List - 5 consecutive semesters',
    ],
    socialLinks: {
      github: 'https://github.com/alexjohnson',
      linkedin: 'https://linkedin.com/in/alexjohnson',
      portfolio: 'https://alexjohnson.dev',
    },
    stats: {
      collaborations: 12,
      projects: 8,
      skills: 15,
      followers: 145,
      following: 98,
    },
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', py: 4 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3, color: '#6B7280' }}
          >
            Back
          </Button>

          {/* Profile Header */}
          <Paper sx={{ p: 4, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Avatar
                  src={user.avatar}
                  sx={{ width: 150, height: 150, mx: { xs: 'auto', md: 0 } }}
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    size="small"
                    href={user.socialLinks.github}
                    target="_blank"
                    sx={{ minWidth: 'auto', p: 1 }}
                  >
                    <Github size={20} />
                  </Button>
                  <Button
                    size="small"
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    sx={{ minWidth: 'auto', p: 1 }}
                  >
                    <Linkedin size={20} />
                  </Button>
                  <Button
                    size="small"
                    href={user.socialLinks.portfolio}
                    target="_blank"
                    sx={{ minWidth: 'auto', p: 1 }}
                  >
                    <Globe size={20} />
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {user.name}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  <Chip icon={<GraduationCap size={16} />} label={user.type} size="small" />
                  <Chip label={user.department} size="small" />
                  <Chip label={user.year} size="small" />
                </Stack>
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6B7280' }}>
                    <MapPin size={16} />
                    <Typography variant="body2">{user.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6B7280' }}>
                    <Mail size={16} />
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                </Stack>
                <Typography variant="body1" color="text.secondary">
                  {user.bio}
                </Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                {!isOwnProfile && (
                  <Stack spacing={2}>
                    {/* Message Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<MessageCircle size={18} />}
                      onClick={() => navigate('/chatrooms')}
                      sx={{
                        backgroundColor: '#6C47FF',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#5A3AD6',
                        },
                      }}
                    >
                      Message
                    </Button>
                  </Stack>
                )}

                {!isOwnProfile && <Divider sx={{ my: 2 }} />}

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Collaborations
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {user.stats.collaborations}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Projects
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {user.stats.projects}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Followers
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {user.stats.followers}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="About" />
              <Tab label="Skills" />
              <Tab label="Experience" />
              <Tab label="Projects" />
            </Tabs>

            {/* About Tab */}
            <TabPanel value={tabValue} index={0}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Education
                  </Typography>
                  {user.education.map((edu, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent>
                        <Stack direction="row" spacing={2}>
                          <GraduationCap size={24} color="#6C47FF" />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {edu.degree}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {edu.institution}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {edu.period} • GPA: {edu.gpa}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Achievements
                  </Typography>
                  <Stack spacing={1}>
                    {user.achievements.map((achievement, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Award size={20} color="#F59E0B" />
                        <Typography variant="body2">{achievement}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </TabPanel>

            {/* Skills Tab */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={2}>
                {user.skills.map((skill, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {skill.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {skill.level}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={skill.level}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#E5E7EB',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#6C47FF',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Experience Tab */}
            <TabPanel value={tabValue} index={2}>
              <Stack spacing={3}>
                {user.experience.map((exp, index) => (
                  <Card key={index}>
                    <CardContent>
                      <Stack direction="row" spacing={2}>
                        <Briefcase size={24} color="#6C47FF" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {exp.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exp.company}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {exp.period}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {exp.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </TabPanel>

            {/* Projects Tab */}
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                {user.projects.map((project, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {project.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {project.description}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                          {project.technologies.map((tech, idx) => (
                            <Chip key={idx} label={tech} size="small" />
                          ))}
                        </Stack>
                        <Button
                          size="small"
                          href={project.link}
                          target="_blank"
                          sx={{ color: '#6C47FF' }}
                        >
                          View Project →
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </Paper>
        </motion.div>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;

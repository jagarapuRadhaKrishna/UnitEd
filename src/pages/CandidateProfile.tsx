import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Stack,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Star,
  MessageCircle,
  UserPlus,
} from 'lucide-react';

const CandidateProfile: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();

  // Mock candidate data - In real app, fetch from API/localStorage
  const candidates = {
    '1': {
      id: '1',
      name: 'Akhil Satish',
      avatar: '',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      cgpa: '9.2',
      email: 'akhil.satish@anits.edu.in',
      phone: '+91 98765 43210',
      location: 'Visakhapatnam, Andhra Pradesh',
      bio: 'Passionate about AI/ML and Full-Stack Development. Active contributor to open-source projects. Won multiple hackathons including Smart India Hackathon 2024.',
      skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'MongoDB', 'TypeScript', 'TensorFlow', 'AWS'],
      projects: [
        {
          id: '1',
          title: 'AI-Powered Student Management System',
          description: 'Developed an intelligent student management platform using React, Node.js, and TensorFlow for predictive analytics on student performance.',
          skills: ['React', 'Node.js', 'TensorFlow', 'MongoDB'],
          link: 'https://github.com/akhil/student-mgmt',
        },
        {
          id: '2',
          title: 'Real-time Collaboration Platform',
          description: 'Built a real-time collaboration tool with WebRTC and Socket.io for remote team communication.',
          skills: ['WebRTC', 'Socket.io', 'React', 'Express'],
          link: 'https://github.com/akhil/collab-platform',
        },
      ],
      achievements: [
        {
          id: '1',
          title: 'Smart India Hackathon 2024 - Winner',
          description: 'First place in Smart India Hackathon for developing an AI-based solution for agricultural yield prediction',
          date: '2024-08-15',
          issuer: 'Government of India',
        },
        {
          id: '2',
          title: 'Google Cloud Certified - Associate Cloud Engineer',
          description: 'Certified in Google Cloud Platform infrastructure and services',
          date: '2024-06-20',
          issuer: 'Google Cloud',
        },
        {
          id: '3',
          title: 'ACM ICPC Regionalist',
          description: 'Qualified for ACM ICPC Asia Regionals 2023',
          date: '2023-12-10',
          issuer: 'ACM',
        },
      ],
      socialLinks: {
        github: 'https://github.com/akhilsatish',
        linkedin: 'https://linkedin.com/in/akhil-satish',
        leetcode: 'https://leetcode.com/akhilsatish',
        portfolio: 'https://akhilsatish.dev',
      },
    },
    '2': {
      id: '2',
      name: 'Annanya',
      avatar: '',
      department: 'Electronics & Communication Engineering',
      year: '4th Year',
      cgpa: '8.8',
      email: 'annanya@anits.edu.in',
      phone: '+91 98123 45678',
      location: 'Visakhapatnam, Andhra Pradesh',
      bio: 'IoT enthusiast and embedded systems developer. Passionate about building smart devices and automation solutions. Team lead for multiple university tech projects.',
      skills: ['IoT', 'Arduino', 'Raspberry Pi', 'C++', 'Python', 'MQTT', 'Node-RED', 'React'],
      projects: [
        {
          id: '1',
          title: 'Smart Campus Monitoring System',
          description: 'IoT-based campus monitoring solution with real-time data collection from 50+ sensors.',
          skills: ['IoT', 'Raspberry Pi', 'MQTT', 'React'],
        },
      ],
      achievements: [
        {
          id: '1',
          title: 'Texas Instruments Innovation Challenge - Finalist',
          description: 'Finalist in TI Innovation Challenge for IoT solution',
          date: '2024-03-15',
          issuer: 'Texas Instruments',
        },
      ],
      socialLinks: {
        github: 'https://github.com/annanya',
        linkedin: 'https://linkedin.com/in/annanya',
        leetcode: '',
        portfolio: '',
      },
    },
    '3': {
      id: '3',
      name: 'Satwika',
      avatar: '',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      cgpa: '9.5',
      email: 'satwika@anits.edu.in',
      phone: '+91 98765 11111',
      location: 'Visakhapatnam, Andhra Pradesh',
      bio: 'AI/ML enthusiast with a passion for data science and analytics. Active contributor to open-source projects and winner of Smart India Hackathon 2024.',
      skills: ['Python', 'TensorFlow', 'Data Science', 'Machine Learning', 'R', 'SQL', 'Pandas', 'Scikit-learn'],
      projects: [
        {
          id: '1',
          title: 'Predictive Analytics Dashboard',
          description: 'Built a comprehensive analytics dashboard using Python and TensorFlow for predicting student performance trends.',
          skills: ['Python', 'TensorFlow', 'Data Science', 'React'],
          link: 'https://github.com/satwika/analytics-dashboard',
        },
        {
          id: '2',
          title: 'NLP Sentiment Analysis Tool',
          description: 'Developed a sentiment analysis tool using NLP techniques to analyze social media data and trends.',
          skills: ['Python', 'NLTK', 'Machine Learning'],
          link: 'https://github.com/satwika/sentiment-analysis',
        },
      ],
      achievements: [
        {
          id: '1',
          title: 'Smart India Hackathon 2024 - Winner',
          description: 'First place in Smart India Hackathon for AI-powered solution',
          date: '2024-09-15',
          issuer: 'Government of India',
        },
        {
          id: '2',
          title: 'Dean\'s List - Academic Excellence',
          description: 'Recognized for outstanding academic performance',
          date: '2024-05-20',
          issuer: 'ANITS',
        },
      ],
      socialLinks: {
        github: 'https://github.com/satwika',
        linkedin: 'https://linkedin.com/in/satwika',
        leetcode: 'https://leetcode.com/satwika',
        portfolio: 'https://satwika.dev',
      },
    },
    '4': {
      id: '4',
      name: 'Madhuri',
      avatar: '',
      department: 'Information Technology',
      year: '4th Year',
      cgpa: '8.7',
      email: 'madhuri@anits.edu.in',
      phone: '+91 98765 22222',
      location: 'Visakhapatnam, Andhra Pradesh',
      bio: 'Full-stack developer with expertise in modern web technologies. Teaching Assistant for Web Development course and passionate about building scalable applications.',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Docker', 'Kubernetes', 'AWS', 'TypeScript'],
      projects: [
        {
          id: '1',
          title: 'E-Commerce Platform',
          description: 'Built a full-stack e-commerce platform with payment integration, inventory management, and analytics.',
          skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          link: 'https://github.com/madhuri/ecommerce-platform',
        },
        {
          id: '2',
          title: 'DevOps CI/CD Pipeline',
          description: 'Implemented automated CI/CD pipeline using Docker, Kubernetes, and Jenkins for microservices deployment.',
          skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS'],
          link: 'https://github.com/madhuri/cicd-pipeline',
        },
      ],
      achievements: [
        {
          id: '1',
          title: 'ACM ICPC Regionalist',
          description: 'Participated in ACM ICPC Regional Contest',
          date: '2024-01-10',
          issuer: 'ACM',
        },
        {
          id: '2',
          title: 'Open Source Contributor',
          description: 'Active contributor to major open-source projects',
          date: '2024-06-01',
          issuer: 'GitHub',
        },
      ],
      socialLinks: {
        github: 'https://github.com/madhuri',
        linkedin: 'https://linkedin.com/in/madhuri',
        leetcode: 'https://leetcode.com/madhuri',
        portfolio: 'https://madhuri.dev',
      },
    },
  };

  const candidate = candidates[candidateId as keyof typeof candidates];

  if (!candidate) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', pt: 10 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h5" color="text.secondary">
              Candidate not found
            </Typography>
            <Button
              startIcon={<ArrowLeft size={20} />}
              onClick={() => navigate(-1)}
              sx={{ mt: 3 }}
            >
              Go Back
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', pb: 4 }}>
      {/* Back Button */}
      <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            sx={{ my: 2, color: '#6B7280', '&:hover': { backgroundColor: '#F3F4F6' } }}
          >
            Back to Candidates
          </Button>
        </Container>
      </Box>

      {/* Cover Photo */}
      <Box
        sx={{
          height: 200,
          background: 'linear-gradient(135deg, #6C47FF 0%, #8B5CF6 100%)',
          position: 'relative',
        }}
      />

      <Container maxWidth="lg">
        <Box sx={{ position: 'relative', mt: -8 }}>
          {/* Profile Header Card */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
              {/* Avatar */}
              <Avatar
                src={candidate.avatar}
                sx={{
                  width: 150,
                  height: 150,
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontSize: '3rem',
                  backgroundColor: '#6C47FF',
                }}
              >
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </Avatar>

              {/* Profile Info */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                  {candidate.name}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Chip
                    icon={<GraduationCap size={16} />}
                    label="Student"
                    color="primary"
                    size="small"
                  />
                  <Chip label={candidate.department} size="small" />
                  <Chip label={candidate.year} size="small" />
                  {candidate.cgpa && (
                    <Chip 
                      icon={<Star size={14} />}
                      label={`CGPA: ${candidate.cgpa}`} 
                      size="small"
                      sx={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                    />
                  )}
                </Stack>
                <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Mail size={16} color="#6B7280" />
                    <Typography variant="body2" color="text.secondary">
                      {candidate.email}
                    </Typography>
                  </Stack>
                  {candidate.phone && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      <Phone size={16} color="#6B7280" />
                      <Typography variant="body2" color="text.secondary">
                        {candidate.phone}
                      </Typography>
                    </Stack>
                  )}
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <MapPin size={16} color="#6B7280" />
                    <Typography variant="body2" color="text.secondary">
                      {candidate.location}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              {/* Actions */}
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<UserPlus size={18} />}
                  sx={{
                    backgroundColor: '#6C47FF',
                    '&:hover': { backgroundColor: '#5A3AD6' },
                  }}
                >
                  Connect
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<MessageCircle size={18} />}
                  sx={{
                    borderColor: '#6C47FF',
                    color: '#6C47FF',
                    '&:hover': { borderColor: '#5A3AD6', backgroundColor: '#F5F3FF' },
                  }}
                >
                  Message
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Main Content - Two Column Layout */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {/* Left Column - Sidebar */}
            <Box sx={{ width: { xs: '100%', md: '350px' } }}>
              {/* Skills */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Skills
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {candidate.skills.map((skill) => (
                    <Chip key={skill} label={skill} size="small" color="primary" variant="outlined" />
                  ))}
                </Stack>
              </Paper>

              {/* Social Links */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Social Links
                </Typography>
                <Stack spacing={1.5}>
                  {candidate.socialLinks?.portfolio && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Globe size={16} />}
                      endIcon={<ExternalLink size={14} />}
                      href={candidate.socialLinks?.portfolio}
                      target="_blank"
                      sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                    >
                      Portfolio
                    </Button>
                  )}
                  {candidate.socialLinks?.github && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Github size={16} />}
                      endIcon={<ExternalLink size={14} />}
                      href={candidate.socialLinks.github}
                      target="_blank"
                      sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                    >
                      GitHub
                    </Button>
                  )}
                  {candidate.socialLinks?.linkedin && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Linkedin size={16} />}
                      endIcon={<ExternalLink size={14} />}
                      href={candidate.socialLinks.linkedin}
                      target="_blank"
                      sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                    >
                      LinkedIn
                    </Button>
                  )}
                  {candidate.socialLinks?.leetcode && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Award size={16} />}
                      endIcon={<ExternalLink size={14} />}
                      href={candidate.socialLinks?.leetcode}
                      target="_blank"
                      sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                    >
                      LeetCode
                    </Button>
                  )}
                </Stack>
              </Paper>
            </Box>

            {/* Right Column - Main Content */}
            <Box sx={{ flex: 1 }}>
              {/* About Section */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  About
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {candidate.bio}
                </Typography>
              </Paper>

              {/* Projects Section */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Projects
                </Typography>
                <Stack spacing={2}>
                  {candidate.projects.map((project: any) => (
                    <Card key={project.id} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {project.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                          {project.description}
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1.5 }}>
                          {project.skills.map((skill: string) => (
                            <Chip key={skill} label={skill} size="small" />
                          ))}
                        </Stack>
                        {project.link && (
                          <Button
                            size="small"
                            href={project.link}
                            target="_blank"
                            endIcon={<ExternalLink size={14} />}
                            sx={{ textTransform: 'none' }}
                          >
                            View Project
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Paper>

              {/* Achievements Section */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Achievements & Awards
                </Typography>
                <List>
                  {candidate.achievements.map((achievement: any, index: number) => (
                    <React.Fragment key={achievement.id}>
                      {index > 0 && <Divider />}
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Award size={16} color="#F59E0B" />
                              <Typography variant="subtitle2" fontWeight={600}>
                                {achievement.title}
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            <>
                              {achievement.description && (
                                <Typography variant="body2" color="text.secondary">
                                  {achievement.description}
                                </Typography>
                              )}
                              {achievement.issuer && (
                                <Typography variant="caption" color="text.secondary">
                                  Issued by: {achievement.issuer}
                                </Typography>
                              )}
                              {achievement.date && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                  • {new Date(achievement.date).toLocaleDateString()}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CandidateProfile;

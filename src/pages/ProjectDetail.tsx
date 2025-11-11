import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Avatar,
  Stack,
  Button,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  Eye,
  Heart,
  Share2,
  UserPlus,
  Award,
  Clock,
} from 'lucide-react';
import AuthenticatedNavbar from '../components/Layout/AuthenticatedNavbar';
import ApplicationModal from '../components/Application/ApplicationModal';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
}

interface ProjectData {
  title: string;
  description: string;
  fullDescription: string;
  author: string;
  teamLeader: {
    name: string;
    avatar: string;
    email: string;
    department: string;
  };
  status: 'Available' | 'Ongoing' | 'Completed';
  tags: string[];
  stats: {
    interests: number;
    needed: number;
    views: number;
  };
  location: string;
  postedDate: string;
  avatarUrl?: string;
  teamMembers?: TeamMember[];
  requirements?: string[];
  timeline?: string;
  category?: string;
}

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isInterested, setIsInterested] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Mock project data - in production, fetch from API using projectId
  const projectData: ProjectData = {
    title: 'AI-Powered Healthcare Chatbot',
    description: 'Developing an intelligent chatbot for preliminary medical diagnosis and appointment scheduling using NLP and machine learning.',
    fullDescription: 'This project aims to create an AI-powered healthcare chatbot that can assist patients with preliminary medical consultations, symptom checking, and appointment scheduling. The chatbot will use natural language processing to understand patient queries and provide accurate, helpful responses. We\'re looking for passionate individuals who want to make a difference in healthcare technology.',
    author: 'Dr. Sarah Mitchell',
    teamLeader: {
      name: 'Dr. Sarah Mitchell',
      avatar: 'https://i.pravatar.cc/150?img=1',
      email: 'sarah.mitchell@university.edu',
      department: 'Computer Science Dept',
    },
    status: 'Available',
    tags: ['Python', 'NLP', 'TensorFlow', 'Healthcare'],
    stats: {
      interests: 8,
      needed: 3,
      views: 45,
    },
    location: 'Computer Science Dept',
    postedDate: 'Nov 5',
    teamMembers: [
      {
        id: '1',
        name: 'John Smith',
        role: 'Full Stack Developer',
        avatar: 'https://i.pravatar.cc/150?img=20',
        skills: ['React', 'Node.js', 'MongoDB'],
      },
      {
        id: '2',
        name: 'Maria Garcia',
        role: 'UI/UX Designer',
        avatar: 'https://i.pravatar.cc/150?img=21',
        skills: ['Figma', 'Design Systems', 'Prototyping'],
      },
    ],
    requirements: [
      'Strong programming skills in Python',
      'Experience with machine learning frameworks (TensorFlow, PyTorch)',
      'Understanding of NLP concepts',
      'Ability to work in a collaborative team environment',
    ],
    timeline: '6 months (November 2025 - April 2026)',
    category: 'Research',
  };

  const handleInterest = () => {
    setIsInterested(!isInterested);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Project link copied to clipboard!');
  };

  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return '#10B981';
      case 'Ongoing':
        return '#F59E0B';
      case 'Completed':
        return '#6B7280';
      default:
        return '#6C47FF';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <AuthenticatedNavbar />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              textTransform: 'none',
              color: '#6B7280',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              },
            }}
          >
            Back to Projects
          </Button>

          {/* Main Content */}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Left Column - Main Info */}
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 4, borderRadius: 2, mb: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Chip
                      label={projectData.status}
                      sx={{
                        backgroundColor: `${getStatusColor(projectData.status)}20`,
                        color: getStatusColor(projectData.status),
                        fontWeight: 600,
                        border: `1px solid ${getStatusColor(projectData.status)}`,
                      }}
                    />
                    {projectData.category && (
                      <Chip
                        label={projectData.category}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Stack>

                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
                    {projectData.title}
                  </Typography>

                  <Stack direction="row" spacing={3} sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Calendar size={16} />
                      {projectData.postedDate}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MapPin size={16} />
                      {projectData.location}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Eye size={16} />
                      {projectData.stats.views} views
                    </Box>
                  </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Stats */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: '120px' }}>
                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#F0FDF4', borderRadius: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#10B981' }}>
                        {projectData.stats.interests}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#059669' }}>
                        Interested
                      </Typography>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: '120px' }}>
                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#EEF2FF', borderRadius: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#6C47FF' }}>
                        {projectData.stats.needed}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#5A3AD6' }}>
                        Needed
                      </Typography>
                    </Paper>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: '120px' }}>
                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#FEF3C7', borderRadius: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                        {projectData.teamMembers?.length || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#D97706' }}>
                        Current Team
                      </Typography>
                    </Paper>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
                    About This Project
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4B5563', lineHeight: 1.8 }}>
                    {projectData.fullDescription}
                  </Typography>
                </Box>

                {/* Required Skills */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Award size={20} />
                    Required Skills
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {projectData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        sx={{
                          backgroundColor: '#EEF2FF',
                          color: '#6C47FF',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: '#E0E7FF',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Requirements */}
                {projectData.requirements && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
                      Requirements
                    </Typography>
                    <Stack spacing={1}>
                      {projectData.requirements.map((req, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                          <Typography sx={{ color: '#10B981', fontWeight: 700 }}>✓</Typography>
                          <Typography variant="body2" sx={{ color: '#4B5563' }}>
                            {req}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Timeline */}
                {projectData.timeline && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Clock size={20} />
                      Timeline
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#4B5563' }}>
                      {projectData.timeline}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>

            {/* Right Column - Team Info */}
            <Box sx={{ width: { xs: '100%', md: '350px' } }}>
              {/* Team Leader */}
              <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Users size={20} />
                  Team Leader
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={projectData.teamLeader.avatar}
                    alt={projectData.teamLeader.name}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827' }}>
                      {projectData.teamLeader.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      {projectData.teamLeader.department}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: '#6B7280' }}>
                      ✉️ {projectData.teamLeader.email}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Team Members */}
              {projectData.teamMembers && projectData.teamMembers.length > 0 && (
                <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
                    Team Members ({projectData.teamMembers.length})
                  </Typography>
                  <Stack spacing={2}>
                    {projectData.teamMembers.map((member) => (
                      <Card key={member.id} variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                            <Avatar src={member.avatar} alt={member.name} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {member.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                {member.role}
                              </Typography>
                            </Box>
                          </Stack>
                          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            {member.skills.slice(0, 2).map((skill, idx) => (
                              <Chip key={idx} label={skill} size="small" variant="outlined" />
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* Action Buttons */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<UserPlus size={20} />}
                    onClick={handleApply}
                    disabled={projectData.status === 'Completed'}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #6C47FF 0%, #5A3AD6 100%)',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5A3AD6 0%, #4A2FB8 100%)',
                      },
                      '&:disabled': {
                        background: '#9CA3AF',
                      },
                    }}
                  >
                    {projectData.status === 'Completed' ? 'Project Completed' : 'Apply to Join'}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Heart size={20} fill={isInterested ? '#EF4444' : 'none'} color={isInterested ? '#EF4444' : '#6B7280'} />}
                    onClick={handleInterest}
                    sx={{
                      textTransform: 'none',
                      borderColor: isInterested ? '#EF4444' : '#D1D5DB',
                      color: isInterested ? '#EF4444' : '#6B7280',
                      '&:hover': {
                        borderColor: '#EF4444',
                        backgroundColor: '#FEF2F2',
                      },
                    }}
                  >
                    {isInterested ? 'Interested' : 'Mark as Interested'}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Share2 size={20} />}
                    onClick={handleShare}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#D1D5DB',
                      color: '#6B7280',
                      '&:hover': {
                        borderColor: '#6C47FF',
                        backgroundColor: '#F5F3FF',
                      },
                    }}
                  >
                    Share Project
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Application Modal */}
      <ApplicationModal
        open={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        type="project"
        item={{
          id: projectId || '1',
          title: projectData.title,
          description: projectData.fullDescription,
          author: {
            id: 'leader-1',
            name: projectData.teamLeader.name,
            email: projectData.teamLeader.email,
          },
          skillRequirements: projectData.tags,
        }}
        onSuccess={() => {
          alert('Application submitted successfully!');
        }}
      />
    </Box>
  );
};

export default ProjectDetailPage;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Stack,
  Card,
  CardContent,
  CardActions,
  InputAdornment,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Users, Calendar, Briefcase, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import unitedTheme from '../theme/unitedTheme';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  purpose: 'Research' | 'Project' | 'Hackathon';
  requiredSkills: string[];
  posterName: string;
  posterRole: 'Student' | 'Faculty';
  postedDate: string;
  deadline: string;
  requiredMembers: number;
  currentMembers: number;
  isAIRecommended: boolean;
  matchScore?: number;
}

// Mock data - would come from API
const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'AI-Powered Healthcare Chatbot Development',
    description: 'Looking for talented developers to build an AI chatbot for patient preliminary diagnosis and appointment scheduling.',
    purpose: 'Project',
    requiredSkills: ['Python', 'Machine Learning', 'Natural Language Processing', 'Flask'],
    posterName: 'Dr. Rajesh Kumar',
    posterRole: 'Faculty',
    postedDate: '2025-11-05',
    deadline: '2025-11-20',
    requiredMembers: 4,
    currentMembers: 1,
    isAIRecommended: true,
    matchScore: 92,
  },
  {
    id: '2',
    title: 'Smart Campus Navigation System',
    description: 'Develop an indoor navigation app using AR technology to help students navigate the campus.',
    purpose: 'Hackathon',
    requiredSkills: ['React Native', 'ARKit', 'Google Maps API', 'Firebase'],
    posterName: 'Priya Sharma',
    posterRole: 'Student',
    postedDate: '2025-11-04',
    deadline: '2025-11-15',
    requiredMembers: 3,
    currentMembers: 2,
    isAIRecommended: true,
    matchScore: 85,
  },
  {
    id: '3',
    title: 'Quantum Computing Research on Error Correction',
    description: 'Research project focusing on developing novel error correction codes for quantum computers.',
    purpose: 'Research',
    requiredSkills: ['Quantum Computing', 'Python', 'Linear Algebra', 'Qiskit'],
    posterName: 'Prof. Anjali Verma',
    posterRole: 'Faculty',
    postedDate: '2025-11-03',
    deadline: '2025-11-25',
    requiredMembers: 2,
    currentMembers: 0,
    isAIRecommended: false,
    matchScore: 65,
  },
  {
    id: '4',
    title: 'Blockchain-Based Supply Chain Tracking',
    description: 'Building a decentralized application for transparent supply chain management.',
    purpose: 'Project',
    requiredSkills: ['Solidity', 'Ethereum', 'Web3.js', 'React'],
    posterName: 'Vikram Singh',
    posterRole: 'Student',
    postedDate: '2025-11-02',
    deadline: '2025-11-18',
    requiredMembers: 5,
    currentMembers: 3,
    isAIRecommended: true,
    matchScore: 78,
  },
];

const PersonalizedFeed: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [filterPurpose, setFilterPurpose] = useState<string>('All');
  const [filterPosterType, setFilterPosterType] = useState<string>('All');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      filterOpportunities();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterPurpose, filterPosterType, selectedSkills]);

  const filterOpportunities = () => {
    let filtered = mockOpportunities;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.requiredSkills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Purpose filter
    if (filterPurpose !== 'All') {
      filtered = filtered.filter((opp) => opp.purpose === filterPurpose);
    }

    // Poster type filter
    if (filterPosterType !== 'All') {
      filtered = filtered.filter((opp) => opp.posterRole === filterPosterType);
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter((opp) =>
        selectedSkills.every((skill) => opp.requiredSkills.includes(skill))
      );
    }

    // Sort AI recommended first
    filtered.sort((a, b) => {
      if (a.isAIRecommended && !b.isAIRecommended) return -1;
      if (!a.isAIRecommended && b.isAIRecommended) return 1;
      return (b.matchScore || 0) - (a.matchScore || 0);
    });

    setFilteredOpportunities(filtered);
  };

  const handleApply = (opportunityId: string) => {
    navigate(`/opportunity/${opportunityId}/apply`);
  };

  return (
    <ThemeProvider theme={unitedTheme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                Discover Opportunities
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                AI-powered recommendations based on your skills and interests
              </Typography>
            </Box>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Paper sx={{ p: 3, mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search by title, description, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color="#6B7280" />
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Accordion sx={{ mb: 3 }}>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Filter size={20} />
                  <Typography variant="h6">Filters</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      select
                      label="Purpose"
                      value={filterPurpose}
                      onChange={(e) => setFilterPurpose(e.target.value)}
                      sx={{ flex: 1 }}
                    >
                      <MenuItem value="All">All Purposes</MenuItem>
                      <MenuItem value="Research">Research</MenuItem>
                      <MenuItem value="Project">Project</MenuItem>
                      <MenuItem value="Hackathon">Hackathon</MenuItem>
                    </TextField>

                    <TextField
                      select
                      label="Posted By"
                      value={filterPosterType}
                      onChange={(e) => setFilterPosterType(e.target.value)}
                      sx={{ flex: 1 }}
                    >
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Student">Students</MenuItem>
                      <MenuItem value="Faculty">Faculty</MenuItem>
                    </TextField>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </motion.div>

          {/* Results Count */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Found {filteredOpportunities.length} opportunities
              {filteredOpportunities.filter((o) => o.isAIRecommended).length > 0 && (
                <> • {filteredOpportunities.filter((o) => o.isAIRecommended).length} AI-recommended</>
              )}
            </Typography>
          </Box>

          {/* Opportunity Cards */}
          <Stack spacing={3}>
            {filteredOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                    transition: 'all 0.3s ease',
                    border: opportunity.isAIRecommended ? '2px solid #2563EB' : '1px solid #E5E7EB',
                  }}
                >
                  {opportunity.isAIRecommended && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: 20,
                        backgroundColor: '#2563EB',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: 2,
                      }}
                    >
                      <Star size={16} fill="white" />
                      AI Recommended {opportunity.matchScore}%
                    </Box>
                  )}

                  <CardContent>
                    <Stack spacing={2}>
                      {/* Header */}
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                          {opportunity.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                          {opportunity.description}
                        </Typography>
                      </Box>

                      {/* Skills */}
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {opportunity.requiredSkills.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            sx={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}
                          />
                        ))}
                      </Stack>

                      {/* Meta Info */}
                      <Stack direction="row" spacing={3} flexWrap="wrap">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Briefcase size={16} color="#6B7280" />
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            {opportunity.purpose}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Users size={16} color="#6B7280" />
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            {opportunity.currentMembers}/{opportunity.requiredMembers} members
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Calendar size={16} color="#6B7280" />
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Poster Info */}
                      <Box
                        sx={{
                          pt: 2,
                          borderTop: '1px solid #E5E7EB',
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                          Posted by <strong>{opportunity.posterName}</strong> ({opportunity.posterRole}) on{' '}
                          {new Date(opportunity.postedDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleApply(opportunity.id)}
                      sx={{
                        backgroundColor: '#2563EB',
                        '&:hover': {
                          backgroundColor: '#1D4ED8',
                        },
                      }}
                    >
                      Apply Now
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            ))}
          </Stack>

          {/* Empty State */}
          {filteredOpportunities.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
                  No opportunities found
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                  Try adjusting your filters or search query
                </Typography>
              </Paper>
            </motion.div>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PersonalizedFeed;

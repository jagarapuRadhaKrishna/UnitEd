import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  MenuItem,
  Autocomplete,
  IconButton,
  Avatar,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { AVAILABLE_SKILLS, FACULTY_DESIGNATIONS } from '../types';
import unitedTheme from '../theme/unitedTheme';

const FacultyRegister: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    employeeId: '',
    designation: '',
    dateOfJoining: '',
    email: '',
    password: '',
    contactNo: '',
    gender: '',
    totalExperience: '',
    teachingExperience: '',
    industryExperience: '',
    qualification: '',
    specialization: '',
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Array<{ title: string; description: string; link: string }>>([
    { title: '', description: '', link: '' },
  ]);
  const [achievements, setAchievements] = useState<string[]>(['']);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState('');

  const qualifications = [
    'Ph.D.',
    'M.Tech',
    'M.Sc',
    'M.Phil',
    'M.E',
    'B.Tech',
    'B.Sc',
    'Other',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjects(updatedProjects);
  };

  const addProject = () => {
    setProjects([...projects, { title: '', description: '', link: '' }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleAchievementChange = (index: number, value: string) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[index] = value;
    setAchievements(updatedAchievements);
  };

  const addAchievement = () => {
    setAchievements([...achievements, '']);
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('First and last names are required');
      return false;
    }
    if (!formData.employeeId || !/^100\d{3}$/.test(formData.employeeId)) {
      setError('Employee ID must be in format 100 followed by 3 digits');
      return false;
    }
    const anitsEmailRegex = /^[a-zA-Z]+\.(csd|cse|ece|eee|mech|civil|it|chem|bio)@anits\.edu\.in$/i;
    if (!formData.email || !anitsEmailRegex.test(formData.email)) {
      setError('Please use a valid ANITS email (fullnamesurname.dept@anits.edu.in)');
      return false;
    }
    
    // Check if email already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const emailExists = registeredUsers.some((user: any) => user.email.toLowerCase() === formData.email.toLowerCase());
    if (emailExists) {
      setError('Account already exists with this email. Please login instead.');
      return false;
    }
    
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!formData.designation || !formData.qualification) {
      setError('Designation and qualification are required');
      return false;
    }
    if (skills.length === 0) {
      setError('Please select at least one skill');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      await register({
        ...formData,
        role: 'faculty',
        gender: formData.gender as 'Male' | 'Female' | 'Other' | 'Prefer not to say',
        totalExperience: Number(formData.totalExperience),
        teachingExperience: Number(formData.teachingExperience),
        industryExperience: Number(formData.industryExperience),
        skills,
        projects: projects.filter((p) => p.title),
        achievements: achievements.filter((a) => a),
        profilePictureUrl: profilePicture,
        cvUrl: resume?.name || '',
      });

      navigate('/home');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={unitedTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#F9FAFB',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Button
                startIcon={<ArrowLeft size={20} />}
                onClick={() => navigate('/register')}
                sx={{ mb: 2, color: '#F97316' }}
              >
                Back
              </Button>
              <Typography variant="h3" sx={{ color: '#111827', fontWeight: 700, mb: 1 }}>
                Faculty Registration
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Fill in your details to create your faculty profile
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <form onSubmit={handleSubmit}>
                {/* Profile Picture */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <input
                    accept="image/*"
                    type="file"
                    id="profile-picture"
                    hidden
                    onChange={handleProfilePictureChange}
                  />
                  <label htmlFor="profile-picture">
                    <Avatar
                      src={profilePicture}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        cursor: 'pointer',
                        border: '3px solid #F97316',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    >
                      <Upload size={40} />
                    </Avatar>
                  </label>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Click to upload profile picture
                  </Typography>
                </Box>

                {/* Personal Information */}
                <Typography variant="h6" sx={{ mb: 3, color: '#111827', fontWeight: 600 }}>
                  Personal Information
                </Typography>

                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="First Name *"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Middle Name"
                        value={formData.middleName}
                        onChange={(e) => handleInputChange('middleName', e.target.value)}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Last Name *"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </Box>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Employee ID *"
                        placeholder="100000"
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange('employeeId', e.target.value)}
                        helperText="Format: 100 followed by 3 digits"
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        select
                        label="Gender"
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                      </TextField>
                    </Box>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Email *"
                        type="email"
                        placeholder="janesmith.cse@anits.edu.in"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        helperText="Format: fullnamesurname.dept@anits.edu.in (e.g., janesmith.cse@anits.edu.in)"
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Password *"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        helperText="Minimum 8 characters"
                      />
                    </Box>
                  </Stack>

                  <TextField
                    fullWidth
                    label="Contact Number"
                    type="tel"
                    value={formData.contactNo}
                    onChange={(e) => handleInputChange('contactNo', e.target.value)}
                  />
                </Stack>

                {/* Professional Information */}
                <Typography variant="h6" sx={{ mt: 4, mb: 3, color: '#111827', fontWeight: 600 }}>
                  Professional Information
                </Typography>

                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        select
                        label="Designation *"
                        value={formData.designation}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                      >
                        {FACULTY_DESIGNATIONS.map((des) => (
                          <MenuItem key={des} value={des}>
                            {des}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Date of Joining"
                        type="date"
                        value={formData.dateOfJoining}
                        onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        select
                        label="Highest Qualification *"
                        value={formData.qualification}
                        onChange={(e) => handleInputChange('qualification', e.target.value)}
                      >
                        {qualifications.map((qual) => (
                          <MenuItem key={qual} value={qual}>
                            {qual}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Specialization"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                      />
                    </Box>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Total Experience (years)"
                        type="number"
                        value={formData.totalExperience}
                        onChange={(e) => handleInputChange('totalExperience', e.target.value)}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Teaching Experience (years)"
                        type="number"
                        value={formData.teachingExperience}
                        onChange={(e) => handleInputChange('teachingExperience', e.target.value)}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Industry Experience (years)"
                        type="number"
                        value={formData.industryExperience}
                        onChange={(e) => handleInputChange('industryExperience', e.target.value)}
                      />
                    </Box>
                  </Stack>
                </Stack>

                {/* Skills */}
                <Typography variant="h6" sx={{ mt: 4, mb: 3, color: '#111827', fontWeight: 600 }}>
                  Skills & Expertise *
                </Typography>

                <Autocomplete
                  multiple
                  options={AVAILABLE_SKILLS}
                  value={skills}
                  onChange={(_, newValue) => setSkills(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select your areas of expertise"
                      placeholder="Search skills..."
                    />
                  )}
                  sx={{ mb: 3 }}
                />

                {/* Projects */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#111827', fontWeight: 600 }}>
                    Research Projects / Publications
                  </Typography>
                  {projects.map((project, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 3,
                        mb: 2,
                        backgroundColor: '#F9FAFB',
                        borderRadius: 2,
                        position: 'relative',
                      }}
                    >
                      {projects.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => removeProject(index)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: '#EF4444',
                          }}
                        >
                          <X size={18} />
                        </IconButton>
                      )}
                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Project/Publication Title"
                          value={project.title}
                          onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Description"
                          value={project.description}
                          onChange={(e) =>
                            handleProjectChange(index, 'description', e.target.value)
                          }
                        />
                        <TextField
                          fullWidth
                          label="Link (DOI/URL)"
                          value={project.link}
                          onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                        />
                      </Stack>
                    </Box>
                  ))}
                  <Button onClick={addProject} variant="outlined" sx={{ mt: 1 }}>
                    Add Project/Publication
                  </Button>
                </Box>

                {/* Achievements */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#111827', fontWeight: 600 }}>
                    Achievements / Awards
                  </Typography>
                  {achievements.map((achievement, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        label={`Achievement ${index + 1}`}
                        value={achievement}
                        onChange={(e) => handleAchievementChange(index, e.target.value)}
                      />
                      {achievements.length > 1 && (
                        <IconButton onClick={() => removeAchievement(index)} sx={{ color: '#EF4444' }}>
                          <X size={20} />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button onClick={addAchievement} variant="outlined" sx={{ mt: 1 }}>
                    Add Achievement
                  </Button>
                </Box>

                {/* Resume Upload */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#111827', fontWeight: 600 }}>
                    CV / Resume
                  </Typography>
                  <input
                    accept=".pdf,.doc,.docx"
                    type="file"
                    id="resume"
                    hidden
                    onChange={handleResumeChange}
                  />
                  <label htmlFor="resume">
                    <Button variant="outlined" component="span" startIcon={<Upload size={20} />}>
                      {resume ? resume.name : 'Upload CV/Resume'}
                    </Button>
                  </label>
                </Box>

                {/* Submit */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.5,
                    backgroundColor: '#F97316',
                    '&:hover': {
                      backgroundColor: '#EA580C',
                    },
                  }}
                >
                  Create Faculty Account
                </Button>
              </form>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default FacultyRegister;

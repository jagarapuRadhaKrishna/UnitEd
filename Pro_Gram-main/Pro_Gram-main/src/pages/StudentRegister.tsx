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
import { AVAILABLE_SKILLS } from '../types';
import unitedTheme from '../theme/unitedTheme';

const StudentRegister: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    rollNumber: '',
    department: '',
    yearOfGraduation: '',
    email: '',
    password: '',
    contactNo: '',
    gender: '',
    experience: '',
    portfolio: '',
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Array<{ title: string; description: string; link: string }>>([
    { title: '', description: '', link: '' },
  ]);
  const [achievements, setAchievements] = useState<string[]>(['']);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState('');

  const departments = [
    'CSE',
    'CSE (DATA SCIENCE)',
    'CSE (AI ML)',
    'CYBERSECURITY',
    'INFORMATION TECHNOLOGY',
    'ECE',
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
    if (!formData.rollNumber || !/^A\d{11}$/.test(formData.rollNumber)) {
      setError('Roll number must be in format A followed by 11 digits');
      return false;
    }
    // ANITS email format: fullname.batchyear.dept@anits.edu.in
    // Only allow CSE, CSD (Data Science), AIM (AI ML), CSC (Cybersecurity), IT, ECE
    const anitsEmailRegex = /^[a-zA-Z]+\.[0-9]{2}\.(cse|csd|aim|csc|it|ece)@anits\.edu\.in$/i;
    if (!formData.email || !anitsEmailRegex.test(formData.email)) {
      setError('Invalid email format! Use: firstname.YY.dept@anits.edu.in (dept: cse/csd/aim/csc/it/ece). Example: john.22.cse@anits.edu.in');
      return false;
    }
    
    // Check if email already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const emailExists = registeredUsers.some((user: any) => user.email.toLowerCase() === formData.email.toLowerCase());
    if (emailExists) {
      setError('Account already exists with this email. Please login instead.');
      return false;
    }
    
    if (!formData.department || !formData.yearOfGraduation) {
      setError('Department and year of graduation are required');
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
        role: 'student',
        gender: formData.gender as 'Male' | 'Female' | 'Other' | 'Prefer not to say',
        yearOfGraduation: formData.yearOfGraduation ? Number(formData.yearOfGraduation) : undefined,
        experience: formData.experience ? Number(formData.experience) : undefined,
        skills,
        projects: projects.filter((p) => p.title),
        achievements: achievements.filter((a) => a),
        profilePictureUrl: profilePicture,
        resumeUrl: resume?.name || '',
      });

      navigate('/home');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      if (errorMessage.includes('email')) {
        setError('Email error: Use format firstname.YY.dept@anits.edu.in (dept: cse/csd/aim/csc/it/ece)');
      } else {
        setError(errorMessage || 'Registration failed. Please check all fields and try again.');
      }
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
                sx={{ mb: 2, color: '#2563EB' }}
              >
                Back
              </Button>
              <Typography variant="h3" sx={{ color: '#111827', fontWeight: 700, mb: 1 }}>
                Student Registration
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Fill in your details to create your student profile
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
                        border: '3px solid #2563EB',
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
                    <TextField
                      fullWidth
                      label="First Name *"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Middle Name"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Last Name *"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <TextField
                      fullWidth
                      label="Roll Number *"
                      placeholder="A00000000000"
                      value={formData.rollNumber}
                      onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                      helperText="Format: A followed by 11 digits"
                    />
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
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <TextField
                      fullWidth
                      label="Email *"
                      type="email"
                      placeholder="john.22.cse@anits.edu.in"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      helperText="Format: firstname.YY.dept@anits.edu.in | Allowed: cse, csd, aim, csc, it, ece"
                      error={formData.email !== '' && !/^[a-zA-Z]+\.[0-9]{2}\.(cse|csd|aim|csc|it|ece)@anits\.edu\.in$/i.test(formData.email)}
                    />
                    <TextField
                      fullWidth
                      label="Password *"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      helperText="Minimum 8 characters"
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    label="Contact Number"
                    type="tel"
                    value={formData.contactNo}
                    onChange={(e) => handleInputChange('contactNo', e.target.value)}
                  />
                </Stack>

                {/* Academic Information */}
                <Typography variant="h6" sx={{ mt: 4, mb: 3, color: '#111827', fontWeight: 600 }}>
                  Academic Information
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <TextField
                    fullWidth
                    select
                    label="Department *"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Year of Graduation *"
                    type="number"
                    placeholder="2025"
                    value={formData.yearOfGraduation}
                    onChange={(e) => handleInputChange('yearOfGraduation', e.target.value)}
                  />
                </Stack>

                {/* Skills */}
                <Typography variant="h6" sx={{ mt: 4, mb: 3, color: '#111827', fontWeight: 600 }}>
                  Skills *
                </Typography>

                <Autocomplete
                  multiple
                  options={AVAILABLE_SKILLS}
                  value={skills}
                  onChange={(_, newValue) => setSkills(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select your skills"
                      placeholder="Search skills..."
                    />
                  )}
                  sx={{ mb: 3 }}
                />

                {/* Experience & Portfolio */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Experience (years)"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Portfolio URL"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolio}
                    onChange={(e) => handleInputChange('portfolio', e.target.value)}
                  />
                </Stack>

                {/* Projects */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#111827', fontWeight: 600 }}>
                    Projects
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
                          label="Project Title"
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
                          label="Project Link"
                          value={project.link}
                          onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                        />
                      </Stack>
                    </Box>
                  ))}
                  <Button onClick={addProject} variant="outlined" sx={{ mt: 1 }}>
                    Add Project
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
                    Resume
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
                      {resume ? resume.name : 'Upload Resume'}
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
                    backgroundColor: '#2563EB',
                    '&:hover': {
                      backgroundColor: '#1E40AF',
                    },
                  }}
                >
                  Create Student Account
                </Button>
              </form>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default StudentRegister;

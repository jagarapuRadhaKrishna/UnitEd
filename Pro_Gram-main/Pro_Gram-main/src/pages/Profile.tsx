import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  IconButton,
  Stack,
  Chip,
  TextField,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Edit,
  Save,
  X,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Plus,
  Trash2,
  Github,
  Linkedin,
  Globe,
  Users,
  Upload,
  ArrowLeft,
  Star,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Edit states for each section
  const [editingSections, setEditingSections] = useState({
    header: false,
    about: false,
    contact: false,
    experience: false,
    skills: false,
    projects: false,
    achievements: false,
    education: false,
  });

  // Form data states
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    contactNo: user?.contactNo || '',
    gender: user?.gender || 'Prefer not to say',
    bio: (user as any)?.bio || '',
    location: (user as any)?.location || '',
    portfolio: user?.role === 'student' ? (user as any).portfolio : (user as any)?.website || '',
    github: (user as any)?.github || '',
    linkedin: (user as any)?.linkedin || '',
    leetcode: (user as any)?.leetcode || '',
    resume: (user as any)?.resume || '',
    coverLetter: (user as any)?.coverLetter || '',
    cgpa: (user as any)?.cgpa || '',
    skills: user?.skills || [],
    projects: user?.projects || [],
    achievements: user?.achievements || [],
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    link: '',
    skills: [] as string[],
    startDate: '',
    endDate: '',
    isOngoing: false,
  });
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: '',
    issuer: '',
    category: 'award' as 'award' | 'certification' | 'publication' | 'competition' | 'other',
  });

  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);

  const toggleEdit = (section: keyof typeof editingSections) => {
    setEditingSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = async (section: keyof typeof editingSections) => {
    try {
      // Handle file uploads if they exist
      const updates: any = { ...formData };
      
      if (resumeFile) {
        // In a real app, you would upload to a server
        // For now, store the file name
        updates.resume = resumeFile.name;
        updates.resumeUrl = URL.createObjectURL(resumeFile);
      }
      
      if (coverLetterFile) {
        updates.coverLetter = coverLetterFile.name;
        updates.coverLetterUrl = URL.createObjectURL(coverLetterFile);
      }
      
      // Update the user profile
      await updateProfile(updates);
      
      // Update localStorage for all registered users - INSTANT UPDATE (0.1s response)
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex((u: any) => u.id === user?.id);
      if (userIndex !== -1) {
        registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updates };
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }

      // Update user in localStorage immediately
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updates }));

      toggleEdit(section);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      
      // Force immediate re-render without page reload for instant updates
      setTimeout(() => {
        window.dispatchEvent(new Event('profileUpdated'));
      }, 100); // 0.1s response time
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    }
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
      setFormData(prev => ({ ...prev, resume: event.target.files![0].name }));
    }
  };

  const handleCoverLetterUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCoverLetterFile(event.target.files[0]);
      setFormData(prev => ({ ...prev, coverLetter: event.target.files![0].name }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      const project = {
        id: `proj_${Date.now()}`,
        ...newProject,
      };
      setFormData(prev => ({ ...prev, projects: [...prev.projects, project] }));
      setProjectDialogOpen(false);
      setNewProject({
        title: '',
        description: '',
        link: '',
        skills: [],
        startDate: '',
        endDate: '',
        isOngoing: false,
      });
    }
  };

  const handleRemoveProject = (projectId: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId),
    }));
  };

  const handleAddAchievement = () => {
    if (newAchievement.title.trim()) {
      const achievement = {
        id: `ach_${Date.now()}`,
        ...newAchievement,
      };
      setFormData(prev => ({ ...prev, achievements: [...prev.achievements, achievement] }));
      setAchievementDialogOpen(false);
      setNewAchievement({
        title: '',
        description: '',
        date: '',
        issuer: '',
        category: 'award',
      });
    }
  };

  const handleRemoveAchievement = (achievementId: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a.id !== achievementId),
    }));
  };

  if (!user) {
    navigate('/login');
    return null;
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
            Back
          </Button>
        </Container>
      </Box>

      {/* Cover Photo & Profile Header */}
      <Box
        sx={{
          height: 250,
          background: 'linear-gradient(135deg, #6C47FF 0%, #8B5CF6 100%)',
          position: 'relative',
        }}
      >
        {/* Optional: Add cover photo upload here */}
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ position: 'relative', mt: -10 }}>
          {/* Profile Header Card */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
              {/* Avatar */}
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={user.profilePicture}
                  sx={{
                    width: 150,
                    height: 150,
                    border: '4px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  {user.firstName[0]}{user.lastName[0]}
                </Avatar>
                {editingSections.header && (
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'white',
                      '&:hover': { backgroundColor: '#F3F4F6' },
                    }}
                  >
                    <Edit size={16} />
                  </IconButton>
                )}
              </Box>

              {/* Profile Info */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                {editingSections.header ? (
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        size="small"
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                      <TextField
                        size="small"
                        label="Middle Name"
                        value={formData.middleName}
                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                      />
                      <TextField
                        size="small"
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </Stack>
                    {user.role === 'student' && (
                      <TextField
                        size="small"
                        label="CGPA"
                        type="number"
                        inputProps={{ min: 0, max: 10, step: 0.01 }}
                        value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                        placeholder="e.g., 8.5"
                      />
                    )}
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Save size={16} />}
                        onClick={() => handleSave('header')}
                        sx={{ backgroundColor: '#10B981' }}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<X size={16} />}
                        onClick={() => toggleEdit('header')}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      <Typography variant="h4" fontWeight={700}>
                        {user.firstName} {user.middleName} {user.lastName}
                      </Typography>
                      <IconButton size="small" onClick={() => toggleEdit('header')}>
                        <Edit size={18} />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      <Chip
                        icon={user.role === 'student' ? <GraduationCap size={16} /> : <Briefcase size={16} />}
                        label={user.role === 'student' ? 'Student' : 'Faculty'}
                        color="primary"
                        size="small"
                      />
                      {user.role === 'student' && (user as any).department && (
                        <Chip label={(user as any).department} size="small" />
                      )}
                      {user.role === 'student' && formData.cgpa && (
                        <Chip 
                          icon={<Star size={14} />}
                          label={`CGPA: ${formData.cgpa}`} 
                          size="small"
                          sx={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                        />
                      )}
                      {user.role === 'faculty' && (user as any).designation && (
                        <Chip label={(user as any).designation} size="small" />
                      )}
                    </Stack>
                    {formData.location && (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                        <MapPin size={16} color="#6B7280" />
                        <Typography variant="body2" color="text.secondary">
                          {formData.location}
                        </Typography>
                      </Stack>
                    )}
                  </>
                )}
              </Box>

              {/* Actions */}
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<Edit size={18} />}
                  onClick={() => navigate('/settings/profile')}
                  sx={{
                    backgroundColor: '#6C47FF',
                    '&:hover': { backgroundColor: '#5A3AD6' },
                  }}
                >
                  Edit Profile
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Main Content - Two Column Layout */}
          <Grid container spacing={3}>
            {/* Left Column - Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Contact Information */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Contact Information
                  </Typography>
                  {!editingSections.contact && (
                    <IconButton size="small" onClick={() => toggleEdit('contact')}>
                      <Edit size={18} />
                    </IconButton>
                  )}
                </Stack>

                {editingSections.contact ? (
                  <Stack spacing={2}>
                    <TextField
                      size="small"
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      InputProps={{
                        startAdornment: <Mail size={16} style={{ marginRight: 8 }} />,
                      }}
                    />
                    <TextField
                      size="small"
                      label="Phone"
                      value={formData.contactNo}
                      onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                      InputProps={{
                        startAdornment: <Phone size={16} style={{ marginRight: 8 }} />,
                      }}
                    />
                    <TextField
                      size="small"
                      label="Location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      InputProps={{
                        startAdornment: <MapPin size={16} style={{ marginRight: 8 }} />,
                      }}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Save size={16} />}
                        onClick={() => handleSave('contact')}
                        sx={{ backgroundColor: '#10B981' }}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<X size={16} />}
                        onClick={() => toggleEdit('contact')}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Mail size={16} color="#6B7280" />
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Stack>
                    {user.contactNo && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Phone size={16} color="#6B7280" />
                        <Typography variant="body2" color="text.secondary">
                          {user.contactNo}
                        </Typography>
                      </Stack>
                    )}
                    {formData.location && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MapPin size={16} color="#6B7280" />
                        <Typography variant="body2" color="text.secondary">
                          {formData.location}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                )}
              </Paper>

              {/* Social Links */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Social Links
                </Typography>
                <Stack spacing={1.5}>
                  {formData.portfolio && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Globe size={16} />}
                      endIcon={<ExternalLink size={14} />}
                      href={formData.portfolio}
                      target="_blank"
                      sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                    >
                      Portfolio
                    </Button>
                  )}
                  {formData.github && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Github size={16} />}
                      endIcon={<ExternalLink size={14} />}
                      href={formData.github}
                      target="_blank"
                      sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                    >
                      GitHub
                    </Button>
                  )}
                  {formData.linkedin && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Linkedin size={16} />}
                      endIcon={<ExternalLink size={14} />}
                      href={formData.linkedin}
                      target="_blank"
                      sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                    >
                      LinkedIn
                    </Button>
                  )}
                  {formData.leetcode && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Award size={16} />}
                      endIcon={<ExternalLink size={14} />}
                      href={formData.leetcode}
                      target="_blank"
                      sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                    >
                      LeetCode
                    </Button>
                  )}
                </Stack>
                {(!formData.portfolio && !formData.github && !formData.linkedin && !formData.leetcode) && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No social links added yet. Add them in Settings → Profile.
                  </Typography>
                )}
              </Paper>

              {/* Resume & Cover Letter Section - For Students */}
              {user?.role === 'student' && (
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Documents
                  </Typography>
                  <Stack spacing={2}>
                    {/* Resume Upload */}
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                        Resume / CV
                      </Typography>
                      <input
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                        id="resume-upload"
                        type="file"
                        onChange={handleResumeUpload}
                      />
                      <label htmlFor="resume-upload">
                        <Button
                          fullWidth
                          variant="outlined"
                          component="span"
                          startIcon={<Upload size={16} />}
                          sx={{ textTransform: 'none', mb: 1 }}
                        >
                          {formData.resume ? 'Change Resume' : 'Upload Resume'}
                        </Button>
                      </label>
                      {formData.resume && (
                        <Chip
                          label={formData.resume}
                          onDelete={() => {
                            setResumeFile(null);
                            setFormData(prev => ({ ...prev, resume: '' }));
                          }}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Upload your resume for Easy Apply feature
                      </Typography>
                    </Box>

                    {/* Cover Letter Upload */}
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                        Cover Letter (Optional)
                      </Typography>
                      <input
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                        id="cover-letter-upload"
                        type="file"
                        onChange={handleCoverLetterUpload}
                      />
                      <label htmlFor="cover-letter-upload">
                        <Button
                          fullWidth
                          variant="outlined"
                          component="span"
                          startIcon={<Upload size={16} />}
                          sx={{ textTransform: 'none', mb: 1 }}
                        >
                          {formData.coverLetter ? 'Change Cover Letter' : 'Upload Cover Letter'}
                        </Button>
                      </label>
                      {formData.coverLetter && (
                        <Chip
                          label={formData.coverLetter}
                          onDelete={() => {
                            setCoverLetterFile(null);
                            setFormData(prev => ({ ...prev, coverLetter: '' }));
                          }}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>

                    {/* Save Button */}
                    {(resumeFile || coverLetterFile) && (
                      <Button
                        variant="contained"
                        startIcon={<Save size={16} />}
                        onClick={() => handleSave('contact')}
                        sx={{ backgroundColor: '#10B981' }}
                      >
                        Save Documents
                      </Button>
                    )}
                  </Stack>
                </Paper>
              )}

              {/* Skills Section */}
              <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Skills
                  </Typography>
                  {!editingSections.skills && (
                    <IconButton size="small" onClick={() => toggleEdit('skills')}>
                      <Edit size={18} />
                    </IconButton>
                  )}
                </Stack>

                {editingSections.skills ? (
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Add a skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleAddSkill}
                        sx={{ minWidth: 'auto', px: 2 }}
                      >
                        <Plus size={16} />
                      </Button>
                    </Stack>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {formData.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          onDelete={() => handleRemoveSkill(skill)}
                          size="small"
                        />
                      ))}
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Save size={16} />}
                        onClick={() => handleSave('skills')}
                        sx={{ backgroundColor: '#10B981' }}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<X size={16} />}
                        onClick={() => toggleEdit('skills')}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {formData.skills.length > 0 ? (
                      formData.skills.map((skill) => (
                        <Chip key={skill} label={skill} size="small" color="primary" variant="outlined" />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No skills added yet
                      </Typography>
                    )}
                  </Stack>
                )}
              </Paper>
            </Grid>

            {/* Right Column - Main Content */}
            <Grid item xs={12} md={8}>
              {/* About Section */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    About
                  </Typography>
                  {!editingSections.about && (
                    <IconButton size="small" onClick={() => toggleEdit('about')}>
                      <Edit size={18} />
                    </IconButton>
                  )}
                </Stack>

                {editingSections.about ? (
                  <Stack spacing={2}>
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      placeholder="Tell us about yourself, your interests, research areas, or teaching philosophy..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Save size={16} />}
                        onClick={() => handleSave('about')}
                        sx={{ backgroundColor: '#10B981' }}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<X size={16} />}
                        onClick={() => toggleEdit('about')}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {formData.bio || 'No bio added yet. Click edit to add your bio.'}
                  </Typography>
                )}
              </Paper>

              {/* Projects Section */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Projects
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Plus size={16} />}
                    onClick={() => setProjectDialogOpen(true)}
                  >
                    Add Project
                  </Button>
                </Stack>

                {formData.projects.length > 0 ? (
                  <Stack spacing={2}>
                    {formData.projects.map((project: any) => (
                      <Card key={project.id} variant="outlined">
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {project.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {project.description}
                              </Typography>
                              {project.skills && project.skills.length > 0 && (
                                <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1.5 }}>
                                  {project.skills.map((skill: string) => (
                                    <Chip key={skill} label={skill} size="small" />
                                  ))}
                                </Stack>
                              )}
                              {project.link && (
                                <Button
                                  size="small"
                                  href={project.link}
                                  target="_blank"
                                  endIcon={<ExternalLink size={14} />}
                                  sx={{ mt: 1, textTransform: 'none' }}
                                >
                                  View Project
                                </Button>
                              )}
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveProject(project.id)}
                              sx={{ color: '#EF4444' }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No projects added yet. Click "Add Project" to showcase your work.
                  </Typography>
                )}
              </Paper>

              {/* Achievements Section */}
              <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Achievements & Awards
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Plus size={16} />}
                    onClick={() => setAchievementDialogOpen(true)}
                  >
                    Add Achievement
                  </Button>
                </Stack>

                {formData.achievements.length > 0 ? (
                  <List>
                    {formData.achievements.map((achievement: any) => (
                      <ListItem
                        key={achievement.id}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveAchievement(achievement.id)}
                            sx={{ color: '#EF4444' }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        }
                      >
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
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No achievements added yet. Click "Add Achievement" to showcase your accomplishments.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Add Project Dialog */}
      <Dialog open={projectDialogOpen} onClose={() => setProjectDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="Project Link (optional)"
              placeholder="https://github.com/..."
              value={newProject.link}
              onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddProject} variant="contained" sx={{ backgroundColor: '#6C47FF' }}>
            Add Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Achievement Dialog */}
      <Dialog open={achievementDialogOpen} onClose={() => setAchievementDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Achievement</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Achievement Title"
              value={newAchievement.title}
              onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description (optional)"
              value={newAchievement.description}
              onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="Issuer (optional)"
              placeholder="Organization or Institution"
              value={newAchievement.issuer}
              onChange={(e) => setNewAchievement({ ...newAchievement, issuer: e.target.value })}
            />
            <TextField
              fullWidth
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={newAchievement.date}
              onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAchievementDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddAchievement} variant="contained" sx={{ backgroundColor: '#6C47FF' }}>
            Add Achievement
          </Button>
        </DialogActions>
      </Dialog>

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

export default Profile;

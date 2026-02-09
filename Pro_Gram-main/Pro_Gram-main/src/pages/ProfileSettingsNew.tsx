import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Grid,
  Card,
  CardContent,
  SelectChangeEvent,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Plus, 
  Trash2,
  Camera,
  Link as LinkIcon,
  FileText,
  Award,
  Download,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  AVAILABLE_SKILLS, 
  DEPARTMENTS, 
  FACULTY_DESIGNATIONS, 
  QUALIFICATIONS,
  ProjectDetail,
  Achievement,
} from '../types';
import {
  validateEmployeeId,
  validateRollNumber,
  validateUniversityEmail,
  validateContactNumber,
  validateURL,
  validateYearOfGraduation,
  validateRequired,
  validateFileUpload,
  validateImageUpload,
  validateExperience,
  validateDate,
} from '../utils/validation';

interface ProfileFormData {
  // Common fields
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  contactNo: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | '';
  profilePicture: File | null;
  profilePictureUrl: string;
  skills: string[];
  projects: ProjectDetail[];
  achievements: Achievement[];
  resume: File | null;
  resumeUrl: string;
  leetcode?: string;
  
  // Student specific
  rollNumber?: string;
  department?: string;
  yearOfGraduation?: number;
  cgpa?: string;
  experience?: string;
  portfolio?: string;
  
  // Faculty specific
  employeeId?: string;
  designation?: string;
  dateOfJoining?: string;
  totalExperience?: number;
  industryExperience?: number;
  teachingExperience?: number;
  qualification?: string;
  specialization?: string[];
}

interface FormErrors {
  [key: string]: string;
}

const ProfileSettingsNew: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openScrapingDialog, setOpenScrapingDialog] = useState(false);
  const [scrapingPlatform, setScrapingPlatform] = useState('');
  const [scrapingUrl, setScrapingUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    contactNo: '',
    gender: '',
    profilePicture: null,
    profilePictureUrl: '',
    skills: [],
    projects: [],
    achievements: [],
    resume: null,
    resumeUrl: '',
  });

  // Load existing profile data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        contactNo: user.contactNo || '',
        gender: user.gender || '',
        profilePicture: null,
        profilePictureUrl: user.profilePicture || '',
        skills: user.skills || [],
        projects: user.projects || [],
        achievements: user.achievements || [],
        resume: null,
        resumeUrl: user.resumeUrl || '',
        leetcode: user.leetcode || '',
        
        ...(user.role === 'student' ? {
          rollNumber: user.rollNumber || '',
          department: user.department || '',
          yearOfGraduation: user.yearOfGraduation || new Date().getFullYear() + 4,
          cgpa: user.cgpa || '',
          experience: user.experience || '',
          portfolio: user.portfolio || '',
        } : {
          employeeId: user.employeeId || '',
          designation: user.designation || '',
          dateOfJoining: user.dateOfJoining || '',
          totalExperience: user.totalExperience || 0,
          industryExperience: user.industryExperience || 0,
          teachingExperience: user.teachingExperience || 0,
          qualification: user.qualification || '',
          specialization: user.specialization || [],
        }),
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSkillsChange = (event: SelectChangeEvent<typeof formData.skills>) => {
    const value = event.target.value;
    setFormData({ ...formData, skills: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSpecializationChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData({ 
      ...formData, 
      specialization: typeof value === 'string' ? value.split(',') : value 
    });
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateImageUpload(file);
      
      if (!validation.isValid) {
        setErrors({ ...errors, profilePicture: validation.error || '' });
        return;
      }
      
      setFormData({ ...formData, profilePicture: file, profilePictureUrl: URL.createObjectURL(file) });
      setErrors({ ...errors, profilePicture: '' });
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFileUpload(file, { required: false });
      
      if (!validation.isValid) {
        setErrors({ ...errors, resume: validation.error || '' });
        return;
      }
      
      setFormData({ ...formData, resume: file });
      setErrors({ ...errors, resume: '' });
    }
  };

  // Project management
  const addProject = () => {
    const newProject: ProjectDetail = {
      id: Date.now().toString(),
      title: '',
      description: '',
      link: '',
      skills: [],
      duration: '',
    };
    setFormData({ ...formData, projects: [...formData.projects, newProject] });
  };

  const updateProject = (index: number, field: keyof ProjectDetail, value: any) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setFormData({ ...formData, projects: updatedProjects });
  };

  const removeProject = (index: number) => {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updatedProjects });
  };

  // Achievement management
  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      issuer: '',
      category: 'award',
    };
    setFormData({ ...formData, achievements: [...formData.achievements, newAchievement] });
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: any) => {
    const updatedAchievements = [...formData.achievements];
    updatedAchievements[index] = { ...updatedAchievements[index], [field]: value };
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  const removeAchievement = (index: number) => {
    const updatedAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Common validations
    const firstNameValidation = validateRequired(formData.firstName, 'First name');
    if (!firstNameValidation.isValid) newErrors.firstName = firstNameValidation.error!;
    
    const lastNameValidation = validateRequired(formData.lastName, 'Last name');
    if (!lastNameValidation.isValid) newErrors.lastName = lastNameValidation.error!;
    
    const emailValidation = validateUniversityEmail(formData.email);
    if (!emailValidation.isValid) newErrors.email = emailValidation.error!;
    
    const contactValidation = validateContactNumber(formData.contactNo);
    if (!contactValidation.isValid) newErrors.contactNo = contactValidation.error!;
    
    const genderValidation = validateRequired(formData.gender, 'Gender');
    if (!genderValidation.isValid) newErrors.gender = genderValidation.error!;
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }
    
    // Role-specific validations
    if (user?.role === 'student') {
      const rollNoValidation = validateRollNumber(formData.rollNumber || '');
      if (!rollNoValidation.isValid) newErrors.rollNumber = rollNoValidation.error!;
      
      const deptValidation = validateRequired(formData.department, 'Department');
      if (!deptValidation.isValid) newErrors.department = deptValidation.error!;
      
      const yearValidation = validateYearOfGraduation(formData.yearOfGraduation || 0);
      if (!yearValidation.isValid) newErrors.yearOfGraduation = yearValidation.error!;
      
      if (formData.portfolio) {
        const portfolioValidation = validateURL(formData.portfolio, 'Portfolio URL');
        if (!portfolioValidation.isValid) newErrors.portfolio = portfolioValidation.error!;
      }
    } else if (user?.role === 'faculty') {
      const empIdValidation = validateEmployeeId(formData.employeeId || '');
      if (!empIdValidation.isValid) newErrors.employeeId = empIdValidation.error!;
      
      const designationValidation = validateRequired(formData.designation, 'Designation');
      if (!designationValidation.isValid) newErrors.designation = designationValidation.error!;
      
      const dateValidation = validateDate(formData.dateOfJoining || '', 'Date of joining');
      if (!dateValidation.isValid) newErrors.dateOfJoining = dateValidation.error!;
      
      const totalExpValidation = validateExperience(formData.totalExperience || 0, 'Total experience');
      if (!totalExpValidation.isValid) newErrors.totalExperience = totalExpValidation.error!;
      
      const industryExpValidation = validateExperience(formData.industryExperience || 0, 'Industry experience');
      if (!industryExpValidation.isValid) newErrors.industryExperience = industryExpValidation.error!;
      
      const teachingExpValidation = validateExperience(formData.teachingExperience || 0, 'Teaching experience');
      if (!teachingExpValidation.isValid) newErrors.teachingExperience = teachingExpValidation.error!;
      
      const qualificationValidation = validateRequired(formData.qualification, 'Qualification');
      if (!qualificationValidation.isValid) newErrors.qualification = qualificationValidation.error!;
      
      if (!formData.specialization || formData.specialization.length === 0) {
        newErrors.specialization = 'Please select at least one specialization';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, upload files to server and get URLs
      // For now, we'll store in localStorage
      const updatedUserData: any = {
        ...formData,
        profilePicture: formData.profilePictureUrl,
        resumeUrl: formData.resume ? formData.resume.name : formData.resumeUrl,
      };
      
      // Remove empty gender field if not selected
      if (!updatedUserData.gender) {
        delete updatedUserData.gender;
      }
      
      await updateProfile(updatedUserData);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ ...errors, submit: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenScrapingDialog = (platform: string) => {
    setScrapingPlatform(platform);
    setScrapingUrl('');
    setOpenScrapingDialog(true);
  };

  const handleScrapeData = async () => {
    if (!scrapingUrl) return;

    setIsScraping(true);
    
    try {
      // Simulate scraping delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock scraped data based on platform
      let scrapedData: Partial<ProfileFormData> = {};
      
      if (scrapingPlatform === 'LinkedIn') {
        scrapedData = {
          experience: formData.experience + '\n\nSenior Software Engineer at Tech Corp\n2+ years experience in React, TypeScript, Node.js',
          skills: [...new Set([...formData.skills, 'React', 'TypeScript', 'Node.js', 'MongoDB'])],
        };
      } else if (scrapingPlatform === 'GitHub') {
        scrapedData = {
          portfolio: scrapingUrl,
          skills: [...new Set([...formData.skills, 'Git', 'JavaScript', 'Python'])],
          projects: [
            ...formData.projects,
            {
              id: Date.now().toString(),
              title: 'E-Commerce Platform',
              description: 'Full-stack e-commerce application with React and Node.js',
              link: scrapingUrl,
              skills: ['React', 'Node.js', 'MongoDB'],
            },
          ],
        };
      } else if (scrapingPlatform === 'LeetCode') {
        scrapedData = {
          achievements: [
            ...formData.achievements,
            {
              id: Date.now().toString(),
              title: 'LeetCode Problem Solver',
              description: '500+ problems solved | Contest Rating: 1850',
              date: new Date().toISOString().split('T')[0],
              category: 'competition',
            },
          ],
          skills: [...new Set([...formData.skills, 'Data Structures', 'Algorithms', 'Problem Solving'])],
        };
      }
      
      setFormData(prev => ({ ...prev, ...scrapedData }));
      setOpenScrapingDialog(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Scraping error:', error);
    } finally {
      setIsScraping(false);
    }
  };


  if (!user) {
    return null;
  }

  const isStudent = user.role === 'student';
  const isFaculty = user.role === 'faculty';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', pt: 10, pb: 6 }}>
      {/* Back Button */}
      <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', mb: 3 }}>
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

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {isStudent ? 'Student' : 'Faculty'} Profile Settings
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B7280' }}>
              Complete your profile to enable Easy Apply for projects and events
            </Typography>
          </Box>

          {/* Success Alert */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert severity="success" sx={{ mb: 3 }}>
                  Profile saved successfully! Easy Apply is now enabled.
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Alert */}
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.submit}
            </Alert>
          )}

          {/* Profile Picture */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Profile Picture *
            </Typography>
            <Stack direction="row" alignItems="center" spacing={3}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={formData.profilePictureUrl}
                  sx={{
                    width: 120,
                    height: 120,
                    backgroundColor: '#6C47FF',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                  }}
                >
                  {formData.firstName[0] || 'U'}
                </Avatar>
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white',
                    boxShadow: 2,
                    '&:hover': { backgroundColor: '#F3F4F6' },
                  }}
                >
                  <Camera size={18} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                  />
                </IconButton>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Upload Profile Picture
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  JPG, PNG or GIF (Max 2MB)
                </Typography>
                {errors.profilePicture && (
                  <Typography variant="caption" sx={{ color: 'error.main' }}>
                    {errors.profilePicture}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Paper>

          {/* Basic Information */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="University Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email || 'Use your university email address'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Contact Number"
                  value={formData.contactNo}
                  onChange={(e) => handleInputChange('contactNo', e.target.value)}
                  error={!!errors.contactNo}
                  helperText={errors.contactNo}
                  placeholder="10-digit number"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                    <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                  </Select>
                  {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Student Specific Fields */}
          {isStudent && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Student Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Roll Number"
                    value={formData.rollNumber}
                    onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                    error={!!errors.rollNumber}
                    helperText={errors.rollNumber || 'Format: A*********** (12 digits)'}
                    placeholder="A00000000000"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.department}>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      label="Department"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </Select>
                    {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Year of Graduation"
                    type="number"
                    value={formData.yearOfGraduation}
                    onChange={(e) => handleInputChange('yearOfGraduation', parseInt(e.target.value))}
                    error={!!errors.yearOfGraduation}
                    helperText={errors.yearOfGraduation}
                    inputProps={{ min: 2020, max: 2040 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CGPA"
                    type="number"
                    value={formData.cgpa}
                    onChange={(e) => handleInputChange('cgpa', e.target.value)}
                    error={!!errors.cgpa}
                    helperText={errors.cgpa || 'Enter your CGPA out of 10'}
                    placeholder="e.g., 8.5"
                    inputProps={{ min: 0, max: 10, step: 0.01 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Portfolio URL"
                    value={formData.portfolio}
                    onChange={(e) => handleInputChange('portfolio', e.target.value)}
                    error={!!errors.portfolio}
                    helperText={errors.portfolio}
                    placeholder="https://yourportfolio.com"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LeetCode Profile"
                    value={formData.leetcode}
                    onChange={(e) => handleInputChange('leetcode', e.target.value)}
                    error={!!errors.leetcode}
                    helperText={errors.leetcode}
                    placeholder="https://leetcode.com/username"
                  />
                </Grid>

                {/* Platform Scraping Buttons */}
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: '#6B7280' }}>
                    Import Data from Platforms
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LinkIcon size={16} />}
                      onClick={() => handleOpenScrapingDialog('LinkedIn')}
                      sx={{ textTransform: 'none' }}
                    >
                      Import from LinkedIn
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LinkIcon size={16} />}
                      onClick={() => handleOpenScrapingDialog('GitHub')}
                      sx={{ textTransform: 'none' }}
                    >
                      Import from GitHub
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LinkIcon size={16} />}
                      onClick={() => handleOpenScrapingDialog('LeetCode')}
                      sx={{ textTransform: 'none' }}
                    >
                      Import from LeetCode
                    </Button>
                  </Stack>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#9CA3AF' }}>
                    Automatically import your experience, skills, and achievements
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Experience"
                    multiline
                    rows={3}
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Describe your work experience, internships, volunteer work..."
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Faculty Specific Fields */}
          {isFaculty && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Faculty Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Employee ID"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    error={!!errors.employeeId}
                    helperText={errors.employeeId || 'Format: 100*** (6 digits)'}
                    placeholder="100000"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.designation}>
                    <InputLabel>Designation</InputLabel>
                    <Select
                      value={formData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      label="Designation"
                    >
                      {FACULTY_DESIGNATIONS.map((des) => (
                        <MenuItem key={des} value={des}>{des}</MenuItem>
                      ))}
                    </Select>
                    {errors.designation && <FormHelperText>{errors.designation}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Date of Joining"
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    error={!!errors.dateOfJoining}
                    helperText={errors.dateOfJoining}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.qualification}>
                    <InputLabel>Highest Qualification</InputLabel>
                    <Select
                      value={formData.qualification}
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
                      label="Highest Qualification"
                    >
                      {QUALIFICATIONS.map((qual) => (
                        <MenuItem key={qual} value={qual}>{qual}</MenuItem>
                      ))}
                    </Select>
                    {errors.qualification && <FormHelperText>{errors.qualification}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label="Total Experience (Years)"
                    type="number"
                    value={formData.totalExperience}
                    onChange={(e) => handleInputChange('totalExperience', parseFloat(e.target.value))}
                    error={!!errors.totalExperience}
                    helperText={errors.totalExperience}
                    inputProps={{ min: 0, max: 50, step: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label="Industry Experience (Years)"
                    type="number"
                    value={formData.industryExperience}
                    onChange={(e) => handleInputChange('industryExperience', parseFloat(e.target.value))}
                    error={!!errors.industryExperience}
                    helperText={errors.industryExperience}
                    inputProps={{ min: 0, max: 50, step: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label="Teaching Experience (Years)"
                    type="number"
                    value={formData.teachingExperience}
                    onChange={(e) => handleInputChange('teachingExperience', parseFloat(e.target.value))}
                    error={!!errors.teachingExperience}
                    helperText={errors.teachingExperience}
                    inputProps={{ min: 0, max: 50, step: 0.5 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required error={!!errors.specialization}>
                    <InputLabel>Specialization</InputLabel>
                    <Select
                      multiple
                      value={formData.specialization || []}
                      onChange={handleSpecializationChange}
                      input={<OutlinedInput label="Specialization" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {AVAILABLE_SKILLS.map((skill) => (
                        <MenuItem key={skill} value={skill}>{skill}</MenuItem>
                      ))}
                    </Select>
                    {errors.specialization && <FormHelperText>{errors.specialization}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Skills */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Skills *
            </Typography>
            <FormControl fullWidth required error={!!errors.skills}>
              <InputLabel>Select Skills</InputLabel>
              <Select
                multiple
                value={formData.skills}
                onChange={handleSkillsChange}
                input={<OutlinedInput label="Select Skills" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {AVAILABLE_SKILLS.map((skill) => (
                  <MenuItem key={skill} value={skill}>{skill}</MenuItem>
                ))}
              </Select>
              {errors.skills && <FormHelperText>{errors.skills}</FormHelperText>}
              <FormHelperText>Select all skills that apply to you</FormHelperText>
            </FormControl>
          </Paper>

          {/* Projects */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Projects
              </Typography>
              <Button
                startIcon={<Plus size={18} />}
                onClick={addProject}
                variant="outlined"
                size="small"
              >
                Add Project
              </Button>
            </Box>
            
            <Stack spacing={2}>
              {formData.projects.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#6B7280', textAlign: 'center', py: 3 }}>
                  No projects added yet. Click "Add Project" to showcase your work.
                </Typography>
              ) : (
                formData.projects.map((project, index) => (
                  <Card key={project.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6C47FF' }}>
                          Project {index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeProject(index)}
                          sx={{ color: 'error.main' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Project Title"
                            value={project.title}
                            onChange={(e) => updateProject(index, 'title', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={2}
                            value={project.description}
                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Project Link (Optional)"
                            value={project.link}
                            onChange={(e) => updateProject(index, 'link', e.target.value)}
                            size="small"
                            placeholder="https://github.com/yourproject"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LinkIcon size={16} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Duration (Optional)"
                            value={project.duration}
                            onChange={(e) => updateProject(index, 'duration', e.target.value)}
                            size="small"
                            placeholder="e.g., 3 months, Jan-Mar 2024"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Paper>

          {/* Achievements/Awards */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Achievements & Awards
              </Typography>
              <Button
                startIcon={<Plus size={18} />}
                onClick={addAchievement}
                variant="outlined"
                size="small"
              >
                Add Achievement
              </Button>
            </Box>
            
            <Stack spacing={2}>
              {formData.achievements.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#6B7280', textAlign: 'center', py: 3 }}>
                  No achievements added yet. Click "Add Achievement" to showcase your accomplishments.
                </Typography>
              ) : (
                formData.achievements.map((achievement, index) => (
                  <Card key={achievement.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6C47FF' }}>
                          Achievement {index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeAchievement(index)}
                          sx={{ color: 'error.main' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                          <TextField
                            fullWidth
                            label="Achievement Title"
                            value={achievement.title}
                            onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Category</InputLabel>
                            <Select
                              value={achievement.category}
                              onChange={(e) => updateAchievement(index, 'category', e.target.value)}
                              label="Category"
                            >
                              <MenuItem value="award">Award</MenuItem>
                              <MenuItem value="certification">Certification</MenuItem>
                              <MenuItem value="publication">Publication</MenuItem>
                              <MenuItem value="competition">Competition</MenuItem>
                              <MenuItem value="other">Other</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Description (Optional)"
                            value={achievement.description}
                            onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                            size="small"
                            multiline
                            rows={2}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Issuer/Organization (Optional)"
                            value={achievement.issuer}
                            onChange={(e) => updateAchievement(index, 'issuer', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Date (Optional)"
                            type="date"
                            value={achievement.date}
                            onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Paper>

          {/* Resume Upload */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Resume / CV *
            </Typography>
            <Box
              sx={{
                border: '2px dashed #E5E7EB',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#6C47FF',
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="resume-upload" style={{ cursor: 'pointer' }}>
                <FileText size={40} color="#6C47FF" style={{ marginBottom: 8 }} />
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  {formData.resume || formData.resumeUrl ? 'Resume Uploaded' : 'Upload Your Resume'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  PDF, DOC, or DOCX (Max 5MB)
                </Typography>
                {(formData.resume || formData.resumeUrl) && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <CheckCircle size={20} color="#10B981" />
                    <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                      {formData.resume?.name || formData.resumeUrl}
                    </Typography>
                  </Box>
                )}
              </label>
            </Box>
            {errors.resume && (
              <Typography variant="caption" sx={{ color: 'error.main', mt: 1, display: 'block' }}>
                {errors.resume}
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: '#6B7280', mt: 1, display: 'block' }}>
              💡 Tip: Upload your resume to enable Easy Apply on projects and events
            </Typography>
          </Paper>

          {/* Easy Apply Info */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6C47FF 0%, #5A3AD6 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
              <Award size={24} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  ✨ Complete Your Profile
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.95 }}>
                  Once you save your complete profile with resume, you can apply to projects and events with a single click.
                  Your information will be automatically sent, and you'll receive confirmation emails.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              variant="outlined" 
              sx={{ px: 4 }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSubmitting}
              sx={{
                px: 4,
                backgroundColor: '#6C47FF',
                '&:hover': {
                  backgroundColor: '#5A3AD6',
                },
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </Stack>
        </motion.div>
      </Container>

      {/* Platform Scraping Dialog */}
      <Dialog open={openScrapingDialog} onClose={() => setOpenScrapingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Import Data from {scrapingPlatform}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your {scrapingPlatform} profile URL to automatically import your data
          </Typography>
          <TextField
            fullWidth
            label={`${scrapingPlatform} Profile URL`}
            value={scrapingUrl}
            onChange={(e) => setScrapingUrl(e.target.value)}
            placeholder={
              scrapingPlatform === 'LinkedIn' 
                ? 'https://linkedin.com/in/username'
                : scrapingPlatform === 'GitHub'
                ? 'https://github.com/username'
                : 'https://leetcode.com/username'
            }
            sx={{ mt: 1 }}
          />
          {isScraping && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">Importing data from {scrapingPlatform}...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScrapingDialog(false)} disabled={isScraping}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleScrapeData}
            disabled={!scrapingUrl || isScraping}
            startIcon={<Download size={16} />}
            sx={{ backgroundColor: '#6C47FF' }}
          >
            Import Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileSettingsNew;




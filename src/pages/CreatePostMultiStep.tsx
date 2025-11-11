import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  IconButton,
  Chip,
  Alert,
  Autocomplete,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { AVAILABLE_SKILLS, type SkillRequirement } from '../types';

const steps = ['Select Purpose', 'Add Skills', 'Opportunity Details'];

const CreatePostMultiStep: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  // Step 1: Purpose
  const [purpose, setPurpose] = useState<'Research Work' | 'Projects' | 'Hackathons' | ''>('');

  // Step 2: Skill Requirements
  const [skillRequirements, setSkillRequirements] = useState<SkillRequirement[]>([]);
  const [currentSkill, setCurrentSkill] = useState<string>('');
  const [currentCount, setCurrentCount] = useState<number>(1);

  // Step 3: Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  // Handle back
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!purpose) {
        newErrors.purpose = 'Please select a purpose';
      }
    } else if (step === 1) {
      if (skillRequirements.length === 0) {
        newErrors.skills = 'Please add at least one skill requirement';
      }
    } else if (step === 2) {
      if (!title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!description.trim()) {
        newErrors.description = 'Description is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add skill requirement
  const handleAddSkill = () => {
    if (!currentSkill) {
      setErrors({ ...errors, skill: 'Please select a skill' });
      return;
    }
    if (currentCount < 1) {
      setErrors({ ...errors, count: 'Count must be at least 1' });
      return;
    }

    // Check if skill already exists
    if (skillRequirements.some((req) => req.skill === currentSkill)) {
      setErrors({ ...errors, skill: 'This skill is already added' });
      return;
    }

    setSkillRequirements([
      ...skillRequirements,
      { skill: currentSkill, requiredCount: currentCount, acceptedCount: 0 },
    ]);
    setCurrentSkill('');
    setCurrentCount(1);
    setErrors({});
  };

  // Remove skill requirement
  const handleRemoveSkill = (skill: string) => {
    setSkillRequirements(skillRequirements.filter((req) => req.skill !== skill));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateStep(2)) return;

    // Create new post (in real app, this would be an API call)
    const newPost = {
      id: Date.now().toString(),
      title,
      description,
      purpose,
      skillRequirements,
      author: {
        id: user?.id || '',
        name: `${user?.firstName} ${user?.lastName}`,
        type: user?.role === 'student' ? 'student' as const : 'faculty' as const,
        avatar: user?.profilePicture || '',
      },
      createdAt: new Date().toISOString(),
      applications: [],
      status: 'open' as const,
      chatroomEnabled: false,
    };

    console.log('New post created:', newPost);

    // Show success message and navigate
    alert('Opportunity posted successfully!');
    navigate('/dashboard');
  };

  // Render step content
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: '#1A202C', fontWeight: 600 }}>
              What type of opportunity are you posting?
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(['Research Work', 'Projects', 'Hackathons'] as const).map((option) => (
                <Card
                  key={option}
                  onClick={() => setPurpose(option)}
                  sx={{
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: purpose === option ? '#663399' : '#E2E8F0',
                    backgroundColor: purpose === option ? '#F8F4FC' : '#FFFFFF',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#663399',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A202C', mb: 0.5 }}>
                        {option}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#71717A' }}>
                        {option === 'Research Work' &&
                          'Recruit students for academic research projects and papers'}
                        {option === 'Projects' &&
                          'Collaborate on practical projects with real-world applications'}
                        {option === 'Hackathons' && 'Form teams for competitive coding and innovation events'}
                      </Typography>
                    </Box>
                    {purpose === option && (
                      <CheckCircle sx={{ color: '#663399', fontSize: 32 }} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
            {errors.purpose && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.purpose}
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: '#1A202C', fontWeight: 600 }}>
              What skills are you looking for?
            </Typography>

            {/* Add Skill Form */}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                <Autocomplete
                  value={currentSkill}
                  onChange={(_, newValue) => setCurrentSkill(newValue || '')}
                  options={AVAILABLE_SKILLS}
                  sx={{ flex: 1 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Skill"
                      placeholder="Search skills..."
                      error={!!errors.skill}
                      helperText={errors.skill}
                    />
                  )}
                />
                <TextField
                  label="Required Count"
                  type="number"
                  value={currentCount}
                  onChange={(e) => setCurrentCount(Math.max(1, parseInt(e.target.value) || 1))}
                  sx={{ width: 150 }}
                  InputProps={{ inputProps: { min: 1 } }}
                  error={!!errors.count}
                  helperText={errors.count}
                />
                <Button
                  variant="contained"
                  onClick={handleAddSkill}
                  startIcon={<AddIcon />}
                  sx={{
                    backgroundColor: '#663399',
                    minHeight: 56,
                    px: 3,
                    '&:hover': {
                      backgroundColor: '#7C3BAD',
                    },
                  }}
                >
                  Add
                </Button>
              </Box>
            </Paper>

            {/* Skill Requirements List */}
            {skillRequirements.length > 0 ? (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, color: '#71717A' }}>
                  Added Skills ({skillRequirements.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {skillRequirements.map((req) => (
                    <Paper
                      key={req.skill}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={req.skill}
                          sx={{
                            backgroundColor: '#663399',
                            color: 'white',
                            fontWeight: 500,
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#71717A' }}>
                          Required: <strong>{req.requiredCount}</strong> candidate(s)
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => handleRemoveSkill(req.skill)}
                        size="small"
                        sx={{ color: '#EF4444' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  ))}
                </Box>
              </Box>
            ) : (
              <Alert severity="info">
                Add skills to specify what expertise you're looking for
              </Alert>
            )}

            {errors.skills && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.skills}
              </Alert>
            )}

            {/* Total Positions Summary */}
            {skillRequirements.length > 0 && (
              <Paper
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #10B981',
                }}
              >
                <Typography variant="body2" sx={{ color: '#065F46', fontWeight: 600 }}>
                  Total Positions: {skillRequirements.reduce((sum, req) => sum + req.requiredCount, 0)}
                </Typography>
              </Paper>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: '#1A202C', fontWeight: 600 }}>
              Tell us about your opportunity
            </Typography>

            {/* Summary of selections */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label={purpose}
                  sx={{
                    backgroundColor: '#663399',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
                {skillRequirements.slice(0, 3).map((req) => (
                  <Chip
                    key={req.skill}
                    label={`${req.skill} (${req.requiredCount})`}
                    variant="outlined"
                    sx={{ borderColor: '#663399', color: '#663399' }}
                  />
                ))}
                {skillRequirements.length > 3 && (
                  <Chip label={`+${skillRequirements.length - 3} more`} variant="outlined" />
                )}
              </Box>
            </Paper>

            <TextField
              fullWidth
              label="Opportunity Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., AI Research Assistant for Computer Vision Project"
              error={!!errors.title}
              helperText={errors.title}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              multiline
              rows={10}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the opportunity, expectations, timeline, and any other relevant information..."
              error={!!errors.description}
              helperText={errors.description}
            />

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Pro Tip:
              </Typography>
              <Typography variant="body2">
                Include details about the project timeline, required commitment, what students will learn,
                and any prerequisites or expectations.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 4, px: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2, color: '#663399' }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A202C', mb: 1 }}>
          Post an Opportunity
        </Typography>
        <Typography variant="body1" sx={{ color: '#71717A' }}>
          Create a new opportunity to connect with talented students
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  color: '#71717A',
                  fontWeight: 500,
                  '&.Mui-active': {
                    color: '#663399',
                    fontWeight: 600,
                  },
                  '&.Mui-completed': {
                    color: '#10B981',
                  },
                },
                '& .MuiStepIcon-root': {
                  color: '#CBD5E0',
                  '&.Mui-active': {
                    color: '#663399',
                  },
                  '&.Mui-completed': {
                    color: '#10B981',
                  },
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        {renderStepContent(activeStep)}
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack />}
          sx={{
            color: '#663399',
            '&:disabled': {
              color: '#CBD5E0',
            },
          }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
            sx={{
              borderColor: '#E2E8F0',
              color: '#71717A',
              '&:hover': {
                borderColor: '#CBD5E0',
                backgroundColor: '#F8FAFC',
              },
            }}
          >
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              endIcon={<CheckCircle />}
              sx={{
                backgroundColor: '#663399',
                px: 4,
                '&:hover': {
                  backgroundColor: '#7C3BAD',
                },
              }}
            >
              Post Opportunity
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
              sx={{
                backgroundColor: '#663399',
                '&:hover': {
                  backgroundColor: '#7C3BAD',
                },
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePostMultiStep;

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Avatar,
  IconButton,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Lock, Camera, Briefcase, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const Settings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [theme, setTheme] = useState('light');

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', formData);
    // TODO: Implement API call
  };

  const handleUpdatePassword = () => {
    console.log('Updating password');
    // TODO: Implement API call
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Back Button */}
      <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            sx={{
              py: 2,
              color: '#6B7280',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#111827',
              },
            }}
          >
            Back
          </Button>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pt: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
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
              <SettingsIcon size={28} color="#FFFFFF" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                Settings
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Manage your account preferences
              </Typography>
            </Box>
          </Stack>

          {/* Professional Profile Card - Link to ProfileSettings */}
          <Paper 
            sx={{ 
              p: 4, 
              mb: 3, 
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: 'linear-gradient(135deg, #6C47FF 0%, #5A3AD6 100%)',
              color: 'white',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(108, 71, 255, 0.4)',
              },
            }}
            onClick={() => navigate('/settings/profile')}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Briefcase size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Professional Profile
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Manage LinkedIn, GitHub, Portfolio & Resume for Easy Apply ⚡
                  </Typography>
                </Box>
              </Stack>
              <ChevronRight size={24} />
            </Stack>
          </Paper>

          {/* Profile Picture */}
          <Paper sx={{ p: 4, mb: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <User size={24} color="#6C47FF" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                Profile Picture
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={3}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    backgroundColor: '#6C47FF',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                  }}
                >
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #E5E7EB',
                    '&:hover': {
                      backgroundColor: '#F3F4F6',
                    },
                  }}
                  size="small"
                >
                  <Camera size={16} />
                </IconButton>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                  Upload a new profile picture
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    borderColor: '#6C47FF',
                    color: '#6C47FF',
                    '&:hover': {
                      borderColor: '#5A3AD6',
                      backgroundColor: '#F5F3FF',
                    },
                  }}
                >
                  Change Picture
                </Button>
              </Box>
            </Stack>
          </Paper>

          {/* Account Information */}
          <Paper sx={{ p: 4, mb: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <User size={24} color="#6C47FF" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                Account Information
              </Typography>
            </Stack>
            <Stack spacing={3}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Email"
                value={user?.email}
                fullWidth
                disabled
                helperText="Email cannot be changed"
              />
              <TextField
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Tell us about yourself..."
                fullWidth
              />
            </Stack>
            <Button
              variant="contained"
              onClick={handleSaveProfile}
              sx={{
                mt: 3,
                backgroundColor: '#6C47FF',
                textTransform: 'none',
                px: 4,
                '&:hover': {
                  backgroundColor: '#5A3AD6',
                },
              }}
            >
              Save Changes
            </Button>
          </Paper>

          {/* Notifications */}
          <Paper sx={{ p: 4, mb: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Bell size={24} color="#6C47FF" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                Notifications
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#6C47FF',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#6C47FF',
                      },
                    }}
                  />
                }
                label="Email Notifications"
              />
              <Typography variant="body2" sx={{ color: '#6B7280', ml: 6 }}>
                Receive email updates about your applications and activities
              </Typography>

              <Divider />

              <FormControlLabel
                control={
                  <Switch
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#6C47FF',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#6C47FF',
                      },
                    }}
                  />
                }
                label="Push Notifications"
              />
              <Typography variant="body2" sx={{ color: '#6B7280', ml: 6 }}>
                Get instant notifications on your device
              </Typography>

              <Divider />

              <FormControlLabel
                control={
                  <Switch
                    checked={chatNotifications}
                    onChange={(e) => setChatNotifications(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#6C47FF',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#6C47FF',
                      },
                    }}
                  />
                }
                label="Chat Notifications"
              />
              <Typography variant="body2" sx={{ color: '#6B7280', ml: 6 }}>
                Receive notifications for new chat messages
              </Typography>
            </Stack>
          </Paper>

          {/* Privacy */}
          <Paper sx={{ p: 4, mb: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Lock size={24} color="#6C47FF" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                Privacy
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#6C47FF',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#6C47FF',
                      },
                    }}
                  />
                }
                label="Public Profile"
              />
              <Typography variant="body2" sx={{ color: '#6B7280', ml: 6 }}>
                Make your profile visible to other users
              </Typography>
            </Stack>
          </Paper>

          {/* Appearance */}
          <Paper sx={{ p: 4, mb: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <SettingsIcon size={24} color="#6C47FF" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                Appearance
              </Typography>
            </Stack>
            <TextField
              select
              label="Theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              fullWidth
            >
              <MenuItem value="light">Light Theme</MenuItem>
              <MenuItem value="dark">Dark Theme</MenuItem>
              <MenuItem value="system">System Default</MenuItem>
            </TextField>
          </Paper>

          {/* Change Password */}
          <Paper sx={{ p: 4, mb: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Lock size={24} color="#6C47FF" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                Change Password
              </Typography>
            </Stack>
            <Stack spacing={3}>
              <TextField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
            <Button
              variant="contained"
              onClick={handleUpdatePassword}
              sx={{
                mt: 3,
                backgroundColor: '#6C47FF',
                textTransform: 'none',
                px: 4,
                '&:hover': {
                  backgroundColor: '#5A3AD6',
                },
              }}
            >
              Update Password
            </Button>
          </Paper>

          {/* Danger Zone */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 2,
              border: '2px solid #FEE2E2',
              backgroundColor: '#FEF2F2',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#DC2626', mb: 2 }}>
              Danger Zone
            </Typography>
            <Typography variant="body2" sx={{ color: '#991B1B', mb: 3 }}>
              Once you delete your account, there is no going back. Please be certain.
            </Typography>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#DC2626',
                color: '#DC2626',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#991B1B',
                  backgroundColor: '#FEE2E2',
                },
              }}
            >
              Delete Account
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Settings;
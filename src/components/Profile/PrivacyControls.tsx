import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
  Divider,
  Alert,
  FormControl,
} from '@mui/material';
import { Shield, Eye, EyeOff, Save, X } from 'lucide-react';

interface PrivacyControlsProps {
  open: boolean;
  onClose: () => void;
}

interface PrivacySettings {
  profileVisibility: 'everyone' | 'collaborators' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showProjects: boolean;
  showAchievements: boolean;
  showSkills: boolean;
  showResume: boolean;
}

const PrivacyControls: React.FC<PrivacyControlsProps> = ({ open, onClose }) => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'everyone',
    showEmail: true,
    showPhone: false,
    showProjects: true,
    showAchievements: true,
    showSkills: true,
    showResume: false,
  });

  const handleSave = () => {
    // TODO: Implement API call to save privacy settings
    console.log('Saving privacy settings:', settings);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Shield size={20} color="#6C47FF" />
            <Typography variant="h6">Privacy Controls</Typography>
          </Stack>
          <X size={20} style={{ cursor: 'pointer' }} onClick={onClose} />
        </Stack>
      </DialogTitle>
      <DialogContent>
        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Privacy settings saved successfully!
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Profile Visibility */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Who can view your profile?
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={settings.profileVisibility}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profileVisibility: e.target.value as PrivacySettings['profileVisibility'],
                  })
                }
              >
                <FormControlLabel
                  value="everyone"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Everyone
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Anyone on the platform can view your profile
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="collaborators"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Only Collaborators
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Only people you've worked with can see your profile
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="private"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Private
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Only you can view your complete profile
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Divider />

          {/* Individual Field Visibility */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Show or hide specific information
            </Typography>
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showEmail}
                    onChange={(e) => setSettings({ ...settings, showEmail: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2">Email Address</Typography>
                    {settings.showEmail ? (
                      <Eye size={14} color="#10B981" />
                    ) : (
                      <EyeOff size={14} color="#6B7280" />
                    )}
                  </Stack>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showPhone}
                    onChange={(e) => setSettings({ ...settings, showPhone: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2">Phone Number</Typography>
                    {settings.showPhone ? (
                      <Eye size={14} color="#10B981" />
                    ) : (
                      <EyeOff size={14} color="#6B7280" />
                    )}
                  </Stack>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showProjects}
                    onChange={(e) => setSettings({ ...settings, showProjects: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2">Projects</Typography>
                    {settings.showProjects ? (
                      <Eye size={14} color="#10B981" />
                    ) : (
                      <EyeOff size={14} color="#6B7280" />
                    )}
                  </Stack>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showAchievements}
                    onChange={(e) => setSettings({ ...settings, showAchievements: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2">Achievements & Awards</Typography>
                    {settings.showAchievements ? (
                      <Eye size={14} color="#10B981" />
                    ) : (
                      <EyeOff size={14} color="#6B7280" />
                    )}
                  </Stack>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showSkills}
                    onChange={(e) => setSettings({ ...settings, showSkills: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2">Skills</Typography>
                    {settings.showSkills ? (
                      <Eye size={14} color="#10B981" />
                    ) : (
                      <EyeOff size={14} color="#6B7280" />
                    )}
                  </Stack>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showResume}
                    onChange={(e) => setSettings({ ...settings, showResume: e.target.checked })}
                    color="primary"
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2">Resume/CV</Typography>
                    {settings.showResume ? (
                      <Eye size={14} color="#10B981" />
                    ) : (
                      <EyeOff size={14} color="#6B7280" />
                    )}
                  </Stack>
                }
              />
            </Stack>
          </Box>

          {/* Privacy Tip */}
          <Alert severity="info" icon={<Shield size={16} />}>
            <Typography variant="caption">
              <strong>Tip:</strong> Keeping your profile visible helps you connect with potential collaborators
              and opportunities.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<Save size={16} />}
          sx={{
            backgroundColor: '#6C47FF',
            '&:hover': { backgroundColor: '#5A3AD6' },
          }}
        >
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrivacyControls;

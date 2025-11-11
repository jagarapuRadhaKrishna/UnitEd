import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
  Stack,
  TextField,
  Alert,
  Typography,
} from '@mui/material';
import { Save, X, Plus } from 'lucide-react';
import { AVAILABLE_SKILLS } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface QuickSkillEditProps {
  open: boolean;
  onClose: () => void;
}

const QuickSkillEdit: React.FC<QuickSkillEditProps> = ({ open, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [saved, setSaved] = useState(false);
  const [customSkill, setCustomSkill] = useState('');

  const handleSave = async () => {
    try {
      await updateProfile({ skills });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving skills:', error);
    }
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Quick Edit Skills</Typography>
          <X size={20} style={{ cursor: 'pointer' }} onClick={onClose} />
        </Stack>
      </DialogTitle>
      <DialogContent>
        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Skills updated successfully!
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Current Skills */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Current Skills ({skills.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {skills.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  No skills added yet
                </Typography>
              ) : (
                skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    sx={{ backgroundColor: '#F3F4F6' }}
                  />
                ))
              )}
            </Box>
          </Box>

          {/* Add from Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Add Skills from List</InputLabel>
            <Select
              multiple
              value={skills}
              onChange={(e) => setSkills(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              input={<OutlinedInput label="Add Skills from List" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {AVAILABLE_SKILLS.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Add Custom Skill */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Add Custom Skill
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter a custom skill"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCustomSkill();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddCustomSkill}
                startIcon={<Plus size={16} />}
              >
                Add
              </Button>
            </Stack>
          </Box>
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
          Save Skills
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickSkillEdit;

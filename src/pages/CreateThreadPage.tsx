import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { usePalette } from '@/hooks/usePalette';

const categories = ['Technical', 'Collaboration', 'General', 'Career'];

const CreateThreadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { colors } = usePalette();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !category) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    if (!user?.id) return;

    setSubmitting(true);
    const { error } = await supabase.from('forum_threads').insert({
      title: title.trim(),
      content: content.trim(),
      category,
      author_id: user.id,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Thread created!', description: 'Your discussion thread has been posted.' });
    navigate('/forums');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.bg }}>
      <Container maxWidth="md" sx={{ py: 3.5 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/forums')}
          startIcon={<ArrowLeft size={16} />}
          sx={{
            mb: 2.5,
            borderColor: colors.border,
            color: colors.heading,
            textTransform: 'none',
            '&:hover': { borderColor: colors.accent, color: colors.accent, backgroundColor: colors.card },
          }}
        >
          Back to Forums
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.heading, mb: 2.2 }}>
            Create New Thread
          </Typography>

          <Card sx={{ borderRadius: '12px', border: `1px solid ${colors.border}`, boxShadow: 'none', backgroundColor: colors.card }}>
            <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
              <Stack spacing={2.5}>
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your discussion about?"
                  fullWidth
                  InputLabelProps={{ sx: { color: colors.subtext } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: colors.inputBg,
                      color: colors.heading,
                      '& fieldset': { borderColor: colors.inputBorder },
                      '&:hover fieldset': { borderColor: colors.accent },
                      '&.Mui-focused fieldset': { borderColor: colors.accent },
                    },
                    '& .MuiInputBase-input::placeholder': { color: colors.subtext, opacity: 1 },
                    '& .MuiInputLabel-root': { color: colors.subtext },
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ color: colors.subtext }}>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{
                      backgroundColor: colors.inputBg,
                      color: colors.heading,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.inputBorder },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.accent },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.accent },
                      '& .MuiSvgIcon-root': { color: colors.subtext },
                    }}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe your topic in detail..."
                  fullWidth
                  multiline
                  minRows={8}
                  InputLabelProps={{ sx: { color: colors.subtext } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: colors.inputBg,
                      color: colors.heading,
                      '& fieldset': { borderColor: colors.inputBorder },
                      '&:hover fieldset': { borderColor: colors.accent },
                      '&.Mui-focused fieldset': { borderColor: colors.accent },
                    },
                    '& .MuiInputBase-input::placeholder': { color: colors.subtext, opacity: 1 },
                  }}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.3} justifyContent="flex-end" sx={{ pt: 0.2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/forums')}
                    sx={{
                      borderColor: colors.border,
                      color: colors.heading,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    sx={{
                      backgroundColor: colors.accent,
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 150,
                      '&:hover': { backgroundColor: colors.accentHover },
                    }}
                  >
                    {submitting ? 'Creating...' : 'Create Thread'}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CreateThreadPage;

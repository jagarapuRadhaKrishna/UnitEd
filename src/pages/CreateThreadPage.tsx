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

const categories = ['Technical', 'Collaboration', 'General', 'Career'];

const CreateThreadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="md" sx={{ py: 3.5 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/forums')}
          startIcon={<ArrowLeft size={16} />}
          sx={{
            mb: 2.5,
            borderColor: '#E5E7EB',
            color: '#6B7280',
            textTransform: 'none',
            '&:hover': { borderColor: '#6C47FF', color: '#6C47FF', backgroundColor: '#F9FAFB' },
          }}
        >
          Back to Forums
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 2.2 }}>
            Create New Thread
          </Typography>

          <Card sx={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'none' }}>
            <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
              <Stack spacing={2.5}>
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your discussion about?"
                  fullWidth
                />

                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
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
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.3} justifyContent="flex-end" sx={{ pt: 0.2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/forums')}
                    sx={{
                      borderColor: '#D1D5DB',
                      color: '#6B7280',
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
                      backgroundColor: '#6C47FF',
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 150,
                      '&:hover': { backgroundColor: '#5936E8' },
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

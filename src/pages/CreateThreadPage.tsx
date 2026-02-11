import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate('/forums')} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Forums
      </Button>

      <h1 className="text-2xl font-bold mb-6">Create New Thread</h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="What's your discussion about?" className="mt-1" />
          </div>

          <div>
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Content *</Label>
            <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Describe your topic in detail..." className="mt-1" rows={6} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => navigate('/forums')}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="bg-primary">
              {submitting ? 'Creating...' : 'Create Thread'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateThreadPage;

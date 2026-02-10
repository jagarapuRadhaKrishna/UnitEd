import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, X } from 'lucide-react';

const categories = ['Technical', 'Collaboration', 'General', 'Career'];

const CreateThreadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !category) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
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

          <div>
            <Label>Tags (up to 5)</Label>
            <div className="flex gap-2 mt-1">
              <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add a tag" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
              <Button type="button" variant="outline" onClick={addTag}><Plus className="w-4 h-4" /></Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map(t => (
                  <Badge key={t} variant="secondary" className="gap-1">
                    {t} <button onClick={() => setTags(prev => prev.filter(x => x !== t))}><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => navigate('/forums')}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-primary">Create Thread</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateThreadPage;

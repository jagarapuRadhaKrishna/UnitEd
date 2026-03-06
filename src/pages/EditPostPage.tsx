import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AVAILABLE_SKILLS, type SkillRequirement } from '@/types/united';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [purpose, setPurpose] = useState<'Research Work' | 'Projects' | 'Hackathons' | ''>('');
  const [skillRequirements, setSkillRequirements] = useState<SkillRequirement[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentCount, setCurrentCount] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const descEditorRef = useRef<HTMLDivElement>(null);

  const normalizeRequirements = (reqs: any[]): SkillRequirement[] =>
    (reqs || []).map((r) => ({
      skills: r.skills || (r.skill ? [r.skill] : []),
      requiredCount: r.requiredCount || 1,
      acceptedCount: r.acceptedCount || 0,
    }));

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        toast({ title: 'Error', description: 'Post not found', variant: 'destructive' });
        navigate('/home', { state: { activeTab: 'my' } });
        return;
      }

      if (data.author_id !== user?.id) {
        toast({ title: 'Unauthorized', description: 'You can only edit your own posts', variant: 'destructive' });
        navigate('/home', { state: { activeTab: 'my' } });
        return;
      }

      setTitle(data.title);
      setDescription(data.description);
      setPurpose(data.purpose as any);
      setSkillRequirements(normalizeRequirements(data.skill_requirements as any[]));
      setLoading(false);
    };
    fetchPost();
  }, [id, user?.id]);

  const filteredSkills = AVAILABLE_SKILLS.filter((s) => {
    const alreadyUsed = skillRequirements.some((r) => (r.skills || (r.skill ? [r.skill] : [])).some(rs => rs.toLowerCase() === s.toLowerCase()));
    return s.toLowerCase().includes(skillSearch.toLowerCase()) && !alreadyUsed;
  });

  const handleAddSkill = () => {
    const rawInput = (skillSearch || currentSkill).trim();
    if (!rawInput) { setErrors({ ...errors, skill: 'Select at least one skill' }); return; }

    const parts = rawInput.split(/[,+]/).map(p => p.trim()).filter(Boolean);
    const resolved = parts.map(p => AVAILABLE_SKILLS.find(s => s.toLowerCase() === p.toLowerCase()) || '');
    if (resolved.some(s => !s)) { setErrors({ ...errors, skill: 'Select a valid skill from the list' }); return; }

    const uniqueSkills = Array.from(new Set(resolved));
    const bundleExists = skillRequirements.some(r => {
      const reqSkills = r.skills || (r.skill ? [r.skill] : []);
      return reqSkills.length === uniqueSkills.length && reqSkills.every(s => uniqueSkills.includes(s));
    });
    if (bundleExists) { setErrors({ ...errors, skill: 'This skill bundle is already added' }); return; }

    setSkillRequirements([...skillRequirements, { skills: uniqueSkills, requiredCount: Math.max(1, currentCount), acceptedCount: 0 }]);
    setCurrentSkill('');
    setSkillSearch('');
    setCurrentCount(1);
    setErrors({});
  };

  const handleSubmit = async () => {
    const e: Record<string, string> = {};
    if (!purpose) e.purpose = 'Purpose is required';
    if (skillRequirements.length === 0) e.skills = 'Add at least one skill';
    if (!title.trim()) e.title = 'Title is required';
    if (!(descEditorRef.current?.innerHTML || description).trim()) e.description = 'Description is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    const totalMembers = skillRequirements.reduce((s, r) => s + r.requiredCount, 0);

    const { error } = await supabase
      .from('posts')
      .update({
        title,
        description: (descEditorRef.current?.innerHTML || description || '').trim(),
        purpose: purpose as string,
        skill_requirements: skillRequirements as unknown as import('@/integrations/supabase/types').Json,
        max_members: totalMembers,
      })
      .eq('id', id!);

    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Updated!', description: 'Post updated successfully.' });
    navigate(`/post/${id}`);
  };

  const purposeOptions = [
    { value: 'Research Work' as const, desc: 'Academic research projects and papers' },
    { value: 'Projects' as const, desc: 'Practical projects with real-world applications' },
    { value: 'Hackathons' as const, desc: 'Competitive coding and innovation events' },
  ];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/home', { state: { activeTab: 'my' } })} className="mb-2 text-accent">
          <ArrowLeft size={18} className="mr-1" /> Back to My Posts
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Edit Post</h1>
        <p className="text-muted-foreground text-sm">Update your opportunity details</p>
      </div>

      {/* Purpose */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Purpose</h2>
          <div className="space-y-2">
            {purposeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPurpose(opt.value)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  purpose === opt.value ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{opt.value}</h3>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  {purpose === opt.value && <CheckCircle size={20} className="text-accent" />}
                </div>
              </button>
            ))}
          </div>
          {errors.purpose && <p className="text-destructive text-xs mt-2">{errors.purpose}</p>}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Skills Required</h2>
          <div className="flex gap-2 items-start mb-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Search skills..."
                value={skillSearch || currentSkill}
                onChange={e => { setSkillSearch(e.target.value); setCurrentSkill(''); setShowSkillDropdown(true); }}
                onFocus={() => setShowSkillDropdown(true)}
              />
              {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSkills.slice(0, 10).map(skill => (
                    <button
                      key={skill}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => { setCurrentSkill(skill); setSkillSearch(skill); setShowSkillDropdown(false); }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Input type="number" min={1} value={currentCount} onChange={e => setCurrentCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-24" />
            <Button onClick={handleAddSkill} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
          {errors.skill && <p className="text-destructive text-xs mb-2">{errors.skill}</p>}

          {skillRequirements.length > 0 && (
            <div className="space-y-2">
              {skillRequirements.map((req, idx) => {
                const reqSkills = req.skills || (req.skill ? [req.skill] : []);
                const label = reqSkills.join(' + ');
                return (
                <div key={`${label}-${idx}`} className="flex items-center justify-between p-2 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-accent text-accent-foreground text-xs">{label}</Badge>
                    <span className="text-xs text-muted-foreground">� {req.requiredCount}</span>
                  </div>
                  <button onClick={() => setSkillRequirements(skillRequirements.filter((_, i) => i !== idx))} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
                );
              })}
              <p className="text-xs text-muted-foreground">
                Total positions: {skillRequirements.reduce((s, r) => s + r.requiredCount, 0)}
              </p>
            </div>
          )}
          {errors.skills && <p className="text-destructive text-xs mt-2">{errors.skills}</p>}
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="mb-6">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Details</h2>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="mt-1" />
            {errors.title && <p className="text-destructive text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <Label>Description</Label>
            <div className="rounded-lg border border-border bg-background">
              <div className="flex flex-wrap items-center gap-2 px-2 py-1 border-b border-border text-sm text-foreground/80">
                <button type="button" onClick={() => document.execCommand('bold')} className="font-bold">B</button>
                <button type="button" onClick={() => document.execCommand('italic')} className="italic">I</button>
                <button type="button" onClick={() => document.execCommand('underline')} className="underline">U</button>
                <button type="button" onClick={() => document.execCommand('strikeThrough')} className="line-through">S</button>
                <span className="mx-1 text-border">|</span>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Enter URL');
                    if (url) document.execCommand('createLink', false, url);
                  }}
                  aria-label="link"
                >
                  🔗
                </button>
                <span className="mx-1 text-border">|</span>
                <button type="button" onClick={() => document.execCommand('insertOrderedList')}>1.</button>
                <button type="button" onClick={() => document.execCommand('insertUnorderedList')}>•</button>
                <span className="mx-1 text-border">|</span>
                <button type="button" onClick={() => document.execCommand('justifyLeft')}>L</button>
                <button type="button" onClick={() => document.execCommand('justifyCenter')}>C</button>
                <button type="button" onClick={() => document.execCommand('justifyRight')}>R</button>
              </div>
              <div
                ref={descEditorRef}
                className="min-h-[160px] px-3 py-2 text-foreground focus:outline-none whitespace-pre-wrap"
                contentEditable
                onInput={(e) => setDescription((e.target as HTMLDivElement).innerHTML)}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
            {errors.description && <p className="text-destructive text-xs mt-1">{errors.description}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/home', { state: { activeTab: 'my' } })}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="bg-accent hover:bg-accent/90 text-accent-foreground px-6">
          <Save size={16} className="mr-1" /> {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default EditPostPage;



import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, CheckCircle, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AVAILABLE_SKILLS, type SkillRequirement } from '@/types/united';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getLocalDateKey } from '@/services/postAvailabilityService';
import PostDescriptionEditor from '@/components/editor/PostDescriptionEditor';
import { toDescriptionEditorHtml, validateDescriptionHtml } from '@/lib/post-description';

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
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const normalizeRequirements = (requirements: any[]): SkillRequirement[] =>
    (requirements || []).map((requirement) => ({
      skills: requirement.skills || (requirement.skill ? [requirement.skill] : []),
      requiredCount: requirement.requiredCount || 1,
      acceptedCount: requirement.acceptedCount || 0,
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
      setDescription(toDescriptionEditorHtml(data.description));
      setPurpose(data.purpose as 'Research Work' | 'Projects' | 'Hackathons' | '');
      setDeadline(data.deadline || '');
      setSkillRequirements(normalizeRequirements(data.skill_requirements as any[]));
      setLoading(false);
    };

    fetchPost();
  }, [id, navigate, toast, user?.id]);

  const filteredSkills = AVAILABLE_SKILLS.filter((skill) => {
    const alreadyUsed = skillRequirements.some((requirement) => {
      const requirementSkills = requirement.skills || (requirement.skill ? [requirement.skill] : []);
      return requirementSkills.some((existing) => existing.toLowerCase() === skill.toLowerCase());
    });
    return skill.toLowerCase().includes(skillSearch.toLowerCase()) && !alreadyUsed;
  });

  const handleAddSkill = () => {
    const rawInput = (skillSearch || currentSkill).trim();
    if (!rawInput) {
      setErrors({ ...errors, skill: 'Select at least one skill' });
      return;
    }

    const parts = rawInput.split(/[,+]/).map((part) => part.trim()).filter(Boolean);
    const resolved: string[] = parts.map(
      (part) => AVAILABLE_SKILLS.find((skill) => skill.toLowerCase() === part.toLowerCase()) ?? ''
    );
    if (resolved.some((skill) => !skill)) {
      setErrors({ ...errors, skill: 'Select a valid skill from the list' });
      return;
    }

    const uniqueSkills: string[] = Array.from(new Set(resolved.filter(Boolean)));
    const bundleExists = skillRequirements.some((requirement) => {
      const requirementSkills = requirement.skills || (requirement.skill ? [requirement.skill] : []);
      return requirementSkills.length === uniqueSkills.length && requirementSkills.every((skill) => uniqueSkills.includes(skill));
    });
    if (bundleExists) {
      setErrors({ ...errors, skill: 'This skill bundle is already added' });
      return;
    }

    setSkillRequirements([
      ...skillRequirements,
      { skills: uniqueSkills, requiredCount: Math.max(1, currentCount), acceptedCount: 0 },
    ]);
    setCurrentSkill('');
    setSkillSearch('');
    setCurrentCount(1);
    setErrors({});
  };

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!purpose) nextErrors.purpose = 'Purpose is required';
    if (skillRequirements.length === 0) nextErrors.skills = 'Add at least one skill';
    if (!title.trim()) nextErrors.title = 'Title is required';
    const descriptionError = validateDescriptionHtml(description);
    if (descriptionError) nextErrors.description = descriptionError;
    if (deadline && deadline < getLocalDateKey()) {
      nextErrors.deadline = 'Deadline cannot be before today. The post stays available through the selected date.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const totalMembers = skillRequirements.reduce((sum, requirement) => sum + requirement.requiredCount, 0);

    const { error } = await supabase
      .from('posts')
      .update({
        title,
        description,
        purpose: purpose as string,
        skill_requirements: skillRequirements as unknown as import('@/integrations/supabase/types').Json,
        max_members: totalMembers,
        deadline: deadline || null,
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

      <Card className="mb-4">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Purpose</h2>
          <div className="space-y-2">
            {purposeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPurpose(option.value)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  purpose === option.value ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{option.value}</h3>
                    <p className="text-xs text-muted-foreground">{option.desc}</p>
                  </div>
                  {purpose === option.value && <CheckCircle size={20} className="text-accent" />}
                </div>
              </button>
            ))}
          </div>
          {errors.purpose && <p className="text-destructive text-xs mt-2">{errors.purpose}</p>}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Skills Required</h2>
          <div className="flex gap-2 items-start mb-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Search skills..."
                value={skillSearch || currentSkill}
                onChange={event => {
                  setSkillSearch(event.target.value);
                  setCurrentSkill('');
                  setShowSkillDropdown(true);
                }}
                onFocus={() => setShowSkillDropdown(true)}
              />
              {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSkills.slice(0, 10).map((skill) => (
                    <button
                      key={skill}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => {
                        setCurrentSkill(skill);
                        setSkillSearch(skill);
                        setShowSkillDropdown(false);
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Input
              type="number"
              min={1}
              value={currentCount}
              onChange={event => setCurrentCount(Math.max(1, parseInt(event.target.value, 10) || 1))}
              className="w-24"
            />
            <Button onClick={handleAddSkill} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
          {errors.skill && <p className="text-destructive text-xs mb-2">{errors.skill}</p>}

          {skillRequirements.length > 0 && (
            <div className="space-y-2">
              {skillRequirements.map((requirement, index) => {
                const requirementSkills = requirement.skills || (requirement.skill ? [requirement.skill] : []);
                const label = requirementSkills.join(' + ');
                return (
                  <div key={`${label}-${index}`} className="flex items-center justify-between p-2 rounded-lg border border-border">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-accent text-accent-foreground text-xs">{label}</Badge>
                      <span className="text-xs text-muted-foreground">Required: {requirement.requiredCount}</span>
                    </div>
                    <button
                      onClick={() => setSkillRequirements(skillRequirements.filter((_, entryIndex) => entryIndex !== index))}
                      className="text-destructive hover:bg-destructive/10 p-1 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground">
                Total positions: {skillRequirements.reduce((sum, requirement) => sum + requirement.requiredCount, 0)}
              </p>
            </div>
          )}
          {errors.skills && <p className="text-destructive text-xs mt-2">{errors.skills}</p>}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Details</h2>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={event => setTitle(event.target.value)} className="mt-1" />
            {errors.title && <p className="text-destructive text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Input
              type="date"
              value={deadline}
              min={getLocalDateKey()}
              onChange={event => setDeadline(event.target.value)}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-muted-foreground">The post stays available through the selected date and becomes unavailable after it.</p>
            {errors.deadline && <p className="text-destructive text-xs mt-1">{errors.deadline}</p>}
          </div>
          <div>
            <Label>Description</Label>
            <div className="mt-1">
              <PostDescriptionEditor
              value={description}
                onChange={(nextValue) => {
                  setDescription(nextValue);
                  setErrors((prev) => {
                    const { description: _description, ...rest } = prev;
                    return rest;
                  });
                }}
                placeholder="Describe the opportunity, responsibilities, skills required, and any important details."
                error={errors.description}
                autoFocus
              />
            </div>
          </div>
        </CardContent>
      </Card>

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

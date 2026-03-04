import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
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
import { AnimatePresence, motion, type Variants } from 'framer-motion';

const steps = ['Select Purpose', 'Add Skills', 'Opportunity Details'];

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [purpose, setPurpose] = useState<'Research Work' | 'Projects' | 'Hackathons' | ''>('');
  const [skillRequirements, setSkillRequirements] = useState<SkillRequirement[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentCount, setCurrentCount] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const skillPickerRef = useRef<HTMLDivElement>(null);

  const filteredSkills = AVAILABLE_SKILLS.filter(
    s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !skillRequirements.some(r => r.skill === s)
  );

  const validateStep = (step: number) => {
    const e: Record<string, string> = {};
    if (step === 0 && !purpose) e.purpose = 'Please select a purpose';
    if (step === 1 && skillRequirements.length === 0) e.skills = 'Add at least one skill';
    if (step === 2) {
      if (!title.trim()) e.title = 'Title is required';
      if (!description.trim()) e.description = 'Description is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const handleAddSkill = () => {
    const normalizedInput = skillSearch.trim().toLowerCase();
    const selectedSkill =
      currentSkill ||
      AVAILABLE_SKILLS.find((s) => s.toLowerCase() === normalizedInput) ||
      '';

    if (!selectedSkill) {
      setErrors((prev) => ({ ...prev, skill: 'Select a valid skill from the list' }));
      return;
    }
    if (skillRequirements.some((r) => r.skill === selectedSkill)) {
      setErrors((prev) => ({ ...prev, skill: 'Already added' }));
      return;
    }

    setSkillRequirements([
      ...skillRequirements,
      { skill: selectedSkill, requiredCount: Math.max(1, currentCount), acceptedCount: 0 },
    ]);
    setCurrentSkill('');
    setSkillSearch('');
    setCurrentCount(1);
    setShowSkillDropdown(false);
    setErrors((prev) => {
      const { skill, skills, ...rest } = prev;
      return rest;
    });
  };

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skillPickerRef.current && !skillPickerRef.current.contains(event.target as Node)) {
        setShowSkillDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateStep(2)) return;
    if (!user?.id) {
      toast({ title: 'Error', description: 'Please login again and retry.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const totalMembers = skillRequirements.reduce((s, r) => s + r.requiredCount, 0);
      const { error } = await supabase.from('posts').insert({
        title: title.trim(),
        description: description.trim(),
        purpose: purpose as string,
        skill_requirements: skillRequirements as unknown as import('@/integrations/supabase/types').Json,
        author_id: user.id,
        max_members: totalMembers,
        status: 'active',
      });

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }

      toast({ title: 'Success!', description: 'Opportunity posted successfully.' });
      navigate('/home');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to post opportunity';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const purposeOptions = [
    { value: 'Research Work' as const, desc: 'Recruit students for academic research projects and papers' },
    { value: 'Projects' as const, desc: 'Collaborate on practical projects with real-world applications' },
    { value: 'Hackathons' as const, desc: 'Form teams for competitive coding and innovation events' },
  ];

  const createPostEase: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

  const createPostSectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: createPostEase,
      },
    },
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto py-6 px-4"
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div className="mb-6" variants={createPostSectionVariants}>
        <Button variant="ghost" onClick={() => navigate('/home')} className="mb-2 text-accent">
          <ArrowLeft size={18} className="mr-1" /> Back to Home
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Post an Opportunity</h1>
        <p className="text-muted-foreground text-sm">Create a new opportunity to connect with talented students</p>
      </motion.div>

      {/* Stepper */}
      <motion.div className="flex items-center mb-6" variants={createPostSectionVariants}>
        {steps.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                i < activeStep ? 'bg-united-green text-primary-foreground' : i === activeStep ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i < activeStep ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${i === activeStep ? 'text-accent font-semibold' : i < activeStep ? 'text-united-green' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < activeStep ? 'bg-united-green' : 'bg-border'}`} />}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Step Content */}
      <motion.div variants={createPostSectionVariants}>
        <Card className="mb-6">
          <CardContent className="p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease: createPostEase }}
              >
          {activeStep === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">What type of opportunity are you posting?</h2>
              <div className="space-y-3">
                {purposeOptions.map(opt => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => {
                      setPurpose(opt.value);
                      setErrors((prev) => ({ ...prev, purpose: '' }));
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      purpose === opt.value ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-foreground">{opt.value}</h3>
                        <p className="text-sm text-muted-foreground">{opt.desc}</p>
                      </div>
                      {purpose === opt.value && <CheckCircle size={24} className="text-accent" />}
                    </div>
                  </button>
                ))}
              </div>
              {errors.purpose && (
                <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle size={16} /> {errors.purpose}
                </div>
              )}
            </div>
          )}

          {activeStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">What skills are you looking for?</h2>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-4">
                <div className="flex gap-2 items-start">
                  <div className="flex-1 relative" ref={skillPickerRef}>
                    <Input
                      placeholder="Search skills..."
                      value={skillSearch || currentSkill}
                      onChange={(e) => {
                        setSkillSearch(e.target.value);
                        setCurrentSkill('');
                        setShowSkillDropdown(true);
                      }}
                      onFocus={() => setShowSkillDropdown(true)}
                    />
                    {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredSkills.slice(0, 10).map(skill => (
                          <button
                            type="button"
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
                    onChange={e => setCurrentCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32"
                    placeholder="Count"
                  />
                  <Button onClick={handleAddSkill} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Plus size={16} className="mr-1" /> Add
                  </Button>
                </div>
                {errors.skill && <p className="text-destructive text-xs mt-1">{errors.skill}</p>}
              </div>

              {skillRequirements.length > 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Added Skills ({skillRequirements.length})</p>
                  <div className="space-y-2">
                    {skillRequirements.map(req => (
                      <div key={req.skill} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-accent text-accent-foreground">{req.skill}</Badge>
                          <span className="text-sm text-muted-foreground">Required: <strong>{req.requiredCount}</strong> candidate(s)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSkillRequirements(skillRequirements.filter(r => r.skill !== req.skill))}
                          className="text-destructive hover:bg-destructive/10 p-1 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-united-green/10 border border-united-green/30">
                    <p className="text-sm text-united-green font-semibold">
                      Total Positions: {skillRequirements.reduce((s, r) => s + r.requiredCount, 0)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-primary">
                  Add skills to specify what expertise you're looking for
                </div>
              )}
              {errors.skills && (
                <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle size={16} /> {errors.skills}
                </div>
              )}
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Tell us about your opportunity</h2>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-secondary/50 border border-border mb-4">
                <Badge className="bg-accent text-accent-foreground">{purpose}</Badge>
                {skillRequirements.slice(0, 3).map(r => (
                  <Badge key={r.skill} variant="outline" className="border-accent text-accent">{r.skill} ({r.requiredCount})</Badge>
                ))}
                {skillRequirements.length > 3 && <Badge variant="outline">+{skillRequirements.length - 3} more</Badge>}
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Opportunity Title</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., AI Research Assistant for Computer Vision Project" className="mt-1" />
                  {errors.title && <p className="text-destructive text-xs mt-1">{errors.title}</p>}
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={8} value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide a detailed description..." className="mt-1" />
                  {errors.description && <p className="text-destructive text-xs mt-1">{errors.description}</p>}
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                  <p className="font-semibold text-primary mb-0.5">Pro Tip:</p>
                  <p className="text-muted-foreground">Include details about the timeline, commitment, what students will learn, and prerequisites.</p>
                </div>
              </div>
            </div>
          )}
              </motion.div>
            </AnimatePresence>
        </CardContent>
      </Card>
      </motion.div>

      {/* Navigation */}
      <motion.div className="flex justify-between" variants={createPostSectionVariants}>
        <Button variant="ghost" disabled={activeStep === 0} onClick={handleBack} className="text-accent disabled:text-muted-foreground">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/home')}>Cancel</Button>
          {activeStep === steps.length - 1 ? (
            <Button onClick={handleSubmit} disabled={submitting} className="bg-accent hover:bg-accent/90 text-accent-foreground px-6">
              <CheckCircle size={16} className="mr-1" /> {submitting ? 'Posting...' : 'Post Opportunity'}
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Next <ArrowRight size={16} className="ml-1" />
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreatePostPage;

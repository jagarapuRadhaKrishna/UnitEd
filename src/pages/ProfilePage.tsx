import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit, Save, X, MapPin, Mail, Phone, Briefcase, GraduationCap,
  Award, ExternalLink, Plus, Trash2, Github, Linkedin, Globe, ArrowLeft, Star, Upload,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '', middleName: (user as any)?.middleName || '', lastName: user?.lastName || '',
    email: user?.email || '', contactNo: user?.contactNo || '', bio: (user as any)?.bio || '',
    location: (user as any)?.location || '', portfolio: (user as any)?.portfolio || '',
    github: (user as any)?.github || '', linkedin: (user as any)?.linkedin || '',
    leetcode: (user as any)?.leetcode || '', cgpa: (user as any)?.cgpa || '',
    skills: user?.skills || [], projects: user?.projects || [], achievements: user?.achievements || [],
    resume: (user as any)?.resume || '', coverLetter: (user as any)?.coverLetter || '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '', skills: [] as string[] });
  const [newAchievement, setNewAchievement] = useState({ title: '', description: '', date: '', issuer: '' });

  const toggleEdit = (s: string) => setEditingSections(prev => ({ ...prev, [s]: !prev[s] }));

  const handleSave = async (section: string) => {
    try {
      await updateProfile(formData as any);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...formData }));
      toggleEdit(section);
      toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
      setTimeout(() => window.dispatchEvent(new Event('profileUpdated')), 100);
    } catch { toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' }); }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleAddProject = () => {
    if (!newProject.title.trim()) return;
    setFormData(p => ({ ...p, projects: [...p.projects, { id: `proj_${Date.now()}`, ...newProject }] }));
    setProjectDialogOpen(false);
    setNewProject({ title: '', description: '', link: '', skills: [] });
  };

  const handleAddAchievement = () => {
    if (!newAchievement.title.trim()) return;
    setFormData(p => ({ ...p, achievements: [...p.achievements, { id: `ach_${Date.now()}`, ...newAchievement }] }));
    setAchievementDialogOpen(false);
    setNewAchievement({ title: '', description: '', date: '', issuer: '' });
  };

  if (!user) { navigate('/login'); return null; }

  const EditButton = ({ section }: { section: string }) => (
    <button onClick={() => toggleEdit(section)} className="p-1 rounded hover:bg-muted"><Edit size={16} className="text-muted-foreground" /></button>
  );

  const SaveCancelButtons = ({ section }: { section: string }) => (
    <div className="flex gap-2 mt-2">
      <Button size="sm" onClick={() => handleSave(section)} className="bg-united-green hover:bg-united-green/90 text-white"><Save size={14} className="mr-1" /> Save</Button>
      <Button size="sm" variant="outline" onClick={() => toggleEdit(section)}><X size={14} className="mr-1" /> Cancel</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Back */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="my-2 text-muted-foreground">
            <ArrowLeft size={18} className="mr-1" /> Back
          </Button>
        </div>
      </div>

      {/* Cover */}
      <div className="h-48 md:h-60 bg-gradient-to-r from-accent to-accent/70" />

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative">
        {/* Header Card */}
        <Card className="mb-4">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <Avatar className="h-28 w-28 border-4 border-card shadow-lg">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                {editingSections.header ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="First Name" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                      <Input placeholder="Middle Name" value={formData.middleName} onChange={e => setFormData({ ...formData, middleName: e.target.value })} />
                      <Input placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                    {user.role === 'student' && (
                      <Input placeholder="CGPA" type="number" value={formData.cgpa} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} />
                    )}
                    <SaveCancelButtons section="header" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                      <h1 className="text-2xl font-bold text-foreground">{user.firstName} {(user as any).middleName} {user.lastName}</h1>
                      <EditButton section="header" />
                    </div>
                    <div className="flex gap-1.5 flex-wrap justify-center md:justify-start mb-2">
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        {user.role === 'student' ? <><GraduationCap size={12} className="mr-1" /> Student</> : <><Briefcase size={12} className="mr-1" /> Faculty</>}
                      </Badge>
                      {user.role === 'student' && (user as any).department && <Badge variant="secondary">{(user as any).department}</Badge>}
                      {user.role === 'student' && formData.cgpa && <Badge variant="outline" className="bg-united-amber/10 text-united-amber border-united-amber/30"><Star size={12} className="mr-1" /> CGPA: {formData.cgpa}</Badge>}
                      {user.role === 'faculty' && (user as any).designation && <Badge variant="secondary">{(user as any).designation}</Badge>}
                    </div>
                    {formData.location && <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center md:justify-start"><MapPin size={14} /> {formData.location}</p>}
                  </>
                )}
              </div>
              <Button onClick={() => navigate('/settings/profile')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Edit size={16} className="mr-1" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Contact */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold">Contact Information</h2>
                  {!editingSections.contact && <EditButton section="contact" />}
                </div>
                {editingSections.contact ? (
                  <div className="space-y-2">
                    <div className="relative"><Mail size={14} className="absolute left-3 top-3 text-muted-foreground" /><Input className="pl-9" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                    <div className="relative"><Phone size={14} className="absolute left-3 top-3 text-muted-foreground" /><Input className="pl-9" value={formData.contactNo} onChange={e => setFormData({ ...formData, contactNo: e.target.value })} /></div>
                    <div className="relative"><MapPin size={14} className="absolute left-3 top-3 text-muted-foreground" /><Input className="pl-9" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} /></div>
                    <SaveCancelButtons section="contact" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Mail size={14} /> {user.email}</p>
                    {user.contactNo && <p className="text-sm text-muted-foreground flex items-center gap-2"><Phone size={14} /> {user.contactNo}</p>}
                    {formData.location && <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin size={14} /> {formData.location}</p>}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold mb-3">Social Links</h2>
                <div className="space-y-2">
                  {formData.portfolio && <a href={formData.portfolio} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded border border-border hover:bg-muted text-sm"><span className="flex items-center gap-2"><Globe size={14} /> Portfolio</span><ExternalLink size={12} /></a>}
                  {formData.github && <a href={formData.github} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded border border-border hover:bg-muted text-sm"><span className="flex items-center gap-2"><Github size={14} /> GitHub</span><ExternalLink size={12} /></a>}
                  {formData.linkedin && <a href={formData.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded border border-border hover:bg-muted text-sm"><span className="flex items-center gap-2"><Linkedin size={14} /> LinkedIn</span><ExternalLink size={12} /></a>}
                  {formData.leetcode && <a href={formData.leetcode} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded border border-border hover:bg-muted text-sm"><span className="flex items-center gap-2"><Award size={14} /> LeetCode</span><ExternalLink size={12} /></a>}
                  {!formData.portfolio && !formData.github && !formData.linkedin && !formData.leetcode && (
                    <p className="text-sm text-muted-foreground text-center py-3">No social links added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold">Skills</h2>
                  {!editingSections.skills && <EditButton section="skills" />}
                </div>
                {editingSections.skills ? (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      <Input placeholder="Add a skill" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSkill()} />
                      <Button size="sm" onClick={handleAddSkill}><Plus size={14} /></Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="pr-1">
                          {skill} <button onClick={() => setFormData(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }))} className="ml-1"><X size={12} /></button>
                        </Badge>
                      ))}
                    </div>
                    <SaveCancelButtons section="skills" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.length > 0 ? formData.skills.map(skill => (
                      <Badge key={skill} variant="outline" className="text-primary border-primary/30">{skill}</Badge>
                    )) : <p className="text-sm text-muted-foreground">No skills added yet</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-4">
            {/* About */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold">About</h2>
                  {!editingSections.about && <EditButton section="about" />}
                </div>
                {editingSections.about ? (
                  <div className="space-y-2">
                    <Textarea rows={4} placeholder="Tell us about yourself..." value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                    <SaveCancelButtons section="about" />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{formData.bio || 'No bio added yet. Click edit to add your bio.'}</p>
                )}
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold">Projects</h2>
                  <Button size="sm" variant="outline" onClick={() => setProjectDialogOpen(true)}><Plus size={14} className="mr-1" /> Add Project</Button>
                </div>
                {formData.projects.length > 0 ? (
                  <div className="space-y-3">
                    {formData.projects.map((project: any) => (
                      <div key={project.id} className="p-3 rounded-lg border border-border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{project.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                            {project.skills?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {project.skills.map((s: string) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                              </div>
                            )}
                            {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1">View Project <ExternalLink size={10} /></a>}
                          </div>
                          <button onClick={() => setFormData(p => ({ ...p, projects: p.projects.filter((pr: any) => pr.id !== project.id) }))} className="text-destructive hover:bg-destructive/10 p-1 rounded"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No projects added yet.</p>}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold">Achievements & Awards</h2>
                  <Button size="sm" variant="outline" onClick={() => setAchievementDialogOpen(true)}><Plus size={14} className="mr-1" /> Add Achievement</Button>
                </div>
                {formData.achievements.length > 0 ? (
                  <div className="space-y-2">
                    {formData.achievements.map((a: any) => (
                      <div key={a.id} className="flex justify-between items-center p-3 rounded-lg border border-border">
                        <div>
                          <h3 className="font-semibold text-sm flex items-center gap-1"><Award size={14} className="text-united-amber" /> {a.title}</h3>
                          {a.description && <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>}
                          {(a.issuer || a.date) && <p className="text-xs text-muted-foreground mt-0.5">{a.issuer}{a.issuer && a.date ? ' • ' : ''}{a.date}</p>}
                        </div>
                        <button onClick={() => setFormData(p => ({ ...p, achievements: p.achievements.filter((ac: any) => ac.id !== a.id) }))} className="text-destructive hover:bg-destructive/10 p-1 rounded"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No achievements added yet.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Project Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Project</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} /></div>
            <div><Label>Link</Label><Input value={newProject.link} onChange={e => setNewProject({ ...newProject, link: e.target.value })} placeholder="https://..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProject} className="bg-accent text-accent-foreground">Add Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Achievement Dialog */}
      <Dialog open={achievementDialogOpen} onOpenChange={setAchievementDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Achievement</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={newAchievement.title} onChange={e => setNewAchievement({ ...newAchievement, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={newAchievement.description} onChange={e => setNewAchievement({ ...newAchievement, description: e.target.value })} /></div>
            <div><Label>Issuer</Label><Input value={newAchievement.issuer} onChange={e => setNewAchievement({ ...newAchievement, issuer: e.target.value })} /></div>
            <div><Label>Date</Label><Input type="date" value={newAchievement.date} onChange={e => setNewAchievement({ ...newAchievement, date: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAchievementDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAchievement} className="bg-accent text-accent-foreground">Add Achievement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;

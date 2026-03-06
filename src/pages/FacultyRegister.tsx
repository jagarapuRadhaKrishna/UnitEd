import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AVAILABLE_SKILLS, FACULTY_DESIGNATIONS } from '@/types/united';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const qualifications = ['Ph.D.', 'M.Tech', 'M.Sc', 'M.Phil', 'M.E', 'B.Tech', 'B.Sc', 'Other'];

const FacultyRegister: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', employeeId: '', designation: '',
    dateOfJoining: '', email: '', password: '', contactNo: '', gender: '',
    totalExperience: '', teachingExperience: '', industryExperience: '',
    qualification: '', specialization: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [projects, setProjects] = useState([{ title: '', description: '', link: '' }]);
  const [achievements, setAchievements] = useState(['']);
  const [profilePicture, setProfilePicture] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => setFormData({ ...formData, [field]: value });
  const filteredSkills = AVAILABLE_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !skills.includes(s));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (submitting) return;
    if (!formData.firstName || !formData.lastName) { setError('Names are required'); return; }
    if (!formData.employeeId || !/^100\d{3}$/.test(formData.employeeId)) { setError('Employee ID: 100 followed by 3 digits'); return; }
    if (!formData.email || !/^[a-zA-Z]+\.(csd|cse|ece|eee|mech|civil|it|chem|bio)@anits\.edu\.in$/i.test(formData.email)) {
      setError('Use format: fullnamesurname.dept@anits.edu.in'); return;
    }
    if (!formData.designation || !formData.qualification) { setError('Designation and qualification required'); return; }
    if (skills.length === 0) { setError('Select at least one skill'); return; }

    try {
      setSubmitting(true);
      await register({
        ...formData, role: 'faculty', gender: formData.gender as any,
        totalExperience: Number(formData.totalExperience), teachingExperience: Number(formData.teachingExperience),
        industryExperience: Number(formData.industryExperience), skills,
        projects: projects.filter(p => p.title), achievements: achievements.filter(a => a),
        profilePictureUrl: profilePicture,
      });
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/register')} className="text-united-orange mb-2">
            <ArrowLeft size={20} className="mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-1">Faculty Registration</h1>
          <p className="text-muted-foreground">Fill in your details to create your faculty profile</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4 text-sm">
            {error} <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="text-center">
                <input type="file" accept="image/*" id="pp" hidden onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { const r = new FileReader(); r.onloadend = () => setProfilePicture(r.result as string); r.readAsDataURL(file); }
                }} />
                <label htmlFor="pp" className="cursor-pointer inline-block">
                  <div className="w-28 h-28 rounded-full mx-auto mb-2 border-[3px] border-united-orange overflow-hidden bg-muted flex items-center justify-center hover:opacity-80 transition-opacity">
                    {profilePicture ? <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" /> : <Upload size={36} className="text-muted-foreground" />}
                  </div>
                </label>
                <p className="text-xs text-muted-foreground">Click to upload profile picture</p>
              </div>

              {/* Personal */}
              <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><Label>First Name *</Label><Input value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} /></div>
                <div><Label>Middle Name</Label><Input value={formData.middleName} onChange={e => handleChange('middleName', e.target.value)} /></div>
                <div><Label>Last Name *</Label><Input value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Employee ID *</Label><Input placeholder="100000" value={formData.employeeId} onChange={e => handleChange('employeeId', e.target.value)} /><p className="text-xs text-muted-foreground mt-1">100 followed by 3 digits</p></div>
                <div><Label>Gender</Label>
                  <Select value={formData.gender} onValueChange={v => handleChange('gender', v)}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>{['Male', 'Female', 'Other', 'Prefer not to say'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Email *</Label><Input type="email" placeholder="janesmith.cse@anits.edu.in" value={formData.email} onChange={e => handleChange('email', e.target.value)} /><p className="text-xs text-muted-foreground mt-1">fullnamesurname.dept@anits.edu.in</p></div>
                <div>
                  <Label>Password *</Label>
                  <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={e => handleChange('password', e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
                </div>
              </div>
              <div><Label>Contact Number</Label><Input type="tel" value={formData.contactNo} onChange={e => handleChange('contactNo', e.target.value)} /></div>

              {/* Professional */}
              <h3 className="text-lg font-semibold text-foreground pt-2">Professional Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Designation *</Label>
                  <Select value={formData.designation} onValueChange={v => handleChange('designation', v)}>
                    <SelectTrigger><SelectValue placeholder="Select designation" /></SelectTrigger>
                    <SelectContent>{FACULTY_DESIGNATIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Date of Joining</Label><Input type="date" value={formData.dateOfJoining} onChange={e => handleChange('dateOfJoining', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Highest Qualification *</Label>
                  <Select value={formData.qualification} onValueChange={v => handleChange('qualification', v)}>
                    <SelectTrigger><SelectValue placeholder="Select qualification" /></SelectTrigger>
                    <SelectContent>{qualifications.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Specialization</Label><Input value={formData.specialization} onChange={e => handleChange('specialization', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><Label>Total Experience (yrs)</Label><Input type="number" value={formData.totalExperience} onChange={e => handleChange('totalExperience', e.target.value)} /></div>
                <div><Label>Teaching Experience</Label><Input type="number" value={formData.teachingExperience} onChange={e => handleChange('teachingExperience', e.target.value)} /></div>
                <div><Label>Industry Experience</Label><Input type="number" value={formData.industryExperience} onChange={e => handleChange('industryExperience', e.target.value)} /></div>
              </div>

              {/* Skills */}
              <h3 className="text-lg font-semibold text-foreground pt-2">Skills & Expertise *</h3>
              <div className="flex flex-wrap gap-2 mb-2" role="list" aria-label="Selected skills">
                {skills.map(s => (
                  <button key={s} type="button" role="listitem" aria-label={`Remove ${s}`}
                    className="inline-flex items-center rounded-full border border-transparent bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                    onClick={() => setSkills(skills.filter(sk => sk !== s))}>
                    {s} <X size={14} className="ml-1" />
                  </button>
                ))}
              </div>
              <Input placeholder="Search skills..." value={skillSearch} onChange={e => setSkillSearch(e.target.value)} />
              {skillSearch && (
                <div className="border rounded-lg max-h-40 overflow-y-auto mt-1">
                  {filteredSkills.slice(0, 10).map(s => (
                    <button key={s} type="button" className="block w-full text-left px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => { setSkills([...skills, s]); setSkillSearch(''); }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Projects */}
              <h3 className="text-lg font-semibold text-foreground pt-2">Research Projects / Publications</h3>
              {projects.map((p, i) => (
                <div key={i} className="bg-muted p-4 rounded-lg relative space-y-3">
                  {projects.length > 1 && <button type="button" onClick={() => setProjects(projects.filter((_, j) => j !== i))} className="absolute top-2 right-2 text-destructive"><X size={18} /></button>}
                  <Input placeholder="Project Title" value={p.title} onChange={e => { const u = [...projects]; u[i] = { ...u[i], title: e.target.value }; setProjects(u); }} />
                  <Textarea placeholder="Description" rows={2} value={p.description} onChange={e => { const u = [...projects]; u[i] = { ...u[i], description: e.target.value }; setProjects(u); }} />
                  <Input placeholder="DOI / Link" value={p.link} onChange={e => { const u = [...projects]; u[i] = { ...u[i], link: e.target.value }; setProjects(u); }} />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setProjects([...projects, { title: '', description: '', link: '' }])}>Add Project</Button>

              {/* Achievements */}
              <h3 className="text-lg font-semibold text-foreground pt-2">Awards / Recognition</h3>
              {achievements.map((a, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder={`Achievement ${i + 1}`} value={a} onChange={e => { const u = [...achievements]; u[i] = e.target.value; setAchievements(u); }} />
                  {achievements.length > 1 && <button type="button" onClick={() => setAchievements(achievements.filter((_, j) => j !== i))} className="text-destructive"><X size={20} /></button>}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setAchievements([...achievements, ''])}>Add Achievement</Button>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/register')}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="flex-1 bg-united-orange hover:bg-united-orange/80">
                  {submitting ? 'Registering...' : 'Register as Faculty'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacultyRegister;

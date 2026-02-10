import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AVAILABLE_SKILLS } from '@/types/united';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const departments = ['CSE', 'CSE (DATA SCIENCE)', 'CSE (AI ML)', 'CYBERSECURITY', 'INFORMATION TECHNOLOGY', 'ECE'];

const StudentRegister: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', rollNumber: '', department: '',
    yearOfGraduation: '', email: '', password: '', contactNo: '', gender: '',
    experience: '', portfolio: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [projects, setProjects] = useState([{ title: '', description: '', link: '' }]);
  const [achievements, setAchievements] = useState(['']);
  const [profilePicture, setProfilePicture] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => setFormData({ ...formData, [field]: value });

  const filteredSkills = AVAILABLE_SKILLS.filter(s =>
    s.toLowerCase().includes(skillSearch.toLowerCase()) && !skills.includes(s)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.firstName || !formData.lastName) { setError('First and last names are required'); return; }
    if (!formData.rollNumber || !/^A\d{11}$/.test(formData.rollNumber)) { setError('Roll number must be A followed by 11 digits'); return; }
    if (!formData.email || !/^[a-zA-Z]+\.[0-9]{2}\.(cse|csd|aim|csc|it|ece)@anits\.edu\.in$/i.test(formData.email)) {
      setError('Use format: firstname.YY.dept@anits.edu.in (dept: cse/csd/aim/csc/it/ece)'); return;
    }
    if (!formData.department || !formData.yearOfGraduation) { setError('Department and year are required'); return; }
    if (skills.length === 0) { setError('Select at least one skill'); return; }

    try {
      await register({
        ...formData, role: 'student',
        gender: formData.gender as any, yearOfGraduation: Number(formData.yearOfGraduation),
        experience: formData.experience ? Number(formData.experience) : undefined,
        skills, projects: projects.filter(p => p.title), achievements: achievements.filter(a => a),
        profilePictureUrl: profilePicture,
      });
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/register')} className="text-united-blue mb-2">
            <ArrowLeft size={20} className="mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Student Registration</h1>
          <p className="text-gray-500">Fill in your details to create your student profile</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
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
                  <div className="w-28 h-28 rounded-full mx-auto mb-2 border-[3px] border-united-blue overflow-hidden bg-gray-100 flex items-center justify-center hover:opacity-80 transition-opacity">
                    {profilePicture ? <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" /> : <Upload size={36} className="text-gray-400" />}
                  </div>
                </label>
                <p className="text-xs text-gray-500">Click to upload profile picture</p>
              </div>

              {/* Personal */}
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><Label>First Name *</Label><Input value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} /></div>
                <div><Label>Middle Name</Label><Input value={formData.middleName} onChange={e => handleChange('middleName', e.target.value)} /></div>
                <div><Label>Last Name *</Label><Input value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Roll Number *</Label><Input placeholder="A00000000000" value={formData.rollNumber} onChange={e => handleChange('rollNumber', e.target.value)} /><p className="text-xs text-gray-400 mt-1">A followed by 11 digits</p></div>
                <div><Label>Gender</Label>
                  <Select value={formData.gender} onValueChange={v => handleChange('gender', v)}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>{['Male', 'Female', 'Other', 'Prefer not to say'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Email *</Label><Input type="email" placeholder="john.22.cse@anits.edu.in" value={formData.email} onChange={e => handleChange('email', e.target.value)} /><p className="text-xs text-gray-400 mt-1">firstname.YY.dept@anits.edu.in</p></div>
                <div><Label>Password *</Label><Input type="password" value={formData.password} onChange={e => handleChange('password', e.target.value)} /><p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p></div>
              </div>
              <div><Label>Contact Number</Label><Input type="tel" value={formData.contactNo} onChange={e => handleChange('contactNo', e.target.value)} /></div>

              {/* Academic */}
              <h3 className="text-lg font-semibold text-gray-900 pt-2">Academic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Department *</Label>
                  <Select value={formData.department} onValueChange={v => handleChange('department', v)}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Year of Graduation *</Label><Input type="number" placeholder="2025" value={formData.yearOfGraduation} onChange={e => handleChange('yearOfGraduation', e.target.value)} /></div>
              </div>

              {/* Skills */}
              <h3 className="text-lg font-semibold text-gray-900 pt-2">Skills *</h3>
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
                    <button key={s} type="button" className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => { setSkills([...skills, s]); setSkillSearch(''); }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Experience (years)</Label><Input type="number" value={formData.experience} onChange={e => handleChange('experience', e.target.value)} /></div>
                <div><Label>Portfolio URL</Label><Input placeholder="https://yourportfolio.com" value={formData.portfolio} onChange={e => handleChange('portfolio', e.target.value)} /></div>
              </div>

              {/* Projects */}
              <h3 className="text-lg font-semibold text-gray-900 pt-2">Projects</h3>
              {projects.map((p, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg relative space-y-3">
                  {projects.length > 1 && <button type="button" onClick={() => setProjects(projects.filter((_, j) => j !== i))} className="absolute top-2 right-2 text-red-500"><X size={18} /></button>}
                  <Input placeholder="Project Title" value={p.title} onChange={e => { const u = [...projects]; u[i] = { ...u[i], title: e.target.value }; setProjects(u); }} />
                  <Textarea placeholder="Description" rows={2} value={p.description} onChange={e => { const u = [...projects]; u[i] = { ...u[i], description: e.target.value }; setProjects(u); }} />
                  <Input placeholder="Project Link" value={p.link} onChange={e => { const u = [...projects]; u[i] = { ...u[i], link: e.target.value }; setProjects(u); }} />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setProjects([...projects, { title: '', description: '', link: '' }])}>Add Project</Button>

              {/* Achievements */}
              <h3 className="text-lg font-semibold text-gray-900 pt-2">Achievements / Awards</h3>
              {achievements.map((a, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder={`Achievement ${i + 1}`} value={a} onChange={e => { const u = [...achievements]; u[i] = e.target.value; setAchievements(u); }} />
                  {achievements.length > 1 && <button type="button" onClick={() => setAchievements(achievements.filter((_, j) => j !== i))} className="text-red-500"><X size={20} /></button>}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setAchievements([...achievements, ''])}>Add Achievement</Button>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/register')}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-united-blue hover:bg-blue-700">Register</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegister;

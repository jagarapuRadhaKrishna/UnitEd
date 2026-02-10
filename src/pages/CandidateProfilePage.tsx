import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Mail, GraduationCap, Briefcase, Award, Star, Globe, Linkedin } from 'lucide-react';

const candidateData: Record<string, any> = {
  'student-1': {
    name: 'Madhuri', role: 'student', headline: 'ML Enthusiast | AI Researcher', email: 'madhuri@university.edu',
    department: 'Computer Science', year: '3rd Year', cgpa: '8.9', location: 'Hyderabad',
    bio: 'Passionate CS student focused on machine learning and AI. Experienced in developing ML models for real-world applications.',
    skills: [{ name: 'Python', level: 95 }, { name: 'Machine Learning', level: 90 }, { name: 'TensorFlow', level: 85 }, { name: 'Data Analysis', level: 88 }],
    projects: [{ title: 'Image Classification System', description: 'CNN-based classifier achieving 95% accuracy on CIFAR-100', technologies: ['Python', 'TensorFlow', 'Keras'] }],
    achievements: ['🏆 1st Place - University AI Hackathon 2024', '📜 Dean\'s List - 5 semesters', '📝 IEEE CVPR Paper Published'],
  },
  'student-2': {
    name: 'Maroof Khan', role: 'student', headline: 'Full-Stack Developer | MERN Stack', email: 'maroof@university.edu',
    department: 'Information Technology', year: '4th Year', cgpa: '9.2', location: 'Bengaluru',
    bio: 'Full-stack developer passionate about building scalable web applications.',
    skills: [{ name: 'React', level: 98 }, { name: 'Node.js', level: 95 }, { name: 'JavaScript', level: 97 }, { name: 'MongoDB', level: 88 }],
    projects: [{ title: 'E-Commerce Platform', description: 'Full-stack e-commerce with Stripe integration', technologies: ['React', 'Node.js', 'MongoDB'] }],
    achievements: ['🌟 Google Summer of Code 2024', '💻 Top Contributor - Open Source Project'],
  },
  'student-3': {
    name: 'Vedhakshi', role: 'student', headline: 'UI/UX Designer | Frontend Developer', email: 'vedhakshi@university.edu',
    department: 'Computer Science', year: '2nd Year', cgpa: '8.5', location: 'Chennai',
    bio: 'Creative UI/UX designer and frontend developer.',
    skills: [{ name: 'UI/UX Design', level: 95 }, { name: 'Figma', level: 92 }, { name: 'React', level: 85 }, { name: 'Tailwind CSS', level: 87 }],
    projects: [{ title: 'Campus Events App', description: 'Mobile app for university events with 2000+ users', technologies: ['React Native', 'Firebase'] }],
    achievements: ['🎨 Best Design Award - Hackathon 2024', '🏆 UI/UX Design Competition Winner'],
  },
};

const CandidateProfilePage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const postId = (location.state as any)?.postId;

  const candidate = candidateId ? candidateData[candidateId] : null;

  if (!candidate) {
    // Try loading from registered users in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const registeredUser = registeredUsers.find((u: any) => u.id === candidateId);
    if (registeredUser) {
      const c = {
        name: `${registeredUser.firstName} ${registeredUser.lastName}`,
        role: registeredUser.role,
        headline: registeredUser.bio || `${registeredUser.role} at ANITS`,
        email: registeredUser.email,
        department: registeredUser.department || 'Computer Science',
        year: registeredUser.yearOfGraduation ? `Class of ${registeredUser.yearOfGraduation}` : undefined,
        cgpa: registeredUser.cgpa,
        location: registeredUser.location || 'India',
        bio: registeredUser.bio || 'No bio provided',
        skills: (registeredUser.skills || []).map((s: string) => ({ name: s, level: 75 })),
        projects: (registeredUser.projects || []).map((p: any) => ({ title: p.title, description: p.description, technologies: p.skills || [] })),
        achievements: (registeredUser.achievements || []).map((a: any) => a.title),
      };
      return renderProfile(c, navigate, postId, candidateId!);
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Candidate not found</h2>
        <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-2" /> Go Back</Button>
      </div>
    );
  }

  return renderProfile(candidate, navigate, postId, candidateId!);
};

function renderProfile(candidate: any, navigate: any, postId: string | undefined, candidateId: string) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(postId ? `/post/${postId}/candidates` : -1)} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      {/* Cover & Profile */}
      <Card className="mb-6 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-united-blue via-united-purple to-united-orange" />
        <CardContent className="p-6 -mt-12">
          <div className="flex items-end gap-4 mb-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarFallback className="bg-united-purple text-white text-2xl font-bold">{candidate.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-1">
              <h1 className="text-2xl font-bold text-foreground">{candidate.name}</h1>
              <p className="text-muted-foreground">{candidate.headline}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {candidate.email}</span>
            {candidate.department && <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {candidate.department}</span>}
            {candidate.year && <span>{candidate.year}</span>}
            {candidate.cgpa && <span>CGPA: {candidate.cgpa}</span>}
            {candidate.location && <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {candidate.location}</span>}
          </div>

          <Badge variant="secondary" className="capitalize">{candidate.role}</Badge>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2">About</h3>
          <p className="text-muted-foreground leading-relaxed">{candidate.bio}</p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-united-orange" /> Skills</h3>
          <div className="space-y-3">
            {candidate.skills.map((skill: any) => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      {candidate.projects?.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-united-blue" /> Projects</h3>
            <div className="space-y-4">
              {candidate.projects.map((project: any, i: number) => (
                <div key={i} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-1">{project.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((t: string) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      {candidate.achievements?.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-united-green" /> Achievements</h3>
            <ul className="space-y-2">
              {candidate.achievements.map((a: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground">{a}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CandidateProfilePage;

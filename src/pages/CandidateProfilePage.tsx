import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Award,
  Briefcase,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Loader2,
  Mail,
  Phone,
  Star,
} from 'lucide-react';

const CandidateProfilePage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const postId = (location.state as { postId?: string } | null)?.postId;
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

  const parseArray = (value: any): any[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const fetchCandidate = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', candidateId!)
      .maybeSingle();

    if (!error && data) {
      setCandidate(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Candidate not found</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const fullName = `${candidate.first_name || ''} ${candidate.middle_name || ''} ${candidate.last_name || ''}`
    .replace(/\s+/g, ' ')
    .trim() || 'Unknown';
  const initials = `${(candidate.first_name || 'U')[0]}${(candidate.last_name || '')[0] || ''}`;
  const skills: string[] = parseArray(candidate.skills).filter((skill) => typeof skill === 'string');
  const projects: any[] = parseArray(candidate.projects);
  const achievements: any[] = parseArray(candidate.achievements);
  const specialization: string[] = parseArray(candidate.specialization).filter((item) => typeof item === 'string');
  const resumeUrl = candidate.resume_url || undefined;

  const detailItems = [
    candidate.role === 'student' && candidate.roll_number ? { label: 'Roll Number', value: candidate.roll_number } : null,
    candidate.role === 'student' && candidate.department ? { label: 'Department', value: candidate.department } : null,
    candidate.role === 'student' && candidate.year_of_graduation ? { label: 'Graduation Year', value: String(candidate.year_of_graduation) } : null,
    candidate.role === 'student' && candidate.cgpa ? { label: 'CGPA', value: candidate.cgpa } : null,
    candidate.role === 'student' && candidate.experience ? { label: 'Experience', value: candidate.experience } : null,
    candidate.role === 'faculty' && candidate.employee_id ? { label: 'Employee ID', value: candidate.employee_id } : null,
    candidate.role === 'faculty' && candidate.designation ? { label: 'Designation', value: candidate.designation } : null,
    candidate.role === 'faculty' && candidate.date_of_joining
      ? { label: 'Date of Joining', value: new Date(candidate.date_of_joining).toLocaleDateString() }
      : null,
    candidate.role === 'faculty' && candidate.qualification ? { label: 'Qualification', value: candidate.qualification } : null,
    candidate.role === 'faculty' && specialization.length ? { label: 'Specialization', value: specialization.join(', ') } : null,
    candidate.role === 'faculty' && candidate.total_experience !== null && candidate.total_experience !== undefined
      ? { label: 'Total Experience', value: `${candidate.total_experience} years` }
      : null,
    candidate.role === 'faculty' && candidate.teaching_experience !== null && candidate.teaching_experience !== undefined
      ? { label: 'Teaching Experience', value: `${candidate.teaching_experience} years` }
      : null,
    candidate.role === 'faculty' && candidate.industry_experience !== null && candidate.industry_experience !== undefined
      ? { label: 'Industry Experience', value: `${candidate.industry_experience} years` }
      : null,
    candidate.location ? { label: 'Location', value: candidate.location } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Button
        variant="ghost"
        onClick={() => (postId ? navigate(`/post/${postId}/candidates`) : navigate(-1))}
        className="mb-4 text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <Card className="mb-6 overflow-hidden">
        {candidate.cover_photo_url ? (
          <img src={candidate.cover_photo_url} alt="Cover" className="h-32 w-full object-cover" />
        ) : (
          <div className="h-32 bg-gradient-to-r from-primary to-accent" />
        )}
        <CardContent className="p-6 -mt-12">
          <div className="flex items-end gap-4 mb-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={candidate.profile_picture_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-1">
              <h1 className="text-2xl font-bold text-foreground">{fullName}</h1>
              <p className="text-foreground/90">{candidate.bio || `${candidate.role} at University`}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-foreground/90 mb-4">
            {candidate.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {candidate.email}</span>}
            {candidate.contact_no && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {candidate.contact_no}</span>}
            {candidate.department && <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {candidate.department}</span>}
            {candidate.designation && <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {candidate.designation}</span>}
            {candidate.location && <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {candidate.location}</span>}
          </div>

          <Badge variant="secondary" className="capitalize">{candidate.role}</Badge>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2 text-foreground">About</h3>
          <p className="text-foreground/90 leading-relaxed">{candidate.bio || 'No bio provided yet.'}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-foreground">Contact & Links</h3>
          <div className="grid gap-3 text-sm text-foreground/90">
            {candidate.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {candidate.email}</div>}
            {candidate.contact_no && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {candidate.contact_no}</div>}
          </div>

          {(candidate.github || candidate.linkedin || candidate.portfolio || candidate.leetcode || resumeUrl) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {candidate.github && (
                <Button variant="outline" size="sm" asChild>
                  <a href={candidate.github} target="_blank" rel="noreferrer">
                    <Github className="w-4 h-4 mr-1" /> GitHub
                  </a>
                </Button>
              )}
              {candidate.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a href={candidate.linkedin} target="_blank" rel="noreferrer">
                    <Linkedin className="w-4 h-4 mr-1" /> LinkedIn
                  </a>
                </Button>
              )}
              {candidate.portfolio && (
                <Button variant="outline" size="sm" asChild>
                  <a href={candidate.portfolio} target="_blank" rel="noreferrer">
                    <Globe className="w-4 h-4 mr-1" /> Portfolio
                  </a>
                </Button>
              )}
              {candidate.leetcode && (
                <Button variant="outline" size="sm" asChild>
                  <a href={candidate.leetcode} target="_blank" rel="noreferrer">LeetCode</a>
                </Button>
              )}
              {resumeUrl && (
                <Button variant="default" size="sm" asChild>
                  <a href={resumeUrl} target="_blank" rel="noreferrer">Resume</a>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {detailItems.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-foreground">Profile Details</h3>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              {detailItems.map((item) => (
                <div key={item.label} className="rounded-lg border p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="mt-1 font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {candidate.cover_letter && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2 text-foreground">Cover Letter</h3>
            <p className="text-foreground/90 whitespace-pre-line">{candidate.cover_letter}</p>
          </CardContent>
        </Card>
      )}

      {skills.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
              <Star className="w-5 h-5 text-primary" /> Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="outline" className="bg-primary/5">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {projects.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
              <Briefcase className="w-5 h-5 text-primary" /> Projects
            </h3>
            <div className="space-y-4">
              {projects.map((project: any, index: number) => (
                <div key={project.id || index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-1 text-foreground">{project.title}</h4>
                  <p className="text-sm text-foreground/85 mb-2">{project.description}</p>
                  {(project.skills || project.technologies)?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(project.skills || project.technologies).map((tech: string) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <div className="mt-2">
                      <a className="text-primary text-sm" href={project.link} target="_blank" rel="noreferrer">
                        View project
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {achievements.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
              <Award className="w-5 h-5 text-accent-foreground" /> Achievements
            </h3>
            <ul className="space-y-3">
              {achievements.map((achievement: any, index: number) => (
                <li key={achievement.id || index} className="text-sm text-foreground/90">
                  <p className="font-medium text-foreground">
                    {typeof achievement === 'string' ? achievement : achievement.title || 'Achievement'}
                  </p>
                  {achievement?.description && (
                    <div className="text-xs text-foreground/80 mt-1">{achievement.description}</div>
                  )}
                  {(achievement?.issuer || achievement?.date) && (
                    <div className="text-xs text-foreground/75 mt-1">
                      {[achievement.issuer, achievement.date].filter(Boolean).join(' | ')}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateProfilePage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Github,
  Linkedin,
  Globe,
  Loader2,
  Mail,
  Phone,
  Award,
} from 'lucide-react';

const UserProfilePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id!)
      .maybeSingle();

    if (!error && data) setProfileUser(data);
    setLoading(false);
  };

  const parseArr = (val: any): any[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold mb-4">User not found</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const fullName = `${profileUser.first_name || ''} ${profileUser.last_name || ''}`.trim() || 'Unknown';
  const initials = `${(profileUser.first_name || 'U')[0]}${(profileUser.last_name || '')[0] || ''}`;
  const skills: string[] = parseArr(profileUser.skills);
  const projects: any[] = parseArr(profileUser.projects);
  const achievements: any[] = parseArr(profileUser.achievements);
  const specialization: string[] = parseArr(profileUser.specialization);
  const resumeUrl: string | undefined = profileUser.resume_url || undefined;

  const detailItems = [
    profileUser.role === 'student' && profileUser.roll_number ? { label: 'Roll Number', value: profileUser.roll_number } : null,
    profileUser.role === 'student' && profileUser.department ? { label: 'Department', value: profileUser.department } : null,
    profileUser.role === 'student' && profileUser.year_of_graduation ? { label: 'Graduation Year', value: String(profileUser.year_of_graduation) } : null,
    profileUser.role === 'student' && profileUser.cgpa ? { label: 'CGPA', value: profileUser.cgpa } : null,
    profileUser.role === 'student' && profileUser.experience ? { label: 'Experience', value: profileUser.experience } : null,
    profileUser.role === 'faculty' && profileUser.employee_id ? { label: 'Employee ID', value: profileUser.employee_id } : null,
    profileUser.role === 'faculty' && profileUser.designation ? { label: 'Designation', value: profileUser.designation } : null,
    profileUser.role === 'faculty' && profileUser.date_of_joining ? { label: 'Date of Joining', value: new Date(profileUser.date_of_joining).toLocaleDateString() } : null,
    profileUser.role === 'faculty' && profileUser.qualification ? { label: 'Qualification', value: profileUser.qualification } : null,
    profileUser.role === 'faculty' && specialization.length ? { label: 'Specialization', value: specialization.join(', ') } : null,
    profileUser.role === 'faculty' && profileUser.total_experience !== null && profileUser.total_experience !== undefined
      ? { label: 'Total Experience', value: `${profileUser.total_experience} years` }
      : null,
    profileUser.role === 'faculty' && profileUser.teaching_experience !== null && profileUser.teaching_experience !== undefined
      ? { label: 'Teaching Experience', value: `${profileUser.teaching_experience} years` }
      : null,
    profileUser.role === 'faculty' && profileUser.industry_experience !== null && profileUser.industry_experience !== undefined
      ? { label: 'Industry Experience', value: `${profileUser.industry_experience} years` }
      : null,
    profileUser.location ? { label: 'Location', value: profileUser.location } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <Card className="mb-6 overflow-hidden">
        {profileUser.cover_photo_url ? (
          <img src={profileUser.cover_photo_url} alt="Cover" className="h-24 w-full object-cover" />
        ) : (
          <div className="h-24 bg-gradient-to-r from-primary to-primary/60" />
        )}
        <CardContent className="p-6 -mt-10">
          <Avatar className="h-20 w-20 border-4 border-background mb-3">
            <AvatarImage src={profileUser.profile_picture_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">{initials}</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold">{fullName}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-foreground/85">
            <Badge variant="secondary" className="capitalize">{profileUser.role}</Badge>
            {profileUser.role === 'student' && profileUser.department && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {profileUser.department}
                </span>
              </>
            )}
            {profileUser.role === 'faculty' && profileUser.designation && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {profileUser.designation}
                </span>
              </>
            )}
          </div>

          {profileUser.bio && <p className="text-sm mt-3 text-foreground/90">{profileUser.bio}</p>}

          <div className="grid sm:grid-cols-2 gap-2 mt-4 text-sm text-foreground/90">
            {profileUser.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {profileUser.email}</div>}
            {profileUser.contact_no && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {profileUser.contact_no}</div>}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {profileUser.github && (
              <Button variant="outline" size="sm" asChild>
                <a href={profileUser.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            )}
            {profileUser.linkedin && (
              <Button variant="outline" size="sm" asChild>
                <a href={profileUser.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
            )}
            {profileUser.portfolio && (
              <Button variant="outline" size="sm" asChild>
                <a href={profileUser.portfolio} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4" />
                </a>
              </Button>
            )}
            {profileUser.leetcode && (
              <Button variant="outline" size="sm" asChild>
                <a href={profileUser.leetcode} target="_blank" rel="noopener noreferrer">
                  LeetCode
                </a>
              </Button>
            )}
            {resumeUrl && (
              <Button variant="default" size="sm" asChild>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  Resume
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {detailItems.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-foreground">Profile Details</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
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

      {profileUser.cover_letter && (
        <Card className="mb-4">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-foreground">Cover Letter</h3>
            <p className="text-sm text-foreground/90 whitespace-pre-line">{profileUser.cover_letter}</p>
          </CardContent>
        </Card>
      )}

      {skills.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-foreground">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string) => (
                <Badge key={skill} variant="outline" className="bg-primary/5">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {projects.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-foreground">Projects</h3>
            <div className="space-y-3">
              {projects.map((proj: any, i: number) => (
                <div key={proj.id || i} className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm text-foreground">{proj.title}</h4>
                  <p className="text-xs text-foreground/85 mt-1">{proj.description}</p>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs text-primary hover:underline">
                      View Project
                    </a>
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
            <h3 className="font-semibold mb-3 text-foreground">Achievements</h3>
            <div className="space-y-2">
              {achievements.map((ach: any, i: number) => (
                <div key={ach.id || i} className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{typeof ach === 'string' ? ach : ach.title}</p>
                    {ach.description && <p className="text-xs text-foreground/85">{ach.description}</p>}
                    {(ach.issuer || ach.date) && (
                      <p className="text-xs text-foreground/75">
                        {[ach.issuer, ach.date].filter(Boolean).join(' • ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserProfilePage;

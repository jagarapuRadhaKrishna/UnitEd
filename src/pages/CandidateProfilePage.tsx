import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Mail, GraduationCap, Briefcase, Award, Star, Globe, Loader2 } from 'lucide-react';

const CandidateProfilePage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const postId = (location.state as any)?.postId;
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (candidateId) fetchCandidate();
  }, [candidateId]);

  const fetchCandidate = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', candidateId!)
      .maybeSingle();

    if (!error && data) {
      setCandidate({
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown',
        role: data.role,
        headline: data.bio || `${data.role} at University`,
        email: data.email,
        department: data.department,
        year: data.year_of_graduation ? `Class of ${data.year_of_graduation}` : undefined,
        cgpa: data.cgpa,
        location: data.location,
        bio: data.bio || 'No bio provided',
        avatar: data.profile_picture_url,
        coverPhoto: data.cover_photo_url,
        skills: (data.skills || []).map((s: string) => ({ name: s, level: 75 })),
        projects: (data.projects as any[] || []).map((p: any) => ({
          title: p.title, description: p.description, technologies: p.skills || p.technologies || [],
        })),
        achievements: (data.achievements as any[] || []).map((a: any) => typeof a === 'string' ? a : a.title),
        designation: data.designation,
        github: data.github,
        linkedin: data.linkedin,
        portfolio: data.portfolio,
      });
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Candidate not found</h2>
        <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-2" /> Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => postId ? navigate(`/post/${postId}/candidates`) : navigate(-1)} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <Card className="mb-6 overflow-hidden">
        {candidate.coverPhoto ? (
          <img src={candidate.coverPhoto} alt="Cover" className="h-32 w-full object-cover" />
        ) : (
          <div className="h-32 bg-gradient-to-r from-primary to-accent" />
        )}
        <CardContent className="p-6 -mt-12">
          <div className="flex items-end gap-4 mb-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={candidate.avatar || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{candidate.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-1">
              <h1 className="text-2xl font-bold text-foreground">{candidate.name}</h1>
              <p className="text-muted-foreground">{candidate.headline}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            {candidate.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {candidate.email}</span>}
            {candidate.department && <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {candidate.department}</span>}
            {candidate.year && <span>{candidate.year}</span>}
            {candidate.cgpa && <span>CGPA: {candidate.cgpa}</span>}
            {candidate.location && <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {candidate.location}</span>}
          </div>
          <Badge variant="secondary" className="capitalize">{candidate.role}</Badge>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2">About</h3>
          <p className="text-muted-foreground leading-relaxed">{candidate.bio}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Skills</h3>
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

      {candidate.projects?.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Projects</h3>
            <div className="space-y-4">
              {candidate.projects.map((project: any, i: number) => (
                <div key={i} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-1">{project.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {(project.technologies || []).map((t: string) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {candidate.achievements?.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-accent-foreground" /> Achievements</h3>
            <ul className="space-y-2">
              {candidate.achievements.map((a: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground">🏆 {a}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateProfilePage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, GraduationCap, Briefcase, Github, Linkedin, Globe, Loader2 } from 'lucide-react';

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

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!profileUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold mb-4">User not found</h2>
        <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-2" /> Go Back</Button>
      </div>
    );
  }

  const fullName = `${profileUser.first_name || ''} ${profileUser.last_name || ''}`.trim() || 'Unknown';
  const initials = `${(profileUser.first_name || 'U')[0]}${(profileUser.last_name || '')[0] || ''}`;
  const skills: string[] = profileUser.skills || [];
  const projects: any[] = profileUser.projects as any[] || [];
  const achievements: any[] = profileUser.achievements as any[] || [];

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
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Badge variant="secondary" className="capitalize">{profileUser.role}</Badge>
            {profileUser.role === 'student' && profileUser.department && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{profileUser.department}</span>
              </>
            )}
            {profileUser.role === 'faculty' && profileUser.designation && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{profileUser.designation}</span>
              </>
            )}
          </div>

          {profileUser.bio && <p className="text-sm mt-3 text-muted-foreground">{profileUser.bio}</p>}

          <div className="flex gap-2 mt-3">
            {profileUser.github && (
              <Button variant="outline" size="sm" asChild><a href={profileUser.github} target="_blank" rel="noopener"><Github className="w-4 h-4" /></a></Button>
            )}
            {profileUser.linkedin && (
              <Button variant="outline" size="sm" asChild><a href={profileUser.linkedin} target="_blank" rel="noopener"><Linkedin className="w-4 h-4" /></a></Button>
            )}
            {profileUser.portfolio && (
              <Button variant="outline" size="sm" asChild><a href={profileUser.portfolio} target="_blank" rel="noopener"><Globe className="w-4 h-4" /></a></Button>
            )}
          </div>
        </CardContent>
      </Card>

      {skills.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Skills</h3>
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
            <h3 className="font-semibold mb-3">Projects</h3>
            <div className="space-y-3">
              {projects.map((proj: any, i: number) => (
                <div key={proj.id || i} className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">{proj.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {achievements.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Achievements</h3>
            <div className="space-y-2">
              {achievements.map((ach: any, i: number) => (
                <div key={ach.id || i} className="flex items-center gap-2">
                  <span>🏆</span>
                  <div>
                    <p className="text-sm font-medium">{typeof ach === 'string' ? ach : ach.title}</p>
                    {ach.description && <p className="text-xs text-muted-foreground">{ach.description}</p>}
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

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { User } from '@/types/united';
import { ArrowLeft, Mail, MapPin, GraduationCap, Briefcase, Github, Linkedin, Globe } from 'lucide-react';

const UserProfilePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const profileUser: User | undefined = users.find((u: User) => u.id === id);

  if (!profileUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold mb-4">User not found</h2>
        <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-2" /> Go Back</Button>
      </div>
    );
  }

  const fullName = `${profileUser.firstName} ${profileUser.lastName}`;
  const initials = `${profileUser.firstName[0]}${profileUser.lastName[0]}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <Card className="mb-6">
        <div className="h-24 bg-gradient-to-r from-primary to-primary/60 rounded-t-lg" />
        <CardContent className="p-6 -mt-10">
          <Avatar className="h-20 w-20 border-4 border-background mb-3">
            <AvatarImage src={profileUser.profilePicture} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">{initials}</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold">{fullName}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Badge variant="secondary" className="capitalize">{profileUser.role}</Badge>
            {profileUser.role === 'student' && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{profileUser.department}</span>
              </>
            )}
            {profileUser.role === 'faculty' && (
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

      {/* Skills */}
      {profileUser.skills.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profileUser.skills.map(skill => (
                <Badge key={skill} variant="outline" className="bg-primary/5">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {profileUser.projects.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Projects</h3>
            <div className="space-y-3">
              {profileUser.projects.map(proj => (
                <div key={proj.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">{proj.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      {profileUser.achievements.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Achievements</h3>
            <div className="space-y-2">
              {profileUser.achievements.map(ach => (
                <div key={ach.id} className="flex items-center gap-2">
                  <span className="text-united-amber">🏆</span>
                  <div>
                    <p className="text-sm font-medium">{ach.title}</p>
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

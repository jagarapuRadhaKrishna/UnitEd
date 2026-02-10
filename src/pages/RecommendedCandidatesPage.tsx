import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllPosts } from '@/data/mockData';
import { createInvitation } from '@/services/invitationService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UserCheck, Eye, Filter } from 'lucide-react';

interface Candidate {
  id: string; name: string; avatar?: string; role: string;
  department?: string; year?: string; cgpa?: string; position?: string;
  skills: string[]; matchPercentage: number;
}

const dummyCandidates: Candidate[] = [
  { id: 'student-1', name: 'Madhuri', role: 'student', department: 'Computer Science', year: '3rd Year', cgpa: '8.9', skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'], matchPercentage: 0 },
  { id: 'student-2', name: 'Maroof Khan', role: 'student', department: 'Information Technology', year: '4th Year', cgpa: '9.2', skills: ['React', 'Node.js', 'JavaScript', 'MongoDB'], matchPercentage: 0 },
  { id: 'student-3', name: 'Vedhakshi', role: 'student', department: 'Computer Science', year: '2nd Year', cgpa: '8.5', skills: ['Java', 'Python', 'UI/UX Design', 'React'], matchPercentage: 0 },
  { id: 'student-4', name: 'Rahul Sharma', role: 'student', department: 'Computer Science', year: '3rd Year', cgpa: '9.0', skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'], matchPercentage: 0 },
  { id: 'student-5', name: 'Priya Patel', role: 'student', department: 'Data Science', year: '4th Year', cgpa: '9.3', skills: ['Python', 'R', 'Machine Learning', 'Data Visualization'], matchPercentage: 0 },
  { id: 'student-6', name: 'Arjun Mehta', role: 'student', department: 'Information Technology', year: '2nd Year', cgpa: '8.7', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'], matchPercentage: 0 },
  { id: 'faculty-1', name: 'Dr. Satwika', role: 'faculty', department: 'Computer Science', position: 'Associate Professor', skills: ['Machine Learning', 'AI', 'Deep Learning', 'Research'], matchPercentage: 0 },
  { id: 'faculty-2', name: 'Prof. Annanya', role: 'faculty', department: 'Information Systems', position: 'Assistant Professor', skills: ['Data Science', 'Python', 'Statistics', 'R'], matchPercentage: 0 },
];

const RecommendedCandidatesPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());
  const [matchRange, setMatchRange] = useState([0]);

  const allPosts = getAllPosts(user);
  const post = allPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <Button variant="outline" onClick={() => navigate('/home')}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
      </div>
    );
  }

  const postSkills = post.skillRequirements.map(sr => sr.skill.toLowerCase());

  const candidates = dummyCandidates.map(c => {
    const cSkills = c.skills.map(s => s.toLowerCase());
    const matchCount = cSkills.filter(s => postSkills.some(ps => ps.includes(s) || s.includes(ps))).length;
    return { ...c, matchPercentage: postSkills.length > 0 ? Math.round((matchCount / postSkills.length) * 100) : 0 };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);

  const filtered = candidates.filter(c => c.matchPercentage >= matchRange[0]);

  const handleInvite = (candidateId: string, name: string) => {
    if (!user?.id) return;
    try {
      createInvitation(post.id, user.id, candidateId);
      setInvitedIds(prev => new Set([...prev, candidateId]));
      toast({ title: `Invitation sent to ${name}` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleInviteAll = () => {
    filtered.filter(c => !invitedIds.has(c.id)).forEach(c => handleInvite(c.id, c.name));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(`/post/${postId}`)} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Post
      </Button>

      <Card className="mb-6">
        <CardContent className="p-5">
          <h1 className="text-2xl font-bold text-foreground mb-1">Recommended Candidates</h1>
          <p className="text-muted-foreground mb-3">For: <strong>{post.title}</strong></p>
          <Badge className="bg-united-purple text-white border-0">{filtered.length} of {candidates.length} Matches</Badge>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3"><Filter className="w-4 h-4 text-united-purple" /> <h3 className="font-semibold">Filters</h3></div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Min Match: {matchRange[0]}%</p>
            <Slider value={matchRange} onValueChange={setMatchRange} max={100} step={5} className="w-full max-w-md" />
          </div>
          <Button className="bg-united-purple hover:bg-united-purple/90" onClick={handleInviteAll} disabled={filtered.every(c => invitedIds.has(c.id))}>
            <UserCheck className="w-4 h-4 mr-2" /> Invite All ({filtered.filter(c => !invitedIds.has(c.id)).length})
          </Button>
        </CardContent>
      </Card>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(candidate => (
          <Card key={candidate.id} className="hover:border-united-purple/30 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={candidate.avatar} />
                    <AvatarFallback className="bg-united-purple/10 text-united-purple text-sm">{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{candidate.role} {candidate.department && `• ${candidate.department}`}</p>
                    {candidate.year && <p className="text-xs text-muted-foreground">{candidate.year} {candidate.cgpa && `• CGPA: ${candidate.cgpa}`}</p>}
                    {candidate.position && <p className="text-xs text-muted-foreground">{candidate.position}</p>}
                  </div>
                </div>
                <Badge className={`shrink-0 text-xs border-0 ${candidate.matchPercentage >= 70 ? 'bg-united-green/10 text-united-green' : candidate.matchPercentage >= 40 ? 'bg-united-amber/10 text-united-amber' : 'bg-muted text-muted-foreground'}`}>
                  {candidate.matchPercentage}%
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {candidate.skills.map(skill => {
                  const isMatch = postSkills.some(ps => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps));
                  return <Badge key={skill} variant={isMatch ? 'default' : 'outline'} className={isMatch ? 'bg-united-green/10 text-united-green border-0 text-[10px]' : 'text-[10px]'}>{skill}</Badge>;
                })}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/candidate/${candidate.id}`, { state: { postId } })}>
                  <Eye className="w-3.5 h-3.5 mr-1" /> Profile
                </Button>
                <Button
                  size="sm"
                  className={`flex-1 ${invitedIds.has(candidate.id) ? '' : 'bg-united-purple hover:bg-united-purple/90'}`}
                  variant={invitedIds.has(candidate.id) ? 'secondary' : 'default'}
                  disabled={invitedIds.has(candidate.id)}
                  onClick={() => handleInvite(candidate.id, candidate.name)}
                >
                  {invitedIds.has(candidate.id) ? 'Invited' : 'Invite'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCandidatesPage;

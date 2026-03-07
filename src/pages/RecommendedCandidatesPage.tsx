import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UserCheck, Eye, Filter, Loader2 } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  department: string | null;
  cgpa: string | null;
  designation: string | null;
  skills: string[];
  matchPercentage: number;
}

const RecommendedCandidatesPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());
  const [matchRange, setMatchRange] = useState([0]);
  const [post, setPost] = useState<any>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) fetchData();
  }, [postId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId!)
        .maybeSingle();

      if (postError || !postData) {
        setPost(null);
        setLoading(false);
        return;
      }
      setPost(postData);

      const skills = Array.isArray(postData.skill_requirements) ? postData.skill_requirements : [];
      const requirements = skills.map((sr: any) => ({
        skills: sr.skills || (sr.skill ? [sr.skill] : []),
        requiredCount: sr.requiredCount || 1,
      }));

      // Fetch all profiles except current user
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, profile_picture_url, role, department, cgpa, designation, skills')
        .eq('role', 'student')
        .neq('id', user?.id || '');

      // Fetch already invited users for this post
      const { data: existingInvites } = await supabase
        .from('invitations')
        .select('invitee_id')
        .eq('post_id', postId!)
        .eq('inviter_id', user?.id || '');

      const alreadyInvited = new Set((existingInvites || []).map(i => i.invitee_id));
      setInvitedIds(alreadyInvited);

      // Score candidates
      const scored = (profiles || []).filter((p) => p.role === 'student').map(p => {
        const pSkills = (p.skills || []).map((s: string) => s.toLowerCase());
        const satisfied = requirements.filter((req: any) =>
          req.skills.every((rs: string) => pSkills.some((ps: string) => ps.includes(rs.toLowerCase()) || rs.toLowerCase().includes(ps)))
        ).length;
        const matchPercentage = requirements.length > 0 ? Math.round((satisfied / requirements.length) * 100) : 0;
        return {
          id: p.id,
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
          avatar: p.profile_picture_url,
          role: p.role,
          department: p.department,
          cgpa: p.cgpa,
          designation: p.designation,
          skills: p.skills || [],
          matchPercentage,
        };
      }).sort((a, b) => b.matchPercentage - a.matchPercentage);

      setCandidates(scored);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (candidateId: string, name: string) => {
    if (!user?.id || !postId) return;
    try {
      const { error } = await supabase.from('invitations').insert({
        post_id: postId,
        inviter_id: user.id,
        invitee_id: candidateId,
      });
      if (error) throw error;
      setInvitedIds(prev => new Set([...prev, candidateId]));

      // Send notification to the invitee
      await supabase.from('notifications').insert({
        user_id: candidateId,
        type: 'invitation_received',
        title: 'New Invitation',
        message: `${user.firstName || ''} ${user.lastName || ''} invited you to join "${post?.title || 'a project'}"`,
        link: '/invitations',
        related_post_id: postId,
        related_user_id: user.id,
      });

      toast({ title: `Invitation sent to ${name}` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const filtered = candidates.filter(c => c.matchPercentage >= matchRange[0]);

  const handleInviteAll = () => {
    filtered.filter(c => !invitedIds.has(c.id)).forEach(c => handleInvite(c.id, c.name));
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <Button variant="outline" onClick={() => navigate('/home')}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
      </div>
    );
  }

  const postSkills = (Array.isArray(post.skill_requirements) ? post.skill_requirements : [])
    .flatMap((sr: any) => (sr.skills ? sr.skills : sr.skill ? [sr.skill] : []))
    .map((s: string) => s.toLowerCase());

  const handleBack = () => {
    // Prefer returning to home with the "my" tab so authors land on their posts list
    navigate('/home', { state: { activeTab: 'my' } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={handleBack} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Post
      </Button>

      <Card className="mb-6">
        <CardContent className="p-5">
          <h1 className="text-2xl font-bold text-foreground mb-1">Recommended Candidates</h1>
          <p className="text-muted-foreground mb-3">For: <strong>{post.title}</strong></p>
          <Badge variant="default">{filtered.length} of {candidates.length} Matches</Badge>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3"><Filter className="w-4 h-4 text-primary" /> <h3 className="font-semibold">Filters</h3></div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Min Match: {matchRange[0]}%</p>
            <Slider value={matchRange} onValueChange={setMatchRange} max={100} step={5} className="w-full max-w-md" />
          </div>
          <Button onClick={handleInviteAll} disabled={filtered.every(c => invitedIds.has(c.id))}>
            <UserCheck className="w-4 h-4 mr-2" /> Invite All ({filtered.filter(c => !invitedIds.has(c.id)).length})
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(candidate => (
          <Card key={candidate.id} className="hover:border-primary/30 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={candidate.avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{candidate.role} {candidate.department && `• ${candidate.department}`}</p>
                    {candidate.role === 'student' && candidate.cgpa && <p className="text-xs text-muted-foreground">CGPA: {candidate.cgpa}</p>}
                    {candidate.role === 'faculty' && candidate.designation && <p className="text-xs text-muted-foreground">{candidate.designation}</p>}
                  </div>
                </div>
                <Badge className={`shrink-0 text-xs border-0 ${candidate.matchPercentage >= 70 ? 'bg-accent/20 text-accent-foreground' : candidate.matchPercentage >= 40 ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {candidate.matchPercentage}%
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {candidate.skills.map(skill => {
                  const isMatch = postSkills.some((ps: string) => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps));
                  return <Badge key={skill} variant={isMatch ? 'default' : 'outline'} className={isMatch ? 'bg-accent/20 text-accent-foreground border-0 text-[10px]' : 'text-[10px]'}>{skill}</Badge>;
                })}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/candidate/${candidate.id}`, { state: { postId } })}>
                  <Eye className="w-3.5 h-3.5 mr-1" /> Profile
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
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

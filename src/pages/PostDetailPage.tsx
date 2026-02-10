import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllPosts } from '@/data/mockData';
import { createApplication, getUserApplications } from '@/services/applicationService';
import { createInvitation, getPostInvitations } from '@/services/invitationService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, Users, Calendar, Target, Award, CheckCircle, Send, UserCheck, Star, Briefcase, MessageSquare,
} from 'lucide-react';

const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [motivation, setMotivation] = useState('');
  const [experience, setExperience] = useState('');
  const [invitedCandidateIds, setInvitedCandidateIds] = useState<Set<string>>(new Set());

  const allPosts = getAllPosts(user);
  const postData = allPosts.find(p => p.id === id);

  const isAuthor = user?.id === postData?.author.id ||
    `${user?.firstName} ${user?.lastName}` === postData?.author.name;

  useEffect(() => {
    if (user?.id && postData?.id) {
      const userApps = getUserApplications(user.id);
      setHasApplied(userApps.some(app => app.postId === postData.id));
    }
  }, [user?.id, postData?.id]);

  useEffect(() => {
    if (isAuthor && postData?.id) {
      const invitations = getPostInvitations(postData.id);
      setInvitedCandidateIds(new Set(invitations.map(inv => inv.inviteeId)));
    }
  }, [isAuthor, postData?.id]);

  if (!postData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <Button variant="outline" onClick={() => navigate('/home')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </div>
    );
  }

  const totalRequired = postData.skillRequirements.reduce((s, r) => s + r.requiredCount, 0);
  const totalAccepted = postData.skillRequirements.reduce((s, r) => s + (r.acceptedCount || 0), 0);
  const progress = totalRequired > 0 ? (totalAccepted / totalRequired) * 100 : 0;

  const handleApply = () => {
    if (!user?.id) return;
    try {
      createApplication({
        postId: postData.id, applicantId: user.id,
        coverLetter: motivation,
        answers: [{ question: 'Experience', answer: experience }],
      });
      setHasApplied(true);
      setOpenApplyDialog(false);
      toast({ title: 'Application submitted!', description: 'Your application has been sent successfully.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleInvite = (candidateId: string) => {
    if (!user?.id) return;
    try {
      createInvitation(postData.id, user.id, candidateId);
      setInvitedCandidateIds(prev => new Set([...prev, candidateId]));
      toast({ title: 'Invitation sent!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // Get matched candidates for the author view
  const getMatchedUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const postSkills = postData.skillRequirements.map(sr => sr.skill.toLowerCase());
    return registeredUsers
      .filter((u: any) => u.id !== user?.id)
      .map((u: any) => {
        const userSkills = (u.skills || []).map((s: string) => s.toLowerCase());
        const matchCount = postSkills.filter(ps => userSkills.some((us: string) => us.includes(ps) || ps.includes(us))).length;
        const matchScore = postSkills.length > 0 ? Math.round((matchCount / postSkills.length) * 100) : 0;
        return { id: u.id, name: `${u.firstName} ${u.lastName}`, skills: u.skills || [], avatar: u.profilePicture, role: u.role, department: u.department, matchScore };
      })
      .filter((c: any) => c.matchScore > 0)
      .sort((a: any, b: any) => b.matchScore - a.matchScore);
  };

  const matchedUsers = isAuthor ? getMatchedUsers() : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      {/* Post Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-united-purple/10 text-united-purple">{postData.purpose}</Badge>
                <Badge variant={postData.status === 'active' ? 'default' : 'secondary'}>
                  {postData.status === 'active' ? 'Open' : postData.status}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{postData.title}</h1>
              <p className="text-muted-foreground mb-4">{postData.description}</p>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
            <Avatar>
              <AvatarImage src={postData.author.avatar} />
              <AvatarFallback className="bg-united-purple text-white">{postData.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{postData.author.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{postData.author.type}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(postData.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{totalAccepted}/{totalRequired} members</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span>{postData.applications.length} applications</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>{postData.skillRequirements.length} skills needed</span>
            </div>
          </div>

          {/* Team Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Team Progress</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Separator className="my-4" />

          {/* Skills */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Award className="w-4 h-4" /> Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {postData.skillRequirements.map(sr => (
                <Badge key={sr.skill} variant="outline" className="bg-united-blue/5 border-united-blue/20 text-united-blue">
                  {sr.skill} ({sr.acceptedCount || 0}/{sr.requiredCount})
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {isAuthor ? (
              <>
                <Button onClick={() => navigate(`/post/manage/${postData.id}`)} className="bg-united-purple hover:bg-united-purple/90">
                  <Users className="w-4 h-4 mr-2" /> Manage Applicants
                </Button>
                <Button variant="outline" onClick={() => navigate(`/post/${postData.id}/candidates`)}>
                  <UserCheck className="w-4 h-4 mr-2" /> View Candidates
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setOpenApplyDialog(true)}
                disabled={hasApplied || postData.status !== 'active'}
                className="bg-united-blue hover:bg-united-blue/90"
              >
                {hasApplied ? <><CheckCircle className="w-4 h-4 mr-2" /> Applied</> : <><Send className="w-4 h-4 mr-2" /> Apply Now</>}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Candidates (Author Only) */}
      {isAuthor && matchedUsers.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-united-orange" /> Recommended Candidates</h3>
            <div className="space-y-3">
              {matchedUsers.slice(0, 5).map((candidate: any) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-united-purple/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={candidate.avatar} />
                      <AvatarFallback className="bg-united-purple/10 text-united-purple text-sm">{candidate.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{candidate.role} • {candidate.matchScore}% match</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={invitedCandidateIds.has(candidate.id) ? 'secondary' : 'default'}
                    disabled={invitedCandidateIds.has(candidate.id)}
                    onClick={() => handleInvite(candidate.id)}
                    className={invitedCandidateIds.has(candidate.id) ? '' : 'bg-united-purple hover:bg-united-purple/90'}
                  >
                    {invitedCandidateIds.has(candidate.id) ? 'Invited' : 'Invite'}
                  </Button>
                </div>
              ))}
            </div>
            {matchedUsers.length > 5 && (
              <Button variant="link" onClick={() => navigate(`/post/${postData.id}/candidates`)} className="mt-3 text-united-purple">
                View all {matchedUsers.length} candidates →
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Apply Dialog */}
      <Dialog open={openApplyDialog} onOpenChange={setOpenApplyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for {postData.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Why are you interested? *</Label>
              <Textarea value={motivation} onChange={e => setMotivation(e.target.value)} placeholder="Share your motivation..." className="mt-1" />
            </div>
            <div>
              <Label>Relevant Experience</Label>
              <Textarea value={experience} onChange={e => setExperience(e.target.value)} placeholder="Describe your relevant experience..." className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenApplyDialog(false)}>Cancel</Button>
            <Button onClick={handleApply} disabled={!motivation.trim()} className="bg-united-blue hover:bg-united-blue/90">Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostDetailPage;

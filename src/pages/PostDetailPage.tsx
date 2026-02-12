import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, Users, Calendar, Target, Award, CheckCircle, Send, UserCheck, Star, Briefcase, UserPlus,
} from 'lucide-react';

interface SkillRequirement {
  skill: string;
  requiredCount: number;
  acceptedCount?: number;
}

interface PostDetail {
  id: string;
  title: string;
  description: string;
  purpose: string;
  status: string;
  author_id: string;
  skill_requirements: SkillRequirement[];
  created_at: string;
  current_members: number;
  max_members: number | null;
  author: { id: string; name: string; avatar?: string; type: string };
  applicationCount: number;
}

const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [hasInvited, setHasInvited] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [motivation, setMotivation] = useState('');
  const [experience, setExperience] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        setLoading(false);
        return;
      }

      // Fetch author profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, profile_picture_url')
        .eq('id', data.author_id)
        .maybeSingle();

      // Count applications
      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', id);

      // Check if current user already applied
      if (user?.id) {
        const [appRes, invRes] = await Promise.all([
          supabase.from('applications').select('id').eq('post_id', id).eq('applicant_id', user.id).maybeSingle(),
          supabase.from('invitations').select('id, status').eq('post_id', id).eq('inviter_id', user.id).eq('invitee_id', data.author_id).in('status', ['pending', 'accepted']).maybeSingle(),
        ]);
        setHasApplied(!!appRes.data);
        setHasInvited(!!invRes.data);
        setInviteStatus(invRes.data?.status || null);
      }

      const reqs = (data.skill_requirements as unknown as SkillRequirement[]) || [];

      setPost({
        id: data.id,
        title: data.title,
        description: data.description,
        purpose: data.purpose,
        status: data.status,
        author_id: data.author_id,
        skill_requirements: reqs,
        created_at: data.created_at,
        current_members: data.current_members,
        max_members: data.max_members,
        author: {
          id: data.author_id,
          name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown',
          avatar: profile?.profile_picture_url || undefined,
          type: profile?.role === 'faculty' ? 'Faculty' : 'Student',
        },
        applicationCount: count || 0,
      });
      setLoading(false);
    };
    fetchPost();
  }, [id, user?.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <Button variant="outline" onClick={() => navigate('/home')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </div>
    );
  }

  const isAuthor = user?.id === post.author_id;
  const totalRequired = post.skill_requirements.reduce((s, r) => s + r.requiredCount, 0);
  const totalAccepted = post.skill_requirements.reduce((s, r) => s + (r.acceptedCount || 0), 0);
  const progress = totalRequired > 0 ? (totalAccepted / totalRequired) * 100 : 0;

  const handleInvite = async () => {
    if (!user?.id || !id || !post) return;
    setInviting(true);
    try {
      const { error } = await supabase.from('invitations').insert({
        post_id: id,
        inviter_id: user.id,
        invitee_id: post.author_id,
        status: 'pending',
      });
      if (error) throw error;

      // Notify the post author
      await supabase.from('notifications').insert({
        user_id: post.author_id,
        type: 'invitation_received',
        title: 'New Invitation Received',
        message: `${user?.firstName || ''} ${user?.lastName || ''} invited you to collaborate on "${post.title}"`,
        link: '/invitations',
        related_post_id: id,
        related_user_id: user.id,
      });

      setHasInvited(true);
      toast({ title: 'Invitation sent!', description: `${post.author.name} will see it in their invitations.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setInviting(false);
    }
  };

  const handleApply = async () => {
    if (!user?.id || !id) return;
    setSubmitting(true);
    const { error } = await supabase.from('applications').insert({
      post_id: id,
      applicant_id: user.id,
      cover_letter: motivation,
      answers: [{ question: 'Experience', answer: experience }],
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    // Notify post author about new application
    if (post && post.author_id !== user.id) {
      await supabase.from('notifications').insert({
        user_id: post.author_id,
        type: 'application_received',
        title: 'New Application Received',
        message: `${user?.firstName || ''} ${user?.lastName || ''} applied for "${post.title}"`,
        link: `/applications`,
        related_post_id: id,
        related_user_id: user.id,
      });
    }

    setHasApplied(true);
    setOpenApplyDialog(false);
    toast({ title: 'Application submitted!', description: 'Your application has been sent successfully.' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-united-purple/10 text-united-purple">{post.purpose}</Badge>
                <Badge variant={post.status === 'active' ? 'default' : 'secondary'}>
                  {post.status === 'active' ? 'Open' : post.status}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{post.title}</h1>
              <p className="text-muted-foreground mb-4">{post.description}</p>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback className="bg-united-purple text-white">{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{post.author.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{post.author.type}</p>
              </div>
            </div>
            {isAuthor && post.status === 'active' && (
              <Button size="sm" onClick={() => navigate(`/post/${post.id}/candidates`)} className="bg-united-purple hover:bg-united-purple/90">
                <UserPlus className="w-4 h-4 mr-1" /> Invite
              </Button>
            )}
            {!isAuthor && post.status === 'active' && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleInvite}
                disabled={hasInvited || inviting}
                className="border-united-purple/40 text-united-purple hover:bg-united-purple/10"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                {hasInvited ? 'Invited' : inviting ? 'Sending...' : 'Invite'}
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{totalAccepted}/{totalRequired} members</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span>{post.applicationCount} applications</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>{post.skill_requirements.length} skills needed</span>
            </div>
          </div>

          {/* Progress */}
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
              {post.skill_requirements.map(sr => (
                <Badge key={sr.skill} variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                  {sr.skill} ({sr.acceptedCount || 0}/{sr.requiredCount})
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {isAuthor ? (
              <>
                <Button onClick={() => navigate(`/post/manage/${post.id}`)} className="bg-united-purple hover:bg-united-purple/90">
                  <Users className="w-4 h-4 mr-2" /> Manage Applicants
                </Button>
                <Button onClick={() => navigate(`/post/${post.id}/candidates`)} className="bg-primary">
                  <UserPlus className="w-4 h-4 mr-2" /> Invite
                </Button>
                <Button variant="outline" onClick={() => navigate(`/post/${post.id}/candidates`)}>
                  <UserCheck className="w-4 h-4 mr-2" /> View Candidates
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setOpenApplyDialog(true)}
                disabled={hasApplied || post.status !== 'active'}
              >
                {hasApplied ? <><CheckCircle className="w-4 h-4 mr-2" /> Applied</> : <><Send className="w-4 h-4 mr-2" /> Apply Now</>}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Apply Dialog */}
      <Dialog open={openApplyDialog} onOpenChange={setOpenApplyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for {post.title}</DialogTitle>
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
            <Button onClick={handleApply} disabled={!motivation.trim() || submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostDetailPage;

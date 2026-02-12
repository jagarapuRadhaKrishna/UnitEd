import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, CheckCircle, XCircle, Mail, Award, Clock } from 'lucide-react';

interface AppWithProfile {
  id: string;
  applicant_id: string;
  status: string;
  cover_letter: string | null;
  applied_at: string;
  applied_for_skill: string | null;
  applicant: {
    name: string;
    email: string;
    skills: string[];
  };
}

const PostManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<AppWithProfile[]>([]);
  const [postTitle, setPostTitle] = useState('');
  const [totalRequired, setTotalRequired] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);

      // Fetch post
      const { data: post } = await supabase
        .from('posts')
        .select('title, skill_requirements')
        .eq('id', id)
        .maybeSingle();

      if (post) {
        setPostTitle(post.title);
        const reqs = (post.skill_requirements as unknown as { requiredCount: number }[]) || [];
        setTotalRequired(reqs.reduce((s, r) => s + r.requiredCount, 0));
      }

      // Fetch applications for this post
      const { data: apps } = await supabase
        .from('applications')
        .select('*')
        .eq('post_id', id)
        .order('applied_at', { ascending: false });

      if (apps && apps.length > 0) {
        // Fetch applicant profiles
        const applicantIds = [...new Set(apps.map(a => a.applicant_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, skills')
          .in('id', applicantIds);

        const profileMap = new Map((profiles || []).map(p => [p.id, p]));

        setApplications(apps.map(a => {
          const profile = profileMap.get(a.applicant_id);
          return {
            id: a.id,
            applicant_id: a.applicant_id,
            status: a.status,
            cover_letter: a.cover_letter,
            applied_at: a.applied_at,
            applied_for_skill: a.applied_for_skill,
            applicant: {
              name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown',
              email: profile?.email || '',
              skills: profile?.skills || [],
            },
          };
        }));
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleStatusUpdate = async (appId: string, applicantId: string, status: 'shortlisted' | 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('applications')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', appId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    toast({ title: `Application ${status}` });

    // If accepted, add applicant to the chatroom
    if (status === 'accepted' && id) {
      try {
        // Check if chatroom already exists for this post
        const { data: existingChatroom } = await supabase
          .from('chatrooms')
          .select('id')
          .eq('post_id', id)
          .eq('status', 'active')
          .maybeSingle();

        let chatroomId: string;

        if (existingChatroom) {
          chatroomId = existingChatroom.id;
        } else {
          // Create new chatroom
          const { data: newChatroom, error: crError } = await supabase
            .from('chatrooms')
            .insert({ post_id: id, status: 'active' })
            .select('id')
            .single();
          if (crError || !newChatroom) throw crError;
          chatroomId = newChatroom.id;

          // Add post author as admin
          await supabase.from('chatroom_members').insert({
            chatroom_id: chatroomId,
            user_id: user!.id,
            role: 'admin',
          });

          // Update post with chatroom reference
          await supabase.from('posts').update({
            chatroom_id: chatroomId,
            chatroom_enabled: true,
          }).eq('id', id);
        }

        // Check if applicant is already a member
        const { data: existingMember } = await supabase
          .from('chatroom_members')
          .select('id')
          .eq('chatroom_id', chatroomId)
          .eq('user_id', applicantId)
          .maybeSingle();

        if (!existingMember) {
          await supabase.from('chatroom_members').insert({
            chatroom_id: chatroomId,
            user_id: applicantId,
            role: 'member',
          });
        }

        // Get applicant name for system message
        const app = applications.find(a => a.id === appId);
        const applicantName = app?.applicant.name || 'A new member';

        // Send system message
        await supabase.from('messages').insert({
          chatroom_id: chatroomId,
          sender_id: user!.id,
          content: `${applicantName} has been accepted and joined the team! 🎉`,
          type: 'system',
        });

        // Notify the applicant
        await supabase.from('notifications').insert({
          user_id: applicantId,
          type: 'application_accepted',
          title: 'Application Accepted! 🎉',
          message: `Your application for "${postTitle}" has been accepted. A chat room is ready!`,
          link: `/chatroom/${chatroomId}`,
          related_post_id: id,
          related_chatroom_id: chatroomId,
        });
      } catch (chatError) {
        console.error('Error adding to chatroom:', chatError);
      }
    }
  };

  const pending = applications.filter(a => a.status === 'applied' || a.status === 'shortlisted');
  const accepted = applications.filter(a => a.status === 'accepted');
  const rejected = applications.filter(a => a.status === 'rejected');

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/my-posts')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Applicants</h1>
          <p className="text-muted-foreground">{postTitle || 'Post'}</p>
        </div>
      </div>

      {/* Stats */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-3xl font-bold text-united-purple">{applications.length}</p>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <p className="text-3xl font-bold text-united-green">{accepted.length}</p>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <p className="text-3xl font-bold text-united-amber">{pending.length}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Team Progress</p>
              <p className="text-lg font-semibold">{accepted.length} / {totalRequired} Members</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3">Pending Applications ({pending.length})</h3>
          <div className="space-y-3">
            {pending.map(app => (
              <Card key={app.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-5">
                  <div className="flex gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-united-purple text-white font-semibold">
                        {app.applicant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{app.applicant.name}</p>
                        <Badge className="bg-united-amber/10 text-united-amber border-0 text-xs capitalize">
                          <Clock className="w-3 h-3 mr-1" /> {app.status}
                        </Badge>
                      </div>
                      <div className="flex gap-3 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {app.applicant.email}</span>
                        <span>Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mr-1"><Award className="w-3 h-3" /> Skills:</span>
                        {app.applicant.skills.slice(0, 5).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-[10px] bg-united-purple/5 text-united-purple">{skill}</Badge>
                        ))}
                      </div>
                      {app.cover_letter && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-3">
                          <p className="text-sm italic text-muted-foreground">"{app.cover_letter}"</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-united-green hover:bg-united-green/90" onClick={() => handleStatusUpdate(app.id, app.applicant_id, 'accepted')}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => handleStatusUpdate(app.id, app.applicant_id, 'rejected')}>
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                        <Button size="sm" variant="ghost" className="text-united-purple" onClick={() => navigate(`/candidate/${app.applicant_id}`)}>
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Accepted */}
      {accepted.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3">Accepted Members ({accepted.length})</h3>
          <div className="space-y-2">
            {accepted.map(app => (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-united-green text-white">{app.applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{app.applicant.name}</p>
                      <p className="text-sm text-muted-foreground">{app.applicant.email}</p>
                    </div>
                    <Badge className="bg-united-green/10 text-united-green border-0">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accepted
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <div>
          <h3 className="font-semibold text-muted-foreground mb-3">Rejected ({rejected.length})</h3>
          <div className="space-y-2">
            {rejected.map(app => (
              <Card key={app.id} className="opacity-60">
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted">{app.applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{app.applicant.name}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Rejected</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <p className="text-lg text-muted-foreground">No applications yet</p>
            <p className="text-sm text-muted-foreground mt-1">Share your post to attract applicants</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PostManagePage;

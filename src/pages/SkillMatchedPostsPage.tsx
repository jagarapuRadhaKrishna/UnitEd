import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Briefcase, Target, Loader2, Users } from 'lucide-react';
import { fetchPostMemberCounts, isPostDeadlineReached, syncExpiredPosts } from '@/services/postAvailabilityService';
import { getDescriptionPreviewText } from '@/lib/post-description';

interface MatchedPost {
  id: string;
  title: string;
  description: string;
  purpose: string;
  skill_requirements: any[];
  created_at: string;
  status: string;
  deadline: string | null;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  application_count: number;
  required_members: number;
  accepted_members: number;
  matchScore: number;
}

const SkillMatchedPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matchedPosts, setMatchedPosts] = useState<MatchedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const hasLoadedOnceRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    void fetchMatchedPosts(hasLoadedOnceRef.current);
  }, [user, refreshTick]);

  const fetchMatchedPosts = useCallback(async (backgroundRefresh = false) => {
    if (!user) return;
    if (!backgroundRefresh || !hasLoadedOnceRef.current) {
      setLoading(true);
    }
    try {
      await syncExpiredPosts();
      const userSkills = (user.skills || []).map(s => s.toLowerCase());

      // Fetch active posts not authored by the current user
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'active')
        .neq('author_id', user.id);

      if (error) throw error;

      // Fetch author profiles and application counts
      const authorIds = [...new Set((posts || []).map(p => p.author_id))];
      const postIds = (posts || []).map(p => p.id);

      const [profilesRes, appsRes, acceptedAppsRes, acceptedInvsRes, rpcMemberCounts] = await Promise.all([
        authorIds.length > 0
          ? supabase.from('profiles').select('id, first_name, last_name, profile_picture_url').in('id', authorIds)
          : { data: [], error: null },
        postIds.length > 0
          ? supabase.from('applications').select('post_id').in('post_id', postIds)
          : { data: [], error: null },
        postIds.length > 0
          ? supabase.from('applications').select('post_id, applicant_id').in('post_id', postIds).eq('status', 'accepted')
          : { data: [], error: null },
        postIds.length > 0
          ? supabase.from('invitations').select('post_id, invitee_id').in('post_id', postIds).eq('status', 'accepted')
          : { data: [], error: null },
        fetchPostMemberCounts(postIds),
      ]);

      const profileMap: Record<string, any> = {};
      (profilesRes.data || []).forEach(p => { profileMap[p.id] = p; });

      const appCountMap: Record<string, number> = {};
      (appsRes.data || []).forEach(a => { appCountMap[a.post_id] = (appCountMap[a.post_id] || 0) + 1; });

      const acceptedMemberSets: Record<string, Set<string>> = {};
      (acceptedAppsRes.data || []).forEach((a: any) => {
        acceptedMemberSets[a.post_id] ??= new Set<string>();
        acceptedMemberSets[a.post_id].add(a.applicant_id);
      });
      (acceptedInvsRes.data || []).forEach((a: any) => {
        acceptedMemberSets[a.post_id] ??= new Set<string>();
        acceptedMemberSets[a.post_id].add(a.invitee_id);
      });

      // Score and sort
      const scored = (posts || []).map(post => {
        const skills = Array.isArray(post.skill_requirements) ? post.skill_requirements : [];
        const requirements = skills.map((sr: any) => ({
          skills: sr.skills || (sr.skill ? [sr.skill] : []),
          requiredCount: sr.requiredCount || 1,
        }));

        const satisfiedCount = requirements.filter((req) =>
          req.skills.every((rs: string) => userSkills.some((us) => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us)))
        ).length;
        const matchScore = requirements.length > 0 ? Math.round((satisfiedCount / requirements.length) * 100) : 0;
        const author = profileMap[post.author_id];
        const requiredMembers = post.max_members ?? requirements.reduce((sum: number, req: any) => sum + req.requiredCount, 0);
        const acceptedMembers = Math.max(
          0,
          rpcMemberCounts.get(post.id) ?? 0,
          post.current_members ?? 0,
          acceptedMemberSets[post.id]?.size ?? 0
        );
        return {
          id: post.id,
          title: post.title,
          description: post.description,
          purpose: post.purpose,
          skill_requirements: skills,
          created_at: post.created_at,
          status: post.status,
          deadline: post.deadline || null,
          author_id: post.author_id,
          author_name: author ? `${author.first_name || ''} ${author.last_name || ''}`.trim() : 'Unknown',
          author_avatar: author?.profile_picture_url || null,
          application_count: appCountMap[post.id] || 0,
          required_members: requiredMembers,
          accepted_members: acceptedMembers,
          matchScore,
        };
      }).filter(
        p =>
          p.matchScore > 0 &&
          !isPostDeadlineReached(p.deadline) &&
          !(p.required_members > 0 && p.accepted_members >= p.required_members)
      )
        .sort((a, b) => b.matchScore - a.matchScore);

      setMatchedPosts(scored);
    } catch (err) {
      console.error('Error fetching matched posts:', err);
    } finally {
      hasLoadedOnceRef.current = true;
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('skill-matched-posts-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => setRefreshTick((tick) => tick + 1))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitations' }, () => setRefreshTick((tick) => tick + 1))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chatroom_members' }, () => setRefreshTick((tick) => tick + 1))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => setRefreshTick((tick) => tick + 1))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const intervalId = window.setInterval(() => {
      setRefreshTick((tick) => tick + 1);
    }, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setRefreshTick((tick) => tick + 1);
      }
    };

    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">🎯 Opportunities Matching Your Skills</h1>
        <p className="text-muted-foreground mb-3">Find opportunities that match your expertise</p>
        {user?.skills && user.skills.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground">Your Skills:</span>
            {user.skills.slice(0, 8).map(skill => (
              <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
            ))}
          </div>
        )}
      </div>

      {matchedPosts.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <p className="text-lg text-muted-foreground mb-2">No opportunities matching your skills yet</p>
            <p className="text-sm text-muted-foreground mb-4">Try updating your skills or check back later</p>
            <Button onClick={() => navigate('/profile')}>Update Your Skills</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchedPosts.map(post => {
            const userSkills = (user?.skills || []).map(s => s.toLowerCase());
            const skills = post.skill_requirements.map((sr: any) => {
              const reqSkills = sr.skills || (sr.skill ? [sr.skill] : []);
              return reqSkills.join(' + ');
            });
            return (
              <Card key={post.id} className="hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={post.author_avatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{post.author_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Posted by</p>
                      <p className="text-sm font-semibold truncate">{post.author_name}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-0 text-xs shrink-0">{post.matchScore}% match</Badge>
                  </div>

                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{getDescriptionPreviewText(post.description)}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">{post.purpose}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {skills.map((skill: string) => {
                      const isMatched = userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us));
                      return (
                        <Badge key={skill} variant={isMatched ? 'default' : 'outline'} className={isMatched ? 'bg-accent/20 text-accent-foreground border-0 text-xs' : 'text-xs'}>
                          {skill}
                        </Badge>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 text-xs text-muted-foreground mt-auto flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {post.accepted_members}/{post.required_members}</span>
                    <span>{post.application_count} applications</span>
                  </div>

                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button size="sm" className="flex-1" onClick={e => { e.stopPropagation(); navigate(`/post/${post.id}`); }}>View Details</Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={e => { e.stopPropagation(); navigate(`/post/${post.id}`); }}>Apply</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillMatchedPostsPage;

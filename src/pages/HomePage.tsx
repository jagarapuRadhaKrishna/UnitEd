import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Users, Calendar, MessageSquare, Plus, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SkillRequirement {
  skills: string[];
  requiredCount: number;
  acceptedCount?: number;
  skill?: string; // legacy
}

interface HomePost {
  id: string;
  title: string;
  description: string;
  author: { id: string; name: string; avatar?: string; type: 'Student' | 'Faculty' };
  skills: string[];
  requirements: SkillRequirement[];
  requiredMembers: number;
  acceptedMembers: number;
  purpose: string;
  createdAt: string;
  isOwned: boolean;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const initialTab = (location.state as any)?.activeTab ?? 'all';
  const [filterTab, setFilterTab] = useState(initialTab);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [posts, setPosts] = useState<HomePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [confirmDeletePostId, setConfirmDeletePostId] = useState<string | null>(null);
  const [animatingDeletePostId, setAnimatingDeletePostId] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles!posts_author_id_fkey(id, first_name, last_name, role, profile_picture_url)')
      .in('status', ['active', 'filled'])
        .order('created_at', { ascending: false });

      const memberSets = new Map<string, Set<string>>();
      const chatroomMap = new Map<string, string>(); // postId -> chatroomId
      if (data && data.length > 0) {
        data.forEach((p: any) => {
          if (p.chatroom_id) chatroomMap.set(p.id, p.chatroom_id);
        });

        const postIds = data.map((p: any) => p.id);
        const [{ data: acceptedApps }, { data: acceptedInvs }, chatMembersRes] = await Promise.all([
          supabase
            .from('applications')
            .select('post_id, applicant_id')
            .in('post_id', postIds)
            .eq('status', 'accepted'),
          supabase
            .from('invitations')
            .select('post_id, invitee_id')
            .in('post_id', postIds)
            .eq('status', 'accepted'),
          chatroomMap.size > 0
            ? supabase
                .from('chatroom_members')
                .select('chatroom_id, user_id')
                .in('chatroom_id', Array.from(chatroomMap.values()))
            : Promise.resolve({ data: [] as any[] }),
        ]);

        (acceptedApps || []).forEach((a) => {
          if (!memberSets.has(a.post_id)) memberSets.set(a.post_id, new Set());
          memberSets.get(a.post_id)!.add(a.applicant_id);
        });
        (acceptedInvs || []).forEach((a) => {
          if (!memberSets.has(a.post_id)) memberSets.set(a.post_id, new Set());
          memberSets.get(a.post_id)!.add(a.invitee_id);
        });

        const chatMembers = chatMembersRes.data || [];
        chatMembers.forEach((m: any) => {
          const postId = Array.from(chatroomMap.entries()).find(([, cid]) => cid === m.chatroom_id)?.[0];
          if (!postId) return;
          if (!memberSets.has(postId)) memberSets.set(postId, new Set());
          memberSets.get(postId)!.add(m.user_id);
        });
      }

      if (error) {
        // If foreign key doesn't exist, try without join
        const { data: plainData, error: plainError } = await supabase
          .from('posts')
          .select('*')
          .in('status', ['active', 'filled'])
          .order('created_at', { ascending: false });

        if (!plainError && plainData) {
          // recompute accepted counts for fallback set
          memberSets.clear();
          chatroomMap.clear();
          if (plainData.length > 0) {
            const fallbackIds = plainData.map(p => p.id);
            const [{ data: acceptedApps }, { data: acceptedInvs }] = await Promise.all([
              supabase
                .from('applications')
                .select('post_id, applicant_id')
                .in('post_id', fallbackIds)
                .eq('status', 'accepted'),
              supabase
                .from('invitations')
                .select('post_id, invitee_id')
                .in('post_id', fallbackIds)
                .eq('status', 'accepted'),
            ]);
            (acceptedApps || []).forEach((a) => {
              if (!memberSets.has(a.post_id)) memberSets.set(a.post_id, new Set());
              memberSets.get(a.post_id)!.add(a.applicant_id);
            });
            (acceptedInvs || []).forEach((a) => {
              if (!memberSets.has(a.post_id)) memberSets.set(a.post_id, new Set());
              memberSets.get(a.post_id)!.add(a.invitee_id);
            });

            plainData.forEach((p: any) => {
              if (p.chatroom_id) chatroomMap.set(p.id, p.chatroom_id);
            });
            if (chatroomMap.size > 0) {
              const { data: chatMembers } = await supabase
                .from('chatroom_members')
                .select('chatroom_id, user_id')
                .in('chatroom_id', Array.from(chatroomMap.values()));
              (chatMembers || []).forEach((m: any) => {
                const postId = Array.from(chatroomMap.entries()).find(([, cid]) => cid === m.chatroom_id)?.[0];
                if (!postId) return;
                if (!memberSets.has(postId)) memberSets.set(postId, new Set());
                memberSets.get(postId)!.add(m.user_id);
              });
            }
          }
          // Fetch author profiles separately
          const authorIds = [...new Set(plainData.map(p => p.author_id))];
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, role, profile_picture_url')
            .in('id', authorIds);

          const profileMap = new Map((profiles || []).map(p => [p.id, p]));

          setPosts(plainData.map(p => {
            const author = profileMap.get(p.author_id);
            const reqs = ((p.skill_requirements as unknown as SkillRequirement[]) || []).map(r => ({
              skills: r.skills || (r.skill ? [r.skill] : []),
              requiredCount: r.requiredCount,
              acceptedCount: r.acceptedCount || 0,
            }));
            return {
              id: p.id,
              title: p.title,
              description: p.description,
              author: {
                id: p.author_id,
                name: author ? `${author.first_name || ''} ${author.last_name || ''}`.trim() : 'Unknown',
                avatar: author?.profile_picture_url || undefined,
                type: author?.role === 'faculty' ? 'Faculty' : 'Student',
              },
              skills: reqs.flatMap(r => r.skills),
              requirements: reqs,
              requiredMembers: p.max_members ?? reqs.reduce((s, r) => s + r.requiredCount, 0),
              acceptedMembers: (() => {
                const set = memberSets.get(p.id);
                const setSize = set ? set.size : 0;
                const setMinusAuthor = set ? (set.has(p.author_id) ? setSize - 1 : setSize) : undefined;
                const fallback = reqs.reduce((s, r) => s + (r.acceptedCount || 0), 0);
                return Math.max(
                  0,
                  p.current_members ?? 0,
                  setMinusAuthor ?? 0,
                  fallback
                );
              })(),
              purpose: p.purpose,
              createdAt: p.created_at,
              isOwned: p.author_id === user?.id,
            };
          }));
        }
      } else if (data) {
        setPosts(data.map((p: any) => {
          const author = p.profiles;
          const reqs = ((p.skill_requirements as unknown as SkillRequirement[]) || []).map(r => ({
            skills: r.skills || (r.skill ? [r.skill] : []),
            requiredCount: r.requiredCount,
            acceptedCount: r.acceptedCount || 0,
          }));
          return {
            id: p.id,
            title: p.title,
            description: p.description,
            author: {
              id: p.author_id,
              name: author ? `${author.first_name || ''} ${author.last_name || ''}`.trim() : 'Unknown',
              avatar: author?.profile_picture_url || undefined,
              type: author?.role === 'faculty' ? 'Faculty' : 'Student',
            },
            skills: reqs.flatMap(r => r.skills),
            requirements: reqs,
            requiredMembers: p.max_members ?? reqs.reduce((s, r) => s + r.requiredCount, 0),
            acceptedMembers: (() => {
              const set = memberSets.get(p.id);
              const setSize = set ? set.size : 0;
              const setMinusAuthor = set ? (set.has(p.author_id) ? setSize - 1 : setSize) : undefined;
              const fallback = reqs.reduce((s, r) => s + (r.acceptedCount || 0), 0);
              return Math.max(
                0,
                p.current_members ?? 0,
                setMinusAuthor ?? 0,
                fallback
              );
            })(),
            purpose: p.purpose,
            createdAt: p.created_at,
            isOwned: p.author_id === user?.id,
          };
        }));
      }
      setLoading(false);
  }, [user?.id, user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refreshTick]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('home-member-counts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => setRefreshTick(t => t + 1))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitations' }, () => setRefreshTick(t => t + 1))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chatroom_members' }, () => setRefreshTick(t => t + 1))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => setRefreshTick(t => t + 1))
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user?.id]);

  const userSkills = user?.skills || [];
  const allSkills = Array.from(new Set(posts.flatMap(p => p.skills)));

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const isMyPost = (post: HomePost) => user?.id === post.author.id;

  // Calculate match score for each post based on user skills
  const getMatchScore = (post: HomePost): number => {
    if (userSkills.length === 0 || post.requirements.length === 0) return 0;
    const lowerUserSkills = userSkills.map(s => s.toLowerCase());
    const satisfied = post.requirements.filter(req =>
      req.skills.every(skill =>
        lowerUserSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))
      )
    ).length;
    return Math.round((satisfied / post.requirements.length) * 100);
  };

  const handleDeleteClick = (postId: string) => {
    setConfirmDeletePostId(postId);
  };

  const handleDeletePost = async () => {
    if (!user?.id) return;
    if (!confirmDeletePostId) return;

    setDeletingPostId(confirmDeletePostId);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', confirmDeletePostId)
        .eq('author_id', user.id);

      if (error) {
        console.error('Delete post failed:', error);
        setDeletingPostId(null);
        return;
      }

      setAnimatingDeletePostId(confirmDeletePostId);
      setConfirmDeletePostId(null);
      window.setTimeout(() => {
        setPosts((prev) => prev.filter((p) => p.id !== confirmDeletePostId));
        setAnimatingDeletePostId(null);
        setDeletingPostId(null);
      }, 260);
    } catch (err) {
      console.error('Delete post failed:', err);
      setDeletingPostId(null);
    } finally {
      if (confirmDeletePostId && animatingDeletePostId !== confirmDeletePostId) {
        setConfirmDeletePostId(null);
      }
      setDeletingPostId(null);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (user?.role === 'faculty') return matchesSearch && isMyPost(post);

    let matchesTab = true;
    if (filterTab === 'all') matchesTab = !isMyPost(post);
    else if (filterTab === 'skill') {
      const postSkillsLower = post.skills.map(s => s.toLowerCase());
      matchesTab =
        !isMyPost(post) &&
        (selectedSkills.length === 0 ||
          selectedSkills.every(s => postSkillsLower.includes(s.toLowerCase())));
    } else if (filterTab === 'my') matchesTab = isMyPost(post);

    return matchesSearch && matchesTab;
  }).sort((a, b) => {
    // In "All Posts" and "Skill-Based" tabs, sort by match score descending
    if (filterTab === 'all' || filterTab === 'skill') {
      return getMatchScore(b) - getMatchScore(a);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.firstName || 'User'}! 👋
            </h1>
            <p className="text-muted-foreground text-sm">
              {user?.role === 'faculty'
                ? 'Viewing your created posts'
                : `Showing opportunities matching your skills: ${userSkills.length > 0 ? userSkills.join(', ') : 'No skills added yet'}`}
            </p>
          </div>
          <Button onClick={() => navigate('/create-post')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus size={16} className="mr-1" />
            <span className="tracking-in-expand-normal">Create Post</span>
          </Button>
        </div>

        {/* Skills Info Banner */}
        {userSkills.length === 0 && user?.role !== 'faculty' && (
          <div className="p-3 mb-4 rounded-lg bg-united-amber/10 border border-united-amber/30">
            <p className="text-sm text-united-amber font-medium">
              💡 Tip: Add skills to your profile to see personalized opportunities!{' '}
              <button onClick={() => navigate('/settings/profile')} className="text-accent font-semibold hover:underline ml-1">
                Update Profile
              </button>
            </p>
          </div>
        )}

        {/* Search Bar */}
        <Card className="mb-4">
          <CardContent className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 border-none shadow-none focus-visible:ring-0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        {user?.role !== 'faculty' && (
          <Card className="mb-4">
            <Tabs value={filterTab} onValueChange={setFilterTab}>
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
                <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold px-6 py-3">
                  <span className={filterTab === 'all' ? 'tracking-in-expand-normal' : ''}>All Posts</span>
                </TabsTrigger>
                <TabsTrigger value="skill" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold px-6 py-3">
                  <span className={filterTab === 'skill' ? 'tracking-in-expand-normal' : ''}>Skill-Based</span>
                </TabsTrigger>
                <TabsTrigger value="my" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold px-6 py-3">
                  <span className={filterTab === 'my' ? 'tracking-in-expand-normal' : ''}>My Posts</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <AnimatePresence initial={false}>
              {filterTab === 'skill' && (
                <motion.div
                  key="skill-filter"
                  className="p-3"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Filter size={18} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Filter by skills:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {allSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedSkills.includes(skill)
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={user?.role === 'faculty' ? 'faculty-posts' : `tab-${filterTab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Faculty heading */}
            {user?.role === 'faculty' && filteredPosts.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-foreground">My Posts</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}</p>
              </div>
            )}

            {/* Posts Grid */}
            {filteredPosts.length === 0 ? (
              <Card className="p-12 text-center">
                <h3 className="text-lg font-semibold text-muted-foreground mb-1">
                  {posts.length === 0 ? 'No posts yet' : 'No posts found'}
                </h3>
                <p className="text-sm text-muted-foreground/70 mb-4">
                  {posts.length === 0
                    ? 'Be the first to create an opportunity!'
                    : 'Try adjusting your filters or search terms'}
                </p>
                {posts.length === 0 && (
                  <Button onClick={() => navigate('/create-post')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Plus size={16} className="mr-1" /> Create First Post
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPosts.map(post => {
                  const owned = isMyPost(post);
                  return (
                    <Card
                      key={post.id}
                      className={`flex flex-col hover:-translate-y-0.5 hover:border-orange-400/70 hover:shadow-[0_10px_28px_-12px_rgba(249,115,22,0.55)] transition-all duration-300 ${
                        animatingDeletePostId === post.id ? 'opacity-0 scale-95 -translate-y-2 pointer-events-none' : 'opacity-100 scale-100'
                      }`}
                    >
                      <CardContent className="p-4 pb-2 flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-1">
                          {owned && (
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-united-amber/15 text-united-amber border border-united-amber/30">
                              📌 My Post
                            </span>
                          )}
                          {owned && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={deletingPostId === post.id}
                              className="ml-auto h-7 w-7 p-0 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteClick(post.id)}
                              aria-label="Delete post"
                              title="Delete post"
                            >
                              {deletingPostId === post.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                            </Button>
                          )}
                          {!owned && getMatchScore(post) > 0 && (
                            <span className={`ml-auto inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                              getMatchScore(post) >= 75 ? 'bg-united-green/15 text-united-green' :
                              getMatchScore(post) >= 40 ? 'bg-united-amber/15 text-united-amber' :
                              'bg-primary/10 text-primary'
                            }`}>
                              🎯 {getMatchScore(post)}% match
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm leading-snug text-foreground">{post.title}</h3>
                          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                            <span className="text-xs text-muted-foreground">by {post.author.name}</span>
                            <span className="inline-block px-1.5 py-0.5 text-[10px] rounded bg-primary/10 text-primary font-medium">
                              {post.author.type}
                            </span>
                          </div>
                        </div>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-united-green/10 text-united-green">
                          {post.purpose}
                        </span>
                        <div
                          className="text-xs text-muted-foreground line-clamp-2 whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: post.description }}
                        />
                        <div className="flex flex-wrap gap-1">
                          {post.skills.slice(0, 3).map(skill => {
                            const isMatched = userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase()));
                            return (
                              <span key={skill} className={`px-1.5 py-0.5 text-[10px] rounded ${isMatched ? 'bg-accent/20 text-accent-foreground font-semibold' : 'bg-secondary text-foreground'}`}>{skill}</span>
                            );
                          })}
                          {post.skills.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground">+{post.skills.length - 3}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Users size={14} /> {post.acceptedMembers}/{post.requiredMembers}</span>
                          <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </CardContent>
                      <div className="px-4 pb-3 pt-1 space-y-1.5">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 text-xs rounded-full font-medium border-0 cursor-pointer shadow-[0_4px_14px_0px_rgba(37,99,235,0.4)] transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 active:translate-y-1 active:shadow-none" 
                            onClick={() =>
                              navigate(`/post/${post.id}`, {
                                state: { from: 'home', activeTab: owned ? 'my' : filterTab },
                              })
                            }
                          >
                            View
                          </Button>
                          {post.acceptedMembers === post.requiredMembers && post.requiredMembers > 0 && (
                            <Button size="sm" variant="outline" className="flex-1 border-accent text-accent text-xs" onClick={() => navigate(`/chatroom/${post.id}`)}>
                              <MessageSquare size={14} className="mr-1" /> Chat
                            </Button>
                          )}
                        </div>
                        {owned && (
                          // Remaining slots (never negative)
                          // We keep it dynamic so the number reflects latest accepted count.
                          <Button
                            size="sm"
                            className="w-full bg-united-green hover:bg-united-green/90 text-white text-[13px] font-semibold h-auto min-h-10 py-2 px-3 leading-tight whitespace-normal text-center flex items-center justify-center gap-2 rounded-full border-0"
                            onClick={() => navigate(`/post/${post.id}/candidates`)}
                          >
                            <Users size={14} className="shrink-0" />
                            <div className="flex flex-col leading-tight">
                              <span>🎯 View Matched Candidates</span>
                              <span className="text-[11px] opacity-90">
                                ({Math.max(0, (post.requiredMembers || 0) - (post.acceptedMembers || 0))} needed)
                              </span>
                            </div>
                          </Button>
                        )}
                        {/* The above block replaces the older single-line label */}
                        {/* Keep spacing consistent */}
                        {/* End owned button */}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <AlertDialog open={!!confirmDeletePostId} onOpenChange={(open) => !open && setConfirmDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post and related references will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingPostId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              disabled={!!deletingPostId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingPostId ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HomePage;



import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Users, Calendar, MessageSquare, Plus, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
  skill: string;
  requiredCount: number;
  acceptedCount?: number;
}

interface HomePost {
  id: string;
  title: string;
  description: string;
  author: { id: string; name: string; avatar?: string; type: 'Student' | 'Faculty' };
  skills: string[];
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

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles!posts_author_id_fkey(id, first_name, last_name, role, profile_picture_url)')
        .in('status', ['active', 'filled'])
        .order('created_at', { ascending: false });

      if (error) {
        // If foreign key doesn't exist, try without join
        const { data: plainData, error: plainError } = await supabase
          .from('posts')
          .select('*')
          .in('status', ['active', 'filled'])
          .order('created_at', { ascending: false });

        if (!plainError && plainData) {
          // Fetch author profiles separately
          const authorIds = [...new Set(plainData.map(p => p.author_id))];
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, role, profile_picture_url')
            .in('id', authorIds);

          const profileMap = new Map((profiles || []).map(p => [p.id, p]));

          setPosts(plainData.map(p => {
            const author = profileMap.get(p.author_id);
            const reqs = (p.skill_requirements as unknown as SkillRequirement[]) || [];
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
              skills: reqs.map(r => r.skill),
              requiredMembers: reqs.reduce((s, r) => s + r.requiredCount, 0),
              acceptedMembers: reqs.reduce((s, r) => s + (r.acceptedCount || 0), 0),
              purpose: p.purpose,
              createdAt: p.created_at,
              isOwned: p.author_id === user?.id,
            };
          }));
        }
      } else if (data) {
        setPosts(data.map((p: any) => {
          const author = p.profiles;
          const reqs = (p.skill_requirements as unknown as SkillRequirement[]) || [];
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
            skills: reqs.map(r => r.skill),
            requiredMembers: reqs.reduce((s, r) => s + r.requiredCount, 0),
            acceptedMembers: reqs.reduce((s, r) => s + (r.acceptedCount || 0), 0),
            purpose: p.purpose,
            createdAt: p.created_at,
            isOwned: p.author_id === user?.id,
          };
        }));
      }
      setLoading(false);
    };

    fetchPosts();
  }, [user?.id]);

  const userSkills = user?.skills || [];
  const allSkills = Array.from(new Set(posts.flatMap(p => p.skills)));

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const isMyPost = (post: HomePost) => user?.id === post.author.id;

  // Calculate match score for each post based on user skills
  const getMatchScore = (post: HomePost): number => {
    if (userSkills.length === 0 || post.skills.length === 0) return 0;
    const lowerUserSkills = userSkills.map(s => s.toLowerCase());
    const matched = post.skills.filter(s => lowerUserSkills.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us)));
    return Math.round((matched.length / post.skills.length) * 100);
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
      matchesTab = !isMyPost(post) && (selectedSkills.length === 0 || selectedSkills.some(s => post.skills.includes(s)));
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
            <Plus size={16} className="mr-1" /> Create Post
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
                  All Posts
                </TabsTrigger>
                <TabsTrigger value="skill" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold px-6 py-3">
                  Skill-Based
                </TabsTrigger>
                <TabsTrigger value="my" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold px-6 py-3">
                  My Posts
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {filterTab === 'skill' && (
              <div className="p-3">
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
              </div>
            )}
          </Card>
        )}

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
                      <h3 className="font-semibold text-sm leading-snug">{post.title}</h3>
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
                    <p className="text-xs text-muted-foreground line-clamp-2">{post.description}</p>
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
                      <Button size="sm" className="w-full bg-united-green hover:bg-united-green/90 text-white text-[13px] font-semibold h-auto min-h-10 py-2 px-3 leading-tight whitespace-normal text-center flex items-center justify-center gap-1.5 rounded-full border-0" onClick={() => navigate(`/post/${post.id}/candidates`)}>
                        <Users size={14} className="shrink-0" /> 🎯 View Matched Candidates ({post.requiredMembers - post.acceptedMembers} needed)
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
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


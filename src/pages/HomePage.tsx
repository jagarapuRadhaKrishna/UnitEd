import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Users, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockPosts as importedMockPosts, getUserOwnedPosts } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HomePost {
  id: string;
  title: string;
  description: string;
  author: { id?: string; name: string; avatar?: string; type: 'Student' | 'Faculty' };
  skills: string[];
  requiredMembers: number;
  acceptedMembers: number;
  purpose: 'Research' | 'Project' | 'Hackathon';
  createdAt: string;
  isOwned: boolean;
}

const mapPosts = (posts: typeof importedMockPosts): HomePost[] =>
  posts.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    author: { id: p.author.id, name: p.author.name, avatar: p.author.avatar, type: p.author.type === 'faculty' ? 'Faculty' : 'Student' },
    skills: p.skillRequirements.map(sr => sr.skill),
    requiredMembers: p.skillRequirements.reduce((s, sr) => s + sr.requiredCount, 0),
    acceptedMembers: p.skillRequirements.reduce((s, sr) => s + (sr.acceptedCount || 0), 0),
    purpose: p.purpose as HomePost['purpose'],
    createdAt: p.createdAt,
    isOwned: false,
  }));

const mapUserPosts = (user: any): HomePost[] =>
  getUserOwnedPosts(user).map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    author: { id: p.author.id, name: p.author.name, avatar: p.author.avatar, type: p.author.type === 'faculty' ? 'Faculty' : 'Student' },
    skills: p.skillRequirements.map(sr => sr.skill),
    requiredMembers: p.skillRequirements.reduce((s, sr) => s + sr.requiredCount, 0),
    acceptedMembers: p.skillRequirements.reduce((s, sr) => s + (sr.acceptedCount || 0), 0),
    purpose: p.purpose as HomePost['purpose'],
    createdAt: p.createdAt,
    isOwned: true,
  }));

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const initialTab = (location.state as any)?.activeTab ?? 'all';
  const [filterTab, setFilterTab] = useState(initialTab);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const userSkills = user?.skills || [];
  const allPosts = [...mapPosts(importedMockPosts), ...mapUserPosts(user)];
  const allSkills = Array.from(new Set(allPosts.flatMap(p => p.skills)));

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const isMyPost = (post: HomePost) => {
    const currentUser: any = user || JSON.parse(localStorage.getItem('user') || '{}');
    return (currentUser.id && currentUser.id === post.author.id) ||
      (currentUser.firstName && currentUser.lastName && `${currentUser.firstName} ${currentUser.lastName}` === post.author.name);
  };

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const currentUser: any = user || {};

    if (currentUser.role === 'faculty') return matchesSearch && isMyPost(post);

    let matchesTab = true;
    if (filterTab === 'all') matchesTab = !isMyPost(post);
    else if (filterTab === 'skill') {
      matchesTab = !isMyPost(post) && (selectedSkills.length === 0 || selectedSkills.some(s => post.skills.includes(s)));
    } else if (filterTab === 'my') matchesTab = isMyPost(post);

    const matchesUserSkills = (filterTab === 'all' || filterTab === 'skill')
      ? (userSkills.length === 0 || post.skills.some(s => userSkills.includes(s)))
      : true;

    return matchesSearch && matchesTab && matchesUserSkills;
  });

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
            Create Post
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
            <h3 className="text-lg font-semibold text-muted-foreground mb-1">No posts found</h3>
            <p className="text-sm text-muted-foreground/70">Try adjusting your filters or search terms</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPosts.map(post => {
              const owned = isMyPost(post);
              return (
                <Card key={post.id} className="flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <CardContent className="p-4 pb-2 flex-1 space-y-2">
                    {owned && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-united-amber/15 text-united-amber border border-united-amber/30">
                        📌 My Post
                      </span>
                    )}
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
                      {post.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-1.5 py-0.5 text-[10px] rounded bg-secondary text-foreground">{skill}</span>
                      ))}
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
                      <Button size="sm" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-xs" onClick={() => navigate(`/post/${post.id}`)}>
                        View
                      </Button>
                      {post.acceptedMembers === post.requiredMembers && (
                        <Button size="sm" variant="outline" className="flex-1 border-accent text-accent text-xs" onClick={() => navigate(`/chatroom/${post.id}`)}>
                          <MessageSquare size={14} className="mr-1" /> Chat
                        </Button>
                      )}
                    </div>
                    {owned && (
                      <Button size="sm" className="w-full bg-united-green hover:bg-united-green/90 text-white text-xs font-semibold" onClick={() => navigate(`/post/${post.id}/candidates`)}>
                        <Users size={14} className="mr-1" /> 🎯 View Matched Candidates ({post.requiredMembers - post.acceptedMembers} needed)
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

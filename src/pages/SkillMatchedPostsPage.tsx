import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllPosts } from '@/data/mockData';
import type { Post } from '@/types/united';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Briefcase, Target } from 'lucide-react';

const SkillMatchedPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matchedPosts, setMatchedPosts] = useState<(Post & { matchScore: number })[]>([]);

  useEffect(() => {
    if (!user) return;
    const userSkills = (user.skills || []).map(s => s.toLowerCase());
    const allPosts = getAllPosts(user);
    const storedPosts: Post[] = JSON.parse(localStorage.getItem('posts') || '[]');
    const combined = [...allPosts, ...storedPosts]
      .filter(p => p.author.id !== user.id && p.author.name !== `${user.firstName} ${user.lastName}` && p.status === 'active');

    // Deduplicate
    const seen = new Set<string>();
    const unique = combined.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });

    const scored = unique.map(post => {
      const postSkills = post.skillRequirements.map(sr => sr.skill.toLowerCase());
      const matchCount = postSkills.filter(ps => userSkills.some(us => us.includes(ps) || ps.includes(us))).length;
      const matchScore = postSkills.length > 0 ? Math.round((matchCount / postSkills.length) * 100) : 0;
      return { ...post, matchScore };
    }).filter(p => p.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);

    setMatchedPosts(scored);
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">🎯 Opportunities Matching Your Skills</h1>
        <p className="text-muted-foreground mb-3">Find opportunities that match your expertise</p>
        {user?.skills && user.skills.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground">Your Skills:</span>
            {user.skills.slice(0, 8).map(skill => (
              <Badge key={skill} variant="outline" className="text-xs border-united-blue/30 text-united-blue">{skill}</Badge>
            ))}
          </div>
        )}
      </div>

      {matchedPosts.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <p className="text-lg text-muted-foreground mb-2">No opportunities matching your skills yet</p>
            <p className="text-sm text-muted-foreground mb-4">Try updating your skills or check back later</p>
            <Button onClick={() => navigate('/profile')} className="bg-united-blue hover:bg-united-blue/90">Update Your Skills</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchedPosts.map(post => (
            <Card key={post.id} className="hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-united-purple/10 text-united-purple text-xs">{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Posted by</p>
                    <p className="text-sm font-semibold truncate">{post.author.name}</p>
                  </div>
                  <Badge className="bg-united-purple/10 text-united-purple border-0 text-xs shrink-0">{post.matchScore}% match</Badge>
                </div>

                <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">{post.purpose}</Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {post.skillRequirements.map(sr => {
                    const userSkills = (user?.skills || []).map(s => s.toLowerCase());
                    const isMatched = userSkills.some(us => us.includes(sr.skill.toLowerCase()) || sr.skill.toLowerCase().includes(us));
                    return (
                      <Badge key={sr.skill} variant={isMatched ? 'default' : 'outline'} className={isMatched ? 'bg-united-green/10 text-united-green border-0 text-xs' : 'text-xs'}>
                        {sr.skill}
                      </Badge>
                    );
                  })}
                </div>

                <div className="flex gap-3 text-xs text-muted-foreground mt-auto">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>{post.applications.length} applications</span>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <Button size="sm" className="flex-1 bg-united-blue hover:bg-united-blue/90" onClick={e => { e.stopPropagation(); navigate(`/post/${post.id}`); }}>View Details</Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={e => { e.stopPropagation(); navigate(`/post/${post.id}`); }}>Apply</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillMatchedPostsPage;

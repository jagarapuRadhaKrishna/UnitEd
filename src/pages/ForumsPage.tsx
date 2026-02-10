import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Plus, Search, ThumbsUp, Eye, Clock, Pin } from 'lucide-react';

interface ForumThread {
  id: string; title: string; author: string; authorAvatar: string;
  category: string; replies: number; views: number; likes: number;
  lastActivity: string; pinned?: boolean; tags: string[];
}

const mockThreads: ForumThread[] = [
  { id: '1', title: 'Best practices for React project architecture?', author: 'Madhuri', authorAvatar: 'M', category: 'Technical', replies: 12, views: 234, likes: 18, lastActivity: '2h ago', pinned: true, tags: ['React', 'Architecture'] },
  { id: '2', title: 'Looking for ML study group partners', author: 'Krishna', authorAvatar: 'K', category: 'Collaboration', replies: 8, views: 156, likes: 10, lastActivity: '4h ago', tags: ['Machine Learning', 'Study Group'] },
  { id: '3', title: 'Tips for hackathon presentations', author: 'Vedhakshi', authorAvatar: 'V', category: 'General', replies: 15, views: 342, likes: 25, lastActivity: '1d ago', tags: ['Hackathon', 'Tips'] },
  { id: '4', title: 'How to contribute to open source projects?', author: 'Annanya', authorAvatar: 'A', category: 'Career', replies: 20, views: 478, likes: 32, lastActivity: '2d ago', tags: ['Open Source', 'Career'] },
  { id: '5', title: 'Database design patterns discussion', author: 'Maaroof', authorAvatar: 'M', category: 'Technical', replies: 6, views: 98, likes: 7, lastActivity: '3d ago', tags: ['Database', 'Design Patterns'] },
];

const categories = ['All', 'Technical', 'Collaboration', 'General', 'Career'];

const ForumsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = mockThreads.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Forums</h1>
          <p className="text-muted-foreground text-sm">Discuss, share knowledge, and connect</p>
        </div>
        <Button onClick={() => navigate('/forum/create')} className="bg-primary">
          <Plus className="w-4 h-4 mr-2" /> New Thread
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threads..." className="pl-10" />
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-4">
        <TabsList>
          {categories.map(cat => <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {filtered.map(thread => (
          <Card key={thread.id} className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate(`/forum/${thread.id}`)}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9 mt-0.5">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">{thread.authorAvatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {thread.pinned && <Pin className="w-3 h-3 text-united-orange" />}
                    <h3 className="font-semibold text-sm">{thread.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span>{thread.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{thread.lastActivity}</span>
                    <Badge variant="secondary" className="text-[10px] h-4">{thread.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {thread.tags.map(tag => <Badge key={tag} variant="outline" className="text-[10px] h-5">{tag}</Badge>)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{thread.replies}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{thread.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{thread.likes}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No threads found</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default ForumsPage;

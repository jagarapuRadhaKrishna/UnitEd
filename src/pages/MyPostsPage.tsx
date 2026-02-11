import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Users, Trash2, Calendar, Plus } from 'lucide-react';

interface SkillRequirement {
  skill: string;
  requiredCount: number;
  acceptedCount?: number;
}

interface MyPost {
  id: string;
  title: string;
  description: string;
  purpose: string;
  status: string;
  skill_requirements: SkillRequirement[];
  created_at: string;
  applicationCount: number;
}

const MyPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const fetchMyPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error || !data) {
        setLoading(false);
        return;
      }

      // Fetch application counts for all posts
      const postIds = data.map(p => p.id);
      const { data: apps } = await supabase
        .from('applications')
        .select('post_id')
        .in('post_id', postIds.length > 0 ? postIds : ['__none__']);

      const appCounts = new Map<string, number>();
      (apps || []).forEach(a => appCounts.set(a.post_id, (appCounts.get(a.post_id) || 0) + 1));

      setPosts(data.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        purpose: p.purpose,
        status: p.status,
        skill_requirements: (p.skill_requirements as unknown as SkillRequirement[]) || [],
        created_at: p.created_at,
        applicationCount: appCounts.get(p.id) || 0,
      })));
      setLoading(false);
    };
    fetchMyPosts();
  }, [user?.id]);

  const handleDelete = async () => {
    if (!selectedPostId) return;
    setDeleting(true);
    const { error } = await supabase.from('posts').delete().eq('id', selectedPostId);
    setDeleting(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setPosts(prev => prev.filter(p => p.id !== selectedPostId));
    setDeleteDialogOpen(false);
    toast({ title: 'Post deleted' });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">📝 My Posts</h1>
          <p className="text-muted-foreground">Manage all the posts you've created</p>
        </div>
        <Button onClick={() => navigate('/create-post')} className="bg-united-purple hover:bg-united-purple/90">
          <Plus className="w-4 h-4 mr-2" /> Create Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <p className="text-lg text-muted-foreground mb-2">You haven't created any posts yet</p>
            <Button onClick={() => navigate('/create-post')} className="mt-2">
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(post => {
            const totalRequired = post.skill_requirements.reduce((s, r) => s + r.requiredCount, 0);
            const totalAccepted = post.skill_requirements.reduce((s, r) => s + (r.acceptedCount || 0), 0);
            const progress = totalRequired > 0 ? (totalAccepted / totalRequired) * 100 : 0;

            return (
              <Card key={post.id} className="hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col">
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-2">{post.title}</h3>
                    <Badge variant={post.status === 'active' ? 'default' : 'secondary'} className="ml-2 shrink-0 text-xs">
                      {post.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.description}</p>

                  <div className="text-xs text-muted-foreground mb-2 space-y-1">
                    <p><strong>Purpose:</strong> {post.purpose}</p>
                    <p className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.skill_requirements.slice(0, 3).map(sr => (
                      <Badge key={sr.skill} variant="outline" className="text-[10px]">{sr.skill}</Badge>
                    ))}
                    {post.skill_requirements.length > 3 && (
                      <Badge variant="secondary" className="text-[10px]">+{post.skill_requirements.length - 3}</Badge>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground flex gap-3 mb-3">
                    <span><strong>{post.applicationCount}</strong> Applications</span>
                    <span><strong>{totalAccepted}</strong>/{totalRequired} Members</span>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Team Progress</span>
                      <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>

                  <div className="mt-auto space-y-2 pt-2 border-t">
                    <Button size="sm" className="w-full bg-united-purple hover:bg-united-purple/90" onClick={() => navigate(`/post/manage/${post.id}`)}>
                      <Users className="w-3.5 h-3.5 mr-1" /> View Applications
                    </Button>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/post/${post.id}`)}>
                        View Post
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => { setSelectedPostId(post.id); setDeleteDialogOpen(true); }}>
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Post?</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to delete this post? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPostsPage;

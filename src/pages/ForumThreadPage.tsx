import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ThumbsUp, MessageCircle, Clock, Send } from 'lucide-react';

interface Reply {
  id: string; author: string; avatar: string; content: string;
  timestamp: string; likes: number; liked?: boolean;
}

const mockReplies: Reply[] = [
  { id: '1', author: 'Krishna', avatar: 'K', content: 'I recommend using a feature-based folder structure. Group files by feature/module rather than by type. This scales much better as the project grows.', timestamp: '2h ago', likes: 5 },
  { id: '2', author: 'Annanya', avatar: 'A', content: 'Agreed! Also consider using barrel exports (index.ts) for cleaner imports. And don\'t forget to separate business logic from UI components.', timestamp: '1h ago', likes: 3 },
  { id: '3', author: 'Maaroof', avatar: 'M', content: 'For state management, I\'d suggest starting simple with Context API and only moving to Redux/Zustand when you actually need it. Premature optimization is the root of all evil!', timestamp: '45m ago', likes: 8 },
];

const ForumThreadPage: React.FC = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<Reply[]>(mockReplies);

  const thread = {
    id: threadId, title: 'Best practices for React project architecture?',
    author: 'Madhuri', avatar: 'M', category: 'Technical',
    content: 'I\'m starting a new React project and want to set up a solid architecture from the beginning. What are the best practices you\'ve found for organizing components, state management, and folder structure? Any tips for making the codebase maintainable as it scales?',
    createdAt: '2h ago', tags: ['React', 'Architecture'], views: 234, likes: 18,
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    const newReply: Reply = {
      id: `r-${Date.now()}`,
      author: `${user?.firstName} ${user?.lastName}`,
      avatar: user?.firstName?.[0] || 'U',
      content: replyText, timestamp: 'Just now', likes: 0,
    };
    setReplies(prev => [...prev, newReply]);
    setReplyText('');
    toast({ title: 'Reply posted!' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <Button variant="ghost" onClick={() => navigate('/forums')} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Forums
      </Button>

      {/* Thread */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{thread.category}</Badge>
            {thread.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
          </div>
          <h1 className="text-xl font-bold mb-3">{thread.title}</h1>
          <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">{thread.avatar}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">{thread.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{thread.createdAt}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{thread.content}</p>
          <Separator className="my-4" />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button className="flex items-center gap-1 hover:text-primary transition-colors"><ThumbsUp className="w-4 h-4" />{thread.likes}</button>
            <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{replies.length} replies</span>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <h3 className="font-semibold mb-3">{replies.length} Replies</h3>
      <div className="space-y-3 mb-6">
        {replies.map(reply => (
          <Card key={reply.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 text-sm">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-muted text-xs">{reply.avatar}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{reply.author}</span>
                <span className="text-muted-foreground">• {reply.timestamp}</span>
              </div>
              <p className="text-sm leading-relaxed mb-2">{reply.content}</p>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                <ThumbsUp className="w-3 h-3" /> {reply.likes}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply input */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2">Your Reply</h4>
          <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Share your thoughts..." className="mb-3" rows={3} />
          <Button onClick={handleReply} disabled={!replyText.trim()} className="bg-primary">
            <Send className="w-4 h-4 mr-2" /> Post Reply
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumThreadPage;

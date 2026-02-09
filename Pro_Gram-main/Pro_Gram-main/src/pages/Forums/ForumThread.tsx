import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  isSolution?: boolean;
}

interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  views: number;
}

const ThreadContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const ThreadHeader = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ThreadTitle = styled.h1`
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorName = styled.span`
  font-weight: 500;
  color: #4a5568;
`;

const ThreadContent = styled.div`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: #ebf8ff;
  color: #3182ce;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
`;

const ThreadMeta = styled.div`
  display: flex;
  gap: 2rem;
  color: #718096;
  font-size: 0.875rem;
`;

const Replies = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReplyCard = styled(motion.div)<{ isSolution?: boolean }>`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: ${props => props.isSolution ? '4px solid #48bb78' : 'none'};
`;

const ReplyActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const ActionButton = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.isActive ? '#3182ce' : '#718096'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #f7fafc;
  }
`;

const ReplyInput = styled.div`
  margin-top: 2rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

const SubmitButton = styled.button`
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2c5282;
  }
`;

const mockThread: Thread = {
  id: '1',
  title: 'Best practices for implementing machine learning models in production',
  content: 'I\'m working on deploying ML models to production and looking for best practices regarding model versioning, monitoring, and scaling. What approaches have worked well for you?',
  authorId: '123',
  authorName: 'Alex Thompson',
  authorAvatar: 'https://i.pravatar.cc/150?u=123',
  timestamp: '2 hours ago',
  tags: ['Machine Learning', 'DevOps', 'Production'],
  likes: 24,
  isLiked: false,
  views: 342
};

const mockReplies: Post[] = [
  {
    id: '1',
    authorId: '456',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://i.pravatar.cc/150?u=456',
    content: 'In my experience, containerization with Docker and using orchestration tools like Kubernetes has been crucial for ML model deployment. It helps with scaling and version management.',
    timestamp: '1 hour ago',
    likes: 12,
    isLiked: false,
    isSolution: true
  },
  {
    id: '2',
    authorId: '789',
    authorName: 'Mike Peterson',
    authorAvatar: 'https://i.pravatar.cc/150?u=789',
    content: 'Consider using MLflow for experiment tracking and model versioning. It integrates well with most ML frameworks and provides good visibility into model performance.',
    timestamp: '45 minutes ago',
    likes: 8,
    isLiked: false
  }
];

export const ForumThread: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [replies, setReplies] = useState(mockReplies);
  const [newReply, setNewReply] = useState('');

  const handleLike = (postId: string) => {
    setReplies(prev => prev.map(reply => {
      if (reply.id === postId) {
        return {
          ...reply,
          likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
          isLiked: !reply.isLiked
        };
      }
      return reply;
    }));
  };

  const handleSubmitReply = () => {
    if (!newReply.trim()) return;

    const reply: Post = {
      id: Date.now().toString(),
      authorId: 'current-user',
      authorName: 'Current User',
      authorAvatar: 'https://i.pravatar.cc/150?u=current-user',
      content: newReply,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    };

    setReplies(prev => [...prev, reply]);
    setNewReply('');
  };

  return (
    <ThreadContainer>
      <ThreadHeader>
        <ThreadTitle>{mockThread.title}</ThreadTitle>
        <AuthorInfo>
          <Avatar src={mockThread.authorAvatar} alt={mockThread.authorName} />
          <AuthorName>{mockThread.authorName}</AuthorName>
          <span>• {mockThread.timestamp}</span>
        </AuthorInfo>
        <ThreadContent>{mockThread.content}</ThreadContent>
        <TagsContainer>
          {mockThread.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagsContainer>
        <ThreadMeta>
          <span>{mockThread.views} views</span>
          <span>{mockThread.likes} likes</span>
          <span>{replies.length} replies</span>
        </ThreadMeta>
      </ThreadHeader>

      <Replies>
        {replies.map(reply => (
          <ReplyCard
            key={reply.id}
            isSolution={reply.isSolution}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AuthorInfo>
              <Avatar src={reply.authorAvatar} alt={reply.authorName} />
              <AuthorName>{reply.authorName}</AuthorName>
              <span>• {reply.timestamp}</span>
            </AuthorInfo>
            <ThreadContent>{reply.content}</ThreadContent>
            <ReplyActions>
              <ActionButton
                isActive={reply.isLiked}
                onClick={() => handleLike(reply.id)}
              >
                <span>👍</span> {reply.likes} Likes
              </ActionButton>
              {reply.isSolution && (
                <Tag style={{ background: '#48bb78', color: 'white' }}>
                  Verified Solution
                </Tag>
              )}
            </ReplyActions>
          </ReplyCard>
        ))}
      </Replies>

      <ReplyInput>
        <TextArea
          placeholder="Write your reply..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
        />
        <SubmitButton onClick={handleSubmitReply}>Post Reply</SubmitButton>
      </ReplyInput>
    </ThreadContainer>
  );
};

export default ForumThread;
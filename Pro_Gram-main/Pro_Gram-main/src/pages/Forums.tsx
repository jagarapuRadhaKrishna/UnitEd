import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, MessageCircle, Share2, Eye, Clock, User, Send, Heart, Smile, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';

interface Reply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies: Reply[];
}

interface ForumThread {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  category: string;
  tags: string[];
  timestamp: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #F9FAFB;
  padding-top: 0;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px 32px 32px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6B7280;
  font-size: 16px;
`;

const TopBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6C47FF;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  width: 18px;
`;

const FilterButton = styled.button`
  padding: 12px 20px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #374151;
  font-weight: 500;
  font-size: 14px;

  &:hover {
    background: #F9FAFB;
    border-color: #6C47FF;
  }
`;

const NewThreadButton = styled.button`
  padding: 12px 24px;
  background: #6C47FF;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  &:hover {
    background: #5936E8;
  }
`;

const CategoriesBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 4px;
  }
`;

const CategoryChip = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  background: ${props => props.active ? '#6C47FF' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border: 1px solid ${props => props.active ? '#6C47FF' : '#E5E7EB'};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#5936E8' : '#F9FAFB'};
    border-color: #6C47FF;
  }
`;

const ThreadsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ThreadCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #6C47FF;
    box-shadow: 0 4px 12px rgba(108, 71, 255, 0.1);
  }
`;

const ThreadHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 14px;
`;

const Timestamp = styled.div`
  color: #9CA3AF;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CategoryBadge = styled.span`
  padding: 4px 12px;
  background: #EEF2FF;
  color: #6C47FF;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const ThreadTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const ThreadContent = styled.p`
  color: #4B5563;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  padding: 4px 10px;
  background: #F3F4F6;
  color: #6B7280;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const ThreadStats = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const StatItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.active ? '#6C47FF' : '#6B7280'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: #6C47FF;
  }
`;

const DetailView = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid #E5E7EB;
`;

const BackButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  color: #6B7280;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;

  &:hover {
    background: #F9FAFB;
    border-color: #6C47FF;
    color: #6C47FF;
  }
`;

const CommentsSection = styled.div`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #E5E7EB;
`;

const CommentBox = styled.div`
  background: #F9FAFB;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #6C47FF;
  }
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const EmojiButton = styled.button`
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #6B7280;

  &:hover {
    color: #6C47FF;
  }
`;

const PostButton = styled.button`
  padding: 10px 20px;
  background: #6C47FF;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  &:hover {
    background: #5936E8;
  }

  &:disabled {
    background: #D1D5DB;
    cursor: not-allowed;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentCard = styled.div`
  background: #F9FAFB;
  border-radius: 8px;
  padding: 16px;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const CommentContent = styled.p`
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const CommentActions2 = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const ActionButton = styled.button<{ active?: boolean }>`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.active ? '#6C47FF' : '#6B7280'};
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: #6C47FF;
  }
`;

const ReplySection = styled.div`
  margin-left: 40px;
  margin-top: 12px;
  padding-left: 16px;
  border-left: 2px solid #E5E7EB;
`;

const ReplyCard = styled.div`
  background: white;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
`;

const Forums: React.FC = () => {
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [newComment, setNewComment] = useState('');
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [threads, setThreads] = useState<ForumThread[]>([
    {
      id: '1',
      title: 'Best Practices for React State Management in 2024',
      content: 'I\'ve been working on a large-scale React project and wondering what the community thinks about the latest state management solutions. Should we stick with Redux, move to Zustand, or try something else?',
      author: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      category: 'Development',
      tags: ['React', 'State Management', 'JavaScript', 'Best Practices'],
      timestamp: '2 hours ago',
      views: 234,
      likes: 45,
      isLiked: false,
      comments: [
        {
          id: 'c1',
          author: 'Mike Chen',
          avatar: 'https://i.pravatar.cc/150?img=2',
          content: 'I\'ve been using Zustand for the past year and it\'s been amazing! Much simpler than Redux and perfect for most use cases.',
          timestamp: '1 hour ago',
          likes: 12,
          isLiked: false,
          replies: [
            {
              id: 'r1',
              author: 'Emily Davis',
              avatar: 'https://i.pravatar.cc/150?img=3',
              content: 'Totally agree! The learning curve is so much easier with Zustand.',
              timestamp: '45 min ago',
              likes: 5,
              isLiked: false
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Looking for Research Partners in Machine Learning',
      content: 'Working on a research paper about neural network optimization. Looking for collaborators with experience in deep learning and PyTorch.',
      author: 'Dr. James Wilson',
      avatar: 'https://i.pravatar.cc/150?img=4',
      category: 'Research',
      tags: ['Machine Learning', 'Research', 'PyTorch', 'Collaboration'],
      timestamp: '5 hours ago',
      views: 189,
      likes: 32,
      isLiked: false,
      comments: []
    },
    {
      id: '3',
      title: 'How to Balance Academic Work and Side Projects?',
      content: 'I\'m struggling to find time for both my coursework and personal coding projects. Any tips from experienced students?',
      author: 'Alex Kumar',
      avatar: 'https://i.pravatar.cc/150?img=5',
      category: 'General',
      tags: ['Time Management', 'Student Life', 'Advice'],
      timestamp: '1 day ago',
      views: 421,
      likes: 78,
      isLiked: true,
      comments: [
        {
          id: 'c2',
          author: 'Lisa Anderson',
          avatar: 'https://i.pravatar.cc/150?img=6',
          content: 'I use the Pomodoro technique and block out specific times for projects. Also, try to align your side projects with what you\'re learning in class!',
          timestamp: '18 hours ago',
          likes: 23,
          isLiked: true,
          replies: []
        }
      ]
    },
    {
      id: '4',
      title: 'Upcoming Hackathon - Team Formation Thread',
      content: 'UnitEd Hackathon is coming up next month! Drop your skills and interests here if you\'re looking for teammates.',
      author: 'Emma Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=7',
      category: 'Events',
      tags: ['Hackathon', 'Team', 'Events', 'Networking'],
      timestamp: '2 days ago',
      views: 567,
      likes: 104,
      isLiked: false,
      comments: []
    },
    {
      id: '5',
      title: 'Understanding Blockchain Consensus Mechanisms',
      content: 'Can someone explain the differences between Proof of Work and Proof of Stake in simple terms? Working on a project and need clarity.',
      author: 'David Park',
      avatar: 'https://i.pravatar.cc/150?img=8',
      category: 'Technology',
      tags: ['Blockchain', 'Cryptocurrency', 'Learning'],
      timestamp: '3 days ago',
      views: 312,
      likes: 56,
      isLiked: false,
      comments: []
    },
  ]);

  const categories = ['All', 'Development', 'Research', 'Technology', 'Events', 'General'];

  const filteredThreads = threads.filter(thread => {
    const matchesCategory = activeCategory === 'All' || thread.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleLikeThread = (threadId: string) => {
    setThreads(threads.map(thread => 
      thread.id === threadId 
        ? { ...thread, isLiked: !thread.isLiked, likes: thread.isLiked ? thread.likes - 1 : thread.likes + 1 }
        : thread
    ));
  };

  const handleLikeComment = (threadId: string, commentId: string) => {
    setThreads(threads.map(thread => 
      thread.id === threadId
        ? {
            ...thread,
            comments: thread.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
                : comment
            )
          }
        : thread
    ));
  };

  const handlePostComment = () => {
    if (!selectedThread || !newComment.trim()) return;

    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      author: 'Current User',
      avatar: 'https://i.pravatar.cc/150?img=20',
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      replies: []
    };

    setThreads(threads.map(thread =>
      thread.id === selectedThread.id
        ? { ...thread, comments: [...thread.comments, newCommentObj] }
        : thread
    ));

    setNewComment('');
  };

  const handlePostReply = (commentId: string) => {
    if (!selectedThread || !replyText.trim()) return;

    const newReply: Reply = {
      id: `r${Date.now()}`,
      author: 'Current User',
      avatar: 'https://i.pravatar.cc/150?img=20',
      content: replyText,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    };

    setThreads(threads.map(thread =>
      thread.id === selectedThread.id
        ? {
            ...thread,
            comments: thread.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, replies: [...comment.replies, newReply] }
                : comment
            )
          }
        : thread
    ));

    setReplyText('');
    setShowReplyInput(null);
  };

  return (
    <PageWrapper>
      <Container>
        {selectedThread ? (
          // Detailed Thread View
          <>
            <BackButton onClick={() => setSelectedThread(null)}>
              ← Back to Forums
            </BackButton>

            <DetailView>
              <ThreadHeader>
                <Avatar src={selectedThread.avatar} alt={selectedThread.author} />
                <AuthorInfo>
                  <AuthorName>{selectedThread.author}</AuthorName>
                  <Timestamp>
                    <Clock size={14} />
                    {selectedThread.timestamp}
                  </Timestamp>
                </AuthorInfo>
                <CategoryBadge>{selectedThread.category}</CategoryBadge>
              </ThreadHeader>

              <ThreadTitle>{selectedThread.title}</ThreadTitle>
              <ThreadContent>{selectedThread.content}</ThreadContent>

              <TagsContainer>
                {selectedThread.tags.map((tag, idx) => (
                  <Tag key={idx}>{tag}</Tag>
                ))}
              </TagsContainer>

              <ThreadStats>
                <StatItem 
                  active={selectedThread.isLiked}
                  onClick={() => handleLikeThread(selectedThread.id)}
                >
                  <Heart fill={selectedThread.isLiked ? '#6C47FF' : 'none'} />
                  {selectedThread.likes}
                </StatItem>
                <StatItem>
                  <MessageCircle />
                  {selectedThread.comments.length}
                </StatItem>
                <StatItem>
                  <Eye />
                  {selectedThread.views}
                </StatItem>
                <StatItem>
                  <Share2 />
                  Share
                </StatItem>
              </ThreadStats>

              <CommentsSection>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                  Comments ({selectedThread.comments.length})
                </h3>

                <CommentBox>
                  <CommentInput 
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <CommentActions>
                    <EmojiButton>
                      <Smile size={20} />
                    </EmojiButton>
                    <PostButton 
                      onClick={handlePostComment}
                      disabled={!newComment.trim()}
                    >
                      <Send size={16} />
                      Post Comment
                    </PostButton>
                  </CommentActions>
                </CommentBox>

                <CommentsList>
                  {selectedThread.comments.map((comment) => (
                    <div key={comment.id}>
                      <CommentCard>
                        <CommentHeader>
                          <Avatar src={comment.avatar} alt={comment.author} />
                          <AuthorInfo>
                            <AuthorName>{comment.author}</AuthorName>
                            <Timestamp>
                              <Clock size={12} />
                              {comment.timestamp}
                            </Timestamp>
                          </AuthorInfo>
                        </CommentHeader>
                        <CommentContent>{comment.content}</CommentContent>
                        <CommentActions2>
                          <ActionButton 
                            active={comment.isLiked}
                            onClick={() => handleLikeComment(selectedThread.id, comment.id)}
                          >
                            <ThumbsUp fill={comment.isLiked ? '#6C47FF' : 'none'} />
                            {comment.likes}
                          </ActionButton>
                          <ActionButton onClick={() => setShowReplyInput(showReplyInput === comment.id ? null : comment.id)}>
                            <MessageCircle />
                            Reply ({comment.replies.length})
                          </ActionButton>
                        </CommentActions2>

                        {showReplyInput === comment.id && (
                          <div style={{ marginTop: '12px' }}>
                            <CommentInput 
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              style={{ minHeight: '60px' }}
                            />
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => setShowReplyInput(null)}
                                style={{
                                  padding: '8px 16px',
                                  background: 'transparent',
                                  border: '1px solid #E5E7EB',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  color: '#6B7280'
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handlePostReply(comment.id)}
                                disabled={!replyText.trim()}
                                style={{
                                  padding: '8px 16px',
                                  background: '#6C47FF',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                                  opacity: replyText.trim() ? 1 : 0.5
                                }}
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        )}

                        {comment.replies.length > 0 && (
                          <ReplySection>
                            {comment.replies.map((reply) => (
                              <ReplyCard key={reply.id}>
                                <CommentHeader>
                                  <Avatar src={reply.avatar} alt={reply.author} style={{ width: '32px', height: '32px' }} />
                                  <AuthorInfo>
                                    <AuthorName style={{ fontSize: '13px' }}>{reply.author}</AuthorName>
                                    <Timestamp style={{ fontSize: '12px' }}>
                                      <Clock size={10} />
                                      {reply.timestamp}
                                    </Timestamp>
                                  </AuthorInfo>
                                </CommentHeader>
                                <CommentContent style={{ fontSize: '13px' }}>{reply.content}</CommentContent>
                                <ActionButton active={reply.isLiked}>
                                  <ThumbsUp fill={reply.isLiked ? '#6C47FF' : 'none'} size={14} />
                                  {reply.likes}
                                </ActionButton>
                              </ReplyCard>
                            ))}
                          </ReplySection>
                        )}
                      </CommentCard>
                    </div>
                  ))}
                </CommentsList>
              </CommentsSection>
            </DetailView>
          </>
        ) : (
          // Forum List View
          <>
            <Header>
              <Title>Forums</Title>
              <Subtitle>Join discussions, ask questions, and connect with the community</Subtitle>
            </Header>

            <TopBar>
              <SearchBox>
                <SearchIcon />
                <SearchInput 
                  placeholder="Search discussions, topics, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchBox>
              <FilterButton>
                <Filter size={18} />
                Filter
              </FilterButton>
              <NewThreadButton onClick={() => alert('Create new thread feature coming soon!')}>
                + New Discussion
              </NewThreadButton>
            </TopBar>

            <CategoriesBar>
              {categories.map(category => (
                <CategoryChip
                  key={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </CategoryChip>
              ))}
            </CategoriesBar>

            <div style={{ marginBottom: '16px', color: '#6B7280', fontSize: '14px' }}>
              {filteredThreads.length} discussion{filteredThreads.length !== 1 ? 's' : ''}
            </div>

            <ThreadsContainer>
              {filteredThreads.map((thread) => (
                <ThreadCard
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                >
                  <ThreadHeader>
                    <Avatar src={thread.avatar} alt={thread.author} />
                    <AuthorInfo>
                      <AuthorName>{thread.author}</AuthorName>
                      <Timestamp>
                        <Clock size={14} />
                        {thread.timestamp}
                      </Timestamp>
                    </AuthorInfo>
                    <CategoryBadge>{thread.category}</CategoryBadge>
                  </ThreadHeader>

                  <ThreadTitle>{thread.title}</ThreadTitle>
                  <ThreadContent>{thread.content}</ThreadContent>

                  <TagsContainer>
                    {thread.tags.map((tag, idx) => (
                      <Tag key={idx}>{tag}</Tag>
                    ))}
                  </TagsContainer>

                  <ThreadStats>
                    <StatItem 
                      active={thread.isLiked}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeThread(thread.id);
                      }}
                    >
                      <Heart fill={thread.isLiked ? '#6C47FF' : 'none'} />
                      {thread.likes}
                    </StatItem>
                    <StatItem>
                      <MessageCircle />
                      {thread.comments.length}
                    </StatItem>
                    <StatItem>
                      <Eye />
                      {thread.views}
                    </StatItem>
                  </ThreadStats>
                </ThreadCard>
              ))}
            </ThreadsContainer>

            {filteredThreads.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#9CA3AF'
              }}>
                <MessageCircle size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <h3 style={{ marginBottom: '8px', color: '#6B7280' }}>No discussions found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </Container>
    </PageWrapper>
  );
};

export default Forums;

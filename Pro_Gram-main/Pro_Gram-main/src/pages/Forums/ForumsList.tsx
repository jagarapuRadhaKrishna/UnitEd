import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Forum {
  id: string;
  title: string;
  description: string;
  category: string;
  threadsCount: number;
  lastActivity: string;
}

const ForumsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #718096;
  font-size: 1.1rem;
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  background-color: ${props => props.isActive ? '#3182ce' : '#e2e8f0'};
  color: ${props => props.isActive ? 'white' : '#4a5568'};
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.isActive ? '#2c5282' : '#cbd5e0'};
  }
`;

const ForumList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ForumCard = styled(motion.div)`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ForumTitle = styled.h3`
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const ForumDescription = styled.p`
  color: #718096;
  margin-bottom: 1rem;
`;

const ForumMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #a0aec0;
  font-size: 0.875rem;
`;

const mockForums: Forum[] = [
  {
    id: '1',
    title: 'Machine Learning & AI',
    description: 'Discuss the latest in artificial intelligence, machine learning algorithms, and deep learning.',
    category: 'Technology',
    threadsCount: 156,
    lastActivity: '2 minutes ago'
  },
  {
    id: '2',
    title: 'Web Development',
    description: 'Share experiences and questions about frontend, backend, and full-stack development.',
    category: 'Technology',
    threadsCount: 243,
    lastActivity: '5 minutes ago'
  },
  {
    id: '3',
    title: 'Academic Research',
    description: 'Connect with peers about research methodologies, paper writing, and publications.',
    category: 'Academic',
    threadsCount: 89,
    lastActivity: '15 minutes ago'
  },
  {
    id: '4',
    title: 'Career Development',
    description: 'Tips, advice, and discussions about career growth in tech and academia.',
    category: 'Career',
    threadsCount: 167,
    lastActivity: '1 hour ago'
  }
];

const categories = ['All', 'Technology', 'Academic', 'Career', 'Projects', 'Events'];

export const ForumsList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredForums = mockForums.filter(forum => 
    (selectedCategory === 'All' || forum.category === selectedCategory) &&
    (forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     forum.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <ForumsContainer>
      <Header>
        <Title>Forums & Interest Groups</Title>
        <Description>
          Join discussions, share knowledge, and connect with peers in your areas of interest.
        </Description>
      </Header>

      <CategoryFilter>
        {categories.map(category => (
          <CategoryButton
            key={category}
            isActive={category === selectedCategory}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryFilter>

      <ForumList>
        {filteredForums.map(forum => (
          <Link 
            key={forum.id} 
            to={`/forums/${forum.id}`}
            style={{ textDecoration: 'none' }}
          >
            <ForumCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ForumTitle>{forum.title}</ForumTitle>
              <ForumDescription>{forum.description}</ForumDescription>
              <ForumMeta>
                <span>{forum.threadsCount} threads</span>
                <span>Last activity: {forum.lastActivity}</span>
              </ForumMeta>
            </ForumCard>
          </Link>
        ))}
      </ForumList>
    </ForumsContainer>
  );
};

export default ForumsList;
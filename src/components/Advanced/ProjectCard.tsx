import React from 'react';
import styled from '@emotion/styled';
import theme from '../../theme/theme';

interface ProjectCardProps {
  title: string;
  description: string;
  author: string;
  status: 'Available' | 'Ongoing' | 'Completed';
  tags: string[];
  stats: {
    interests: number;
    needed: number;
    views: number;
  };
  location: string;
  postedDate: string;
  avatarUrl?: string;
}

const Card = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.card};
  padding: ${theme.spacing.lg};
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const Status = styled.span<{ status: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status }) => {
    switch (status.toLowerCase()) {
      case 'available':
        return '#E8F5E9';
      case 'ongoing':
        return '#FFF3E0';
      case 'completed':
        return '#E3F2FD';
      default:
        return '#F5F5F5';
    }
  }};
  color: ${({ status }) => {
    switch (status.toLowerCase()) {
      case 'available':
        return '#4CAF50';
      case 'ongoing':
        return '#FF9800';
      case 'completed':
        return '#2196F3';
      default:
        return '#757575';
    }
  }};
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const Description = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: ${theme.spacing.md};
`;

const TagsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: #F5F5F5;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  font-size: 12px;
  color: ${theme.colors.text.secondary};
`;

const Stats = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid #EEEEEE;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.text.secondary};
  font-size: 14px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.md};
  font-size: 12px;
  color: ${theme.colors.text.secondary};
`;

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  author,
  status,
  tags,
  stats,
  location,
  postedDate,
  avatarUrl
}) => {
  return (
    <Card>
      <CardHeader>
        {avatarUrl && <Avatar src={avatarUrl} alt={author} />}
        <div>
          <Title>{title}</Title>
          <Status status={status}>{status}</Status>
        </div>
      </CardHeader>

      <Description>{description}</Description>

      <TagsContainer>
        {tags.map((tag, index) => (
          <Tag key={index}>{tag}</Tag>
        ))}
      </TagsContainer>

      <Stats>
        <StatItem>
          <i className="far fa-heart"></i>
          {stats.interests} Interests
        </StatItem>
        <StatItem>
          <i className="far fa-user"></i>
          {stats.needed} Needed
        </StatItem>
        <StatItem>
          <i className="far fa-eye"></i>
          {stats.views} Views
        </StatItem>
      </Stats>

      <Footer>
        <span>
          <i className="fas fa-map-marker-alt"></i> {location}
        </span>
        <span>Posted on {postedDate}</span>
      </Footer>
    </Card>
  );
};

export default ProjectCard;
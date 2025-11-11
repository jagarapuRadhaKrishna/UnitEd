import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Design/Card';
import { Button } from '../components/Design/Button';
import { Badge } from '../components/Design/Badge';
import { Avatar } from '../components/Design/Avatar';
import { Grid, GridItem } from '../components/Design/Grid';

const OpportunityContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
`;

const Subtitle = styled.div`
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
`;

const TagsContainer = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
`;

const Description = styled.div`
  color: var(--color-text-primary);
  line-height: var(--line-height-relaxed);
  white-space: pre-wrap;
`;

const RequirementList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--color-border);

    &:last-child {
      border-bottom: none;
    }

    &::before {
      content: '•';
      color: var(--color-primary);
    }
  }
`;

const ApplicantCard = styled(Card)`
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const ApplicantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const ApplicantName = styled.div`
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
`;

const ApplicantRole = styled.div`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

// Mock data - replace with real data fetching
const mockOpportunity = {
  id: '1',
  title: 'Research Assistant - AI Ethics Project',
  department: 'Computer Science',
  postedBy: {
    name: 'Dr. Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
    role: 'Associate Professor'
  },
  status: 'Open',
  deadline: '2025-12-01',
  tags: ['AI/ML', 'Ethics', 'Research', 'Part-time'],
  description: `We are seeking a motivated research assistant to join our AI Ethics research team. The project focuses on developing ethical guidelines for AI implementation in educational settings.

Key areas of research include:
• Bias detection in educational AI systems
• Privacy considerations in student data analysis
• Ethical framework development for AI-driven decision making`,
  requirements: [
    'Strong understanding of AI/ML concepts',
    'Background in ethics or philosophy',
    'Experience with qualitative research methods',
    'Excellent written and verbal communication skills',
    'Ability to work 15-20 hours per week'
  ],
  applicants: [
    {
      id: '1',
      name: 'John Smith',
      avatar: '/avatars/john.jpg',
      role: 'Graduate Student',
      skills: ['Machine Learning', 'Python', 'Research']
    },
    // Add more applicants as needed
  ]
};

const OpportunityDetails: React.FC = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    setIsLoading(true);
    // TODO: Implement application logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <OpportunityContainer>
      <Header>
        <HeaderContent>
          <div>
            <Title>{mockOpportunity.title}</Title>
            <Subtitle>
              {mockOpportunity.department} • Posted by {mockOpportunity.postedBy.name}
            </Subtitle>
            <TagsContainer>
              {mockOpportunity.tags.map(tag => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
            </TagsContainer>
          </div>
          <Button
            size="lg"
            onClick={handleApply}
            isLoading={isLoading}
          >
            Apply Now
          </Button>
        </HeaderContent>
      </Header>

      <Grid columns={3} gap="lg">
        <GridItem colSpan={2}>
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Description>{mockOpportunity.description}</Description>
            </CardContent>
          </Card>

          <Card style={{ marginTop: 'var(--spacing-lg)' }}>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <RequirementList>
                {mockOpportunity.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </RequirementList>
            </CardContent>
          </Card>
        </GridItem>

        <GridItem colSpan={1}>
          <Card>
            <CardHeader>
              <CardTitle>Posted By</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicantInfo>
                <Avatar
                  src={mockOpportunity.postedBy.avatar}
                  alt={mockOpportunity.postedBy.name}
                  size="lg"
                />
                <div>
                  <ApplicantName>{mockOpportunity.postedBy.name}</ApplicantName>
                  <ApplicantRole>{mockOpportunity.postedBy.role}</ApplicantRole>
                </div>
              </ApplicantInfo>
            </CardContent>
          </Card>

          <Card style={{ marginTop: 'var(--spacing-lg)' }}>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <strong>Status:</strong>{' '}
                <Badge variant="success" size="sm">
                  {mockOpportunity.status}
                </Badge>
              </div>
              <div style={{ marginTop: 'var(--spacing-sm)' }}>
                <strong>Application Deadline:</strong>
                <br />
                {new Date(mockOpportunity.deadline).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          <Card style={{ marginTop: 'var(--spacing-lg)' }}>
            <CardHeader>
              <CardTitle>Recent Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              {mockOpportunity.applicants.map(applicant => (
                <ApplicantCard
                  key={applicant.id}
                  variant="outlined"
                  style={{ marginBottom: 'var(--spacing-sm)' }}
                >
                  <CardContent>
                    <ApplicantInfo>
                      <Avatar
                        src={applicant.avatar}
                        alt={applicant.name}
                        size="md"
                      />
                      <div>
                        <ApplicantName>{applicant.name}</ApplicantName>
                        <ApplicantRole>{applicant.role}</ApplicantRole>
                      </div>
                    </ApplicantInfo>
                  </CardContent>
                </ApplicantCard>
              ))}
            </CardContent>
          </Card>
        </GridItem>
      </Grid>
    </OpportunityContainer>
  );
};

export default OpportunityDetails;
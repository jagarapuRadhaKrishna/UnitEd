import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Card, CardHeader, CardTitle, CardContent, CardActions } from '../components/Design/Card';
import { Button } from '../components/Design/Button';
import { Badge } from '../components/Design/Badge';
import { Avatar } from '../components/Design/Avatar';
import { Grid, GridItem } from '../components/Design/Grid';
import { Select } from '../components/Design/Select';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const PageTitle = styled.h1`
  font-size: var(--font-size-3xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
`;

const FilterBar = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
`;

const ApplicationCard = styled(Card)`
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    transition: all var(--transition-normal);
  }
`;

const ApplicantInfo = styled.div`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
`;

const ApplicantDetails = styled.div`
  flex: 1;
`;

const ApplicantName = styled.div`
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
`;

const ApplicantRole = styled.div`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

const SkillsList = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  margin-top: var(--spacing-sm);
`;

const StatusBadge = styled(Badge)<{ status: string }>`
  ${props => {
    switch (props.status.toLowerCase()) {
      case 'pending':
        return `
          background: var(--color-warning-light);
          color: var(--color-warning-dark);
        `;
      case 'accepted':
        return `
          background: var(--color-success-light);
          color: var(--color-success-dark);
        `;
      case 'rejected':
        return `
          background: var(--color-error-light);
          color: var(--color-error-dark);
        `;
      default:
        return '';
    }
  }}
`;

// Mock data
const mockApplications = [
  {
    id: '1',
    applicant: {
      id: '1',
      name: 'John Smith',
      avatar: '/avatars/john.jpg',
      role: 'Graduate Student',
      department: 'Computer Science'
    },
    opportunity: {
      title: 'Research Assistant - AI Ethics Project',
      department: 'Computer Science'
    },
    status: 'Pending',
    appliedDate: '2025-10-15',
    skills: ['Machine Learning', 'Python', 'Research'],
    matchScore: 85
  },
  // Add more mock applications as needed
];

interface Application {
  id: string;
  applicant: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    department: string;
  };
  opportunity: {
    title: string;
    department: string;
  };
  status: string;
  appliedDate: string;
  skills: string[];
  matchScore: number;
}

const ApplicationManagement: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [applications, setApplications] = useState<Application[]>(mockApplications);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    // TODO: Implement API call to update status
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleViewDetails = (applicationId: string) => {
    // TODO: Implement navigation to detailed view
    console.log('View details:', applicationId);
  };

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>Application Management</PageTitle>
          <div style={{ color: 'var(--color-text-secondary)' }}>
            {applications.length} applications total
          </div>
        </div>
      </PageHeader>

      <FilterBar>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Applications' },
            { value: 'pending', label: 'Pending' },
            { value: 'accepted', label: 'Accepted' },
            { value: 'rejected', label: 'Rejected' }
          ]}
        />

        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          options={[
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
            { value: 'match', label: 'Best Match' }
          ]}
        />
      </FilterBar>

      <Grid columns={1} gap="md">
        {applications.map(application => (
          <GridItem key={application.id}>
            <ApplicationCard>
              <CardContent>
                <ApplicantInfo>
                  <Avatar
                    src={application.applicant.avatar}
                    alt={application.applicant.name}
                    size="lg"
                  />
                  <ApplicantDetails>
                    <ApplicantName>{application.applicant.name}</ApplicantName>
                    <ApplicantRole>
                      {application.applicant.role} • {application.applicant.department}
                    </ApplicantRole>
                    <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
                      Applied for: <strong>{application.opportunity.title}</strong>
                    </div>
                    <SkillsList>
                      {application.skills.map(skill => (
                        <Badge key={skill} variant="secondary" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </SkillsList>
                  </ApplicantDetails>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={application.status}>
                      {application.status}
                    </StatusBadge>
                    <div style={{ 
                      marginTop: 'var(--spacing-xs)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Match Score: {application.matchScore}%
                    </div>
                  </div>
                </ApplicantInfo>
              </CardContent>
              <CardActions>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(application.id)}
                >
                  View Details
                </Button>
                {application.status === 'Pending' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusChange(application.id, 'Accepted')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusChange(application.id, 'Rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </CardActions>
            </ApplicationCard>
          </GridItem>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default ApplicationManagement;
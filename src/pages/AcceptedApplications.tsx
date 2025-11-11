import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, CheckCircle, Clock, XCircle, Filter, Search, Download, Eye } from 'lucide-react';
import AuthenticatedNavbar from '../components/Layout/AuthenticatedNavbar';

interface Application {
  id: string;
  projectTitle: string;
  projectCategory: string;
  appliedDate: string;
  status: 'Accepted' | 'Pending' | 'Rejected' | 'Under Review';
  teamLeader: string;
  teamLeaderAvatar: string;
  location: string;
  nextStep: string;
  deadline?: string;
  responseDate?: string;
  feedback?: string;
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #F9FAFB;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
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
  align-items: center;
  justify-content: space-between;
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

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  background: ${props => props.active ? '#6C47FF' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border: 1px solid ${props => props.active ? '#6C47FF' : '#E5E7EB'};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#5936E8' : '#F9FAFB'};
    border-color: #6C47FF;
  }
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #E5E7EB;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #6C47FF;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #6B7280;
  font-size: 14px;
  font-weight: 500;
`;

const ApplicationsGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const ApplicationCard = styled(motion.div)`
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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CardTitleSection = styled.div`
  flex: 1;
`;

const ProjectTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
`;

const ProjectCategory = styled.span`
  padding: 4px 12px;
  background: #EEF2FF;
  color: #6C47FF;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  background: ${props =>
    props.status === 'Accepted' ? '#ECFDF5' :
    props.status === 'Pending' ? '#FEF3C7' :
    props.status === 'Under Review' ? '#EFF6FF' :
    '#FEE2E2'
  };
  color: ${props =>
    props.status === 'Accepted' ? '#059669' :
    props.status === 'Pending' ? '#D97706' :
    props.status === 'Under Review' ? '#2563EB' :
    '#DC2626'
  };
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
`;

const CardContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-size: 14px;

  svg {
    width: 16px;
    height: 16px;
    color: #9CA3AF;
  }
`;

const TeamLeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const TeamLeaderAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const TeamLeaderDetails = styled.div`
  flex: 1;
`;

const TeamLeaderName = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 14px;
`;

const TeamLeaderRole = styled.div`
  color: #6B7280;
  font-size: 12px;
`;

const NextSteps = styled.div`
  background: #FEF3C7;
  border-left: 3px solid #F59E0B;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const NextStepTitle = styled.div`
  font-weight: 600;
  color: #92400E;
  font-size: 13px;
  margin-bottom: 4px;
`;

const NextStepText = styled.div`
  color: #78350F;
  font-size: 13px;
`;

const Feedback = styled.div`
  background: #ECFDF5;
  border-left: 3px solid #059669;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const FeedbackTitle = styled.div`
  font-weight: 600;
  color: #065F46;
  font-size: 13px;
  margin-bottom: 4px;
`;

const FeedbackText = styled.div`
  color: #047857;
  font-size: 13px;
  line-height: 1.5;
`;

const CardActions = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: 10px 16px;
  background: ${props => props.primary ? '#6C47FF' : 'white'};
  color: ${props => props.primary ? 'white' : '#6B7280'};
  border: 1px solid ${props => props.primary ? '#6C47FF' : '#E5E7EB'};
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primary ? '#5936E8' : '#F9FAFB'};
    border-color: #6C47FF;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #9CA3AF;
`;

const AcceptedApplications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Profile images
  const profileImages = {
    madhuri: 'file:///C:/Users/user/Downloads/PIC%203.jpg',
    annanya: 'file:///C:/Users/user/Downloads/PIC2.jpg',
    vedhakshi: 'file:///C:/Users/user/Downloads/PIC1.jpg',
    maaroof: 'file:///C:/Users/user/Documents/me%20in%20swag.jpg',
    krishna: 'file:///C:/Users/user/Documents/pic%20of%20me%20.jpg',
    satwika: 'file:///C:/Users/user/Documents/cute%20of%20me%20.jpg',
    chandrika: 'file:///C:/Users/user/Downloads/6293645.jpg',
  };

  const [applications] = useState<Application[]>([
    {
      id: '1',
      projectTitle: 'AI-Powered Healthcare Chatbot',
      projectCategory: 'Research',
      appliedDate: 'Nov 5, 2024',
      status: 'Accepted',
      teamLeader: 'Dr. Madhuri',
      teamLeaderAvatar: profileImages.madhuri,
      location: 'Computer Science Dept',
      nextStep: 'Join the kickoff meeting on Monday, Nov 11 at 2:00 PM',
      responseDate: 'Nov 6, 2024',
      feedback: 'Your background in NLP and machine learning makes you a perfect fit for this project. Looking forward to working with you!'
    },
    {
      id: '2',
      projectTitle: 'Blockchain-Based Credential Verification',
      projectCategory: 'Development',
      appliedDate: 'Nov 4, 2024',
      status: 'Accepted',
      teamLeader: 'Prof. Annanya',
      teamLeaderAvatar: profileImages.annanya,
      location: 'Technology Innovation Lab',
      nextStep: 'Complete the security training module before Nov 15',
      deadline: 'Nov 15, 2024',
      responseDate: 'Nov 5, 2024',
      feedback: 'Your experience with blockchain technology is exactly what we need. Welcome to the team!'
    },
    {
      id: '3',
      projectTitle: 'Climate Change Data Visualization',
      projectCategory: 'Research',
      appliedDate: 'Nov 3, 2024',
      status: 'Under Review',
      teamLeader: 'Dr. Vedhakshi',
      teamLeaderAvatar: profileImages.vedhakshi,
      location: 'Environmental Studies',
      nextStep: 'Waiting for team leader review'
    },
    {
      id: '4',
      projectTitle: 'Smart Campus IoT Platform',
      projectCategory: 'Innovation',
      appliedDate: 'Nov 2, 2024',
      status: 'Pending',
      teamLeader: 'Maaroof',
      teamLeaderAvatar: profileImages.maaroof,
      location: 'Engineering Building',
      nextStep: 'Application under consideration'
    },
    {
      id: '5',
      projectTitle: 'AR Campus Navigation App',
      projectCategory: 'Development',
      appliedDate: 'Nov 1, 2024',
      status: 'Accepted',
      teamLeader: 'Krishna',
      teamLeaderAvatar: profileImages.krishna,
      location: 'Media Lab',
      nextStep: 'Review the project documentation and submit your availability for the first sprint',
      responseDate: 'Nov 2, 2024',
      feedback: 'Your UI/UX skills and mobile development experience are excellent. Excited to have you on board!'
    }
  ]);

  const statusFilters = ['All', 'Accepted', 'Pending', 'Under Review', 'Rejected'];

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesSearch = searchQuery === '' ||
      app.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.teamLeader.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applications.length,
    accepted: applications.filter(a => a.status === 'Accepted').length,
    pending: applications.filter(a => a.status === 'Pending').length,
    underReview: applications.filter(a => a.status === 'Under Review').length
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle size={16} />;
      case 'Pending':
        return <Clock size={16} />;
      case 'Under Review':
        return <Eye size={16} />;
      case 'Rejected':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <PageWrapper>
      <AuthenticatedNavbar />

      <Container>
        <Header>
          <Title>My Applications</Title>
          <Subtitle>Track and manage all your project applications</Subtitle>
        </Header>

        <StatsBar>
          <StatCard>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Applications</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue style={{ color: '#059669' }}>{stats.accepted}</StatValue>
            <StatLabel>Accepted</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue style={{ color: '#D97706' }}>{stats.pending}</StatValue>
            <StatLabel>Pending</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue style={{ color: '#2563EB' }}>{stats.underReview}</StatValue>
            <StatLabel>Under Review</StatLabel>
          </StatCard>
        </StatsBar>

        <TopBar>
          <SearchBox>
            <SearchIcon />
            <SearchInput 
              placeholder="Search by project or team leader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>

          <FilterBar>
            {statusFilters.map(status => (
              <FilterChip
                key={status}
                active={filterStatus === status}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </FilterChip>
            ))}
          </FilterBar>
        </TopBar>

        <div style={{ marginBottom: '16px', color: '#6B7280', fontSize: '14px' }}>
          Showing {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
        </div>

        <ApplicationsGrid>
          {filteredApplications.map((app, index) => (
            <ApplicationCard
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CardHeader>
                <CardTitleSection>
                  <ProjectTitle>{app.projectTitle}</ProjectTitle>
                  <ProjectCategory>{app.projectCategory}</ProjectCategory>
                </CardTitleSection>
                <StatusBadge status={app.status}>
                  {getStatusIcon(app.status)}
                  {app.status}
                </StatusBadge>
              </CardHeader>

              <TeamLeaderInfo>
                <TeamLeaderAvatar src={app.teamLeaderAvatar} alt={app.teamLeader} />
                <TeamLeaderDetails>
                  <TeamLeaderName>{app.teamLeader}</TeamLeaderName>
                  <TeamLeaderRole>Team Leader</TeamLeaderRole>
                </TeamLeaderDetails>
              </TeamLeaderInfo>

              <CardContent>
                <InfoItem>
                  <Calendar />
                  Applied: {app.appliedDate}
                </InfoItem>
                <InfoItem>
                  <MapPin />
                  {app.location}
                </InfoItem>
                {app.responseDate && (
                  <InfoItem>
                    <CheckCircle />
                    Response: {app.responseDate}
                  </InfoItem>
                )}
                {app.deadline && (
                  <InfoItem style={{ color: '#DC2626' }}>
                    <Clock />
                    Deadline: {app.deadline}
                  </InfoItem>
                )}
              </CardContent>

              {app.status === 'Accepted' && app.nextStep && (
                <NextSteps>
                  <NextStepTitle>Next Steps</NextStepTitle>
                  <NextStepText>{app.nextStep}</NextStepText>
                </NextSteps>
              )}

              {app.feedback && (
                <Feedback>
                  <FeedbackTitle>Team Leader's Feedback</FeedbackTitle>
                  <FeedbackText>{app.feedback}</FeedbackText>
                </Feedback>
              )}

              <CardActions>
                {app.status === 'Accepted' && (
                  <>
                    <ActionButton primary onClick={() => alert('Opening project details...')}>
                      <Eye size={16} />
                      View Project
                    </ActionButton>
                    <ActionButton onClick={() => alert('Downloading documents...')}>
                      <Download size={16} />
                      Documents
                    </ActionButton>
                  </>
                )}
                {app.status === 'Pending' || app.status === 'Under Review' ? (
                  <>
                    <ActionButton primary onClick={() => alert('Opening application details...')}>
                      <Eye size={16} />
                      View Details
                    </ActionButton>
                    <ActionButton onClick={() => alert('Withdrawing application...')}>
                      <XCircle size={16} />
                      Withdraw
                    </ActionButton>
                  </>
                ) : null}
              </CardActions>
            </ApplicationCard>
          ))}
        </ApplicationsGrid>

        {filteredApplications.length === 0 && (
          <EmptyState>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ color: '#6B7280', marginBottom: '8px' }}>No applications found</h3>
            <p>Try adjusting your search or filters</p>
          </EmptyState>
        )}
      </Container>
    </PageWrapper>
  );
};

export default AcceptedApplications;

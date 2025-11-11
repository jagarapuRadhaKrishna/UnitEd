import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sendHackathonRegistrationEmail } from '../../services/emailService';

interface EventDetails {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'hackathon' | 'workshop' | 'seminar' | 'conference' | 'other';
  organizerName: string;
  organizerAvatar: string;
  capacity: number;
  registeredCount: number;
  requirements?: string[];
  agenda?: { time: string; activity: string }[];
  organizers: {
    name: string;
    role: string;
    avatar: string;
  }[];
}

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const EventType = styled.span<{ type: string }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
  background-color: ${props => {
    switch (props.type) {
      case 'hackathon': return '#e9d8fd';
      case 'workshop': return '#b2f5ea';
      case 'seminar': return '#feebc8';
      case 'conference': return '#bee3f8';
      default: return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'hackathon': return '#6b46c1';
      case 'workshop': return '#319795';
      case 'seminar': return '#dd6b20';
      case 'conference': return '#2b6cb0';
      default: return '#4a5568';
    }
  }};
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
`;

const ContentSection = styled.section`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const Description = styled.div`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const RequirementsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const RequirementItem = styled(motion.li)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: #4a5568;

  &:before {
    content: '✓';
    color: #48bb78;
  }
`;

const AgendaTable = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

const AgendaRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 150px 1fr;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }

  &:nth-of-type(odd) {
    background-color: #f7fafc;
  }
`;

const OrganizersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const OrganizerCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background-color: #f7fafc;
  border-radius: 8px;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
`;

const RegisterSection = styled.div`
  position: sticky;
  bottom: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CapacityInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number }>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #3182ce;
  transition: width 0.3s ease;
`;

const RegisterButton = styled.button<{ isRegistered: boolean }>`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  background-color: ${props => props.isRegistered ? '#48bb78' : '#3182ce'};
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.isRegistered ? '#38a169' : '#2c5282'};
  }
`;

const mockEventDetails: EventDetails = {
  id: '1',
  title: 'AI/ML Hackathon 2025',
  description: 'Join us for an exciting 48-hour hackathon focused on developing innovative solutions using artificial intelligence and machine learning. Work with like-minded individuals, learn from industry experts, and compete for amazing prizes!',
  startDate: '2025-11-15T09:00:00',
  endDate: '2025-11-17T09:00:00',
  location: 'Main Campus, Building A',
  type: 'hackathon',
  organizerName: 'Tech Innovation Club',
  organizerAvatar: 'https://i.pravatar.cc/150?u=tech-club',
  capacity: 100,
  registeredCount: 75,
  requirements: [
    'Basic understanding of Python programming',
    'Laptop with minimum 8GB RAM',
    'Prior experience with ML libraries (optional)',
    'GitHub account',
    'Enthusiasm to learn and collaborate'
  ],
  agenda: [
    { time: '9:00 AM', activity: 'Registration and Team Formation' },
    { time: '10:00 AM', activity: 'Opening Ceremony and Problem Statement Release' },
    { time: '11:00 AM', activity: 'Workshop: Introduction to AI/ML Tools' },
    { time: '12:00 PM', activity: 'Lunch Break' },
    { time: '1:00 PM', activity: 'Hacking Begins' }
  ],
  organizers: [
    {
      name: 'Dr. Sarah Chen',
      role: 'Head Organizer',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    {
      name: 'Mike Peterson',
      role: 'Technical Lead',
      avatar: 'https://i.pravatar.cc/150?u=mike'
    },
    {
      name: 'Emma Wilson',
      role: 'Workshop Coordinator',
      avatar: 'https://i.pravatar.cc/150?u=emma'
    }
  ]
};

export const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (isRegistered) {
      setIsRegistered(false);
      return;
    }

    setLoading(true);
    
    // Get user email from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const userEmail = profileData.email || user.email || 'user@example.com';

    // Send registration confirmation email
    try {
      await sendHackathonRegistrationEmail(
        userEmail,
        mockEventDetails.title,
        {
          date: formatDate(mockEventDetails.startDate),
          location: mockEventDetails.location,
          time: new Date(mockEventDetails.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }
      );

      setIsRegistered(true);
      alert(`🎉 Registration Successful!\n\nA confirmation email has been sent to ${userEmail} with all event details.`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Registration successful! However, we could not send the confirmation email. Please check your email settings.');
      setIsRegistered(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <Header>
        <EventType type={mockEventDetails.type}>
          {mockEventDetails.type.charAt(0).toUpperCase() + mockEventDetails.type.slice(1)}
        </EventType>
        <Title>{mockEventDetails.title}</Title>
        <MetaInfo>
          <MetaItem>
            <span>📅</span>
            {formatDate(mockEventDetails.startDate)}
          </MetaItem>
          <MetaItem>
            <span>📍</span>
            {mockEventDetails.location}
          </MetaItem>
          <MetaItem>
            <span>👥</span>
            {mockEventDetails.registeredCount} / {mockEventDetails.capacity} registered
          </MetaItem>
        </MetaInfo>
      </Header>

      <ContentSection>
        <SectionTitle>About the Event</SectionTitle>
        <Description>{mockEventDetails.description}</Description>
      </ContentSection>

      <ContentSection>
        <SectionTitle>Requirements</SectionTitle>
        <RequirementsList>
          {mockEventDetails.requirements?.map((req, index) => (
            <RequirementItem
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {req}
            </RequirementItem>
          ))}
        </RequirementsList>
      </ContentSection>

      <ContentSection>
        <SectionTitle>Agenda</SectionTitle>
        <AgendaTable>
          {mockEventDetails.agenda?.map((item, index) => (
            <AgendaRow
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div>{item.time}</div>
              <div>{item.activity}</div>
            </AgendaRow>
          ))}
        </AgendaTable>
      </ContentSection>

      <ContentSection>
        <SectionTitle>Organizers</SectionTitle>
        <OrganizersList>
          {mockEventDetails.organizers.map((organizer, index) => (
            <OrganizerCard
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Avatar src={organizer.avatar} alt={organizer.name} />
              <h3>{organizer.name}</h3>
              <p>{organizer.role}</p>
            </OrganizerCard>
          ))}
        </OrganizersList>
      </ContentSection>

      <RegisterSection>
        <CapacityInfo>
          <div>{mockEventDetails.registeredCount} / {mockEventDetails.capacity} Registered</div>
          <ProgressBar>
            <Progress width={(mockEventDetails.registeredCount / mockEventDetails.capacity) * 100} />
          </ProgressBar>
        </CapacityInfo>
        <RegisterButton
          isRegistered={isRegistered}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Processing...' : (isRegistered ? 'Registered ✓' : 'Register Now')}
        </RegisterButton>
      </RegisterSection>
    </Container>
  );
};

export default EventDetails;
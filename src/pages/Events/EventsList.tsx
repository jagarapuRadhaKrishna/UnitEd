import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApplicationModal from '../../components/Application/ApplicationModal';

interface Event {
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
  isRegistered: boolean;
}

const Container = styled.div`
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

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ isActive: boolean }>`
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

const CalendarViewButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #3182ce;
  border-radius: 6px;
  background-color: white;
  color: #3182ce;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  margin-left: auto;

  &:hover {
    background-color: #ebf8ff;
  }
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const EventCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const EventImage = styled.div<{ type: string }>`
  height: 160px;
  background: ${props => {
    switch (props.type) {
      case 'hackathon': return 'linear-gradient(135deg, #6b46c1, #805ad5)';
      case 'workshop': return 'linear-gradient(135deg, #319795, #38b2ac)';
      case 'seminar': return 'linear-gradient(135deg, #dd6b20, #ed8936)';
      case 'conference': return 'linear-gradient(135deg, #2b6cb0, #4299e1)';
      default: return 'linear-gradient(135deg, #718096, #a0aec0)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const EventDescription = styled.p`
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const OrganizerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProgressBar = styled.div`
  height: 4px;
  background-color: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const Progress = styled.div<{ width: number }>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #3182ce;
  transition: width 0.3s ease;
`;

const RegisterButton = styled.button<{ isRegistered: boolean }>`
  width: 100%;
  padding: 0.75rem;
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

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'AI/ML Hackathon 2025',
    description: 'Join us for a 48-hour hackathon focused on artificial intelligence and machine learning solutions for real-world problems.',
    startDate: '2025-11-15T09:00:00',
    endDate: '2025-11-17T09:00:00',
    location: 'Main Campus, Building A',
    type: 'hackathon',
    organizerName: 'Tech Innovation Club',
    organizerAvatar: 'https://i.pravatar.cc/150?u=tech-club',
    capacity: 100,
    registeredCount: 75,
    isRegistered: false
  },
  {
    id: '2',
    title: 'Web Development Workshop',
    description: 'Learn modern web development techniques with React, Node.js, and cloud deployment.',
    startDate: '2025-11-20T14:00:00',
    endDate: '2025-11-20T17:00:00',
    location: 'Virtual',
    type: 'workshop',
    organizerName: 'Dev Society',
    organizerAvatar: 'https://i.pravatar.cc/150?u=dev-society',
    capacity: 50,
    registeredCount: 32,
    isRegistered: true
  },
  {
    id: '3',
    title: 'Research Methodology Seminar',
    description: 'Essential seminar for graduate students covering research methods, paper writing, and publication strategies.',
    startDate: '2025-11-25T10:00:00',
    endDate: '2025-11-25T16:00:00',
    location: 'Conference Hall B',
    type: 'seminar',
    organizerName: 'Research Department',
    organizerAvatar: 'https://i.pravatar.cc/150?u=research-dept',
    capacity: 200,
    registeredCount: 145,
    isRegistered: false
  }
];

const eventTypes = ['all', 'hackathon', 'workshop', 'seminar', 'conference', 'other'];

export const EventsList: React.FC = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const filteredEvents = mockEvents.filter(event => 
    selectedType === 'all' || event.type === selectedType
  );

  const handleRegister = (event: Event) => {
    if (event.isRegistered) {
      alert('You are already registered for this event!');
      return;
    }
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <Header>
        <Title>Academic Events & Hackathons</Title>
        <Description>
          Discover and participate in upcoming events, workshops, and hackathons.
        </Description>
      </Header>

      <FiltersContainer>
        {eventTypes.map(type => (
          <FilterButton
            key={type}
            isActive={selectedType === type}
            onClick={() => setSelectedType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </FilterButton>
        ))}
        <CalendarViewButton onClick={() => setShowCalendarView(!showCalendarView)}>
          {showCalendarView ? 'List View' : 'Calendar View'}
        </CalendarViewButton>
      </FiltersContainer>

      <EventGrid>
        {filteredEvents.map(event => (
          <EventCard
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EventImage type={event.type}>
              {event.type === 'hackathon' ? '🏆' : 
               event.type === 'workshop' ? '💻' : 
               event.type === 'seminar' ? '📚' : 
               event.type === 'conference' ? '🎤' : '📅'}
            </EventImage>
            <EventContent>
              <EventTitle>{event.title}</EventTitle>
              <EventDescription>{event.description}</EventDescription>
              <EventMeta>
                <span>📅 {formatDate(event.startDate)}</span>
                <span>📍 {event.location}</span>
              </EventMeta>
              <OrganizerInfo>
                <Avatar src={event.organizerAvatar} alt={event.organizerName} />
                <span>{event.organizerName}</span>
              </OrganizerInfo>
              <ProgressBar>
                <Progress width={(event.registeredCount / event.capacity) * 100} />
              </ProgressBar>
              <RegisterButton
                isRegistered={event.isRegistered}
                onClick={() => handleRegister(event)}
              >
                {event.isRegistered ? 'Registered ✓' : 'Register Now'}
              </RegisterButton>
            </EventContent>
          </EventCard>
        ))}
      </EventGrid>

      {/* Registration Modal */}
      {selectedEvent && (
        <ApplicationModal
          open={showRegistrationModal}
          onClose={() => {
            setShowRegistrationModal(false);
            setSelectedEvent(null);
          }}
          type={selectedEvent.type === 'hackathon' ? 'hackathon' : 'event'}
          item={{
            id: selectedEvent.id,
            title: selectedEvent.title,
            description: selectedEvent.description,
            creatorEmail: 'organizer@university.edu', // In production, use actual organizer email
            date: formatDate(selectedEvent.startDate) + ' - ' + formatDate(selectedEvent.endDate),
            location: selectedEvent.location,
            duration: 'See event details',
          }}
          onSuccess={() => {
            console.log('Successfully registered for event:', selectedEvent.title);
          }}
        />
      )}
    </Container>
  );
};

export default EventsList;
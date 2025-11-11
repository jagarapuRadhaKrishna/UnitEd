import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: 'hackathon' | 'workshop' | 'seminar' | 'conference' | 'other';
}

interface Day {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MonthTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  min-width: 200px;
  text-align: center;
`;

const NavButton = styled.button`
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #4a5568;
  transition: all 0.2s;

  &:hover {
    background-color: #f7fafc;
  }
`;

const WeekdaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #f7fafc;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
`;

const Weekday = styled.div`
  padding: 0.75rem;
  text-align: center;
  font-weight: 500;
  color: #4a5568;
  background-color: white;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e2e8f0;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
`;

const CalendarCell = styled.div<{ isCurrentMonth: boolean }>`
  background-color: white;
  min-height: 120px;
  padding: 0.5rem;
  color: ${props => props.isCurrentMonth ? '#2d3748' : '#a0aec0'};
`;

const DateNumber = styled.div<{ isToday?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  background-color: ${props => props.isToday ? '#3182ce' : 'transparent'};
  color: ${props => props.isToday ? 'white' : 'inherit'};
`;

const EventIndicator = styled(motion.div)<{ eventType: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  background-color: ${props => {
    switch (props.eventType) {
      case 'hackathon': return '#e9d8fd';
      case 'workshop': return '#b2f5ea';
      case 'seminar': return '#feebc8';
      case 'conference': return '#bee3f8';
      default: return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.eventType) {
      case 'hackathon': return '#6b46c1';
      case 'workshop': return '#319795';
      case 'seminar': return '#dd6b20';
      case 'conference': return '#2b6cb0';
      default: return '#4a5568';
    }
  }};
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getCalendarDays = (date: Date): Day[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Day[] = [];
    
    // Add days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({
        date: prevDate,
        isCurrentMonth: false,
        events: []
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        events: []
      });
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length; // Always show 6 weeks
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        events: []
      });
    }
    
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getCalendarDays(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <Container>
      <Header>
        <MonthNavigation>
          <NavButton onClick={prevMonth}>Previous</NavButton>
          <MonthTitle>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </MonthTitle>
          <NavButton onClick={nextMonth}>Next</NavButton>
        </MonthNavigation>
      </Header>

      <WeekdaysHeader>
        {WEEKDAYS.map(day => (
          <Weekday key={day}>{day}</Weekday>
        ))}
      </WeekdaysHeader>

      <CalendarGrid>
        {days.map((day, index) => (
          <CalendarCell key={index} isCurrentMonth={day.isCurrentMonth}>
            <DateNumber isToday={isToday(day.date)}>
              {day.date.getDate()}
            </DateNumber>
            {day.events.map(event => (
              <EventIndicator
                key={event.id}
                eventType={event.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {event.title}
              </EventIndicator>
            ))}
          </CalendarCell>
        ))}
      </CalendarGrid>
    </Container>
  );
};

export default CalendarView;
import React from 'react';
import styled from '@emotion/styled';
import theme from '../theme';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const ProfileHeader = styled.div`
  background: ${theme.colors.background.gradient};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xl};
  color: white;
  position: relative;
  margin-bottom: ${theme.spacing.xl};
`;

const CoverPhoto = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  border-radius: ${theme.borderRadius.large} ${theme.borderRadius.large} 0 0;
  background-image: url('https://via.placeholder.com/1200x200');
  background-size: cover;
  background-position: center;
`;

const ProfileContent = styled.div`
  position: relative;
  margin-top: 120px;
  display: flex;
  gap: ${theme.spacing.xl};
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: 32px;
  margin-bottom: ${theme.spacing.sm};
`;

const Bio = styled.p`
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: ${theme.spacing.md};
`;

const Stats = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.8;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${props => props.active ? theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : theme.colors.text.primary};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: ${props => props.active ? theme.colors.primary : '#F5F5F5'};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
`;

const SkillCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.card};
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const SkillName = styled.h3`
  font-size: 18px;
  color: ${theme.colors.text.primary};
`;

const SkillLevel = styled.div`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 6px;
  background: #E0E0E0;
  border-radius: ${theme.borderRadius.small};
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: ${theme.colors.primary};
  }
`;

const Profile: React.FC = () => {
  const mockSkills = [
    { name: 'React', level: 'Advanced', progress: 90 },
    { name: 'Node.js', level: 'Intermediate', progress: 75 },
    { name: 'TypeScript', level: 'Advanced', progress: 85 },
    { name: 'Python', level: 'Intermediate', progress: 70 },
    { name: 'UI/UX Design', level: 'Beginner', progress: 60 },
    { name: 'DevOps', level: 'Intermediate', progress: 65 },
  ];

  return (
    <Container>
      <ProfileHeader>
        <CoverPhoto />
        <ProfileContent>
          <Avatar src="https://via.placeholder.com/120" alt="Profile" />
          <ProfileInfo>
            <Name>John Doe</Name>
            <Bio>Full Stack Developer | AI Enthusiast | Open Source Contributor</Bio>
            <Stats>
              <StatItem>
                <StatValue>15</StatValue>
                <StatLabel>Projects</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>234</StatValue>
                <StatLabel>Connections</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>45</StatValue>
                <StatLabel>Ideas</StatLabel>
              </StatItem>
            </Stats>
          </ProfileInfo>
        </ProfileContent>
      </ProfileHeader>

      <TabsContainer>
        <Tab active>Skills</Tab>
        <Tab>Projects</Tab>
        <Tab>Ideas</Tab>
        <Tab>Connections</Tab>
      </TabsContainer>

      <Grid>
        {mockSkills.map((skill, index) => (
          <SkillCard key={index}>
            <SkillHeader>
              <SkillName>{skill.name}</SkillName>
              <SkillLevel>{skill.level}</SkillLevel>
            </SkillHeader>
            <ProgressBar progress={skill.progress} />
          </SkillCard>
        ))}
      </Grid>
    </Container>
  );
};

export default Profile;
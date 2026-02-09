import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Calendar, MapPin, Eye, Heart, Share2, UserPlus } from 'lucide-react';
import theme from '../../theme/theme';
import { sendApplicationConfirmationEmail } from '../../services/emailService';
import ApplicationModal from '../Application/ApplicationModal';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
}

interface ProjectDetailProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    fullDescription?: string;
    author: string;
    teamLeader: {
      name: string;
      avatar: string;
      email: string;
      department: string;
    };
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
    teamMembers?: TeamMember[];
    requirements?: string[];
    timeline?: string;
    category?: string;
  };
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  background: white;
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 10;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B7280;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #F3F4F6;
    color: #111827;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ProjectTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  line-height: 1.3;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  background: ${props => 
    props.status === 'Available' ? '#ECFDF5' :
    props.status === 'Ongoing' ? '#FEF3C7' :
    '#F3F4F6'
  };
  color: ${props => 
    props.status === 'Available' ? '#059669' :
    props.status === 'Ongoing' ? '#D97706' :
    '#6B7280'
  };
  display: inline-block;
  margin-bottom: 16px;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #E5E7EB;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-size: 14px;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Description = styled.p`
  color: #4B5563;
  line-height: 1.7;
  font-size: 15px;
  margin-bottom: 16px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const Tag = styled.span`
  padding: 6px 12px;
  background: #EEF2FF;
  color: #6C47FF;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
`;

const TeamLeaderCard = styled.div`
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const LeaderHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`;

const LeaderAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
`;

const LeaderInfo = styled.div`
  flex: 1;
`;

const LeaderName = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const LeaderMeta = styled.div`
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 2px;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const MemberCard = styled.div`
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  transition: all 0.2s;

  &:hover {
    border-color: #6C47FF;
    transform: translateY(-2px);
  }
`;

const MemberAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 12px;
  object-fit: cover;
`;

const MemberName = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
  font-size: 14px;
`;

const MemberRole = styled.div`
  color: #6B7280;
  font-size: 12px;
  margin-bottom: 8px;
`;

const MemberSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
`;

const SkillTag = styled.span`
  padding: 3px 8px;
  background: #EEF2FF;
  color: #6C47FF;
  border-radius: 4px;
  font-size: 11px;
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RequirementItem = styled.li`
  padding: 12px 16px;
  background: #F9FAFB;
  border-left: 3px solid #6C47FF;
  margin-bottom: 8px;
  border-radius: 4px;
  color: #374151;
  font-size: 14px;
`;

const StatsBar = styled.div`
  display: flex;
  gap: 32px;
  padding: 20px;
  background: #F9FAFB;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #6C47FF;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px;
  background: #F9FAFB;
  border-top: 1px solid #E5E7EB;
  position: sticky;
  bottom: 0;
`;

const ApplyButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  background: #6C47FF;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #5936E8;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #D1D5DB;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  padding: 14px 20px;
  background: white;
  color: #6B7280;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #F9FAFB;
    border-color: #6C47FF;
    color: #6C47FF;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #9CA3AF;
  font-size: 14px;
`;

// Application Dialog Styles
const DialogOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const DialogContainer = styled(motion.div)`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
`;

const DialogHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DialogTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const DialogBody = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const RequiredStar = styled.span`
  color: #EF4444;
  margin-left: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #6C47FF;
    box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.1);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #6C47FF;
    box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.1);
  }
`;

const FileInputContainer = styled.div`
  border: 2px dashed #E5E7EB;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #6C47FF;
    background: #F9FAFB;
  }
`;

const FileInputLabel = styled.label`
  cursor: pointer;
  display: block;
  color: #6B7280;
  font-size: 14px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileName = styled.div`
  margin-top: 8px;
  color: #6C47FF;
  font-size: 13px;
  font-weight: 500;
`;

const DialogFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #E5E7EB;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: #6C47FF;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5A3AD6;
  }
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background: white;
  color: #6B7280;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #F9FAFB;
  }
`;

const ProjectDetailModal: React.FC<ProjectDetailProps> = ({ isOpen, onClose, project }) => {
  const [isInterested, setIsInterested] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    skills: '',
    availability: '',
    resumeFile: null as File | null,
  });

  // Check if user has saved profile for Easy Apply
  const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const hasCompleteProfile = savedProfile.email && savedProfile.resume;

  if (!isOpen) return null;

  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const handleEasyApply = () => {
    // Use the ApplicationModal for easy apply too
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!applicationData.coverLetter || !applicationData.skills) {
      alert('Please fill in all required fields!');
      return;
    }
    
    // Get user email
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const userEmail = profileData.email || user.email || 'user@example.com';

    // Send application confirmation email
    try {
      await sendApplicationConfirmationEmail(
        userEmail,
        project.title,
        {
          coverLetter: applicationData.coverLetter,
          skills: applicationData.skills,
          availability: applicationData.availability,
        }
      );

      console.log('Application submitted:', applicationData);
      alert(`🎉 Application Submitted Successfully!\n\nA confirmation email has been sent to ${userEmail}.\nThe team leader will review your application and contact you soon.`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Application submitted! However, we could not send the confirmation email.');
    }
    
    setShowApplicationDialog(false);
    setApplicationData({
      coverLetter: '',
      skills: '',
      availability: '',
      resumeFile: null,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData({ ...applicationData, resumeFile: e.target.files[0] });
    }
  };

  const handleInterest = () => {
    setIsInterested(!isInterested);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Project link copied to clipboard!');
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContainer
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <div>
              <ProjectTitle>{project.title}</ProjectTitle>
              <StatusBadge status={project.status}>{project.status}</StatusBadge>
            </div>
            <CloseButton onClick={onClose}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            <MetaInfo>
              <MetaItem>
                <Calendar />
                {project.postedDate}
              </MetaItem>
              <MetaItem>
                <MapPin />
                {project.location}
              </MetaItem>
              <MetaItem>
                <Eye />
                {project.stats.views} views
              </MetaItem>
              {project.category && (
                <MetaItem>
                  📂 {project.category}
                </MetaItem>
              )}
            </MetaInfo>

            <StatsBar>
              <StatItem>
                <StatValue>{project.stats.interests}</StatValue>
                <StatLabel>Interested</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{project.stats.needed}</StatValue>
                <StatLabel>Members Needed</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{project.teamMembers?.length || 0}</StatValue>
                <StatLabel>Current Team</StatLabel>
              </StatItem>
            </StatsBar>

            <Section>
              <SectionTitle>About This Project</SectionTitle>
              <Description>
                {project.fullDescription || project.description}
              </Description>
            </Section>

            <Section>
              <SectionTitle>Required Skills</SectionTitle>
              <TagsContainer>
                {project.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagsContainer>
            </Section>

            <Section>
              <SectionTitle>
                <Users size={20} /> Team Leader
              </SectionTitle>
              <TeamLeaderCard>
                <LeaderHeader>
                  <LeaderAvatar 
                    src={project.teamLeader.avatar || `https://ui-avatars.com/api/?name=${project.teamLeader.name}&background=6C47FF&color=fff`} 
                    alt={project.teamLeader.name} 
                  />
                  <LeaderInfo>
                    <LeaderName>{project.teamLeader.name}</LeaderName>
                    <LeaderMeta>{project.teamLeader.department}</LeaderMeta>
                    <LeaderMeta>✉️ {project.teamLeader.email}</LeaderMeta>
                  </LeaderInfo>
                </LeaderHeader>
              </TeamLeaderCard>
            </Section>

            {project.teamMembers && project.teamMembers.length > 0 && (
              <Section>
                <SectionTitle>
                  <Users size={20} /> Team Members ({project.teamMembers.length})
                </SectionTitle>
                <TeamGrid>
                  {project.teamMembers.map((member) => (
                    <MemberCard key={member.id}>
                      <MemberAvatar 
                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`} 
                        alt={member.name} 
                      />
                      <MemberName>{member.name}</MemberName>
                      <MemberRole>{member.role}</MemberRole>
                      <MemberSkills>
                        {member.skills.slice(0, 2).map((skill, idx) => (
                          <SkillTag key={idx}>{skill}</SkillTag>
                        ))}
                      </MemberSkills>
                    </MemberCard>
                  ))}
                </TeamGrid>
              </Section>
            )}

            {project.requirements && project.requirements.length > 0 && (
              <Section>
                <SectionTitle>Requirements</SectionTitle>
                <RequirementsList>
                  {project.requirements.map((req, index) => (
                    <RequirementItem key={index}>✓ {req}</RequirementItem>
                  ))}
                </RequirementsList>
              </Section>
            )}

            {project.timeline && (
              <Section>
                <SectionTitle>
                  <Calendar size={20} /> Timeline
                </SectionTitle>
                <Description>{project.timeline}</Description>
              </Section>
            )}
          </ModalBody>

          <ActionButtons>
            {hasCompleteProfile && project.status !== 'Completed' && (
              <ApplyButton 
                onClick={handleEasyApply} 
                style={{ 
                  background: 'linear-gradient(135deg, #6C47FF 0%, #5A3AD6 100%)',
                  flex: 1
                }}
              >
                <UserPlus size={18} />
                ⚡ Easy Apply
              </ApplyButton>
            )}
            <ApplyButton 
              onClick={handleApply} 
              disabled={project.status === 'Completed'}
              style={{ flex: hasCompleteProfile ? 0.8 : 1 }}
            >
              <UserPlus size={18} />
              {project.status === 'Completed' ? 'Project Completed' : 'Apply to Join'}
            </ApplyButton>
            <SecondaryButton onClick={handleInterest}>
              <Heart size={18} fill={isInterested ? '#EF4444' : 'none'} color={isInterested ? '#EF4444' : '#6B7280'} />
            </SecondaryButton>
            <SecondaryButton onClick={handleShare}>
              <Share2 size={18} />
            </SecondaryButton>
          </ActionButtons>
        </ModalContainer>
      </Overlay>

      {/* Application Dialog */}
      {showApplicationDialog && (
        <DialogOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowApplicationDialog(false)}
        >
          <DialogContainer
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitle>Apply to Join Project</DialogTitle>
              <CloseButton onClick={() => setShowApplicationDialog(false)}>
                <X size={20} />
              </CloseButton>
            </DialogHeader>

            <DialogBody>
              <FormGroup>
                <Label>
                  Cover Letter / Why do you want to join?
                  <RequiredStar>*</RequiredStar>
                </Label>
                <TextArea
                  placeholder="Explain why you're interested in this project and what you can contribute..."
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Relevant Skills & Experience
                  <RequiredStar>*</RequiredStar>
                </Label>
                <TextArea
                  placeholder="List your relevant skills, experience, and previous projects..."
                  value={applicationData.skills}
                  onChange={(e) => setApplicationData({ ...applicationData, skills: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Availability (hours/week)</Label>
                <Input
                  type="text"
                  placeholder="e.g., 10-15 hours/week"
                  value={applicationData.availability}
                  onChange={(e) => setApplicationData({ ...applicationData, availability: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Upload Resume (Optional)</Label>
                <FileInputContainer>
                  <FileInput
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <FileInputLabel htmlFor="resume-upload">
                    📄 Click to upload your resume
                    <br />
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>PDF, DOC, or DOCX (Max 5MB)</span>
                  </FileInputLabel>
                  {applicationData.resumeFile && (
                    <FileName>✓ {applicationData.resumeFile.name}</FileName>
                  )}
                </FileInputContainer>
              </FormGroup>
            </DialogBody>

            <DialogFooter>
              <CancelButton onClick={() => setShowApplicationDialog(false)}>
                Cancel
              </CancelButton>
              <SubmitButton onClick={handleSubmitApplication}>
                Submit Application
              </SubmitButton>
            </DialogFooter>
          </DialogContainer>
        </DialogOverlay>
      )}
      
      {/* New ApplicationModal Integration */}
      <ApplicationModal
        open={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        type="project"
        item={{
          id: '1', // In production, use actual project ID
          title: project.title,
          description: project.fullDescription || project.description,
          author: {
            id: 'leader-1',
            name: project.teamLeader.name,
            email: project.teamLeader.email,
          },
          skillRequirements: project.tags,
        }}
        onSuccess={() => {
          alert('Application submitted successfully!');
        }}
      />
    </AnimatePresence>
  );
};

export default ProjectDetailModal;

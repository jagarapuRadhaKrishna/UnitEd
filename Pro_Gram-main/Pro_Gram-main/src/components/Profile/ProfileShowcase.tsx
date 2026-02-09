import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Stack,
  Divider,
  IconButton,
  Card,
  CardContent,
  Link as MuiLink,
  Badge as MuiBadge,
} from '@mui/material';
import {
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  Award,
  Trophy,
  Briefcase,
  GraduationCap,
  Calendar,
  ExternalLink,
  FileText,
  Star,
} from 'lucide-react';
import { User, StudentProfile, FacultyProfile, ProjectDetail, Achievement } from '../../types';

interface ProfileShowcaseProps {
  user: User;
}

const ProfileShowcase: React.FC<ProfileShowcaseProps> = ({ user }) => {
  const isStudent = user.role === 'student';

  // Social Media Section
  const SocialLinks = () => {
    const studentUser = user as StudentProfile;
    const portfolio = isStudent && studentUser.portfolio ? studentUser.portfolio : null;

    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Globe size={20} />
          Social Profiles
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          {portfolio && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                size="small"
                sx={{
                  bgcolor: '#6C47FF',
                  color: 'white',
                  '&:hover': { bgcolor: '#5A3AD6' },
                }}
                component="a"
                href={portfolio}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe size={18} />
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Portfolio
                </Typography>
                <MuiLink
                  href={portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: '0.725rem',
                    color: '#6C47FF',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {portfolio}
                  <ExternalLink size={12} style={{ marginLeft: 4, display: 'inline' }} />
                </MuiLink>
              </Box>
            </Box>
          )}

          {/* GitHub - Placeholder for future integration */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, opacity: 0.6 }}>
            <IconButton
              size="small"
              sx={{
                bgcolor: '#333',
                color: 'white',
                '&:hover': { bgcolor: '#24292e' },
              }}
              disabled
            >
              <Github size={18} />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                GitHub
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Connect in Settings
              </Typography>
            </Box>
          </Box>

          {/* LinkedIn - Placeholder for future integration */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, opacity: 0.6 }}>
            <IconButton
              size="small"
              sx={{
                bgcolor: '#0A66C2',
                color: 'white',
                '&:hover': { bgcolor: '#004182' },
              }}
              disabled
            >
              <Linkedin size={18} />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                LinkedIn
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Connect in Settings
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>
    );
  };

  // Projects Section
  const ProjectsSection = () => {
    if (!user.projects || user.projects.length === 0) {
      return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Briefcase size={20} />
            Projects
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
            No projects added yet
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Briefcase size={20} />
          Projects ({user.projects.length})
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          {user.projects.map((project: ProjectDetail) => (
            <Card
              key={project.id}
              elevation={0}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(108, 71, 255, 0.1)',
                  borderColor: '#6C47FF',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {project.title}
                  </Typography>
                  {project.isOngoing && (
                    <Chip label="Ongoing" size="small" color="success" sx={{ fontWeight: 600 }} />
                  )}
                </Box>

                {project.role && (
                  <Typography variant="body2" color="primary" gutterBottom>
                    {project.role}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {project.description}
                </Typography>

                {project.skills && project.skills.length > 0 && (
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    {project.skills.map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" variant="outlined" />
                    ))}
                  </Stack>
                )}

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                  {project.duration && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Calendar size={14} />
                      {project.duration}
                    </Typography>
                  )}
                  {project.link && (
                    <MuiLink
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontSize: '0.75rem',
                        color: '#6C47FF',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      View Project
                      <ExternalLink size={12} />
                    </MuiLink>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>
    );
  };

  // Achievements & Badges Section
  const AchievementsSection = () => {
    if (!user.achievements || user.achievements.length === 0) {
      return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Trophy size={20} />
            Achievements & Badges
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
            No achievements added yet
          </Typography>
        </Paper>
      );
    }

    const categoryIcons: Record<string, React.ReactNode> = {
      award: <Trophy size={16} />,
      certification: <Award size={16} />,
      publication: <FileText size={16} />,
      competition: <Star size={16} />,
      other: <Award size={16} />,
    };

    const categoryColors: Record<string, string> = {
      award: '#F59E0B',
      certification: '#10B981',
      publication: '#6366F1',
      competition: '#EF4444',
      other: '#6B7280',
    };

    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Trophy size={20} />
          Achievements & Badges ({user.achievements.length})
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          {user.achievements.map((achievement: Achievement) => (
            <Grid item xs={12} sm={6} key={achievement.id}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  height: '100%',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(108, 71, 255, 0.1)',
                    borderColor: achievement.category ? categoryColors[achievement.category] : '#6C47FF',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: achievement.category ? `${categoryColors[achievement.category]}20` : '#6C47FF20',
                        color: achievement.category ? categoryColors[achievement.category] : '#6C47FF',
                        display: 'flex',
                      }}
                    >
                      {achievement.category && categoryIcons[achievement.category] || <Award size={16} />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        {achievement.title}
                      </Typography>
                      {achievement.issuer && (
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          {achievement.issuer}
                        </Typography>
                      )}
                      {achievement.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {achievement.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mt: 1 }}>
                        {achievement.date && (
                          <Typography variant="caption" color="text.secondary">
                            {achievement.date}
                          </Typography>
                        )}
                        {achievement.link && (
                          <MuiLink
                            href={achievement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              fontSize: '0.75rem',
                              color: '#6C47FF',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            View
                            <ExternalLink size={10} />
                          </MuiLink>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  // Contact & Basic Info
  const ContactInfoSection = () => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Mail size={20} />
        Contact Information
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Mail size={18} color="#6C47FF" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {user.email}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Phone size={18} color="#6C47FF" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Contact
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {user.contactNo}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );

  // Skills Section
  const SkillsSection = () => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Skills
      </Typography>
      <Divider sx={{ my: 2 }} />
      {user.skills && user.skills.length > 0 ? (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {user.skills.map((skill, idx) => (
            <Chip
              key={idx}
              label={skill}
              sx={{
                bgcolor: '#6C47FF15',
                color: '#6C47FF',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#6C47FF25',
                },
              }}
            />
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No skills added yet
        </Typography>
      )}
    </Paper>
  );

  // Student-specific info
  const StudentInfoSection = () => {
    const student = user as StudentProfile;
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GraduationCap size={20} />
          Academic Details
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Roll Number
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {student.rollNumber}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Department
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {student.department}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Year of Graduation
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {student.yearOfGraduation}
            </Typography>
          </Box>
          {student.experience && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Experience
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {student.experience}
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>
    );
  };

  // Faculty-specific info
  const FacultyInfoSection = () => {
    const faculty = user as FacultyProfile;
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Briefcase size={20} />
          Professional Details
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Employee ID
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {faculty.employeeId}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Designation
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {faculty.designation}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Qualification
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {faculty.qualification}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Experience
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              Total: {faculty.totalExperience} years | Teaching: {faculty.teachingExperience} years | Industry: {faculty.industryExperience} years
            </Typography>
          </Box>
          {faculty.specialization && faculty.specialization.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                Specialization
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {faculty.specialization.map((spec, idx) => (
                  <Chip key={idx} label={spec} size="small" variant="outlined" color="primary" />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>
    );
  };

  // Resume Section
  const ResumeSection = () => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FileText size={20} />
        Resume
      </Typography>
      <Divider sx={{ my: 2 }} />
      {user.resumeUrl ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <MuiBadge
            badgeContent={<Star size={12} />}
            color="success"
            sx={{ '& .MuiBadge-badge': { p: 1 } }}
          >
            <FileText size={48} color="#10B981" />
          </MuiBadge>
          <Typography variant="body2" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
            Resume on File
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
            Your resume will be used for all applications
          </Typography>
          <MuiLink
            href={user.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#6C47FF',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            View Resume
            <ExternalLink size={14} />
          </MuiLink>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <FileText size={48} color="#9CA3AF" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No resume uploaded yet
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Upload in Settings to streamline applications
          </Typography>
        </Box>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <ContactInfoSection />
            {isStudent ? <StudentInfoSection /> : <FacultyInfoSection />}
            <ResumeSection />
            <SocialLinks />
          </Stack>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <SkillsSection />
            <ProjectsSection />
            <AchievementsSection />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileShowcase;


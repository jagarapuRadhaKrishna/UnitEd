import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  Stack,
  TextField,
  Paper,
  Divider,
} from '@mui/material';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { sendEmail } from '../../services/emailService';

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  type: 'project' | 'event' | 'opportunity' | 'hackathon';
  item: {
    id: string;
    title: string;
    description: string;
    author?: {
      id: string;
      name: string;
      email?: string;
    };
    creatorEmail?: string;
    date?: string;
    location?: string;
    duration?: string;
    skillRequirements?: string[];
  };
  onSuccess?: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  open,
  onClose,
  type,
  item,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [useEasyApply, setUseEasyApply] = useState(false);

  const hasResume = user?.resumeUrl || user?.resume;
  const hasCoverLetter = user?.coverLetter;

  const handleEasyApply = async () => {
    if (!user || !hasResume) return;

    setUseEasyApply(true);
    setIsSubmitting(true);

    try {
      // Simulate application submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send email to creator
      const creatorEmail = item.author?.email || item.creatorEmail || 'creator@university.edu';
      
      await sendEmail({
        to: creatorEmail,
        subject: `Easy Apply - New Application: ${item.title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6C47FF 0%, #5A3AD6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .detail-row { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #6C47FF; }
              .label { font-weight: 600; color: #6C47FF; display: block; margin-bottom: 5px; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚡ Easy Apply - New Application</h1>
              </div>
              <div class="content">
                <h2>Application for: ${item.title}</h2>
                <p>You have received a new application via Easy Apply:</p>
                
                <div class="detail-row">
                  <span class="label">Applicant Name</span>
                  ${user.firstName} ${user.lastName}
                </div>
                
                <div class="detail-row">
                  <span class="label">Email</span>
                  ${user.email}
                </div>
                
                <div class="detail-row">
                  <span class="label">Contact Number</span>
                  ${user.contactNo || 'Not provided'}
                </div>
                
                <div class="detail-row">
                  <span class="label">Skills</span>
                  ${user.skills?.join(', ') || 'None listed'}
                </div>
                
                <div class="detail-row">
                  <span class="label">Resume</span>
                  ${user.resumeUrl || user.resume || 'Attached'}
                </div>
                
                ${hasCoverLetter ? `
                <div class="detail-row">
                  <span class="label">Cover Letter</span>
                  ${user.coverLetter}
                </div>
                ` : ''}
                
                <p><strong>What's Next?</strong></p>
                <ul>
                  <li>Review the candidate's profile and resume</li>
                  <li>Contact them via email to schedule an interview</li>
                  <li>Add them to your shortlist if they're a good fit</li>
                </ul>
              </div>
              <div class="footer">
                <p>Need help? Contact us at support@innov8mate.edu</p>
                <p>© 2025 Innov8mate Platform</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      setApplicationSubmitted(true);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting Easy Apply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApply = () => {
    setShowConfirmation(true);
  };

  const handleConfirmApplication = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Simulate application submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Send email to creator
      const creatorEmail = item.author?.email || item.creatorEmail || 'creator@university.edu';
      
      await sendEmail({
        to: creatorEmail,
        subject: `New Application: ${item.title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6C47FF 0%, #5A3AD6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .detail-row { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #6C47FF; }
              .label { font-weight: 600; color: #6C47FF; display: block; margin-bottom: 5px; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📬 New Application Received</h1>
              </div>
              <div class="content">
                <h2>Application for: ${item.title}</h2>
                <p>You have received a new application from a candidate:</p>
                
                <div class="detail-row">
                  <span class="label">Applicant Name:</span>
                  ${user.firstName} ${user.lastName}
                </div>
                
                <div class="detail-row">
                  <span class="label">Email:</span>
                  ${user.email}
                </div>
                
                <div class="detail-row">
                  <span class="label">Contact:</span>
                  ${user.contactNo}
                </div>
                
                <div class="detail-row">
                  <span class="label">Role:</span>
                  ${user.role === 'student' ? `Student - ${user.rollNumber}` : `Faculty - ${user.employeeId}`}
                </div>
                
                ${user.role === 'student' && 'department' in user ? `
                <div class="detail-row">
                  <span class="label">Department:</span>
                  ${user.department}
                </div>
                ` : ''}
                
                <div class="detail-row">
                  <span class="label">Skills:</span>
                  ${user.skills.join(', ')}
                </div>
                
                ${coverLetter ? `
                <div class="detail-row">
                  <span class="label">Cover Letter:</span>
                  ${coverLetter}
                </div>
                ` : ''}
                
                <div class="detail-row">
                  <span class="label">Resume:</span>
                  ${user.resumeUrl ? `<a href="${user.resumeUrl}">Download Resume</a>` : 'Not provided'}
                </div>
                
                <div class="footer">
                  <p>Please review the application and respond to the candidate at your earliest convenience.</p>
                  <p>© 2025 Innov8mate - Academic Collaboration Platform</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      // Send confirmation email to applicant
      if (type === 'event' || type === 'hackathon') {
        await sendEmail({
          to: user.email,
          subject: `Registration Confirmed: ${item.title}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; }
                .detail-row { margin: 10px 0; padding: 12px; background: white; border-radius: 5px; }
                .button { display: inline-block; padding: 12px 30px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Registration Confirmed!</h1>
                </div>
                <div class="content">
                  <h2>Hi ${user.firstName}!</h2>
                  <p>You've successfully registered for <strong>${item.title}</strong>!</p>
                  
                  ${item.date ? `
                  <div class="detail-row">
                    <strong>📅 Date:</strong> ${item.date}
                  </div>
                  ` : ''}
                  
                  ${item.location ? `
                  <div class="detail-row">
                    <strong>📍 Location:</strong> ${item.location}
                  </div>
                  ` : ''}
                  
                  ${item.duration ? `
                  <div class="detail-row">
                    <strong>⏱️ Duration:</strong> ${item.duration}
                  </div>
                  ` : ''}
                  
                  <div class="detail-row">
                    <strong>📝 Description:</strong><br/>
                    ${item.description}
                  </div>
                  
                  <p>Your profile and resume have been sent to the organizers. They will contact you soon with further details.</p>
                  
                  <p><strong>What's Next?</strong></p>
                  <ul>
                    <li>Check your email regularly for updates</li>
                    <li>Mark your calendar for the event date</li>
                    <li>Prepare any required materials</li>
                  </ul>
                </div>
                <div class="footer">
                  <p>Need help? Contact us at support@innov8mate.edu</p>
                  <p>© 2025 Innov8mate Platform</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      }

      setApplicationSubmitted(true);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setApplicationSubmitted(false);
    setCoverLetter('');
    onClose();
  };

  if (!user) return null;

  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <>
      {/* Main Application Dialog */}
      <Dialog
        open={open && !showConfirmation && !applicationSubmitted}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileText size={24} color="#6C47FF" />
            <Typography variant="h6">
              Apply for {typeLabel}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Item Details */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
              {item.skillRequirements && item.skillRequirements.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Required Skills:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    {item.skillRequirements.map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" color="primary" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>

            <Divider />

            {/* Resume Status */}
            {hasResume ? (
              <Alert severity="success" icon={<CheckCircle size={20} />}>
                <Typography variant="body2" fontWeight={600}>
                  ⚡ Easy Apply Enabled!
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your resume {hasCoverLetter && 'and cover letter'} will be automatically included. Use Easy Apply for instant submission!
                </Typography>
              </Alert>
            ) : (
              <Alert severity="warning" icon={<AlertCircle size={20} />}>
                <Typography variant="body2" fontWeight={600}>
                  No resume on file
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Please upload your resume in your profile settings first to enable Easy Apply
                </Typography>
              </Alert>
            )}

            {/* Your Profile Info */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Your Information (will be sent to creator):
              </Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Name:</strong> {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Contact:</strong> {user.contactNo}
                </Typography>
                <Typography variant="body2">
                  <strong>Skills:</strong> {user.skills.join(', ') || 'None listed'}
                </Typography>
              </Stack>
            </Paper>

            {/* Optional Cover Letter */}
            <TextField
              label="Cover Letter (Optional)"
              multiline
              rows={4}
              fullWidth
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the creator why you're interested in this opportunity..."
              variant="outlined"
            />

            {!hasResume && (
              <Alert severity="info">
                <Typography variant="body2">
                  💡 Tip: Upload your resume in Profile Settings to streamline future applications!
                </Typography>
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          
          {hasResume && (
            <Button
              variant="outlined"
              onClick={handleEasyApply}
              disabled={isSubmitting}
              sx={{
                borderColor: '#10B981',
                color: '#10B981',
                '&:hover': {
                  borderColor: '#059669',
                  backgroundColor: '#F0FDF4',
                },
              }}
            >
              {isSubmitting && useEasyApply ? 'Submitting...' : '⚡ Easy Apply'}
            </Button>
          )}
          
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={!hasResume || isSubmitting}
            sx={{
              background: 'linear-gradient(135deg, #6C47FF 0%, #5A3AD6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5A3AD6 0%, #4A2FB8 100%)',
              },
            }}
          >
            {hasResume ? 'Apply with Details' : 'Upload Resume First'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Confirm Application</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info">
              <Typography variant="body2">
                Your profile information and resume will be sent to the {type} creator.
              </Typography>
            </Alert>
            <Typography variant="body2">
              Are you sure you want to apply for <strong>{item.title}</strong>?
            </Typography>
            {(type === 'event' || type === 'hackathon') && (
              <Typography variant="body2" color="text.secondary">
                You will receive a confirmation email with event details at <strong>{user.email}</strong>
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowConfirmation(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmApplication}
            disabled={isSubmitting}
            sx={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              },
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm & Apply'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={applicationSubmitted}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ mb: 2 }}>
            <CheckCircle size={64} color="#10B981" />
          </Box>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Application Submitted!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Your application for <strong>{item.title}</strong> has been successfully submitted.
          </Typography>
          {(type === 'event' || type === 'hackathon') && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Check your email ({user.email}) for event details and confirmation!
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              background: 'linear-gradient(135deg, #6C47FF 0%, #5A3AD6 100%)',
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApplicationModal;

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import SentInvitationsList from './SentInvitationsList';
import ReceivedInvitationsList from './ReceivedInvitationsList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`invitation-tabpanel-${index}`}
      aria-labelledby={`invitation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const InvitationDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stack sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
              👥 Invitations
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B7280' }}>
              Manage your team invitations  - send invites and view received invitations.
              When the project ends, all connections will automatically disconnect.
            </Typography>
          </Stack>
        </motion.div>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="invitation tabs"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              },
              '& .Mui-selected': {
                fontWeight: 700,
              },
            }}
          >
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Send size={18} />
                  <span> I Invited</span>
                </Stack>
              }
              id="invitation-tab-0"
              aria-controls="invitation-tabpanel-0"
            />
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Mail size={18} />
                  <span>They Invited Me</span>
                </Stack>
              }
              id="invitation-tab-1"
              aria-controls="invitation-tabpanel-1"
            />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <motion.div
          key={tabValue}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <TabPanel value={tabValue} index={0}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Invitations I've Sent
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
                View all the team invitations you've sent to others. Track their status and manage pending invitations.
              </Typography>
              <SentInvitationsList />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Invitations I've Received
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
                View all the team invitations you've received. Accept to join a team or decline to skip.
              </Typography>
              <ReceivedInvitationsList />
            </Box>
          </TabPanel>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Paper
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: '#EEF2FF',
              borderLeft: '4px solid #6C47FF',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#4F46E5', mb: 1 }}>
              ✨ How It Works
            </Typography>
            <Typography variant="body2" sx={{ color: '#4F46E5', lineHeight: 1.8 }}>
              • <strong>I Invited</strong>: Shows all team invitations you've sent. You can cancel pending invitations.
              <br />• <strong>They Invited Me</strong>: Shows invitations you've received. Accept to join the team or decline
              to skip.
              <br />• <strong>Auto-Disconnect</strong>: When a project is completed and closed, all team connections
              automatically disconnect like LinkedIn.
              <br />• <strong>Team Management</strong>: Accept invitations to become part of the project team and gain
              access to team features.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default InvitationDashboard;

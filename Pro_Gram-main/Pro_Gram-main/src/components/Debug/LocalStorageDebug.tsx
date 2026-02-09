import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Collapse,
  Chip,
} from '@mui/material';
import { Trash2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { localStorageAuthService } from '../../services/localStorageAuthService';

/**
 * Debug component to view and manage local storage data
 * Only for development purposes
 */
const LocalStorageDebug: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const refreshData = () => {
    const allUsers = localStorageAuthService.getAllRegisteredUsers();
    const current = localStorageAuthService.getCurrentUser();
    setUsers(allUsers);
    setCurrentUser(current);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorageAuthService.clearAllData();
      refreshData();
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
      <Paper
        elevation={3}
        sx={{
          width: isOpen ? 600 : 200,
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Typography variant="h6">Local Storage DB</Typography>
          <IconButton size="small" sx={{ color: 'white' }}>
            {isOpen ? <ChevronDown /> : <ChevronUp />}
          </IconButton>
        </Box>

        <Collapse in={isOpen}>
          <Box sx={{ p: 2 }}>
            {/* Current User Info */}
            {currentUser && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Logged in as:</Typography>
                <Typography variant="body2">
                  {currentUser.firstName} {currentUser.lastName} ({currentUser.email})
                </Typography>
                <Chip
                  label={currentUser.role}
                  size="small"
                  color={currentUser.role === 'student' ? 'primary' : 'secondary'}
                  sx={{ mt: 1 }}
                />
              </Alert>
            )}

            {/* Users Table */}
            <TableContainer sx={{ maxHeight: 300, mb: 2 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No users registered
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            color={user.role === 'student' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshCw size={16} />}
                onClick={refreshData}
                fullWidth
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<Trash2 size={16} />}
                onClick={handleClearAll}
                fullWidth
              >
                Clear All
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              Total Users: {users.length}
            </Typography>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default LocalStorageDebug;

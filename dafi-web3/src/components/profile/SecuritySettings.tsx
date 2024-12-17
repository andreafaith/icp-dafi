import React from 'react';
import {
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Divider,
  Alert,
} from '@mui/material';

export const SecuritySettings = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Password
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Current Password"
          type="password"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="New Password"
          type="password"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Confirm New Password"
          type="password"
          variant="outlined"
          margin="normal"
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Update Password
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Two-Factor Authentication
      </Typography>
      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={<Switch />}
          label="Enable 2FA"
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Protect your account with two-factor authentication
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Security Notifications
      </Typography>
      <Box>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Email notifications for suspicious activity"
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Email notifications for password changes"
        />
      </Box>

      <Alert severity="info" sx={{ mt: 4 }}>
        Last login: December 17, 2024 10:30 AM from 192.168.1.1
      </Alert>
    </Box>
  );
};

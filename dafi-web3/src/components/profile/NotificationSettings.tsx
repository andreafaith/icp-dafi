import React from 'react';
import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

export const NotificationSettings = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Email Notifications
      </Typography>
      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Transaction Updates"
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Price Alerts"
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Staking Rewards"
        />
        <FormControlLabel
          control={<Switch />}
          label="Governance Updates"
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Security Alerts"
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Push Notifications
      </Typography>
      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Enable Push Notifications"
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Notification Frequency
      </Typography>
      <Box sx={{ minWidth: 120, mt: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Price Alert Frequency</InputLabel>
          <Select
            value="daily"
            label="Price Alert Frequency"
          >
            <MenuItem value="instant">Instant</MenuItem>
            <MenuItem value="hourly">Hourly</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

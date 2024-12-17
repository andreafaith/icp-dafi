import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  AccountBalance as AccountIcon,
} from '@mui/icons-material';
import { Layout } from '@/components/Layout';

// Mock settings data
const mockSettings = {
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    loanUpdates: true,
    marketingEmails: false,
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: '30',
    loginNotifications: true,
  },
  preferences: {
    language: 'English',
    currency: 'USD',
    timezone: 'UTC-8',
  },
  payment: {
    defaultAccount: '**** **** **** 1234',
    bankName: 'Chase Bank',
    accountType: 'Checking',
  },
};

export default function FarmersSettings() {
  const [settings, setSettings] = React.useState(mockSettings);

  const handleNotificationChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: event.target.checked,
      },
    }));
  };

  return (
    <Layout>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Settings</Typography>

        <Grid container spacing={3}>
          {/* Notifications Settings */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NotificationsIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Notifications</Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.emailAlerts}
                      onChange={handleNotificationChange('emailAlerts')}
                    />
                  }
                  label="Email Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.smsAlerts}
                      onChange={handleNotificationChange('smsAlerts')}
                    />
                  }
                  label="SMS Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.loanUpdates}
                      onChange={handleNotificationChange('loanUpdates')}
                    />
                  }
                  label="Loan Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.marketingEmails}
                      onChange={handleNotificationChange('marketingEmails')}
                    />
                  }
                  label="Marketing Emails"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Security Settings */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Security</Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onChange={() => {}}
                    />
                  }
                  label="Two-Factor Authentication"
                />
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Session Timeout (minutes)</InputLabel>
                    <Select
                      value={settings.security.sessionTimeout}
                      label="Session Timeout (minutes)"
                    >
                      <MenuItem value="15">15 minutes</MenuItem>
                      <MenuItem value="30">30 minutes</MenuItem>
                      <MenuItem value="60">1 hour</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.loginNotifications}
                      onChange={() => {}}
                    />
                  }
                  label="Login Notifications"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Preferences */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LanguageIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Preferences</Typography>
                </Box>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.preferences.language}
                    label="Language"
                  >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                    <MenuItem value="French">French</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={settings.preferences.currency}
                    label="Currency"
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.preferences.timezone}
                    label="Timezone"
                  >
                    <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
                    <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
                    <MenuItem value="UTC+0">UTC</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Settings */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Payment Settings</Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Default Account"
                  value={settings.payment.defaultAccount}
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Bank Name"
                  value={settings.payment.bankName}
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Account Type"
                  value={settings.payment.accountType}
                  disabled
                  sx={{ mb: 2 }}
                />
                <Button variant="outlined" color="primary">
                  Update Payment Information
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => alert('Settings saved!')}
          >
            Save Settings
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}

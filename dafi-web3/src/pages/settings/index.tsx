import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
  Alert,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Layout } from '../../components/Layout';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  AccountCircle as ProfileIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings = () => {
  const [value, setValue] = useState(0);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newsletter: true,
  });
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [twoFactor, setTwoFactor] = useState(true);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Settings</Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={value} onChange={handleTabChange} aria-label="settings tabs">
            <Tab icon={<ProfileIcon />} label="Profile" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<SecurityIcon />} label="Security" />
            <Tab icon={<LanguageIcon />} label="Preferences" />
            <Tab icon={<PaymentIcon />} label="Payment" />
          </Tabs>
        </Box>

        {/* Profile Settings */}
        <TabPanel value={value} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        defaultValue="John Doe"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        defaultValue="john@example.com"
                        type="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        defaultValue="+1 234 567 8900"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" color="primary">
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Profile Picture</Typography>
                  {/* Add profile picture upload component */}
                  <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                    Upload New Picture
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notifications Settings */}
        <TabPanel value={value} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.email}
                        onChange={handleNotificationChange}
                        name="email"
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.push}
                        onChange={handleNotificationChange}
                        name="push"
                      />
                    }
                    label="Push Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.sms}
                        onChange={handleNotificationChange}
                        name="sms"
                      />
                    }
                    label="SMS Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.newsletter}
                        onChange={handleNotificationChange}
                        name="newsletter"
                      />
                    }
                    label="Newsletter"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={value} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Password</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" color="primary">
                        Update Password
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Two-Factor Authentication</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={twoFactor}
                        onChange={(e) => setTwoFactor(e.target.checked)}
                      />
                    }
                    label="Enable Two-Factor Authentication"
                  />
                  {twoFactor && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Two-factor authentication is enabled
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Preferences Settings */}
        <TabPanel value={value} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Language</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Select Language</InputLabel>
                    <Select
                      value={language}
                      label="Select Language"
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Theme</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Select Theme</InputLabel>
                    <Select
                      value={theme}
                      label="Select Theme"
                      onChange={(e) => setTheme(e.target.value)}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">System</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Payment Settings */}
        <TabPanel value={value} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Payment Methods</Typography>
                  {/* Add payment methods component */}
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Billing Information</Typography>
                  {/* Add billing information component */}
                  <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                    Update Billing Info
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </Layout>
  );
};

export default Settings;

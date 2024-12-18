import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Slider,
  IconButton,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  AccountBalance as AccountBalanceIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import DashboardNav from '../../components/navigation/DashboardNav';

const InvestorSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    investment: true,
    market: true,
    performance: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    biometric: false,
  });

  const [investment, setInvestment] = useState({
    autoInvest: false,
    riskTolerance: 50,
    minInvestment: 1000,
    maxInvestment: 10000,
    preferredSectors: ['Organic Farming', 'Sustainable Agriculture'],
  });

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Investment Street, Financial District',
    isEditing: false,
  });

  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSecurityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecurity({
      ...security,
      [event.target.name]: event.target.checked,
    });
  };

  const handleInvestmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvestment({
      ...investment,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleProfileEdit = () => {
    setProfile({ ...profile, isEditing: !profile.isEditing });
  };

  const handleProfileSave = () => {
    setProfile({ ...profile, isEditing: false });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        backgroundColor: '#FDF5E6', // Cream color (Old Lace)
        minHeight: '100vh',
        pt: 2,
      }}
    >
      <DashboardNav userType="investor" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Settings
            </Typography>
          </Grid>

          {/* Profile Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Profile Information
                </Typography>
                <IconButton onClick={handleProfileEdit}>
                  {profile.isEditing ? <SaveIcon /> : <EditIcon />}
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={profile.name}
                    disabled={!profile.isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    disabled={!profile.isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profile.phone}
                    disabled={!profile.isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={profile.address}
                    disabled={!profile.isEditing}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Security Settings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={security.twoFactor}
                        onChange={handleSecurityChange}
                        name="twoFactor"
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={security.biometric}
                        onChange={handleSecurityChange}
                        name="biometric"
                      />
                    }
                    label="Biometric Login"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" color="primary" startIcon={<SecurityIcon />}>
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Investment Preferences */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Investment Preferences
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={investment.autoInvest}
                        onChange={handleInvestmentChange}
                        name="autoInvest"
                      />
                    }
                    label="Auto-Invest"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom>Risk Tolerance</Typography>
                  <Slider
                    value={investment.riskTolerance}
                    valueLabelDisplay="auto"
                    step={10}
                    marks
                    min={0}
                    max={100}
                    onChange={(e, value) => setInvestment({ ...investment, riskTolerance: value as number })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Minimum Investment ($)"
                    type="number"
                    value={investment.minInvestment}
                    onChange={handleInvestmentChange}
                    name="minInvestment"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Maximum Investment ($)"
                    type="number"
                    value={investment.maxInvestment}
                    onChange={handleInvestmentChange}
                    name="maxInvestment"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Preferred Investment Sectors</InputLabel>
                    <Select
                      multiple
                      value={investment.preferredSectors}
                      onChange={(e) => setInvestment({ ...investment, preferredSectors: e.target.value as string[] })}
                      renderValue={(selected) => (selected as string[]).join(', ')}
                    >
                      <MenuItem value="Organic Farming">Organic Farming</MenuItem>
                      <MenuItem value="Sustainable Agriculture">Sustainable Agriculture</MenuItem>
                      <MenuItem value="Livestock">Livestock</MenuItem>
                      <MenuItem value="Dairy Farming">Dairy Farming</MenuItem>
                      <MenuItem value="Grain Production">Grain Production</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
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
                  <Divider />
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Notification Types
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.investment}
                        onChange={handleNotificationChange}
                        name="investment"
                      />
                    }
                    label="Investment Updates"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.market}
                        onChange={handleNotificationChange}
                        name="market"
                      />
                    }
                    label="Market Alerts"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.performance}
                        onChange={handleNotificationChange}
                        name="performance"
                      />
                    }
                    label="Performance Reports"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" startIcon={<CancelIcon />}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />}>
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InvestorSettings;

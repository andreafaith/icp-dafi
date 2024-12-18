import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Layout } from '../../components/layout/Layout';
import DashboardNav from '../../components/navigation/DashboardNav';

const FarmerSettingsTest = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [emailUpdates, setEmailUpdates] = React.useState(true);

  return (
    <Layout>
      <DashboardNav userType="farmer" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>

          <Grid container spacing={3}>
            {/* Profile Settings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profile Settings
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Farm Name"
                        defaultValue="Green Valley Farm"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Contact Email"
                        defaultValue="farmer@example.com"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        defaultValue="+1 234 567 8900"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" color="primary">
                        Update Profile
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Notification Settings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notification Settings
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                          />
                        }
                        label="Push Notifications"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={emailUpdates}
                            onChange={(e) => setEmailUpdates(e.target.checked)}
                          />
                        }
                        label="Email Updates"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Farm Settings */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Farm Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Farm Type"
                        defaultValue="Organic Vegetables"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Farm Size (acres)"
                        defaultValue="50"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Farm Description"
                        defaultValue="Sustainable organic vegetable farm focused on local distribution and community supported agriculture."
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" color="primary">
                        Update Farm Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default FarmerSettingsTest;

import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, IconButton, Divider, useTheme, Button } from '@mui/material';
import DashboardNav from '../../components/navigation/DashboardNav';
import {
  Notifications as NotificationIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const mockNotifications = [
  {
    id: 1,
    type: 'warning',
    title: 'Low Water Levels Detected',
    message: 'Water levels in Field B are below optimal levels. Consider adjusting irrigation schedule.',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    type: 'success',
    title: 'Harvest Complete',
    message: 'Corn harvest in Field A has been completed successfully. Total yield: 500 tons.',
    timestamp: '1 day ago'
  },
  {
    id: 3,
    type: 'info',
    title: 'Weather Alert',
    message: 'Heavy rain forecasted for next week. Consider adjusting farming schedule.',
    timestamp: '2 days ago'
  }
];

const NotificationCard = ({ notification }: any) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'success':
        return <SuccessIcon sx={{ color: 'success.main' }} />;
      case 'info':
        return <InfoIcon sx={{ color: 'info.main' }} />;
      default:
        return <NotificationIcon />;
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Box sx={{ mr: 2, mt: 0.5 }}>
              {getIcon(notification.type)}
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                {notification.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.timestamp}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

const FarmerNotifications = () => {
  const theme = useTheme();

  return (
    <>
      <DashboardNav userType="farmer" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.grey[50],
          minHeight: '100vh',
          pt: 2,
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Notifications
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Stay updated with your farm's activities and alerts
                  </Typography>
                </Box>
                <Button variant="outlined" startIcon={<NotificationIcon />}>
                  Mark All as Read
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {mockNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    More notification features coming soon!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We're working on additional notification features including:
                    <ul>
                      <li>Custom notification preferences</li>
                      <li>Mobile push notifications</li>
                      <li>Advanced filtering options</li>
                      <li>Integration with farming equipment alerts</li>
                    </ul>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default FarmerNotifications;

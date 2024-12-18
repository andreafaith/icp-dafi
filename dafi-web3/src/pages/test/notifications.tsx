import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Alert,
  Button,
} from '@mui/material';
import DashboardNav from '../../components/navigation/DashboardNav';
import {
  Notifications as NotificationsIcon,
  MonetizationOn as MonetizationOnIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Update as UpdateIcon,
  Event as EventIcon,
  Analytics as AnalyticsIcon,
  Agriculture as AgricultureIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for charts
const monthlyReturns = [
  { month: 'Jan', returns: 2.5, investment: 100 },
  { month: 'Feb', returns: 3.1, investment: 120 },
  { month: 'Mar', returns: 2.8, investment: 115 },
  { month: 'Apr', returns: 3.4, investment: 130 },
  { month: 'May', returns: 3.7, investment: 140 },
  { month: 'Jun', returns: 3.2, investment: 135 },
];

const portfolioDistribution = [
  { name: 'Grain Farms', value: 35 },
  { name: 'Dairy Farms', value: 25 },
  { name: 'Organic Farms', value: 20 },
  { name: 'Livestock', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const mockNotifications = [
  {
    id: 1,
    type: 'investment',
    title: 'New Investment Opportunity',
    message: 'A new organic farm investment opportunity is available in Bulacan.',
    icon: MonetizationOnIcon,
    severity: 'info',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'alert',
    title: 'Weather Alert',
    message: 'Potential heavy rainfall forecasted for next week in your investment regions.',
    icon: WarningIcon,
    severity: 'warning',
    time: '5 hours ago',
  },
  {
    id: 3,
    type: 'update',
    title: 'Portfolio Update',
    message: 'Your investment in Green Valley Farm has generated 12% returns this quarter.',
    icon: UpdateIcon,
    severity: 'success',
    time: '1 day ago',
  },
  {
    id: 4,
    type: 'event',
    title: 'Upcoming Event',
    message: 'Agricultural Technology Summit 2024 - Join us to learn about the latest farming innovations.',
    icon: EventIcon,
    severity: 'info',
    time: '2 days ago',
  },
];

const upcomingFeatures = [
  {
    title: 'Real-time Alerts',
    description: 'Get instant notifications about critical events affecting your investments',
    icon: NotificationsIcon,
  },
  {
    title: 'Market Updates',
    description: 'Stay informed about agricultural market trends and price changes',
    icon: AnalyticsIcon,
  },
  {
    title: 'Farm Events',
    description: 'Never miss important farm activities and community events',
    icon: AgricultureIcon,
  },
  {
    title: 'Performance Tracking',
    description: 'Track your investment performance with detailed analytics',
    icon: TimelineIcon,
  },
];

const NotificationsPage = () => {
  const theme = useTheme();

  return (
    <>
      <DashboardNav userType="investor" />
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
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Notifications Center
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Stay updated with your investments and agricultural events
                </Typography>
              </Box>
            </Grid>

            {/* Recent Notifications */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Notifications
                </Typography>
                <List>
                  {mockNotifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem>
                        <ListItemIcon>
                          <notification.icon color={notification.severity} />
                        </ListItemIcon>
                        <ListItemText
                          primary={notification.title}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                {notification.message}
                              </Typography>
                              <br />
                              <Typography component="span" variant="caption" color="text.secondary">
                                {notification.time}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < mockNotifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>

              {/* Investment Performance Chart */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Investment Performance
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyReturns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="returns" stroke="#8884d8" name="Returns (%)" />
                      <Line type="monotone" dataKey="investment" stroke="#82ca9d" name="Investment Value" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>

              {/* Portfolio Distribution Chart */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Portfolio Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {portfolioDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Upcoming Features */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Coming Soon
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Stay tuned for real-time updates about your investments, returns, and important agricultural events.
                </Alert>
                <List>
                  {upcomingFeatures.map((feature, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <feature.icon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.title}
                          secondary={feature.description}
                        />
                      </ListItem>
                      {index < upcomingFeatures.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>

              {/* Quick Actions */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<NotificationsIcon />}
                      sx={{ mb: 1 }}
                    >
                      Manage Notifications
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<AnalyticsIcon />}
                      sx={{ mb: 1 }}
                    >
                      View Analytics
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<InfoIcon />}
                    >
                      Help Center
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default NotificationsPage;

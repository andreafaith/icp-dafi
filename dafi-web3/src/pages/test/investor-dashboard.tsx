import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Agriculture,
  MonetizationOn,
  Assessment,
  Notifications,
  MoreVert,
  AccountBalance,
  Timeline,
  PieChart,
} from '@mui/icons-material';
import DashboardNav from '../../components/navigation/DashboardNav';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const performanceData = [
  { month: 'Jan', returns: 15, benchmark: 12 },
  { month: 'Feb', returns: 18, benchmark: 14 },
  { month: 'Mar', returns: 22, benchmark: 16 },
  { month: 'Apr', returns: 25, benchmark: 18 },
  { month: 'May', returns: 28, benchmark: 20 },
];

const portfolioDistribution = [
  { name: 'Organic Farms', value: 400 },
  { name: 'Livestock', value: 300 },
  { name: 'Sustainable Ag', value: 300 },
  { name: 'Tech Farms', value: 200 },
];

const recentActivities = [
  { type: 'Investment', description: 'New investment in Organic Valley Farm', amount: '+$10,000', date: '2 hours ago' },
  { type: 'Return', description: 'Quarterly returns from Farm B', amount: '+$2,500', date: '1 day ago' },
  { type: 'Withdrawal', description: 'Withdrawal to Bank Account', amount: '-$5,000', date: '3 days ago' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const InvestorDashboard = () => {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) => theme.palette.grey[100],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <DashboardNav userType="investor" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>JD</Avatar>
                  <Box>
                    <Typography variant="h5">Welcome back, John Doe</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Your portfolio is performing well today
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton>
                    <Notifications />
                  </IconButton>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Key Metrics */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Portfolio Value
                </Typography>
                <Typography variant="h4">$125,000</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                  <TrendingUp />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    +15.3% this month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Returns
                </Typography>
                <Typography variant="h4">$28,500</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                  <TrendingUp />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    +8.2% this month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Investments
                </Typography>
                <Typography variant="h4">12</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Agriculture />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Across 5 regions
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Available Balance
                </Typography>
                <Typography variant="h4">$15,000</Typography>
                <Button variant="contained" size="small" sx={{ mt: 1 }}>
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Portfolio Performance */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="returns" stroke="#8884d8" name="Your Returns" />
                  <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" name="Market Benchmark" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Portfolio Distribution */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={portfolioDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={activity.description}
                        secondary={activity.date}
                      />
                      <Typography
                        variant="body2"
                        color={activity.amount.startsWith('+') ? 'success.main' : 'error.main'}
                      >
                        {activity.amount}
                      </Typography>
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Investment Opportunities */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Featured Investment Opportunities
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        Organic Valley Farm Expansion
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        High-yield organic farming opportunity
                      </Typography>
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="body2">Funding Progress</Typography>
                        <LinearProgress variant="determinate" value={75} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          $750,000 / $1,000,000
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Chip label="15% Expected ROI" color="success" />
                        <Button variant="contained" size="small">
                          Learn More
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Button variant="outlined" fullWidth startIcon={<MonetizationOn />}>
                    Add Funds
                  </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button variant="outlined" fullWidth startIcon={<Assessment />}>
                    View Reports
                  </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button variant="outlined" fullWidth startIcon={<AccountBalance />}>
                    Withdraw
                  </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button variant="outlined" fullWidth startIcon={<Timeline />}>
                    Analytics
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InvestorDashboard;

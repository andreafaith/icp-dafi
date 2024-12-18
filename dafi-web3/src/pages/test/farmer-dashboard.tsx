import React, { useEffect, useState } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  LocalFlorist,
  WaterDrop,
  MonetizationOn,
  Assessment,
  Notifications,
  MoreVert,
  Agriculture,
  Timeline,
  Eco,
  Science,
  CloudQueue,
  AttachMoney,
  Spa,
  ShowChart,
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
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { FarmerAnalyticsService } from '../../services/FarmerAnalyticsService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const defaultDashboardData = {
  ml: {
    yieldPrediction: {
      accuracy: 85,
      features: ['Weather', 'Soil', 'Historical'],
      lastUpdated: '2024-01-15',
    },
    weatherForecast: {
      accuracy: 90,
      features: ['Temperature', 'Rainfall', 'Wind'],
      lastUpdated: '2024-01-15',
    },
    soilAnalysis: {
      accuracy: 88,
      features: ['pH', 'Nutrients', 'Moisture'],
      lastUpdated: '2024-01-15',
    },
  },
  yield: {
    historical: [
      { date: '2024-01', actual: 85, predicted: 82 },
      { date: '2024-02', actual: 88, predicted: 86 },
      { date: '2024-03', actual: 92, predicted: 90 },
    ],
    forecast: [
      { date: '2024-04', predicted: 94, confidence: 85 },
      { date: '2024-05', predicted: 96, confidence: 82 },
    ],
  },
  weather: {
    forecast: [
      { date: '2024-01-15', condition: 'Sunny', temperature: 25, rainfall: 0 },
      { date: '2024-01-16', condition: 'Cloudy', temperature: 22, rainfall: 20 },
      { date: '2024-01-17', condition: 'Rain', temperature: 20, rainfall: 50 },
    ],
    alerts: [
      { type: 'Heavy Rain Warning', severity: 'warning', probability: 75 },
      { type: 'High Temperature', severity: 'info', probability: 85 },
    ],
  },
  resources: {
    water: {
      current: 80,
      trend: '+5%',
      status: 'Optimal',
    },
    soil: {
      health: 85,
      trend: '+2%',
      status: 'Good',
    },
    equipment: {
      efficiency: 90,
      trend: '-1%',
      status: 'Needs Maintenance',
    },
  },
};

const FarmerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState(defaultDashboardData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await FarmerAnalyticsService.getDashboardData();
        setDashboardData({ ...defaultDashboardData, ...data });
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const getTrendColor = (trend: string | undefined) => {
    if (!trend) return 'textSecondary';
    return trend.includes('+') ? 'success.main' : 'error.main';
  };

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
      <DashboardNav userType="farmer" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>JD</Avatar>
                  <Box>
                    <Typography variant="h5">Welcome back, John Farmer</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Farm Performance Summary
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton>
                    <Notifications />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Resource Status Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {Object.entries(dashboardData.resources).map(([key, data]: [string, any]) => (
                <Grid item xs={12} md={4} key={key}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {key.charAt(0).toUpperCase() + key.slice(1)} Status
                      </Typography>
                      <Typography variant="h4" gutterBottom>
                        {data.current || data.health || data.efficiency}%
                      </Typography>
                      <Typography variant="body2" color={getTrendColor(data.trend)}>
                        {data.trend ? `${data.trend} vs. Last Week` : 'No trend data'}
                      </Typography>
                      <Chip
                        label={data.status}
                        color={data.status === 'Optimal' ? 'success' : 'warning'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* ML Model Status */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                <Science sx={{ mr: 1, verticalAlign: 'middle' }} />
                AI Models Status
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(dashboardData.ml).map(([key, model]: [string, any]) => (
                  <Grid item xs={12} md={4} key={key}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" color="primary">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            Accuracy: {model.accuracy}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={model.accuracy}
                            sx={{ mt: 1, mb: 1 }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            Features: {model.features.join(', ')}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Yield Predictions */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                Advanced Yield Predictions
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.yield.historical}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual Yield" />
                  <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="AI Prediction" />
                </LineChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="primary">
                  Forecast Confidence: {dashboardData.yield.forecast[0].confidence}%
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Weather Analysis */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <CloudQueue sx={{ mr: 1, verticalAlign: 'middle' }} />
                Weather Impact
              </Typography>
              <List>
                {dashboardData.weather.forecast.map((day: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={day.date}
                      secondary={`${day.condition}, ${day.temperature}°C, ${day.rainfall}mm`}
                    />
                    <Chip
                      label={day.condition}
                      color={day.condition === 'Sunny' ? 'success' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              {dashboardData.weather.alerts.map((alert: any, index: number) => (
                <Alert severity={alert.severity} sx={{ mb: 1 }} key={index}>
                  {alert.type}: {alert.probability}% probability
                </Alert>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FarmerDashboard;

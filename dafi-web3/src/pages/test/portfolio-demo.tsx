import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Chip,
  Button,
  LinearProgress,
  Divider,
} from '@mui/material';
import DashboardNav from '../../components/navigation/DashboardNav';
import {
  TrendingUp,
  Assessment,
  PieChart,
  Timeline,
  MonetizationOn,
  Analytics,
  Agriculture,
  Eco,
  Business,
  Warning,
  CheckCircle,
  LocalFlorist,
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from 'recharts';

// Mock data for charts
const performanceData = [
  { month: 'Jan', returns: 5.2, benchmark: 4.1 },
  { month: 'Feb', returns: 6.1, benchmark: 4.3 },
  { month: 'Mar', returns: 5.8, benchmark: 4.5 },
  { month: 'Apr', returns: 7.2, benchmark: 4.8 },
  { month: 'May', returns: 8.1, benchmark: 5.0 },
  { month: 'Jun', returns: 7.5, benchmark: 4.9 },
];

const riskMetrics = [
  { name: 'Volatility', value: 65 },
  { name: 'Market Risk', value: 45 },
  { name: 'Credit Risk', value: 30 },
  { name: 'Operational Risk', value: 25 },
  { name: 'Environmental Risk', value: 35 },
];

const portfolioDistribution = [
  { name: 'Grain Farms', value: 35, risk: 'Low' },
  { name: 'Dairy Farms', value: 25, risk: 'Medium' },
  { name: 'Organic Farms', value: 20, risk: 'Low' },
  { name: 'Livestock', value: 20, risk: 'High' },
];

const marketTrends = [
  { month: 'Jan', grains: 100, dairy: 120, organic: 90, livestock: 110 },
  { month: 'Feb', grains: 110, dairy: 125, organic: 95, livestock: 115 },
  { month: 'Mar', grains: 120, dairy: 130, organic: 100, livestock: 120 },
  { month: 'Apr', grains: 115, dairy: 135, organic: 105, livestock: 125 },
  { month: 'May', grains: 125, dairy: 140, organic: 110, livestock: 130 },
  { month: 'Jun', grains: 130, dairy: 145, organic: 115, livestock: 135 },
];

const farmPerformance = [
  {
    name: 'Green Valley Farm',
    yield: 92,
    efficiency: 85,
    sustainability: 88,
    risk: 'Low',
    return: '15.2%',
    score: 4.5,
  },
  {
    name: 'Sunrise Dairy',
    yield: 88,
    efficiency: 90,
    sustainability: 82,
    risk: 'Medium',
    return: '12.8%',
    score: 4.2,
  },
  {
    name: 'Organic Haven',
    yield: 85,
    efficiency: 88,
    sustainability: 95,
    risk: 'Low',
    return: '14.5%',
    score: 4.7,
  },
  {
    name: 'Highland Ranch',
    yield: 90,
    efficiency: 87,
    sustainability: 80,
    risk: 'Medium',
    return: '13.2%',
    score: 4.0,
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const PortfolioDemo = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
                  Portfolio Analytics Demo
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Advanced portfolio performance tracking and analysis
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ width: '100%' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Performance Metrics" icon={<TrendingUp />} iconPosition="start" />
                  <Tab label="Risk Analysis" icon={<Assessment />} iconPosition="start" />
                  <Tab label="Market Intelligence" icon={<Analytics />} iconPosition="start" />
                  <Tab label="Farm Performance" icon={<Agriculture />} iconPosition="start" />
                </Tabs>

                {/* Performance Metrics Tab */}
                <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Investment Returns vs Benchmark
                        </Typography>
                        <Box sx={{ height: 400 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="returns"
                                stroke="#8884d8"
                                name="Portfolio Returns (%)"
                              />
                              <Line
                                type="monotone"
                                dataKey="benchmark"
                                stroke="#82ca9d"
                                name="Benchmark (%)"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Portfolio Distribution
                        </Typography>
                        <Box sx={{ height: 300 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={portfolioDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name} ${value}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {portfolioDistribution.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Performance Summary
                        </Typography>
                        <List>
                          {portfolioDistribution.map((item, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <PieChart sx={{ color: COLORS[index % COLORS.length] }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={item.name}
                                secondary={
                                  <>
                                    Allocation: {item.value}% | Risk Level: {item.risk}
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Risk Analysis Tab */}
                <TabPanel value={tabValue} index={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Risk Metrics
                        </Typography>
                        <Box sx={{ height: 300 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskMetrics}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="name" />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} />
                              <Radar
                                name="Risk Level"
                                dataKey="value"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Risk Assessment
                        </Typography>
                        <List>
                          {riskMetrics.map((metric, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={metric.name}
                                secondary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <LinearProgress
                                      variant="determinate"
                                      value={metric.value}
                                      sx={{ flexGrow: 1, mr: 2 }}
                                    />
                                    <Typography variant="body2">{metric.value}%</Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Market Intelligence Tab */}
                <TabPanel value={tabValue} index={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Market Trends
                        </Typography>
                        <Box sx={{ height: 400 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketTrends}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Area
                                type="monotone"
                                dataKey="grains"
                                stackId="1"
                                stroke="#8884d8"
                                fill="#8884d8"
                              />
                              <Area
                                type="monotone"
                                dataKey="dairy"
                                stackId="1"
                                stroke="#82ca9d"
                                fill="#82ca9d"
                              />
                              <Area
                                type="monotone"
                                dataKey="organic"
                                stackId="1"
                                stroke="#ffc658"
                                fill="#ffc658"
                              />
                              <Area
                                type="monotone"
                                dataKey="livestock"
                                stackId="1"
                                stroke="#ff7300"
                                fill="#ff7300"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Farm Performance Tab */}
                <TabPanel value={tabValue} index={3}>
                  <Grid container spacing={3}>
                    {farmPerformance.map((farm, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Paper sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">{farm.name}</Typography>
                            <Chip
                              label={farm.risk}
                              color={farm.risk === 'Low' ? 'success' : 'warning'}
                              size="small"
                            />
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="text.secondary">
                                Performance Score
                              </Typography>
                              <Rating value={farm.score} precision={0.1} readOnly />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="text.secondary">
                                Yield Performance
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={farm.yield}
                                sx={{ mb: 1, height: 8, borderRadius: 5 }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="text.secondary">
                                Operational Efficiency
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={farm.efficiency}
                                sx={{ mb: 1, height: 8, borderRadius: 5 }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="text.secondary">
                                Sustainability Score
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={farm.sustainability}
                                sx={{ mb: 1, height: 8, borderRadius: 5 }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Expected Return
                                </Typography>
                                <Typography variant="body2" color="primary">
                                  {farm.return}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default PortfolioDemo;

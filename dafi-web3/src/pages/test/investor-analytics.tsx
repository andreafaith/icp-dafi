import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  ShowChart,
  PieChart,
  Timeline,
  Agriculture,
  Eco,
  MonetizationOn,
} from '@mui/icons-material';
import DashboardNav from '../../components/navigation/DashboardNav';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const performanceData = [
  { month: 'Jan', returns: 15, benchmark: 12 },
  { month: 'Feb', returns: 18, benchmark: 14 },
  { month: 'Mar', returns: 22, benchmark: 16 },
  { month: 'Apr', returns: 25, benchmark: 18 },
  { month: 'May', returns: 28, benchmark: 20 },
];

const riskData = [
  { subject: 'Market Risk', A: 85, fullMark: 100 },
  { subject: 'Liquidity Risk', A: 65, fullMark: 100 },
  { subject: 'Operational Risk', A: 75, fullMark: 100 },
  { subject: 'Credit Risk', A: 80, fullMark: 100 },
  { subject: 'Environmental Risk', A: 70, fullMark: 100 },
];

const marketTrendData = [
  { date: '2024-01', value: 1500 },
  { date: '2024-02', value: 1800 },
  { date: '2024-03', value: 1600 },
  { date: '2024-04', value: 2100 },
  { date: '2024-05', value: 2400 },
];

const InvestorAnalytics = () => {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.grey[100],
        minHeight: '100vh',
        pt: 2,
      }}
    >
      <DashboardNav userType="investor" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Investment Analytics Dashboard
        </Typography>

        {/* Investment Insights */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Portfolio Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Investment
                      </Typography>
                      <Typography variant="h4">$125,000</Typography>
                      <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUp /> +15.3%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Current Returns
                      </Typography>
                      <Typography variant="h4">18.5%</Typography>
                      <LinearProgress variant="determinate" value={75} sx={{ mt: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Active Farms
                      </Typography>
                      <Typography variant="h4">12</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Across 5 regions
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Risk Score
                      </Typography>
                      <Typography variant="h4">72/100</Typography>
                      <Chip label="Moderate Risk" color="warning" size="small" />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="returns" stroke="#8884d8" name="Your Returns" />
                  <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" name="Benchmark" />
                </LineChart>
              </ResponsiveContainer>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Annual Return Rate" 
                    secondary="18.5% (3.2% above market average)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Monthly Growth" 
                    secondary="2.3% average monthly increase"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Risk Analysis */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Risk Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={riskData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="Risk Metrics" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Portfolio Volatility" 
                    secondary="Low - Beta: 0.85"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Diversification Score" 
                    secondary="85/100 - Well diversified across sectors"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Market Intelligence */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Market Intelligence
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={marketTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Market Trends
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Organic Farming" 
                            secondary="+25% YoY Growth"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Sustainable Agriculture" 
                            secondary="Rising Demand"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Commodity Prices
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Wheat" 
                            secondary="$320/ton (+5%)"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Corn" 
                            secondary="$180/ton (+2%)"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Market Forecasts
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Q1 2024 Outlook" 
                            secondary="Positive Growth Expected"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Key Opportunities" 
                            secondary="Organic Farming, Vertical Farming"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Farm Performance */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Farm Performance
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Yield Analysis
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Average Yield" 
                            secondary="4.8 tons/hectare"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Year-over-Year Growth" 
                            secondary="+12% improvement"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Quality Rating" 
                            secondary="A+ (Premium Grade)"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Operational Efficiency
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Resource Utilization" 
                            secondary="92% efficiency"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Cost per Hectare" 
                            secondary="$2,800 (-5% YoY)"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Labor Productivity" 
                            secondary="15% above industry average"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Sustainability Score
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle1">Water Usage</Typography>
                          <LinearProgress variant="determinate" value={85} sx={{ mb: 2 }} />
                          <Typography variant="body2">15% reduction in water consumption</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle1">Carbon Footprint</Typography>
                          <LinearProgress variant="determinate" value={75} sx={{ mb: 2 }} />
                          <Typography variant="body2">25% below industry average</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle1">Soil Health</Typography>
                          <LinearProgress variant="determinate" value={90} sx={{ mb: 2 }} />
                          <Typography variant="body2">Excellent soil quality maintenance</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Investment Opportunities */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Investment Opportunities
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Featured Farm Listing
                      </Typography>
                      <Typography variant="subtitle1">Organic Valley Farm</Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Investment Required" 
                            secondary="$50,000"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Expected ROI" 
                            secondary="22% (3 years)"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Risk Level" 
                            secondary="Low-Medium"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Due Diligence Report
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Financial Health" 
                            secondary="Strong (A+ Rating)"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Management Score" 
                            secondary="95/100"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Market Position" 
                            secondary="Top 10% in Region"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        ROI Projections
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="1 Year Projection" 
                            secondary="12-15% Returns"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="3 Year Projection" 
                            secondary="40-45% Returns"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Payback Period" 
                            secondary="2.5 Years"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InvestorAnalytics;

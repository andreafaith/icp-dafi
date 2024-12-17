import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  AccountBalance,
  Assessment,
  PieChart,
  ShowChart,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { DashboardLayout } from '@/components/layouts';

// Mock data for investment analytics
const mockPortfolioData = {
  totalInvestments: 250000,
  totalReturns: 45000,
  roi: 18,
  portfolioHealth: 92,
  riskScore: 65,
};

const mockInvestmentDistribution = [
  { category: 'Grain Farms', allocation: 35, returns: 22 },
  { category: 'Dairy Farms', allocation: 25, returns: 18 },
  { category: 'Organic Farms', allocation: 20, returns: 24 },
  { category: 'Livestock', allocation: 20, returns: 16 },
];

const mockPerformanceMetrics = {
  monthlyReturns: [
    { month: 'Jan', value: 2.5 },
    { month: 'Feb', value: 3.1 },
    { month: 'Mar', value: 2.8 },
    { month: 'Apr', value: 3.4 },
    { month: 'May', value: 3.7 },
  ],
  riskMetrics: {
    volatility: 12.5,
    sharpeRatio: 1.8,
    maxDrawdown: -15,
  },
};

const mockActiveFarms = [
  {
    name: 'Green Valley Farm',
    type: 'Organic',
    investment: 50000,
    returns: 22,
    risk: 'Low',
  },
  {
    name: 'Sunrise Dairy',
    type: 'Dairy',
    investment: 75000,
    returns: 18,
    risk: 'Medium',
  },
  {
    name: 'Golden Grain',
    type: 'Grain',
    investment: 60000,
    returns: 20,
    risk: 'Low',
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const InvestorAnalytics: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Investment Analytics</Typography>

        {/* Analytics Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab icon={<PieChart />} label="Portfolio Overview" />
            <Tab icon={<ShowChart />} label="Performance" />
            <Tab icon={<Assessment />} label="Risk Analysis" />
          </Tabs>
        </Box>

        {/* Portfolio Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Portfolio Summary Cards */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Total Investments</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountBalance color="primary" />
                    <Typography variant="h4" sx={{ ml: 1 }}>
                      ${mockPortfolioData.totalInvestments.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Returns: ${mockPortfolioData.totalReturns.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Investment Distribution</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell>Allocation (%)</TableCell>
                          <TableCell>Returns (%)</TableCell>
                          <TableCell>Performance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockInvestmentDistribution.map((item) => (
                          <TableRow key={item.category}>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.allocation}%</TableCell>
                            <TableCell>{item.returns}%</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={item.returns / 0.3} 
                                    color={item.returns > 20 ? "success" : "primary"}
                                  />
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Performance Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Active Investments</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Farm Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Investment</TableCell>
                          <TableCell>Returns (%)</TableCell>
                          <TableCell>Risk Level</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockActiveFarms.map((farm) => (
                          <TableRow key={farm.name}>
                            <TableCell>{farm.name}</TableCell>
                            <TableCell>{farm.type}</TableCell>
                            <TableCell>${farm.investment.toLocaleString()}</TableCell>
                            <TableCell>{farm.returns}%</TableCell>
                            <TableCell>
                              <Box sx={{ 
                                bgcolor: farm.risk === 'Low' ? 'success.light' : 
                                        farm.risk === 'Medium' ? 'warning.light' : 'error.light',
                                px: 2,
                                py: 0.5,
                                borderRadius: 1,
                                display: 'inline-block'
                              }}>
                                {farm.risk}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Risk Analysis Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Risk Metrics</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Portfolio Volatility
                      </Typography>
                      <Typography variant="h4">
                        {mockPerformanceMetrics.riskMetrics.volatility}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Sharpe Ratio
                      </Typography>
                      <Typography variant="h4">
                        {mockPerformanceMetrics.riskMetrics.sharpeRatio}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Portfolio Health</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={mockPortfolioData.portfolioHealth} 
                        color="success"
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">
                        {mockPortfolioData.portfolioHealth}%
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Based on diversification, returns, and risk metrics
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </DashboardLayout>
  );
};

export default InvestorAnalytics;

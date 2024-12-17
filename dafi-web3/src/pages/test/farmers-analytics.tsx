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
  WaterDrop,
  Eco,
  LocalFlorist,
  AttachMoney,
  Assessment as AnalyticsIcon,
} from '@mui/icons-material';
import { DashboardLayout } from '@/components/layout';

// Mock data for farm analytics
const mockYieldData = {
  currentYield: 85,
  previousYield: 75,
  projectedYield: 90,
  yieldTrend: [
    { month: 'Jan', value: 75 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 80 },
    { month: 'Apr', value: 82 },
    { month: 'May', value: 85 },
  ],
};

const mockSustainabilityMetrics = {
  waterUsage: {
    current: 75,
    target: 100,
    trend: 'decreasing',
  },
  soilHealth: {
    current: 85,
    target: 100,
    trend: 'stable',
  },
  carbonFootprint: {
    current: 65,
    target: 100,
    trend: 'improving',
  },
};

const mockFinancialMetrics = {
  revenuePerAcre: 5200,
  operatingCosts: 3800,
  profitMargin: 27,
  returnOnInvestment: 18,
};

const mockCropPerformance = [
  {
    crop: 'Corn',
    yield: '8.5 tons/acre',
    efficiency: 92,
    revenue: '$4,500/acre',
    status: 'Excellent',
  },
  {
    crop: 'Soybeans',
    yield: '3.2 tons/acre',
    efficiency: 88,
    revenue: '$3,800/acre',
    status: 'Good',
  },
  {
    crop: 'Wheat',
    yield: '4.1 tons/acre',
    efficiency: 85,
    revenue: '$3,200/acre',
    status: 'Good',
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

const FarmersAnalytics: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Farm Analytics</Typography>

        {/* Analytics Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab icon={<Timeline />} label="Yield Analysis" />
            <Tab icon={<Eco />} label="Sustainability" />
            <Tab icon={<AttachMoney />} label="Financial Performance" />
          </Tabs>
        </Box>

        {/* Yield Analysis Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Yield Overview Cards */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Current Yield</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp color="success" />
                    <Typography variant="h4" sx={{ ml: 1 }}>
                      {mockYieldData.currentYield}%
                    </Typography>
                  </Box>
                  <Typography color="text.secondary" variant="body2">
                    +{mockYieldData.currentYield - mockYieldData.previousYield}% from last season
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Crop Performance</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Crop</TableCell>
                          <TableCell>Yield</TableCell>
                          <TableCell>Efficiency</TableCell>
                          <TableCell>Revenue</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockCropPerformance.map((crop) => (
                          <TableRow key={crop.crop}>
                            <TableCell>{crop.crop}</TableCell>
                            <TableCell>{crop.yield}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                  <LinearProgress variant="determinate" value={crop.efficiency} />
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                  <Typography variant="body2" color="text.secondary">{crop.efficiency}%</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{crop.revenue}</TableCell>
                            <TableCell>{crop.status}</TableCell>
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

        {/* Sustainability Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <WaterDrop sx={{ mr: 1 }} />
                    Water Usage Efficiency
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={mockSustainabilityMetrics.waterUsage.current} 
                      color="primary"
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {mockSustainabilityMetrics.waterUsage.current}% of target
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <LocalFlorist sx={{ mr: 1 }} />
                    Soil Health
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={mockSustainabilityMetrics.soilHealth.current} 
                      color="success"
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {mockSustainabilityMetrics.soilHealth.current}% optimal
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <Eco sx={{ mr: 1 }} />
                    Carbon Footprint
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={mockSustainabilityMetrics.carbonFootprint.current} 
                      color="warning"
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {mockSustainabilityMetrics.carbonFootprint.current}% reduction achieved
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Financial Performance Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Revenue Metrics</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Revenue per Acre
                      </Typography>
                      <Typography variant="h4">
                        ${mockFinancialMetrics.revenuePerAcre}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Operating Costs
                      </Typography>
                      <Typography variant="h4">
                        ${mockFinancialMetrics.operatingCosts}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Profitability Metrics</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Profit Margin
                      </Typography>
                      <Typography variant="h4">
                        {mockFinancialMetrics.profitMargin}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        ROI
                      </Typography>
                      <Typography variant="h4">
                        {mockFinancialMetrics.returnOnInvestment}%
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </DashboardLayout>
  );
};

export default FarmersAnalytics;

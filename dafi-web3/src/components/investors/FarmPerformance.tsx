import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  WbSunny,
  Water,
  Eco,
  MonetizationOn,
  Assessment,
  Warning,
  CheckCircle,
  Timeline,
  CloudQueue,
  Agriculture,
  Inventory,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

interface FarmMetrics {
  id: string;
  farmName: string;
  location: string;
  size: number;
  mainCrops: string[];
  performance: {
    yieldEfficiency: number;
    resourceUtilization: number;
    sustainability: number;
    financialHealth: number;
    operationalEfficiency: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    rainfall: number;
    forecast: string;
    alerts: string[];
  };
  yields: {
    current: number;
    projected: number;
    historical: {
      period: string;
      actual: number;
      projected: number;
    }[];
  };
  resources: {
    water: {
      usage: number;
      efficiency: number;
      cost: number;
    };
    energy: {
      usage: number;
      renewable: number;
      cost: number;
    };
    labor: {
      hours: number;
      efficiency: number;
      cost: number;
    };
  };
  financials: {
    revenue: number;
    expenses: number;
    profit: number;
    roi: number;
    trends: {
      month: string;
      revenue: number;
      expenses: number;
      profit: number;
    }[];
  };
  inventory: {
    item: string;
    quantity: number;
    value: number;
    status: 'Low' | 'Optimal' | 'Excess';
  }[];
  risks: {
    category: string;
    level: 'Low' | 'Medium' | 'High';
    impact: number;
    mitigationStatus: string;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const mockFarmData: FarmMetrics = {
  id: '1',
  farmName: 'Green Valley Farm',
  location: 'California, USA',
  size: 500,
  mainCrops: ['Corn', 'Soybeans', 'Wheat'],
  performance: {
    yieldEfficiency: 85,
    resourceUtilization: 78,
    sustainability: 92,
    financialHealth: 88,
    operationalEfficiency: 82,
  },
  weather: {
    temperature: 25,
    humidity: 65,
    rainfall: 25.4,
    forecast: 'Partly cloudy with moderate rainfall expected',
    alerts: ['Heavy rain expected in 2 days', 'Optimal planting conditions next week'],
  },
  yields: {
    current: 180,
    projected: 195,
    historical: [
      { period: 'Jan', actual: 0, projected: 0 },
      { period: 'Feb', actual: 0, projected: 0 },
      { period: 'Mar', actual: 20, projected: 18 },
      { period: 'Apr', actual: 45, projected: 42 },
      { period: 'May', actual: 85, projected: 80 },
      { period: 'Jun', actual: 120, projected: 115 },
    ],
  },
  resources: {
    water: {
      usage: 25000,
      efficiency: 88,
      cost: 5000,
    },
    energy: {
      usage: 15000,
      renewable: 65,
      cost: 3500,
    },
    labor: {
      hours: 2500,
      efficiency: 92,
      cost: 45000,
    },
  },
  financials: {
    revenue: 850000,
    expenses: 520000,
    profit: 330000,
    roi: 15.5,
    trends: [
      { month: 'Jan', revenue: 65000, expenses: 45000, profit: 20000 },
      { month: 'Feb', revenue: 72000, expenses: 48000, profit: 24000 },
      { month: 'Mar', revenue: 85000, expenses: 52000, profit: 33000 },
      { month: 'Apr', revenue: 92000, expenses: 54000, profit: 38000 },
      { month: 'May', revenue: 88000, expenses: 51000, profit: 37000 },
      { month: 'Jun', revenue: 95000, expenses: 55000, profit: 40000 },
    ],
  },
  inventory: [
    { item: 'Seeds', quantity: 5000, value: 25000, status: 'Optimal' },
    { item: 'Fertilizer', quantity: 2000, value: 15000, status: 'Low' },
    { item: 'Equipment', quantity: 15, value: 150000, status: 'Optimal' },
  ],
  risks: [
    {
      category: 'Weather',
      level: 'Medium',
      impact: 7,
      mitigationStatus: 'Insurance coverage active',
    },
    {
      category: 'Market Price',
      level: 'Low',
      impact: 4,
      mitigationStatus: 'Forward contracts in place',
    },
    {
      category: 'Operational',
      level: 'Low',
      impact: 3,
      mitigationStatus: 'Preventive maintenance scheduled',
    },
  ],
};

export const FarmPerformance: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [timeframe, setTimeframe] = useState('6M');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Low':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'success';
      case 'Optimal':
        return 'success';
      case 'Excess':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Farm Performance Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)}>
            <Tab icon={<Assessment />} label="Overview" />
            <Tab icon={<Timeline />} label="Yields" />
            <Tab icon={<MonetizationOn />} label="Financials" />
            <Tab icon={<Warning />} label="Risk Analysis" />
          </Tabs>
        </Grid>

        {selectedTab === 0 && (
          <>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6">Performance Metrics</Typography>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                      >
                        <MenuItem value="1M">1 Month</MenuItem>
                        <MenuItem value="3M">3 Months</MenuItem>
                        <MenuItem value="6M">6 Months</MenuItem>
                        <MenuItem value="1Y">1 Year</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Grid container spacing={2}>
                    {Object.entries(mockFarmData.performance).map(([key, value]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                          <Typography variant="h6" gutterBottom>
                            {value}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={value}
                            color={value >= 80 ? 'success' : value >= 60 ? 'warning' : 'error'}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Box mt={4}>
                    <Typography variant="subtitle1" gutterBottom>
                      Resource Utilization
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={[
                        {
                          subject: 'Water',
                          value: mockFarmData.resources.water.efficiency,
                        },
                        {
                          subject: 'Energy',
                          value: mockFarmData.resources.energy.renewable,
                        },
                        {
                          subject: 'Labor',
                          value: mockFarmData.resources.labor.efficiency,
                        },
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Efficiency"
                          dataKey="value"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Weather Conditions
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Temperature
                          </Typography>
                          <Typography variant="h6">
                            {mockFarmData.weather.temperature}°C
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Humidity
                          </Typography>
                          <Typography variant="h6">
                            {mockFarmData.weather.humidity}%
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Rainfall
                          </Typography>
                          <Typography variant="h6">
                            {mockFarmData.weather.rainfall}mm
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box mt={2}>
                        {mockFarmData.weather.alerts.map((alert, index) => (
                          <Alert severity="info" sx={{ mb: 1 }} key={index}>
                            {alert}
                          </Alert>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Inventory Status
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Item</TableCell>
                              <TableCell align="right">Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {mockFarmData.inventory.map((item) => (
                              <TableRow key={item.item}>
                                <TableCell>{item.item}</TableCell>
                                <TableCell align="right">
                                  <Chip
                                    label={item.status}
                                    color={getStatusColor(item.status)}
                                    size="small"
                                  />
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
            </Grid>
          </>
        )}

        {selectedTab === 1 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Yield Performance
                </Typography>
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockFarmData.yields.historical}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#8884d8"
                        name="Actual Yield"
                      />
                      <Line
                        type="monotone"
                        dataKey="projected"
                        stroke="#82ca9d"
                        name="Projected Yield"
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {selectedTab === 2 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Financial Performance
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Box height={400}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockFarmData.financials.trends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stackId="1"
                            stroke="#8884d8"
                            fill="#8884d8"
                            name="Revenue"
                          />
                          <Area
                            type="monotone"
                            dataKey="expenses"
                            stackId="2"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            name="Expenses"
                          />
                          <Area
                            type="monotone"
                            dataKey="profit"
                            stackId="3"
                            stroke="#ffc658"
                            fill="#ffc658"
                            name="Profit"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      Financial Metrics
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography color="text.secondary">Revenue</Typography>
                      <Typography variant="h5" color="primary">
                        ${mockFarmData.financials.revenue.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography color="text.secondary">Expenses</Typography>
                      <Typography variant="h5" color="error">
                        ${mockFarmData.financials.expenses.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography color="text.secondary">Profit</Typography>
                      <Typography variant="h5" color="success.main">
                        ${mockFarmData.financials.profit.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="text.secondary">ROI</Typography>
                      <Typography variant="h5">
                        {mockFarmData.financials.roi}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {selectedTab === 3 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Risk Assessment
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Risk Category</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Impact Score</TableCell>
                        <TableCell>Mitigation Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockFarmData.risks.map((risk) => (
                        <TableRow key={risk.category}>
                          <TableCell>{risk.category}</TableCell>
                          <TableCell>
                            <Chip
                              label={risk.level}
                              color={getStatusColor(risk.level)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                {risk.impact}/10
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={risk.impact * 10}
                                color={risk.impact > 7 ? 'error' : risk.impact > 4 ? 'warning' : 'success'}
                                sx={{ width: 100 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>{risk.mitigationStatus}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

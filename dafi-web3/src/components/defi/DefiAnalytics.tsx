import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Analytics, TrendingUp } from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DefiAnalytics: React.FC = () => {
  const tvlData = [
    { date: '2024-01', tvl: 1000000 },
    { date: '2024-02', tvl: 1500000 },
    { date: '2024-03', tvl: 2000000 },
    { date: '2024-04', tvl: 2500000 },
    { date: '2024-05', tvl: 3000000 },
  ];

  const volumeData = [
    { date: '2024-01', volume: 500000 },
    { date: '2024-02', volume: 750000 },
    { date: '2024-03', volume: 1000000 },
    { date: '2024-04', volume: 1250000 },
    { date: '2024-05', volume: 1500000 },
  ];

  const distributionData = [
    { name: 'Staking', value: 40 },
    { name: 'Liquidity', value: 30 },
    { name: 'Farming', value: 20 },
    { name: 'Treasury', value: 10 },
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Analytics sx={{ mr: 1 }} />
          <Typography variant="h6">DeFi Analytics</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* TVL Chart */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Total Value Locked (TVL)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tvlData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tvl"
                      stroke="#8884d8"
                      name="TVL ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Trading Volume */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Trading Volume
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="volume"
                      fill="#82ca9d"
                      name="Volume ($)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Token Distribution */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Token Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Key Metrics */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Key Metrics
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Total DAFI Supply"
                      secondary="10,000,000 DAFI"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Circulating Supply"
                      secondary="7,500,000 DAFI"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Total Transactions"
                      secondary="125,000"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Active Users"
                      secondary="5,000"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Average Daily Volume"
                      secondary="$500,000"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DefiAnalytics;

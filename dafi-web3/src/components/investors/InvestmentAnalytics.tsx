import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const monthlyReturns = [
  { month: 'Jan', return: 12.5 },
  { month: 'Feb', return: 13.2 },
  { month: 'Mar', return: 14.8 },
  { month: 'Apr', return: 14.2 },
  { month: 'May', return: 15.5 },
  { month: 'Jun', return: 15.2 },
];

const investmentDistribution = [
  { name: 'Grains', value: 40 },
  { name: 'Fruits', value: 30 },
  { name: 'Vegetables', value: 20 },
  { name: 'Others', value: 10 },
];

const riskMetrics = [
  { name: 'Market Risk', value: 65 },
  { name: 'Credit Risk', value: 45 },
  { name: 'Operational Risk', value: 35 },
  { name: 'Liquidity Risk', value: 55 },
];

const farmPerformance = [
  {
    name: 'Green Valley',
    investment: 100000,
    return: 15000,
    roi: 15,
  },
  {
    name: 'Sunrise Orchards',
    investment: 75000,
    return: 9750,
    roi: 13,
  },
  {
    name: 'Blue Ridge',
    investment: 50000,
    return: 6000,
    roi: 12,
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const InvestmentAnalytics: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Investment Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Monthly Returns */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Returns
              </Typography>
              <LineChart
                width={700}
                height={300}
                data={monthlyReturns}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="return"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Investment Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Investment Distribution
              </Typography>
              <PieChart width={300} height={300}>
                <Pie
                  data={investmentDistribution}
                  cx={150}
                  cy={150}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {investmentDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Analysis
              </Typography>
              {riskMetrics.map((metric) => (
                <Box key={metric.name} sx={{ mb: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="body2">{metric.name}</Typography>
                    <Typography variant="body2">{metric.value}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Farm Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Farm Performance
              </Typography>
              <BarChart
                width={500}
                height={300}
                data={farmPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="investment"
                  fill="#8884d8"
                  name="Investment Amount"
                />
                <Bar
                  yAxisId="right"
                  dataKey="return"
                  fill="#82ca9d"
                  name="Return Amount"
                />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

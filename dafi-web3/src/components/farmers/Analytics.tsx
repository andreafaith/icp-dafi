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

const yieldData = [
  { month: 'Jan', actual: 4000, predicted: 4400 },
  { month: 'Feb', actual: 3000, predicted: 3200 },
  { month: 'Mar', actual: 2000, predicted: 2400 },
  { month: 'Apr', actual: 2780, predicted: 2900 },
  { month: 'May', actual: 1890, predicted: 2100 },
  { month: 'Jun', actual: 2390, predicted: 2500 },
];

const cropDistribution = [
  { name: 'Corn', value: 400 },
  { name: 'Soybeans', value: 300 },
  { name: 'Wheat', value: 300 },
  { name: 'Cotton', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const performanceMetrics = [
  { metric: 'Soil Health', value: 85 },
  { metric: 'Water Efficiency', value: 92 },
  { metric: 'Pest Control', value: 78 },
  { metric: 'Nutrient Management', value: 88 },
];

export const Analytics: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Farm Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Yield Analysis */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Yield Analysis
              </Typography>
              <LineChart
                width={700}
                height={300}
                data={yieldData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="predicted" stroke="#82ca9d" />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Crop Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Crop Distribution
              </Typography>
              <PieChart width={300} height={300}>
                <Pie
                  data={cropDistribution}
                  cx={150}
                  cy={150}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cropDistribution.map((entry, index) => (
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

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Grid container spacing={3}>
                {performanceMetrics.map((metric) => (
                  <Grid item xs={12} sm={6} md={3} key={metric.metric}>
                    <Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="body2">{metric.metric}</Typography>
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
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Performance
              </Typography>
              <BarChart
                width={1000}
                height={300}
                data={[
                  { name: 'Q1', revenue: 4000, expenses: 2400, profit: 1600 },
                  { name: 'Q2', revenue: 3000, expenses: 1398, profit: 1602 },
                  { name: 'Q3', revenue: 2000, expenses: 9800, profit: -7800 },
                  { name: 'Q4', revenue: 2780, expenses: 3908, profit: -1128 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" />
                <Bar dataKey="expenses" fill="#8884d8" />
                <Bar dataKey="profit" fill="#ffc658" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

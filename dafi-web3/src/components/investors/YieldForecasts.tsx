import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
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
} from 'recharts';

interface FarmYield {
  farmName: string;
  cropType: string;
  currentYield: number;
  projectedYield: number;
  confidenceScore: number;
  riskFactors: string[];
  monthlyProjections: {
    month: string;
    projected: number;
    actual?: number;
    weather: string;
  }[];
  historicalData: {
    year: string;
    yield: number;
    weather: string;
  }[];
}

const mockYieldData: FarmYield[] = [
  {
    farmName: 'Green Valley Farm',
    cropType: 'Corn',
    currentYield: 180,
    projectedYield: 195,
    confidenceScore: 85,
    riskFactors: ['Drought Risk', 'Market Volatility'],
    monthlyProjections: [
      { month: 'Jan', projected: 0, weather: 'Winter' },
      { month: 'Feb', projected: 0, weather: 'Winter' },
      { month: 'Mar', projected: 20, weather: 'Spring' },
      { month: 'Apr', projected: 45, actual: 47, weather: 'Spring' },
      { month: 'May', projected: 85, actual: 82, weather: 'Spring' },
      { month: 'Jun', projected: 120, actual: 118, weather: 'Summer' },
      { month: 'Jul', projected: 150, weather: 'Summer' },
      { month: 'Aug', projected: 175, weather: 'Summer' },
      { month: 'Sep', projected: 195, weather: 'Fall' },
      { month: 'Oct', projected: 195, weather: 'Fall' },
      { month: 'Nov', projected: 0, weather: 'Winter' },
      { month: 'Dec', projected: 0, weather: 'Winter' },
    ],
    historicalData: [
      { year: '2020', yield: 165, weather: 'Normal' },
      { year: '2021', yield: 172, weather: 'Drought' },
      { year: '2022', yield: 178, weather: 'Good' },
      { year: '2023', yield: 180, weather: 'Excellent' },
    ],
  },
  {
    farmName: 'Sunrise Orchards',
    cropType: 'Apples',
    currentYield: 35,
    projectedYield: 42,
    confidenceScore: 92,
    riskFactors: ['Frost Risk', 'Pest Pressure'],
    monthlyProjections: [
      { month: 'Jan', projected: 0, weather: 'Winter' },
      { month: 'Feb', projected: 0, weather: 'Winter' },
      { month: 'Mar', projected: 5, weather: 'Spring' },
      { month: 'Apr', projected: 12, actual: 13, weather: 'Spring' },
      { month: 'May', projected: 20, actual: 21, weather: 'Spring' },
      { month: 'Jun', projected: 28, actual: 27, weather: 'Summer' },
      { month: 'Jul', projected: 35, weather: 'Summer' },
      { month: 'Aug', projected: 38, weather: 'Summer' },
      { month: 'Sep', projected: 42, weather: 'Fall' },
      { month: 'Oct', projected: 42, weather: 'Fall' },
      { month: 'Nov', projected: 0, weather: 'Winter' },
      { month: 'Dec', projected: 0, weather: 'Winter' },
    ],
    historicalData: [
      { year: '2020', yield: 32, weather: 'Normal' },
      { year: '2021', yield: 34, weather: 'Good' },
      { year: '2022', yield: 33, weather: 'Frost' },
      { year: '2023', yield: 35, weather: 'Excellent' },
    ],
  },
];

export const YieldForecasts: React.FC = () => {
  const [selectedFarm, setSelectedFarm] = useState<string>(mockYieldData[0].farmName);
  const [timeframe, setTimeframe] = useState<string>('monthly');

  const currentFarm = mockYieldData.find((farm) => farm.farmName === selectedFarm)!;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Yield Forecasts
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={3}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Select Farm</InputLabel>
                  <Select
                    value={selectedFarm}
                    label="Select Farm"
                    onChange={(e) => setSelectedFarm(e.target.value)}
                  >
                    {mockYieldData.map((farm) => (
                      <MenuItem key={farm.farmName} value={farm.farmName}>
                        {farm.farmName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box>
                  <Button
                    variant={timeframe === 'monthly' ? 'contained' : 'outlined'}
                    onClick={() => setTimeframe('monthly')}
                    sx={{ mr: 1 }}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={timeframe === 'yearly' ? 'contained' : 'outlined'}
                    onClick={() => setTimeframe('yearly')}
                  >
                    Yearly
                  </Button>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                Yield Projections
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                {timeframe === 'monthly' ? (
                  <LineChart data={currentFarm.monthlyProjections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="projected"
                      stroke="#8884d8"
                      name="Projected Yield"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#82ca9d"
                      name="Actual Yield"
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={currentFarm.historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="yield"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="Historical Yield"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Current Statistics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary" gutterBottom>
                      Current Yield
                    </Typography>
                    <Typography variant="h4">
                      {currentFarm.currentYield} bushels/acre
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary" gutterBottom>
                      Projected Yield
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {currentFarm.projectedYield} bushels/acre
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Confidence Score
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {currentFarm.confidenceScore}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Risk Factors
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {currentFarm.riskFactors.map((risk) => (
                      <Chip
                        key={risk}
                        label={risk}
                        color="warning"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Weather Impact
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell>Weather</TableCell>
                          <TableCell align="right">Projected</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentFarm.monthlyProjections
                          .filter((m) => m.projected > 0)
                          .map((month) => (
                            <TableRow key={month.month}>
                              <TableCell>{month.month}</TableCell>
                              <TableCell>{month.weather}</TableCell>
                              <TableCell align="right">
                                {month.projected} bu/acre
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
      </Grid>
    </Box>
  );
};

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const portfolioData = [
  {
    id: 1,
    farmName: 'Green Valley Farm',
    investmentAmount: 100000,
    tokenAmount: 1000,
    returnRate: 12.5,
    status: 'Active',
  },
  {
    id: 2,
    farmName: 'Sunrise Orchards',
    investmentAmount: 75000,
    tokenAmount: 750,
    returnRate: 15.2,
    status: 'Active',
  },
  {
    id: 3,
    farmName: 'Blue Ridge Farm',
    investmentAmount: 50000,
    tokenAmount: 500,
    returnRate: 10.8,
    status: 'Pending',
  },
];

const performanceData = [
  { month: 'Jan', return: 5.2 },
  { month: 'Feb', return: 7.8 },
  { month: 'Mar', return: 10.3 },
  { month: 'Apr', return: 12.5 },
  { month: 'May', return: 15.2 },
  { month: 'Jun', return: 14.8 },
];

const allocationData = [
  { name: 'Grains', value: 40 },
  { name: 'Fruits', value: 30 },
  { name: 'Vegetables', value: 20 },
  { name: 'Others', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const InvestorPortfolio: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Investment Portfolio
      </Typography>

      <Grid container spacing={3}>
        {/* Portfolio Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Performance
              </Typography>
              <LineChart
                width={700}
                height={300}
                data={performanceData}
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

        {/* Asset Allocation */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asset Allocation
              </Typography>
              <PieChart width={300} height={300}>
                <Pie
                  data={allocationData}
                  cx={150}
                  cy={150}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
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

        {/* Investment Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Farm Name</TableCell>
                  <TableCell align="right">Investment Amount</TableCell>
                  <TableCell align="right">Token Amount</TableCell>
                  <TableCell align="right">Return Rate</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {portfolioData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.farmName}
                    </TableCell>
                    <TableCell align="right">
                      ${row.investmentAmount.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {row.tokenAmount.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {row.returnRate}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={row.returnRate}
                          sx={{ width: 100 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={row.status === 'Active' ? 'success' : 'warning'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

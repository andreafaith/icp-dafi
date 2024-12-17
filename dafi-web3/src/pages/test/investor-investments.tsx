import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Layout } from '@/components/layouts';

// Mock investments data
const mockInvestments = [
  {
    id: 1,
    farmName: 'Green Valley Farm',
    amount: 100000,
    returnRate: 12.5,
    term: '12 months',
    status: 'Active',
    progress: 75,
    nextPayout: '2024-01-15',
    risk: 'Low',
  },
  {
    id: 2,
    farmName: 'Sunrise Orchards',
    amount: 50000,
    returnRate: 15.0,
    term: '6 months',
    status: 'Pending',
    progress: 0,
    nextPayout: '-',
    risk: 'Medium',
  },
  // Add more mock investments as needed
];

export default function InvestorInvestments() {
  return (
    <Layout>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>My Investments</Typography>

        {/* Investment Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Invested</Typography>
                <Typography variant="h4">$150,000</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Returns</Typography>
                <Typography variant="h4">$18,750</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Average ROI</Typography>
                <Typography variant="h4">13.75%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Investments Table */}
        <TableContainer component={Paper} sx={{ mb: 4, boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Farm Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Return Rate</TableCell>
                <TableCell>Term</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockInvestments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>{investment.farmName}</TableCell>
                  <TableCell>${investment.amount.toLocaleString()}</TableCell>
                  <TableCell>{investment.returnRate}%</TableCell>
                  <TableCell>{investment.term}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={investment.progress} />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {investment.progress}%
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={investment.status}
                      color={investment.status === 'Active' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={investment.risk}
                      color={
                        investment.risk === 'Low' ? 'success' :
                        investment.risk === 'Medium' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => alert(`View details for investment ${investment.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Find New Investments Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => alert('Find new investments clicked')}
          >
            Find New Investment Opportunities
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}

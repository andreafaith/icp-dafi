import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  useTheme,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Layout } from '../../components/Layout';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';

// Mock data for investments
const mockInvestments = [
  {
    id: 1,
    farmName: 'Green Valley Farm',
    investmentAmount: 50000,
    tokenAmount: 5000,
    currentValue: 55000,
    roi: 10,
    status: 'Active',
    yieldRate: 12,
    maturityDate: '2024-12-31',
    farmType: 'Organic',
    riskLevel: 'Medium',
  },
  {
    id: 2,
    farmName: 'Sunrise Orchards',
    investmentAmount: 75000,
    tokenAmount: 7500,
    currentValue: 85000,
    roi: 13.33,
    status: 'Active',
    yieldRate: 15,
    maturityDate: '2024-10-15',
    farmType: 'Traditional',
    riskLevel: 'Low',
  },
];

// Enhanced statistics
const mockStats = {
  portfolioValue: 140000,
  totalInvestments: 125000,
  totalReturn: 15000,
  averageROI: 12,
  activeInvestments: 2,
  pendingInvestments: 1,
  portfolioGrowth: 15.5,
  monthlyYield: 1250,
  yearToDateReturn: 11.2,
  riskScore: 65,
  diversificationScore: 78,
  sustainabilityScore: 85,
  portfolioGain: 20000,
  portfolioGainPercentage: 16.67,
};

// Portfolio distribution
const portfolioDistribution = [
  { category: 'Organic Farms', percentage: 40 },
  { category: 'Traditional Farms', percentage: 35 },
  { category: 'Sustainable Farms', percentage: 25 },
];

// Historical performance
const historicalPerformance = [
  { month: 'Jan', return: 2.5 },
  { month: 'Feb', return: 1.8 },
  { month: 'Mar', return: 3.2 },
  { month: 'Apr', return: 2.1 },
  { month: 'May', return: 2.8 },
  { month: 'Jun', return: 3.5 },
];

const InvestorDashboard = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  const handleViewDetails = (investment) => {
    setSelectedInvestment(investment);
    setOpenDialog(true);
  };

  return (
    <Layout>
      <Box sx={{ width: '100%' }}>
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              bgcolor: '#FFFFFF',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Portfolio Value</Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>${mockStats.portfolioValue.toLocaleString()}</Typography>
                <Typography variant="body2" color="success.main">
                  +${mockStats.portfolioGain.toLocaleString()} ({mockStats.portfolioGainPercentage}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              bgcolor: '#FFFFFF',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Average ROI</Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>{mockStats.averageROI}%</Typography>
                <Typography variant="body2">Year to Date: {mockStats.yearToDateReturn}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              bgcolor: '#FFFFFF',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Monthly Yield</Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>${mockStats.monthlyYield.toLocaleString()}</Typography>
                <Typography variant="body2">Active Investments: {mockStats.activeInvestments}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              bgcolor: '#FFFFFF',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Risk Score</Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>{mockStats.riskScore}/100</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={mockStats.riskScore} 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              height: '100%',
              bgcolor: '#FFFFFF',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Investment Performance</Typography>
                {/* Chart component here */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              bgcolor: '#FFFFFF',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Portfolio Distribution</Typography>
                {/* Pie chart component here */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Transactions */}
        <Card sx={{ 
          mb: 2,
          bgcolor: '#FFFFFF',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
          borderRadius: '8px',
        }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Farm</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Transaction rows here */}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Investments Table */}
        <Typography variant="h5" sx={{ mb: 3 }}>Active Investments</Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Farm Name</TableCell>
                <TableCell>Investment</TableCell>
                <TableCell>Current Value</TableCell>
                <TableCell>ROI</TableCell>
                <TableCell>Yield Rate</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockInvestments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>{investment.farmName}</TableCell>
                  <TableCell>${investment.investmentAmount.toLocaleString()}</TableCell>
                  <TableCell>${investment.currentValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Typography color={investment.roi >= 10 ? 'success.main' : 'warning.main'}>
                      {investment.roi}%
                    </Typography>
                  </TableCell>
                  <TableCell>{investment.yieldRate}%</TableCell>
                  <TableCell>
                    <Chip 
                      label={investment.riskLevel}
                      color={
                        investment.riskLevel === 'Low' ? 'success' :
                        investment.riskLevel === 'Medium' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={investment.status}
                      color={investment.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(investment)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Quick Actions */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <AccountBalanceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  New Opportunities
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Explore new investment opportunities in verified farms.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => alert('Explore Opportunities clicked')}
                >
                  Explore Opportunities
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Portfolio Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get detailed insights about your investment portfolio.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => alert('View Analysis clicked')}
                >
                  View Analysis
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Yield Forecasts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  View projected yields and returns for your investments.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => alert('View Forecasts clicked')}
                >
                  View Forecasts
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Investment Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Investment Details</DialogTitle>
        <DialogContent>
          {selectedInvestment && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Farm Name</Typography>
                <Typography variant="body1" gutterBottom>{selectedInvestment.farmName}</Typography>
                
                <Typography variant="subtitle2">Investment Amount</Typography>
                <Typography variant="body1" gutterBottom>
                  ${selectedInvestment.investmentAmount.toLocaleString()}
                </Typography>
                
                <Typography variant="subtitle2">Current Value</Typography>
                <Typography variant="body1" gutterBottom>
                  ${selectedInvestment.currentValue.toLocaleString()}
                </Typography>
                
                <Typography variant="subtitle2">ROI</Typography>
                <Typography variant="body1" gutterBottom>{selectedInvestment.roi}%</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Farm Type</Typography>
                <Typography variant="body1" gutterBottom>{selectedInvestment.farmType}</Typography>
                
                <Typography variant="subtitle2">Risk Level</Typography>
                <Typography variant="body1" gutterBottom>{selectedInvestment.riskLevel}</Typography>
                
                <Typography variant="subtitle2">Yield Rate</Typography>
                <Typography variant="body1" gutterBottom>{selectedInvestment.yieldRate}%</Typography>
                
                <Typography variant="subtitle2">Maturity Date</Typography>
                <Typography variant="body1" gutterBottom>{selectedInvestment.maturityDate}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => alert('Download Report clicked')}>
            Download Report
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default InvestorDashboard;

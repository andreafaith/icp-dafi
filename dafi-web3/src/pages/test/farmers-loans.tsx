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
} from '@mui/material';
import Layout from '@/components/layouts/Layout';

// Mock data for loans
const mockLoans = [
  {
    id: 1,
    loanAmount: 50000,
    purpose: 'Equipment Purchase',
    interestRate: 5.5,
    term: '12 months',
    status: 'Active',
    nextPayment: '2024-01-15',
    amountPaid: 15000,
    remainingBalance: 35000,
  },
  {
    id: 2,
    loanAmount: 25000,
    purpose: 'Crop Financing',
    interestRate: 4.8,
    term: '6 months',
    status: 'Pending',
    nextPayment: '2024-01-20',
    amountPaid: 0,
    remainingBalance: 25000,
  },
  // Add more mock loans as needed
];

export default function FarmersLoans() {
  return (
    <Layout>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>My Loans</Typography>

        {/* Loan Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Active Loans</Typography>
                <Typography variant="h4">$75,000</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Amount Paid</Typography>
                <Typography variant="h4">$15,000</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Remaining Balance</Typography>
                <Typography variant="h4">$60,000</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Loans Table */}
        <TableContainer component={Paper} sx={{ mb: 4, boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loan ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Interest Rate</TableCell>
                <TableCell>Term</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Next Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.id}</TableCell>
                  <TableCell>${loan.loanAmount.toLocaleString()}</TableCell>
                  <TableCell>{loan.purpose}</TableCell>
                  <TableCell>{loan.interestRate}%</TableCell>
                  <TableCell>{loan.term}</TableCell>
                  <TableCell>
                    <Chip
                      label={loan.status}
                      color={loan.status === 'Active' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{loan.nextPayment}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => alert(`View details for loan ${loan.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Apply for New Loan Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => alert('Apply for new loan clicked')}
          >
            Apply for New Loan
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}

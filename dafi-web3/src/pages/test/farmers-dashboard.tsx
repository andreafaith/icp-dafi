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
  useTheme,
  Chip,
} from '@mui/material';
import Layout from '@/components/layouts/Layout';
import AddIcon from '@mui/icons-material/Add';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AnalyticsIcon from '@mui/icons-material/Analytics';

// Mock data
const mockFarms = [
  {
    id: 1,
    name: 'Green Valley Farm',
    location: 'California, USA',
    size: '500 acres',
    crops: ['Corn', 'Soybeans'],
    status: 'Active',
    tokenized: true,
    currentValue: 500000,
    investmentReceived: 250000,
  },
  {
    id: 2,
    name: 'Sunrise Orchards',
    location: 'Washington, USA',
    size: '200 acres',
    crops: ['Apples', 'Pears'],
    status: 'Pending',
    tokenized: false,
    currentValue: 300000,
    investmentReceived: 0,
  },
];

const mockStats = {
  totalFarms: 2,
  totalInvestment: 250000,
  activeProjects: 1,
  averageReturn: 12.5,
};

const FarmersDashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box sx={{ width: '100%', py: 2, bgcolor: '#FFFFFF' }}>
          {/* Stats Section */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Total Farms
                  </Typography>
                  <Typography variant="h4" component="div">
                    {mockStats.totalFarms}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Total Investment
                  </Typography>
                  <Typography variant="h4" component="div">
                    ${mockStats.totalInvestment.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Active Projects
                  </Typography>
                  <Typography variant="h4" component="div">
                    {mockStats.activeProjects}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Average Return
                  </Typography>
                  <Typography variant="h4" component="div">
                    {mockStats.averageReturn}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Add Farm Button */}
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Add New Farm
            </Button>
          </Box>

          {/* Farms Table */}
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Farm Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Crops</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Current Value</TableCell>
                  <TableCell>Investment</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockFarms.map((farm) => (
                  <TableRow key={farm.id}>
                    <TableCell>{farm.name}</TableCell>
                    <TableCell>{farm.location}</TableCell>
                    <TableCell>{farm.size}</TableCell>
                    <TableCell>
                      {farm.crops.map((crop) => (
                        <Chip
                          key={crop}
                          label={crop}
                          size="small"
                          sx={{ mr: 0.5, bgcolor: '#E8F5E9' }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={farm.status}
                        color={farm.status === 'Active' ? 'success' : 'warning'}
                        sx={{
                          bgcolor: farm.status === 'Active' ? '#2E5B2E' : '#FFA726',
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>${farm.currentValue.toLocaleString()}</TableCell>
                    <TableCell>${farm.investmentReceived.toLocaleString()}</TableCell>
                    <TableCell>
                      {farm.tokenized ? (
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ borderColor: '#2E5B2E', color: '#2E5B2E' }}
                        >
                          View Details
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            bgcolor: '#2E5B2E',
                            '&:hover': {
                              bgcolor: '#1F3F1F',
                            },
                          }}
                        >
                          Tokenize
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Quick Actions */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MonetizationOnIcon sx={{ mr: 1, color: '#2E5B2E' }} />
                    <Typography variant="h6">Investment Opportunities</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    View and manage investment proposals for your farms.
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ borderColor: '#2E5B2E', color: '#2E5B2E' }}
                  >
                    View Opportunities
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AgricultureIcon sx={{ mr: 1, color: '#2E5B2E' }} />
                    <Typography variant="h6">Farm Management</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Update farm details and manage operations.
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ borderColor: '#2E5B2E', color: '#2E5B2E' }}
                  >
                    Manage Farms
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AnalyticsIcon sx={{ mr: 1, color: '#2E5B2E' }} />
                    <Typography variant="h6">Analytics</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    View detailed analytics and performance metrics.
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ borderColor: '#2E5B2E', color: '#2E5B2E' }}
                  >
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default FarmersDashboard;

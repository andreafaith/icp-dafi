import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Info, LocalFlorist, Agriculture, AccountBalance } from '@mui/icons-material';
import DashboardNav from '../../components/navigation/DashboardNav';
import { mockFarmerAssets } from '../../mock/assetData';

const FarmerAssets = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: '#f5f5f5' 
      }}
    >
      <DashboardNav userType="farmer" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalFlorist color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Crop Assets</Typography>
                    </Box>
                    <Typography variant="h4">
                      ${mockFarmerAssets.crops.reduce((sum, crop) => sum + crop.estimatedValue, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Estimated Value
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Agriculture color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Equipment</Typography>
                    </Box>
                    <Typography variant="h4">
                      ${mockFarmerAssets.equipment.reduce((sum, equip) => sum + equip.value, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Value
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccountBalance color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Tokens</Typography>
                    </Box>
                    <Typography variant="h4">
                      ${mockFarmerAssets.tokens.reduce((sum, token) => sum + token.value, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Value
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Crops Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Crop Assets
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Planted Date</TableCell>
                      <TableCell>Expected Harvest</TableCell>
                      <TableCell align="right">Estimated Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockFarmerAssets.crops.map((crop) => (
                      <TableRow key={crop.id}>
                        <TableCell>{crop.name}</TableCell>
                        <TableCell>{crop.quantity}</TableCell>
                        <TableCell>
                          <Chip
                            label={crop.status}
                            color={crop.status === 'Growing' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{crop.location}</TableCell>
                        <TableCell>{new Date(crop.plantedDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(crop.expectedHarvest).toLocaleDateString()}</TableCell>
                        <TableCell align="right">${crop.estimatedValue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Equipment Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Equipment
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Purchase Date</TableCell>
                      <TableCell>Next Maintenance</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockFarmerAssets.equipment.map((equip) => (
                      <TableRow key={equip.id}>
                        <TableCell>{equip.name}</TableCell>
                        <TableCell>{equip.model}</TableCell>
                        <TableCell>
                          <Chip
                            label={equip.status}
                            color={equip.status === 'Operational' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(equip.purchaseDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(equip.maintenanceSchedule).toLocaleDateString()}</TableCell>
                        <TableCell align="right">${equip.value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Tokens Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tokens
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Symbol</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell>Last Updated</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockFarmerAssets.tokens.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell>{token.name}</TableCell>
                        <TableCell>{token.symbol}</TableCell>
                        <TableCell align="right">{token.balance.toLocaleString()}</TableCell>
                        <TableCell align="right">${token.value.toLocaleString()}</TableCell>
                        <TableCell>{new Date(token.lastUpdated).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FarmerAssets;

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn,
  WaterDrop,
  Agriculture,
  LocalFlorist,
  Settings,
  Spa,
} from '@mui/icons-material';
import DashboardNav from '../../components/navigation/DashboardNav';
import { mockFarmData } from '../../mock/farmData';
import { useRouter } from 'next/router';

const FarmerFarms = () => {
  const router = useRouter();

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'success';
    if (health >= 70) return 'warning';
    return 'error';
  };

  const handleManageFarm = (farmId: string) => {
    router.push(`/test/manage-farm/${farmId}`);
  };

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
          {/* Header with Add Farm Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1">
                My Farms
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => console.log('Add new farm')}
              >
                Add New Farm
              </Button>
            </Box>
          </Grid>

          {/* Farm Cards */}
          {mockFarmData.farms.map((farm) => (
            <Grid item xs={12} key={farm.id}>
              <Paper 
                sx={{ 
                  p: 3,
                  bgcolor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                }}
              >
                <Grid container spacing={3}>
                  {/* Farm Header */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h5" gutterBottom>
                          {farm.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                          <LocationOn sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {farm.location} • {farm.size}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleManageFarm(farm.id)}
                      >
                        Manage Farm
                      </Button>
                    </Box>
                  </Grid>

                  {/* Crops Overview */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalFlorist sx={{ mr: 1 }} />
                      Crops
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Crop</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Health</TableCell>
                            <TableCell>Harvest Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {farm.crops.map((crop, index) => (
                            <TableRow key={index}>
                              <TableCell>{crop.name}</TableCell>
                              <TableCell>
                                <Chip
                                  label={crop.status}
                                  color={crop.status === 'Growing' ? 'success' : 'warning'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={crop.health}
                                    color={getHealthColor(crop.health)}
                                    sx={{ width: 100, mr: 1 }}
                                  />
                                  <Typography variant="body2">
                                    {crop.health}%
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                {new Date(crop.expectedHarvest).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  {/* Equipment and Soil */}
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                      {/* Equipment */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <Agriculture sx={{ mr: 1 }} />
                          Equipment
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Model</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Next Maintenance</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {farm.equipment.map((equip, index) => (
                                <TableRow key={index}>
                                  <TableCell>{equip.name}</TableCell>
                                  <TableCell>{equip.model}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={equip.status}
                                      color={equip.status === 'Operational' ? 'success' : 'warning'}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {new Date(equip.nextMaintenance).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>

                      {/* Soil Health */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <Spa sx={{ mr: 1 }} />
                          Soil Health
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Chip
                            label={`Type: ${farm.soil.type}`}
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={`pH: ${farm.soil.ph}`}
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={`Organic: ${farm.soil.organic}`}
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={`Moisture: ${farm.soil.moisture}`}
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FarmerFarms;

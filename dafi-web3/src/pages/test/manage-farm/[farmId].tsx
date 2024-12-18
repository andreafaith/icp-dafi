import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Tab,
  Tabs,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  LocalFlorist,
  WaterDrop,
  Agriculture,
  Spa,
  Settings,
  ArrowBack,
  TrendingUp,
  Schedule,
  Warning,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import DashboardNav from '../../../components/navigation/DashboardNav';
import { mockFarmData } from '../../../mock/farmData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`farm-tabpanel-${index}`}
      aria-labelledby={`farm-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ManageFarm = () => {
  const router = useRouter();
  const { farmId } = router.query;
  const [tabValue, setTabValue] = useState(0);

  const farm = mockFarmData.farms.find(f => f.id === farmId);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'success';
    if (health >= 70) return 'warning';
    return 'error';
  };

  if (!farm) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Farm not found</Typography>
      </Box>
    );
  }

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
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/test/farmer-farms')}
            sx={{ mb: 2 }}
          >
            Back to Farms
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              {farm.name}
            </Typography>
            <Button variant="contained" startIcon={<Settings />}>
              Farm Settings
            </Button>
          </Box>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {farm.location} • {farm.size}
          </Typography>
        </Box>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalFlorist color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Active Crops</Typography>
                </Box>
                <Typography variant="h4">{farm.crops.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total crops under management
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WaterDrop color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Water Usage</Typography>
                </Box>
                <Typography variant="h4">
                  {farm.crops.reduce((sum, crop) => sum + parseInt(crop.irrigation.waterUsage), 0).toLocaleString()} gal/day
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total daily water consumption
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
                <Typography variant="h4">{farm.equipment.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Active equipment units
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Crops" />
            <Tab label="Equipment" />
            <Tab label="Soil Health" />
            <Tab label="Irrigation" />
          </Tabs>

          {/* Crops Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {farm.crops.map((crop, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="h6">{crop.name}</Typography>
                        <Typography color="text.secondary" gutterBottom>
                          {crop.area}
                        </Typography>
                        <Chip
                          label={crop.status}
                          color={crop.status === 'Growing' ? 'success' : 'warning'}
                          sx={{ mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          Crop Health
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress
                            variant="determinate"
                            value={crop.health}
                            color={getHealthColor(crop.health)}
                            sx={{ flexGrow: 1, mr: 1 }}
                          />
                          <Typography variant="body2">
                            {crop.health}%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          Key Dates
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2">
                            Planted: {new Date(crop.plantedDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            Expected Harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Equipment Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {farm.equipment.map((equip, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>{equip.name}</Typography>
                    <Typography color="text.secondary" gutterBottom>
                      Model: {equip.model}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={equip.status}
                        color={equip.status === 'Operational' ? 'success' : 'warning'}
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Last Maintenance: {new Date(equip.lastMaintenance).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Next Maintenance: {new Date(equip.nextMaintenance).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Soil Health Tab */}
          <TabPanel value={tabValue} index={2}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Soil Composition</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Soil Type
                      </Typography>
                      <Chip label={farm.soil.type} color="primary" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        pH Level
                      </Typography>
                      <Typography variant="h5">{farm.soil.ph}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Organic Matter
                      </Typography>
                      <Typography variant="h5">{farm.soil.organic}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Moisture Levels</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Current Moisture
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={parseInt(farm.soil.moisture)}
                        color="primary"
                        sx={{ flexGrow: 1, mr: 1 }}
                      />
                      <Typography variant="body2">
                        {farm.soil.moisture}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Last Tested: {new Date(farm.soil.lastTested).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </TabPanel>

          {/* Irrigation Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              {farm.crops.map((crop, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {crop.name} Irrigation
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={crop.irrigation.status}
                        color={crop.irrigation.status === 'Optimal' ? 'success' : 'warning'}
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="subtitle2" gutterBottom>
                        Water Usage
                      </Typography>
                      <Typography variant="h6">
                        {crop.irrigation.waterUsage}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                        Next Schedule
                      </Typography>
                      <Typography variant="body1">
                        {new Date(crop.irrigation.nextSchedule).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default ManageFarm;

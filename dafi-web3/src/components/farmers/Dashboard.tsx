import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Agriculture as AgricultureIcon,
  AccountBalance as AccountBalanceIcon,
  Assignment as AssignmentIcon,
  Eco as EcoIcon,
  WaterDrop as WaterDropIcon,
} from '@mui/icons-material';
import { FarmManagement } from './FarmManagement';
import { Analytics } from './Analytics';
import { Marketplace } from './Marketplace';
import { TokenizationCard } from './TokenizationCard';
import { WeatherForecast } from './WeatherForecast';
import { CropManagement } from './CropManagement';
import { ResourceOptimizer } from './ResourceOptimizer';
import { CarbonCredits } from './CarbonCredits';
import { SustainabilityMetrics } from './SustainabilityMetrics';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const stats = [
    {
      title: 'Total Farms',
      value: '2',
      icon: <AgricultureIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Total Investment',
      value: '$250,000',
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Carbon Credits',
      value: '1,500 tCO2e',
      icon: <EcoIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    },
    {
      title: 'Resource Efficiency',
      value: '85%',
      icon: <WaterDropIcon sx={{ fontSize: 40, color: 'info.main' }} />,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4">{stat.value}</Typography>
                    </Box>
                    {stat.icon}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Overview" />
        <Tab label="Farm Management" />
        <Tab label="Crop Management" />
        <Tab label="Weather" />
        <Tab label="Resources" />
        <Tab label="Sustainability" />
        <Tab label="Carbon Credits" />
        <Tab label="Marketplace" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <FarmManagement />
          </Grid>
          <Grid item xs={12} md={4}>
            <WeatherForecast />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <FarmManagement />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <CropManagement />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <WeatherForecast />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <ResourceOptimizer />
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <SustainabilityMetrics />
      </TabPanel>

      <TabPanel value={tabValue} index={6}>
        <CarbonCredits />
      </TabPanel>

      <TabPanel value={tabValue} index={7}>
        <Marketplace />
      </TabPanel>
    </Container>
  );
};

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
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { InvestmentOpportunities } from './InvestmentOpportunities';
import { YieldForecasts } from './YieldForecasts';
import { PortfolioDiversification } from './PortfolioDiversification';
import { ESGScoring } from './ESGScoring';
import { AutomatedStrategies } from './AutomatedStrategies';
import { SecondaryMarket } from './SecondaryMarket';
import { CarbonCredits } from '../farmers/CarbonCredits';
import { SustainabilityMetrics } from '../farmers/SustainabilityMetrics';

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
      id={`investor-tabpanel-${index}`}
      aria-labelledby={`investor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const InvestorDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const stats = [
    {
      title: 'Portfolio Value',
      value: '$1.2M',
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Active Investments',
      value: '8',
      icon: <AgricultureIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Carbon Credits',
      value: '2,500 tCO2e',
      icon: <EcoIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    },
    {
      title: 'ESG Score',
      value: '92/100',
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'info.main' }} />,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Investor Dashboard
        </Typography>
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Investment Opportunities" />
          <Tab label="Portfolio" />
          <Tab label="ESG Analysis" />
          <Tab label="Carbon Credits" />
          <Tab label="Sustainability" />
          <Tab label="Secondary Market" />
          <Tab label="Automated Strategies" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <InvestmentOpportunities />
          </Grid>
          <Grid item xs={12} md={4}>
            <YieldForecasts />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <InvestmentOpportunities />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <PortfolioDiversification />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <ESGScoring />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <CarbonCredits />
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <SustainabilityMetrics />
      </TabPanel>

      <TabPanel value={tabValue} index={6}>
        <SecondaryMarket />
      </TabPanel>

      <TabPanel value={tabValue} index={7}>
        <AutomatedStrategies />
      </TabPanel>
    </Container>
  );
};

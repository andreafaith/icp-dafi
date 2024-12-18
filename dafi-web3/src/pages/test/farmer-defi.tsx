import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import DashboardNav from '../../components/navigation/DashboardNav';
import TokenManagement from '../../components/defi/TokenManagement';
import LiquidityPool from '../../components/defi/LiquidityPool';
import Staking from '../../components/defi/Staking';
import Governance from '../../components/defi/Governance';
import DefiAnalytics from '../../components/defi/DefiAnalytics';

const FarmerDefi = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <TokenManagement />;
      case 1:
        return <LiquidityPool />;
      case 2:
        return <Staking />;
      case 3:
        return <Governance />;
      case 4:
        return <DefiAnalytics />;
      default:
        return <TokenManagement />;
    }
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: theme => theme.palette.grey[100],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <DashboardNav userType="farmer" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Farmer DeFi Dashboard
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Token Management" />
              <Tab label="Liquidity Pools" />
              <Tab label="Staking" />
              <Tab label="Governance" />
              <Tab label="Analytics" />
            </Tabs>
          </Box>

          {renderContent()}
        </Paper>
      </Container>
    </Box>
  );
};

export default FarmerDefi;

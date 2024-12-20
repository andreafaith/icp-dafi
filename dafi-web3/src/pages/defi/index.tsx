import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from '@mui/material';
import Layout from '../../components/layout/Layout';
import TokenManagement from '../../components/defi/TokenManagement';
import LiquidityPool from '../../components/defi/LiquidityPool';
import Staking from '../../components/defi/Staking';
import Governance from '../../components/defi/Governance';
import DefiAnalytics from '../../components/defi/DefiAnalytics';
import { useAuth } from '../../context/AuthContext';
import { withPageAuthRequired } from '../../utils/auth';

const DeFiPage: React.FC = () => {
  const { isAuthenticated, isLoading, error } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Layout>
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container>
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        </Container>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <Container>
          <Alert severity="warning" sx={{ mt: 4 }}>
            Please login to access DeFi features
          </Alert>
        </Container>
      </Layout>
    );
  }

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
    <Layout>
      <Container>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            DeFi Platform
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
        </Box>
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default DeFiPage;

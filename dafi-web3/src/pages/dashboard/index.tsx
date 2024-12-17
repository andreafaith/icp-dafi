import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useWalletContext } from '../../context/WalletContext';
import { withPageAuthRequired } from '../../utils/auth';
import Layout from '../../components/layout/Layout';
import { AssetList } from '../../components/assets/AssetList';
import { WalletButton } from '../../components/common/WalletButton';

// Mock data for development
const mockAssets = [
  {
    id: '1',
    name: 'Internet Computer',
    symbol: 'ICP',
    balance: '100.00',
    value: 4200.50,
    change24h: 5.23,
    icon: '/images/tokens/icp.png',
  },
  {
    id: '2',
    name: 'DAFI Token',
    symbol: 'DAFI',
    balance: '1000.00',
    value: 1500.75,
    change24h: -2.15,
    icon: '/images/tokens/dafi.png',
  },
];

const DashboardPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, error: authError } = useAuth();
  const { isConnected, isConnecting, error: walletError } = useWalletContext();

  if (authLoading || isConnecting) {
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

  if (authError || walletError) {
    return (
      <Layout>
        <Container>
          <Alert severity="error" sx={{ mt: 4 }}>
            {authError || walletError}
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
            Please login to view your dashboard
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box py={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Dashboard</Typography>
                <WalletButton />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  Your Assets
                </Typography>
                {isConnected ? (
                  <AssetList assets={mockAssets} />
                ) : (
                  <Alert severity="info">
                    Connect your wallet to view your assets
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export const getServerSideProps = withPageAuthRequired();

export default DashboardPage;

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
import Layout from '../../components/layout/Layout';
import { AssetList } from '../../components/assets/AssetList';
import { WalletButton } from '../../components/common/WalletButton';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, isInitialized } = useAuth();
  const { isConnected, isConnecting } = useWalletContext();

  useEffect(() => {
    if (isInitialized && !authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, authLoading, isAuthenticated, router]);

  // Show loading state while authentication is initializing
  if (!isInitialized || authLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, don't render anything (useEffect will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" component="h1" gutterBottom>
                  Welcome{user?.role ? ` ${user.role}` : ''}!
                </Typography>
                <WalletButton />
              </Box>
            </Paper>
          </Grid>

          {/* Status Alert */}
          <Grid item xs={12}>
            {!isConnected && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please connect your wallet to access all features
              </Alert>
            )}
          </Grid>

          {/* Assets List */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Your Assets
              </Typography>
              <AssetList assets={mockAssets} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default DashboardPage;

import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import {
  Container,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person as ProfileIcon,
  Notifications as NotificationsIcon,
  AccountBalanceWallet as WalletIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { NotificationSettings } from '../../components/profile/NotificationSettings';
import { WalletSettings } from '../../components/profile/WalletSettings';
import { ActivityHistory } from '../../components/profile/ActivityHistory';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { withPageAuthRequired } from '../../utils/auth';

// Mock activity data - Replace with actual data from your backend
const mockActivities = [
  {
    id: '1',
    type: 'investment',
    title: 'Investment in DAFI Pool',
    description: 'Successfully invested in the DAFI staking pool',
    amount: 1000,
    timestamp: new Date().toISOString(),
    status: 'completed',
    transactionHash: '0x123...',
  },
  {
    id: '2',
    type: 'staking',
    title: 'Staking Rewards',
    description: 'Received staking rewards',
    amount: 50,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    transactionHash: '0x456...',
  },
  // Add more activities...
];

const ProfilePage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, error: authError, principal } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useProfile(principal?.toString());
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (authLoading || profileLoading) {
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

  if (authError || profileError) {
    return (
      <Layout>
        <Container>
          <Alert severity="error" sx={{ mt: 4 }}>
            {authError || profileError}
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
            Please login to view your profile
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box py={4}>
          <Typography variant="h4" gutterBottom>
            Profile Settings
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab icon={<ProfileIcon />} label="Profile" />
              <Tab icon={<NotificationsIcon />} label="Notifications" />
              <Tab icon={<WalletIcon />} label="Wallet" />
              <Tab icon={<HistoryIcon />} label="Activity" />
            </Tabs>
          </Box>

          {activeTab === 0 && profile && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Typography>Name: {profile.name}</Typography>
                  <Typography>Email: {profile.email}</Typography>
                  <Typography>Member since: {new Date(profile.createdAt).toLocaleDateString()}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Statistics
                  </Typography>
                  <Typography>Total Investments: ${profile.stats.totalInvestments}</Typography>
                  <Typography>Total Returns: ${profile.stats.totalReturns}</Typography>
                  <Typography>Active Pools: {profile.stats.activePools}</Typography>
                  <Typography>Voting Power: {profile.stats.votingPower}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && <NotificationSettings />}
          {activeTab === 2 && <WalletSettings />}
          {activeTab === 3 && <ActivityHistory activities={mockActivities} />}
        </Box>
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default ProfilePage;

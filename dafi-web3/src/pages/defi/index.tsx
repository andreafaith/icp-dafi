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
import {
  AccountBalance as StakingIcon,
  HowToVote as GovernanceIcon,
  ShowChart as MarketsIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { StakingPanel } from '../../components/defi/StakingPanel';
import { GovernancePanel } from '../../components/defi/GovernancePanel';
import { MarketPanel } from '../../components/defi/MarketPanel';
import { useAuth } from '../../context/AuthContext';
import { withPageAuthRequired } from '../../utils/auth';

// Mock data - Replace with actual data from your backend
const mockStakingPools = [
  {
    id: '1',
    name: 'DAFI Staking Pool',
    token: 'DAFI',
    apr: 12.5,
    tvl: 1000000,
    stakedAmount: 5000,
    rewards: 250,
    lockPeriod: 30,
  },
  // Add more pools...
];

const mockProposals = [
  {
    id: '1',
    title: 'Increase Staking Rewards',
    description: 'Proposal to increase staking rewards by 2% for all pools',
    proposer: {
      address: '0x123...',
      name: 'John Doe',
    },
    status: 'active',
    votingPower: 100000,
    votesFor: 75000,
    votesAgainst: 25000,
    endTime: '2024-12-31T00:00:00Z',
    hasVoted: false,
  },
  // Add more proposals...
];

const mockMarkets = [
  {
    id: '1',
    name: 'DAFI Token',
    symbol: 'DAFI',
    price: 1.25,
    change24h: 5.5,
    volume24h: 1500000,
    tvl: 10000000,
    apy: 15.5,
    isWatchlisted: true,
  },
  // Add more markets...
];

const DeFiPage: React.FC = () => {
  const { isAuthenticated, isLoading, error, principal } = useAuth();
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

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box py={4}>
          <Typography variant="h4" gutterBottom>
            DeFi Dashboard
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab icon={<StakingIcon />} label="Staking" />
              <Tab icon={<GovernanceIcon />} label="Governance" />
              <Tab icon={<MarketsIcon />} label="Markets" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <StakingPanel
              pools={mockStakingPools}
              onStake={(poolId) => console.log('Stake in pool:', poolId)}
              onUnstake={(poolId) => console.log('Unstake from pool:', poolId)}
              onClaimRewards={(poolId) => console.log('Claim rewards from pool:', poolId)}
            />
          )}

          {activeTab === 1 && (
            <GovernancePanel
              proposals={mockProposals}
              userVotingPower={10000}
              onVote={(proposalId, support) =>
                console.log('Vote on proposal:', proposalId, support)
              }
              onCreateProposal={() => console.log('Create new proposal')}
            />
          )}

          {activeTab === 2 && (
            <MarketPanel
              markets={mockMarkets}
              onToggleWatchlist={(marketId) =>
                console.log('Toggle watchlist for market:', marketId)
              }
              onSelectMarket={(marketId) => console.log('Select market:', marketId)}
            />
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default DeFiPage;

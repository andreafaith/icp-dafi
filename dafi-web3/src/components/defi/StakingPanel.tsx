import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { formatCurrency, formatPercentage } from '../../utils/format';

interface StakingPool {
  id: string;
  name: string;
  token: string;
  apr: number;
  tvl: number;
  stakedAmount: number;
  rewards: number;
  lockPeriod: number;
}

interface StakingPanelProps {
  pools: StakingPool[];
  onStake: (poolId: string) => void;
  onUnstake: (poolId: string) => void;
  onClaimRewards: (poolId: string) => void;
}

export const StakingPanel: React.FC<StakingPanelProps> = ({
  pools,
  onStake,
  onUnstake,
  onClaimRewards,
}) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Staking Pools</Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => onStake('')}
          >
            Stake New Assets
          </Button>
        </Box>

        <Grid container spacing={3}>
          {pools.map((pool) => (
            <Grid item xs={12} key={pool.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="h6">{pool.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {pool.token}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={`APR ${formatPercentage(pool.apr)}`}
                        color="primary"
                        variant="outlined"
                      />
                      <Tooltip title="Lock period and rewards info">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Total Value Locked
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(pool.tvl)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Your Stake
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(pool.stakedAmount)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="textSecondary">
                        Unclaimed Rewards
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {formatCurrency(pool.rewards)}
                      </Typography>
                    </Box>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={(pool.stakedAmount / pool.tvl) * 100}
                    sx={{ mb: 2 }}
                  />

                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => onStake(pool.id)}
                      size="small"
                    >
                      Stake
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RemoveIcon />}
                      onClick={() => onUnstake(pool.id)}
                      size="small"
                    >
                      Unstake
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => onClaimRewards(pool.id)}
                      size="small"
                      disabled={pool.rewards <= 0}
                    >
                      Claim Rewards
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

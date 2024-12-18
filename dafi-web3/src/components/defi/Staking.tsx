import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { LocalAtm, Lock, LockOpen } from '@mui/icons-material';

interface StakingPoolProps {
  name: string;
  apr: number;
  lockPeriod: number;
  minStake: number;
  totalStaked: number;
  yourStake: number;
  rewards: number;
}

const Staking: React.FC = () => {
  const mockPools: StakingPoolProps[] = [
    {
      name: 'DAFI Flexible',
      apr: 12,
      lockPeriod: 0,
      minStake: 100,
      totalStaked: 500000,
      yourStake: 1000,
      rewards: 25,
    },
    {
      name: 'DAFI 30 Days',
      apr: 25,
      lockPeriod: 30,
      minStake: 500,
      totalStaked: 1000000,
      yourStake: 2500,
      rewards: 125,
    },
    {
      name: 'DAFI 90 Days',
      apr: 40,
      lockPeriod: 90,
      minStake: 1000,
      totalStaked: 2000000,
      yourStake: 5000,
      rewards: 400,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocalAtm sx={{ mr: 1 }} />
          <Typography variant="h6">Staking</Typography>
        </Box>

        <Grid container spacing={3}>
          {mockPools.map((pool) => (
            <Grid item xs={12} md={4} key={pool.name}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{pool.name}</Typography>
                    <Chip
                      icon={pool.lockPeriod > 0 ? <Lock /> : <LockOpen />}
                      label={`${pool.apr}% APR`}
                      color="primary"
                    />
                  </Box>

                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Lock Period"
                        secondary={pool.lockPeriod === 0 ? 'Flexible' : `${pool.lockPeriod} Days`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Minimum Stake"
                        secondary={`${pool.minStake} DAFI`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Total Staked"
                        secondary={`${pool.totalStaked.toLocaleString()} DAFI`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Your Stake"
                        secondary={`${pool.yourStake.toLocaleString()} DAFI`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Pending Rewards"
                        secondary={`${pool.rewards.toLocaleString()} DAFI`}
                      />
                    </ListItem>
                  </List>

                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Stake Amount"
                      type="number"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Stake
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                      >
                        Unstake
                      </Button>
                    </Box>
                    <Button
                      variant="text"
                      color="primary"
                      fullWidth
                      sx={{ mt: 1 }}
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

export default Staking;

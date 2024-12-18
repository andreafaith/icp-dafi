import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { Pool, Add, Remove } from '@mui/icons-material';

interface PoolProps {
  pair: string;
  tvl: number;
  apr: number;
  yourLiquidity: number;
  rewards: number;
}

const LiquidityPool: React.FC = () => {
  const mockPools: PoolProps[] = [
    { pair: 'DAFI-USDC', tvl: 1000000, apr: 25.5, yourLiquidity: 5000, rewards: 120 },
    { pair: 'DAFI-ETH', tvl: 500000, apr: 35.2, yourLiquidity: 2500, rewards: 85 },
    { pair: 'ETH-USDC', tvl: 2000000, apr: 15.8, yourLiquidity: 7500, rewards: 200 },
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Pool sx={{ mr: 1 }} />
          <Typography variant="h6">Liquidity Pools</Typography>
        </Box>

        <Grid container spacing={3}>
          {mockPools.map((pool) => (
            <Grid item xs={12} md={4} key={pool.pair}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{pool.pair}</Typography>
                    <Chip label={`${pool.apr}% APR`} color="primary" />
                  </Box>

                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Total Value Locked"
                        secondary={`$${pool.tvl.toLocaleString()}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Your Liquidity"
                        secondary={`$${pool.yourLiquidity.toLocaleString()}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Pending Rewards"
                        secondary={`$${pool.rewards.toLocaleString()}`}
                      />
                    </ListItem>
                  </List>

                  <LinearProgress
                    variant="determinate"
                    value={(pool.yourLiquidity / pool.tvl) * 100}
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      fullWidth
                    >
                      Add
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Remove />}
                      fullWidth
                    >
                      Remove
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

export default LiquidityPool;

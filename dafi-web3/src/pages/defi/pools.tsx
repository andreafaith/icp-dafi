import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import Layout from '@/components/layouts/Layout';

interface Pool {
  name: string;
  token0: string;
  token1: string;
  tvl: string;
  apr: number;
  yourLiquidity: string;
  yourShare: number;
}

const LiquidityPools = () => {
  const [tab, setTab] = useState(0);
  const [addLiquidityOpen, setAddLiquidityOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);

  // Mock pool data
  const pools: Pool[] = [
    {
      name: 'DAFI-ICP',
      token0: 'DAFI',
      token1: 'ICP',
      tvl: '$1,000,000',
      apr: 25.5,
      yourLiquidity: '$10,000',
      yourShare: 1,
    },
    {
      name: 'DAFI-BTC',
      token0: 'DAFI',
      token1: 'BTC',
      tvl: '$2,500,000',
      apr: 18.2,
      yourLiquidity: '$25,000',
      yourShare: 1,
    },
    {
      name: 'ICP-BTC',
      token0: 'ICP',
      token1: 'BTC',
      tvl: '$5,000,000',
      apr: 15.8,
      yourLiquidity: '$50,000',
      yourShare: 1,
    },
  ];

  const handleAddLiquidity = (pool: Pool) => {
    setSelectedPool(pool);
    setAddLiquidityOpen(true);
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Overview */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Value Locked
                </Typography>
                <Typography variant="h4">
                  $8,500,000
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Total Liquidity
                </Typography>
                <Typography variant="h4">
                  $85,000
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  24h Volume
                </Typography>
                <Typography variant="h4">
                  $250,000
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pools List */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
              <Tab label="All Pools" />
              <Tab label="Your Pools" />
            </Tabs>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pool</TableCell>
                  <TableCell align="right">TVL</TableCell>
                  <TableCell align="right">APR</TableCell>
                  <TableCell align="right">Your Liquidity</TableCell>
                  <TableCell align="right">Your Share</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pools.map((pool) => (
                  <TableRow key={pool.name}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle2">{pool.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{pool.tvl}</TableCell>
                    <TableCell align="right">
                      <Typography color="success.main">
                        {pool.apr}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{pool.yourLiquidity}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgress
                          variant="determinate"
                          value={pool.yourShare}
                          sx={{ flexGrow: 1, mr: 1 }}
                        />
                        <Typography variant="body2">
                          {pool.yourShare}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddLiquidity(pool)}
                      >
                        Add
                      </Button>
                      <Button
                        size="small"
                        startIcon={<RemoveIcon />}
                        sx={{ ml: 1 }}
                      >
                        Remove
                      </Button>
                      <Button
                        size="small"
                        startIcon={<AnalyticsIcon />}
                        sx={{ ml: 1 }}
                      >
                        Analytics
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Add Liquidity Dialog */}
        <Dialog
          open={addLiquidityOpen}
          onClose={() => setAddLiquidityOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Add Liquidity to {selectedPool?.name}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                label={selectedPool?.token0}
                fullWidth
                margin="normal"
                type="number"
              />
              <TextField
                label={selectedPool?.token1}
                fullWidth
                margin="normal"
                type="number"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddLiquidityOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => setAddLiquidityOpen(false)}
            >
              Add Liquidity
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default LiquidityPools;

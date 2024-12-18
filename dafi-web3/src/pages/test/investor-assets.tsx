import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import { AccountBalance, Savings, MonetizationOn } from '@mui/icons-material';
import DashboardNav from '../../components/navigation/DashboardNav';
import { mockInvestorAssets } from '../../mock/assetData';

const InvestorAssets = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DashboardNav userType="investor" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MonetizationOn color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Total Investments</Typography>
                    </Box>
                    <Typography variant="h4">
                      ${mockInvestorAssets.investments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Investments
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccountBalance color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Token Holdings</Typography>
                    </Box>
                    <Typography variant="h4">
                      ${mockInvestorAssets.tokens.reduce((sum, token) => sum + token.value, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Value
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Savings color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Staking Positions</Typography>
                    </Box>
                    <Typography variant="h4">
                      ${mockInvestorAssets.stakingPositions.reduce((sum, pos) => sum + pos.amount, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Staked
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Investments Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Active Investments
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Farm Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Expected Return</TableCell>
                      <TableCell>Maturity Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockInvestorAssets.investments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell>{investment.farmName}</TableCell>
                        <TableCell>{investment.type}</TableCell>
                        <TableCell align="right">${investment.amount.toLocaleString()}</TableCell>
                        <TableCell align="right">{investment.expectedReturn}%</TableCell>
                        <TableCell>{new Date(investment.maturityDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={investment.status}
                            color={investment.status === 'Active' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Tokens Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Token Holdings
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Symbol</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell>Last Updated</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockInvestorAssets.tokens.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell>{token.name}</TableCell>
                        <TableCell>{token.symbol}</TableCell>
                        <TableCell align="right">{token.balance.toLocaleString()}</TableCell>
                        <TableCell align="right">${token.value.toLocaleString()}</TableCell>
                        <TableCell>{new Date(token.lastUpdated).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Staking Positions Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Staking Positions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Pool</TableCell>
                      <TableCell align="right">Amount Staked</TableCell>
                      <TableCell align="right">APR</TableCell>
                      <TableCell align="right">Rewards</TableCell>
                      <TableCell>Lock Period</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockInvestorAssets.stakingPositions.map((position) => (
                      <TableRow key={position.id}>
                        <TableCell>{position.pool}</TableCell>
                        <TableCell align="right">${position.amount.toLocaleString()}</TableCell>
                        <TableCell align="right">{position.apr}%</TableCell>
                        <TableCell align="right">${position.rewards.toLocaleString()}</TableCell>
                        <TableCell>{position.lockPeriod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InvestorAssets;

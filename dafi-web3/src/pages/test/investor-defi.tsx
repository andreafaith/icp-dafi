import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  AccountBalance,
  SwapHoriz,
  Timeline,
  MonetizationOn,
} from '@mui/icons-material';
import DashboardNav from '../../components/navigation/DashboardNav';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const liquidityData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const yieldData = [
  { name: 'Pool A', value: 400 },
  { name: 'Pool B', value: 300 },
  { name: 'Pool C', value: 300 },
  { name: 'Pool D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const InvestorDefi = () => {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: theme => theme.palette.grey[100],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <DashboardNav userType="investor" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* DeFi Overview */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                DeFi Dashboard
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Value Locked
                      </Typography>
                      <Typography variant="h4">$1.2M</Typography>
                      <Typography variant="body2" color="success.main">
                        +15.3% ↑
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        24h Trading Volume
                      </Typography>
                      <Typography variant="h4">$350K</Typography>
                      <Typography variant="body2" color="error.main">
                        -5.2% ↓
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Your Liquidity
                      </Typography>
                      <Typography variant="h4">$50K</Typography>
                      <Typography variant="body2" color="success.main">
                        +8.7% ↑
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Yield Farming APY
                      </Typography>
                      <Typography variant="h4">12.5%</Typography>
                      <Chip label="High Yield" color="success" size="small" />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Liquidity Pools */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Liquidity Pool Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={liquidityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    startIcon={<SwapHoriz />}
                    fullWidth
                  >
                    Add Liquidity
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    startIcon={<MonetizationOn />}
                    fullWidth
                  >
                    Remove Liquidity
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Yield Farming */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Yield Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={yieldData}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {yieldData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Total Yield Earned"
                    secondary="$2,450 (This Month)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Active Farming Positions"
                    secondary="4 Pools"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Farming Opportunities */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Farming Opportunities
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        Stable Farm Pool
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        USDC-USDT LP
                      </Typography>
                      <Typography variant="h4">8.5% APY</Typography>
                      <LinearProgress variant="determinate" value={75} sx={{ mt: 2 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Pool Capacity: 75%
                      </Typography>
                      <Button variant="contained" sx={{ mt: 2 }} fullWidth>
                        Farm Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        High Yield Pool
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        ETH-DAFI LP
                      </Typography>
                      <Typography variant="h4">15.2% APY</Typography>
                      <LinearProgress variant="determinate" value={90} sx={{ mt: 2 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Pool Capacity: 90%
                      </Typography>
                      <Button variant="contained" sx={{ mt: 2 }} fullWidth>
                        Farm Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        Innovation Pool
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        BTC-DAFI LP
                      </Typography>
                      <Typography variant="h4">12.8% APY</Typography>
                      <LinearProgress variant="determinate" value={45} sx={{ mt: 2 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Pool Capacity: 45%
                      </Typography>
                      <Button variant="contained" sx={{ mt: 2 }} fullWidth>
                        Farm Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InvestorDefi;

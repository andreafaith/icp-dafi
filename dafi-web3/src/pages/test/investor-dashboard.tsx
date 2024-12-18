import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  Assessment,
  SwapHoriz,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { mockInvestorData } from '../../mock/dashboardData';

const StatCard = ({ title, value, icon, suffix = '' }: { title: string; value: string | number; icon: React.ReactNode; suffix?: string }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {typeof value === 'number' && !suffix ? '$' : ''}{value}{suffix}
      </Typography>
    </CardContent>
  </Card>
);

const OpportunityCard = ({ opportunity }: { opportunity: any }) => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">{opportunity.projectName}</Typography>
      <Chip 
        label={opportunity.riskLevel} 
        color={opportunity.riskLevel === 'Low' ? 'success' : 'warning'}
      />
    </Box>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      by {opportunity.farmerName} • {opportunity.location}
    </Typography>
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2">Funding Progress</Typography>
        <Typography variant="body2">
          ${opportunity.funded.toLocaleString()} / ${opportunity.requiredFunding.toLocaleString()}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={(opportunity.funded / opportunity.requiredFunding) * 100} 
      />
    </Box>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="body2" color="text.secondary">Expected Return</Typography>
        <Typography variant="h6" color="success.main">{opportunity.expectedReturn}%</Typography>
      </Box>
      <Button variant="contained" color="primary">
        Invest Now
      </Button>
    </Box>
  </Paper>
);

const InvestmentCard = ({ investment }: { investment: any }) => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6" gutterBottom>
      {investment.projectName}
    </Typography>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      by {investment.farmerName}
    </Typography>
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2">Progress</Typography>
        <Typography variant="body2">{investment.progress}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={investment.progress} />
    </Box>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="body2" color="text.secondary">Invested Amount</Typography>
        <Typography variant="h6">${investment.investedAmount.toLocaleString()}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body2" color="text.secondary">Expected Return</Typography>
        <Typography variant="h6" color="success.main">{investment.expectedReturn}%</Typography>
      </Grid>
    </Grid>
  </Paper>
);

const InvestorDashboardTest = () => {
  const { portfolio, investmentOpportunities, activeInvestments, recentTransactions } = mockInvestorData;

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Portfolio Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Invested"
              value={portfolio.totalInvested}
              icon={<AccountBalance color="primary" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Investments"
              value={portfolio.activeInvestments}
              icon={<Assessment color="primary" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Average Return"
              value={portfolio.averageReturn}
              icon={<TrendingUp color="primary" />}
              suffix="%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Returns"
              value={portfolio.totalReturn}
              icon={<SwapHoriz color="primary" />}
            />
          </Grid>

          {/* Investment Opportunities */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Investment Opportunities
              </Typography>
              {investmentOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </Paper>
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <List>
                {recentTransactions.map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography>{transaction.type}</Typography>
                            <Typography color={transaction.type === 'Return' ? 'success.main' : 'primary'}>
                              ${transaction.amount.toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={`${transaction.date} • ${transaction.project}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Active Investments */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Active Investments
              </Typography>
              <Grid container spacing={3}>
                {activeInvestments.map((investment) => (
                  <Grid item xs={12} md={6} key={investment.id}>
                    <InvestmentCard investment={investment} />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default InvestorDashboardTest;

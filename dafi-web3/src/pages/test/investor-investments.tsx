import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Chip,
  useTheme,
} from '@mui/material';
import DashboardNav from '../../components/navigation/DashboardNav';

const mockInvestments = [
  {
    id: 1,
    projectName: "Green Valley Farm",
    description: "Sustainable farming project focusing on organic vegetables",
    amountInvested: 50000,
    targetAmount: 100000,
    status: "Active",
    type: "Organic Farming"
  },
  {
    id: 2,
    projectName: "Sunrise Orchards",
    description: "Apple and pear orchard expansion project",
    amountInvested: 75000,
    targetAmount: 150000,
    status: "Active",
    type: "Fruit Farming"
  },
  {
    id: 3,
    projectName: "Blue Creek Aquaculture",
    description: "Sustainable fish farming initiative",
    amountInvested: 30000,
    targetAmount: 80000,
    status: "Pending",
    type: "Aquaculture"
  }
];

const InvestmentCard = ({ investment }: any) => {
  const theme = useTheme();
  const progress = (investment.amountInvested / investment.targetAmount) * 100;

  return (
    <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' } }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {investment.projectName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {investment.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Progress ({progress.toFixed(1)}%)
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              mt: 1, 
              mb: 2,
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }} 
          />
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Invested
            </Typography>
            <Typography variant="h6" color="primary">
              ${investment.amountInvested?.toLocaleString() || '0'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Target
            </Typography>
            <Typography variant="h6">
              ${investment.targetAmount?.toLocaleString() || '0'}
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Chip 
            label={investment.status} 
            color={investment.status === 'Active' ? 'success' : 'default'}
            size="small"
          />
          <Chip 
            label={investment.type} 
            variant="outlined"
            size="small"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" fullWidth>
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const InvestorInvestments = () => {
  const theme = useTheme();

  return (
    <>
      <DashboardNav userType="investor" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.grey[50],
          minHeight: '100vh',
          pt: 2,
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  My Investments
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Track and manage your agricultural investments
                </Typography>
              </Box>
            </Grid>

            {mockInvestments.map((investment) => (
              <Grid item xs={12} md={6} lg={4} key={investment.id}>
                <InvestmentCard investment={investment} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default InvestorInvestments;

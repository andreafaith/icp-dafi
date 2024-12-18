import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
} from '@mui/material';
import {
  Agriculture as FarmerIcon,
  AccountBalance as InvestorIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'farmer' | 'investor') => {
    localStorage.setItem('userRole', role);
    navigate(role === 'farmer' ? '/farmer/dashboard' : '/investor/dashboard');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to DAFI
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Select your role to continue
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  cursor: 'pointer',
                },
              }}
              onClick={() => handleRoleSelect('farmer')}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4,
                }}
              >
                <FarmerIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Farmer
                </Typography>
                <Typography color="textSecondary" paragraph>
                  Manage your farm, track crops, and access financial resources
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<FarmerIcon />}
                  sx={{ mt: 2 }}
                >
                  Continue as Farmer
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  cursor: 'pointer',
                },
              }}
              onClick={() => handleRoleSelect('investor')}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4,
                }}
              >
                <InvestorIcon
                  sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  Investor
                </Typography>
                <Typography color="textSecondary" paragraph>
                  Discover investment opportunities and manage your portfolio
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<InvestorIcon />}
                  sx={{ mt: 2 }}
                >
                  Continue as Investor
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

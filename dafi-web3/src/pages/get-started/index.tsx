import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { useRouter } from 'next/router';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Layout from '../../components/Layout';

const GetStarted = () => {
  const router = useRouter();

  const roles = [
    {
      title: 'I am a Farmer',
      description: 'List your agricultural assets, get funding, and grow your farming business.',
      icon: <AgricultureIcon sx={{ fontSize: 60, color: '#132A13' }} />,
      path: '/register?role=farmer',
    },
    {
      title: 'I am an Investor',
      description: 'Invest in verified agricultural projects and track your investments.',
      icon: <AccountBalanceIcon sx={{ fontSize: 60, color: '#132A13' }} />,
      path: '/register?role=investor',
    },
  ];

  return (
    <Layout>
      <Box sx={{ py: 8, minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{ color: '#132A13', fontWeight: 'bold', mb: 3 }}
            >
              Get Started with DAFI
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: '#132A13', mb: 4, maxWidth: '800px', mx: 'auto' }}
            >
              Choose your role to begin your journey in agricultural investment
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {roles.map((role, index) => (
              <Grid item xs={12} sm={6} md={5} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    height: '100%',
                    bgcolor: 'rgba(19, 42, 19, 0.05)',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      bgcolor: 'rgba(19, 42, 19, 0.1)',
                    },
                  }}
                  onClick={() => router.push(role.path)}
                >
                  <Box sx={{ mb: 3 }}>{role.icon}</Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ color: '#132A13', mb: 2, fontWeight: 'bold' }}
                  >
                    {role.title}
                  </Typography>
                  <Typography sx={{ color: '#132A13', mb: 4 }}>
                    {role.description}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: '#132A13',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: '#1a3a1a',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography sx={{ color: '#132A13' }}>
              Already have an account?{' '}
              <Button
                onClick={() => router.push('/login')}
                sx={{ color: '#132A13', textDecoration: 'underline' }}
              >
                Log in here
              </Button>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default GetStarted;

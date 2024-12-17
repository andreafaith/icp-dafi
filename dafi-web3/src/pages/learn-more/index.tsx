import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { useRouter } from 'next/router';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Layout from '../../components/Layout';

const LearnMore = () => {
  const router = useRouter();

  const features = [
    {
      title: 'Secure Blockchain Technology',
      description: 'Built on Internet Computer Protocol (ICP) for maximum security and transparency in agricultural investments.',
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#132A13' }} />,
    },
    {
      title: 'Smart Investment Tracking',
      description: 'Real-time monitoring of investments and automated distribution of returns through smart contracts.',
      icon: <ShowChartIcon sx={{ fontSize: 40, color: '#132A13' }} />,
    },
    {
      title: 'Farmer Empowerment',
      description: 'Enabling farmers to tokenize their agricultural assets and access global investment opportunities.',
      icon: <AgricultureIcon sx={{ fontSize: 40, color: '#132A13' }} />,
    },
    {
      title: 'Investor Opportunities',
      description: 'Diverse portfolio of verified agricultural projects with transparent risk assessments and returns.',
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: '#132A13' }} />,
    },
  ];

  return (
    <Layout>
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{ color: '#132A13', fontWeight: 'bold', mb: 3 }}
            >
              Revolutionizing Agricultural Investment
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: '#132A13', mb: 4, maxWidth: '800px', mx: 'auto' }}
            >
              DAFI Platform connects farmers with investors through blockchain technology,
              creating a transparent and efficient agricultural investment ecosystem.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/get-started')}
              sx={{
                bgcolor: '#132A13',
                color: 'white',
                px: 4,
                py: 2,
                '&:hover': {
                  bgcolor: '#1a3a1a',
                },
              }}
            >
              Get Started Now
            </Button>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    bgcolor: 'rgba(19, 42, 19, 0.05)',
                    borderRadius: 2,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ color: '#132A13', mb: 2, fontWeight: 'bold' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: '#132A13' }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Benefits Section */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ color: '#132A13', fontWeight: 'bold', mb: 4 }}
            >
              Why Choose DAFI?
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ color: '#132A13', fontWeight: 'bold', mb: 2 }}>
                  For Farmers
                </Typography>
                <Typography sx={{ color: '#132A13' }}>
                  Access global investment opportunities, tokenize your agricultural assets,
                  and grow your farming business with secure blockchain technology.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ color: '#132A13', fontWeight: 'bold', mb: 2 }}>
                  For Investors
                </Typography>
                <Typography sx={{ color: '#132A13' }}>
                  Invest in verified agricultural projects, track your investments in real-time,
                  and receive automated returns through smart contracts.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ color: '#132A13', fontWeight: 'bold', mb: 2 }}>
                  For the Future
                </Typography>
                <Typography sx={{ color: '#132A13' }}>
                  Support sustainable agriculture, contribute to food security,
                  and be part of the future of agricultural investment.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default LearnMore;

import React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const InvestorsPage = () => {
  const router = useRouter();
  const theme = useTheme();

  const benefits = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'High Yield Potential',
      description: 'Access lucrative agricultural investment opportunities with competitive returns.',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      title: 'Verified Projects',
      description: 'Invest in thoroughly vetted and monitored agricultural projects.',
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
      title: 'Portfolio Diversification',
      description: 'Diversify your investment portfolio with real agricultural assets.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
          color: 'white',
          py: 12,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h2" gutterBottom>
                  Invest in Agriculture
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Discover sustainable investment opportunities in the agricultural sector through blockchain technology.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => router.push('/auth/register')}
                      sx={{
                        backgroundColor: 'white',
                        color: theme.palette.secondary.main,
                        '&:hover': {
                          backgroundColor: alpha('white', 0.9),
                        },
                      }}
                    >
                      Start Investing
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => router.push('/auth/login')}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: alpha('white', 0.1),
                        },
                      }}
                    >
                      Sign In
                    </Button>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="/investor-hero.png"
                  alt="Investment"
                  sx={{
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: theme.shadows[20],
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ mb: 6, color: theme.palette.secondary.main }}
        >
          Benefits for Investors
        </Typography>
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease-in-out',
                      boxShadow: theme.shadows[10],
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                          borderRadius: '50%',
                          p: 2,
                          mr: 2,
                        }}
                      >
                        {benefit.icon}
                      </Box>
                      <Typography variant="h6">{benefit.title}</Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Investment Stats Section */}
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.secondary.main, 0.05),
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h3" color="primary" gutterBottom>
                  15%+
                </Typography>
                <Typography variant="h6">Average Annual Returns</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h3" color="primary" gutterBottom>
                  100+
                </Typography>
                <Typography variant="h6">Verified Farms</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h3" color="primary" gutterBottom>
                  $10M+
                </Typography>
                <Typography variant="h6">Total Investment Volume</Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Card
            sx={{
              textAlign: 'center',
              p: 6,
              backgroundColor: theme.palette.secondary.main,
              color: 'white',
              boxShadow: theme.shadows[20],
            }}
          >
            <Typography variant="h4" gutterBottom>
              Ready to Start Investing?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
              Join DAFI today and start building your agricultural investment portfolio.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/auth/register')}
              sx={{
                backgroundColor: 'white',
                color: theme.palette.secondary.main,
                '&:hover': {
                  backgroundColor: alpha('white', 0.9),
                },
              }}
            >
              Get Started
            </Button>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default InvestorsPage;

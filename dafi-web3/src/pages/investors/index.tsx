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
  Paper,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';

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

  const features = [
    {
      icon: <ShowChartIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Analytics',
      description: 'Track your investments with advanced analytics and real-time monitoring tools.',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Portfolio',
      description: 'Optimize your agricultural investments with AI-powered portfolio management.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Transactions',
      description: 'Execute trades securely with blockchain-powered smart contracts.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F6F8F3' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
          color: '#ffffff',
          pt: { xs: 20, md: 24 },
          pb: { xs: 12, md: 16 },
          position: 'relative',
          overflow: 'hidden',
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
                <Typography 
                  variant="h2" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  Invest in Sustainable Agriculture
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    lineHeight: 1.6,
                  }}
                >
                  Discover high-yield agricultural investment opportunities backed by blockchain technology and smart contracts.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => router.push('/auth/register')}
                      sx={{
                        backgroundColor: '#ffffff',
                        color: theme.palette.secondary.main,
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: alpha('#ffffff', 0.9),
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
                      onClick={() => router.push('/about')}
                      sx={{
                        borderColor: '#ffffff',
                        color: '#ffffff',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#ffffff',
                          backgroundColor: alpha('#ffffff', 0.1),
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  component="img"
                  src="/images/investment-hero.jpg"
                  alt="Agricultural Investment"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
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
          sx={{ 
            mb: 6,
            color: theme.palette.secondary.main,
            fontWeight: 700,
          }}
        >
          Investment Benefits
        </Typography>
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 24px ${alpha(theme.palette.secondary.main, 0.1)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                      borderRadius: '50%',
                      p: 2,
                      mb: 2,
                      color: theme.palette.secondary.main,
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <CardContent>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      {benefit.title}
                    </Typography>
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

      {/* Features Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.03), py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ 
              mb: 6,
              color: theme.palette.secondary.main,
              fontWeight: 700,
            }}
          >
            Smart Investment Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 4,
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 24px ${alpha(theme.palette.secondary.main, 0.1)}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: theme.palette.primary.main,
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Investment Stats */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: alpha(theme.palette.secondary.main, 0.05),
                  borderRadius: 4,
                }}
              >
                <Typography variant="h3" color="secondary.main" gutterBottom fontWeight="bold">
                  15%+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Average Annual Returns
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: alpha(theme.palette.secondary.main, 0.05),
                  borderRadius: 4,
                }}
              >
                <Typography variant="h3" color="secondary.main" gutterBottom fontWeight="bold">
                  100+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Verified Projects
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: alpha(theme.palette.secondary.main, 0.05),
                  borderRadius: 4,
                }}
              >
                <Typography variant="h3" color="secondary.main" gutterBottom fontWeight="bold">
                  $10M+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Total Investments
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              color: '#ffffff',
              borderRadius: 4,
            }}
          >
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Start Growing Your Portfolio
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join DAFI today and discover the future of agricultural investments.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/auth/register')}
              sx={{
                backgroundColor: '#ffffff',
                color: theme.palette.primary.main,
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.9),
                },
              }}
            >
              Start Investing
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default InvestorsPage;

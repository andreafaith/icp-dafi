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
} from '@mui/material';
import { motion } from 'framer-motion';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { alpha } from '@mui/material/styles';

const FarmersPage = () => {
  const router = useRouter();
  const theme = useTheme();

  const benefits = [
    {
      icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />,
      title: 'Access to Capital',
      description: 'Get funding for your farm operations through tokenization and smart contracts.',
    },
    {
      icon: <BarChartIcon sx={{ fontSize: 40 }} />,
      title: 'Growth Opportunities',
      description: 'Scale your farming operations with sustainable investment solutions.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Risk Protection',
      description: 'Secure your farm against weather risks with our derivatives platform.',
    },
  ];

  const features = [
    {
      icon: <AgricultureIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Farming',
      description: 'Integrate blockchain technology with your farming operations for better transparency and efficiency.',
    },
    {
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      title: 'DeFi Solutions',
      description: 'Access decentralized financial tools designed specifically for agricultural needs.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Market Access',
      description: 'Connect directly with investors and expand your market reach globally.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F6F8F3' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
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
                  Empower Your Farm with Blockchain
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    lineHeight: 1.6,
                  }}
                >
                  Transform your agricultural business with decentralized finance. Access capital, protect against risks, and grow sustainably.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => router.push('/auth/register')}
                      sx={{
                        backgroundColor: '#ffffff',
                        color: theme.palette.primary.main,
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: alpha('#ffffff', 0.9),
                        },
                      }}
                    >
                      Get Started
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
                  src="/images/farm-hero.jpg"
                  alt="Smart Farming"
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
            color: theme.palette.primary.main,
            fontWeight: 700,
          }}
        >
          Why Choose DAFI?
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
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: '50%',
                      p: 2,
                      mb: 2,
                      color: theme.palette.primary.main,
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
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ 
              mb: 6,
              color: theme.palette.primary.main,
              fontWeight: 700,
            }}
          >
            Smart Farming Features
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
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: theme.palette.secondary.main,
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

      {/* CTA Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
              color: '#ffffff',
              borderRadius: 4,
            }}
          >
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Ready to Transform Your Farm?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join DAFI today and access the future of agricultural finance.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/auth/register')}
              sx={{
                backgroundColor: '#ffffff',
                color: theme.palette.secondary.main,
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.9),
                },
              }}
            >
              Start Now
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default FarmersPage;

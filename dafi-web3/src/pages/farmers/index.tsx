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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';

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

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
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
                  Empower Your Farm
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Access agricultural financing and manage your farm assets with blockchain technology.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => router.push('/auth/register')}
                      sx={{
                        backgroundColor: 'white',
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: alpha('white', 0.9),
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
                  src="/farmer-hero.png"
                  alt="Farming"
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
          sx={{ mb: 6, color: theme.palette.primary.main }}
        >
          Benefits for Farmers
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
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
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

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Card
            sx={{
              textAlign: 'center',
              p: 6,
              backgroundColor: 'white',
              boxShadow: theme.shadows[20],
            }}
          >
            <Typography variant="h4" gutterBottom>
              Ready to Transform Your Farm?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }} color="text.secondary">
              Join DAFI today and access the future of agricultural finance.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/auth/register')}
            >
              Start Now
            </Button>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default FarmersPage;

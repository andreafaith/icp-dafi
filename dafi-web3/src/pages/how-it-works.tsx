import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HowItWorks = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(userRole === 'farmer' ? '/farmer-dashboard' : '/investor-dashboard');
    } else {
      navigate('/register');
    }
  };

  const farmerSteps = [
    {
      title: 'Create Your Profile',
      description: 'Sign up and create your farmer profile with details about your farm and agricultural projects.',
    },
    {
      title: 'List Your Project',
      description: 'Submit your agricultural project details, including funding requirements and expected returns.',
    },
    {
      title: 'Receive Funding',
      description: 'Get connected with investors and receive funding through secure blockchain transactions.',
    },
  ];

  const investorSteps = [
    {
      title: 'Browse Projects',
      description: 'Explore various agricultural projects and choose ones that align with your investment goals.',
    },
    {
      title: 'Invest Securely',
      description: 'Make secure investments using blockchain technology and smart contracts.',
    },
    {
      title: 'Track Returns',
      description: 'Monitor your investments and receive returns through transparent blockchain transactions.',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#132A13', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          align="center"
          sx={{ mb: 6, color: 'white', fontWeight: 'bold' }}
        >
          How DAFI Works
        </Typography>

        {/* Farmers Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 4, color: 'white', fontWeight: 'bold' }}
          >
            For Farmers
          </Typography>
          <Grid container spacing={4}>
            {farmerSteps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    p: 3,
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}
                  >
                    Step {index + 1}: {step.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Investors Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 4, color: 'white', fontWeight: 'bold' }}
          >
            For Investors
          </Typography>
          <Grid container spacing={4}>
            {investorSteps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    p: 3,
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}
                  >
                    Step {index + 1}: {step.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: 'center',
            mt: 6,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: '#4CAF50',
              color: 'white',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              '&:hover': {
                bgcolor: '#388E3C',
              },
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;

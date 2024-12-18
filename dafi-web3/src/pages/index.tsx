import React from 'react';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { MainLayout } from '../components/common/MainLayout';
import HeroSection from '../components/common/HeroSection';
import Stats from '../components/common/Stats';
import TimelineSection from '../components/common/Timeline';
import TokenizationSection from '../components/common/TokenizationSection';
import ProblemSection from '../components/common/ProblemSection';
import TeamSection from '../components/common/TeamSection';
import CTASection from '../components/common/CTASection';
import FeatureCard from '../components/common/FeatureCard';

const HomePage = () => {
  const theme = useTheme();

  const features = [
    {
      title: 'Smart Asset Tokenization',
      description: 'Transform agricultural assets into tradeable digital tokens with blockchain technology, enabling fractional ownership and increased liquidity.',
      icon: '🌾',
      imagePath: '/images/features/tokenization.jpg'
    },
    {
      title: 'Secure Smart Contracts',
      description: 'Automated and transparent investment agreements powered by blockchain, ensuring trust and eliminating intermediaries.',
      icon: '📜',
      imagePath: '/images/features/smart-contracts.jpg'
    },
    {
      title: 'Real-time Monitoring',
      description: 'Advanced IoT integration for live tracking of farm operations, crop health, and investment performance metrics.',
      icon: '📊',
      imagePath: '/images/features/monitoring.jpg'
    },
    {
      title: 'Transparent Returns',
      description: 'Automated profit distribution and clear performance tracking, providing investors with real-time insights into their investments.',
      icon: '💰',
      imagePath: '/images/features/returns.jpg'
    }
  ];

  return (
    <MainLayout>
      <Box sx={{ pt: 8 }}>
        <HeroSection
          title="Revolutionizing Agricultural Investment"
          subtitle="Connect farmers with investors through blockchain technology, enabling secure and transparent agricultural investments."
          primaryAction={{
            label: "Get Started",
            onClick: () => null
          }}
          secondaryAction={{
            label: "Learn More",
            onClick: () => null
          }}
          imagePath="/images/hero-image.jpg"
          imageAlt="Agricultural Investment"
          gradient={`linear-gradient(45deg, ${theme.palette.primary.main}40, ${theme.palette.secondary.main}40)`}
        />
        
        <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Stats 
                  stats={[
                    { label: 'Active Farms', value: '100+' },
                    { label: 'Total Investment', value: '$5M+' },
                    { label: 'Investors', value: '1000+' },
                    { label: 'Success Rate', value: '95%' },
                  ]}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box 
          id="features"
          sx={{ 
            py: 12,
            background: '#132A13',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: 'white'
                }}
              >
                Revolutionary Features
              </Typography>
              <Typography
                variant="h5"
                sx={{ maxWidth: '800px', mx: 'auto', mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Transforming agricultural investment through cutting-edge technology
              </Typography>
            </Box>

            <Grid container spacing={4} sx={{ position: 'relative' }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <FeatureCard {...feature} />
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* Decorative Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              right: '5%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              zIndex: 0,
            }}
          />
        </Box>

        <Box sx={{ py: 6, bgcolor: '#132A13', color: 'white' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TimelineSection />
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box sx={{ bgcolor: 'white', py: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TokenizationSection />
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box sx={{ py: 6, bgcolor: '#132A13', color: 'white' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <ProblemSection />
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box sx={{ bgcolor: 'white', py: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TeamSection />
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box sx={{ py: 6, bgcolor: '#132A13', color: 'white' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <CTASection 
                  title="Ready to Transform Agriculture?"
                  description="Join DAFI Platform today and be part of the agricultural revolution"
                  buttonText="Connect Wallet"
                  onButtonClick={() => null}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default HomePage;

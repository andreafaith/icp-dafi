import React from 'react';
import { Box, Container, Typography, Grid, Paper, useTheme } from '@mui/material';
import { MainLayout } from '../components/common/MainLayout';
import Image from 'next/image';

const AboutPage = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Our Vision',
      content: 'DaFi aims to revolutionize agricultural financing by connecting farmers directly with investors through blockchain technology. We envision a future where agricultural investments are accessible, transparent, and beneficial for all parties involved.',
      image: '/images/about/vision.jpg'
    },
    {
      title: 'The Problem',
      content: 'Traditional agricultural financing often involves complex intermediaries, high costs, and limited access to capital. Farmers struggle to secure funding, while investors face barriers to entering the agricultural market.',
      image: '/images/about/problem.jpg'
    },
    {
      title: 'Our Solution',
      content: 'Through blockchain technology and smart contracts, DaFi creates a transparent, efficient, and secure platform for agricultural investments. We tokenize agricultural assets, enabling fractional ownership and providing liquidity to farmers while offering investors diverse opportunities.',
      image: '/images/about/solution.jpg'
    },
    {
      title: 'How It Works',
      content: 'Farmers can tokenize their agricultural assets on our platform, while investors can purchase these tokens to gain fractional ownership. Smart contracts ensure transparent distribution of returns, and our platform provides real-time monitoring of investments.',
      image: '/images/about/process.jpg'
    }
  ];

  return (
    <MainLayout>
      <Box
        sx={{
          bgcolor: 'background.default',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              component="h1"
              variant="h2"
              color="text.primary"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              About DaFi
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Bridging the gap between agricultural innovation and investment opportunities
            </Typography>
          </Box>

          {/* Content Sections */}
          <Grid container spacing={6}>
            {sections.map((section, index) => (
              <Grid item xs={12} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                    gap: 4,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h4"
                      component="h2"
                      gutterBottom
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}
                    >
                      {section.content}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      position: 'relative',
                      minHeight: 300,
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={section.image}
                      alt={section.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default AboutPage;

import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/layout/Layout';
import Image from 'next/image';
import { useRouter } from 'next/router';

const SelectRolePage = () => {
  const { setRole, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Choose Your Role
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Select how you want to participate in DaFi
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 4, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          {/* Farmer Card */}
          <Card sx={{ 
            flex: 1, 
            minWidth: { xs: '100%', md: '45%' },
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.02)' },
          }}>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 4,
            }}>
              <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                <Image
                  src="/images/farmer.jpg"
                  alt="Farmer"
                  fill
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
              </Box>
              <Typography variant="h4" component="h2">
                Farmer
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                List your agricultural assets and receive investments to grow your farm
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => setRole('farmer')}
                fullWidth
              >
                Continue as Farmer
              </Button>
            </CardContent>
          </Card>

          {/* Investor Card */}
          <Card sx={{ 
            flex: 1, 
            minWidth: { xs: '100%', md: '45%' },
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.02)' },
          }}>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 4,
            }}>
              <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                <Image
                  src="/images/investor.jpg"
                  alt="Investor"
                  fill
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
              </Box>
              <Typography variant="h4" component="h2">
                Investor
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Invest in verified agricultural projects and earn returns
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => setRole('investor')}
                fullWidth
              >
                Continue as Investor
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Layout>
  );
};

export default SelectRolePage;

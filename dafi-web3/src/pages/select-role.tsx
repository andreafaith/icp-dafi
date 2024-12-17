import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import Image from 'next/image';

const SelectRolePage = () => {
  const { setRole } = useAuth();

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" align="center" sx={{ mb: 6, color: 'white' }}>
          Choose Your Role
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
                sx={{
                  mt: 2,
                  backgroundColor: '#2E7D32',
                  '&:hover': { backgroundColor: '#1B5E20' },
                }}
              >
                Join as Farmer
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
                Invest in agricultural assets and earn returns from farm operations
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => setRole('investor')}
                sx={{
                  mt: 2,
                  backgroundColor: '#2E7D32',
                  '&:hover': { backgroundColor: '#1B5E20' },
                }}
              >
                Join as Investor
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Layout>
  );
};

export default SelectRolePage;

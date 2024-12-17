import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import Header from '../components/common/Header';

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7F5' }}>
      <Header />
      <Container 
        maxWidth="md" 
        sx={{ 
          pt: 15,
          pb: 6,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: '#1B2B1B',
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          401 Unauthorized
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            color: '#666',
            fontSize: { xs: '1.2rem', md: '1.5rem' }
          }}
        >
          You don't have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/')}
          sx={{
            bgcolor: '#4A7B3C',
            '&:hover': { bgcolor: '#5C9A4B' },
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          Go Home
        </Button>
      </Container>
    </Box>
  );
};

export default UnauthorizedPage;

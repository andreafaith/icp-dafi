import React from 'react';
import { Box, Container } from '@mui/material';
import { AuthForm } from '@/components/auth/AuthForm';

const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <AuthForm mode="login" />
      </Box>
    </Container>
  );
};

export default LoginPage;

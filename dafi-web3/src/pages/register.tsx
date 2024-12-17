import React from 'react';
import { Box, Container } from '@mui/material';
import { AuthForm } from '@/components/auth/AuthForm';

const RegisterPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <AuthForm mode="register" />
      </Box>
    </Container>
  );
};

export default RegisterPage;

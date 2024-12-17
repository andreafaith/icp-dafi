import React from 'react';
import { SignInForm } from '../../components/auth/SignInForm';
import Layout from '../../components/layout/Layout';
import { Container, Box } from '@mui/material';

const SignInPage: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box py={8}>
          <SignInForm />
        </Box>
      </Container>
    </Layout>
  );
};

export default SignInPage;

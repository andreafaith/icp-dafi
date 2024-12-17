import React from 'react';
import { SignUpForm } from '../../components/auth/SignUpForm';
import Layout from '../../components/layout/Layout';
import { Container, Box } from '@mui/material';

const SignUpPage: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box py={8}>
          <SignUpForm />
        </Box>
      </Container>
    </Layout>
  );
};

export default SignUpPage;

import React from 'react';
import { KYCForm } from '../../components/onboarding/KYCForm';
import Layout from '../../components/layout/Layout';
import { Container, Box } from '@mui/material';
import { withPageAuthRequired } from '../../utils/auth';

const KYCPage: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box py={8}>
          <KYCForm />
        </Box>
      </Container>
    </Layout>
  );
};

export const getServerSideProps = withPageAuthRequired();

export default KYCPage;

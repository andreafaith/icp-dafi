import React from 'react';
import { WalletConnect } from '../../components/onboarding/WalletConnect';
import Layout from '../../components/layout/Layout';
import { Container, Box } from '@mui/material';
import { withPageAuthRequired } from '../../utils/auth';

const ConnectWalletPage: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box py={8}>
          <WalletConnect />
        </Box>
      </Container>
    </Layout>
  );
};

export const getServerSideProps = withPageAuthRequired();

export default ConnectWalletPage;

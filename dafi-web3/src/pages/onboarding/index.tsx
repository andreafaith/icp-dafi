import React from 'react';
import { Container, Box } from '@mui/material';
import { UserTypeSelection, UserType } from '../../components/onboarding/UserTypeSelection';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const OnboardingPage: React.FC = () => {
  const { updateUserProfile } = useAuth();
  const router = useRouter();

  const handleUserTypeSelect = async (type: UserType) => {
    try {
      await updateUserProfile({ userType: type });
      router.push('/onboarding/kyc');
    } catch (error) {
      console.error('Error updating user type:', error);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box py={8}>
          <UserTypeSelection onSelect={handleUserTypeSelect} />
        </Box>
      </Container>
    </Layout>
  );
};

export default OnboardingPage;

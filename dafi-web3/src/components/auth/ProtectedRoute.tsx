import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../../contexts/AuthContext';
import { kycService } from '../../services/kyc';
import { CircularProgress, Box, Typography, Button } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'farmer' | 'investor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      try {
        if (user?.principal) {
          const principal = Principal.fromText(user.principal);
          const verified = await kycService.isVerified(principal);
          setIsVerified(verified);

          if (!verified) {
            router.push('/onboarding');
            return;
          }

          if (requiredUserType) {
            const userType = await kycService.getUserType(principal);
            
            if (!userType || userType !== requiredUserType) {
              router.push('/unauthorized');
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        router.push('/error');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [isAuthenticated, user, router, requiredUserType]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isVerified) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <Typography variant="h6">
          Please complete your verification process
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/onboarding')}
        >
          Go to Verification
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

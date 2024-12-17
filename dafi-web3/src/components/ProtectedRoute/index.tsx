import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'farmer' | 'investor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    if (!userRole) {
      router.push('/select-role');
      return;
    }

    if (userRole !== requiredRole) {
      router.push(`/${userRole}s`);
      return;
    }
  }, [isAuthenticated, userRole, router, requiredRole]);

  if (!isAuthenticated || !userRole || userRole !== requiredRole) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Checking authentication...</Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

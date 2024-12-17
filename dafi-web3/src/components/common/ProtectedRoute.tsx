import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userTypes?: ('farmer' | 'investor')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userTypes }) => {
  const { isAuthenticated, isLoading, userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }

    if (!isLoading && userTypes && !userTypes.includes(userType as 'farmer' | 'investor')) {
      router.push('/unauthorized');
    }
  }, [isLoading, isAuthenticated, userType, userTypes, router]);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (userTypes && !userTypes.includes(userType as 'farmer' | 'investor')) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

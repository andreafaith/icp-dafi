import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export const WalletConnect: React.FC = () => {
  const { isAuthenticated, login, logout, userRole } = useAuth();

  const buttonStyle = {
    backgroundColor: '#2E7D32',
    color: 'white',
    textTransform: 'none',
    borderRadius: '24px',
    padding: '8px 24px',
    fontSize: '1rem',
    fontWeight: 500,
    border: '1px solid #43A047',
    '&:hover': {
      backgroundColor: '#1B5E20',
      borderColor: '#2E7D32',
    },
    '&:disabled': {
      backgroundColor: '#1B5E20',
      opacity: 0.7,
    },
  };

  if (isAuthenticated) {
    return (
      <Button
        variant="contained"
        onClick={logout}
        sx={buttonStyle}
      >
        {userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Account` : 'Disconnect'}
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      onClick={login}
      sx={buttonStyle}
    >
      Connect Wallet
    </Button>
  );
};

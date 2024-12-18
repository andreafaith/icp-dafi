import React from 'react';
import { Button, useTheme, alpha } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface WalletConnectProps {
  onClick?: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onClick }) => {
  const { isAuthenticated, login, logout, userRole } = useAuth();
  const theme = useTheme();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (isAuthenticated) {
      logout();
    } else {
      login();
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      startIcon={<AccountBalanceWalletIcon />}
      sx={{
        background: isAuthenticated 
          ? `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`
          : `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
        color: isAuthenticated ? theme.palette.primary.main : '#ffffff',
        textTransform: 'none',
        borderRadius: '24px',
        padding: '10px 24px',
        fontSize: '0.95rem',
        fontWeight: 600,
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        '&:hover': {
          background: isAuthenticated
            ? `linear-gradient(45deg, ${theme.palette.success.dark} 30%, ${theme.palette.success.main} 90%)`
            : `linear-gradient(45deg, ${theme.palette.secondary.dark} 30%, ${theme.palette.secondary.main} 90%)`,
          boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
        },
        '&:disabled': {
          opacity: 0.7,
        },
      }}
    >
      {isAuthenticated 
        ? (userRole ? `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Account` : 'Connected')
        : 'Connect Wallet'
      }
    </Button>
  );
};

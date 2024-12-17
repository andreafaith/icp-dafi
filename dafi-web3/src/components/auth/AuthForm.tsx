import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  CircularProgress,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useWallet } from '@/contexts/WalletContext';
import Image from 'next/image';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const router = useRouter();
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connect, isConnecting } = useWallet();

  const handleWalletConnect = async () => {
    try {
      setError(null);
      const success = await connect();
      if (success) {
        setWalletDialogOpen(false);
        router.push('/dashboard');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to DaFi
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {mode === 'login'
            ? 'Connect your wallet to access your account'
            : 'Create an account to get started'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() => setWalletDialogOpen(true)}
        startIcon={<WalletIcon />}
        disabled={isConnecting}
        sx={{ mb: 2 }}
      >
        {isConnecting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Connect Wallet'
        )}
      </Button>

      <Dialog
        open={walletDialogOpen}
        onClose={() => setWalletDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Connect Wallet</Typography>
            <Button
              onClick={() => setWalletDialogOpen(false)}
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <CloseIcon />
            </Button>
          </Box>
          <List>
            <ListItem
              button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <Image
                  src="/walletmask-logo.png"
                  alt="WalletMask"
                  width={32}
                  height={32}
                />
              </ListItemIcon>
              <ListItemText
                primary="WalletMask"
                secondary="Connect using WalletMask"
              />
              {isConnecting && <CircularProgress size={24} />}
            </ListItem>
          </List>
        </Box>
      </Dialog>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          By connecting your wallet, you agree to our{' '}
          <Button
            color="primary"
            onClick={() => router.push('/terms')}
            sx={{ p: 0, minWidth: 'auto', verticalAlign: 'baseline' }}
          >
            Terms of Service
          </Button>{' '}
          and{' '}
          <Button
            color="primary"
            onClick={() => router.push('/privacy')}
            sx={{ p: 0, minWidth: 'auto', verticalAlign: 'baseline' }}
          >
            Privacy Policy
          </Button>
        </Typography>
      </Box>
    </Paper>
  );
};

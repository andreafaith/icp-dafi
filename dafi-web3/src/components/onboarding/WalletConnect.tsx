import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const walletOptions: WalletOption[] = [
  {
    id: 'plug',
    name: 'Plug Wallet',
    icon: '/images/wallets/plug.png',
    description: 'Connect with Plug Wallet for Internet Computer',
  },
  {
    id: 'stoic',
    name: 'Stoic Wallet',
    icon: '/images/wallets/stoic.png',
    description: 'Connect with Stoic Wallet',
  },
  {
    id: 'infinity',
    name: 'Infinity Wallet',
    icon: '/images/wallets/infinity.png',
    description: 'Connect with Infinity Wallet',
  },
];

export const WalletConnect: React.FC = () => {
  const router = useRouter();
  const { connectWallet } = useAuth();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWalletSelect = async (walletId: string) => {
    setSelectedWallet(walletId);
    setError('');
    setLoading(true);

    try {
      const success = await connectWallet(walletId);
      if (success) {
        router.push('/onboarding/kyc');
      } else {
        setError('Failed to connect wallet');
      }
    } catch (err) {
      setError('An error occurred while connecting wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Connect Your Wallet
      </Typography>

      <Typography variant="body1" color="textSecondary" align="center" mb={4}>
        Select a wallet to connect with our platform
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={2}>
        {walletOptions.map((wallet) => (
          <Grid item xs={12} key={wallet.id}>
            <Card
              sx={{
                cursor: 'pointer',
                border: selectedWallet === wallet.id ? 2 : 1,
                borderColor: selectedWallet === wallet.id ? 'primary.main' : 'divider',
              }}
              onClick={() => handleWalletSelect(wallet.id)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={wallet.icon}
                      alt={wallet.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h6">{wallet.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {wallet.description}
                    </Typography>
                  </Box>
                  {loading && selectedWallet === wallet.id && (
                    <CircularProgress size={24} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ mt: 4 }}
      >
        By connecting a wallet, you agree to our Terms of Service and Privacy Policy
      </Typography>
    </Box>
  );
};

import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import Image from 'next/image';
import { useWeb3 } from '../../context/Web3Context';

interface WalletOption {
  id: 'injected' | 'walletconnect';
  name: string;
  icon: string;
  description: string;
}

const walletOptions: WalletOption[] = [
  {
    id: 'injected',
    name: 'MetaMask',
    icon: '/images/metamask-logo.svg',
    description: 'Connect to your MetaMask Wallet',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/images/walletconnect-logo.svg',
    description: 'Scan with WalletConnect to connect',
  },
];

interface WalletConnectProps {
  open: boolean;
  onClose: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ open, onClose }) => {
  const { connect, isConnecting, error } = useWeb3();

  const handleConnect = async (walletId: 'injected' | 'walletconnect') => {
    try {
      await connect(walletId);
      onClose();
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: '#FFFFFF',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Connect Wallet
        </Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error.message}
          </Typography>
        )}
        <List>
          {walletOptions.map((wallet) => (
            <ListItem key={wallet.id} disablePadding>
              <ListItemButton
                onClick={() => handleConnect(wallet.id)}
                disabled={isConnecting}
                sx={{
                  py: 2,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'rgba(74, 123, 60, 0.1)',
                  },
                }}
              >
                <ListItemIcon>
                  <Box sx={{ width: 32, height: 32, position: 'relative' }}>
                    <Image
                      src={wallet.icon}
                      alt={wallet.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={wallet.name}
                  secondary={wallet.description}
                  primaryTypographyProps={{
                    variant: 'subtitle1',
                    fontWeight: 600,
                  }}
                  secondaryTypographyProps={{
                    variant: 'body2',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnect;

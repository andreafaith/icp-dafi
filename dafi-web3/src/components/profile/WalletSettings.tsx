import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  AccountBalanceWallet as WalletIcon,
  Link as LinkIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

export const WalletSettings = () => {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('0x1234...5678');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mockWallets = [
    { name: 'Internet Identity', icon: '🔑' },
    { name: 'Plug Wallet', icon: '🔌' },
    { name: 'NFID', icon: '🆔' },
    { name: 'Stoic Wallet', icon: '💼' },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Connected Wallets
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WalletIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              Primary Wallet
            </Typography>
            <Chip
              label="Connected"
              color="success"
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              0x1234...5678
            </Typography>
            <IconButton size="small" onClick={handleCopyAddress}>
              {copied ? <CheckIcon color="success" /> : <CopyIcon />}
            </IconButton>
          </Box>

          <Button
            variant="outlined"
            startIcon={<LinkIcon />}
            sx={{ mr: 2 }}
          >
            View on Explorer
          </Button>
          <Button
            variant="outlined"
            color="error"
          >
            Disconnect
          </Button>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        onClick={() => setConnectDialogOpen(true)}
        startIcon={<WalletIcon />}
      >
        Connect Another Wallet
      </Button>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText
            primary="Transaction Signing"
            secondary="Require password for all transactions"
          />
          <Button variant="outlined" size="small">
            Configure
          </Button>
        </ListItem>
      </List>

      {/* Connect Wallet Dialog */}
      <Dialog
        open={connectDialogOpen}
        onClose={() => setConnectDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Connect Wallet
        </DialogTitle>
        <DialogContent>
          <List>
            {mockWallets.map((wallet) => (
              <ListItem
                key={wallet.name}
                button
                onClick={() => setConnectDialogOpen(false)}
              >
                <ListItemIcon>
                  <Typography variant="h6">{wallet.icon}</Typography>
                </ListItemIcon>
                <ListItemText primary={wallet.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { AccountBalanceWallet as WalletIcon } from '@mui/icons-material';
import { useWalletContext } from '../../context/WalletContext';

export const WalletButton: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    connection,
    balance,
    connect,
    disconnect,
  } = useWalletContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConnect = async (provider: string) => {
    handleClose();
    await connect(provider);
  };

  const handleDisconnect = async () => {
    handleClose();
    await disconnect();
  };

  if (isConnected && connection) {
    return (
      <>
        <Button
          variant="outlined"
          onClick={handleClick}
          startIcon={<WalletIcon />}
        >
          {balance ? `${balance.toString()} ICP` : 'Connected'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="textSecondary">
              {connection.principal.toText().slice(0, 8)}...
              {connection.principal.toText().slice(-6)}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
        </Menu>
      </>
    );
  }

  if (isConnecting) {
    return (
      <Button
        variant="outlined"
        disabled
        startIcon={<CircularProgress size={20} />}
      >
        Connecting...
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClick}
        startIcon={<WalletIcon />}
      >
        Connect Wallet
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleConnect('plug')}>
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src="/images/wallets/plug.png"
              alt="Plug"
              width={24}
              height={24}
            />
            Plug Wallet
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleConnect('stoic')}>
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src="/images/wallets/stoic.png"
              alt="Stoic"
              width={24}
              height={24}
            />
            Stoic Wallet
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleConnect('infinity')}>
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src="/images/wallets/infinity.png"
              alt="Infinity"
              width={24}
              height={24}
            />
            Infinity Wallet
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

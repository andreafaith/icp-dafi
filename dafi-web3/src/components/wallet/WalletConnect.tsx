import React from 'react';
import {
    Button,
    Box,
    Typography,
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import { AccountBalanceWallet, ExitToApp, ContentCopy } from '@mui/icons-material';
import { useWeb3 } from '../../contexts/Web3Context';
import { shortenPrincipal } from '../../utils/format';

export const WalletConnect: React.FC = () => {
    const {
        isConnected,
        principal,
        connect,
        disconnect,
        isLoading,
        error
    } = useWeb3();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [copySuccess, setCopySuccess] = React.useState(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCopyAddress = async () => {
        if (principal) {
            await navigator.clipboard.writeText(principal.toString());
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleDisconnect = () => {
        disconnect();
        handleClose();
    };

    if (isLoading) {
        return (
            <Button
                variant="outlined"
                color="primary"
                startIcon={<CircularProgress size={20} />}
                disabled
            >
                Connecting...
            </Button>
        );
    }

    if (!isConnected) {
        return (
            <Button
                variant="contained"
                color="primary"
                onClick={connect}
                startIcon={<AccountBalanceWallet />}
            >
                Connect Wallet
            </Button>
        );
    }

    return (
        <>
            <Box>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleClick}
                    startIcon={<AccountBalanceWallet />}
                >
                    {principal ? shortenPrincipal(principal.toString()) : 'Connected'}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem>
                        <Box display="flex" alignItems="center" width="100%">
                            <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                                {principal ? shortenPrincipal(principal.toString()) : ''}
                            </Typography>
                            <Tooltip title={copySuccess ? 'Copied!' : 'Copy Address'}>
                                <IconButton size="small" onClick={handleCopyAddress}>
                                    <ContentCopy fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </MenuItem>
                    <MenuItem onClick={handleDisconnect}>
                        <ExitToApp fontSize="small" sx={{ mr: 1 }} />
                        Disconnect
                    </MenuItem>
                </Menu>
            </Box>

            {error && (
                <Typography color="error" variant="caption" display="block" mt={1}>
                    {error}
                </Typography>
            )}
        </>
    );
};

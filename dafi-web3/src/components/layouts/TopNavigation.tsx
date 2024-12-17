import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
  Avatar,
  Tooltip,
  Badge,
  Chip,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountBalanceWallet as WalletIcon,
  Notifications as NotificationsIcon,
  LocalAtm as TokenIcon,
  Pool as PoolIcon,
  Gavel as GovernanceIcon,
  Analytics as AnalyticsIcon,
  MonetizationOn as StakingIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface TopNavigationProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  theme,
  onThemeToggle,
}) => {
  const router = useRouter();
  const muiTheme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [walletAnchorEl, setWalletAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [defiMenuAnchor, setDefiMenuAnchor] = useState<null | HTMLElement>(null);

  // Mock wallet state
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const mockBalance = '1,234.56 DAFI';

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenWalletMenu = (event: React.MouseEvent<HTMLElement>) => {
    setWalletAnchorEl(event.currentTarget);
  };

  const handleCloseWalletMenu = () => {
    setWalletAnchorEl(null);
  };

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchorEl(null);
  };

  const handleOpenDefiMenu = (event: React.MouseEvent<HTMLElement>) => {
    setDefiMenuAnchor(event.currentTarget);
  };

  const handleCloseDefiMenu = () => {
    setDefiMenuAnchor(null);
  };

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Assets', path: '/assets' },
    { name: 'Markets', path: '/markets' },
    { name: 'Portfolio', path: '/portfolio' },
  ];

  const defiNavItems = [
    { name: 'Token Management', path: '/defi/tokens', icon: <TokenIcon /> },
    { name: 'Liquidity Pools', path: '/defi/pools', icon: <PoolIcon /> },
    { name: 'Staking', path: '/defi/staking', icon: <StakingIcon /> },
    { name: 'Governance', path: '/defi/governance', icon: <GovernanceIcon /> },
    { name: 'Analytics', path: '/defi/analytics', icon: <AnalyticsIcon /> },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: theme === 'dark' ? 'grey.900' : 'white',
        backgroundImage: 'none',
        boxShadow: theme === 'dark' ? 1 : 0,
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 4,
              display: 'flex',
              fontWeight: 700,
              color: theme === 'dark' ? 'white' : 'primary.main',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onClick={() => router.push('/')}
          >
            DAFI
          </Typography>

          {/* Main Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {mainNavItems.map((item) => (
              <Button
                key={item.name}
                component={Link}
                href={item.path}
                sx={{
                  mx: 1,
                  color: router.pathname === item.path
                    ? 'primary.main'
                    : theme === 'dark' ? 'grey.300' : 'grey.700',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {item.name}
              </Button>
            ))}

            {/* DeFi Menu Button */}
            <Button
              onClick={handleOpenDefiMenu}
              sx={{
                mx: 1,
                color: theme === 'dark' ? 'grey.300' : 'grey.700',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'transparent',
                },
              }}
            >
              DeFi
            </Button>
          </Box>

          {/* Right side icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Wallet */}
            {isWalletConnected ? (
              <Chip
                icon={<WalletIcon />}
                label={mockBalance}
                onClick={handleOpenWalletMenu}
                sx={{
                  mr: 2,
                  bgcolor: theme === 'dark' ? 'grey.800' : 'grey.100',
                  color: theme === 'dark' ? 'grey.300' : 'grey.700',
                }}
              />
            ) : (
              <Button
                variant="contained"
                startIcon={<WalletIcon />}
                onClick={() => setIsWalletConnected(true)}
                sx={{ mr: 2 }}
              >
                Connect Wallet
              </Button>
            )}

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                onClick={handleOpenNotifications}
                sx={{ 
                  color: theme === 'dark' ? 'grey.300' : 'grey.700',
                  mr: 2,
                }}
              >
                <Badge badgeContent={3} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Theme Toggle */}
            <IconButton
              onClick={onThemeToggle}
              sx={{ 
                mr: 2,
                color: theme === 'dark' ? 'grey.300' : 'grey.700',
              }}
            >
              {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Profile */}
            <Tooltip title="Profile">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main',
                  }}
                >
                  U
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Menus */}
          <Menu
            anchorEl={defiMenuAnchor}
            open={Boolean(defiMenuAnchor)}
            onClose={handleCloseDefiMenu}
            sx={{ mt: '45px' }}
          >
            {defiNavItems.map((item) => (
              <MenuItem
                key={item.name}
                onClick={() => {
                  router.push(item.path);
                  handleCloseDefiMenu();
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {item.icon}
                <Typography>{item.name}</Typography>
              </MenuItem>
            ))}
          </Menu>

          <Menu
            anchorEl={walletAnchorEl}
            open={Boolean(walletAnchorEl)}
            onClose={handleCloseWalletMenu}
            sx={{ mt: '45px' }}
          >
            <MenuItem onClick={handleCloseWalletMenu}>
              View Balance
            </MenuItem>
            <MenuItem onClick={handleCloseWalletMenu}>
              Send Tokens
            </MenuItem>
            <MenuItem onClick={handleCloseWalletMenu}>
              Transaction History
            </MenuItem>
            <MenuItem onClick={() => {
              setIsWalletConnected(false);
              handleCloseWalletMenu();
            }}>
              Disconnect Wallet
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleCloseNotifications}
            sx={{ mt: '45px' }}
          >
            <MenuItem onClick={handleCloseNotifications}>
              New Governance Proposal
            </MenuItem>
            <MenuItem onClick={handleCloseNotifications}>
              Staking Rewards Available
            </MenuItem>
            <MenuItem onClick={handleCloseNotifications}>
              Pool Position Update
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseUserMenu}
            sx={{ mt: '45px' }}
          >
            <MenuItem onClick={() => { router.push('/profile'); handleCloseUserMenu(); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { router.push('/settings'); handleCloseUserMenu(); }}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopNavigation;

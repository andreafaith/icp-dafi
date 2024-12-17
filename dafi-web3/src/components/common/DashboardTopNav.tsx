import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as LoansIcon,
  Assessment as AnalyticsIcon,
  Agriculture as FarmIcon,
  Business as BusinessIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  AccountBalance as InvestmentIcon,
  Search as SearchIcon,
  MonetizationOn as InvestIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface DashboardTopNavProps {
  userRole: 'farmer' | 'investor';
  userName: string;
  userAvatar: string;
}

const farmerNavItems = [
  { 
    title: 'Dashboard', 
    icon: <DashboardIcon />, 
    path: '/test/farmers-dashboard',
    description: 'Overview of your farm performance'
  },
  { 
    title: 'Loans', 
    icon: <LoansIcon />, 
    path: '/test/farmers-loans',
    description: 'Manage your loans and applications'
  },
  { 
    title: 'Analytics', 
    icon: <AnalyticsIcon />, 
    path: '/test/farmers-analytics',
    description: 'Advanced farm performance metrics'
  },
  { 
    title: 'Resources', 
    icon: <FarmIcon />, 
    path: '/test/farmers-resources',
    description: 'Educational resources and tools'
  },
  { 
    title: 'Market', 
    icon: <BusinessIcon />, 
    path: '/test/farmers-market',
    description: 'Market prices and trends'
  },
  { 
    title: 'Profile', 
    icon: <ProfileIcon />, 
    path: '/test/farmers-profile',
    description: 'Your farmer profile'
  },
  { 
    title: 'Settings', 
    icon: <SettingsIcon />, 
    path: '/test/farmers-settings',
    description: 'Account settings and preferences'
  },
];

const investorNavItems = [
  { 
    title: 'Dashboard', 
    icon: <DashboardIcon />, 
    path: '/test/investor-dashboard',
    description: 'Overview of your investments'
  },
  { 
    title: 'Portfolio', 
    icon: <InvestmentIcon />, 
    path: '/test/investor-investments',
    description: 'Manage your investment portfolio'
  },
  { 
    title: 'Analytics', 
    icon: <AnalyticsIcon />, 
    path: '/test/investor-analytics',
    description: 'Advanced investment analytics'
  },
  { 
    title: 'Opportunities', 
    icon: <InvestIcon />, 
    path: '/test/investor-opportunities',
    description: 'Explore new investment opportunities'
  },
  { 
    title: 'Research', 
    icon: <SearchIcon />, 
    path: '/test/investor-research',
    description: 'Market research and insights'
  },
  { 
    title: 'Profile', 
    icon: <ProfileIcon />, 
    path: '/test/investor-profile',
    description: 'Your investor profile'
  },
  { 
    title: 'Settings', 
    icon: <SettingsIcon />, 
    path: '/test/investor-settings',
    description: 'Account settings and preferences'
  },
];

export const DashboardTopNav: React.FC<DashboardTopNavProps> = ({
  userRole = 'farmer',
  userName = 'John Doe',
  userAvatar,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [role, setRole] = React.useState(userRole);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    // Determine role based on URL
    if (router.pathname.includes('investor')) {
      setRole('investor');
    } else if (router.pathname.includes('farmers')) {
      setRole('farmer');
    }
  }, [router.pathname]);

  const navItems = role === 'farmer' ? farmerNavItems : investorNavItems;

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
  };

  const isActiveRoute = (path: string) => {
    return router.pathname === path;
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: '#FFFFFF',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left section - Logo and Role */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" passHref>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <Image
                src="/images/logo-white.svg"
                alt="DaFi Logo"
                width={90}
                height={90}
                priority
              />
            </Box>
          </Link>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              ml: 2
            }}
          >
            {role === 'farmer' ? 'Farmer Portal' : 'Investor Portal'}
          </Typography>
        </Box>

        {/* Center section - Navigation */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          justifyContent: 'center',
          flex: 1,
          px: 4
        }}>
          {navItems.map((item) => (
            <Link key={item.title} href={item.path} passHref>
              <Button
                color="inherit"
                startIcon={item.icon}
                sx={{
                  color: isActiveRoute(item.path) ? theme.palette.primary.main : theme.palette.text.secondary,
                  borderBottom: isActiveRoute(item.path) ? `2px solid ${theme.palette.primary.main}` : 'none',
                  borderRadius: 0,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderBottom: `2px solid ${theme.palette.primary.light}`,
                  },
                }}
              >
                {item.title}
              </Button>
            </Link>
          ))}
        </Box>

        {/* Right section - Profile & Notifications */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handleNotificationsClick}
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <NotificationsIcon />
          </IconButton>
          <IconButton 
            onClick={handleProfileClick}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Avatar
              src={userAvatar}
              alt={userName}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <MenuItem onClick={() => {
            handleClose();
            router.push(role === 'farmer' ? '/test/farmers-profile' : '/test/investor-profile');
          }}>
            <ProfileIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => {
            handleClose();
            router.push(role === 'farmer' ? '/test/farmers-settings' : '/test/investor-settings');
          }}>
            <SettingsIcon sx={{ mr: 1 }} /> Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
              minWidth: 280,
            },
          }}
        >
          <MenuItem>
            <Typography variant="subtitle2">No new notifications</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

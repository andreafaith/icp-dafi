import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  useTheme,
  Typography,
  Button,
  Container,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as InvestIcon,
  Agriculture as FarmIcon,
  Settings as SettingsIcon,
  Assessment as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  MonetizationOn as DeFiIcon,
  Inventory as AssetsIcon,
  Store as MarketIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Logo from '../Logo';

interface NavItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

const farmerNavItems: NavItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/test/farmer-dashboard' },
  { text: 'My Farms', icon: <FarmIcon />, path: '/test/farmer-farms' },
  { text: 'DeFi', icon: <DeFiIcon />, path: '/test/farmer-defi' },
  { text: 'Assets', icon: <AssetsIcon />, path: '/test/farmer-assets' },
  { text: 'Market', icon: <MarketIcon />, path: '/test/farmer-market' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/test/farmer-analytics' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/test/farmer-notifications' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/test/farmer-settings' },
];

const investorNavItems: NavItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/test/investor-dashboard' },
  { text: 'Investments', icon: <InvestIcon />, path: '/test/investor-investments' },
  { text: 'DeFi', icon: <DeFiIcon />, path: '/test/investor-defi' },
  { text: 'Assets', icon: <AssetsIcon />, path: '/test/investor-assets' },
  { text: 'Market', icon: <MarketIcon />, path: '/test/investor-market' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/test/investor-analytics' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/test/investor-notifications' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/test/investor-settings' },
];

interface DashboardNavProps {
  userType: 'farmer' | 'investor';
}

const DashboardNav: React.FC<DashboardNavProps> = ({ userType }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);

  const navItems = userType === 'farmer' ? farmerNavItems : investorNavItems;

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    handleMobileMenuClose();
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={1}
        sx={{
          backgroundColor: 'white',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 } }}>
              <Logo />
              <Typography
                variant="h6"
                sx={{
                  ml: 2,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {userType === 'farmer' ? 'Farmer Portal' : 'Investor Portal'}
              </Typography>
            </Box>

            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open menu"
                  edge="start"
                  onClick={handleMobileMenuOpen}
                  sx={{ ml: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={mobileMenuAnchor}
                  open={Boolean(mobileMenuAnchor)}
                  onClose={handleMobileMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                      mt: 1.5,
                    },
                  }}
                >
                  {navItems.map((item) => (
                    <MenuItem
                      key={item.text}
                      onClick={() => handleNavigation(item.path)}
                      selected={router.pathname === item.path}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {React.cloneElement(item.icon, {
                          sx: { mr: 1, fontSize: '1.25rem' }
                        })}
                        {item.text}
                      </Box>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, ml: 4 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: router.pathname === item.path ? 'primary.main' : 'text.primary',
                      fontWeight: router.pathname === item.path ? 600 : 400,
                      borderRadius: 2,
                      px: 2,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                    startIcon={React.cloneElement(item.icon, {
                      sx: { fontSize: '1.25rem' }
                    })}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar /> {/* This is for spacing below the fixed AppBar */}
    </>
  );
};

export default DashboardNav;

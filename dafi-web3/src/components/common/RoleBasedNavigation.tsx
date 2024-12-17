import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  IconButton,
  Avatar,
  Divider,
  Tooltip,
  alpha,
} from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

interface NavigationItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const farmerNavItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    path: '/test/farmers-dashboard',
    icon: <DashboardIcon />,
  },
  {
    title: 'My Loans',
    path: '/test/farmers-loans',
    icon: <AccountBalanceIcon />,
  },
  {
    title: 'Profile',
    path: '/test/farmers-profile',
    icon: <PersonIcon />,
  },
  {
    title: 'Settings',
    path: '/test/farmers-settings',
    icon: <SettingsIcon />,
  },
];

const investorNavItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    path: '/test/investor-dashboard',
    icon: <DashboardIcon />,
  },
  {
    title: 'My Investments',
    path: '/test/investor-investments',
    icon: <AccountBalanceIcon />,
  },
  {
    title: 'Profile',
    path: '/test/investor-profile',
    icon: <PersonIcon />,
  },
  {
    title: 'Settings',
    path: '/test/investor-settings',
    icon: <SettingsIcon />,
  },
];

interface RoleBasedNavigationProps {
  role: 'farmer' | 'investor';
  userName: string;
  userAvatar: string;
  isOpen: boolean;
  onToggle: () => void;
}

const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({
  role,
  userName,
  userAvatar,
  isOpen,
  onToggle,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const navItems = role === 'farmer' ? farmerNavItems : investorNavItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: isOpen ? drawerWidth : collapsedDrawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#FDFBF7',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isOpen ? 'space-between' : 'center',
        p: 2, 
        minHeight: 64,
      }}>
        {isOpen && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={userAvatar} alt={userName} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {userName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {role}
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton onClick={onToggle}>
          {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />

      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
            <Link href={item.path} style={{ textDecoration: 'none', width: '100%', color: 'inherit' }}>
              <Tooltip title={!isOpen ? item.title : ''} placement="right">
                <ListItemButton
                  selected={router.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    px: 2,
                    borderRadius: '8px',
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                      },
                    },
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpen ? 2 : 0,
                      justifyContent: 'center',
                      color: router.pathname === item.path
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isOpen && (
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: router.pathname === item.path ? 600 : 400,
                            color: router.pathname === item.path
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary,
                          }}
                        >
                          {item.title}
                        </Typography>
                      }
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export { RoleBasedNavigation };

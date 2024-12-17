import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as LoansIcon,
  Assessment as AnalyticsIcon,
  Agriculture as FarmIcon,
  Business as BusinessIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  MonetizationOn as InvestIcon,
} from '@mui/icons-material';
import Image from 'next/image';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const farmerNavItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/test/farmers-dashboard' },
  { title: 'Loans', icon: <LoansIcon />, path: '/test/farmers-loans' },
  { title: 'Analytics', icon: <AnalyticsIcon />, path: '/test/farmers-analytics' },
  { title: 'Resources', icon: <FarmIcon />, path: '/test/farmers-resources' },
  { title: 'Market', icon: <BusinessIcon />, path: '/test/farmers-market' },
];

const investorNavItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/test/investor-dashboard' },
  { title: 'Portfolio', icon: <InvestIcon />, path: '/test/investor-portfolio' },
  { title: 'Analytics', icon: <AnalyticsIcon />, path: '/test/investor-analytics' },
  { title: 'Opportunities', icon: <BusinessIcon />, path: '/test/investor-opportunities' },
  { title: 'Research', icon: <AnalyticsIcon />, path: '/test/investor-research' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const isInvestor = router.pathname.includes('investor');
  const navItems = isInvestor ? investorNavItems : farmerNavItems;

  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', lg: 'none' },
        '& .MuiDrawer-paper': { 
          width: 280,
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/logo.png"
            alt="DAFI Logo"
            width={40}
            height={40}
          />
          <Typography variant="h6" sx={{ ml: 2 }}>
            {isInvestor ? 'Investor Portal' : 'Farmer Portal'}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            href={item.path}
            onClick={onClose}
            sx={{
              color: router.pathname === item.path ? 'primary.main' : 'text.primary',
              bgcolor: router.pathname === item.path ? 'action.selected' : 'transparent',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem
          component={Link}
          href={isInvestor ? '/test/investor-profile' : '/test/farmers-profile'}
          onClick={onClose}
        >
          <ListItemIcon>
            <ProfileIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem
          component={Link}
          href={isInvestor ? '/test/investor-settings' : '/test/farmers-settings'}
          onClick={onClose}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Drawer>
  );
}

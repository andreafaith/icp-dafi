import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as PortfolioIcon,
  TrendingUp as OpportunitiesIcon,
  Assessment as AnalyticsIcon,
  ShowChart as YieldIcon,
  LocalAtm as AssetsIcon,
  Store as MarketIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

const menuItems = [
  { name: 'Dashboard', icon: <DashboardIcon />, path: '/investor/dashboard' },
  { name: 'Portfolio', icon: <PortfolioIcon />, path: '/investor/portfolio' },
  { name: 'Opportunities', icon: <OpportunitiesIcon />, path: '/investor/opportunities' },
  { name: 'Analytics', icon: <AnalyticsIcon />, path: '/investor/analytics' },
  { name: 'Yield Forecasts', icon: <YieldIcon />, path: '/investor/yields' },
  { name: 'My Assets', icon: <AssetsIcon />, path: '/investor/assets' },
  { name: 'Marketplace', icon: <MarketIcon />, path: '/investor/marketplace' },
];

const bottomMenuItems = [
  { name: 'Settings', icon: <SettingsIcon />, path: '/investor/settings' },
  { name: 'Notifications', icon: <NotificationsIcon />, path: '/investor/notifications' },
];

export const InvestorNavigation: React.FC = () => {
  const navigate = useNavigate();

  const mockUser = {
    name: 'John Smith',
    role: 'Premium Investor',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait',
    investedAmount: '$1,250,000',
    activeInvestments: 8,
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: '#1a1f2c',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            src={mockUser.avatar}
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {mockUser.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'primary.main' }}>
              {mockUser.role}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 1,
            p: 2,
            mt: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Total Invested
          </Typography>
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
            {mockUser.investedAmount}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
            Active Investments
          </Typography>
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
            {mockUser.activeInvestments}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.name}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 1,
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

      <List sx={{ px: 2 }}>
        {bottomMenuItems.map((item) => (
          <ListItem
            button
            key={item.name}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 1,
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

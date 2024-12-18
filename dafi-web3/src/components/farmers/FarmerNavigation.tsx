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
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Agriculture as FarmIcon,
  LocalFlorist as CropIcon,
  WbSunny as WeatherIcon,
  Store as MarketIcon,
  AccountBalance as TokenIcon,
  MonetizationOn as LoansIcon,
  Assessment as AnalyticsIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

const menuItems = [
  { name: 'Dashboard', icon: <DashboardIcon />, path: '/farmer/dashboard' },
  { name: 'Farm Management', icon: <FarmIcon />, path: '/farmer/farms' },
  { name: 'Crop Management', icon: <CropIcon />, path: '/farmer/crops' },
  { name: 'Weather Forecast', icon: <WeatherIcon />, path: '/farmer/weather' },
  { name: 'Marketplace', icon: <MarketIcon />, path: '/farmer/marketplace' },
  { name: 'Farm Tokenization', icon: <TokenIcon />, path: '/farmer/tokenization' },
  { name: 'Loan Applications', icon: <LoansIcon />, path: '/farmer/loans' },
  { name: 'Analytics', icon: <AnalyticsIcon />, path: '/farmer/analytics' },
  { name: 'Inventory', icon: <InventoryIcon />, path: '/farmer/inventory' },
];

const bottomMenuItems = [
  { name: 'Settings', icon: <SettingsIcon />, path: '/farmer/settings' },
  { name: 'Notifications', icon: <NotificationsIcon />, path: '/farmer/notifications' },
];

export const FarmerNavigation: React.FC = () => {
  const navigate = useNavigate();

  const mockFarmer = {
    name: 'David Wilson',
    role: 'Premium Farmer',
    avatar: 'https://source.unsplash.com/random/100x100/?farmer',
    farmName: 'Green Valley Farm',
    totalAcres: 500,
    activeTokens: 1000,
    cropHealth: 85,
    nextHarvest: '15 days',
    alerts: [
      { type: 'weather', message: 'Rain expected in 2 days' },
      { type: 'crop', message: 'Optimal irrigation time' },
    ],
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
            src={mockFarmer.avatar}
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {mockFarmer.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'primary.main' }}>
              {mockFarmer.role}
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
            Farm Status
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Typography variant="body2">Crop Health</Typography>
            <Typography variant="body2" color="primary.main">
              {mockFarmer.cropHealth}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={mockFarmer.cropHealth}
            sx={{ mt: 1, mb: 2 }}
          />
          
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Next Harvest
          </Typography>
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
            {mockFarmer.nextHarvest}
          </Typography>

          <Box mt={2}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              Active Alerts
            </Typography>
            {mockFarmer.alerts.map((alert, index) => (
              <Chip
                key={index}
                label={alert.message}
                size="small"
                color={alert.type === 'weather' ? 'info' : 'warning'}
                sx={{ mb: 1, width: '100%' }}
              />
            ))}
          </Box>
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

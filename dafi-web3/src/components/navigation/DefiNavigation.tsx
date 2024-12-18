import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Wallet,
  Pool,
  LocalAtm,
  HowToVote,
  Analytics,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DefiNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Token Management', icon: <Wallet />, path: '/defi/tokens' },
    { text: 'Liquidity Pool', icon: <Pool />, path: '/defi/liquidity' },
    { text: 'Staking', icon: <LocalAtm />, path: '/defi/staking' },
    { text: 'Governance', icon: <HowToVote />, path: '/defi/governance' },
    { text: 'Analytics', icon: <Analytics />, path: '/defi/analytics' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );
};

export default DefiNavigation;

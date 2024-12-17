import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';

interface HeaderProps {
  onMenuClick: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  locale: string;
  onLocaleChange: (locale: string) => void;
}

export function Header({ onMenuClick, theme, onThemeToggle, locale, onLocaleChange }: HeaderProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = React.useState<null | HTMLElement>(null);

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

  const isInvestor = router.pathname.includes('investor');

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Theme Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={theme === 'dark'}
                onChange={onThemeToggle}
                icon={<LightModeIcon />}
                checkedIcon={<DarkModeIcon />}
              />
            }
            label=""
          />

          {/* Language Selector */}
          <FormControl size="small">
            <Select
              value={locale}
              onChange={(e) => onLocaleChange(e.target.value as string)}
              sx={{ minWidth: 100 }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
            </Select>
          </FormControl>

          {/* Notifications */}
          <IconButton color="inherit" onClick={handleNotificationsClick}>
            <NotificationsIcon />
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            onClick={handleProfileClick}
            sx={{ p: 0 }}
          >
            <Avatar alt="User Avatar" src="/images/avatar.jpg" />
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem onClick={() => router.push(isInvestor ? '/test/investor-profile' : '/test/farmers-profile')}>
            <ListItemIcon>
              <ProfileIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => router.push(isInvestor ? '/test/investor-settings' : '/test/farmers-settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem>
            <ListItemText 
              primary="New Investment Opportunity" 
              secondary="A new farm is seeking investment..."
            />
          </MenuItem>
          <MenuItem>
            <ListItemText 
              primary="Loan Update" 
              secondary="Your loan application has been approved"
            />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

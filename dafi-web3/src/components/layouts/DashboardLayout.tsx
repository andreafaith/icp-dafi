import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import TopNavigation from './TopNavigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const muiTheme = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNavigation theme={theme} onThemeToggle={toggleTheme} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: theme === 'dark' ? 'grey.900' : 'grey.50',
          pt: { xs: 8, sm: 9 }, // Padding top to account for the navigation bar
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;

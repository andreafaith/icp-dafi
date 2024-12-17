import React from 'react';
import { Box } from '@mui/material';
import DashboardLayout from './DashboardLayout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </DashboardLayout>
  );
};

export default Layout;

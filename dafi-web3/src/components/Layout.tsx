import React from 'react';
import { Box, useTheme } from '@mui/material';
import { DashboardTopNav } from './common/DashboardTopNav';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

// TODO: Replace with actual auth context
const mockUser = {
  name: 'John Doe',
  role: 'farmer' as const,
  avatar: '/images/avatar.jpg'
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const router = useRouter();
  
  // Determine role based on URL
  const userRole = router.pathname.includes('investor') ? 'investor' : 'farmer';
  
  const updatedMockUser = {
    name: 'John Doe',
    role: userRole as 'farmer' | 'investor',
    avatar: '/images/avatar.jpg'
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FDFBF7' }}>
      <DashboardTopNav
        role={updatedMockUser.role}
        userName={updatedMockUser.name}
        userAvatar={updatedMockUser.avatar}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '64px', // height of AppBar
          px: 2,
          width: '100%',
          maxWidth: '1440px',
          mx: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

import React from 'react';
import { Box, useTheme } from '@mui/material';
import DashboardNav from '../../components/navigation/DashboardNav';
import ComingSoon from '../../components/ComingSoon';

const InvestorNotifications = () => {
  const theme = useTheme();

  return (
    <>
      <DashboardNav userType="investor" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.grey[50],
          minHeight: '100vh',
          pt: 2,
        }}
      >
        <ComingSoon 
          title="Notifications Center Coming Soon"
          description="Stay tuned for real-time updates about your investments, returns, and important agricultural events."
        />
      </Box>
    </>
  );
};

export default InvestorNotifications;

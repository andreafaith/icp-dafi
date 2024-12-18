import React from 'react';
import { Box } from '@mui/material';
import { DashboardLayout } from './DashboardLayout';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

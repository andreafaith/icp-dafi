import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../Navbar';
import Footer from '../Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const pages = [
  { title: 'Home', path: '/' },
  { title: 'How It Works', path: '/how-it-works' },
  { title: 'Farms', path: '/farms' },
  { title: 'Invest', path: '/invest' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Navbar pages={pages} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;

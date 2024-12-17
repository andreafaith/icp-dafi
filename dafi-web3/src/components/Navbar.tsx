import React from 'react';
import { AppBar, Toolbar, Box, Button, Container } from '@mui/material';
import { WalletConnect } from './WalletConnect';
import Image from 'next/image';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const navItems = [
    { label: 'Farms', href: '/farms' },
    { label: 'Invest', href: '/invest' },
    { label: 'About', href: '/about' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'transparent',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          padding: '0.5rem 2rem',
          minHeight: '80px'
        }}>
          {/* Logo */}
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Box sx={{ position: 'relative', width: 120, height: 50 }}>
              <Image
                src="/images/logo-night.svg"
                alt="DAFI Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
          </Link>

          {/* Navigation Links and Wallet */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 4
          }}>
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                style={{ textDecoration: 'none' }}
              >
                <Button
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <WalletConnect />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { WalletConnect } from './WalletConnect';
import Image from 'next/image';
import Link from 'next/link';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { label: 'Farmers', href: '/farmers' },
    { label: 'Investors', href: '/investors' },
    { label: 'About', href: '/about' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleWalletClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/register');
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} component={Link} href={item.href}>
            <ListItemText 
              primary={item.label}
              sx={{
                color: theme.palette.primary.main,
                textAlign: 'center',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: alpha(theme.palette.background.paper, 0.8),
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
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
                src="/images/logo-light.svg"
                alt="DAFI Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
          </Link>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
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
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Box sx={{ ml: 2 }}>
                <WalletConnect onClick={handleWalletClick} />
              </Box>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;

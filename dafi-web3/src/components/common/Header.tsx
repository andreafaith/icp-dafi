import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await logout();
    } else {
      await login();
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: '#1B2B1B',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '0.5rem 0',
          }}
        >
          <Link href="/" passHref style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Box sx={{ position: 'relative', width: 40, height: 40, mr: 1 }}>
                <Image
                  src="/images/logo-white.svg"
                  alt="DAFI Logo"
                  layout="fill"
                  objectFit="contain"
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                DAFI
              </Typography>
            </Box>
          </Link>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            <Link href="/how-it-works" passHref>
              <Button
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'primary.light',
                  },
                }}
              >
                How It Works
              </Button>
            </Link>
            <Link href="/learn-more" passHref>
              <Button
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'primary.light',
                  },
                }}
              >
                Learn More
              </Button>
            </Link>
            <Link href="/get-started" passHref>
              <Button
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'primary.light',
                  },
                }}
              >
                Get Started
              </Button>
            </Link>
            <Link href="/farms" passHref>
              <Button
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'primary.light',
                  },
                }}
              >
                Farms
              </Button>
            </Link>
            <Link href="/invest" passHref>
              <Button
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'primary.light',
                  },
                }}
              >
                Invest
              </Button>
            </Link>
            <Link href="/about" passHref>
              <Button
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'primary.light',
                  },
                }}
              >
                About
              </Button>
            </Link>
            <Button
              variant="contained"
              onClick={handleAuth}
              disabled={isLoading}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                minWidth: '120px',
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isAuthenticated ? (
                'Disconnect'
              ) : (
                'Connect Wallet'
              )}
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link href="/how-it-works" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  How It Works
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/learn-more" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  Learn More
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/get-started" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  Get Started
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/farms" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  Farms
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/invest" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  Invest
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/about" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  About
                </Link>
              </MenuItem>
              <MenuItem onClick={() => { handleAuth(); handleClose(); }}>
                {isAuthenticated ? 'Disconnect' : 'Connect Wallet'}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

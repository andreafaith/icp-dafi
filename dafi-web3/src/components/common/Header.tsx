import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  useTheme,
  useScrollTrigger,
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
  const theme = useTheme();
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
            justifyContent: 'space-between', 
            py: { xs: 1, md: 1.5 },
          }}
        >
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.3s ease',
                },
              }}
            >
              <Image
                src="/images/logo-white.svg"
                alt="DAFI Logo"
                width={100}
                height={100}
                style={{ 
                  objectFit: 'contain',
                }}
                priority={true}
                unoptimized={true}
              />
            </Box>
          </Link>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{ color: '#fff' }}
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
              PaperProps={{
                sx: {
                  background: 'rgba(24, 41, 24, 0.95)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                }
              }}
            >
              <MenuItem onClick={handleClose}>
                <Link href="/how-it-works" passHref legacyBehavior>
                  <a style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>How It Works</a>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/learn-more" passHref legacyBehavior>
                  <a style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>Learn More</a>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/get-started" passHref legacyBehavior>
                  <a style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>Get Started</a>
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
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Link href="/how-it-works" passHref legacyBehavior>
              <Button component="a" sx={{ color: 'white' }}>How It Works</Button>
            </Link>
            <Link href="/learn-more" passHref legacyBehavior>
              <Button component="a" sx={{ color: 'white' }}>Learn More</Button>
            </Link>
            <Link href="/get-started" passHref legacyBehavior>
              <Button component="a" sx={{ color: 'white' }}>Get Started</Button>
            </Link>
          </Box>

          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Link href="/farms" passHref style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  position: 'relative',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: 0,
                    height: 2,
                    background: '#fff',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover::after': {
                    width: '100%',
                  },
                }}
              >
                Farms
              </Typography>
            </Link>
            <Link href="/invest" passHref style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  position: 'relative',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: 0,
                    height: 2,
                    background: '#fff',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover::after': {
                    width: '100%',
                  },
                }}
              >
                Invest
              </Typography>
            </Link>
            <Link href="/about" passHref style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  position: 'relative',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: 0,
                    height: 2,
                    background: '#fff',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover::after': {
                    width: '100%',
                  },
                }}
              >
                About
              </Typography>
            </Link>
            <Button
              variant="contained"
              onClick={handleAuth}
              disabled={isLoading}
              sx={{
                ml: 2,
                px: 3,
                py: 0.8,
                backgroundColor: 'rgba(74, 123, 60, 0.9)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                minWidth: 'auto',
                height: '36px',
                '&:hover': {
                  backgroundColor: 'rgba(92, 154, 75, 0.9)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : isAuthenticated ? (
                'Disconnect'
              ) : (
                'Connect Wallet'
              )}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

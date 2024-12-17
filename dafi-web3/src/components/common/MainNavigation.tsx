import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  useTheme,
  alpha,
  useScrollTrigger,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export const MainNavigation = () => {
  const theme = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConnectWallet = () => {
    // TODO: Implement wallet connection
    console.log('Connect wallet clicked');
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={isScrolled ? 2 : 0}
      sx={{
        background: isScrolled 
          ? alpha(theme.palette.background.paper, 0.8)
          : 'transparent',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <Link 
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <Image
                src={isScrolled ? "/images/logo-white.svg" : "/images/logo-night.svg"}
                alt="DaFi Logo"
                width={60}
                height={60}
                priority
              />
            </Link>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              '& a': {
                textDecoration: 'none',
              }
            }}
          >
            <Link href="/farmers" passHref>
              <Button 
                sx={{ 
                  color: isScrolled 
                    ? theme.palette.text.primary 
                    : theme.palette.common.white,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                Farmers
              </Button>
            </Link>
            <Link href="/investors" passHref>
              <Button 
                sx={{ 
                  color: isScrolled 
                    ? theme.palette.text.primary 
                    : theme.palette.common.white,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                Investors
              </Button>
            </Link>
            <Link href="/about" passHref>
              <Button 
                sx={{ 
                  color: isScrolled 
                    ? theme.palette.text.primary 
                    : theme.palette.common.white,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                About
              </Button>
            </Link>
            <Button 
              variant="contained"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={handleConnectWallet}
              sx={{ 
                background: 'linear-gradient(45deg, #2E5B2E 30%, #4CAF50 90%)',
                boxShadow: isScrolled 
                  ? '0 4px 12px rgba(76, 175, 80, 0.2)'
                  : 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1F3F1F 30%, #388E3C 90%)',
                }
              }}
            >
              Connect Wallet
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainNavigation;

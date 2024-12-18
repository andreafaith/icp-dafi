import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      setError('');
      await login();
      // The redirect will be handled in the AuthContext after role check
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        py: 12,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Logo />
          </Box>
          
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Welcome to DAFI
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Decentralized Agricultural Finance Platform
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Login using Internet Identity to access your dashboard
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={isLoading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                position: 'relative',
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Connect with Internet Identity'
              )}
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;

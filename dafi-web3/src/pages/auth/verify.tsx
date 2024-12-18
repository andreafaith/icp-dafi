import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Logo } from '../../components/Logo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const VerifyEmail = () => {
  const router = useRouter();
  const theme = useTheme();
  const { token } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully!');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, router]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Logo />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ mb: 3 }}>
              {status === 'loading' && (
                <CircularProgress size={60} thickness={4} />
              )}
              {status === 'success' && (
                <CheckCircleIcon
                  sx={{ fontSize: 60, color: theme.palette.success.main }}
                />
              )}
              {status === 'error' && (
                <ErrorIcon
                  sx={{ fontSize: 60, color: theme.palette.error.main }}
                />
              )}
            </Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: status === 'error' ? 'error.main' : 'text.primary',
              }}
            >
              {message}
            </Typography>
            {status === 'success' && (
              <Typography variant="body1" color="text.secondary">
                Redirecting you to login...
              </Typography>
            )}
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default VerifyEmail;

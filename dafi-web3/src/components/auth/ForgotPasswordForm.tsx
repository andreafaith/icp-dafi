import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import NextLink from 'next/link';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordForm: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError('Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        mx: 'auto',
        p: 3,
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Reset Password
      </Typography>

      <Typography variant="body2" color="textSecondary" align="center" mb={2}>
        Enter your email address and we'll send you instructions to reset your password.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && (
        <Alert severity="success">
          Password reset instructions have been sent to your email
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        disabled={success}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={loading || success}
        fullWidth
      >
        {loading ? 'Sending...' : 'Send Reset Instructions'}
      </Button>

      <Box display="flex" justifyContent="center" mt={2}>
        <NextLink href="/auth/signin" passHref>
          <Link>Back to Sign In</Link>
        </NextLink>
      </Box>
    </Box>
  );
};

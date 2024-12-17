import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7F5', pt: 8 }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ mb: 3, fontWeight: 600, color: '#1B2B1B' }}
            >
              Oops! Something went wrong
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 4 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                bgcolor: '#4A7B3C',
                '&:hover': { bgcolor: '#5C9A4B' },
              }}
            >
              Reload Page
            </Button>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

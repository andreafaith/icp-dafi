import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2,
      }}
    >
      <CircularProgress
        sx={{
          color: '#4A7B3C',
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: '#666',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;

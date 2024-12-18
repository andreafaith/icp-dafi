import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Construction } from '@mui/icons-material';

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 6, 
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: 4
        }}
      >
        <Construction sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            {description}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ComingSoon;

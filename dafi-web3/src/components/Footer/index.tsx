import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'primary.dark',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' DAFI - '}
          <Link
            color="inherit"
            href="https://github.com/your-username/dafi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Decentralized Agricultural Finance Initiative
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

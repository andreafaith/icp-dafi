import React from 'react';
import { Box, Container, Typography, Button, Card, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  backgroundColor?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
  backgroundColor,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: backgroundColor || alpha(theme.palette.primary.main, 0.05),
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              textAlign: 'center',
              p: { xs: 4, md: 6 },
              backgroundColor: 'white',
              boxShadow: theme.shadows[20],
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              {description}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={onButtonClick}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              {buttonText}
            </Button>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTASection;

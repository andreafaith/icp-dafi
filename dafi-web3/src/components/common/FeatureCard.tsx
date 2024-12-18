import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import Image from 'next/image';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  imagePath: string;
}

const FeatureCard = ({ title, description, icon, imagePath }: FeatureCardProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '60px',
          borderRadius: '15px',
          background: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" sx={{ color: 'white' }}>
          {icon}
        </Typography>
      </Box>

      <CardContent sx={{ pt: 5, pb: 3, px: 3, flex: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            mb: 2,
            textAlign: 'center',
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
        
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '160px',
            mb: 2,
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <Image
            src={imagePath}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

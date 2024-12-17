import React from 'react';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import Image from 'next/image';
import { keyframes } from '@mui/system';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const butterflyPath1 = keyframes`
  0% { transform: translate(-100px, 100px) rotate(10deg); }
  10% { transform: translate(10vw, 0px) rotate(-5deg); }
  20% { transform: translate(25vw, -100px) rotate(-15deg); }
  30% { transform: translate(40vw, -150px) rotate(-10deg); }
  40% { transform: translate(60vw, -50px) rotate(5deg); }
  50% { transform: translate(90vw, 100px) rotate(20deg); }
  60% { transform: translate(70vw, 200px) rotate(15deg); }
  70% { transform: translate(50vw, 250px) rotate(0deg); }
  80% { transform: translate(40vw, 300px) rotate(-10deg); }
  90% { transform: translate(20vw, 200px) rotate(-5deg); }
  100% { transform: translate(-100px, 100px) rotate(10deg); }
`;

const butterflyPath2 = keyframes`
  0% { transform: translate(100vw, -100px) rotate(-15deg); }
  10% { transform: translate(80vw, 0px) rotate(-5deg); }
  20% { transform: translate(60vw, 100px) rotate(10deg); }
  30% { transform: translate(50vw, 200px) rotate(20deg); }
  40% { transform: translate(30vw, 150px) rotate(10deg); }
  50% { transform: translate(-100px, 150px) rotate(-10deg); }
  60% { transform: translate(10vw, 50px) rotate(-15deg); }
  70% { transform: translate(20vw, -50px) rotate(-5deg); }
  80% { transform: translate(30vw, -100px) rotate(15deg); }
  90% { transform: translate(80vw, -150px) rotate(-5deg); }
  100% { transform: translate(100vw, -100px) rotate(-15deg); }
`;

const butterflyPath3 = keyframes`
  0% { transform: translate(50vw, 400px) rotate(20deg); }
  10% { transform: translate(30vw, 300px) rotate(15deg); }
  20% { transform: translate(10vw, 250px) rotate(0deg); }
  30% { transform: translate(-100px, 200px) rotate(-15deg); }
  40% { transform: translate(20vw, 100px) rotate(-5deg); }
  50% { transform: translate(100vw, 0px) rotate(10deg); }
  60% { transform: translate(80vw, 100px) rotate(15deg); }
  70% { transform: translate(60vw, 200px) rotate(5deg); }
  80% { transform: translate(30vw, 300px) rotate(-20deg); }
  90% { transform: translate(40vw, 350px) rotate(-10deg); }
  100% { transform: translate(50vw, 400px) rotate(20deg); }
`;

const flutter = keyframes`
  0% { transform: scaleX(1) rotate(0deg); }
  25% { transform: scaleX(0.9) rotate(2deg); }
  50% { transform: scaleX(0.85) rotate(0deg); }
  75% { transform: scaleX(0.9) rotate(-2deg); }
  100% { transform: scaleX(1) rotate(0deg); }
`;

const shine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  imagePath: string;
  imageAlt: string;
  gradient?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  imagePath,
  imageAlt,
  gradient,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: gradient || `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, rgba(74, 123, 60, 0.3) 0%, rgba(27, 43, 27, 0) 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'url("/images/grid-pattern.png")',
          backgroundSize: '50px 50px',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'inherit',
            animation: `${float} 20s linear infinite`,
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 4, md: 8 },
            pt: { xs: 8, md: 0 },
          }}
        >
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '50%' } }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                color: '#fff',
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                background: 'linear-gradient(45deg, #fff 30%, #ECF39E 90%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: `${shine} 3s linear infinite`,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 4,
                maxWidth: '600px',
                lineHeight: 1.6,
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              {subtitle}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#4A7B3C',
                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#5C9A4B',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.5)',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#fff',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: '100%', md: '50%' },
              position: 'relative',
              height: { xs: '300px', md: '500px' },
            }}
          >
            <Image
              src={imagePath}
              alt={imageAlt}
              fill
              style={{
                objectFit: 'cover',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
              priority
            />
          </Box>
        </Box>
      </Container>

      {/* Animated Butterflies */}
      {[...Array(4)].map((_, i) => {
        const paths = [butterflyPath1, butterflyPath2, butterflyPath3];
        const path = paths[i % paths.length];
        const duration = 40 + i * 5; // Longer duration for smoother movement
        const delay = i * -10;
        
        return (
          <Box
            key={`butterfly-${i}`}
            sx={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              top: 0,
              left: 0,
              background: 'url("/images/butterfly.png")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              animation: `${path} ${duration}s ${delay}s infinite cubic-bezier(0.4, 0, 0.2, 1), ${flutter} 1s infinite ease-in-out`,
              zIndex: 1,
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
              opacity: 0.9,
              transformOrigin: 'center',
              transition: 'all 0.3s ease',
              willChange: 'transform', // Optimize animation performance
              '&:hover': {
                transform: 'scale(1.2)',
                opacity: 1,
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.4))',
              },
            }}
          />
        );
      })}
    </Box>
  );
};

export default HeroSection;

import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 120, height = 40 }: LogoProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Image
        src="/images/logo-white.svg"
        alt="DaFi Logo"
        width={width}
        height={height}
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </Box>
  );
};

export default Logo;

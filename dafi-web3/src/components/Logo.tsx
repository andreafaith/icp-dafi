import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 180, height = 70 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
          mt: 2,
        }}
      >
        <Image
          src="/images/logo-night.svg"
          alt="DAFI Logo"
          width={width}
          height={height}
          priority
          style={{
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
          }}
        />
      </Box>
    </motion.div>
  );
};

export default Logo;

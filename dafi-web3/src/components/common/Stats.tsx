import React from 'react';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface StatItemProps {
  value: string;
  label: string;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, delay = 0 }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 3,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          borderRadius: 2,
          '&:hover': {
            transform: 'translateY(-5px)',
            transition: 'transform 0.3s ease-in-out',
          },
        }}
      >
        <Typography variant="h3" component="div" gutterBottom>
          {value}
        </Typography>
        <Typography variant="subtitle1">{label}</Typography>
      </Paper>
    </motion.div>
  );
};

interface StatsProps {
  stats: Array<{ value: string; label: string }>;
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatItem
              value={stat.value}
              label={stat.label}
              delay={index * 0.1}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Stats;

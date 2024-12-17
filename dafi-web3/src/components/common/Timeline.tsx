import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { motion } from 'framer-motion';

const timelineItems = [
  {
    title: 'Farm Registration',
    description: 'Farmers register their farms and assets on the DAFI platform, providing detailed information about their operations.',
  },
  {
    title: 'Asset Tokenization',
    description: 'Agricultural assets are converted into digital tokens representing ownership shares, crop yields, or land use rights.',
  },
  {
    title: 'Investment Opportunities',
    description: 'Investors can browse and select from various agricultural investment opportunities with transparent risk assessments.',
  },
  {
    title: 'Smart Contract Deployment',
    description: 'Secure smart contracts are deployed to manage investments, ensuring transparent and automated execution of agreements.',
  },
  {
    title: 'Monitoring & Returns',
    description: 'Real-time monitoring of farm operations and automated distribution of returns to stakeholders.',
  },
];

const TimelineSection = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h3" 
        component="h2" 
        textAlign="center" 
        gutterBottom
        sx={{ color: 'white' }}
      >
        How It Works
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Timeline position="alternate">
          {timelineItems.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <TimelineDot sx={{ bgcolor: '#4CAF50' }} />
                </motion.div>
                {index < timelineItems.length - 1 && (
                  <TimelineConnector sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }} />
                )}
              </TimelineSeparator>
              <TimelineContent>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ color: 'white' }}
                  >
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {item.description}
                  </Typography>
                </motion.div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    </Container>
  );
};

export default TimelineSection;

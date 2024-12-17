import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const problems = [
  {
    title: 'Limited Access to Capital',
    description: 'Small-scale farms struggle to access traditional financing due to perceived high risks and lack of formal business structures.',
  },
  {
    title: 'Business Structure Challenges',
    description: 'Many farms operate as sole proprietorships with limited financial records, making it difficult for investors to assess their potential.',
  },
  {
    title: 'Financial Skills Gap',
    description: 'Farmers often lack the business and financial expertise needed to create compelling investment pitches and financial projections.',
  },
  {
    title: 'Market Competition',
    description: 'Agricultural sector faces stiff competition for investment capital from other sectors perceived as having higher growth potential.',
  },
];

const ProblemSection = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          The Challenge
        </Typography>
        <Typography variant="subtitle1" textAlign="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
          Small-scale farms, crucial for food security and rural livelihoods, face significant barriers to growth
        </Typography>
        <Grid container spacing={4}>
          {problems.map((problem, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                >
                  <Typography variant="h5" component="h3" gutterBottom color="primary">
                    {problem.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {problem.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProblemSection;

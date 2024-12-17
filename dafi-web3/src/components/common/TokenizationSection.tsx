import { Box, Container, Grid, Typography, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import { Agriculture, Pets, Landscape, AccountBalance } from '@mui/icons-material';
import { motion } from 'framer-motion';

const tokenTypes = [
  {
    title: 'Crop Tokens',
    icon: <Agriculture />,
    items: [
      'Ownership of specific crop yields',
      'Derivative contracts for price hedging',
      'Weather derivatives for climate risks',
      'Insurance tokens for crop protection',
    ],
  },
  {
    title: 'Livestock Tokens',
    icon: <Pets />,
    items: [
      'Ownership shares in livestock',
      'Milk/Meat production tokens',
      'Livestock insurance coverage',
      'Performance-based returns',
    ],
  },
  {
    title: 'Land Use Rights',
    icon: <Landscape />,
    items: [
      'Temporary/Long-term land rights',
      'Carbon sequestration credits',
      'Biodiversity incentive tokens',
      'Sustainable farming rewards',
    ],
  },
  {
    title: 'DeFi Features',
    icon: <AccountBalance />,
    items: [
      'Automated Market Makers (AMM)',
      'Yield farming opportunities',
      'Liquidity provision rewards',
      'Governance participation',
    ],
  },
];

const TokenizationSection = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Asset Tokenization
        </Typography>
        <Typography variant="subtitle1" textAlign="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
          Transform agricultural assets into tradeable digital tokens
        </Typography>
        <Grid container spacing={4}>
          {tokenTypes.map((type, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {type.icon}
                      </Avatar>
                    }
                    title={type.title}
                  />
                  <CardContent>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {type.items.map((item, itemIndex) => (
                        <Box component="li" key={itemIndex} sx={{ mb: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TokenizationSection;

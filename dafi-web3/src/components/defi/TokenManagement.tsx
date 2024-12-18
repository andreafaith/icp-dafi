import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Wallet, SwapHoriz, Send } from '@mui/icons-material';

interface TokenProps {
  balance: string;
  symbol: string;
  price: number;
  change24h: number;
}

const TokenManagement: React.FC = () => {
  const mockTokens: TokenProps[] = [
    { balance: '1000', symbol: 'DAFI', price: 2.5, change24h: 5.2 },
    { balance: '500', symbol: 'USDC', price: 1.0, change24h: 0.1 },
    { balance: '250', symbol: 'ETH', price: 2000, change24h: -2.3 },
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Wallet sx={{ mr: 1 }} />
          <Typography variant="h6">Token Management</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Your Tokens
                </Typography>
                <List>
                  {mockTokens.map((token, index) => (
                    <React.Fragment key={token.symbol}>
                      <ListItem>
                        <ListItemText
                          primary={`${token.balance} ${token.symbol}`}
                          secondary={`$${token.price} (${token.change24h > 0 ? '+' : ''}${
                            token.change24h
                          }%)`}
                        />
                        <Box>
                          <Button
                            size="small"
                            startIcon={<SwapHoriz />}
                            sx={{ mr: 1 }}
                          >
                            Swap
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Send />}
                          >
                            Send
                          </Button>
                        </Box>
                      </ListItem>
                      {index < mockTokens.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Quick Swap
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="From"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    sx={{ mb: 2 }}
                  >
                    {mockTokens.map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="To"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    sx={{ mb: 2 }}
                  >
                    {mockTokens.map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    sx={{ mb: 2 }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<SwapHoriz />}
                  >
                    Swap Tokens
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TokenManagement;

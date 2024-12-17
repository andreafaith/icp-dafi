import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Send as SendIcon,
  SwapHoriz as SwapIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import Layout from '@/components/layouts/Layout';

interface Token {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change24h: number;
}

const TokenManagement = () => {
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Mock token data
  const tokens: Token[] = [
    {
      symbol: 'DAFI',
      name: 'DAFI Token',
      balance: '10,000.00',
      value: '$5,000.00',
      change24h: 5.67,
    },
    {
      symbol: 'ICP',
      name: 'Internet Computer',
      balance: '25.50',
      value: '$2,500.00',
      change24h: -2.34,
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: '0.15',
      value: '$7,500.00',
      change24h: 1.23,
    },
  ];

  const handleSendToken = (token: Token) => {
    setSelectedToken(token);
    setSendDialogOpen(true);
  };

  const totalValue = tokens.reduce((acc, token) => {
    return acc + parseFloat(token.value.replace('$', '').replace(',', ''));
  }, 0);

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Portfolio Overview */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Token Portfolio
                </Typography>
                <Typography variant="h4">
                  ${totalValue.toLocaleString()}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => handleSendToken(tokens[0])}
                  >
                    Send
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SwapIcon />}
                  >
                    Swap
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                  >
                    Buy
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Token List */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Tokens
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Token</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="right">24h Change</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokens.map((token) => (
                  <TableRow key={token.symbol}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle2">{token.symbol}</Typography>
                        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                          {token.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{token.balance}</TableCell>
                    <TableCell align="right">{token.value}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${token.change24h > 0 ? '+' : ''}${token.change24h}%`}
                        color={token.change24h > 0 ? 'success' : 'error'}
                        icon={token.change24h > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleSendToken(token)}
                      >
                        <SendIcon />
                      </IconButton>
                      <IconButton size="small">
                        <SwapIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Send Token Dialog */}
        <Dialog
          open={sendDialogOpen}
          onClose={() => setSendDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Send {selectedToken?.symbol}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Recipient Address"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Amount"
                fullWidth
                margin="normal"
                type="number"
                InputProps={{
                  endAdornment: selectedToken?.symbol,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSendDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => setSendDialogOpen(false)}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default TokenManagement;

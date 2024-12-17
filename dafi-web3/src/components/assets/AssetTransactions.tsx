import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Link,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  amount: string;
  price: string;
  total: string;
  from: string;
  to: string;
  timestamp: string;
  hash: string;
}

interface AssetTransactionsProps {
  transactions: Transaction[];
}

export const AssetTransactions: React.FC<AssetTransactionsProps> = ({
  transactions,
}) => {
  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'success';
      case 'sell':
        return 'error';
      default:
        return 'primary';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Time</TableCell>
                <TableCell align="right">Hash</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell>
                    <Chip
                      label={tx.type.toUpperCase()}
                      size="small"
                      color={getTransactionTypeColor(tx.type) as any}
                      icon={
                        tx.type === 'buy' ? (
                          <ArrowDownwardIcon />
                        ) : tx.type === 'sell' ? (
                          <ArrowUpwardIcon />
                        ) : undefined
                      }
                    />
                  </TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.price}</TableCell>
                  <TableCell>{tx.total}</TableCell>
                  <TableCell>
                    <Link
                      href={`/address/${tx.from}`}
                      underline="hover"
                      color="inherit"
                    >
                      {formatAddress(tx.from)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/address/${tx.to}`}
                      underline="hover"
                      color="inherit"
                    >
                      {formatAddress(tx.to)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={new Date(tx.timestamp).toLocaleString()}>
                      <span>
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          mr: 1,
                        }}
                      >
                        {formatAddress(tx.hash)}
                      </Typography>
                      <Tooltip title="View in Explorer">
                        <IconButton
                          size="small"
                          component={Link}
                          href={`/tx/${tx.hash}`}
                          target="_blank"
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

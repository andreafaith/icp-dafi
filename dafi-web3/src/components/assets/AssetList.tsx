import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  value: number;
  change24h: number;
  icon: string;
}

interface AssetListProps {
  assets: Asset[];
}

export const AssetList: React.FC<AssetListProps> = ({ assets }) => {
  return (
    <Paper elevation={0} variant="outlined">
      <List>
        {assets.map((asset) => (
          <ListItem
            key={asset.id}
            divider
            sx={{
              '&:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            <ListItemAvatar>
              <Avatar src={asset.icon} alt={asset.name}>
                {asset.symbol[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle1">{asset.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {asset.symbol}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography variant="body2" color="textSecondary">
                  Balance: {asset.balance} {asset.symbol}
                </Typography>
              }
            />
            <Box textAlign="right">
              <Typography variant="subtitle1">
                ${asset.value.toLocaleString()}
              </Typography>
              <Chip
                size="small"
                icon={asset.change24h >= 0 ? <TrendingUp /> : <TrendingDown />}
                label={`${asset.change24h >= 0 ? '+' : ''}${asset.change24h}%`}
                color={asset.change24h >= 0 ? 'success' : 'error'}
                variant="outlined"
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

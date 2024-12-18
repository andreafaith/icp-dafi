import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface Farm {
  id: string;
  name: string;
  location: string;
  size: string;
  crops: string[];
  status: 'Active' | 'Pending';
  currentValue: number;
  investment: number;
}

const initialFarms: Farm[] = [
  {
    id: '1',
    name: 'Green Valley Farm',
    location: 'California, USA',
    size: '500 acres',
    crops: ['Corn', 'Soybeans'],
    status: 'Active',
    currentValue: 500000,
    investment: 250000,
  },
  {
    id: '2',
    name: 'Sunrise Orchards',
    location: 'Washington, USA',
    size: '200 acres',
    crops: ['Apples', 'Pears'],
    status: 'Pending',
    currentValue: 300000,
    investment: 0,
  },
];

export const FarmManagement: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>(initialFarms);
  const [openDialog, setOpenDialog] = useState(false);
  const [newFarm, setNewFarm] = useState({
    name: '',
    location: '',
    size: '',
    crops: '',
  });

  const handleAddFarm = () => {
    const farm: Farm = {
      id: (farms.length + 1).toString(),
      name: newFarm.name,
      location: newFarm.location,
      size: newFarm.size,
      crops: newFarm.crops.split(',').map(crop => crop.trim()),
      status: 'Pending',
      currentValue: 0,
      investment: 0,
    };

    setFarms([...farms, farm]);
    setOpenDialog(false);
    setNewFarm({ name: '', location: '', size: '', crops: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFarm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Farm Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add New Farm
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Farm Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Crops</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Current Value</TableCell>
              <TableCell>Investment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {farms.map((farm) => (
              <TableRow key={farm.id}>
                <TableCell>{farm.name}</TableCell>
                <TableCell>{farm.location}</TableCell>
                <TableCell>{farm.size}</TableCell>
                <TableCell>
                  {farm.crops.map((crop) => (
                    <Chip
                      key={crop}
                      label={crop}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Chip
                    label={farm.status}
                    color={farm.status === 'Active' ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>${farm.currentValue.toLocaleString()}</TableCell>
                <TableCell>${farm.investment.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Farm</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Farm Name"
                name="name"
                value={newFarm.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={newFarm.location}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Size (in acres)"
                name="size"
                value={newFarm.size}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Crops (comma-separated)"
                name="crops"
                value={newFarm.crops}
                onChange={handleInputChange}
                helperText="Enter crops separated by commas"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddFarm} variant="contained" color="primary">
            Add Farm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

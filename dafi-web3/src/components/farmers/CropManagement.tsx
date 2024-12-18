import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Agriculture as AgricultureIcon,
  WaterDrop as WaterIcon,
  Eco as EcoIcon,
} from '@mui/icons-material';

interface Crop {
  id: number;
  name: string;
  plantingDate: string;
  expectedHarvest: string;
  area: number;
  status: 'Planted' | 'Growing' | 'Ready for Harvest';
  health: number;
  waterLevel: number;
  nutrientLevel: number;
}

const mockCrops: Crop[] = [
  {
    id: 1,
    name: 'Corn',
    plantingDate: '2024-03-15',
    expectedHarvest: '2024-08-15',
    area: 100,
    status: 'Growing',
    health: 85,
    waterLevel: 70,
    nutrientLevel: 90,
  },
  {
    id: 2,
    name: 'Soybeans',
    plantingDate: '2024-04-01',
    expectedHarvest: '2024-09-01',
    area: 150,
    status: 'Planted',
    health: 95,
    waterLevel: 80,
    nutrientLevel: 85,
  },
];

export const CropManagement: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>(mockCrops);
  const [open, setOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [newCrop, setNewCrop] = useState({
    name: '',
    plantingDate: '',
    expectedHarvest: '',
    area: '',
  });

  const handleAddCrop = () => {
    setSelectedCrop(null);
    setNewCrop({
      name: '',
      plantingDate: '',
      expectedHarvest: '',
      area: '',
    });
    setOpen(true);
  };

  const handleEditCrop = (crop: Crop) => {
    setSelectedCrop(crop);
    setNewCrop({
      name: crop.name,
      plantingDate: crop.plantingDate,
      expectedHarvest: crop.expectedHarvest,
      area: crop.area.toString(),
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (selectedCrop) {
      setCrops(crops.map(crop => 
        crop.id === selectedCrop.id
          ? {
              ...crop,
              name: newCrop.name,
              plantingDate: newCrop.plantingDate,
              expectedHarvest: newCrop.expectedHarvest,
              area: Number(newCrop.area),
            }
          : crop
      ));
    } else {
      setCrops([
        ...crops,
        {
          id: crops.length + 1,
          name: newCrop.name,
          plantingDate: newCrop.plantingDate,
          expectedHarvest: newCrop.expectedHarvest,
          area: Number(newCrop.area),
          status: 'Planted',
          health: 100,
          waterLevel: 100,
          nutrientLevel: 100,
        },
      ]);
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setCrops(crops.filter(crop => crop.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planted':
        return 'info';
      case 'Growing':
        return 'warning';
      case 'Ready for Harvest':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center">
              <AgricultureIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h6">Crop Management</Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCrop}
            >
              Add Crop
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Crop</TableCell>
                  <TableCell>Planting Date</TableCell>
                  <TableCell>Expected Harvest</TableCell>
                  <TableCell>Area (acres)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Health</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {crops.map((crop) => (
                  <TableRow key={crop.id}>
                    <TableCell>{crop.name}</TableCell>
                    <TableCell>{crop.plantingDate}</TableCell>
                    <TableCell>{crop.expectedHarvest}</TableCell>
                    <TableCell>{crop.area}</TableCell>
                    <TableCell>
                      <Chip
                        label={crop.status}
                        color={getStatusColor(crop.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ minWidth: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={crop.health}
                            color="success"
                          />
                        </Box>
                        <Typography variant="body2">{crop.health}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditCrop(crop)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(crop.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <WaterIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Water Management</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Average water level across all crops
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <EcoIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Nutrient Levels</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Average nutrient level across all crops
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={88}
                    color="success"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedCrop ? 'Edit Crop' : 'Add New Crop'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Crop Name"
                value={newCrop.name}
                onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Planting Date"
                type="date"
                value={newCrop.plantingDate}
                onChange={(e) => setNewCrop({ ...newCrop, plantingDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expected Harvest"
                type="date"
                value={newCrop.expectedHarvest}
                onChange={(e) => setNewCrop({ ...newCrop, expectedHarvest: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Area (acres)"
                type="number"
                value={newCrop.area}
                onChange={(e) => setNewCrop({ ...newCrop, area: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {selectedCrop ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

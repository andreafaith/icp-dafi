import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Rating,
  InputAdornment,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  LocalOffer as OfferIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  image: string;
  rating: number;
  seller: string;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Corn',
    description: 'Fresh organic corn harvested from sustainable farms',
    price: 2.99,
    quantity: 1000,
    unit: 'kg',
    category: 'Grains',
    image: 'https://source.unsplash.com/random/400x300/?corn',
    rating: 4.5,
    seller: 'Green Valley Farm',
  },
  {
    id: '2',
    name: 'Premium Soybeans',
    description: 'High-quality soybeans perfect for processing',
    price: 3.49,
    quantity: 2000,
    unit: 'kg',
    category: 'Legumes',
    image: 'https://source.unsplash.com/random/400x300/?soybeans',
    rating: 4.2,
    seller: 'Sunrise Farms',
  },
];

export const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    unit: '',
    category: '',
  });

  const handleAddProduct = () => {
    const product: Product = {
      id: (products.length + 1).toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity),
      unit: newProduct.unit,
      category: newProduct.category,
      image: `https://source.unsplash.com/random/400x300/?${newProduct.category.toLowerCase()}`,
      rating: 0,
      seller: 'Your Farm',
    };

    setProducts([...products, product]);
    setOpenDialog(false);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      quantity: '',
      unit: '',
      category: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Marketplace</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          List New Product
        </Button>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {product.description}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="h6" color="primary">
                    ${product.price}/{product.unit}
                  </Typography>
                  <Chip
                    label={product.category}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="body2">
                    Available: {product.quantity} {product.unit}
                  </Typography>
                  <Rating value={product.rating} readOnly precision={0.5} />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    Seller: {product.seller}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<CartIcon />}
                    size="small"
                  >
                    Purchase
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>List New Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={newProduct.price}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={newProduct.quantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unit"
                name="unit"
                value={newProduct.unit}
                onChange={handleInputChange}
                placeholder="kg, lb, pieces"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                placeholder="Grains, Vegetables, Fruits"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddProduct}
            variant="contained"
            color="primary"
          >
            List Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Factory as FactoryIcon,
} from '@mui/icons-material';
import { addProduction, updateProductionStatus, deleteProduction } from '../redux/slices/businessSlice';
import { format } from 'date-fns';

const ProductionPage = () => {
  const dispatch = useDispatch();
  const { productions, isLoading } = useSelector((state) => state.business);
  const auth = getAuth();
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    batchNumber: '',
    productType: '',
    quantity: '',
    unitCost: '',
    totalCost: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleStatusUpdate = async (id, status) => {
    try {
      await dispatch(updateProductionStatus({ id, status })).unwrap();
    } catch (error) {
      console.error('Error updating production status:', error);
    }
  };

  const handleEdit = (production) => {
    setFormData(production);
    setEditMode(true);
    setSelectedId(production.id);
    setOpen(true);
  };

  const resetForm = () => {
    setFormData({
      batchNumber: '',
      productType: '',
      quantity: '',
      unitCost: '',
      totalCost: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setEditMode(false);
    setSelectedId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity' || name === 'unitCost') {
      const quantity = name === 'quantity' ? value : formData.quantity;
      const unitCost = name === 'unitCost' ? value : formData.unitCost;
      const totalCost = (parseFloat(quantity) || 0) * (parseFloat(unitCost) || 0);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        totalCost: totalCost.toFixed(2),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const totalProduction = productions.reduce((sum, prod) => sum + (parseFloat(prod.totalCost) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productionData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        unitCost: parseFloat(formData.unitCost),
        totalCost: parseFloat(formData.totalCost),
      };

      if (editMode && selectedId) {
        await dispatch(updateProductionStatus({ 
          id: selectedId, 
          status: formData.status 
        })).unwrap();
      } else {
        await dispatch(addProduction({ 
          productionData,
          userId: auth.currentUser.uid 
        })).unwrap();
      }

      handleDialogClose();
    } catch (error) {
      console.error('Error saving production:', error);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Production Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage production batches and inventory
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          Add Production
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FactoryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Batches
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {productions.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FactoryIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Cost
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    ৳{totalProduction.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Production Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Production Batches
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Batch Number</TableCell>
                  <TableCell>Product Type</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Cost</TableCell>
                  <TableCell>Total Cost</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productions.map((production) => (
                  <TableRow key={production.id}>
                    <TableCell>{production.batchNumber}</TableCell>
                    <TableCell>{production.productType}</TableCell>
                    <TableCell>{production.quantity}</TableCell>
                    <TableCell>৳{parseFloat(production.unitCost).toLocaleString()}</TableCell>
                    <TableCell>৳{parseFloat(production.totalCost).toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(production.date), 'PP')}</TableCell>
                    <TableCell>
                      <Chip label="Completed" color="success" size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small"
                        onClick={() => handleEdit(production)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this production?')) {
                            dispatch(deleteProduction(production.id));
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Production Dialog */}
      <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Production Batch' : 'Add Production Batch'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Batch Number"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Product Type"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit Cost (৳)"
                  name="unitCost"
                  type="number"
                  value={formData.unitCost}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Cost (৳)"
                  name="totalCost"
                  type="number"
                  value={formData.totalCost}
                  onChange={handleChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? (editMode ? 'Saving...' : 'Adding...') : (editMode ? 'Save Changes' : 'Add Production')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProductionPage;

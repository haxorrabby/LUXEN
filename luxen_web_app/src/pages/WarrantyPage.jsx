import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  WarningAmber as WarrantyIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { addWarrantyClaim, deleteWarrantyClaim, updateWarrantyClaim } from '../redux/slices/businessSlice';
import { getAuth } from 'firebase/auth';
import { format } from 'date-fns';

const WarrantyPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { warranties, isLoading } = useSelector((state) => state.business);
  const auth = getAuth();
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    productType: '',
    batchNumber: '',
    serialNumber: '',
    issueDescription: '',
    claimDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    replaced: false,
    replacementDate: '',
    id: null, // Add id field for editing
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await dispatch(updateWarrantyClaim(formData)).unwrap();
      } else {
        await dispatch(addWarrantyClaim({ warrantyData: formData, userId: auth.currentUser.uid })).unwrap();
      }
      setOpen(false);
      setFormData({
        customerName: '',
        customerPhone: '',
        productType: '',
        batchNumber: '',
        serialNumber: '',
        issueDescription: '',
        claimDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        replaced: false,
        replacementDate: '',
        id: null,
        notes: '',
      });
    } catch (error) {
      console.error('Error adding warranty claim:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this warranty claim?')) {
        await dispatch(deleteWarrantyClaim(id)).unwrap();
      }
    } catch (error) {
    }
  };

  const totalClaims = warranties.length;
  const pendingClaims = warranties.filter(w => w.status === 'pending').length;
  const replacedClaims = warranties.filter(w => w.replaced).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Warranty Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage warranty claims and replacements
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Warranty Claim
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarrantyIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Claims
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {totalClaims}
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
                <WarrantyIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {pendingClaims}
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
                <CheckIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Replaced
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {replacedClaims}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Warranty Claims Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Warranty Claims
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Serial</TableCell>
                  <TableCell>Issue</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Replaced</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {warranties.map((warranty) => (
                  <TableRow key={warranty.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {warranty.customerName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {warranty.customerPhone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{warranty.productType}</TableCell>
                    <TableCell>{warranty.batchNumber}</TableCell>
                    <TableCell>{warranty.serialNumber}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {warranty.issueDescription}
                      </Typography>
                    </TableCell>
                    <TableCell>{format(new Date(warranty.claimDate), 'PP')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={warranty.status} 
                        color={warranty.status === 'pending' ? 'warning' : 'success'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={warranty.replaced ? 'Yes' : 'No'} 
                        color={warranty.replaced ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small"
                        onClick={() => {
                          setFormData(warranty);
                          setOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this warranty claim?')) {
                          handleDelete(warranty.id);                          }
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


      {/* Add Warranty Claim Dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setFormData({
            customerName: '',
            customerPhone: '',
            productType: '',
            batchNumber: '',
            serialNumber: '',
            issueDescription: '',
            claimDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            replaced: false,
            replacementDate: '',
            id: null,
            notes: '',
          });
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Warranty Claim</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Customer Phone"
                  name="customerPhone"
                  value={formData.customerPhone}
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
                  label="Batch Number"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Claim Date"
                  name="claimDate"
                  type="date"
                  value={formData.claimDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Issue Description"
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  SelectProps={{ native: true }}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.replaced}
                      onChange={handleChange}
                      name="replaced"
                    />
                  }
                  label="Replaced"
                />
              </Grid>
              {formData.replaced && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Replacement Date"
                    name="replacementDate"
                    type="date"
                    value={formData.replacementDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
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
              {isLoading ? (formData.id ? 'Updating...' : 'Adding...') : (formData.id ? 'Update Claim' : 'Add Claim')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default WarrantyPage;

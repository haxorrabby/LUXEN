import React, { useState, useEffect } from 'react';
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
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as InvestmentIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { addOwner, updateOwner, deleteOwner } from '../redux/slices/businessSlice';
import { getAuth } from 'firebase/auth';
import { format } from 'date-fns';

const InvestmentPage = () => {
  const dispatch = useDispatch();
  const { owners, isLoading } = useSelector((state) => state.business);
  const auth = getAuth();
  
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investmentAmount: '',
    investmentDate: new Date().toISOString().split('T')[0],
    role: 'owner',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ownerData = {
        ...formData,
        investmentAmount: parseFloat(formData.investmentAmount),
      };

      if (editMode && selectedId) {
        await dispatch(updateOwner({ id: selectedId, ownerData })).unwrap();
      } else {
        await dispatch(addOwner({ ...ownerData, userId: auth.currentUser.uid })).unwrap();
      }

      handleDialogClose();
    } catch (error) {
      console.error('Error saving owner:', error);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      investmentAmount: '',
      investmentDate: new Date().toISOString().split('T')[0],
      role: 'owner',
      notes: '',
    });
    setEditMode(false);
    setSelectedId(null);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this owner?')) {
        await dispatch(deleteOwner(id)).unwrap();
      }
    } catch (error) {
      console.error('Error deleting owner:', error);
    }
  };

  const totalInvestment = owners.reduce((sum, owner) => sum + (parseFloat(owner.investmentAmount) || 0), 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Investment Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage business owners and investments
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Owner
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Owners
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {owners.length}
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
                <InvestmentIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Investment
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    ৳{totalInvestment.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Owners Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Business Owners
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Owner</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Investment</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {owners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {owner.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {owner.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {owner.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {owner.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ৳{parseFloat(owner.investmentAmount).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(owner.investmentDate), 'PP')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={owner.role}
                        color={owner.role === 'owner' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => {
                          setFormData(owner);
                          setEditMode(true);
                          setSelectedId(owner.id);
                          setOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(owner.id)}
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

      {/* Add/Edit Owner Dialog */}
      <Dialog 
        open={open} 
        onClose={handleDialogClose} 
        maxWidth="sm" 
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editMode ? 'Edit Owner' : 'Add New Owner'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Investment Amount (৳)"
                  name="investmentAmount"
                  type="number"
                  value={formData.investmentAmount}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Investment Date"
                  name="investmentDate"
                  type="date"
                  value={formData.investmentDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  SelectProps={{ native: true }}
                >
                  <option value="owner">Owner</option>
                  <option value="partner">Partner</option>
                  <option value="investor">Investor</option>
                </TextField>
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
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? (editMode ? 'Saving...' : 'Adding...') : (editMode ? 'Save Changes' : 'Add Owner')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default InvestmentPage;

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  GetApp as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { sales, expenses, productions, warranties } = useSelector((state) => state.business);
  
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Calculate metrics
  const totalSales = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalProduction = productions.reduce((sum, prod) => sum + (prod.totalCost || 0), 0);
  const profitLoss = totalSales - totalProduction - totalExpenses;

  // Chart data
  const salesByMonth = sales.reduce((acc, sale) => {
    const month = new Date(sale.date).getMonth();
    acc[month] = (acc[month] || 0) + sale.totalAmount;
    return acc;
  }, {});

  const expensesByMonth = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).getMonth();
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const salesChartData = {
    labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' })),
    datasets: [
      {
        label: 'Sales',
        data: Array.from({ length: 12 }, (_, i) => salesByMonth[i] || 0),
        borderColor: '#6200EE',
        backgroundColor: 'rgba(98, 0, 238, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: Array.from({ length: 12 }, (_, i) => expensesByMonth[i] || 0),
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const expensesByCategory = expenses.reduce((acc, exp) => {
    const category = exp.category || 'Other';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(exp.amount) || 0;
    return acc;
  }, {});

  const categoryExpenseData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#6200EE',
          '#FF6B6B',
          '#26E5D6',
          '#FFA500',
          '#9C27B0',
        ],
      },
    ],
  };

  const handleDownload = () => {
    // Create a simple CSV report
    const csvData = [
      ['Category', 'Amount', 'Percentage'],
      ['Sales', `৳${totalSales.toLocaleString()}`, '100%'],
      ['Production Cost', `৳${totalProduction.toLocaleString()}`, `${((totalProduction / totalSales) * 100).toFixed(1)}%`],
      ['Expenses', `৳${totalExpenses.toLocaleString()}`, `${((totalExpenses / totalSales) * 100).toFixed(1)}%`],
      ['Net Profit', `৳${profitLoss.toLocaleString()}`, `${((profitLoss / totalSales) * 100).toFixed(1)}%`],
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `luxen-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Reports & Analytics
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Generate and analyze business reports
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </Box>
      </Box>

      {/* Report Controls */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Report Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Month"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Year"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <MenuItem key={2020 + i} value={2020 + i}>
                      {2020 + i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ReportsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    ৳{totalSales.toLocaleString()}
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
                <ReportsIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Expenses
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    ৳{totalExpenses.toLocaleString()}
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
                <ReportsIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Production Cost
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    ৳{totalProduction.toLocaleString()}
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
                <ReportsIcon sx={{ fontSize: 40, color: profitLoss >= 0 ? 'success.main' : 'error.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Profit/Loss
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    ৳{profitLoss.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Sales vs Expenses Trend
              </Typography>
              <Box sx={{ height: 400 }}>
                <Line data={salesChartData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Expense Categories
              </Typography>
              <Box sx={{ height: 400 }}>
                <Pie data={categoryExpenseData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Report Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Detailed Report
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Sales</TableCell>
                  <TableCell>৳{totalSales.toLocaleString()}</TableCell>
                  <TableCell>100%</TableCell>
                  <TableCell>
                    <Chip label="+5.2%" color="success" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Production Cost</TableCell>
                  <TableCell>৳{totalProduction.toLocaleString()}</TableCell>
                  <TableCell>{((totalProduction / totalSales) * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    <Chip label="+2.1%" color="warning" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Expenses</TableCell>
                  <TableCell>৳{totalExpenses.toLocaleString()}</TableCell>
                  <TableCell>{((totalExpenses / totalSales) * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    <Chip label="-1.3%" color="success" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Net Profit</TableCell>
                  <TableCell>৳{profitLoss.toLocaleString()}</TableCell>
                  <TableCell>{((profitLoss / totalSales) * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    <Chip 
                      label={profitLoss >= 0 ? "+8.4%" : "-2.1%"} 
                      color={profitLoss >= 0 ? "success" : "error"} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportsPage;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as SalesIcon,
  Factory as ProductionIcon,
  Receipt as ExpenseIcon,
  WarningAmber as WarrantyIcon,
  GetApp as DownloadIcon,
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
import { fetchBusinessData } from '../redux/slices/businessSlice';

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

const MetricCard = ({ title, value, icon: Icon, color, unit = '' }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {value.toLocaleString()} {unit}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 40, color, opacity: 0.7 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { sales, expenses, productions, warranties } = useSelector((state) => state.business);

  useEffect(() => {
    dispatch(fetchBusinessData());
  }, [dispatch]);

  // Calculate metrics
  const totalSales = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalProduction = productions.reduce((sum, prod) => sum + (prod.totalCost || 0), 0);
  const profitLoss = totalSales - totalProduction - totalExpenses;
  const warrantyCount = warranties.filter((w) => w.replaced).length;

  // Chart data
  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Sales',
        data: [5000, 7000, 6500, 8000],
        borderColor: '#6200EE',
        backgroundColor: 'rgba(98, 0, 238, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [2000, 2500, 2300, 2800],
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: ['Production', 'Expenses', 'Profit'],
    datasets: [
      {
        data: [totalProduction, totalExpenses, Math.max(profitLoss, 0)],
        backgroundColor: ['#6200EE', '#FF6B6B', '#26E5D6'],
        borderColor: [theme.palette.background.paper, theme.palette.background.paper, theme.palette.background.paper],
        borderWidth: 2,
      },
    ],
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Welcome back! Here's your business overview.
        </Typography>
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Sales"
            value={totalSales}
            icon={SalesIcon}
            color="#6200EE"
            unit="৳"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Expenses"
            value={totalExpenses}
            icon={ExpenseIcon}
            color="#FF6B6B"
            unit="৳"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Production Cost"
            value={totalProduction}
            icon={ProductionIcon}
            color="#FFA500"
            unit="৳"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Profit/Loss"
            value={profitLoss}
            icon={TrendingUpIcon}
            color={profitLoss >= 0 ? '#26E5D6' : '#FF6B6B'}
            unit="৳"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Sales vs Expenses
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Business Breakdown
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/production')}
              >
                Add Production
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/sales')}
              >
                Record Sale
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/expenses')}
              >
                Add Expense
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                color="primary" 
                startIcon={<DownloadIcon />}
                onClick={() => navigate('/reports')}
              >
                Export Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;


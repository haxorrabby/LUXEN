import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Factory as FactoryIcon,
  ShoppingCart as SalesIcon,
  Receipt as ExpenseIcon,
  Build as WarrantyIcon,
  TrendingUp as InvestmentIcon,
  Assessment as ReportsIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Language as LanguageIcon,
  Logout as LogoutIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../redux/slices/authSlice';
import {
  toggleSidebar,
  toggleDarkMode,
  setLanguage,
  closeSnackbar,
} from '../../redux/slices/uiSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import ChatPanel from '../ChatPanel/ChatPanel';

const drawerWidth = 280;

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const { sidebarOpen, darkMode, language, snackbar } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logOut());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
    if (chatOpen) {
      setChatMinimized(false);
    }
  };

  const handleChatMinimize = () => {
    setChatMinimized(!chatMinimized);
  };

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'Production', icon: <FactoryIcon />, path: '/production' },
    { label: 'Sales', icon: <SalesIcon />, path: '/sales' },
    { label: 'Expenses', icon: <ExpenseIcon />, path: '/expenses' },
    { label: 'Warranty', icon: <WarrantyIcon />, path: '/warranty' },
    { label: 'Investment', icon: <InvestmentIcon />, path: '/investment' },
    { label: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6200EE 0%, #03DAC6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          L
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          LUXEN
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              if (isMobile) dispatch(toggleSidebar());
            }}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {user?.email}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => dispatch(toggleSidebar())}
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700 }}>
            LUXEN Smart Business Manager
          </Typography>

          {/* Right toolbar items */}
          <IconButton
            color="inherit"
            onClick={() => dispatch(toggleDarkMode())}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <LightIcon /> : <DarkIcon />}
          </IconButton>

          <IconButton
            color="inherit"
            onClick={() => dispatch(setLanguage(language === 'en' ? 'bn' : 'en'))}
            title={language === 'en' ? 'Bangla' : 'English'}
          >
            <LanguageIcon />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={handleChatToggle}
            title="Open Chat Assistant"
          >
            <ChatIcon />
          </IconButton>

          <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #6200EE 0%, #03DAC6 100%)',
              }}
            >
              {user?.email?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>
              <Typography variant="caption">{user?.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={sidebarOpen}
        onClose={() => dispatch(toggleSidebar())}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '64px',
            height: 'calc(100vh - 64px)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          marginTop: '64px',
          padding: { xs: 1, sm: 2, md: 3 },
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => dispatch(closeSnackbar())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => dispatch(closeSnackbar())} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Chat Panel */}
      {chatOpen && (
        <ChatPanel
          onClose={() => setChatOpen(false)}
          isMinimized={chatMinimized}
          onToggleMinimize={handleChatMinimize}
        />
      )}
    </Box>
  );
};

export default MainLayout;


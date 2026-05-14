import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  useTheme,
  alpha,
} from '@mui/material';

import {
  ShoppingBagOutlined as OrdersIcon,
  LocalAtmOutlined as RevenueIcon,
  FormatListBulletedOutlined as MenuIcon,
  ArrowForwardIos as ArrowIcon,
  Restaurant as RestaurantIcon,
  Add as AddIcon,
} from '@mui/icons-material';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [ordersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:3000/orders'),
        axios.get('http://localhost:3000/menulist'),
      ]);

      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Please check server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const activeProducts = products.length;

  const recentOrders = orders.slice(0, 4).map(o => ({
    id: `#${o._id?.slice(-4).toUpperCase()}`,
    name: o.customerName || 'Guest',
    items: o.items
      ? o.items.map(i => `${i.title} (x${i.quantity || 1})`).join(', ')
      : 'Order items',
    status: o.status || 'pending',
    time: new Date(o.orderDate).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  }));

  const categoryColors = ['#f59e0b', '#ef4444', '#16a34a'];

  const popularItems = products.slice(0, 3).map((p, i) => ({
    name: p.title,
    label: p.type || 'Item',
    price: p.price,
    color: categoryColors[i % categoryColors.length],
  }));

  const getStatusConfig = (status) => {
    const s = status.toLowerCase();
    if (s === 'pending') return { bg: '#fef3c7', color: '#d97706', label: 'PENDING' };
    if (s === 'preparing') return { bg: '#dbeafe', color: '#2563eb', label: 'PREPARING' };
    if (s === 'ready') return { bg: '#dcfce7', color: '#16a34a', label: 'READY' };
    if (s === 'completed') return { bg: '#e0e7ff', color: '#4f46e5', label: 'COMPLETED' };
    return { bg: '#f3f4f6', color: '#6b7280', label: s.toUpperCase() };
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
        <RestaurantIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h5" fontWeight="800">
          Restaurant Overview
        </Typography>
      </Box>

      {/* STATS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
        {[{
          value: totalOrders,
          label: 'Total Orders',
          icon: OrdersIcon,
        }, {
          value: `Rs ${totalRevenue}`,
          label: 'Revenue',
          icon: RevenueIcon,
        }, {
          value: activeProducts,
          label: 'Menu Items',
          icon: MenuIcon,
        }].map((card, i) => (
          <Card key={i}>
            <CardContent>
              <Typography variant="h6">{card.value}</Typography>
              <Typography variant="body2">{card.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* CONTENT */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>

        <Paper sx={{ p: 2 }}>
          <Typography fontWeight="700" mb={2}>Recent Orders</Typography>

          {recentOrders.map((o, i) => (
            <React.Fragment key={i}>
              <ListItem>
                <ListItemText primary={o.name} secondary={o.items} />
                <Chip label={getStatusConfig(o.status).label} />
              </ListItem>
              {i < recentOrders.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography fontWeight="700" mb={2}>Popular Items</Typography>

          {popularItems.map((p, i) => (
            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>{p.name}</Typography>
              <Typography>${p.price}</Typography>
            </Box>
          ))}

          <Button
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => navigate('/addproduct')}
            sx={{ mt: 2 }}
          >
            Add Item
          </Button>
        </Paper>

      </Box>
    </Box>
  );
}

export default Dashboard;
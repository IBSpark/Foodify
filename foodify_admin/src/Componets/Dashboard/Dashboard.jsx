import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
  axios.get(`${API_URL}/api/orders`),
  axios.get(`${API_URL}/api/menu`)
]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="primary" />
        <Typography sx={{ mt: 2 }} color="text.secondary">Loading dashboard...</Typography>
        <Button variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate('/addproduct')}>
        Add Product
      </Button>
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

  // Stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const activeProducts = products.length;

  // Recent orders — show item names
  const recentOrders = orders.slice(0, 4).map(o => {
    const itemsSummary = o.items
      ? o.items.map(i => `${i.title || 'Item'} (x${i.quantity || 1})`).join(', ')
      : 'Order items';
    return {
      id: `#${o._id?.slice(-4).toUpperCase()}`,
      name: o.customerName || 'Guest',
      items: itemsSummary.length > 35 ? itemsSummary.slice(0, 32) + '...' : itemsSummary,
      status: o.status || 'pending',
      time: new Date(o.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  });

  // Popular items
  const categoryColors = ['#f59e0b', '#ef4444', '#16a34a', '#3b82f6', '#8b5cf6'];
  const popularItems = products.slice(0, 3).map((p, i) => ({
    name: p.title,
    label: p.type || p.title?.split(' ')[0] || 'Item',
    price: p.price,
    color: categoryColors[i % categoryColors.length],
  }));

  const getStatusConfig = (status) => {
    const s = status.toLowerCase();
    if (s === 'pending') return { bg: '#fef3c7', color: '#d97706', label: 'PENDING' };
    if (s === 'preparing' || s === 'confirmed') return { bg: '#dbeafe', color: '#2563eb', label: 'PREPARING' };
    if (s === 'ready') return { bg: '#dcfce7', color: '#16a34a', label: 'READY' };
    if (s === 'completed') return { bg: '#e0e7ff', color: '#4f46e5', label: 'COMPLETED' };
    return { bg: '#f3f4f6', color: '#6b7280', label: s.toUpperCase() };
  };

  const statCards = [
  {
    value: totalOrders,
    label: 'Total Orders',
    icon: OrdersIcon,
    color: '#f59e0b',
    bg: '#fef3c7'
  },
  {
    value: `Rs. ${totalRevenue.toLocaleString()}`,
    label: 'Revenue',
    icon: RevenueIcon,
    color: '#10b981',
    bg: '#dcfce7'
  },
  {
    value: activeProducts,
    label: 'Menu Items',
    icon: MenuIcon,
    color: '#3b82f6',
    bg: '#dbeafe'
  },
  {
    value: orders.filter(o => o.status === 'pending').length,
    label: 'Pending Orders',
    icon: OrdersIcon,
    color: '#ef4444',
    bg: '#fee2e2'
  }
];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box display="flex" alignItems="center" sx={{ mb: 3, gap: 1.5 }}>
        <RestaurantIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Typography variant="caption" fontWeight="700" color="primary.main">
  Rs. {item.price}
</Typography>
      </Box>

      {/* Stat Cards Row */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {  xs: '1fr',sm: 'repeat(2, 1fr)',
  lg: 'repeat(4, 1fr)' },
        gap: 2,
        mb: 3,
      }}>
        {statCards.map((card, i) => (
          <Card key={i} elevation={1} sx={{ borderRadius: 3, bgcolor: 'background.paper', border: 'none' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box>
                <Typography variant="h5" fontWeight="800" color="text.primary">
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3, fontWeight: 500 }}>
                  {card.label}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: card.bg, width: 48, height: 48, borderRadius: 2.5 }}>
                <card.icon sx={{ color: card.color, fontSize: 24 }} />
              </Avatar>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Bottom Row: Recent Orders + Popular Items */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' },
        gap: 2,
      }}>
        {/* Recent Orders */}
        <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, bgcolor: 'background.paper', border: 'none' }}>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>Recent Orders</Typography>

          <List disablePadding>
            {recentOrders.map((order, index) => {
              const statusCfg = getStatusConfig(order.status);
              return (
                <React.Fragment key={index}>
                  <ListItem sx={{ py: 1.8, px: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
                      {/* Order ID badge */}
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          color: 'primary.main',
                          fontWeight: 800,
                          px: 1.2,
                          py: 0.4,
                          borderRadius: 1.5,
                          mr: 2,
                          flexShrink: 0,
                          fontSize: '11px',
                        }}
                      >
                        {order.id}
                      </Typography>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight="700">{order.name}</Typography>}
                        secondary={
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {order.items}
                          </Typography>
                        }
                        sx={{ minWidth: 0 }}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 2 }}>
                      <Chip
                        label={statusCfg.label}
                        size="small"
                        sx={{
                          fontSize: '10px',
                          fontWeight: 800,
                          height: 22,
                          bgcolor: statusCfg.bg,
                          color: statusCfg.color,
                          borderRadius: 1,
                          mb: 0.3,
                        }}
                      />
                      <Typography variant="caption" color="text.disabled" display="block" sx={{ fontSize: '11px' }}>
                        {order.time}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < recentOrders.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
            {recentOrders.length === 0 && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary" variant="body2">No orders yet</Typography>
              </Box>
            )}
          </List>
        </Paper>

        {/* Popular Items */}
        <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, bgcolor: 'background.paper', border: 'none' }}>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>Popular Items</Typography>

          <Box>
            {popularItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 2.5,
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03) },
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                }}
              >
                {/* Category Label Chip */}
                <Chip
                  label={item.label}
                  size="small"
                  sx={{
                    bgcolor: item.color,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '10px',
                    height: 28,
                    borderRadius: 1.5,
                    mr: 1.5,
                    minWidth: 56,
                  }}
                />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="600" noWrap>{item.name}</Typography>
                  <Typography variant="caption" fontWeight="700" color="primary.main">${item.price}</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 600, fontSize: '10px', mr: 1 }}>
                  • AVAILABLE
                </Typography>
                <ArrowIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              </Box>
            ))}
          </Box>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => navigate('/addproduct')}
            sx={{
              mt: 2,
              borderStyle: 'dashed',
              color: 'text.secondary',
              py: 1.2,
              borderRadius: 2,
              '&:hover': { borderStyle: 'dashed' },
            }}
          >
            Add Menu Item
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard;

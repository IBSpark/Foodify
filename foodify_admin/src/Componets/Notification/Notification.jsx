import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Button,
  Chip,
  alpha,
  useTheme,
  Fade,
} from '@mui/material';
import {
  NotificationsNoneOutlined as BellIcon,
  RestaurantOutlined as OrderIcon,
  EventSeatOutlined as BookingIcon,
  CloseOutlined as CloseIcon,
  DeleteSweepOutlined as ClearAllIcon,
} from '@mui/icons-material';

const POLL_INTERVAL = 10000; // Poll every 10 seconds

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  // Use refs to track counts across renders without re-creating callbacks
  const lastOrderCountRef = useRef(null);   // null = not initialized yet
  const lastBookingCountRef = useRef(null);
  const isInitializedRef = useRef(false);

  const open = Boolean(anchorEl);

  // Add a new notification
  const addNotification = useCallback((type, title, message) => {
    const entry = {
      id: Date.now() + Math.random(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [entry, ...prev].slice(0, 50));

    // Browser notification
    if ('Notification' in window && window.Notification.permission === 'granted') {
      try {
        const n = new window.Notification(title, {
          body: message,
          icon: '/favicon.ico',
          tag: `restaurant-${type}-${Date.now()}`,
        });
        setTimeout(() => n.close(), 5000);
      } catch (e) { /* silent */ }
    }
  }, []);

  // Single poll function that checks both orders and reservations
  const pollForUpdates = useCallback(async () => {
    try {
      const [ordersRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:5000/orders'),
        axios.get('http://localhost:5000/bookinglist'),
      ]);

      const currentOrders = ordersRes.data.length;
      const currentBookings = bookingsRes.data.length;

      // First run: just save the counts, don't fire notifications
      if (!isInitializedRef.current) {
        lastOrderCountRef.current = currentOrders;
        lastBookingCountRef.current = currentBookings;
        isInitializedRef.current = true;
        console.log(`[Notifications] Initialized — Orders: ${currentOrders}, Reservations: ${currentBookings}`);
        return;
      }

      // Check for new orders
      if (currentOrders > lastOrderCountRef.current) {
        const diff = currentOrders - lastOrderCountRef.current;
        addNotification(
          'order',
          `New Order${diff > 1 ? 's' : ''} Received!`,
          `${diff} new order${diff > 1 ? 's have' : ' has'} been placed.`
        );
      }

      // Check for new reservations
      if (currentBookings > lastBookingCountRef.current) {
        const diff = currentBookings - lastBookingCountRef.current;
        addNotification(
          'booking',
          `New Reservation${diff > 1 ? 's' : ''}!`,
          `${diff} new reservation${diff > 1 ? 's have' : ' has'} been made.`
        );
      }

      lastOrderCountRef.current = currentOrders;
      lastBookingCountRef.current = currentBookings;

    } catch (err) {
      console.error('[Notifications] Polling error:', err.message);
    }
  }, [addNotification]);

  // Setup: initialize immediately, then poll regularly
  useEffect(() => {
    // Request browser notification permission
    if ('Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission();
    }

    // First poll immediately to initialize counts
    pollForUpdates();

    // Then poll at regular intervals
    const interval = setInterval(pollForUpdates, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [pollForUpdates]);

  // Handlers
  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  const handleClose = () => setAnchorEl(null);
  const removeOne = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getTypeConfig = (type) => {
    if (type === 'order') return { icon: <OrderIcon fontSize="small" />, color: '#16a34a', label: 'Order' };
    return { icon: <BookingIcon fontSize="small" />, color: '#3b82f6', label: 'Reservation' };
  };

  return (
    <>
      {/* Bell Button */}
      <IconButton size="small" onClick={handleOpen}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={9}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '10px',
              height: 18,
              minWidth: 18,
              ...(unreadCount > 0 && {
                animation: 'notifPulse 2s infinite',
                '@keyframes notifPulse': {
                  '0%': { transform: 'scale(1) translate(50%, -50%)' },
                  '50%': { transform: 'scale(1.2) translate(50%, -50%)' },
                  '100%': { transform: 'scale(1) translate(50%, -50%)' },
                },
              }),
            },
          }}
        >
          <BellIcon fontSize="small" />
        </Badge>
      </IconButton>

      {/* Dropdown Panel */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Fade}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              width: { xs: 320, sm: 380 },
              maxHeight: 480,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
              mt: 1,
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
          color: '#fff',
        }}>
          <Box>
            <Typography fontWeight="700" fontSize="15px">Notifications</Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              {notifications.length === 0 ? 'All caught up!' : `${notifications.length} total`}
            </Typography>
          </Box>
          {notifications.length > 0 && (
            <Button
              size="small"
              startIcon={<ClearAllIcon sx={{ fontSize: 16 }} />}
              onClick={clearAll}
              sx={{ color: '#fff', fontSize: '12px', textTransform: 'none', '&:hover': { bgcolor: alpha('#fff', 0.15) } }}
            >
              Clear all
            </Button>
          )}
        </Box>

        {/* Notification List */}
        <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
          {notifications.length > 0 ? (
            <List disablePadding>
              {notifications.map((n, i) => {
                const cfg = getTypeConfig(n.type);
                return (
                  <React.Fragment key={n.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        px: 2.5,
                        py: 1.5,
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                        transition: 'background 0.2s',
                      }}
                      secondaryAction={
                        <IconButton edge="end" size="small" onClick={() => removeOne(n.id)} sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}>
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar sx={{ minWidth: 44 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(cfg.color, 0.12), color: cfg.color }}>
                          {cfg.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight="600" noWrap>{n.title}</Typography>
                            <Chip label={cfg.label} size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 600, bgcolor: alpha(cfg.color, 0.1), color: cfg.color }} />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>{n.message}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '11px', mt: 0.5, display: 'block' }}>{timeAgo(n.timestamp)}</Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {i < notifications.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                );
              })}
            </List>
          ) : (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <BellIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary" fontWeight="500">No new notifications</Typography>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5, px: 3 }}>
                New order & reservation alerts will appear here automatically
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default Notification;
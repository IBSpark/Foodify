import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Button,
    Chip,
    IconButton,
    CircularProgress,
    alpha,
    useTheme,
    Tooltip,
    Avatar,
} from "@mui/material";
import {
    ReceiptOutlined as InvoiceIcon,
    RestaurantOutlined as RestaurantIcon,
    AccessTimeOutlined as TimeIcon,
    RemoveCircleOutline as DeleteIcon,
    MessageOutlined as MessageIcon,
} from "@mui/icons-material";

const OrdersTable = ({ searchQuery = "", showMessage }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        fetchOrders();
        fetchSettings();
    }, []);

    const fetchOrders = () => {
        setLoading(true);
        fetch("http://localhost:5000/orders")
            .then((res) => res.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching orders:", err);
                setLoading(false);
            });
    };

    const fetchSettings = async () => {
        try {
            const res = await Axios.get("http://localhost:5000/settings");
            setSettings(res.data);
        } catch (err) {
            console.error("Failed to fetch settings", err);
        }
    };

    const deleteOrder = (id) => {
        Axios.delete(`http://localhost:5000/deleteorder/${id}`)
            .then(() => {
                setOrders(orders.filter(order => order._id !== id));
                if (showMessage) showMessage("Order deleted successfully", "success");
            })
            .catch((err) => {
                console.error("Error deleting order:", err);
                if (showMessage) showMessage("Failed to delete order", "error");
            });
    };

    const updateStatus = (orderId, newStatus) => {
        Axios.put(`http://localhost:5000/updateorder/${orderId}`, { status: newStatus })
            .then(() => {
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
                if (showMessage) showMessage(`Order status updated to ${newStatus}`, "success");
            })
            .catch((err) => {
                console.error("Error updating status:", err);
                if (showMessage) showMessage("Failed to update status", "error");
            });
    };

    const generateInvoice = (order) => {
        const subtotal = order.totalPrice;
        const taxRate = settings ? (parseFloat(settings.salesTax) / 100) : 0.05;
        const taxAmount = subtotal * taxRate;
        const total = subtotal + taxAmount;
        const restaurantName = "Shah’s Darbar";

        const invoiceHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invoice</title>
                <style>
                    body { font-family: 'Inter', sans-serif; padding: 20px; background: #f8f9fa; }
                    .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 20px; }
                    .details { display: flex; justify-content: space-between; margin: 20px 0; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background: #16a34a; color: white; }
                    .totals { text-align: right; }
                    .print-btn { display: block; margin: 20px auto; padding: 10px 20px; background: #16a34a; color: white; border: none; cursor: pointer; border-radius: 4px; }
                    @media print { .print-btn { display: none; } }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${restaurantName}</h1>
                        <p>${settings?.location || ''}</p>
                        <p>Invoice #INV-${order._id.slice(-6).toUpperCase()}</p>
                        ${settings?.taxId ? `<p>Tax ID: ${settings.taxId}</p>` : ''}
                    </div>
                    <div class="details">
                        <div>
                            <p><strong>Customer:</strong> ${order.customerName}</p>
                            <p><strong>Table:</strong> ${order.tableNumber}</p>
                        </div>
                        <div style="text-align: right;">
                            <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.title}</td>
                                    <td>${item.quantity}</td>
                                    <td>RS:${item.price}</td>
                                    <td>RS:${item.price * item.quantity}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="totals">
                        <p>Subtotal: RS:${subtotal}</p>
                        <p>Tax (${(taxRate * 100).toFixed(1)}%): RS:${taxAmount.toFixed(2)}</p>
                        <h2>Total: RS:${total.toFixed(2)}</h2>
                    </div>
                    <button class="print-btn" onclick="window.print()">Print Invoice</button>
                </div>
            </body>
            </html>
        `;

        const newWindow = window.open('', '_blank');
        newWindow.document.write(invoiceHtml);
        newWindow.document.close();

        deleteOrder(order._id);
    };

    const filteredOrders = useMemo(() => {
        if (!searchQuery) return orders;
        const query = searchQuery.toLowerCase();
        return orders.filter(
            (order) =>
                order.customerName.toLowerCase().includes(query) ||
                order.tableNumber.toString().includes(query) ||
                order._id.toLowerCase().includes(query)
        );
    }, [orders, searchQuery]);

    const getStatusStyles = (status) => {
        const s = status.toLowerCase();
        if (s === 'pending') return { bg: alpha('#f59e0b', 0.1), color: '#f59e0b' };
        if (s === 'confirmed') return { bg: alpha('#3b82f6', 0.1), color: '#3b82f6' };
        if (s === 'preparing') return { bg: alpha('#8b5cf6', 0.1), color: '#8b5cf6' };
        if (s === 'ready') return { bg: alpha('#10b981', 0.1), color: '#10b981' };
        if (s === 'completed') return { bg: alpha('#6b7280', 0.1), color: '#6b7280' };
        return { bg: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main };
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <CircularProgress color="primary" />
                <Typography sx={{ mt: 2 }} color="textSecondary">Fetching orders...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), p: 1.5, borderRadius: 3, display: 'flex' }}>
                    <RestaurantIcon color="primary" />
                </Box>
                <Box>
                    <Typography variant="h5" color="text.primary">Orders Management</Typography>
                    <Typography variant="body2" color="text.secondary">Review, track and manage customer dining orders</Typography>
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 4, overflow: 'hidden', border: 'none' }}>
                <Table sx={{ minWidth: 900 }}>
                    <TableHead sx={{ bgcolor: theme.palette.mode === 'light' ? '#f9fafb' : alpha('#fff', 0.02) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Table</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Message</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => (
                                <TableRow key={order._id} hover>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{index + 1}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 'bold' }}>
                                                {order.customerName.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Typography variant="body2" fontWeight="700">{order.customerName}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`Table ${order.tableNumber}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 700, borderRadius: 1 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {order.items.map((item, idx) => (
                                                <Typography key={idx} variant="caption" color="text.secondary">
                                                    • {item.title} <Box component="span" sx={{ fontWeight: 700 }}>x{item.quantity}</Box>
                                                </Typography>
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="800" color="primary">RS: {order.totalPrice}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status.toLowerCase()}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            size="small"
                                            sx={{
                                                fontSize: '12px',
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                height: 32,
                                                minWidth: 120,
                                                bgcolor: getStatusStyles(order.status).bg,
                                                color: getStatusStyles(order.status).color,
                                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                '& .MuiSelect-icon': { color: getStatusStyles(order.status).color }
                                            }}
                                        >
                                            <MenuItem sx={{ fontSize: '13px' }} value="pending">Pending</MenuItem>
                                            <MenuItem sx={{ fontSize: '13px' }} value="confirmed">Confirmed</MenuItem>
                                            <MenuItem sx={{ fontSize: '13px' }} value="preparing">Preparing</MenuItem>
                                            <MenuItem sx={{ fontSize: '13px' }} value="ready">Ready</MenuItem>
                                            <MenuItem sx={{ fontSize: '13px' }} value="completed">Completed</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 200 }}>
                                        {order.specialRequests ? (
                                            <Tooltip title={order.specialRequests}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <MessageIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                                    <Typography variant="caption" noWrap color="text.secondary">
                                                        {order.specialRequests}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                        ) : (
                                            <Typography variant="caption" color="text.disabled">No request</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                            <TimeIcon sx={{ fontSize: 14 }} />
                                            <Typography variant="caption">
                                                {new Date(order.orderDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            {order.status === 'completed' ? (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<InvoiceIcon fontSize="small" />}
                                                    onClick={() => generateInvoice(order)}
                                                    sx={{ boxShadow: 'none' }}
                                                >
                                                    Invoice
                                                </Button>
                                            ) : (
                                                <Tooltip title="Delete Order">
                                                    <IconButton size="small" color="error" onClick={() => deleteOrder(order._id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                                    <Typography color="text.secondary">No orders match your search criteria.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default OrdersTable;

import React, { useState, useEffect, useMemo } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
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
    Button,
    IconButton,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    alpha,
    useTheme,
} from '@mui/material';
import {
    DeleteOutline as DeleteIcon,
    EditOutlined as EditIcon,
    WarningAmberOutlined as WarningIcon,
    RestaurantMenuOutlined as MenuIcon,
} from '@mui/icons-material';

export default function Product({ searchQuery = "", showMessage }) {
    const [rec, setRec] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        fetch("http://localhost:5000/menulist")
            .then((res) => res.json())
            .then((data) => setRec(data))
            .catch(err => console.error("Error fetching products:", err));
    };

    const handleDeleteClick = (key) => {
        setDeleteId(key);
        setShowModal(true);
    };

    const confirmDelete = () => {
        Axios.delete("http://localhost:5000/deleteproduct/" + deleteId)
            .then(() => {
                setRec(rec.filter(item => item._id !== deleteId));
                setShowModal(false);
                setDeleteId(null);
                if (showMessage) showMessage("Product deleted successfully", "success");
            })
            .catch(err => {
                console.error("Error deleting product:", err);
                if (showMessage) showMessage("Failed to delete product", "error");
            });
    };

    const cancelDelete = () => {
        setShowModal(false);
        setDeleteId(null);
    };

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return rec;
        const query = searchQuery.toLowerCase();
        return rec.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.ingredients.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query)
        );
    }, [rec, searchQuery]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), p: 1.5, borderRadius: 3, display: 'flex' }}>
                    <MenuIcon color="primary" />
                </Box>
                <Box>
                    <Typography variant="h5" fontWeight="700">Product Management</Typography>
                    <Typography variant="body2" color="text.secondary">Manage your restaurant menu items and pricing</Typography>
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 4, overflow: 'hidden', border: 'none' }}>
                <Table sx={{ minWidth: 800 }}>
                    <TableHead sx={{ bgcolor: theme.palette.mode === 'light' ? '#f9fafb' : alpha('#fff', 0.02) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((item, index) => (
                            <TableRow key={item._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                <TableCell sx={{ color: 'text.secondary' }}>{index + 1}</TableCell>
                                <TableCell>
                                    <Avatar
                                        src={`http://localhost:5000${item.image}`}
                                        variant="rounded"
                                        sx={{ width: 64, height: 64, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.default' }}
                                    >
                                        <MenuIcon color="disabled" />
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="700">{item.title}</Typography>
                                    <Typography variant="caption" color="#2563eb">{item.time}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="800" color="primary">Rs. {item.price}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', maxWidth: 200 }}>
                                        {item.ingredients}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.type}
                                        size="small"
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: '11px',
                                            bgcolor: item.type === 'Veg' ? alpha('#16a34a', 0.1) : item.type === 'Non-Veg' ? alpha('#dc2626', 0.1) : alpha('#2563eb', 0.1),
                                            color: item.type === 'Veg' ? '#16a34a' : item.type === 'Non-Veg' ? '#dc2626' : '#2563eb',
                                            borderRadius: 1.5
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <IconButton
                                            component={Link}
                                            to={`/update/${item._id}`}
                                            sx={{ color: 'info.main', bgcolor: alpha(theme.palette.info.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) } }}
                                            size="small"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeleteClick(item._id)}
                                            sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) } }}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Typography variant="subtitle2" color="primary" fontWeight="800">
                    Total Products: {filteredProducts.length}
                </Typography>
            </Box>

            <Dialog
                open={showModal}
                onClose={cancelDelete}
                PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="error" />
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to permanently delete "{rec.find(p => p._id === deleteId)?.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={cancelDelete} color="inherit">Cancel</Button>
                    <Button
                        onClick={confirmDelete}
                        variant="contained"
                        color="error"
                        sx={{ boxShadow: 'none' }}
                    >
                        Delete Item
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
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
    Button,
    // IconButton,
    CircularProgress,
    Chip,
    alpha,
    Avatar,
    Tooltip,
    useTheme,
} from "@mui/material";
import {
    EventAvailableOutlined as BookingIcon,
    PeopleOutlined as PeopleIcon,
    EmailOutlined as EmailIcon,
    MessageOutlined as MessageIcon,
    CheckCircleOutline as DoneIcon,
    TimerOffOutlined as ExpiredIcon,
} from "@mui/icons-material";

// Check if a reservation date is in the past
const isExpired = (dateStr) => {
    if (!dateStr) return false;
    const reservationDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservationDate < today;
};

// Check if a reservation is expired more than N days
const daysExpired = (dateStr) => {
    if (!dateStr) return 0;
    const reservationDate = new Date(dateStr);
    reservationDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = today - reservationDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const BookingTable = ({ searchQuery = "", showMessage }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    const fetchReservations = React.useCallback(() => {
    setLoading(true);

    fetch("http://localhost:3000/bookinglist")
        .then((res) => res.json())
        .then((data) => {
            const toDelete = data.filter(item => daysExpired(item.date) > 3);
            const remaining = data.filter(item => daysExpired(item.date) <= 3);

            toDelete.forEach(item => {
                Axios.delete("http://localhost:3000/deletebooking/" + item._id)
                    .then(() => console.log(`Auto-deleted expired reservation: ${item.name} (${item.date})`))
                    .catch(err => console.error("Auto-delete failed:", err));
            });

            if (toDelete.length > 0 && showMessage) {
                showMessage(`${toDelete.length} expired reservation(s) auto-removed`, "info");
            }

            setReservations(remaining);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching reservations:", err);
            setLoading(false);
        });
}, [showMessage]);

useEffect(() => {
    fetchReservations();
}, [fetchReservations]);

    // useEffect(() => {
    //     fetchReservations();
    // }, []);

    // const fetchReservations = () => {
    //     setLoading(true);
    //     fetch("http://localhost:3000/bookinglist")
    //         .then((res) => res.json())
    //         .then((data) => {
    //             // Auto-delete reservations expired for more than 3 days
    //             const toDelete = data.filter(item => daysExpired(item.date) > 3);
    //             const remaining = data.filter(item => daysExpired(item.date) <= 3);

    //             toDelete.forEach(item => {
    //                 Axios.delete("http://localhost:3000/deletebooking/" + item._id)
    //                     .then(() => console.log(`Auto-deleted expired reservation: ${item.name} (${item.date})`))
    //                     .catch(err => console.error("Auto-delete failed:", err));
    //             });

    //             if (toDelete.length > 0 && showMessage) {
    //                 showMessage(`${toDelete.length} expired reservation(s) auto-removed`, "info");
    //             }

    //             setReservations(remaining);
    //             setLoading(false);
    //         })
    //         .catch((err) => {
    //             console.error("Error fetching reservations:", err);
    //             setLoading(false);
    //         });
    // };

    const dodel = (key) => {
        Axios.delete("http://localhost:3000/deletebooking/" + key)
            .then(() => {
                setReservations(reservations.filter(item => item._id !== key));
                if (showMessage) showMessage("Booking marked as complete", "success");
            })
            .catch(err => {
                console.error("Error deleting booking:", err);
                if (showMessage) showMessage("Failed to update booking", "error");
            });
    };

    const filteredReservations = useMemo(() => {
        if (!searchQuery) return reservations;
        const query = searchQuery.toLowerCase();
        return reservations.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.message?.toLowerCase().includes(query)
        );
    }, [reservations, searchQuery]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <CircularProgress color="primary" />
                <Typography sx={{ mt: 2 }} color="textSecondary">Loading reservations...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), p: 1.5, borderRadius: 3, display: 'flex' }}>
                    <BookingIcon color="primary" />
                </Box>
                <Box>
                    <Typography variant="h5" fontWeight="700">Reservations</Typography>
                    <Typography variant="body2" color="text.secondary">Manage restaurant table bookings and guest requests</Typography>
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 4, overflow: 'hidden', border: 'none' }}>
                <Table sx={{ minWidth: 800 }}>
                    <TableHead sx={{ bgcolor: theme.palette.mode === 'light' ? '#f9fafb' : alpha('#fff', 0.02) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Guest</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Party Size</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Message</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReservations.length > 0 ? (
                            filteredReservations.map((item, index) => {
                                const expired = isExpired(item.date);
                                return (
                                    <TableRow key={item._id} hover sx={{ '&:last-child td': { border: 0 }, opacity: expired ? 0.7 : 1 }}>
                                        <TableCell sx={{ color: 'text.secondary' }}>{index + 1}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 'bold' }}>
                                                    {item.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="700">
                                                    {item.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                                <EmailIcon sx={{ fontSize: 16 }} />
                                                <Typography variant="caption">{item.email}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.date}
                                                size="small"
                                                sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PeopleIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                <Typography variant="body2" fontWeight="800">
                                                    {item.people} People
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 200 }}>
                                            {item.message ? (
                                                <Tooltip title={item.message}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <MessageIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                                        <Typography variant="caption" noWrap color="text.secondary">
                                                            {item.message}
                                                        </Typography>
                                                    </Box>
                                                </Tooltip>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">No message</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {expired ? (
                                                <Chip
                                                    icon={<ExpiredIcon sx={{ fontSize: 14 }} />}
                                                    label="EXPIRED"
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 800,
                                                        fontSize: '10px',
                                                        height: 24,
                                                        bgcolor: alpha('#ef4444', 0.1),
                                                        color: '#ef4444',
                                                        borderRadius: 1.5,
                                                    }}
                                                />
                                            ) : (
                                                <Chip
                                                    label="ACTIVE"
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 800,
                                                        fontSize: '10px',
                                                        height: 24,
                                                        bgcolor: alpha('#16a34a', 0.1),
                                                        color: '#16a34a',
                                                        borderRadius: 1.5,
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => dodel(item._id)}
                                                startIcon={<DoneIcon />}
                                                disabled={expired}
                                                sx={{
                                                    boxShadow: 'none',
                                                    ...(expired && {
                                                        bgcolor: 'action.disabledBackground',
                                                        color: 'text.disabled',
                                                    }),
                                                }}
                                            >
                                                {expired ? 'Expired' : 'Complete'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>);
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                                    <Typography color="text.secondary">No reservations match your search.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default BookingTable;

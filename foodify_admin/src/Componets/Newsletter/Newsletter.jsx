import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Chip,
    Avatar,
    Tooltip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    alpha,

} from '@mui/material';
import {
    MailOutlined as MailIcon,
    Search as SearchIcon,
    Delete as DeleteIcon,
    SendOutlined as SendIcon,
    MarkEmailReadOutlined as SubscribedIcon,
    CampaignOutlined as CampaignIcon,
} from '@mui/icons-material';

const Newsletter = ({ showMessage }) => {
    const theme = useTheme();
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [openMailDialog, setOpenMailDialog] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [mailContent, setMailContent] = useState({ subject: "", message: "" });
    const SENDER_EMAIL = "khanmpir@gmail.com";

    const fetchSubscribers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/newsletter');
            setSubscribers(response.data);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            showMessage("Failed to fetch subscribers", "error");
        } finally {
            setLoading(false);
        }
    }, [showMessage]);

    useEffect(() => {
        fetchSubscribers();
    }, [fetchSubscribers]);

    const handleOpenMail = (email = "") => {
        setSelectedEmail(email);
        setMailContent({
            subject: "Special Offer from Shah’s Darbar! 🍴",
            message: "Hello,\n\nWe have some exciting new deals for you..."
        });
        setOpenMailDialog(true);
    };

    const handleSendMail = () => {
        // Logic for sending mail would go here
        showMessage(selectedEmail ? `Offer sent from ${SENDER_EMAIL} to ${selectedEmail}` : `Offers sent from ${SENDER_EMAIL} to all subscribers!`, "success");
        setOpenMailDialog(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/newsletter/${id}`);
            setSubscribers(subscribers.filter(sub => sub._id !== id));
            showMessage("Subscriber removed successfully", "success");
        } catch (error) {
            console.error('Error deleting subscriber:', error);
            showMessage("Failed to remove subscriber", "error");
        }
    };

    const filteredSubscribers = useMemo(() => {
        return subscribers.filter(sub =>
            sub.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [subscribers, searchQuery]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Header */}
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4, gap: 2 }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 44, height: 44, borderRadius: 2 }}>
                        <CampaignIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="800">Newsletter</Typography>
                        <Typography variant="caption" color="text.secondary">Manage your subscribers and send updates</Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => handleOpenMail()}
                    sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 700 }}
                >
                    Blast All Subscribers
                </Button>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 3, border: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }}><SubscribedIcon /></Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="800">{subscribers.length}</Typography>
                        <Typography variant="caption" color="text.secondary">Total Subscribers</Typography>
                    </Box>
                </Paper>
                <Paper sx={{ p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: alpha('#16a34a', 0.1), color: '#16a34a' }}><MailIcon /></Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="800">100%</Typography>
                        <Typography variant="caption" color="text.secondary">Reach Probability</Typography>
                    </Box>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 3, border: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b' }}><CampaignIcon /></Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="800">Stable</Typography>
                        <Typography variant="caption" color="text.secondary">Growth Rate</Typography>
                    </Box>
                </Paper>
            </Box>

            {/* Subscriber Table */}
            <Paper elevation={1} sx={{ borderRadius: 4, border: 'none', overflow: 'hidden' }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                    <TextField
                        size="small"
                        placeholder="Search subscribers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18 }} /></InputAdornment>,
                            sx: { borderRadius: 2, bgcolor: 'background.paper' }
                        }}
                        sx={{ width: { xs: '100%', sm: 300 } }}
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: alpha(theme.palette.background.default, 0.8) }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Subscriber</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Join Date</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSubscribers.length > 0 ? (
                                filteredSubscribers.map((subscriber) => (
                                    <TableRow key={subscriber._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '13px', bgcolor: 'primary.main' }}>
                                                    {subscriber.email.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="600">{subscriber.email}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label="Active" size="small" sx={{ bgcolor: alpha('#16a34a', 0.1), color: '#16a34a', fontWeight: 700, fontSize: '11px' }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {subscriber.createdAt ? new Date(subscriber.createdAt).toLocaleDateString() : 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box display="flex" justifyContent="flex-end" gap={0.5}>
                                                <Tooltip title="Send Offer">
                                                    <IconButton size="small" onClick={() => handleOpenMail(subscriber.email)} sx={{ color: 'primary.main' }}>
                                                        <SendIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Remove">
                                                    <IconButton size="small" onClick={() => handleDelete(subscriber._id)} sx={{ color: 'error.main' }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">No subscribers found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Mail Dialog */}
            <Dialog open={openMailDialog} onClose={() => setOpenMailDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
                    {selectedEmail ? `Send Offer to ${selectedEmail}` : 'Newsletter Blast'}
                </DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2.5} sx={{ mt: 1 }}>
                        <TextField
                            label="From"
                            fullWidth
                            variant="outlined"
                            value={SENDER_EMAIL}
                            disabled
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><MailIcon sx={{ fontSize: 18 }} /></InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Subject"
                            fullWidth
                            variant="outlined"
                            value={mailContent.subject}
                            onChange={(e) => setMailContent({ ...mailContent, subject: e.target.value })}
                        />
                        <TextField
                            label="Message Content"
                            fullWidth
                            multiline
                            rows={6}
                            variant="outlined"
                            value={mailContent.message}
                            onChange={(e) => setMailContent({ ...mailContent, message: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setOpenMailDialog(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSendMail} sx={{ fontWeight: 700, borderRadius: 2 }}>Send Now</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Newsletter;
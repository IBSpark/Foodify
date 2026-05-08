import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Avatar,
    Chip,
    Tooltip,
    alpha,
    CircularProgress,
    useTheme,
} from "@mui/material";
import {
    DeleteOutline as DeleteIcon,
    RateReviewOutlined as ReviewIcon,
} from "@mui/icons-material";
import axios from "axios";

const Reviews = ({ showMessage }) => {
    const theme = useTheme();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5000/testimonial");
            setReviews(res.data);
        } catch (err) {
            console.error(err);
            showMessage("Failed to fetch reviews", "error");
        } finally {
            setLoading(false);
        }
    }, [showMessage]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await axios.delete(`http://localhost:5000/testimonial/${id}`);
                showMessage("Review deleted successfully", "success");
                fetchReviews();
            } catch (err) {
                console.error(err);
                showMessage("Failed to delete review", "error");
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box display="flex" alignItems="center" sx={{ mb: 3, gap: 1.5 }}>
                <ReviewIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                <Typography variant="h5" fontWeight="800" color="text.primary">
                    Customer Reviews
                </Typography>
                <Chip
                    label={`${reviews.length} Total`}
                    size="small"
                    sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#d97706', fontWeight: 700 }}
                />
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: '700' }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: '700' }}>Review</TableCell>
                            <TableCell sx={{ fontWeight: '700' }}>Date</TableCell>
                            <TableCell align="right" sx={{ fontWeight: '700' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviews.map((review) => (
                            <TableRow key={review._id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                bgcolor: alpha(theme.palette.secondary.main, 0.2),
                                                color: 'secondary.main'
                                            }}
                                        >
                                            <i className="fa fa-user"></i>
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="700">
                                                {review.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {review.profession}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 400 }}>
                                    <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic' }}>
                                        "{review.quote}"
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Delete Review">
                                        <IconButton
                                            onClick={() => handleDelete(review._id)}
                                            size="small"
                                            sx={{
                                                color: '#ef4444',
                                                '&:hover': { bgcolor: alpha('#ef4444', 0.1) }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Reviews;

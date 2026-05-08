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
    Button,
} from "@mui/material";
import {
    DeleteOutline as DeleteIcon,
    GroupsOutlined as TeamIcon,
    Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Team = ({ showMessage }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTeam = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5000/team");
            setTeam(res.data);
        } catch (err) {
            console.error(err);
            showMessage("Failed to fetch team members", "error");
        } finally {
            setLoading(false);
        }
    }, [showMessage]);

    useEffect(() => {
        fetchTeam();
    }, [fetchTeam]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this team member?")) {
            try {
                await axios.delete(`http://localhost:5000/deleteteam/${id}`);
                showMessage("Member removed successfully", "success");
                fetchTeam();
            } catch (err) {
                console.error(err);
                showMessage("Failed to remove member", "error");
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
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <TeamIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                    <Typography variant="h5" fontWeight="800" color="text.primary">
                        Our Team
                    </Typography>
                    <Chip
                        label={`${team.length} Members`}
                        size="small"
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700 }}
                    />
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/addteam")}
                    sx={{ borderRadius: '10px' }}
                >
                    Add Member
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: '700' }}>Member</TableCell>
                            <TableCell sx={{ fontWeight: '700' }}>Designation</TableCell>
                            <TableCell sx={{ fontWeight: '700' }}>Social Links</TableCell>
                            <TableCell align="right" sx={{ fontWeight: '700' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {team.map((member) => (
                            <TableRow key={member._id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar
                                            src={`http://localhost:5000${member.image}`}
                                            variant="rounded"
                                            sx={{ width: 45, height: 45, borderRadius: '10px' }}
                                        >
                                            {member.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="subtitle2" fontWeight="700">
                                            {member.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={member.designation}
                                        size="small"
                                        variant="outlined"
                                        sx={{ borderRadius: '6px', fontWeight: 600 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" gap={1}>
                                        {member.facebook && <Box component="span" sx={{ color: 'text.secondary', fontSize: '12px' }}>FB </Box>}
                                        {member.twitter && <Box component="span" sx={{ color: 'text.secondary', fontSize: '12px' }}>TW </Box>}
                                        {member.instagram && <Box component="span" sx={{ color: 'text.secondary', fontSize: '12px' }}>IG </Box>}
                                        {!member.facebook && !member.twitter && !member.instagram && <Typography variant="caption" color="text.disabled">No Links</Typography>}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Remove Member">
                                        <IconButton
                                            onClick={() => handleDelete(member._id)}
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
                        {team.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No team members found. Add one to get started!
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Team;

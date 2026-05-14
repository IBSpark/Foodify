import React, { useState, useEffect } from "react";
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
    Avatar,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Tooltip,
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Search as SearchIcon,
    Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Blog = ({ showMessage }) => {
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const fetchBlogs = React.useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5000/blogs");
            setBlogs(res.data);
        } catch (err) {
            console.error("Error fetching blogs:", err);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog post?")) {
            try {
                await axios.delete(`http://localhost:5000/deleteblog/${id}`);
                showMessage("Blog post deleted successfully", "success");
                fetchBlogs();
            } catch (err) {
                showMessage("Failed to delete blog post", "error");
            }
        }
    };

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                }}
            >
                <Typography variant="h5" fontWeight="800">
                    Blog Posts
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/addblog")}
                    sx={{ px: 3, borderRadius: 2 }}
                >
                    Add New Post
                </Button>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    border: (t) => `1px solid ${t.palette.divider}`,
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search blogs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    Image
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700 }}>
                                    Title
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700 }}>
                                    Author
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700 }}>
                                    Date
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        textAlign: "right",
                                    }}
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredBlogs.map((blog) => (
                                <TableRow key={blog._id} hover>
                                    <TableCell>
                                        <Avatar
                                            variant="rounded"
                                            src={`http://localhost:5000${blog.image}`}
                                            sx={{ width: 60, height: 40 }}
                                        />
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 600 }}>
                                        {blog.title}
                                    </TableCell>

                                    <TableCell>
                                        {blog.author}
                                    </TableCell>

                                    <TableCell>
                                        {new Date(blog.date).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell sx={{ textAlign: "right" }}>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={() =>
                                                    handleDelete(blog._id)
                                                }
                                                sx={{ color: "error.main" }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {filteredBlogs.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        sx={{
                                            textAlign: "center",
                                            py: 5,
                                        }}
                                    >
                                        <Typography color="text.secondary">
                                            No blog posts found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default Blog;
import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    IconButton,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddBlog = ({ showMessage }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        excerpt: "",
        content: "",
        image: null,
    });
    const [preview, setPreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.author || !formData.image) {
            showMessage("Please fill required fields and upload an image", "warning");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("title", formData.title);
        data.append("author", formData.author);
        data.append("excerpt", formData.excerpt);
        data.append("content", formData.content);
        data.append("image", formData.image);

        try {
            await axios.post("http://localhost:5000/addblog", data);
            showMessage("Blog post added successfully", "success");
            navigate("/blogs");
        } catch (err) {
            showMessage("Failed to add blog post", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" fontWeight="800">
                    Add New Blog Post
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    border: (t) => `1px solid ${t.palette.divider}`,
                    maxWidth: 800,
                    mx: "auto",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    border: "2px dashed",
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    p: 3,
                                    textAlign: "center",
                                    bgcolor: "background.default",
                                    cursor: "pointer",
                                    position: "relative",
                                    "&:hover": { borderColor: "primary.main" },
                                }}
                                onClick={() => document.getElementById("blog-image").click()}
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{ maxHeight: 200, borderRadius: 8 }}
                                    />
                                ) : (
                                    <>
                                        <CloudUploadIcon
                                            sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                                        />
                                        <Typography color="text.secondary">
                                            Click to upload cover image
                                        </Typography>
                                    </>
                                )}
                                <input
                                    type="file"
                                    id="blog-image"
                                    hidden
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                label="Blog Title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Author Name"
                                name="author"
                                required
                                value={formData.author}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Short Excerpt"
                                name="excerpt"
                                multiline
                                rows={2}
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                placeholder="A brief summary for the blog card..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Content"
                                name="content"
                                multiline
                                rows={10}
                                value={formData.content}
                                onChange={handleInputChange}
                                placeholder="Write your blog post here..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                                <Button onClick={() => navigate(-1)}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={loading}
                                    sx={{ px: 4 }}
                                >
                                    {loading ? "Publishing..." : "Publish Post"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default AddBlog;

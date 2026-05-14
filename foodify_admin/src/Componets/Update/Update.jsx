import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    alpha,
    useTheme,
    IconButton,
    CircularProgress,
    // Avatar,
} from "@mui/material";
import {
    CloudUploadOutlined as UploadIcon,
    ArrowBackIos as BackIcon,
    EditOutlined as EditIcon,
} from "@mui/icons-material";

export default function Update({ showMessage }) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [time, setTime] = useState("");
    const [type, setType] = useState("");
    const [image, setImage] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const { _id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await Axios.get(`http://localhost:5000/update/${_id}`);
                setTitle(res.data.mtitle);
                setPrice(res.data.mprice);
                setIngredients(res.data.mingredients || "");
                setTime(res.data.mtime || "");
                setType(res.data.mtype || "");
                setImage(res.data.mimage);
            } catch (err) {
                console.error("Error loading product:", err);
            } finally {
                setIsFetching(false);
            }
        };
        fetchProduct();
    }, [_id]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("price", price);
        formData.append("ingredients", ingredients);
        formData.append("time", time);
        formData.append("type", type);
        if (file) {
            formData.append("image", file);
        }

        try {
            await Axios.put(`http://localhost:5000/updatemenu/${_id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (showMessage) showMessage("Product updated successfully!", "success");
            navigate("/product");
        } catch (err) {
            console.error("Error updating product:", err);
            if (showMessage) showMessage("Failed to update product", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1 }}>
                <IconButton onClick={() => navigate(-1)} size="small" sx={{ mr: 1 }}>
                    <BackIcon fontSize="inherit" />
                </IconButton>
                <Box sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), p: 1, borderRadius: 2, display: 'flex' }}>
                    <EditIcon color="info" />
                </Box>
                <Typography variant="h5" fontWeight="700">Update Menu Item</Typography>
            </Box>

            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        maxWidth: 400,
                                        height: 200,
                                        border: `2px dashed ${theme.palette.divider}`,
                                        borderRadius: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.02) }
                                    }}
                                    component="label"
                                >
                                    <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                                    {preview ? (
                                        <Box component="img" src={preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : image ? (
                                        <Box component="img" src={`http://localhost:5000${image}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <UploadIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                                            <Typography variant="caption" color="text.secondary" display="block">Replace Image</Typography>
                                        </Box>
                                    )}
                                </Box>
                                <Typography variant="caption" color="text.disabled">Click image to upload a new replacement</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                label="Product Title"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Price (RS)"
                                type="number"
                                variant="outlined"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ingredients"
                                variant="outlined"
                                multiline
                                rows={2}
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Available Time</InputLabel>
                                <Select
                                    value={time}
                                    label="Available Time"
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                >
                                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                                    <MenuItem value="Lunch">Lunch</MenuItem>
                                    <MenuItem value="Dinner">Dinner</MenuItem>
                                    <MenuItem value="Snacks">Snacks</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Product Type</InputLabel>
                                <Select
                                    value={type}
                                    label="Product Type"
                                    onChange={(e) => setType(e.target.value)}
                                    required
                                >
                                    <MenuItem value="Veg">Vegetarian</MenuItem>
                                    <MenuItem value="Non-Veg">Non-Vegetarian</MenuItem>
                                    <MenuItem value="Drink">Beverage</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button
                                onClick={() => navigate(-1)}
                                variant="outlined"
                                fullWidth
                                color="inherit"
                                size="large"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={isLoading}
                                sx={{ boxShadow: 'none' }}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Update Product"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}

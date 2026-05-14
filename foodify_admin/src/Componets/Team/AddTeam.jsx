import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    IconButton,
    InputAdornment,
    // alpha,
    CircularProgress,
} from "@mui/material";
import {
    PhotoCamera as PhotoCameraIcon,
    GroupsOutlined as TeamIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    ArrowBack as BackIcon,
    CheckCircleOutline as SaveIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddTeam = ({ showMessage }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        facebook: "",
        twitter: "",
        instagram: "",
        image: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("designation", formData.designation);
        data.append("facebook", formData.facebook);
        data.append("twitter", formData.twitter);
        data.append("instagram", formData.instagram);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            await axios.post("http://localhost:5000/addteam", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            showMessage("Team member added successfully!", "success");
            navigate("/team");
        } catch (err) {
            console.error(err);
            showMessage("Failed to add team member", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: "auto" }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 3 }}>
                <IconButton onClick={() => navigate("/team")} size="small">
                    <BackIcon />
                </IconButton>
                <TeamIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                <Typography variant="h5" fontWeight="800">
                    Add Team Member
                </Typography>
            </Box>

            <Paper sx={{ p: 4, borderRadius: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} display="flex" flexDirection="column" alignItems="center" gap={2}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={imagePreview}
                                    sx={{ width: 120, height: 120, borderRadius: '20px', bgcolor: '#f0f2f5' }}
                                >
                                    {!imagePreview && <TeamIcon sx={{ fontSize: 60, color: '#bdc3c7' }} />}
                                </Avatar>
                                <IconButton
                                    color="primary"
                                    aria-label="upload picture"
                                    component="label"
                                    sx={{
                                        position: 'absolute',
                                        bottom: -10,
                                        right: -10,
                                        bgcolor: 'white',
                                        boxShadow: 2,
                                        '&:hover': { bgcolor: '#f8f9fa' }
                                    }}
                                >
                                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                                    <PhotoCameraIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                Upload profile picture (Recommended: Square)
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Designation"
                                name="designation"
                                placeholder="e.g. Executive Chef"
                                value={formData.designation}
                                onChange={handleInputChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" fontWeight="700" color="text.secondary" sx={{ mb: 2 }}>
                                Social Profiles (Optional)
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Facebook URL"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FacebookIcon sx={{ color: '#1877f2', fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Twitter URL"
                                name="twitter"
                                value={formData.twitter}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TwitterIcon sx={{ color: '#1da1f2', fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Instagram URL"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <InstagramIcon sx={{ color: '#e4405f', fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/team")}
                                sx={{ borderRadius: '10px', px: 4 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                sx={{ borderRadius: '10px', px: 4 }}
                            >
                                {loading ? "Saving..." : "Save Member"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default AddTeam;

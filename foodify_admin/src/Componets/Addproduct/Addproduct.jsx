import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  CloudUploadOutlined as UploadIcon,
  ArrowBackIos as BackIcon,
  RestaurantMenuOutlined as MenuIcon,
} from "@mui/icons-material";

export default function Addproduct({ showMessage }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const doadd = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", title);
    data.append("price", price);
    data.append("ingredients", ingredients);
    data.append("time", time);
    data.append("type", type);
    if (image) data.append("image", image);

    try {
      await Axios.post("http://localhost:5000/addproduct", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (showMessage) showMessage("Product added successfully!", "success");
      navigate("/product");
    } catch (err) {
      console.error("Upload failed", err.response?.data || err.message);
      if (showMessage) showMessage("Failed to add product", "error");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1 }}>
        <IconButton onClick={() => navigate(-1)} size="small" sx={{ mr: 1 }}>
          <BackIcon fontSize="inherit" />
        </IconButton>
        <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), p: 1, borderRadius: 2, display: 'flex' }}>
          <MenuIcon color="primary" />
        </Box>
        <Typography variant="h5" fontWeight="700">Add New Menu Item</Typography>
      </Box>

      {/* Form Card */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          border: 'none',
          bgcolor: 'background.paper',
        }}
      >
        <form onSubmit={doadd}>
          {/* Row 1: Upload Area + Product Title */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mb: 3,
          }}>
            {/* Image Upload — Circle / Dashed Area */}
            <Box
              component="label"
              sx={{
                width: { xs: '100%', md: 200 },
                minHeight: 180,
                border: `2px dashed ${theme.palette.primary.main}`,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                transition: 'all 0.25s',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                  borderColor: theme.palette.primary.dark,
                },
              }}
            >
              <input type="file" hidden onChange={handleImageChange} accept="image/jpeg,image/png,image/webp" />
              {preview ? (
                <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 3,
                  }}
                />
              ) : (
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  <UploadIcon sx={{ fontSize: 44, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight="500" sx={{ lineHeight: 1.4 }}>
                    Click to upload product image
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                    Supports: JPG, PNG, WEBP
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Product Title */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="Product Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '15px',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Row 2: Price + Ingredients + Availability + Product Type */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 4,
          }}>
            {/* Price */}
            <TextField
              label="Price (RS)"
              type="number"
              variant="outlined"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              sx={{
                width: { xs: '100%', sm: 200 },
                flexShrink: 0,
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
              }}
            />

            {/* Ingredients */}
            <TextField
              label="Ingredients"
              variant="outlined"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., Tomato, Mozzarella"
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
              }}
            />

            {/* Availability */}
            <FormControl sx={{ minWidth: 80 }}>
              <InputLabel sx={{ fontSize: '13px' }}>Av.</InputLabel>
              <Select
                value={time}
                label="Timming"
                onChange={(e) => setTime(e.target.value)}
                sx={{ borderRadius: 2, '& .MuiSelect-select': { fontSize: '13px' } }}
              >
                <MenuItem value="Breakfast">Breakfast</MenuItem>
                <MenuItem value="Lunch">Lunch</MenuItem>
                <MenuItem value="Dinner">Dinner</MenuItem>
                <MenuItem value="Snacks">Snacks</MenuItem>
              </Select>
            </FormControl>

            {/* Product Type */}
            <FormControl sx={{ minWidth: 80 }}>
              <InputLabel sx={{ fontSize: '13px' }}>Pr.</InputLabel>
              <Select
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value)}
                sx={{ borderRadius: 2, '& .MuiSelect-select': { fontSize: '13px' } }}
              >
                <MenuItem value="Veg">Veg</MenuItem>
                <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                <MenuItem value="Drink">Drink</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              px: 5,
              fontSize: '15px',
              fontWeight: 700,
              borderRadius: '30px',
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            Publish to Menu
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

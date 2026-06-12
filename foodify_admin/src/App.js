import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box, Snackbar, Alert, Typography, Divider } from "@mui/material";
import { RestaurantOutlined as RestaurantIcon, FavoriteBorderOutlined as HeartIcon } from "@mui/icons-material";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from "./Componets/Navbar/Navbar.jsx";
import Sidebar from "./Componets/Sidebar/Sidebar.jsx";
import Overview from "./Componets/Dashboard/Dashboard.jsx";
import Analytics from "./Componets/Analytics/Analytics.jsx";
import Addproduct from "./Componets/Addproduct/Addproduct.jsx";
import Product from "./Componets/Products/Product.jsx";
import Update from "./Componets/Update/Update.jsx";
import BookingTable from "./Componets/Booking/Bookings.jsx";
import OrdersTable from "./Componets/Orders/Orders.jsx";
import Newsletter from "./Componets/Newsletter/Newsletter.jsx";
import Settings from "./Componets/Settings/Settings.jsx";
import Reviews from "./Componets/Reviews/Reviews.jsx";
import Team from "./Componets/Team/Team.jsx";
import AddTeam from "./Componets/Team/AddTeam.jsx";
import Blog from "./Componets/Blog/Blog.jsx";
import AddBlog from "./Componets/Blog/AddBlog.jsx";
import Login from "./Componets/Login/Login.jsx";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
// console.log("Google Client ID:", GOOGLE_CLIENT_ID);

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('adminUser'));
    if (user && user.authenticated) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) return null; // Wait for check

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const [mode, setMode] = useState('light');
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#16a34a' },
      secondary: { main: '#f59e0b' },
      background: {
        default: mode === 'light' ? '#f9fafb' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
      divider: mode === 'light' ? '#e5e7eb' : '#334155',
    },
    shadows: [
      'none',
      mode === 'light'
        ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      mode === 'light'
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        : '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      ...Array(22).fill('none') // Fill the rest to maintain MUI shadows array integrity
    ],
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: 'box-shadow 0.3s ease-in-out',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: 'box-shadow 0.3s ease-in-out',
          },
        },
      },
    },
  }), [mode]);

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const showMessage = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
                    <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

                    <Box sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      width: { lg: `calc(100% - 260px)` }
                    }}>
                      <Navbar
                        mode={mode}
                        toggleTheme={toggleTheme}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onMenuClick={handleDrawerToggle}
                      />

                      <Box component="main" sx={{ flexGrow: 1, p: 0, mt: '64px', pb: '52px' }}>
                        <Routes>
                          <Route path="/" element={<Overview />} />
                          <Route path="/overview" element={<Overview />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/addproduct" element={<Addproduct showMessage={showMessage} />} />
                          <Route path="/product" element={<Product searchQuery={searchQuery} showMessage={showMessage} />} />
                          <Route path="/update/:_id" element={<Update showMessage={showMessage} />} />
                          <Route path="/booking" element={<BookingTable searchQuery={searchQuery} showMessage={showMessage} />} />
                          <Route path="/orders" element={<OrdersTable searchQuery={searchQuery} showMessage={showMessage} />} />
                          <Route path="/newsletter" element={<Newsletter showMessage={showMessage} />} />
                          <Route path="/settings" element={<Settings showMessage={showMessage} />} />
                          <Route path="/reviews" element={<Reviews showMessage={showMessage} />} />
                          <Route path="/team" element={<Team showMessage={showMessage} />} />
                          <Route path="/addteam" element={<AddTeam showMessage={showMessage} />} />
                          <Route path="/blogs" element={<Blog showMessage={showMessage} />} />
                          <Route path="/addblog" element={<AddBlog showMessage={showMessage} />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Box>

                      {/* Fixed Footer */}
                      <Box
                        component="footer"
                        sx={{
                          position: 'fixed',
                          bottom: 0,
                          right: 0,
                          left: { xs: 0, lg: '260px' },
                          borderTop: (t) => `1px solid ${t.palette.divider}`,
                          bgcolor: 'background.paper',
                          py: 1.5,
                          px: { xs: 2, md: 4 },
                          zIndex: (t) => t.zIndex.appBar - 1,
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1,
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <RestaurantIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                            <Typography variant="body2" fontWeight="700" color="text.primary" sx={{ fontSize: '13px' }}>
                              Foodify <Box component="span" sx={{ color: 'primary.main' }}>Resturant</Box>
                            </Typography>
                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                              Admin Dashboard
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              © {new Date().getFullYear()} Foodify Resturant. Made with
                            </Typography>
                            <HeartIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                            <Typography variant="caption" color="text.secondary">
                              — v2.0
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* Global Notification System */}
          <Snackbar
            open={notification.open}
            autoHideDuration={4000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseNotification}
              severity={notification.severity}
              variant="filled"
              sx={{ width: '100%', borderRadius: 2 }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

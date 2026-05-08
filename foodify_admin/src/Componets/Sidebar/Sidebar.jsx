import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Box,
    Typography,
    Divider,
    useTheme,
    useMediaQuery,
    alpha,
    Button,
} from "@mui/material";
import {
    DashboardOutlined as DashboardIcon,
    HistoryOutlined as HistoryIcon,
    RestaurantMenuOutlined as MenuIcon,
    PeopleOutlined as CustomersIcon,
    AssessmentOutlined as AnalyticsIcon,
    SettingsOutlined as SettingsIcon,
    RestaurantOutlined as FoodIcon,
    RateReviewOutlined as ReviewIcon,
    EmailOutlined as EmailIcon,
    ArticleOutlined as BlogIcon,
    LogoutOutlined as LogoutIcon,
} from "@mui/icons-material";

const drawerWidth = 260;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    const navItems = [
        { to: "/", label: "Dashboard", icon: DashboardIcon },
        { to: "/orders", label: "Order History", icon: HistoryIcon },
        { to: "/product", label: "Menu Items", icon: FoodIcon },
        { to: "/addproduct", label: "Add Food", icon: MenuIcon },
        { to: "/booking", label: "Reservations", icon: CustomersIcon },
        { to: "/newsletter", label: "Newsletter", icon: EmailIcon },
        { to: "/reviews", label: "Customer Reviews", icon: ReviewIcon },
        { to: "/blogs", label: "Blog Posts", icon: BlogIcon },
        { to: "/team", label: "Our Team", icon: CustomersIcon },
        // { to: "/addteam", label: "Add Member", icon: MenuIcon },
        { to: "/analytics", label: "Analytics", icon: AnalyticsIcon },
        { to: "/settings", label: "Settings", icon: SettingsIcon },
    ];

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    p: 1,
                    borderRadius: '10px',
                    display: 'flex'
                }}>
                    <FoodIcon />
                </Box>
                <Typography variant="h6" fontWeight="800" color="text.primary" sx={{ letterSpacing: '-0.5px' }}>
                    Foodify <span style={{ color: theme.palette.primary.main }}>Resturant</span>
                </Typography>
            </Box>

            <Divider sx={{ mx: 2, opacity: 0.5 }} />

            <List sx={{ px: 2, py: 3, flexGrow: 1, overflowY: 'auto' }}>
                {navItems.map((item) => (
                    <ListItem key={item.to} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={NavLink}
                            to={item.to}
                            onClick={isMobile ? handleDrawerToggle : undefined}
                            sx={{
                                borderRadius: '12px',
                                py: 1.2,
                                '&.active': {
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                    color: 'primary.main',
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiListItemText-primary': {
                                        fontWeight: '700',
                                    }
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                                <item.icon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ fontSize: '14px', fontWeight: '500' }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ mx: 2, opacity: 0.5 }} />

            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        borderRadius: '12px',
                        py: 1,
                        textTransform: 'none',
                        fontWeight: '600',
                        borderColor: alpha(theme.palette.error.main, 0.3),
                        '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.05),
                            borderColor: theme.palette.error.main,
                        }
                    }}
                >
                    Logout
                </Button>
            </Box>

            <Box sx={{ p: 3, pt: 0 }}>
                {/* <Box sx={{
                    p: 2,
                    bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : alpha(theme.palette.primary.main, 0.05),
                    borderRadius: '16px',
                    border: `1px solid ${theme.palette.divider}`
                }}>
                    <Typography variant="caption" fontWeight="700" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        RESTAURANT STATUS
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#16a34a' }} />
                        <Typography variant="body2" fontWeight="600">Open for Business</Typography>
                    </Box>
                </Box> */}
            </Box>
        </Box>
    );


    return (
        <Box
            component="nav"
            sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
        >
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', lg: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
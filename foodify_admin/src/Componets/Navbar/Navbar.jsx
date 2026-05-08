import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    InputBase,
    IconButton,
    Avatar,
    alpha,
    styled,
    useTheme,
    Paper,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Chip,
    ClickAwayListener,
    Fade,
    Popover,
    Divider,
} from '@mui/material';
import {
    Search as SearchIcon,
    DarkModeOutlined as DarkModeIcon,
    LightModeOutlined as LightModeIcon,
    Menu as MenuIcon,
    HistoryOutlined as OrdersIcon,
    RestaurantMenuOutlined as ProductIcon,
    EventSeatOutlined as BookingIcon,
    DashboardOutlined as DashboardIcon,
    AddCircleOutlined as AddIcon,
    AssessmentOutlined as AnalyticsIcon,
    ArrowForwardOutlined as GoIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    PersonOutlined as PersonIcon,
    StorefrontOutlined as StoreIcon,
    HistoryOutlined as HistoryIcon,
    GroupOutlined as GroupIcon,
    ReceiptOutlined as ReceiptIcon,
    LogoutOutlined as LogoutIcon,
    SettingsOutlined as SettingsIcon,
} from '@mui/icons-material';
import Notification from '../Notification/Notification';

// Searchable pages with keywords
const searchablePages = [
    { path: '/', label: 'Dashboard', icon: DashboardIcon, keywords: ['dashboard', 'overview', 'home', 'stats', 'summary'] },
    { path: '/orders', label: 'Order History', icon: OrdersIcon, keywords: ['orders', 'order', 'history', 'placed', 'status', 'customer', 'table'] },
    { path: '/product', label: 'Menu Items', icon: ProductIcon, keywords: ['menu', 'product', 'products', 'food', 'items', 'dish', 'price'] },
    { path: '/addproduct', label: 'Add Food', icon: AddIcon, keywords: ['add', 'new', 'create', 'food', 'product', 'upload', 'image'] },
    { path: "/booking", label: 'Reservations', icon: BookingIcon, keywords: ['booking', 'reservation', 'reserve', 'table', 'guest', 'people', 'date'] },
    { path: "/newsletter", label: "Newsletter", icon: AnalyticsIcon, keywords: ["newsletter", "subscribers", "email", "marketing", "offers"] },
    { path: '/analytics', label: 'Analytics', icon: AnalyticsIcon, keywords: ['analytics', 'chart', 'report', 'revenue', 'sales', 'graph'] },
    { path: '/settings', label: 'Settings', icon: SettingsIcon, keywords: ['settings', 'config', 'setup', 'store', 'tax', 'payment', 'printer'] },
];

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '12px',
    backgroundColor: theme.palette.mode === 'light' ? '#f3f4f6' : alpha(theme.palette.common.white, 0.05),
    '&:hover': {
        backgroundColor: theme.palette.mode === 'light' ? '#e5e7eb' : alpha(theme.palette.common.white, 0.1),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: '280px',
    },
    [theme.breakpoints.up('md')]: {
        width: '400px',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: theme.palette.text.primary,
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        fontSize: '13px',
        [theme.breakpoints.up('md')]: {
            fontSize: '14px',
        },
    },
}));

const Navbar = ({ mode, toggleTheme, searchQuery, setSearchQuery, onMenuClick }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [showResults, setShowResults] = useState(false);
    const [adminAnchor, setAdminAnchor] = useState(null);
    const searchRef = useRef(null);

    // Get user info from localStorage
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    // Filter pages based on search query
    const filteredPages = searchQuery.trim()
        ? searchablePages.filter(page => {
            const q = searchQuery.toLowerCase();
            return (
                page.label.toLowerCase().includes(q) ||
                page.keywords.some(kw => kw.includes(q))
            );
        })
        : [];

    // Navigate to a page and clear search
    const handleNavigate = (path) => {
        navigate(path);
        setShowResults(false);
        // Only clear search when navigating to non-data pages
        if (path === '/' || path === '/addproduct' || path === '/analytics') {
            setSearchQuery('');
        }
    };

    // Handle Enter key to navigate to the first result or filter data
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (filteredPages.length > 0) {
                handleNavigate(filteredPages[0].path);
            }
        }
        if (e.key === 'Escape') {
            setShowResults(false);
        }
    };

    // Close dropdown when navigating
    useEffect(() => {
        setShowResults(false);
    }, [location.pathname]);

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderBottom: `1px solid ${theme.palette.divider}`,
                height: '64px',
                justifyContent: 'center',
                left: { xs: 0, lg: '260px' },
                width: { xs: '100%', lg: 'calc(100% - 260px)' },
                zIndex: theme.zIndex.drawer - 1,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1.5, md: 4 } }}>
                {/* Left Side: Mobile Menu Button */}
                <Box sx={{ display: { lg: 'none' }, mr: 1 }}>
                    <IconButton
                        size="small"
                        edge="start"
                        onClick={onMenuClick}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>

                {/* Center: Smart Search Bar */}
                <ClickAwayListener onClickAway={() => setShowResults(false)}>
                    <Box sx={{ flexGrow: 1, position: 'relative' }} ref={searchRef}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon fontSize="small" />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search pages, orders, products, bookings..."
                                inputProps={{ 'aria-label': 'search' }}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowResults(e.target.value.trim().length > 0);
                                }}
                                onFocus={() => searchQuery.trim() && setShowResults(true)}
                                onKeyDown={handleKeyDown}
                            />
                        </Search>

                        {/* Search Results Dropdown */}
                        <Fade in={showResults && filteredPages.length > 0}>
                            <Paper
                                elevation={8}
                                sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    mt: 1,
                                    width: { xs: '100%', sm: 360 },
                                    borderRadius: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                    overflow: 'hidden',
                                    zIndex: 1300,
                                }}
                            >
                                <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                    <Typography variant="caption" fontWeight="600" color="text.secondary">
                                        NAVIGATE TO
                                    </Typography>
                                </Box>
                                <List disablePadding>
                                    {filteredPages.map((page) => {
                                        const Icon = page.icon;
                                        const isActive = location.pathname === page.path;
                                        return (
                                            <ListItemButton
                                                key={page.path}
                                                onClick={() => handleNavigate(page.path)}
                                                sx={{
                                                    py: 1.2,
                                                    px: 2,
                                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.06) },
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 38 }}>
                                                    <Icon fontSize="small" sx={{ color: isActive ? 'primary.main' : 'text.secondary' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={page.label}
                                                    primaryTypographyProps={{
                                                        fontSize: '13px',
                                                        fontWeight: isActive ? 700 : 500,
                                                        color: isActive ? 'primary.main' : 'text.primary',
                                                    }}
                                                />
                                                {isActive ? (
                                                    <Chip label="Current" size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
                                                ) : (
                                                    <GoIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                                                )}
                                            </ListItemButton>
                                        );
                                    })}
                                </List>

                                {/* Hint: data pages also filter inline */}
                                {(filteredPages.some(p => ['/orders', '/product', '/booking'].includes(p.path))) && (
                                    <Box sx={{ px: 2, py: 1.2, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                                        <Typography variant="caption" color="text.secondary">
                                            💡 Typing also filters data on <b>Orders</b>, <b>Products</b> & <b>Reservations</b> pages
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Fade>
                    </Box>
                </ClickAwayListener>

                {/* Right Side: Icons & User */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 2 } }}>
                    {/* Theme Toggle */}
                    <IconButton size="small" onClick={toggleTheme}>
                        {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </IconButton>

                    {/* Live Notifications */}
                    <Notification />

                    {/* Admin Panel Dropdown */}
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            onClick={(e) => setAdminAnchor(adminAnchor ? null : e.currentTarget)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                ml: 1,
                                cursor: 'pointer',
                                gap: 1,
                                px: 1,
                                py: 0.5,
                                borderRadius: '12px',
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                                transition: 'background 0.2s',
                            }}
                        >
                            <Avatar
                                src={user?.picture}
                                sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: 'primary.main',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                }}
                            >
                                {user?.name?.charAt(0) || 'A'}
                            </Avatar>
                            <Typography
                                variant="body2"
                                fontWeight="700"
                                sx={{ display: { xs: 'none', md: 'block' }, whiteSpace: 'nowrap' }}
                            >
                                Admin Panel
                            </Typography>
                            <KeyboardArrowDownIcon
                                sx={{
                                    fontSize: 18,
                                    color: 'text.secondary',
                                    display: { xs: 'none', md: 'block' },
                                    transform: adminAnchor ? 'rotate(180deg)' : 'rotate(0)',
                                    transition: 'transform 0.2s',
                                }}
                            />
                        </Box>

                        {/* Admin Dropdown Menu */}
                        <Popover
                            open={Boolean(adminAnchor)}
                            anchorEl={adminAnchor}
                            onClose={() => setAdminAnchor(null)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            TransitionComponent={Fade}
                            slotProps={{
                                paper: {
                                    elevation: 8,
                                    sx: {
                                        width: 260,
                                        borderRadius: 3,
                                        border: `1px solid ${theme.palette.divider}`,
                                        overflow: 'hidden',
                                        mt: 1,
                                    },
                                },
                            }}
                        >
                            {/* Profile Header */}
                            <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar
                                    src={user?.picture}
                                    sx={{ width: 40, height: 40, bgcolor: 'text.secondary' }}
                                >
                                    {user?.name?.charAt(0) || <PersonIcon />}
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" fontWeight="700" sx={{ textTransform: 'capitalize' }}>
                                        {user?.name || 'Admin'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {user?.email || 'admin@shahsdarbar.com'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider />

                            {/* Menu Items */}
                            <List disablePadding sx={{ py: 0.5 }}>
                                {[
                                    { icon: <StoreIcon fontSize="small" />, label: 'Store Profile', path: '/settings', color: 'primary.main', bold: true },
                                    { icon: <HistoryIcon fontSize="small" />, label: 'Order History', path: '/orders' },
                                    { icon: <GroupIcon fontSize="small" />, label: 'Staff Settings', path: '/team' },
                                    { icon: <ReceiptIcon fontSize="small" />, label: 'Billing', path: '/analytics' },
                                ].map((item) => (
                                    <ListItemButton
                                        key={item.label}
                                        onClick={() => {
                                            if (item.path) navigate(item.path);
                                            setAdminAnchor(null);
                                        }}
                                        sx={{
                                            py: 1.2,
                                            px: 2.5,
                                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 36, color: item.color || 'text.secondary' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontSize: '13px',
                                                fontWeight: item.bold ? 600 : 500,
                                                color: item.color || 'text.primary',
                                            }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>

                            <Divider />

                            {/* Sign Out */}
                            <List disablePadding sx={{ py: 0.5 }}>
                                <ListItemButton
                                    onClick={handleSignOut}
                                    sx={{
                                        py: 1.2,
                                        px: 2.5,
                                        '&:hover': { bgcolor: alpha('#ef4444', 0.04) },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36, color: '#ef4444' }}>
                                        <LogoutIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Sign out"
                                        primaryTypographyProps={{ fontSize: '13px', fontWeight: 600, color: '#ef4444' }}
                                    />
                                </ListItemButton>
                            </List>
                        </Popover>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

import React, { useState, useEffect } from "react";
import Axios from "axios";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    // IconButton,
    alpha,
    useTheme,
    // InputAdornment,
    // Divider,
    CircularProgress,
} from "@mui/material";
import {
    SettingsOutlined as SettingsIcon,
    StorefrontOutlined as StoreIcon,
    PercentOutlined as TaxIcon,
    PaymentOutlined as PaymentIcon,
    PrintOutlined as PrinterIcon,
    SaveOutlined as SaveIcon,
    InfoOutlined as InfoIcon,
    WifiOutlined as WifiIcon,
} from "@mui/icons-material";
import "./Settings.css";

export default function Settings({ showMessage }) {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        location: "",
        phone: "",
        operatingHours: "",
        salesTax: "",
        taxId: "",
        stripeKey: "",
        paypalId: "",
        kitchenPrinter: "",
        receiptPrinter: "",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await Axios.get("http://localhost:3000/settings");
                setSettings(res.data);
            } catch (err) {
                console.error("Failed to fetch settings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (field) => (e) => {
        setSettings({ ...settings, [field]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await Axios.post("http://localhost:3000/settings", settings);
            if (showMessage) showMessage("Settings saved successfully!", "success");
        } catch (err) {
            console.error("Failed to save settings", err);
            if (showMessage) showMessage("Failed to save settings", "error");
        } finally {
            setSaving(false);
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
        <Box className="settings-container" sx={{ p: { xs: 2, md: 4 }, minHeight: '100%', bgcolor: 'background.default' }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 4,
                gap: 2,
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), p: 1.5, borderRadius: 3, display: 'flex' }}>
                        <SettingsIcon color="primary" />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight="800" color="text.primary">System Settings</Typography>
                        <Typography variant="body2" color="text.secondary">Configure your restaurant's core parameters</Typography>
                    </Box>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6 }}>
                    User ID: admin-us...
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Store Information */}
                <Grid item xs={12} md={6}>
                    <Paper className="settings-card" elevation={1} sx={{ bgcolor: 'background.paper', border: 'none' }}>
                        <Box className="card-header" sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <StoreIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="subtitle1" fontWeight="700" color="text.primary">Store Information</Typography>
                        </Box>
                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Box>
                                <Typography className="input-label" color="text.secondary">Location Address</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={settings.location}
                                    onChange={handleChange('location')}
                                    className="custom-textfield"
                                />
                            </Box>
                            <Box>
                                <Typography className="input-label" color="text.secondary">Phone Number</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={settings.phone}
                                    onChange={handleChange('phone')}
                                    className="custom-textfield"
                                />
                            </Box>
                            <Box>
                                <Typography className="input-label" color="text.secondary">Operating Hours</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    value={settings.operatingHours}
                                    onChange={handleChange('operatingHours')}
                                    className="custom-textfield"
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Tax Rates Management */}
                <Grid item xs={12} md={6}>
                    <Paper className="settings-card" elevation={1} sx={{ bgcolor: 'background.paper', border: 'none' }}>
                        <Box className="card-header" sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <TaxIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="subtitle1" fontWeight="700" color="text.primary">Tax Rates Management</Typography>
                        </Box>
                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Box>
                                <Typography className="input-label" color="text.secondary">Local Sales Tax (%)</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={settings.salesTax}
                                    onChange={handleChange('salesTax')}
                                    className="custom-textfield"
                                />
                            </Box>
                            <Box>
                                <Typography className="input-label" color="text.secondary">Tax ID / VAT Number</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={settings.taxId}
                                    onChange={handleChange('taxId')}
                                    className="custom-textfield"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                                    Tax is applied automatically to all sales transactions.
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Payment Gateway Setup */}
                <Grid item xs={12} md={6}>
                    <Paper className="settings-card" elevation={1} sx={{ bgcolor: 'background.paper', border: 'none' }}>
                        <Box className="card-header" sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <PaymentIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="subtitle1" fontWeight="700" color="text.primary">Payment Gateway Setup</Typography>
                        </Box>
                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Box className="warning-box" sx={{ border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                                <InfoIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                                <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 600 }}>
                                    Warning: API Keys grant full access to your funds. Handle with care.
                                </Typography>
                            </Box>
                            <Box>
                                <Typography className="input-label" color="text.secondary">Stripe Secret Key</Typography>
                                <TextField
                                    fullWidth
                                    type="password"
                                    variant="outlined"
                                    value={settings.stripeKey}
                                    onChange={handleChange('stripeKey')}
                                    className="custom-textfield"
                                />
                            </Box>
                            <Box>
                                <Typography className="input-label" color="text.secondary">PayPal Client ID</Typography>
                                <TextField
                                    fullWidth
                                    type="password"
                                    variant="outlined"
                                    value={settings.paypalId}
                                    onChange={handleChange('paypalId')}
                                    className="custom-textfield"
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Printer Configuration */}
                <Grid item xs={12} md={6}>
                    <Paper className="settings-card" elevation={1} sx={{ bgcolor: 'background.paper', border: 'none' }}>
                        <Box className="card-header" sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <PrinterIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="subtitle1" fontWeight="700" color="text.primary">Printer Configuration</Typography>
                        </Box>
                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Box>
                                <Typography className="input-label" color="text.secondary">Kitchen Printer IP Address</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={settings.kitchenPrinter}
                                    onChange={handleChange('kitchenPrinter')}
                                    className="custom-textfield"
                                />
                            </Box>
                            <Box>
                                <Typography className="input-label" color="text.secondary">Receipt Printer IP Address</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={settings.receiptPrinter}
                                    onChange={handleChange('receiptPrinter')}
                                    className="custom-textfield"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <WifiIcon sx={{ fontSize: 14, color: theme.palette.primary.main }} />
                                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                    Test Connection
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid >
            </Grid >

            {/* Footer Save Button */}
            < Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', pb: 2 }
            }>
                <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                        bgcolor: 'primary.main',
                        px: { xs: 4, sm: 6 },
                        py: 1.5,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontSize: '15px',
                        fontWeight: '700',
                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                        width: { xs: '100%', sm: 'auto' },
                        '&:hover': {
                            bgcolor: 'primary.dark',
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }
                    }}
                >
                    Save All Settings
                </Button>
            </Box >
        </Box >
    );
}

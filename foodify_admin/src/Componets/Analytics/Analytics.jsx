import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Button,
    Avatar,
    List,
    ListItem,
    CircularProgress,
    useTheme,
    alpha,
    Tooltip,
} from '@mui/material';
import {
    DescriptionOutlined as ReportIcon,
    FileDownloadOutlined as DownloadIcon,
    AssessmentOutlined as AnalyticsIcon,
} from '@mui/icons-material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

// ─── Helper: Generate CSV and trigger download ───
function downloadCSV(filename, headers, rows) {
    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ─── Helper: Generate simple PDF and trigger download ───
function downloadPDF(title, lines) {
    // Create a printable HTML document and open for printing / saving as PDF
    const html = `
    <!DOCTYPE html>
    <html><head><title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        h1 { color: #16a34a; margin-bottom: 8px; }
        h2 { color: #555; font-weight: normal; font-size: 14px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { padding: 10px 14px; border: 1px solid #e5e7eb; text-align: left; font-size: 13px; }
        th { background-color: #f9fafb; font-weight: 700; }
        .footer { margin-top: 40px; font-size: 11px; color: #aaa; }
    </style></head><body>
    <h1>${title}</h1>
    <h2>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</h2>
    <table>
        <thead><tr>${lines.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${lines.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
    <div class="footer">Shah’s Darbar Admin Panel — Auto-generated report</div>
    </body></html>`;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
}

const Analytics = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchAll = useCallback(async () => {
        try {
            const [ordRes, bkRes, prRes] = await Promise.all([
                axios.get('http://localhost:5000/orders'),
                axios.get('http://localhost:5000/bookinglist'),
                axios.get('http://localhost:5000/menulist'),
            ]);
            setOrders(ordRes.data);
            setBookings(bkRes.data);
            setProducts(prRes.data);
            setLastUpdated(new Date());
        } catch (e) {
            console.error('Analytics fetch error:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();

        // Auto-refresh every 24 hours (1000ms * 60s * 60m * 24h)
        const REFRESH_INTERVAL = 1000 * 60 * 60 * 24;
        const interval = setInterval(fetchAll, REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, [fetchAll]);

    // ─── Revenue by Category ───
    // ─── Revenue by Category (Based on Sales) ───
    const categoryRevenue = useMemo(() => {
        const cats = {};
        // Create a map of product title -> category (type)
        const productCategoryMap = {};
        products.forEach(p => {
            productCategoryMap[p.title] = p.type || 'Other';
        });

        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const cat = productCategoryMap[item.title] || 'Other';
                    const revenue = (item.price || 0) * (item.quantity || 1);
                    cats[cat] = (cats[cat] || 0) + revenue;
                });
            }
        });

        const labels = Object.keys(cats).length > 0 ? Object.keys(cats) : ['Appetizers', 'Main Courses', 'Drinks', 'Desserts', 'Sides'];
        const data = Object.keys(cats).length > 0 ? Object.values(cats) : [0, 0, 0, 0, 0];
        return { labels, data };
    }, [orders, products]);

    const categoryChartData = {
        labels: categoryRevenue.labels,
        datasets: [{
            label: 'Sales',
            data: categoryRevenue.data,
            backgroundColor: '#f59e0b',
            borderRadius: 6,
            barThickness: 60,
            maxBarThickness: 80,
        }],
    };

    const categoryOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1f2937',
                titleFont: { weight: '700' },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (ctx) => `Revenue: Rs:${ctx.raw.toLocaleString()}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: theme.palette.text.disabled,
                    font: { size: 11 },
                    callback: (v) => `RS:${(v / 1000).toFixed(1)}K`,
                },
                grid: { color: alpha(theme.palette.divider, 0.5), drawBorder: false },
            },
            x: {
                ticks: { color: theme.palette.text.secondary, font: { weight: '600', size: 11 } },
                grid: { display: false },
            },
        },
    };

    // ─── 7-Day Orders & Reservations Line Chart ───
    const last7Days = useMemo(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d);
        }
        return days;
    }, []);

    const dayLabels = last7Days.map(d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));

    const ordersByDay = useMemo(() => last7Days.map(day => {
        const dayStr = day.toDateString();
        return orders.filter(o => new Date(o.orderDate).toDateString() === dayStr).length;
    }), [orders, last7Days]);

    const bookingsByDay = useMemo(() => last7Days.map(day => {
        const dayStr = day.toDateString();
        return bookings.filter(b => new Date(b.date || b.createdAt).toDateString() === dayStr).length;
    }), [bookings, last7Days]);

    const weeklyChartData = {
        labels: dayLabels,
        datasets: [
            {
                label: 'Orders',
                data: ordersByDay,
                borderColor: '#f59e0b',
                backgroundColor: alpha('#f59e0b', 0.1),
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#f59e0b',
                pointBorderWidth: 2,
                pointBorderColor: '#fff',
                borderWidth: 2.5,
            },
            {
                label: 'Reservations',
                data: bookingsByDay,
                borderColor: '#3b82f6',
                backgroundColor: alpha('#3b82f6', 0.08),
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#3b82f6',
                pointBorderWidth: 2,
                pointBorderColor: '#fff',
                borderWidth: 2.5,
            },
        ],
    };

    const weeklyOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'center', // Centered for better mobile flow
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: window.innerWidth < 600 ? 10 : 20,
                    color: theme.palette.text.primary,
                    font: {
                        size: window.innerWidth < 600 ? 10 : 12,
                        weight: '600'
                    },
                },
            },
            tooltip: {
                backgroundColor: '#1f2937',
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: theme.palette.text.disabled,
                    font: { size: 10 },
                    stepSize: 1,
                    maxTicksLimit: 6, // Prevents overcrowding
                },
                grid: { color: alpha(theme.palette.divider, 0.4), drawBorder: false },
            },
            x: {
                ticks: {
                    color: theme.palette.text.secondary,
                    font: { size: 10 },
                    maxRotation: 45,
                    minRotation: 45, // Angled labels for better mobile fit
                },
                grid: { display: false },
            },
        },
    };

    // ─── Heatmap ───
    const heatDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const heatHours = ['10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p'];

    const heatmapData = useMemo(() => {
        // Initialize 7x12 matrix (Days x Hours)
        const matrix = Array(7).fill(0).map(() => Array(12).fill(0));

        orders.forEach(order => {
            const date = new Date(order.orderDate);
            // JS Day 0=Sun, we use 0=Mon. Map 0->6, 1->0, 2->1 ... 6->5
            let dayIdx = date.getDay() - 1;
            if (dayIdx === -1) dayIdx = 6;

            const hour = date.getHours(); // 0-23
            // heatHours = ['1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10a', '11a', '12a']
            // This mapping is a bit complex based on the specific labels used in the UI
            // UI Labels: 10a, 11a, 12a, 1p, 2p, 3p, 4p, 5p, 6p, 7p, 8p, 9p (Total 12)
            // Let's adjust labels in the component to be chronological for better logic
            let hourIdx = -1;
            if (hour >= 10 && hour <= 21) {
                hourIdx = hour - 10; // 10a is 0, 9p (21) is 11
            }

            if (dayIdx >= 0 && dayIdx < 7 && hourIdx >= 0 && hourIdx < 12) {
                matrix[dayIdx][hourIdx]++;
            }
        });
        return matrix;
    }, [orders]);

    const getHeatColor = (val) => {
        if (val > 100) return '#d97706';
        if (val > 80) return '#f59e0b';
        if (val > 60) return alpha('#f59e0b', 0.7);
        if (val > 40) return alpha('#f59e0b', 0.45);
        if (val > 20) return alpha('#f59e0b', 0.25);
        return isDark ? alpha(theme.palette.common.white, 0.05) : '#f3f4f6';
    };

    // ─── Report Download Handlers ───
    const handleDailySalesCSV = useCallback(() => {
        const headers = ['Order ID', 'Customer', 'Total Price', 'Status', 'Date'];
        const rows = orders.map(o => [
            o._id?.slice(-6) || 'N/A',
            o.customerName || 'Guest',
            o.totalPrice || 0,
            o.status || 'pending',
            new Date(o.orderDate).toLocaleDateString(),
        ]);
        downloadCSV('daily_sales_summary.csv', headers, rows);
    }, [orders]);

    const handleWeeklyPDF = useCallback(() => {
        const headers = ['Day', 'Orders', 'Reservations'];
        const rows = dayLabels.map((label, i) => [label, ordersByDay[i], bookingsByDay[i]]);
        downloadPDF('Weekly Performance Report', { headers, rows });
    }, [dayLabels, ordersByDay, bookingsByDay]);

    const handleMonthlyCSV = useCallback(() => {
        const headers = ['Product', 'Category', 'Price (RS)', 'Total Sales (Items)'];
        // Sum quantities from orders for each product
        const salesMap = {};
        orders.forEach(o => {
            if (o.items) o.items.forEach(item => {
                salesMap[item.title] = (salesMap[item.title] || 0) + (item.quantity || 1);
            });
        });

        const rows = products.map(p => [
            `"${p.title}"`,
            p.type || 'N/A',
            p.price || 0,
            salesMap[p.title] || 0,
        ]);
        downloadCSV('monthly_product_performance.csv', headers, rows);
    }, [products, orders]);

    const reports = [
        { name: 'Daily Sales Summary', type: 'CSV', color: '#16a34a', handler: handleDailySalesCSV },
        { name: 'Weekly Performance Report', type: 'PDF', color: '#ef4444', handler: handleWeeklyPDF },
        { name: 'Monthly Revenue Breakdown', type: 'CSV', color: '#16a34a', handler: handleMonthlyCSV },
    ];

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '100%', overflow: 'hidden' }}>
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" sx={{ gap: 1.5 }}>
                    <AnalyticsIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                    <Typography variant="h5" fontWeight="800" color="text.primary">
                        Analytics & Reporting
                    </Typography>
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>
                    Last Synced: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
            </Box>

            {/* Row 1: Revenue Chart + Downloadable Reports */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.7fr 1fr' },
                gap: 2,
                mb: 2,
            }}>
                {/* Revenue by Category Bar Chart */}
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
                    <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2 }}>
                        Revenue by Category (Total Sales)
                    </Typography>
                    <Box sx={{ height: { xs: 280, md: 350 } }}>
                        <Bar key="category-bar-chart" data={categoryChartData} options={categoryOptions} />
                    </Box>
                </Paper>

                {/* Downloadable Reports */}
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
                    <Box display="flex" alignItems="center" sx={{ mb: 2, gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6', width: 36, height: 36, borderRadius: 2 }}>
                            <ReportIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight="700">Downloadable Reports</Typography>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <List disablePadding>
                        {reports.map((report, i) => (
                            <ListItem
                                key={i}
                                sx={{
                                    py: 1.8,
                                    px: 0,
                                    justifyContent: 'space-between',
                                    borderBottom: i < reports.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                                }}
                            >
                                <Typography variant="body2" fontWeight="500">{report.name}</Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                                    onClick={report.handler}
                                    sx={{
                                        bgcolor: report.color,
                                        color: '#fff',
                                        borderRadius: 2,
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        px: 2,
                                        py: 0.6,
                                        textTransform: 'none',
                                        boxShadow: 'none',
                                        '&:hover': { bgcolor: alpha(report.color, 0.85), boxShadow: 'none' },
                                    }}
                                >
                                    Download {report.type}
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>

            {/* Row 2: 7-Day Orders & Reservations Line Chart */}
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2 }}>
                    7-Day Orders & Reservations
                </Typography>
                <Box sx={{ height: { xs: 300, sm: 350, md: 400 } }}>
                    <Line key="weekly-performance-chart" data={weeklyChartData} options={weeklyOptions} />
                </Box>
            </Paper>

            {/* Row 3: Hourly Sales Activity Heatmap */}
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
                <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 3 }}>
                    Hourly Sales Activity Heatmap (Orders)
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                    <Box sx={{ minWidth: 700 }}>
                        {/* Hour Labels */}
                        <Box display="flex" sx={{ mb: 1 }}>
                            <Box sx={{ width: 50 }} />
                            {heatHours.map((h, i) => (
                                <Typography key={i} variant="caption" sx={{ flex: 1, textAlign: 'center', color: 'text.disabled', fontWeight: 700, fontSize: '10px' }}>
                                    {h}
                                </Typography>
                            ))}
                        </Box>
                        {/* Heatmap Rows */}
                        {heatDays.map((day, dIdx) => (
                            <Box key={day} display="flex" sx={{ mb: 1, alignItems: 'center' }}>
                                <Typography variant="caption" fontWeight="800" sx={{ width: 50, color: 'text.secondary', fontSize: '11px' }}>
                                    {day}
                                </Typography>
                                {heatmapData[dIdx].map((val, hIdx) => (
                                    <Tooltip
                                        key={hIdx}
                                        title={`${day} ${heatHours[hIdx]}: ${val} orders`}
                                        arrow
                                        placement="top"
                                    >
                                        <Box
                                            sx={{
                                                flex: 1,
                                                height: 30,
                                                mx: 0.4,
                                                borderRadius: 1,
                                                bgcolor: getHeatColor(val),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'default',
                                                transition: 'all 0.2s',
                                                '&:hover': { transform: 'scale(1.08)', boxShadow: 1, zIndex: 1 },
                                            }}
                                        >
                                            {val > 80 && (
                                                <Typography variant="caption" sx={{ color: '#fff', fontSize: '9px', fontWeight: 900 }}>
                                                    {val}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Analytics;

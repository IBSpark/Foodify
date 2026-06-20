const express = require('express');
const cors = require('cors');
require('dotenv').config();

const googleAuthRoute = require('./controllers/googleAuthRoute');
const dashboardRoutes = require("./routes/dashboard");
const ordersRoutes = require ("./routes/orders");
const settingsRoutes = require("./routes/settings");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send("Foodify Backend Running...");
});

// ===============================
// 🔐 Google Auth API
// ===============================

app.post('/route/auth/google', googleAuthRoute);
app.use("/route/dashboard", dashboardRoutes);
app.use("/route/orders", ordersRoutes);
app.use("/route/settings", settingsRoutes);

// ===============================
// 🔥 Dashboard Required APIs
// ===============================

// Orders API


// Menu API
app.get('/api/menu', (req, res) => {
  res.json([
    { title: "Burger", price: 500, type: "Fast Food" },
    { title: "Pizza", price: 800, type: "Italian" },
    { title: "Pasta", price: 700, type: "Italian" }
  ]);
});

// ===============================

module.exports = app;
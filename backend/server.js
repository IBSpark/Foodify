const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require("./config/db");

connectDB();
const googleAuthRoute = require('./controllers/googleAuthRoute');
const dashboardRoute = require("./routes/dashboard");
// const ordersRoute = require("./routes/orders");
const settingsRoute = require("./routes/settings");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://foodify-admin-mu.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send("Foodify Backend Running...");
});

// ===============================
// 🔐 Google Auth API
// ===============================

app.post('/route/auth/google', googleAuthRoute);

app.use("/routes/dashboard", dashboardRoute);
// app.use("/routes/orders", ordersRoutes);
app.use("/routes/settings", settingsRoutes);

// ===============================
// Menu API
// ===============================

app.get('/routes/menu', (req, res) => {
  res.json([
    { title: "Burger", price: 500, type: "Fast Food" },
    { title: "Pizza", price: 800, type: "Italian" },
    { title: "Pasta", price: 700, type: "Italian" }
  ]);
});

// ===============================

module.exports = app;
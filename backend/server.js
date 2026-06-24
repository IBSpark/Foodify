const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require("./config/db");

connectDB();

const googleAuthRoute = require('./controllers/googleAuthRoute');
const dashboardRoute = require("./routes/dashboard");
const ordersRoute = require("./routes/orders");
const settingsRoute = require("./routes/settings");

const app = express();

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

app.get("/", (req, res) => {
  res.send("Foodify Backend Running...");
});

app.post("/route/auth/google", googleAuthRoute);

app.use("/route/dashboard", dashboardRoute);
app.use("/route/orders", ordersRoute);
app.use("/route/settings", settingsRoute);

app.get("/api/menu", (req, res) => {
  res.json([
    { title: "Burger", price: 500, type: "Fast Food" },
    { title: "Pizza", price: 800, type: "Italian" },
    { title: "Pasta", price: 700, type: "Italian" }
  ]);
});

module.exports = app;
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();

// Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    // Generate JWT Token
    const jwtToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      token: jwtToken,
      user,
    });

  } catch (error) {
    console.error('Google Auth Error:', error);

    res.status(401).json({
      success: false,
      message: 'Google authentication failed',
    });
  }
});

// ===============================
// 🔥 Dashboard Required APIs
// ===============================

// Orders API
app.get('/api/orders', (req, res) => {
  res.json([
    {
      _id: "1",
      customerName: "Ali",
      totalPrice: 1200,
      status: "pending",
      orderDate: new Date(),
      items: [
        { title: "Burger", quantity: 2 }
      ]
    },
    {
      _id: "2",
      customerName: "Ahmed",
      totalPrice: 800,
      status: "completed",
      orderDate: new Date(),
      items: [
        { title: "Pizza", quantity: 1 }
      ]
    }
  ]);
});

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
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send("Foodify Backend Running...");
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

// Start server
const PORT = 3000; // 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
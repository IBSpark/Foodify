// models/Orders.js

const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    customerName: String,
    tableNumber: Number,
    items: Array,
    totalPrice: Number,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", ordersSchema);
// controllers/ordersController.js

const Orders = require("../models/Orders");

const getOrders = async (req, res) => {
  const orders = await Orders.find().sort({ createdAt: -1 });
  res.json(orders);
};

const createOrder = async (req, res) => {
  const order = await Orders.create(req.body);
  res.status(201).json(order);
};

const updateOrder = async (req, res) => {
  const order = await Orders.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(order);
};

const deleteOrder = async (req, res) => {
  await Orders.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Order deleted successfully",
  });
};

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};
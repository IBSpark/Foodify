// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const Booking = require("../models/Booking");

const getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalBookings = await Booking.countDocuments();

    const revenueData = await Order.find();

    const totalRevenue = revenueData.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    res.status(200).json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { getDashboard };
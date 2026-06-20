const express = require("express");
const router = express.Router();

const {
  getOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/ordersController");

router.get("/", getOrders);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

module.exports = router;
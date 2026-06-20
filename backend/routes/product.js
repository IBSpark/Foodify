const express = require("express");

const router = express.Router();

const {
  getProducts,
  deleteProduct,
} = require("../controllers/productController");

router.get("/menulist", getProducts);

router.delete(
  "/deleteproduct/:id",
  deleteProduct
);

module.exports = router;
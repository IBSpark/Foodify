const Product = require("../models/Product");

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  deleteProduct,
};
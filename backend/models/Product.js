const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    ingredients: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    time: {
      type: String,
      default: "15-20 Min",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
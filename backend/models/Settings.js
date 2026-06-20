const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    operatingHours: {
      type: String,
      default: "",
    },
    salesTax: {
      type: String,
      default: "",
    },
    taxId: {
      type: String,
      default: "",
    },
    stripeKey: {
      type: String,
      default: "",
    },
    paypalId: {
      type: String,
      default: "",
    },
    kitchenPrinter: {
      type: String,
      default: "",
    },
    receiptPrinter: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Smartphone", "Laptop", "Headphones", "Tablet", "Smartwatch"],
    },
    price: { type: Number, required: true, min: 0 }, // INR
    rating: { type: Number, default: 4, min: 0, max: 5 },
    specs: {
      processor: String,
      ram: String,
      storage: String,
      battery: String,
      display: String,
      camera: String,
    },
    // 1-10 scores used for recommendations
    scores: {
      performance: { type: Number, default: 5, min: 1, max: 10 },
      battery: { type: Number, default: 5, min: 1, max: 10 },
      camera: { type: Number, default: 5, min: 1, max: 10 },
      display: { type: Number, default: 5, min: 1, max: 10 },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

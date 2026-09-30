const express = require("express");
const Product = require("../models/Product");
const protect = require("../middleware/auth");

const router = express.Router();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/products?category=&brand=&search=&minPrice=&maxPrice=&sort=
router.get("/", async (req, res) => {
  try {
    const { category, brand, search, minPrice, maxPrice, sort } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(`^${escapeRegex(brand)}$`, "i");
    if (search) filter.name = new RegExp(escapeRegex(search), "i");
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const sortMap = {
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      rating: { rating: -1 },
    };
    const products = await Product.find(filter).sort(sortMap[sort] || { createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/recommend?category=&budget=&priority=
router.get("/recommend", async (req, res) => {
  try {
    const { category, budget, priority = "performance" } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (budget) filter.price = { $lte: Number(budget) };

    const products = await Product.find(filter);
    const maxPrice = Math.max(...products.map((p) => p.price), 1);

    const scored = products.map((p) => {
      // "value" = good rating for low price; others use the matching 1-10 score
      const main =
        priority === "value"
          ? (p.rating / 5) * 10 * (1 - (p.price / maxPrice) * 0.5)
          : p.scores[priority] ?? 5;
      const match = Math.min(100, Math.round((main * 0.7 + p.rating * 2 * 0.3) * 10));
      return { ...p.toObject(), match };
    });

    scored.sort((a, b) => b.match - a.match);
    res.json(scored.slice(0, 5));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch {
    res.status(400).json({ message: "Invalid product id" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.createdBy || String(product.createdBy) !== String(req.user._id))
      return res.status(403).json({ message: "You can only delete products you added" });
    await product.deleteOne();
    res.json({ message: "Deleted" });
  } catch {
    res.status(400).json({ message: "Invalid product id" });
  }
});

module.exports = router;

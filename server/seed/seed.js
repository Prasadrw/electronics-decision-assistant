require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

// helper: p(name, brand, category, price, rating, [cpu, ram, storage, battery, display, camera], [perf, batt, cam, disp])
const p = (name, brand, category, price, rating, s, sc) => ({
  name, brand, category, price, rating,
  specs: { processor: s[0], ram: s[1], storage: s[2], battery: s[3], display: s[4], camera: s[5] },
  scores: { performance: sc[0], battery: sc[1], camera: sc[2], display: sc[3] },
});

const products = [
  // Smartphones
  p("Galaxy S24 FE", "Samsung", "Smartphone", 59999, 4.4, ["Exynos 2400e", "8 GB", "128 GB", "4700 mAh", "6.7\" AMOLED 120Hz", "50 MP"], [8, 7, 8, 9]),
  p("iPhone 15", "Apple", "Smartphone", 69900, 4.6, ["A16 Bionic", "6 GB", "128 GB", "3349 mAh", "6.1\" OLED 60Hz", "48 MP"], [9, 6, 9, 8]),
  p("OnePlus 12R", "OnePlus", "Smartphone", 39999, 4.5, ["Snapdragon 8 Gen 2", "8 GB", "128 GB", "5500 mAh", "6.78\" AMOLED 120Hz", "50 MP"], [9, 9, 7, 9]),
  p("Redmi Note 13 Pro+", "Xiaomi", "Smartphone", 29999, 4.3, ["Dimensity 7200", "8 GB", "256 GB", "5000 mAh", "6.67\" AMOLED 120Hz", "200 MP"], [7, 8, 8, 8]),
  p("Realme Narzo 70", "Realme", "Smartphone", 15999, 4.1, ["Dimensity 7050", "6 GB", "128 GB", "5000 mAh", "6.67\" AMOLED 120Hz", "50 MP"], [6, 8, 6, 7]),
  p("Pixel 8a", "Google", "Smartphone", 52999, 4.5, ["Tensor G3", "8 GB", "128 GB", "4492 mAh", "6.1\" OLED 120Hz", "64 MP"], [7, 6, 10, 8]),
  p("Poco X6", "Xiaomi", "Smartphone", 19999, 4.2, ["Snapdragon 7s Gen 2", "8 GB", "256 GB", "5100 mAh", "6.67\" AMOLED 120Hz", "64 MP"], [6, 8, 6, 8]),
  // Laptops
  p("MacBook Air M2", "Apple", "Laptop", 99900, 4.7, ["Apple M2", "8 GB", "256 GB SSD", "18 hrs", "13.6\" Retina", "1080p webcam"], [9, 10, 5, 9]),
  p("HP Pavilion 15", "HP", "Laptop", 62990, 4.2, ["Intel Core i5-1335U", "16 GB", "512 GB SSD", "8 hrs", "15.6\" FHD IPS", "720p webcam"], [7, 6, 4, 6]),
  p("ASUS TUF Gaming F15", "ASUS", "Laptop", 74990, 4.4, ["Intel Core i5-12500H", "16 GB", "512 GB SSD", "6 hrs", "15.6\" FHD 144Hz", "720p webcam"], [9, 4, 4, 7]),
  p("Lenovo IdeaPad Slim 3", "Lenovo", "Laptop", 41990, 4.1, ["AMD Ryzen 5 7520U", "8 GB", "512 GB SSD", "9 hrs", "15.6\" FHD", "720p webcam"], [6, 7, 4, 5]),
  p("Dell Inspiron 14", "Dell", "Laptop", 55990, 4.2, ["Intel Core i5-1335U", "16 GB", "512 GB SSD", "9 hrs", "14\" FHD+", "1080p webcam"], [7, 7, 5, 6]),
  // Headphones
  p("WH-1000XM5", "Sony", "Headphones", 29990, 4.7, ["-", "-", "-", "30 hrs", "-", "-"], [8, 9, 1, 1]),
  p("AirPods Pro 2", "Apple", "Headphones", 24900, 4.7, ["H2 chip", "-", "-", "6 hrs (30 with case)", "-", "-"], [9, 6, 1, 1]),
  p("Boat Rockerz 550", "boAt", "Headphones", 1999, 4.0, ["-", "-", "-", "20 hrs", "-", "-"], [4, 7, 1, 1]),
  p("OnePlus Buds Pro 2", "OnePlus", "Headphones", 8999, 4.3, ["-", "-", "-", "9 hrs (39 with case)", "-", "-"], [7, 8, 1, 1]),
  // Tablets
  p("iPad 10th Gen", "Apple", "Tablet", 34900, 4.6, ["A14 Bionic", "4 GB", "64 GB", "10 hrs", "10.9\" Liquid Retina", "12 MP"], [8, 7, 6, 8]),
  p("Galaxy Tab S9 FE", "Samsung", "Tablet", 36999, 4.4, ["Exynos 1380", "6 GB", "128 GB", "8000 mAh", "10.9\" LCD 90Hz", "8 MP"], [7, 8, 5, 8]),
  // Smartwatches
  p("Apple Watch SE 2", "Apple", "Smartwatch", 29900, 4.5, ["S8 SiP", "-", "32 GB", "18 hrs", "1.57\" OLED", "-"], [8, 5, 1, 8]),
  p("Amazfit GTR 4", "Amazfit", "Smartwatch", 14999, 4.3, ["-", "-", "-", "14 days", "1.43\" AMOLED", "-"], [6, 10, 1, 8]),
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({ createdBy: null }); // remove only old seeded items
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
  } catch (e) {
    console.error(e.message);
  } finally {
    await mongoose.disconnect();
  }
})();

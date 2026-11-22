const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.getPool().query("SELECT 1 + 1 AS ok");
    res.json({
      status: "OK",
      dbConnected: rows[0].ok === 2,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/customers", customerRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Buzz Bizz backend running on http://localhost:${PORT}`);
});

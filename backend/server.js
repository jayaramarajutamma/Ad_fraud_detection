const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const clickRoutes = require("./routes/clickRoutes");
const adRoutes = require("./routes/adRoutes");

const app = express();

// connect MongoDB
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/", authRoutes);
app.use("/", clickRoutes);
app.use("/", adRoutes);

// server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
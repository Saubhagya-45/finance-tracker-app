const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
path: path.join(__dirname, ".env")
});

console.log("HOST =", process.env.DB_HOST);
console.log("USER =", process.env.DB_USER);
console.log("DB =", process.env.DB_NAME);

const userRoutes = require("./routes/userRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

// Database Connection
require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
res.send("Finance Tracker Backend Running");
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Transaction Routes
app.use("/api/transactions", transactionRoutes);

// User Routes
app.use("/api/users", userRoutes);

// Budget Routes
app.use("/api/budgets", budgetRoutes);

// Server
const PORT = 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

const fs = require("fs");
const path = require("path");

const dotenvPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(dotenvPath)) {
  require("dotenv").config({ path: dotenvPath });
} else {
  require("dotenv").config();
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not available. Checked backend .env path:", dotenvPath);
  throw new Error("Missing JWT_SECRET in backend environment. Add JWT_SECRET=<your-secret> to BACKEND/.env and restart the server.");
}

const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");

// Start recurring payment cron job
require("./jobs/recurringPayment");

// Socket.io
const { initializeSocket } = require("./socket/socket");

const app = express();

// Create HTTP server
const server = http.createServer(app);





// Initialize Socket.io
initializeSocket(server);

// Connect to Database
connectDB();

// Middlewares
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const recurringRoutes = require("./routes/recurringRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/recurring", recurringRoutes);
app.use("/api/ai", aiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
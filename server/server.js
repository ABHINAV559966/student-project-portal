require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

/* ===========================
   Security Middleware
=========================== */

app.use(helmet());

/* ===========================
   CORS Configuration
=========================== */

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / mobile apps
      if (!origin) return callback(null, true);

      // Allow localhost
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(null, true); // <-- Accept all origins (fine for a college project)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===========================
   Body Parser
=========================== */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===========================
   Logger
=========================== */

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

/* ===========================
   Health Check
=========================== */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* ===========================
   API Routes
=========================== */

app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ===========================
   404 Route
=========================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* ===========================
   Error Handler
=========================== */

app.use(errorHandler);

/* ===========================
   Start Server
=========================== */

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("");
      console.log("🚀────────────────────────────────────");
      console.log("🌟 Student Project Portal Server");
      console.log(`📡 Port : ${PORT}`);
      console.log(`🌍 Environment : ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API : http://localhost:${PORT}/api`);
      console.log("🚀────────────────────────────────────");
      console.log("");
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
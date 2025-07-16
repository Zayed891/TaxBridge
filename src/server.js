const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/database");

// Import routes
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const taxRoutes = require("./routes/tax");

// Create Express app
const app = express();

// Connect to database
connectDB();

//Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));
app.use(morgan("combined")); // Logging

// Body parsers Before routes
// Conditionally skip express.json() for file upload route
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/transactions/import") && req.method === "POST") {
    return next();
  }
  express.json()(req, res, next);
}); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Register routes after body parsers
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/tax", taxRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "TaxBridge API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API documentation endpoint
app.get("/api/docs", (req, res) => {
  res.json({
    success: true,
    data: {
      title: "TaxBridge API Documentation",
      version: "1.0.0",
      description:
        "RESTful API for cryptocurrency tax calculations across multiple countries",
      endpoints: {
        authentication: {
          "POST /api/auth/register": "Register new user",
          "POST /api/auth/login": "User login",
          "GET /api/auth/me": "Get current user info",
        },
        transactions: {
          "GET /api/transactions": "List user transactions",
          "POST /api/transactions": "Add new transaction",
          "PUT /api/transactions/:id": "Update transaction",
          "DELETE /api/transactions/:id": "Delete transaction",
          "POST /api/transactions/import": "Import transactions from CSV",
        },
        tax: {
          "POST /api/tax/calculate": "Calculate taxes for a year",
          "GET /api/tax/summary/:year": "Get tax summary",
          "GET /api/tax/report/:year/export": "Export tax report",
          "GET /api/tax/rules/:country/:year": "Get tax rules",
          "GET /api/tax/info": "Get supported countries and methods",
        },
        utility: {
          "GET /api/health": "Health check",
          "GET /api/docs": "API documentation",
        },
      },
      supportedCountries: ["US", "UK", "CA", "AU"],
      supportedMethods: ["FIFO", "LIFO", "AVERAGE_COST"],
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Endpoint not found",
    },
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  // Mongoose validation error
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input data",
        details: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        })),
      },
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      error: {
        code: "DUPLICATE_ERROR",
        message: "Resource already exists",
      },
    });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid token",
      },
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 TaxBridge API server running on port ${PORT}`);
  console.log(
    `📋 Documentation available at http://localhost:${PORT}/api/docs`
  );
  console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
});

module.exports = app;

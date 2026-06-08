import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./Routes/authRoutes.js";
import employeeRoutes from "./Routes/employeeRoutes.js";
import attendanceRoutes from "./Routes/attendanceRoutes.js";
import leaveRoutes from "./Routes/leaveRoutes.js";
import salaryRoutes from "./Routes/salaryRoutes.js";
import payslipRoutes from "./Routes/payslipRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import departmentRoutes from "./Routes/departmentRoutes.js";
import { swaggerSpec, swaggerUi } from "./docs/swagger.js";

// Import middleware
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Set development mode if not specified
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const app = express();
const PORT = process.env.PORT || 5000;

const requiredEnv = ["JWT_SECRET", "REFRESH_TOKEN_SECRET"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is required. Add it to Server/.env before starting the API.`);
  }
});

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(morgan("combined")); // Logging

// Rate limiting - disabled in development to avoid blocking during testing
if (process.env.NODE_ENV !== 'development') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    handler: (req, res) => {
      return res.status(429).json({ message: "Too many requests from this IP, please try again later." });
    }
  });
  app.use(limiter);
}

app.use(cors({
  origin: process.env.CLIENT_URL || ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/payslips", payslipRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

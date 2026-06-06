import express from "express";
import { getDashboardAnalytics } from "../controllers/dashboardController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/analytics", authenticateToken, requireRole("admin"), getDashboardAnalytics);

export default router;

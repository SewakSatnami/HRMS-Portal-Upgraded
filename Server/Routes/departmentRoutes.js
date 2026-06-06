import express from "express";
import { body } from "express-validator";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment
} from "../controllers/departmentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

const departmentValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Department name must be at least 2 characters"),
  body("description").optional().trim()
];

router.get("/", authenticateToken, requireRole("admin"), getDepartments);
router.post("/", authenticateToken, requireRole("admin"), departmentValidation, createDepartment);
router.put("/:id", authenticateToken, requireRole("admin"), departmentValidation, updateDepartment);
router.delete("/:id", authenticateToken, requireRole("admin"), deleteDepartment);

export default router;

import express from "express";
import { body } from "express-validator";
import {
  generatePayslip,
  getPayslip,
  getMyPayslips,
  getAllPayslips,
  updatePayslip,
  deletePayslip
} from "../controllers/payslipController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Validation rules
const generatePayslipValidation = [
  body('employeeId').isMongoId().withMessage('Valid employee ID is required'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  body('year').isInt({ min: 2020, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required')
];

// Routes
router.post('/generate', authenticateToken, requireRole('admin'), generatePayslipValidation, generatePayslip);
router.get('/', authenticateToken, requireRole('admin'), getAllPayslips);
router.get('/my', authenticateToken, requireRole('employee'), getMyPayslips);
router.get('/:employeeId/:month', authenticateToken, getPayslip);
router.put('/:id', authenticateToken, requireRole('admin'), updatePayslip);
router.delete('/:id', authenticateToken, requireRole('admin'), deletePayslip);

export default router;
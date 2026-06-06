import express from "express";
import { body } from "express-validator";
import {
  addSalary,
  getSalary,
  updateSalary,
  getMySalary,
  getAllSalaries,
  deleteSalary
} from "../controllers/salaryController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Validation rules
const salaryValidation = [
  body('employeeId').isMongoId().withMessage('Valid employee ID is required'),
  body('baseSalary').isNumeric().withMessage('Base salary must be a number').isFloat({ min: 0 }).withMessage('Base salary must be positive'),
  body('hra').optional().isNumeric().withMessage('HRA must be a number').isFloat({ min: 0 }),
  body('conveyance').optional().isNumeric().withMessage('Conveyance must be a number').isFloat({ min: 0 }),
  body('medical').optional().isNumeric().withMessage('Medical must be a number').isFloat({ min: 0 }),
  body('lta').optional().isNumeric().withMessage('LTA must be a number').isFloat({ min: 0 }),
  body('otherAllowances').optional().isNumeric().withMessage('Other allowances must be a number').isFloat({ min: 0 }),
  body('pf').optional().isNumeric().withMessage('PF must be a number').isFloat({ min: 0 }),
  body('professionalTax').optional().isNumeric().withMessage('Professional tax must be a number').isFloat({ min: 0 }),
  body('incomeTax').optional().isNumeric().withMessage('Income tax must be a number').isFloat({ min: 0 }),
  body('otherDeductions').optional().isNumeric().withMessage('Other deductions must be a number').isFloat({ min: 0 })
];

// Routes
router.get('/', authenticateToken, requireRole('admin'), getAllSalaries);
router.get('/my', authenticateToken, requireRole('employee'), getMySalary);
router.get('/:employeeId', authenticateToken, requireRole('admin'), getSalary);
router.post('/', authenticateToken, requireRole('admin'), salaryValidation, addSalary);
router.put('/:employeeId', authenticateToken, requireRole('admin'), salaryValidation, updateSalary);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteSalary);

export default router;

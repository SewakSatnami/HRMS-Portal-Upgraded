import express from "express";
import { body } from "express-validator";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeProfile,
  updateEmployeeProfile
} from "../controllers/employeeController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Validation rules
const createEmployeeValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('employmentType').optional().isIn(['full-time', 'part-time', 'contract', 'intern', 'temporary']).withMessage('Invalid employment type'),
  body('workLocation').optional().trim(),
  body('reportingManager').optional().trim(),
  body('joiningDate').isISO8601().withMessage('Valid joining date is required'),
  body('dateOfBirth').optional({ checkFalsy: true }).isISO8601().withMessage('Valid date of birth is required'),
  body('gender').optional({ checkFalsy: true }).isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender'),
  body('maritalStatus').optional({ checkFalsy: true }).isIn(['single', 'married', 'divorced', 'widowed']).withMessage('Invalid marital status'),
  body('phone').optional({ checkFalsy: true }).matches(/^[0-9\s\-\+\(\)]{10,15}$/).withMessage('Valid phone number is required'),
  body('alternatePhone').optional({ checkFalsy: true }).matches(/^[0-9\s\-\+\(\)]{10,15}$/).withMessage('Valid alternate phone number is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').optional().trim(),
  body('state').optional().trim(),
  body('country').optional().trim(),
  body('postalCode').optional().trim(),
  body('bankName').optional().trim(),
  body('accountNumber').optional().trim(),
  body('ifscCode').optional().trim(),
  body('panNumber').optional().trim(),
  body('emergencyContactName').optional().trim(),
  body('emergencyContactPhone').optional({ checkFalsy: true }).matches(/^[0-9\s\-\+\(\)]{10,15}$/).withMessage('Valid emergency contact phone is required'),
  body('emergencyContactRelation').optional().trim()
];

const updateEmployeeValidation = [
  body('department').optional().trim().notEmpty().withMessage('Department cannot be empty'),
  body('designation').optional().trim().notEmpty().withMessage('Designation cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('address').optional().trim().notEmpty().withMessage('Address cannot be empty')
];

// Routes
router.get('/', authenticateToken, requireRole('admin'), getAllEmployees);
router.get('/profile', authenticateToken, requireRole('employee'), getEmployeeProfile);
router.put('/profile', authenticateToken, requireRole('employee'), updateEmployeeValidation, updateEmployeeProfile);
router.get('/:id', authenticateToken, requireRole('admin'), getEmployeeById);
router.post('/', authenticateToken, requireRole('admin'), createEmployeeValidation, createEmployee);
router.put('/:id', authenticateToken, requireRole('admin'), updateEmployeeValidation, updateEmployee);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteEmployee);

export default router;

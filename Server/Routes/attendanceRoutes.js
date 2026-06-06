import express from "express";
import { body } from "express-validator";
import {
  markAttendance,
  markMyAttendance,
  getAttendanceRecords,
  getMyAttendance,
  updateAttendance,
  getAttendanceSummary
} from "../controllers/attendanceController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Validation rules
const markAttendanceValidation = [
  body('employeeId').isMongoId().withMessage('Valid employee ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('status').isIn(['present', 'absent', 'half-day', 'leave']).withMessage('Invalid status'),
  body('checkIn').optional().isISO8601().withMessage('Valid check-in time is required'),
  body('checkOut').optional().isISO8601().withMessage('Valid check-out time is required'),
  body('remarks').optional().trim()
];

const markMyAttendanceValidation = [
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('status').isIn(['present', 'absent', 'half-day', 'leave']).withMessage('Invalid status'),
  body('checkIn').optional().isISO8601().withMessage('Valid check-in time is required'),
  body('checkOut').optional().isISO8601().withMessage('Valid check-out time is required'),
  body('remarks').optional().trim()
];

const updateAttendanceValidation = [
  body('status').optional().isIn(['present', 'absent', 'half-day', 'leave']).withMessage('Invalid status'),
  body('checkIn').optional().isISO8601().withMessage('Valid check-in time is required'),
  body('checkOut').optional().isISO8601().withMessage('Valid check-out time is required'),
  body('remarks').optional().trim()
];

// Routes
router.post('/', authenticateToken, requireRole('admin'), markAttendanceValidation, markAttendance);
router.post('/my', authenticateToken, requireRole('employee'), markMyAttendanceValidation, markMyAttendance);
router.get('/my', authenticateToken, requireRole('employee'), getMyAttendance);
router.get('/:employeeId', authenticateToken, requireRole('admin'), getAttendanceRecords);
router.get('/:employeeId/summary', authenticateToken, requireRole('admin'), getAttendanceSummary);
router.put('/:id', authenticateToken, requireRole('admin'), updateAttendanceValidation, updateAttendance);

export default router;
import express from "express";
import { body } from "express-validator";
import {
  applyLeave,
  getLeaveRequests,
  getMyLeaves,
  approveLeave,
  getLeaveBalance,
  getLeaveSummary
} from "../controllers/leaveController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Validation rules
const applyLeaveValidation = [
  body('type').isIn(['annual', 'sick', 'casual', 'maternity', 'paternity']).withMessage('Invalid leave type'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
    .custom((endDate, { req }) => {
      if (new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('reason').trim().isLength({ min: 10 }).withMessage('Reason must be at least 10 characters')
];

const approveLeaveValidation = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('comments').optional().trim()
];

// Routes
router.post('/apply', authenticateToken, requireRole('admin', 'employee'), applyLeaveValidation, applyLeave);
router.get('/my', authenticateToken, requireRole('employee'), getMyLeaves);
router.get('/balance', authenticateToken, requireRole('employee'), getLeaveBalance);
router.get('/summary', authenticateToken, requireRole('employee'), getLeaveSummary);
router.get('/', authenticateToken, requireRole('admin'), getLeaveRequests);
router.put('/:id/approve', authenticateToken, requireRole('admin'), approveLeaveValidation, approveLeave);

export default router;
import { validationResult } from "express-validator";
import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import { checkLeaveEligibility, updateLeaveBalance } from "../services/leaveService.js";

export const applyLeave = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, startDate, endDate, reason, employeeId } = req.body;

    // Find employee for leave application.
    let employee;
    if (req.user.role === 'admin') {
      if (!employeeId) {
        return res.status(400).json({ message: "Employee ID is required for admin leave application" });
      }
      employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
    } else {
      employee = await Employee.findOne({ userId: req.user._id });
      if (!employee) {
        return res.status(404).json({ message: "Employee profile not found" });
      }
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Split leave into paid/unpaid days based on available balance.
    const eligibility = await checkLeaveEligibility(employee._id, type, days);

    const leave = new Leave({
      employeeId: employee._id,
      type,
      startDate: start,
      endDate: end,
      days,
      paidDays: eligibility.paidDays,
      unpaidDays: eligibility.unpaidDays,
      reason
    });

    await leave.save();

    res.status(201).json({
      message: "Leave application submitted successfully",
      leave
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaveRequests = async (req, res) => {
  try {
    const { status, employeeId, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (employeeId) query.employeeId = employeeId;

    const leaves = await Leave.find(query)
      .populate('employeeId', 'employeeId userId')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Leave.countDocuments(query);

    res.json({
      leaves,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const leaves = await Leave.find({ employeeId: employee._id })
      .sort({ createdAt: -1 });

    res.json({ leaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const { status, comments } = req.body;

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (status === 'approved') {
      // Update leave balance
      await updateLeaveBalance(leave.employeeId, leave.type, leave.days);
    }

    leave.status = status;
    leave.approvedBy = req.user._id;
    leave.approvedAt = new Date();
    leave.comments = comments;

    await leave.save();

    res.json({
      message: `Leave ${status} successfully`,
      leave
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaveBalance = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    res.json({ leaveBalance: employee.leaveBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaveSummary = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const { getLeaveSummary } = await import("../services/leaveService.js");
    const summary = await getLeaveSummary(employee._id);

    res.json({ summary, balance: employee.leaveBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

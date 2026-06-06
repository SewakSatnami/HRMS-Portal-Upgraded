import { validationResult } from "express-validator";
import Payslip from "../models/Payslip.js";
import Employee from "../models/Employee.js";
import { calculateMonthlySalary } from "../services/salaryService.js";

export const generatePayslip = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { employeeId, month, year } = req.body;

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if payslip already exists
    const existingPayslip = await Payslip.findOne({ employeeId, month: `${year}-${month.toString().padStart(2, '0')}` });
    if (existingPayslip) {
      return res.status(400).json({ message: "Payslip already generated for this month" });
    }

    // Calculate salary
    const salaryData = await calculateMonthlySalary(employeeId, month, year);

    const payslip = new Payslip({
      employeeId,
      month: `${year}-${month.toString().padStart(2, '0')}`,
      year,
      ...salaryData,
      generatedBy: req.user._id
    });

    await payslip.save();

    res.status(201).json({
      message: "Payslip generated successfully",
      payslip
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPayslip = async (req, res) => {
  try {
    const { employeeId, month } = req.params;

    const payslip = await Payslip.findOne({
      employeeId,
      month
    }).populate({
      path: 'employeeId',
      select: 'employeeId userId department designation',
      populate: { path: 'userId', select: 'name email' }
    })
      .populate('generatedBy', 'name');

    if (!payslip) {
      return res.status(404).json({ message: "Payslip not found" });
    }

    res.json({ payslip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPayslips = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const payslips = await Payslip.find({ employeeId: employee._id })
      .sort({ year: -1, month: -1 });

    res.json({ payslips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPayslips = async (req, res) => {
  try {
    const { month, year, page = 1, limit = 10 } = req.query;

    const query = {};
    if (month && year) {
      query.month = `${year}-${month.toString().padStart(2, '0')}`;
    }

    const payslips = await Payslip.find(query)
      .populate({
        path: 'employeeId',
        select: 'employeeId userId department designation',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate('generatedBy', 'name')
      .sort({ year: -1, month: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Payslip.countDocuments(query);

    res.json({
      payslips,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePayslip = async (req, res) => {
  try {
    const payslip = await Payslip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!payslip) {
      return res.status(404).json({ message: "Payslip not found" });
    }

    res.json({
      message: "Payslip updated successfully",
      payslip
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePayslip = async (req, res) => {
  try {
    const payslip = await Payslip.findByIdAndDelete(req.params.id);

    if (!payslip) {
      return res.status(404).json({ message: "Payslip not found" });
    }

    res.json({ message: "Payslip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

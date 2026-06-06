import { validationResult } from "express-validator";
import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

export const addSalary = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { employeeId, baseSalary, hra, conveyance, medical, lta, otherAllowances,
            pf, professionalTax, incomeTax, otherDeductions } = req.body;

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if salary already exists
    const existingSalary = await Salary.findOne({ employeeId, isActive: true });
    if (existingSalary) {
      return res.status(400).json({ message: "Salary already exists for this employee" });
    }

    const salary = new Salary({
      employeeId,
      baseSalary,
      hra: hra || 0,
      conveyance: conveyance || 0,
      medical: medical || 0,
      lta: lta || 0,
      otherAllowances: otherAllowances || 0,
      pf: pf || 0,
      professionalTax: professionalTax || 0,
      incomeTax: incomeTax || 0,
      otherDeductions: otherDeductions || 0
    });

    await salary.save();

    res.status(201).json({
      message: "Salary added successfully",
      salary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalary = async (req, res) => {
  try {
    const salary = await Salary.findOne({
      employeeId: req.params.employeeId,
      isActive: true
    });

    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    res.json({ salary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSalary = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salary = await Salary.findOneAndUpdate(
      { employeeId: req.params.employeeId, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );

    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    res.json({
      message: "Salary updated successfully",
      salary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMySalary = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const salary = await Salary.findOne({
      employeeId: employee._id,
      isActive: true
    });

    if (!salary) {
      return res.status(404).json({ message: "Salary information not found" });
    }

    res.json({ salary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSalaries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const salaries = await Salary.find({ isActive: true })
      .populate({
        path: 'employeeId',
        select: 'employeeId userId department designation',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Salary.countDocuments({ isActive: true });

    res.json({
      salaries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    res.json({ message: "Salary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

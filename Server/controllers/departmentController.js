import { validationResult } from "express-validator";
import Department from "../models/Department.js";
import Employee from "../models/Employee.js";

export const createDepartment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const existingDepartment = await Department.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      isActive: true
    });

    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = await Department.create({
      name,
      description,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Department added successfully",
      department
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const departments = await Department.find(query).sort({ createdAt: -1 });
    const employeeCounts = await Employee.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    const countsByDepartment = employeeCounts.reduce((result, item) => {
      result[item._id] = item.count;
      return result;
    }, {});

    res.json({
      departments: departments.map((department) => ({
        ...department.toObject(),
        employeeCount: countsByDepartment[department.name] || 0
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department || !department.isActive) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({
      message: "Department updated successfully",
      department
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

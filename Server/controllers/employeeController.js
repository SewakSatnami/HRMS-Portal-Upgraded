import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

export const getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = search
      ? {
          $or: [
            { employeeId: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } },
            { designation: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const employees = await Employee.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('userId', 'name email role');

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      department,
      designation,
      employmentType,
      workLocation,
      reportingManager,
      joiningDate,
      dateOfBirth,
      gender,
      maritalStatus,
      phone,
      alternatePhone,
      address,
      city,
      state,
      country,
      postalCode,
      bankName,
      accountNumber,
      ifscCode,
      panNumber,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'employee'
    });

    await user.save();

    // Create employee
    const employee = new Employee({
      userId: user._id,
      employeeId: `EMP${Date.now()}`,
      department,
      designation,
      employmentType,
      workLocation,
      reportingManager,
      joiningDate,
      dateOfBirth,
      gender,
      maritalStatus,
      phone,
      alternatePhone,
      address,
      city,
      state,
      country,
      postalCode,
      bankDetails: {
        bankName,
        accountNumber,
        ifscCode,
        panNumber
      },
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone,
        relation: emergencyContactRelation
      }
    });

    await employee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        ...employee.toObject(),
        user: { name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email role');

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Employee updated successfully",
      employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Soft delete - deactivate user
    await User.findByIdAndUpdate(employee.userId, { isActive: false });
    await Employee.findByIdAndDelete(req.params.id);

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id })
      .populate('userId', 'name email role');

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    res.json({ employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployeeProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { department, designation, phone, address } = req.body;

    // Find the employee profile for the current user
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    // Update employee fields
    if (department !== undefined) employee.department = department;
    if (designation !== undefined) employee.designation = designation;
    if (phone !== undefined) employee.phone = phone;
    if (address !== undefined) employee.address = address;

    await employee.save();

    // Populate user data for response
    await employee.populate('userId', 'name email role');

    res.json({ 
      message: "Profile updated successfully", 
      employee 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

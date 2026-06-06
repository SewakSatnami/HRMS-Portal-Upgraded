import express from "express";
import { EmployeeModel } from "../models/EmployeeModel.js";

const router = express.Router();

// ✅ Add Employee
router.post("/add", async (req, res) => {
  const {
    profileImage,
    employeeId,
    name,
    email,
    phone,
    dateOfBirth,
    gender,
    maritalStatus,
    address,
    city,
    state,
    country,
    department,
    designation,
    employmentType,
    employeeRole,
    joiningDate,
    salary,
    bankName,
    ifscCode,
    bankAccountNumber,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactRelation,
    workLocation,
    probationEndDate
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and Email are required" });
  }

  try {
    const newEmp = new EmployeeModel({
      profileImage,
      employeeId,
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      maritalStatus,
      address,
      city,
      state,
      country,
      department,
      designation,
      employmentType,
      employeeRole,
      joiningDate,
      salary,
      bankName,
      ifscCode,
      bankAccountNumber,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      workLocation,
      probationEndDate
    });
    await newEmp.save();
    return res.status(201).json({ message: "Employee added successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Employees
router.get("/all", async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load employees" });
  }
});

// ✅ Delete Employee
router.delete("/:id", async (req, res) => {
  try {
    await EmployeeModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete employee" });
  }
});

export default router;

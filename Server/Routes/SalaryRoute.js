import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Create Salary Schema
const salarySchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeEmail: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  hra: { type: Number, default: 0 },
  allowances: { type: Number, default: 0 },
  totalSalary: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Salary Model
const Salary = mongoose.model("Salary", salarySchema);

// ✅ Add Salary Route
router.post("/add", async (req, res) => {
  try {
    const { employeeName, employeeEmail, basicSalary, hra, allowances } = req.body;

    if (!employeeName || !employeeEmail || !basicSalary) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const totalSalary =
      Number(basicSalary) + Number(hra || 0) + Number(allowances || 0);

    const newSalary = new Salary({
      employeeName,
      employeeEmail,
      basicSalary,
      hra,
      allowances,
      totalSalary
    });

    await newSalary.save();
    res.json({ message: "Salary added successfully", salary: newSalary });
  } catch (err) {
    console.error("Error saving salary:", err);
    res.status(500).json({ message: "Server error while adding salary" });
  }
});

// ✅ Get all salaries
router.get("/all", async (req, res) => {
  try {
    const salaries = await Salary.find().sort({ createdAt: -1 });
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ message: "Error fetching salaries" });
  }
});

// ✅ Delete salary by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Salary.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.json({ message: "Salary record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting salary record" });
  }
});


// ✅ Find salary by employee email (for Generate Pay Slip)
router.get("/find/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const salary = await Salary.findOne({ employeeEmail: email });
    if (!salary) return res.status(404).json({ message: "No salary record found" });
    res.json(salary);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

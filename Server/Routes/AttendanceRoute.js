import express from "express";
import { AttendanceModel } from "../models/AttendanceModel.js";

const router = express.Router();

// Get all attendance records
router.get("/", async (req, res) => {
  try {
    const records = await AttendanceModel.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error("Error fetching attendance records:", err);
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
});

// Add new attendance record
router.post("/", async (req, res) => {
  try {
    const { employeeName, date, status, notes } = req.body;

    if (!date || !status) {
      return res.status(400).json({ message: "Date and status are required" });
    }

    const newRecord = new AttendanceModel({ employeeName, date, status, notes });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error("Error saving attendance record:", err);
    res.status(500).json({ message: "Failed to save attendance record" });
  }
});

export default router;

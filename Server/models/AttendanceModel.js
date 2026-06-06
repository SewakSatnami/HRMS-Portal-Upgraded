import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeName: { type: String, default: "Unknown" },
  date: { type: String, required: true },
  status: { type: String, required: true },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export const AttendanceModel = mongoose.model("Attendance", attendanceSchema);

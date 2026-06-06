import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  basicPay: { type: Number, required: true },
  hra: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  totalSalary: { type: Number, required: true },
  month: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const SalaryModel = mongoose.model("Salary", salarySchema);

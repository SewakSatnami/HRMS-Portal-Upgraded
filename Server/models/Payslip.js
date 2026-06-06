import mongoose from "mongoose";

const payslipSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: {
    type: String, // Format: "YYYY-MM"
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true
  },
  allowances: {
    hra: Number,
    conveyance: Number,
    medical: Number,
    lta: Number,
    other: Number
  },
  grossSalary: {
    type: Number,
    required: true
  },
  deductions: {
    pf: Number,
    professionalTax: Number,
    incomeTax: Number,
    absentDays: Number,
    unpaidLeave: Number,
    other: Number
  },
  totalDeductions: {
    type: Number,
    required: true
  },
  netSalary: {
    type: Number,
    required: true
  },
  workingDays: {
    type: Number,
    required: true
  },
  presentDays: {
    type: Number,
    required: true
  },
  absentDays: {
    type: Number,
    required: true
  },
  paidLeaveDays: {
    type: Number,
    default: 0
  },
  unpaidLeaveDays: {
    type: Number,
    default: 0
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate payslips for same employee in same month
payslipSchema.index({ employeeId: 1, month: 1 }, { unique: true });

export default mongoose.model("Payslip", payslipSchema);
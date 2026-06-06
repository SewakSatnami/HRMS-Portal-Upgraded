import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    unique: true
  },
  baseSalary: {
    type: Number,
    required: true
  },
  hra: {
    type: Number,
    default: 0
  },
  conveyance: {
    type: Number,
    default: 0
  },
  medical: {
    type: Number,
    default: 0
  },
  lta: {
    type: Number,
    default: 0
  },
  otherAllowances: {
    type: Number,
    default: 0
  },
  pf: {
    type: Number,
    default: 0 // Employee PF contribution
  },
  professionalTax: {
    type: Number,
    default: 0
  },
  incomeTax: {
    type: Number,
    default: 0
  },
  otherDeductions: {
    type: Number,
    default: 0
  },
  effectiveFrom: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Salary", salarySchema);
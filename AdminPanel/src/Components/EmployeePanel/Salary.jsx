import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { employeeAPI } from "../../services/api";
import "./Salary.css";
import jsPDF from "jspdf";

const EmployeeSalary = () => {
  const [salaryData, setSalaryData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalaryData();
  }, []);

  const fetchSalaryData = async () => {
    try {
      setLoading(true);
      const [salaryRes, profileRes] = await Promise.allSettled([
        employeeAPI.getMySalary(),
        employeeAPI.getProfile()
      ]);

      if (salaryRes.status === 'fulfilled') {
        setSalaryData(salaryRes.value.salary);
      }

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value.employee);
      }
    } catch (error) {
      console.error("Error fetching salary data:", error);
      toast.error("Failed to load salary data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (salary) => {
    if (!salary) return 0;
    const earnings = (salary.baseSalary || 0) + (salary.hra || 0) + (salary.conveyance || 0) + (salary.medical || 0) + (salary.lta || 0) + (salary.otherAllowances || 0);
    const deductions = (salary.pf || 0) + (salary.professionalTax || 0) + (salary.incomeTax || 0) + (salary.otherDeductions || 0);
    return earnings - deductions;
  };

  // 🔥 PDF GENERATION
  const generatePDF = () => {
    if (!salaryData || !profile) {
      toast.error("Salary data not available");
      return;
    }

    const doc = new jsPDF();

    // Header Background
    doc.setFillColor(13, 110, 253);
    doc.rect(0, 0, 210, 30, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Employee Payslip", 70, 18);

    // Company Name
    doc.setFontSize(10);
    doc.text("HRMS Pvt Ltd © 2026", 75, 25);

    // Reset color
    doc.setTextColor(0, 0, 0);

    // Employee Info
    doc.setFontSize(12);
    doc.text(`Employee Name: ${profile.userId?.name || "N/A"}`, 20, 45);
    doc.text(`Employee ID: ${profile.employeeId || "N/A"}`, 20, 52);
    doc.text(`Department: ${profile.department || "N/A"}`, 20, 59);
    doc.text(`Month: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`, 20, 66);

    // Section Title
    doc.setFontSize(14);
    doc.setTextColor(13, 110, 253);
    doc.text("Salary Breakdown", 20, 85);

    // Reset text color
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    let yPos = 100;

    // Earnings
    doc.setTextColor(34, 197, 94); // Green for earnings
    doc.text("Earnings:", 20, yPos);
    yPos += 10;

    if (salaryData.baseSalary) {
      doc.text("Basic Salary:", 30, yPos);
      doc.text(`₹${salaryData.baseSalary}`, 150, yPos);
      yPos += 8;
    }

    if (salaryData.hra) {
      doc.text("HRA:", 30, yPos);
      doc.text(`₹${salaryData.hra}`, 150, yPos);
      yPos += 8;
    }

    if (salaryData.conveyance) {
      doc.text("Conveyance:", 30, yPos);
      doc.text(`₹${salaryData.conveyance}`, 150, yPos);
      yPos += 8;
    }

    if (salaryData.medical) {
      doc.text("Medical:", 30, yPos);
      doc.text(`₹${salaryData.medical}`, 150, yPos);
      yPos += 8;
    }

    if (salaryData.lta) {
      doc.text("LTA:", 30, yPos);
      doc.text(`₹${salaryData.lta}`, 150, yPos);
      yPos += 8;
    }

    if (salaryData.otherAllowances) {
      doc.text("Other Allowances:", 30, yPos);
      doc.text(`₹${salaryData.otherAllowances}`, 150, yPos);
      yPos += 8;
    }

    // Deductions
    doc.setTextColor(220, 53, 69); // Red for deductions
    yPos += 5;
    doc.text("Deductions:", 20, yPos);
    yPos += 10;

    if (salaryData.pf) {
      doc.text("PF:", 30, yPos);
      doc.text(`₹${salaryData.pf}`, 150, yPos);
      yPos += 8;
    }

    if (salaryData.professionalTax) {
      doc.text("Professional Tax:", 30, yPos);
      doc.text(`₹${salaryData.professionalTax}`, 150, yPos);
      yPos += 8;
    }

    if (salaryData.incomeTax) {
      doc.text("Income Tax:", 30, yPos);
      doc.text(`₹${salaryData.incomeTax}`, 150, yPos);
      yPos += 8;
    }

    if (salaryData.otherDeductions) {
      doc.text("Other Deductions:", 30, yPos);
      doc.text(`₹${salaryData.otherDeductions}`, 150, yPos);
      yPos += 8;
    }

    // Line
    doc.setDrawColor(150);
    doc.line(20, yPos + 5, 190, yPos + 5);

    // Total
    doc.setFontSize(14);
    doc.setTextColor(13, 110, 253);
    doc.text("Net Salary:", 20, yPos + 20);
    doc.text(`₹${calculateTotal(salaryData)}`, 150, yPos + 20);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("This is a system-generated payslip.", 20, yPos + 40);

    // Download
    doc.save(`payslip-${profile.employeeId || "employee"}.pdf`);
  };

  if (loading) {
    return (
      <div className="container-fluid p-4 salary-page">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading salary data...</p>
        </div>
      </div>
    );
  }

  if (!salaryData) {
    return (
      <div className="container-fluid p-4 salary-page">
        <div className="text-center">
          <p>Salary information not available</p>
        </div>
      </div>
    );
  }

  const total = calculateTotal(salaryData);

  return (
    <div className="container-fluid p-4 salary-page">

      {/* Header */}
      <div className="salary-header mb-4 p-4">
        <h2 className="fw-bold text-white">Salary & Payroll</h2>
        <p className="text-white mb-0">
          View your salary breakdown
        </p>
      </div>

      <div className="row g-4">

        {/* Total Salary */}
        <div className="col-lg-4">
          <div className="card salary-card p-4 text-center">

            <h6 className="text-muted mb-2">Net Salary</h6>

            <h2 className="fw-bold text-primary">
              ₹{total}
            </h2>

            <p className="text-muted">This Month</p>

          </div>
        </div>

        {/* Breakdown */}
        <div className="col-lg-8">
          <div className="card salary-card p-4">

            <h5 className="fw-bold mb-3">Salary Breakdown</h5>

            {/* Earnings */}
            <div className="mb-3">
              <h6 className="text-success mb-2">Earnings</h6>
              {salaryData.baseSalary && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Basic Salary</span>
                  <span className="fw-bold text-success">
                    ₹{salaryData.baseSalary}
                  </span>
                </div>
              )}

              {salaryData.hra && (
                <div className="d-flex justify-content-between mb-2">
                  <span>HRA</span>
                  <span className="fw-bold text-success">
                    ₹{salaryData.hra}
                  </span>
                </div>
              )}

              {salaryData.conveyance && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Conveyance</span>
                  <span className="fw-bold text-success">
                    ₹{salaryData.conveyance}
                  </span>
                </div>
              )}

              {salaryData.medical && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Medical</span>
                  <span className="fw-bold text-success">
                    ₹{salaryData.medical}
                  </span>
                </div>
              )}

              {salaryData.lta && (
                <div className="d-flex justify-content-between mb-2">
                  <span>LTA</span>
                  <span className="fw-bold text-success">
                    ₹{salaryData.lta}
                  </span>
                </div>
              )}

              {salaryData.otherAllowances && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Other Allowances</span>
                  <span className="fw-bold text-success">
                    ₹{salaryData.otherAllowances}
                  </span>
                </div>
              )}
            </div>

            {/* Deductions */}
            <div className="mb-3">
              <h6 className="text-danger mb-2">Deductions</h6>
              {salaryData.pf && (
                <div className="d-flex justify-content-between mb-2">
                  <span>PF</span>
                  <span className="fw-bold text-danger">
                    ₹{salaryData.pf}
                  </span>
                </div>
              )}

              {salaryData.professionalTax && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Professional Tax</span>
                  <span className="fw-bold text-danger">
                    ₹{salaryData.professionalTax}
                  </span>
                </div>
              )}

              {salaryData.incomeTax && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Income Tax</span>
                  <span className="fw-bold text-danger">
                    ₹{salaryData.incomeTax}
                  </span>
                </div>
              )}

              {salaryData.otherDeductions && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Other Deductions</span>
                  <span className="fw-bold text-danger">
                    ₹{salaryData.otherDeductions}
                  </span>
                </div>
              )}
            </div>

            <hr />

            <div className="d-flex justify-content-between">
              <strong>Net Salary</strong>
              <strong className="text-primary">
                ₹{total}
              </strong>
            </div>

          </div>
        </div>

      </div>

      {/* 🔥 Payslip Button */}
      <div className="mt-4 text-end">
        <button className="btn btn-primary px-4" onClick={generatePDF}>
          <i className="bi bi-download me-2"></i>
          Download Payslip
        </button>
      </div>

    </div>
  );
};

export default EmployeeSalary;
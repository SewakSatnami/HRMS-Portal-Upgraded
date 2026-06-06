import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { adminAPI } from "../../services/api";

const currentDate = new Date();

const GeneratePaySlip = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    employeeId: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });
  const [payslip, setPayslip] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await adminAPI.getAllEmployees({ limit: 200 });
        setEmployees(data.employees || []);
      } catch (error) {
        const serverMessage = error.response?.data?.message || error.response?.data || error.message;
        setMessage(serverMessage || "Failed to load employees");
      }
    };

    loadEmployees();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setMessage("");
    setPayslip(null);

    if (!form.employeeId) {
      setMessage("Please select an employee or search by employee ID.");
      return;
    }

    try {
      setLoading(true);
      const data = await adminAPI.generatePayslip({
        employeeId: form.employeeId,
        month: Number(form.month),
        year: Number(form.year),
      });
      setPayslip(data.payslip);
      setMessage(data.message || "Payslip generated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to generate payslip");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const name = (employee.userId?.name || "").toLowerCase();
    const employeeId = (employee.employeeId || "").toLowerCase();
    const department = (employee.department || "").toLowerCase();
    const search = searchTerm.toLowerCase().trim();
    return (
      !search ||
      name.includes(search) ||
      employeeId.includes(search) ||
      department.includes(search)
    );
  });

  const selectedEmployee = employees.find((employee) => employee._id === form.employeeId);
  const selectedUser = selectedEmployee?.userId || {};

  const generatePDF = () => {
    if (!payslip) return;

    const doc = new jsPDF("p", "mm", "a4");
    const monthName = new Date(Number(form.year), Number(form.month) - 1).toLocaleString("default", { month: "long" });

    doc.setFillColor(0, 123, 255);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("HRMS SOLUTIONS PVT. LTD.", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text("Employee Pay Slip", 105, 22, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.text(`Payslip - ${monthName} ${form.year}`, 105, 40, { align: "center" });

    let y = 55;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Employee Name: ${selectedUser.name || "Employee"}`, 20, y);
    y += 7;
    doc.text(`Email: ${selectedUser.email || "N/A"}`, 20, y);
    y += 7;
    doc.text(`Employee ID: ${selectedEmployee?.employeeId || form.employeeId}`, 20, y);
    y += 7;
    doc.text(`Department: ${selectedEmployee?.department || "N/A"}`, 20, y);
    y += 7;
    doc.text(
      `Generated At: ${payslip.generatedAt ? new Date(payslip.generatedAt).toLocaleString() : "N/A"}`,
      20,
      y
    );

    y += 10;
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Salary Breakdown", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");

    const rows = [
      ["Base Salary", payslip.baseSalary],
      ["HRA", payslip.allowances?.hra || 0],
      ["Conveyance", payslip.allowances?.conveyance || 0],
      ["Medical", payslip.allowances?.medical || 0],
      ["Other Allowances", payslip.allowances?.other || 0],
      ["Gross Salary", payslip.grossSalary],
      ["Absent Deduction", `-${payslip.deductions?.absentDays || 0}`],
      ["Unpaid Leave Deduction", `-${payslip.deductions?.unpaidLeave || 0}`],
      ["Total Deductions", `-${payslip.totalDeductions}`],
    ];

    rows.forEach(([label, value]) => {
      doc.text(label, 25, y);
      doc.text(`INR ${value}`, 180, y, { align: "right" });
      y += 7;
    });

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Net Salary", 25, y);
    doc.text(`INR ${payslip.netSalary}`, 180, y, { align: "right" });

    y += 15;
    doc.setFont("helvetica", "normal");
    doc.text(`Present Days: ${payslip.presentDays}`, 25, y);
    y += 7;
    doc.text(`Absent Days: ${payslip.absentDays}`, 25, y);
    y += 7;
    doc.text(`Paid Leave Days: ${payslip.paidLeaveDays}`, 25, y);
    y += 7;
    doc.text(`Unpaid Leave Days: ${payslip.unpaidLeaveDays}`, 25, y);

    doc.save(`${selectedUser.name || "Employee"}_Payslip_${monthName}_${form.year}.pdf`);
  };

  return (
    <div className="container py-4">
      <div className="card shadow border-0 rounded-4">
        <div className="bg-primary text-white p-4 rounded-top-4">
          <h5 className="fw-bold mb-1">
            <i className="bi bi-receipt me-2"></i>
            Pay Slip Generator
          </h5>
        </div>

        <div className="card-body bg-light">
          <form onSubmit={handleGenerate} className="mb-4">
            <div className="row g-3 mb-3">
              <div className="col-12">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search employee by name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <select
                  className="form-control form-control-lg"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select employee</option>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.userId?.name || employee.employeeId} - {employee.employeeId}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No employees match your search
                    </option>
                  )}
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="form-control form-control-lg"
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  min="2020"
                  className="form-control form-control-lg"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2 d-grid">
                <button className="btn btn-primary fw-semibold" disabled={loading}>
                  {loading ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>
          </form>

          {message && <div className={`alert ${payslip ? "alert-success" : "alert-danger"}`}>{message}</div>}

          {payslip && (
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h6 className="fw-bold text-primary mb-3">Generated Payslip</h6>
                <p><strong>Employee:</strong> {selectedUser.name || selectedEmployee?.employeeId}</p>
                <p><strong>Employee ID:</strong> {selectedEmployee?.employeeId || form.employeeId}</p>
                <p><strong>Month:</strong> {payslip.month}</p>
                <p><strong>Generated At:</strong> {payslip.generatedAt ? new Date(payslip.generatedAt).toLocaleString() : "N/A"}</p>
                <p><strong>Gross Salary:</strong> INR {payslip.grossSalary}</p>
                <p><strong>Total Deductions:</strong> INR {payslip.totalDeductions}</p>
                <h5 className="text-success">Net Salary: INR {payslip.netSalary}</h5>

                <div className="row mt-3">
                  <div className="col-md-3"><span className="badge bg-success">Present: {payslip.presentDays}</span></div>
                  <div className="col-md-3"><span className="badge bg-danger">Absent: {payslip.absentDays}</span></div>
                  <div className="col-md-3"><span className="badge bg-info">Paid Leave: {payslip.paidLeaveDays}</span></div>
                  <div className="col-md-3"><span className="badge bg-warning text-dark">Unpaid Leave: {payslip.unpaidLeaveDays}</span></div>
                </div>

                <div className="d-grid mt-3">
                  <button onClick={generatePDF} className="btn btn-success btn-lg fw-semibold">
                    <i className="bi bi-download me-2"></i>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePaySlip;

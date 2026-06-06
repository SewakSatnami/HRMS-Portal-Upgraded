import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { adminAPI } from "../../services/api";

const AddSalary = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    baseSalary: "",
    hra: "",
    conveyance: "",
    medical: "",
    lta: "",
    otherAllowances: "",
    pf: "",
    professionalTax: "",
    incomeTax: "",
    otherDeductions: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await adminAPI.getAllEmployees({ limit: 100 });
        setEmployees(data.employees || []);
      } catch (error) {
        const serverMessage = error.response?.data?.message || error.response?.data || error.message;
        setMessage(serverMessage || "Failed to load employees");
      }
    };

    loadEmployees();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const numericPayload = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [
      key,
      key === "employeeId" ? value : Number(value || 0),
    ])
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      const response = await adminAPI.addSalary(numericPayload);
      setMessage(response.message || "Salary added successfully!");
      setTimeout(() => navigate("/dashboard/salary-list"), 900);
    } catch (error) {
      const validationMessage = error.response?.data?.errors?.[0]?.msg;
      const serverMessage = error.response?.data?.message || error.response?.data || error.message;
      setMessage(validationMessage || serverMessage || "Error adding salary record");
    } finally {
      setLoading(false);
    }
  };

  const grossSalary =
    Number(formData.baseSalary || 0) +
    Number(formData.hra || 0) +
    Number(formData.conveyance || 0) +
    Number(formData.medical || 0) +
    Number(formData.lta || 0) +
    Number(formData.otherAllowances || 0);

  return (
    <div className="container py-4">
      <div className="mb-4 fade-in">
        <h4 className="fw-bold text-dark">Add Employee Salary</h4>
        <p className="text-muted small">Enter monthly salary structure for an employee</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 animate-card">
        <div className="card-body p-4">
          {message && (
            <div className={`alert ${message.toLowerCase().includes("success") ? "alert-success" : "alert-danger"} fade-in`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h6 className="fw-semibold text-secondary mb-3">Employee Information</h6>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label">Employee</label>
                <select className="form-control modern-input" name="employeeId" value={formData.employeeId} onChange={handleChange} required>
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.userId?.name || employee.employeeId} - {employee.department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="my-4" />

            <h6 className="fw-semibold text-secondary mb-3">Allowances</h6>
            <div className="row g-3">
              {[
                ["baseSalary", "Base Salary"],
                ["hra", "HRA"],
                ["conveyance", "Conveyance"],
                ["medical", "Medical"],
                ["lta", "LTA"],
                ["otherAllowances", "Other Allowances"],
              ].map(([name, label]) => (
                <div className="col-md-4 input-animate" key={name}>
                  <label className="form-label">{label}</label>
                  <input type="number" min="0" className="form-control modern-input" name={name} value={formData[name]} onChange={handleChange} required={name === "baseSalary"} />
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <h6 className="fw-semibold text-secondary mb-3">Deductions</h6>
            <div className="row g-3">
              {[
                ["pf", "PF"],
                ["professionalTax", "Professional Tax"],
                ["incomeTax", "Income Tax"],
                ["otherDeductions", "Other Deductions"],
              ].map(([name, label]) => (
                <div className="col-md-3 input-animate" key={name}>
                  <label className="form-label">{label}</label>
                  <input type="number" min="0" className="form-control modern-input" name={name} value={formData[name]} onChange={handleChange} />
                </div>
              ))}
            </div>

            <div className="mt-4 fade-in">
              <label className="form-label fw-semibold">Gross Salary</label>
              <input type="text" className="form-control total-box" value={`INR ${grossSalary}`} readOnly />
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button type="submit" className="btn btn-primary px-4 fw-semibold animated-btn" disabled={loading}>
                <i className="bi bi-check-circle me-2"></i>
                {loading ? "Saving..." : "Save Salary"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSalary;

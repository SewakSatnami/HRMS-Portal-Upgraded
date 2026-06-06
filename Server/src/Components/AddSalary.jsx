import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import "bootstrap/dist/css/bootstrap.min.css";

const AddSalary = () => {
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeEmail: "",
    basicSalary: "",
    hra: "",
    allowances: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigation

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/salary/add", formData);
      setMessage(res.data.message || "✅ Salary added successfully!");

      // ✅ Redirect to Salary List after 1 second
      setTimeout(() => {
        navigate("/dashboard/salary-list");
      }, 1000);

      // Reset form
      setFormData({
        employeeName: "",
        employeeEmail: "",
        basicSalary: "",
        hra: "",
        allowances: "",
      });
    } catch (err) {
      console.error("Error adding salary record:", err);
      setMessage("❌ Error adding salary record. Please try again.");
    }
  };

  // Calculate total salary
  const totalSalary =
    Number(formData.basicSalary || 0) +
    Number(formData.hra || 0) +
    Number(formData.allowances || 0);

  return (
    <div className="container mt-5 mb-5">
      <div
        className="card shadow-lg border-0 mx-auto"
        style={{ maxWidth: "700px", borderRadius: "20px" }}
      >
        {/* Header Section */}
        <div
          className="card-header text-white text-center py-3"
          style={{
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            background: "linear-gradient(135deg, #007bff, #00bcd4)",
          }}
        >
          <h3 className="fw-bold mb-0">
            <i className="bi bi-cash-coin me-2"></i> Add Employee Salary
          </h3>
        </div>

        {/* Body Section */}
        <div className="card-body bg-light p-4">
          {message && (
            <div
              className={`alert text-center ${
                message.toLowerCase().includes("error")
                  ? "alert-danger"
                  : "alert-success"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Employee Details */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <i className="bi bi-person-fill text-primary me-2"></i>Employee Name
                </label>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  name="employeeName"
                  placeholder="Enter employee full name"
                  value={formData.employeeName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <i className="bi bi-envelope-fill text-primary me-2"></i>Email
                </label>
                <input
                  type="email"
                  className="form-control shadow-sm"
                  name="employeeEmail"
                  placeholder="Enter employee email"
                  value={formData.employeeEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Salary Inputs */}
            <div className="row g-3 mt-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  <i className="bi bi-currency-rupee text-success me-2"></i>Basic Salary
                </label>
                <input
                  type="number"
                  className="form-control shadow-sm"
                  name="basicSalary"
                  placeholder="₹ Basic Salary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  <i className="bi bi-house-fill text-success me-2"></i>HRA
                </label>
                <input
                  type="number"
                  className="form-control shadow-sm"
                  name="hra"
                  placeholder="₹ HRA"
                  value={formData.hra}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  <i className="bi bi-briefcase-fill text-success me-2"></i>Allowances
                </label>
                <input
                  type="number"
                  className="form-control shadow-sm"
                  name="allowances"
                  placeholder="₹ Allowances"
                  value={formData.allowances}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Total Salary Display */}
            <div className="mt-4">
              <label className="form-label fw-semibold">
                <i className="bi bi-calculator-fill text-primary me-2"></i>Total Salary
              </label>
              <input
                type="text"
                className="form-control shadow-sm bg-white text-success fw-bold"
                value={`₹${totalSalary}`}
                readOnly
              />
            </div>

            {/* Submit Button */}
            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-success py-2 fw-semibold shadow-sm"
                style={{
                  borderRadius: "10px",
                  letterSpacing: "0.5px",
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  border: "none",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #20c997, #28a745)")
                }
                onMouseOut={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #28a745, #20c997)")
                }
              >
                <i className="bi bi-plus-circle me-2"></i>Add Salary Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSalary;

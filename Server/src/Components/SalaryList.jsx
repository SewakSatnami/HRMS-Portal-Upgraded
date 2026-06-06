import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const SalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch salary records
  const fetchSalaries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/salary/all");
      setSalaries(res.data);
    } catch (err) {
      console.error("Error loading salary data:", err);
      setMessage("Failed to load salary data");
    } finally {
      setLoading(false);
    }
  };

  // Delete salary record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/salary/delete/${id}`);
      setMessage("✅ Salary record deleted successfully!");
      fetchSalaries(); // refresh the list
    } catch (err) {
      console.error("Error deleting salary:", err);
      setMessage("❌ Failed to delete salary record");
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  return (
    <div className="container mt-5 mb-5">
      <div
        className="card shadow-lg border-0 rounded-4 overflow-hidden"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        {/* Header Section */}
        <div
          className="text-white text-center py-4"
          style={{
            background: "linear-gradient(135deg, #007bff, #00bcd4)",
          }}
        >
          <h3 className="fw-bold mb-1">
            <i className="bi bi-cash-stack me-2"></i> Salary Records
          </h3>
          <p className="mb-0 text-light small">
            View, manage, and delete employee salary details
          </p>
        </div>

        {/* Body Section */}
        <div className="card-body p-4">
          {message && (
            <div
              className={`alert text-center fw-semibold ${
                message.includes("✅")
                  ? "alert-success"
                  : message.includes("❌")
                  ? "alert-danger"
                  : "alert-info"
              }`}
            >
              {message}
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 fw-semibold text-secondary">
                Loading salary records...
              </p>
            </div>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-hover align-middle shadow-sm">
                <thead
                  className="text-white"
                  style={{
                    background: "linear-gradient(135deg, #007bff, #00bcd4)",
                  }}
                >
                  <tr>
                    <th>#</th>
                    <th>Employee Name</th>
                    <th>Email</th>
                    <th>Basic Salary</th>
                    <th>HRA</th>
                    <th>Allowances</th>
                    <th>Total Salary</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.length > 0 ? (
                    salaries.map((salary, index) => (
                      <tr key={salary._id} className="table-row-hover">
                        <td className="fw-semibold text-secondary">{index + 1}</td>
                        <td className="fw-semibold text-dark">{salary.employeeName}</td>
                        <td className="text-muted">{salary.employeeEmail}</td>
                        <td>₹{salary.basicSalary}</td>
                        <td>₹{salary.hra}</td>
                        <td>₹{salary.allowances}</td>
                        <td className="fw-bold text-success">₹{salary.totalSalary}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-danger btn-sm px-3"
                            onClick={() => handleDelete(salary._id)}
                          >
                            <i className="bi bi-trash3-fill me-1"></i>Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        <i className="bi bi-exclamation-circle me-2"></i>No salary records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Refresh Button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-primary fw-semibold px-4 py-2 shadow-sm"
              onClick={fetchSalaries}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>Refresh Records
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center text-white py-2 mt-3"
          style={{
            background: "linear-gradient(135deg, #00bcd4, #007bff)",
          }}
        >
          <small>© 2025 HRMS Solutions Pvt. Ltd. | Salary Management</small>
        </div>
      </div>
    </div>
  );
};

export default SalaryList;

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { adminAPI } from "../../services/api";

const SalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllSalaries({ limit: 100 });
      setSalaries(data.salaries || []);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load salary data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) return;

    try {
      await adminAPI.deleteSalary(id);
      setMessage("Salary record deleted successfully!");
      fetchSalaries();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete salary record");
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="text-white text-center py-4" style={{ background: "linear-gradient(135deg, #007bff, #00bcd4)" }}>
          <h3 className="fw-bold mb-1">
            <i className="bi bi-cash-stack me-2"></i> Salary Records
          </h3>
          <p className="mb-0 text-light small">View and manage employee salary structures</p>
        </div>

        <div className="card-body p-4">
          {message && (
            <div className={`alert text-center fw-semibold ${message.toLowerCase().includes("failed") ? "alert-danger" : "alert-success"}`}>
              {message}
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 fw-semibold text-secondary">Loading salary records...</p>
            </div>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-hover align-middle shadow-sm">
                <thead className="text-white" style={{ background: "linear-gradient(135deg, #007bff, #00bcd4)" }}>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Base</th>
                    <th>Allowances</th>
                    <th>Deductions</th>
                    <th>Gross</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.length > 0 ? (
                    salaries.map((salary, index) => {
                      const employee = salary.employeeId || {};
                      const user = employee.userId || {};
                      const allowances = salary.hra + salary.conveyance + salary.medical + salary.lta + salary.otherAllowances;
                      const deductions = salary.pf + salary.professionalTax + salary.incomeTax + salary.otherDeductions;
                      return (
                        <tr key={salary._id} className="table-row-hover">
                          <td className="fw-semibold text-secondary">{index + 1}</td>
                          <td className="fw-semibold text-dark">{user.name || employee.employeeId}</td>
                          <td className="text-muted">{user.email || "N/A"}</td>
                          <td>INR {salary.baseSalary}</td>
                          <td>INR {allowances}</td>
                          <td>INR {deductions}</td>
                          <td className="fw-bold text-success">INR {salary.baseSalary + allowances}</td>
                          <td className="text-center">
                            <button className="btn btn-outline-danger btn-sm px-3" onClick={() => handleDelete(salary._id)}>
                              <i className="bi bi-trash3-fill me-1"></i>Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
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

          <div className="text-center mt-4">
            <button className="btn btn-primary fw-semibold px-4 py-2 shadow-sm" onClick={fetchSalaries}>
              <i className="bi bi-arrow-clockwise me-2"></i>Refresh Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryList;

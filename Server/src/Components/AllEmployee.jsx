import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AllEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employee/all");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setMessage("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run once on page load
  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ Delete employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:5000/api/employee/${id}`);
        alert("Employee deleted successfully!");
        fetchEmployees(); // refresh the list
      } catch (err) {
        console.error("Error deleting employee:", err);
        alert("Error deleting employee");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg border-0 rounded-4 p-4"
        style={{
          background: "#f9fafb",
          borderTop: "5px solid #0d6efd",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-primary mb-0">
            <i className="bi bi-people-fill me-2"></i>Employee Directory
          </h3>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={fetchEmployees}
          >
            <i className="bi bi-arrow-repeat me-1"></i> Refresh
          </button>

        </div>

        {message && (
          <div className="alert alert-danger text-center rounded-3">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-secondary">Loading employees...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover table-striped">
              <thead className="table-primary text-center">
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Joined On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((emp, index) => (
                    <tr key={emp._id} className="text-center">
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.position}</td>
                      <td className="text-success fw-semibold">
                        ₹{emp.salary}
                      </td>
                      <td>
                        {emp.createdAt
                          ? new Date(emp.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={() => handleDelete(emp._id)}
                        >
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-secondary">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEmployee;

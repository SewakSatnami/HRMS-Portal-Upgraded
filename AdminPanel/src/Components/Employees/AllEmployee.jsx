import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";

const AllEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");
      const data = await adminAPI.getAllEmployees({ page, limit: 8, search });
      setEmployees(data.employees || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setMessage(err.response?.data?.message || "Failed to load employee data");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await adminAPI.deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete employee");
    }
  };

  const handleEdit = (emp) => {
    navigate(`/dashboard/add-employee?edit=${emp._id}`);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div
          className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
          style={{
            background: "linear-gradient(135deg,#4f46e5,#3b82f6)",
            color: "white",
          }}
        >
          <h4 className="fw-bold mb-0">
            <i className="bi bi-people-fill me-2"></i>
            Employee Directory
          </h4>

          <form className="d-flex gap-2" onSubmit={handleSearch}>
            <input
              className="form-control form-control-sm"
              placeholder="Search employee, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-light btn-sm fw-semibold" type="submit">
              <i className="bi bi-search"></i>
            </button>
            <button
              className="btn btn-light btn-sm fw-semibold"
              type="button"
              onClick={fetchEmployees}
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </form>
        </div>

        <div className="p-4 bg-light">
          {message && <div className="alert alert-danger text-center">{message}</div>}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-3">Loading employees...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle bg-white rounded shadow-sm">
                  <thead className="table-light">
                    <tr className="text-center">
                      <th style={{ width: "70px" }}>#</th>
                      <th className="text-start" style={{ minWidth: "260px" }}>Employee</th>
                      <th>Email</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Joining</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.length > 0 ? (
                      employees.map((emp, index) => {
                        const user = emp.userId || {};
                        return (
                          <tr key={emp._id} className="text-center">
                            <td className="fw-bold">{(page - 1) * 8 + index + 1}</td>
                            <td className="text-start">
                              <div className="d-flex align-items-center gap-3">
                                <div
                                  className="rounded-circle text-white d-flex align-items-center justify-content-center flex-shrink-0"
                                  style={{
                                    width: "46px",
                                    height: "46px",
                                    background: "#6366f1",
                                    fontSize: "16px",
                                  }}
                                >
                                  {(user.name || "E").charAt(0).toUpperCase()}
                                </div>
                                <span className="fw-semibold text-nowrap">{user.name || "Employee"}</span>
                              </div>
                            </td>
                            <td>{user.email || "N/A"}</td>
                            <td>{emp.employeeId}</td>
                            <td>{emp.department}</td>
                            <td>
                              <span className="badge bg-primary">{emp.designation}</span>
                            </td>
                            <td className="text-capitalize">{emp.employmentType || "full-time"}</td>
                            <td>{emp.workLocation || "N/A"}</td>
                            <td>
                              {emp.joiningDate
                                ? new Date(emp.joiningDate).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => handleEdit(emp)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(emp._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center py-4">
                          No employees found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </button>
                <span className="small text-muted">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllEmployee;

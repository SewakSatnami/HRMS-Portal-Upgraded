import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { adminAPI } from "../../services/api";
import "./DepartmentList.css";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDepartments({ search });
      setDepartments(data.departments || []);
      setMessage("");
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.response?.data || error.message;
      setMessage(serverMessage || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await adminAPI.deleteDepartment(id);
      setMessage("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.response?.data || error.message;
      setMessage(serverMessage || "Failed to delete department");
    }
  };

  const handleAddChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setMessage("Department name is required");
      return;
    }

    try {
      setSubmitting(true);
      await adminAPI.createDepartment(formData);
      setMessage("Department added successfully!");
      setFormData({ name: "", description: "" });
      setShowModal(false);
      fetchDepartments();
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.response?.data || error.message;
      setMessage(serverMessage || "Failed to add department");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="fw-bold m-0">
          <i className="bi bi-building me-2 text-primary"></i>
          Departments
        </h4>

        <div className="d-flex gap-2 align-items-center flex-wrap">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Department
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.toLowerCase().includes("failed") ? "alert-danger" : "alert-success"}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3">Loading departments...</p>
        </div>
      ) : (
        <div className="row">
          {departments.length > 0 ? (
            departments.map((dept) => (
              <div className="col-md-4 mb-4" key={dept._id}>
                <div className="dept-card">
                  <div className="dept-icon">
                    <i className="bi bi-building"></i>
                  </div>

                  <h5>{dept.name}</h5>
                  <p>{dept.description || "No description added"}</p>
                  <span className="badge bg-primary mb-3">
                    {dept.employeeCount || 0} Employees
                  </span>

                  <div className="actions">
                    <button className="btn btn-sm btn-light" disabled title="Edit coming soon">
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(dept._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center">
                No departments found. Add a department to see it here.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Department Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Department</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Department Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter department name"
                      value={formData.name}
                      onChange={handleAddChange}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      placeholder="Enter department description (optional)"
                      rows="3"
                      value={formData.description}
                      onChange={handleAddChange}
                      disabled={submitting}
                    ></textarea>
                  </div>
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? "Adding..." : "Add Department"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;

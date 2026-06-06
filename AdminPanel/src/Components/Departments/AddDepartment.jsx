import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { adminAPI } from "../../services/api";
import "./AddDepartment.css";

const AddDepartment = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!departmentName.trim()) {
      setError("Department name is required");
      return;
    }

    try {
      setLoading(true);
      const response = await adminAPI.createDepartment({
        name: departmentName.trim(),
        description: description.trim()
      });

      setSuccess(response.message || "Department added successfully!");
      setDepartmentName("");
      setDescription("");
      setTimeout(() => navigate("/dashboard/departmentlist"), 900);
    } catch (err) {
      const validationMessage = err.response?.data?.errors?.[0]?.msg;
      setError(validationMessage || err.response?.data?.message || "Failed to add department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">
          <i className="bi bi-building me-2 text-primary"></i>
          Add Department
        </h4>
      </div>

      <div className="card shadow-sm border-0 rounded-4 p-4">
        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success d-flex align-items-center">
            <i className="bi bi-check-circle me-2"></i>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-tag me-2 text-secondary"></i>
              Department Name
            </label>
            <input
              type="text"
              className="form-control modern-input"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter department name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-card-text me-2 text-secondary"></i>
              Description
            </label>
            <textarea
              className="form-control modern-input"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary modern-btn" disabled={loading}>
              <i className="bi bi-plus-lg me-2"></i>
              {loading ? "Adding..." : "Add Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;

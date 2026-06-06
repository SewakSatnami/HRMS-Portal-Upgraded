import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { employeeAPI } from "../../services/api";
import "./Profile.css";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    department: "",
    designation: "",
    phone: "",
    address: ""
  });

  // Fetch employee profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getProfile();
      const employeeData = response.employee;

      setProfile(employeeData);
      setFormData({
        department: employeeData.department || "",
        designation: employeeData.designation || "",
        phone: employeeData.phone || "",
        address: employeeData.address || ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (profile) {
      setFormData({
        department: profile.department || "",
        designation: profile.designation || "",
        phone: profile.phone || "",
        address: profile.address || ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await employeeAPI.updateProfile(formData);
      setProfile(response.employee);
      setFormData({
        department: response.employee.department || "",
        designation: response.employee.designation || "",
        phone: response.employee.phone || "",
        address: response.employee.address || ""
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page p-3 p-md-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page p-3 p-md-4">
        <div className="text-center">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page p-3 p-md-4">

      {/* 🔷 SaaS Profile Header */}
      <div className="profile-header-card mb-4">

        <div className="d-flex justify-content-between align-items-center flex-wrap">

          {/* Left */}
          <div className="d-flex align-items-center gap-3">

            <div className="profile-avatar">
              <i className="bi bi-person-fill"></i>
            </div>

            <div>
              <h4 className="fw-bold mb-1">{profile.userId?.name || "Employee"}</h4>
              <p className="text-muted mb-0">
                {profile.designation || "Employee"} • {profile.department || "Department"}
              </p>
            </div>

          </div>

          {/* Right */}
          {!isEditing ? (
            <button className="btn edit-btn mt-3 mt-md-0" onClick={handleEdit}>
              <i className="bi bi-pencil me-2"></i>
              Edit
            </button>
          ) : (
            <div className="d-flex gap-2 mt-3 mt-md-0">
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check me-2"></i>
                    Save
                  </>
                )}
              </button>
            </div>
          )}

        </div>

      </div>

      {/* 🔹 Stats */}
      <div className="row g-4 mb-4">

        {[
          { title: "Employee ID", value: profile.employeeId || "N/A" },
          { title: "Joining Date", value: profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "N/A" },
          { title: "Department", value: profile.department || "N/A" }
        ].map((item, index) => (
          <div className="col-md-4" key={index}>
            <div className="card stat-card p-3">
              <h6 className="text-muted">{item.title}</h6>
              <h4 className="fw-bold">{item.value}</h4>
            </div>
          </div>
        ))}

      </div>

      {/* 🔹 Main Section */}
      <div className="row g-4">

        {/* Left Info */}
        <div className="col-lg-4">
          <div className="card profile-info-card p-4">
            <h5 className="fw-bold mb-3">Personal Info</h5>

            <p><i className="bi bi-envelope me-2"></i> {profile.userId?.email || "N/A"}</p>
            <p><i className="bi bi-telephone me-2"></i> {profile.phone || "N/A"}</p>
            <p><i className="bi bi-geo-alt me-2"></i> {profile.address || "N/A"}</p>
            <p><i className="bi bi-building me-2"></i> {profile.department || "N/A"}</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="col-lg-8">
          <div className="card profile-form-card p-4">

            <h5 className="fw-bold mb-3">
              {isEditing ? "Edit Profile" : "Profile Details"}
            </h5>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.userId?.name || ""}
                      disabled
                    />
                    <small className="text-muted">Name cannot be changed</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={profile.userId?.email || ""}
                      disabled
                    />
                    <small className="text-muted">Email cannot be changed</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-control"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>

                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        Update Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Full Name</label>
                    <p className="mb-0">{profile.userId?.name || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Email</label>
                    <p className="mb-0">{profile.userId?.email || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Department</label>
                    <p className="mb-0">{profile.department || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Designation</label>
                    <p className="mb-0">{profile.designation || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Phone</label>
                    <p className="mb-0">{profile.phone || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Address</label>
                    <p className="mb-0">{profile.address || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Employee ID</label>
                    <p className="mb-0">{profile.employeeId || "N/A"}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Joining Date</label>
                    <p className="mb-0">
                      {profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

export default EmployeeProfile;
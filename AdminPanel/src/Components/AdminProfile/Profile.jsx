import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authAPI.getProfile();
        setProfile(data.user);
        setForm({ name: data.user.name || "", email: data.user.email || "" });
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/admin-login";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await authAPI.updateProfile({ name: form.name, email: form.email });
      setProfile(data.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  if (message) {
    return <div className="alert alert-warning text-center mt-5">{message}</div>;
  }

  if (!profile) {
    return <div className="text-center mt-5">No profile data found</div>;
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="profile-container">
        <div className="row gy-4 gy-md-0 align-items-center">
          <div className="col-12 col-md-3 d-flex flex-column align-items-center">
            <div className="profile-img d-flex align-items-center justify-content-center bg-primary text-white fs-1 overflow-hidden">
              <span>{(profile.name || "A").charAt(0).toUpperCase()}</span>
            </div>
            <h5 className="mt-3 mb-1 text-center">{profile.name || "Admin"}</h5>
            <p className="text-muted text-capitalize text-center">{profile.role}</p>
          </div>

          <div className="col-12 col-md-9">
            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className="row gy-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Joined</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control text-capitalize"
                    value={profile.role}
                    readOnly
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary me-2" disabled={saving}>
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

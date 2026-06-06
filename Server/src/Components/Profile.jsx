import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const adminId = localStorage.getItem("adminId"); // 👈 check for login
      if (!adminId) {
        setMessage("Please log in first.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/admin/profile/${adminId}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
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
    <div className="container mt-5">
      <h3 className="text-center mb-4">Admin Profile</h3>

      <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body text-center">
          <img
            src={`http://localhost:5000${profile.profileImage || "/uploads/default.png"}`}
            alt="profile"
            className="rounded-circle border mb-3"
            width="120"
            height="120"
          />
          <h5 className="card-title">{profile.name || "Admin"}</h5>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone || "Not provided"}</p>
          <p><strong>Position:</strong> {profile.position || "HR Manager"}</p>
          <p><strong>Address:</strong> {profile.address || "N/A"}</p>

          <div className="mt-4">
            <button
              className="btn btn-primary me-2"
              onClick={() => (window.location.href = "/edit-profile")}
            >
              Edit Profile
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                localStorage.removeItem("adminId");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

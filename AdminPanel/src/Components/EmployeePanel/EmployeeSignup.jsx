import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api";
import "./EmployeeLogin.css"; // reuse same CSS
import bgImage from "../../assets/image/emp-login-signup.png";

const EmployeeSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.register({
        ...formData,
        role: 'employee'
      });

      toast.success("Account created successfully! Please login.");
      navigate("/employee-login");
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-wrapper"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="auth-overlay"></div>

      <div className="login-card">
        <h3 className="login-title">Create Account</h3>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group-custom">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Full Name</label>
          </div>

          {/* Email */}
          <div className="input-group-custom">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Email</label>
          </div>

          {/* Password */}
          <div className="input-group-custom">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label>Password</label>
          </div>

          {/* Department */}
          <div className="input-group-custom">
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
            <label>Department</label>
          </div>

          {/* Designation */}
          <div className="input-group-custom">
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
            <label>Designation</label>
          </div>

          {/* Phone */}
          <div className="input-group-custom">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <label>Phone</label>
          </div>

          {/* Address */}
          <div className="input-group-custom">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <label>Address</label>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "SIGN UP"}
          </button>
        </form>

        <p className="signup-text">
          Already have an account? <Link to="/employee-login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default EmployeeSignup;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api";
import "./EmployeeLogin.css";

import bgImage from "../../assets/image/emp-login-signup.png";

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
      const response = await authAPI.login(formData.email, formData.password);

      if (response.user?.role !== "employee") {
        toast.error("Please use an employee account to login here.");
        return;
      }

      // Store token and user data
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      toast.success("Login successful!");
      console.log('Navigating to /employee/dashboard');
      navigate("/employee/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
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
        <h3 className="login-title">Employee Login</h3>

        <form onSubmit={handleSubmit}>
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

          {/* Remember */}
          <div className="remember">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="forgot">Forgot your password?</p>
        </form>

        <p className="signup-text">
          New here? <Link to="/employee-signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default EmployeeLogin;

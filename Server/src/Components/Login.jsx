import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!values.email || !values.password) {
      setError("⚠️ Please enter both email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", values);

      if (res.data.message === "Login successful" && res.data.admin) {
        localStorage.setItem("adminId", res.data.admin._id);
        localStorage.setItem("user", JSON.stringify(res.data.admin));
        alert("✅ Login successful!");
        window.location.href = "/dashboard";
      } else {
        setError(res.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "❌ Server not responding. Please try again later."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow-lg">
        <h2>
          <i className="bi bi-person-circle me-2 text-info"></i>
          Admin Login
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold text-dark">
              <i className="bi bi-envelope-fill me-2 text-info"></i>Email Address
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control shadow-sm"
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold text-dark">
              <i className="bi bi-lock-fill me-2 text-info"></i>Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              className="form-control shadow-sm"
            />
          </div>

          <button type="submit" className="btn btn-gradient mt-2">
            <i className="bi bi-box-arrow-in-right me-2"></i>Login
          </button>
        </form>

        <div className="mt-3 text-dark small">
          Don’t have an account?{" "}
          <a href="/signup" className="hover-link fw-semibold">
            Signup
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

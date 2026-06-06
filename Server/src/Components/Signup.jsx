import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";

const Signup = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!values.firstName || !values.lastName || !values.email || !values.password) {
      setError("Please fill all required fields");
      return;
    }

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/admin/register", values);
      setSuccess(res.data.message || "Admin registered successfully!");
      if (res.data.message === "Admin registered successfully") {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (err) {
      if (err.response) setError(err.response.data.message);
      else setError("Server not responding");
    }
  };

  return (
    <div className="SignupPage d-flex justify-content-center align-items-center">
      <div className="SignupForm">
        <h2>✨ Admin Signup</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your first name"
            />
          </div>

          <div className="mb-3 text-start">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your last name"
            />
          </div>

          <div className="mb-3 text-start">
            <label>Email Address:</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3 text-start">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-3 text-start">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="btn btn-gradient w-100">Sign Up</button>
        </form>

        <p className="mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

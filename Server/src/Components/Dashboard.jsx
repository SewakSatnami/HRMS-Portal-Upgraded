import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Dashboard.css";

const Dashboard = () => {
  // ✅ States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [payrollOpen, setPayrollOpen] = useState(false);
  const [userName, setUserName] = useState("");

  // ✅ Get logged-in user's name from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.name || "User");
    }
  }, []);

  return (
    <div className="dashboard-layout">
      {/* 🔹 Header / Topbar */}
      <div className="topbar shadow-sm d-flex align-items-center justify-content-between px-3">
        {/* Sidebar Toggle */}
        <button
          className="btn text-dark fs-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <i className="bi bi-list"></i>
        </button>

        {/* App Title */}
        <h5 className="m-0 fw-bold text-primary text-center flex-grow-1">
          Human Resource Management System
        </h5>

        {/* Logged-in User */}
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-person-circle fs-4 text-secondary"></i>
          <span className="fw-semibold text-dark">
            {userName ? `Welcome, ${userName}` : "Welcome"}
          </span>
        </div>
      </div>

      {/* 🔹 Sidebar */}
      <aside
        className={`sidebar bg-dark text-white ${isSidebarOpen ? "open" : ""}`}
      >
        <div className="sidebar-header text-center py-3 border-bottom border-secondary">
          <h5 className="fw-bold">H R M S</h5>
        </div>

        <div className="sidebar-content">
          <ul className="nav flex-column px-3">
            <li className="nav-item mt-3">
              <Link to="/dashboard" className="nav-link text-white">
                <i className="bi bi-speedometer2 me-2"></i> Dashboard
              </Link>
            </li>

            {/* 🔹 Employees Dropdown */}
            <li className="nav-item mt-2">
              <div
                className="nav-link text-white d-flex justify-content-between align-items-center"
                onClick={() => setOpen(!open)}
                style={{ cursor: "pointer" }}
              >
                <span>
                  <i className="bi bi-people me-2"></i> Employees
                </span>
                <i
                  className={`bi ${
                    open ? "bi-caret-up-fill" : "bi-caret-down-fill"
                  }`}
                ></i>
              </div>

              {open && (
                <ul className="list-unstyled ms-4 mt-1">
                  <li>
                    <Link
                      to="/dashboard/add-employee"
                      className="text-white text-decoration-none d-block mb-2"
                    >
                      <i className="bi bi-person-fill-add me-2"></i> Add Employee
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/all-employees"
                      className="text-white text-decoration-none d-block"
                    >
                      <i className="bi bi-people me-2"></i> All Employees
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* 🔹 Payroll Dropdown */}
            <li className="nav-item mt-2">
              <div
                className="nav-link text-white d-flex justify-content-between align-items-center"
                onClick={() => setPayrollOpen(!payrollOpen)}
                style={{ cursor: "pointer" }}
              >
                <span>
                  <i className="bi bi-cash me-2"></i> Payroll
                </span>
                <i
                  className={`bi ${
                    payrollOpen ? "bi-caret-up-fill" : "bi-caret-down-fill"
                  }`}
                ></i>
              </div>

              {payrollOpen && (
                <ul className="list-unstyled ms-4 mt-1">
                  <li>
                    <Link
                      to="/dashboard/add-salary"
                      className="text-white text-decoration-none d-block mb-2"
                    >
                      <i className="bi bi-plus-circle me-2"></i> Add Salary
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/salary-list"
                      className="text-white text-decoration-none d-block mb-2"
                    >
                      <i className="bi bi-file-text me-2"></i> Salary List
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/generate-payslip"
                      className="text-white text-decoration-none d-block"
                    >
                      <i className="bi bi-clipboard-data me-2"></i> Generate Payslip
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* 🔹 Profile & Logout */}
            <li className="nav-item mt-2">
              <Link to="/dashboard/profile" className="nav-link text-white">
                <i className="bi bi-person me-2"></i> Profile
              </Link>
            </li>
            <li className="nav-item mt-2">
              <Link className="nav-link text-white">
                <i className="bi bi-power me-2"></i> Logout
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* 🔹 Main Content */}
      <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="content-scroll">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

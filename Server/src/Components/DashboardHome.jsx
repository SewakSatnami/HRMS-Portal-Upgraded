import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const DashboardHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Add Employee",
      icon: "bi-person-fill-add",
      color: "primary",
      path: "/dashboard/add-employee",
      desc: "Register a new employee",
    },
    {
      title: "All Employees",
      icon: "bi-people-fill",
      color: "success",
      path: "/dashboard/all-employees",
      desc: "View & manage employees",
    },
    {
      title: "Add Salary",
      icon: "bi-cash-stack",
      color: "warning",
      path: "/dashboard/add-salary",
      desc: "Assign or update salary",
    },
    {
      title: "Salary List",
      icon: "bi-card-checklist",
      color: "info",
      path: "/dashboard/salary-list",
      desc: "View all salary records",
    },
    {
      title: "Generate Payslip",
      icon: "bi-clipboard-data",
      color: "danger",
      path: "/dashboard/generate-payslip",
      desc: "Create & download payslips",
    },
    {
      title: "Profile",
      icon: "bi-person-circle",
      color: "secondary",
      path: "/dashboard/profile",
      desc: "View & edit HR profile",
    },
  ];

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-start py-5"
      style={{
        background: "linear-gradient(135deg, #007bff, #00bcd4)",
        color: "#fff",
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6">👩‍💼 HR Management Dashboard</h2>
        <p className="text-light mt-2">
          Manage employees, salaries, and reports efficiently
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="container">
        <div className="row g-4 justify-content-center">
          {cards.map((card, index) => (
            <div
              key={index}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              onClick={() => navigate(card.path)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="card border-0 shadow-lg text-center h-100 position-relative"
                style={{
                  borderRadius: "20px",
                  transition: "all 0.3s ease",
                  backgroundColor: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 25px rgba(0, 0, 0, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 15px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div
                  className={`card-header bg-${card.color} text-white border-0 py-3 fw-bold`}
                  style={{
                    fontSize: "1rem",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                  }}
                >
                  {card.title}
                </div>
                <div className="card-body py-4">
                  <i
                    className={`bi ${card.icon}`}
                    style={{ fontSize: "3rem", color: `var(--bs-${card.color})` }}
                  ></i>
                  <p className="mt-3 text-secondary small">{card.desc}</p>
                </div>
                <div
                  className="card-footer bg-light border-0 text-muted small py-2"
                  style={{
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                  }}
                >
                  Click to open →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-5 text-center text-light small">
        <hr className="border-light opacity-25" />
        <p>
          © 2025 <strong>HRMS Solutions Pvt. Ltd.</strong> | Empowering Workplaces
        </p>
      </footer>
    </div>
  );
};

export default DashboardHome;

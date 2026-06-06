import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <div className="p-4">

      {/* Page Title */}
      <div className="mb-4">
        <h3 className="fw-bold">Home</h3>
        <p className="text-muted">
          Welcome to your HRMS system. Manage everything from one place.
        </p>
      </div>

      {/* Info Cards */}
      <div className="row g-4">

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <h5>Employees</h5>
            <p className="text-muted">
              Add, update and manage employee records easily.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <h5>Attendance</h5>
            <p className="text-muted">
              Track employee attendance and working hours.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <h5>Payroll</h5>
            <p className="text-muted">
              Manage salaries, payslips, and payroll processing.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;
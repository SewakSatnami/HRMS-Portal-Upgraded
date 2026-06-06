import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { employeeAPI } from "../../services/api";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    attendance: null,
    leaves: null,
    salary: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all dashboard data in parallel
      const [profileRes, attendanceRes, leavesRes, salaryRes] = await Promise.allSettled([
        employeeAPI.getProfile(),
        employeeAPI.getMyAttendance({ limit: 30 }), // Last 30 days
        employeeAPI.getMyLeaves(),
        employeeAPI.getMySalary()
      ]);

      const newData = {};

      // Handle profile data
      if (profileRes.status === 'fulfilled') {
        newData.profile = profileRes.value.employee;
      }

      // Handle attendance data
      if (attendanceRes.status === 'fulfilled') {
        const attendanceRecords = attendanceRes.value.attendance || [];
        const presentDays = attendanceRecords.filter(record => record.status === 'present').length;
        newData.attendance = {
          totalDays: attendanceRecords.length,
          presentDays,
          absentDays: attendanceRecords.filter(record => record.status === 'absent').length
        };
      }

      // Handle leaves data
      if (leavesRes.status === 'fulfilled') {
        const leaves = leavesRes.value.leaves || [];
        newData.leaves = {
          total: leaves.length,
          approved: leaves.filter(leave => leave.status === 'approved').length,
          pending: leaves.filter(leave => leave.status === 'pending').length
        };
      }

      // Handle salary data
      if (salaryRes.status === 'fulfilled') {
        newData.salary = salaryRes.value.salary;
      }

      setDashboardData(newData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getAttendancePercentage = () => {
    if (!dashboardData.attendance || dashboardData.attendance.totalDays === 0) return 0;
    return Math.round((dashboardData.attendance.presentDays / dashboardData.attendance.totalDays) * 100);
  };

  if (loading) {
    return (
      <div className="container-fluid p-4 dashboard-page">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 dashboard-page">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <p className="text-muted">
          Welcome back, {dashboardData.profile?.userId?.name || "Employee"} 👋
        </p>
      </div>

      {/* Cards */}
      <div className="row g-4">

        {[
          {
            title: "Attendance",
            value: dashboardData.attendance ? `${dashboardData.attendance.presentDays} Days` : "0 Days",
            icon: "bi-calendar-check",
            color: "success",
            note: dashboardData.attendance ? `${getAttendancePercentage()}% this month` : "No data"
          },
          {
            title: "Leaves",
            value: dashboardData.leaves ? dashboardData.leaves.total.toString() : "0",
            icon: "bi-file-earmark-text",
            color: "warning",
            note: dashboardData.leaves ? `${dashboardData.leaves.pending} pending` : "No data"
          },
          {
            title: "Salary",
            value: dashboardData.salary ? `₹${dashboardData.salary.baseSalary || 0}` : "₹0",
            icon: "bi-currency-rupee",
            color: "primary",
            note: "This month"
          },
          {
            title: "Profile",
            value: dashboardData.profile?.designation || "Employee",
            icon: "bi-person-circle",
            color: "dark",
            note: "Active"
          }
        ].map((item, index) => (
          <div className="col-lg-3 col-md-6" key={index}>
            <div className="card dashboard-card p-3">

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-muted">{item.title}</h6>
                <div className={`icon-box bg-${item.color}`}>
                  <i className={`bi ${item.icon}`}></i>
                </div>
              </div>

              <h3 className="fw-bold">{item.value}</h3>
              <p className={`small text-${item.color}`}>
                {item.note}
              </p>

            </div>
          </div>
        ))}

      </div>

      {/* Activity */}
      <div className="mt-5">
        <h5 className="fw-bold mb-3">Recent Activity</h5>

        <div className="card activity-card p-3">

          {dashboardData.attendance && dashboardData.attendance.totalDays > 0 && (
            <div className="activity-item">
              <i className="bi bi-check-circle-fill text-success"></i>
              <span>Attendance: {dashboardData.attendance.presentDays} present days this month</span>
            </div>
          )}

          {dashboardData.leaves && dashboardData.leaves.total > 0 && (
            <div className="activity-item">
              <i className="bi bi-clock-fill text-warning"></i>
              <span>{dashboardData.leaves.total} leave requests ({dashboardData.leaves.approved} approved)</span>
            </div>
          )}

          {dashboardData.salary && (
            <div className="activity-item">
              <i className="bi bi-cash-stack text-primary"></i>
              <span>Current salary: ₹{dashboardData.salary.baseSalary || 0}</span>
            </div>
          )}

          {(!dashboardData.attendance || dashboardData.attendance.totalDays === 0) &&
           (!dashboardData.leaves || dashboardData.leaves.total === 0) &&
           !dashboardData.salary && (
            <div className="activity-item">
              <i className="bi bi-info-circle-fill text-muted"></i>
              <span>No recent activity</span>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default EmployeeDashboard;
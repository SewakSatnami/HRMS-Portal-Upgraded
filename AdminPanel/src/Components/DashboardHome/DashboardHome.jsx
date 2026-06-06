import React, { useEffect, useState } from "react";
import "./DashboardHome.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { adminAPI } from "../../services/api";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const DashboardHome = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await adminAPI.getDashboardAnalytics();
        setAnalytics(data);
      } catch (error) {
        const status = error.response?.status;
        const apiMessage = error.response?.data?.message;
        setMessage(
          status
            ? `Dashboard API failed (${status}): ${apiMessage || "Please login again or check your role."}`
            : "Dashboard API failed: backend server is not reachable."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const stats = analytics?.stats || {};
  const attendanceTrend = analytics?.attendanceTrend || [];
  const topAbsentEmployees = analytics?.topAbsentEmployees || [];
  const topExpenseDepartments = analytics?.topExpenseDepartments || [];
  const insights = analytics?.insights || [];
  const leaveForecast = analytics?.leaveForecast || {};

  const maxTrendCount = Math.max(
    1,
    ...attendanceTrend.flatMap((item) => [item.present, item.absent, item.leave])
  );

  const renderTrendBar = (count, color) => ({
    height: `${Math.min((count / maxTrendCount) * 100, 100)}%`,
    backgroundColor: color
  });

  return (
    <div className="dashboard-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Dashboard</h3>
          <p className="text-muted mb-0">
            Welcome back, {user.name || "Admin"}. Here's what's happening today.
          </p>
        </div>
      </div>

      {message && <div className="alert alert-danger">{message}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="stat-card">
                <div className="icon bg-primary">
                  <i className="bi bi-people"></i>
                </div>
                <h6>Total Employees</h6>
                <h4>{stats.totalEmployees || 0}</h4>
                <span className="text-success">+{stats.newEmployeesThisMonth || 0} this month</span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="stat-card">
                <div className="icon bg-success">
                  <i className="bi bi-building"></i>
                </div>
                <h6>Departments</h6>
                <h4>{stats.departments || 0}</h4>
                <span className="text-muted">Active departments</span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="stat-card">
                <div className="icon bg-warning">
                  <i className="bi bi-calendar-week"></i>
                </div>
                <h6>Attendance Rate</h6>
                <h4>{stats.weeklyAttendanceRate || 0}%</h4>
                <span className={stats.weeklyAttendanceRate < 70 ? "text-danger" : "text-success"}>
                  {stats.presentToday || 0} present today
                </span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="stat-card">
                <div className="icon bg-info">
                  <i className="bi bi-cash-stack"></i>
                </div>
                <h6>Monthly Payroll</h6>
                <h4>{formatCurrency(stats.monthlySalaryLiability)}</h4>
                <span className="text-success">{stats.onLeaveToday || 0} on leave now</span>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-7">
              <div className="trend-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-1">Weekly Attendance Trend</h6>
                    <small className="text-muted">Present, absent and leave counts over the last 7 days</small>
                  </div>
                  <span className="badge bg-secondary">Live trend</span>
                </div>

                <div className="trend-chart">
                  {attendanceTrend.map((item) => (
                    <div className="trend-bar-item" key={item.date}>
                      <div className="sparkline-group">
                        <div className="sparkline-bar present" style={renderTrendBar(item.present, "#4caf50")} title={`Present ${item.present}`} />
                        <div className="sparkline-bar absent" style={renderTrendBar(item.absent, "#f44336")} title={`Absent ${item.absent}`} />
                        <div className="sparkline-bar leave" style={renderTrendBar(item.leave, "#ffb300")} title={`Leave ${item.leave}`} />
                      </div>
                      <span className="trend-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="insight-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-1">Insight Board</h6>
                    <small className="text-muted">Actionable HR signals generated automatically</small>
                  </div>
                  <span className={`badge ${leaveForecast.risk === "High" ? "bg-danger" : "bg-success"}`}>
                    {leaveForecast.risk || "Normal"} risk
                  </span>
                </div>

                <div className="mini-stats-grid">
                  <div className="mini-stat">
                    <small className="text-muted">Upcoming approved leaves</small>
                    <strong>{leaveForecast.upcomingApprovedLeaves || 0}</strong>
                  </div>
                  <div className="mini-stat">
                    <small className="text-muted">Pending leave requests</small>
                    <strong>{leaveForecast.upcomingPendingLeaves || 0}</strong>
                  </div>
                  <div className="mini-stat">
                    <small className="text-muted">Projected load</small>
                    <strong>{leaveForecast.projectedLoad || 0}</strong>
                  </div>
                </div>

                <div className="insight-list mt-3">
                  {insights.length ? (
                    insights.map((note, index) => (
                      <div className="insight-item" key={index}>
                        <i className="bi bi-lightbulb"></i>
                        <span>{note}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted mb-0">No alerts. Everything is running smoothly.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <div className="table-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6>Top Absentee Employees</h6>
                  <small className="text-muted">Last 30 days</small>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Absences</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAbsentEmployees.length ? (
                      topAbsentEmployees.map((employee) => (
                        <tr key={employee.employeeId || employee._id}>
                          <td>{employee.name || employee.employeeId}</td>
                          <td>{employee.department || "—"}</td>
                          <td>{employee.absenceCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="text-muted">No absence insights yet</td>
                        <td />
                        <td />
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="table-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6>Top Payroll Departments</h6>
                  <small className="text-muted">Active salary cost</small>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Employees</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topExpenseDepartments.length ? (
                      topExpenseDepartments.map((dept) => (
                        <tr key={dept._id || dept.department}>
                          <td>{dept._id || "—"}</td>
                          <td>{dept.employees || 0}</td>
                          <td>{formatCurrency(dept.totalSalary)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="text-muted">No payroll breakdown available</td>
                        <td />
                        <td />
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="table-card">
                <div className="d-flex justify-content-between mb-3">
                  <h6>Recent Employees</h6>
                </div>

                <table className="table">
                  <tbody>
                    {(analytics?.recentEmployees || []).map((employee) => (
                      <tr key={employee._id}>
                        <td>{employee.userId?.name || employee.employeeId}</td>
                        <td>{employee.department}</td>
                        <td>{employee.designation}</td>
                      </tr>
                    ))}
                    {analytics?.recentEmployees?.length === 0 && (
                      <tr>
                        <td className="text-muted">No employees yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-6">
              <div className="table-card">
                <div className="d-flex justify-content-between mb-3">
                  <h6>Leave Requests</h6>
                </div>

                <table className="table">
                  <tbody>
                    {(analytics?.recentLeaveRequests || []).map((leave) => (
                      <tr key={leave._id}>
                        <td>{leave.employeeId?.userId?.name || leave.employeeId?.employeeId}</td>
                        <td>{leave.type}</td>
                        <td>
                          <span className={`badge ${
                            leave.status === "approved"
                              ? "bg-success"
                              : leave.status === "rejected"
                                ? "bg-danger"
                                : "bg-warning"
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {analytics?.recentLeaveRequests?.length === 0 && (
                      <tr>
                        <td className="text-muted">No leave requests yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;

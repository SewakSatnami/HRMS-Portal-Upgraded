import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Dashboard.css";
import { adminAPI } from "../../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [userName, setUserName] = useState("User");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.name || "User");
    }
  }, []);

  const buildNotifications = (analyticsData) => {
    if (!analyticsData) return [];

    const items = [];
    const { stats = {}, recentLeaveRequests = [], recentEmployees = [], insights = [] } = analyticsData;

    if (stats.pendingLeaves > 0) {
      items.push({
        id: "pending-leaves",
        title: "Pending leave approvals",
        message: `You have ${stats.pendingLeaves} pending leave request${stats.pendingLeaves > 1 ? "s" : ""}.`,
        link: "/dashboard/leaverequest",
        read: false
      });
    }

    recentLeaveRequests.slice(0, 2).forEach((leave) => {
      const name = leave.employeeId?.userId?.name || leave.employeeId?.employeeId || "Employee";
      const startDate = leave.startDate ? new Date(leave.startDate).toLocaleDateString() : "soon";
      items.push({
        id: `leave-${leave._id}`,
        title: "Leave request",
        message: `${name} requested leave starting ${startDate}.`,
        link: "/dashboard/leaverequest",
        read: false
      });
    });

    recentEmployees.slice(0, 2).forEach((employee) => {
      const name = employee.userId?.name || employee.employeeId || "New hire";
      const department = employee.department ? ` in ${employee.department}` : "";
      items.push({
        id: `employee-${employee._id}`,
        title: "New employee",
        message: `${name} joined${department}.`,
        link: "/dashboard/all-employees",
        read: false
      });
    });

    insights.slice(0, 2).forEach((insight, index) => {
      items.push({
        id: `insight-${index}`,
        title: "Dashboard insight",
        message: insight,
        link: "/dashboard",
        read: false
      });
    });

    return items.slice(0, 5);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
  };

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const analytics = await adminAPI.getDashboardAnalytics();
      const newItems = buildNotifications(analytics);
      setNotifications((previous) =>
        newItems.map((item) => {
          const existing = previous.find((prev) => prev.id === item.id);
          return existing ? { ...item, read: existing.read } : item;
        })
      );
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter((item) => !item.read).length);
  }, [notifications]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/admin-login";
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setActiveMenu(null);
  };

  return (
    <div className="dashboard-layout">

      {/* 🔷 NAVBAR */}
      <div className="custom-navbar px-4">

        {/* Left */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className="bi bi-list fs-4"></i>
          </button>

          <h5 className="m-0 fw-bold text-primary d-flex align-items-center gap-2">
            <i className="bi bi-people-fill"></i> HRMS
          </h5>
        </div>

        {/* Center */}
        <div className="d-none d-md-block fw-semibold text-muted">
          Human Resource Management System
        </div>

        {/* Right */}
        <div className="d-flex align-items-center gap-3">

          {/* Search */}
          <div className="search-box d-none d-md-block">
            <input type="text" placeholder="Search..." />
            <i className="bi bi-search"></i>
          </div>

          {/* Notification */}
          <div className="position-relative notification-menu">
            <button
              className="notification-button btn btn-link p-0 text-dark"
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                if (!showNotifications) {
                  markNotificationsRead();
                }
              }}
            >
              <i className="bi bi-bell fs-5"></i>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown shadow-sm">
                <div className="notification-header d-flex justify-content-between align-items-center">
                  <strong>Notifications</strong>
                  <button
                    className="btn btn-sm btn-light"
                    type="button"
                    onClick={() => setShowNotifications(false)}
                  >
                    Close
                  </button>
                </div>
                {loadingNotifications ? (
                  <div className="notification-empty">Loading updates...</div>
                ) : notifications.length === 0 ? (
                  <div className="notification-empty">No new notifications</div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`notification-item ${item.read ? "read" : "unread"}`}
                      onClick={() => {
                        setShowNotifications(false);
                        if (item.link) navigate(item.link);
                      }}
                    >
                      <div className="notification-title">{item.title}</div>
                      <div className="notification-message">{item.message}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="position-relative profile-menu">
            <button
              className="profile-box d-flex align-items-center btn btn-link p-0"
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <i className="bi bi-person-circle fs-4 text-primary"></i>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown shadow-sm">
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    navigate("/dashboard/profile");
                    setShowProfileMenu(false);
                  }}
                >
                  Profile
                </button>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    navigate("/dashboard/profile");
                    setShowProfileMenu(false);
                  }}
                >
                  Settings
                </button>
                <hr />
                <button
                  className="dropdown-item text-danger"
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setShowProfileMenu(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 🔥 SIDEBAR OVERLAY */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      >

        {/* 🔥 SIDEBAR */}
        <aside
          className={`sidebar ${isSidebarOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >

          <div className="sidebar-header text-center py-3">
            <h5>HRMS</h5>
          </div>

          <ul className="nav flex-column px-3 sidebar-menu">

            {/* Dashboard */}
            <li className="nav-item mt-3">
              <NavLink
                to="/dashboard"
                className="nav-link"
                onClick={closeSidebar}
              >
                <i className="bi bi-speedometer2 me-2"></i> Dashboard
              </NavLink>
            </li>

            {/* Employees */}
            <li className="nav-item mt-2">
              <div
                className="nav-link d-flex justify-content-between align-items-center"
                onClick={() =>
                  setActiveMenu(activeMenu === "employees" ? null : "employees")
                }
              >
                <span><i className="bi bi-people me-2"></i> Employees</span>
                <i className={`bi bi-caret-down-fill menu-arrow ${activeMenu === "employees" ? "rotate" : ""}`}></i>
              </div>

              <ul className={`dropdown-menu-animated ${activeMenu === "employees" ? "open" : ""}`}>
                <li>
                  <NavLink to="/dashboard/add-employee" className="dropdown-link" onClick={closeSidebar}>Add Employee</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/all-employees" className="dropdown-link" onClick={closeSidebar}>All Employees</NavLink>
                </li>
              </ul>
            </li>

            {/* Departments */}
            <li className="nav-item mt-2">
              <div
                className="nav-link d-flex justify-content-between align-items-center"
                onClick={() =>
                  setActiveMenu(activeMenu === "departments" ? null : "departments")
                }
              >
                <span><i className="bi bi-building me-2"></i> Departments</span>
                <i className={`bi bi-caret-down-fill menu-arrow ${activeMenu === "departments" ? "rotate" : ""}`}></i>
              </div>

              <ul className={`dropdown-menu-animated ${activeMenu === "departments" ? "open" : ""}`}>
                <li>
                  <NavLink to="/dashboard/adddepartment" className="dropdown-link" onClick={closeSidebar}>Add Department</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/departmentlist" className="dropdown-link" onClick={closeSidebar}>Department List</NavLink>
                </li>
              </ul>
            </li>

            {/* Attendance */}
            <li className="nav-item mt-2">
              <div
                className="nav-link d-flex justify-content-between align-items-center"
                onClick={() =>
                  setActiveMenu(activeMenu === "attendance" ? null : "attendance")
                }
              >
                <span><i className="bi bi-calendar-check me-2"></i> Attendance</span>
                <i className={`bi bi-caret-down-fill menu-arrow ${activeMenu === "attendance" ? "rotate" : ""}`}></i>
              </div>

              <ul className={`dropdown-menu-animated ${activeMenu === "attendance" ? "open" : ""}`}>
                <li>
                  <NavLink to="/dashboard/markattendance" className="dropdown-link" onClick={closeSidebar}>Mark Attendance</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/attendancerecords" className="dropdown-link" onClick={closeSidebar}>Attendance Records</NavLink>
                </li>
              </ul>
            </li>

            {/* Leave */}
            <li className="nav-item mt-2">
              <div
                className="nav-link d-flex justify-content-between align-items-center"
                onClick={() =>
                  setActiveMenu(activeMenu === "leave" ? null : "leave")
                }
              >
                <span><i className="bi bi-calendar-check me-2"></i> Manage Leave</span>
                <i className={`bi bi-caret-down-fill menu-arrow ${activeMenu === "leave" ? "rotate" : ""}`}></i>
              </div>

              <ul className={`dropdown-menu-animated ${activeMenu === "leave" ? "open" : ""}`}>
                <li>
                  <NavLink to="/dashboard/applyleave" className="dropdown-link" onClick={closeSidebar}>Apply Leave</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/leaverequest" className="dropdown-link" onClick={closeSidebar}>Leave Requests</NavLink>
                </li>
              </ul>
            </li>

            {/* Payroll */}
            <li className="nav-item mt-2">
              <div
                className="nav-link d-flex justify-content-between align-items-center"
                onClick={() =>
                  setActiveMenu(activeMenu === "payroll" ? null : "payroll")
                }
              >
                <span><i className="bi bi-cash me-2"></i> Payroll</span>
                <i className={`bi bi-caret-down-fill menu-arrow ${activeMenu === "payroll" ? "rotate" : ""}`}></i>
              </div>

              <ul className={`dropdown-menu-animated ${activeMenu === "payroll" ? "open" : ""}`}>
                <li>
                  <NavLink to="/dashboard/add-salary" className="dropdown-link" onClick={closeSidebar}>Add Salary</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/salary-list" className="dropdown-link" onClick={closeSidebar}>Salary List</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/generate-payslip" className="dropdown-link" onClick={closeSidebar}>Generate Payslip</NavLink>
                </li>
              </ul>
            </li>

          </ul>

          {/* Bottom */}
          <div className="sidebar-bottom px-3 mb-3">

            <NavLink to="/dashboard/profile" className="nav-link d-flex align-items-center gap-2" onClick={closeSidebar}>
              <i className="bi bi-person"></i>
              Profile
            </NavLink>

            <div
              onClick={handleLogout}
              className="nav-link logout-item d-flex align-items-center gap-2"
            >
              <i className="bi bi-box-arrow-right"></i>
              Logout
            </div>

          </div>

        </aside>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="content-scroll">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default Dashboard;

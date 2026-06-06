import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./EmployeeSidebar.css";

const EmployeeSidebar = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/employee-login";
    };

    const menu = [
        { name: "Dashboard", icon: "bi-speedometer2", path: "/employee/dashboard" },
        { name: "My Profile", icon: "bi-person", path: "/employee/profile" },
        { name: "Attendance", icon: "bi-calendar-check", path: "/employee/attendance" },
        { name: "Leave", icon: "bi-file-earmark-text", path: "/employee/leave" },
        { name: "Salary", icon: "bi-currency-rupee", path: "/employee/salary" },
    ];

    return (
        <div className="app-layout">

            {/* 🔥 Mobile Topbar */}
            <div className="mobile-topbar d-md-none">
                <i className="bi bi-list" onClick={() => setOpen(true)}></i>
                <h6 className="mb-0">Employee Panel</h6>
            </div>

            {/* 🔥 Overlay */}
            {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

            {/* 🔥 Sidebar (RENAMED CLASS) */}
            <div className={`employee-sidebar ${open ? "show" : ""}`}>

                {/* Header */}
                <div className="sidebar-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Employee Panel</h5>
                    <i
                        className="bi bi-x-lg d-md-none"
                        onClick={() => setOpen(false)}
                    ></i>
                </div>

                {/* Menu */}
                <ul className="nav flex-column mt-4">
                    {menu.map((item, index) => (
                        <li key={index} className="nav-item mb-2">
                            <Link
                                to={item.path}
                                className={`nav-link d-flex align-items-center gap-2 ${location.pathname === item.path ? "active-link" : ""
                                    }`}
                                onClick={() => setOpen(false)}
                            >
                                <i className={`bi ${item.icon}`}></i>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Footer */}
                <div className="sidebar-footer mt-auto">

                    {/* Avatar only */}
                    <div
                        className="avatar clickable"
                        onClick={() => window.location.href = "/employee/profile"}
                    >
                        <i className="bi bi-person"></i>
                    </div>

                    {/* Logout small */}
                    <button className="logout-btn mt-3" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i>
                    </button>

                </div>

            </div>

            {/* 🔥 Content */}
            <div className="content-area">
                <Outlet />
            </div>

        </div>
    );
};

export default EmployeeSidebar;

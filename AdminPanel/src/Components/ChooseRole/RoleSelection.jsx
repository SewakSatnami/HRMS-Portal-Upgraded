import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelection.css";

// ✅ IMPORT IMAGE FROM src/assets
import bgImage from "../../assets/image/Role-bg.png";

const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <div
            className="role-wrapper"
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            {/* Top Left Logo */}
            <div className="top-logo">
                <h4>HRMS</h4>
                <p>Human Resource Management System</p>
            </div>

            {/* Main Content */}
            <div className="role-container">

                {/* Top Icon */}
                <div className="top-icon">👤</div>

                {/* Heading */}
                <h1 className="main-title">
                    Welcome to <span>HRMS</span>
                </h1>

                <p className="subtitle">
                    Human Resource Management System
                </p>

                <div className="divider-text">
                    Please choose your login type to continue
                </div>

                {/* Cards Section */}
                <div className="cards-container">

                    {/* Admin Card */}
                    <div className="role-card blue">
                        <div className="card-icon">👤</div>
                        <h3>Admin Login</h3>
                        <p>
                            Login to access the admin panel and manage the system
                        </p>
                        <button onClick={() => navigate("/admin-login")}>
                            Continue →
                        </button>
                    </div>

                    {/* OR Divider */}
                    <div className="or-divider">OR</div>

                    {/* Employee Card */}
                    <div className="role-card purple">
                        <div className="card-icon">👤</div>
                        <h3>Employee Login</h3>
                        <p>
                            Login to access your dashboard and manage your tasks
                        </p>
                        <button onClick={() => navigate("/employee-login")}>
                            Continue →
                        </button>
                    </div>

                </div>

                {/* Bottom Features */}
                <div className="features">

                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="bi bi-shield-lock"></i>
                        </div>
                        <div>
                            <h6>Secure Access</h6>
                            <p>Role-based secure authentication</p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="bi bi-bar-chart"></i>
                        </div>
                        <div>
                            <h6>Smart Dashboard</h6>
                            <p>Insights and analytics at your fingertips</p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="bi bi-gear"></i>
                        </div>
                        <div>
                            <h6>Efficient Management</h6>
                            <p>Streamline HR processes and boost productivity</p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="bi bi-lock"></i>
                        </div>
                        <div>
                            <h6>Data Protection</h6>
                            <p>Your data is safe with enterprise-grade security</p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <p className="footer">
                    HRMS © 2026 | All rights reserved
                </p>

            </div>
        </div>
    );
};

export default RoleSelection;
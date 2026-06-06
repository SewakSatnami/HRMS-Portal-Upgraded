import React, { useEffect, useState } from "react";
import "./AttendanceRecords.css";
import { adminAPI } from "../../services/api";

const AttendanceRecords = () => {
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeeId, setEmployeeId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await adminAPI.getAllEmployees({ limit: 100 });
                setEmployees(data.employees || []);
                if (data.employees?.[0]?._id) {
                    setEmployeeId(data.employees[0]._id);
                }
            } catch (error) {
                const serverMessage = error.response?.data?.message || error.response?.data || error.message;
                setMessage(serverMessage || "Failed to load employees");
            }
        };

        loadEmployees();
    }, []);

    useEffect(() => {
        if (!employeeId) return;

        const loadAttendance = async () => {
            try {
                setLoading(true);
                setMessage("");
                const data = await adminAPI.getEmployeeAttendance(employeeId, { limit: 50 });
                setAttendance(data.attendance || []);
            } catch (error) {
                const serverMessage = error.response?.data?.message || error.response?.data || error.message;
                setMessage(serverMessage || "Failed to load attendance");
            } finally {
                setLoading(false);
            }
        };

        loadAttendance();
    }, [employeeId]);

    return (
        <div className="container mt-5 pt-4 pt-md-2 fade-in">
            <div className="card custom-card p-3 p-md-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
                    <h4 className="gradient-text m-0">
                        <i className="bi bi-calendar-check me-2"></i>
                        Attendance Records
                    </h4>

                    <span className="badge bg-primary px-3 py-2 align-self-start align-self-md-auto">
                        {attendance.length} Records
                    </span>
                </div>

                <div className="row mb-4 gy-2 align-items-center">
                    <div className="col-12 col-md-5">
                        <label className="form-label fw-semibold">Employee</label>
                        <select
                            className="form-select custom-select"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                        >
                            {employees.map((employee) => (
                                <option key={employee._id} value={employee._id}>
                                    {employee.userId?.name || employee.employeeId}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {message && <div className="alert alert-danger">{message}</div>}

                <div className="table-responsive">
                    <table className="table custom-table text-center align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Hours</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-muted py-4">
                                        Loading attendance...
                                    </td>
                                </tr>
                            ) : attendance.length > 0 ? (
                                attendance.map((item, index) => (
                                    <tr key={item._id} className="table-row">
                                        <td>{index + 1}</td>
                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge status ${item.status}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{item.hoursWorked || 0}</td>
                                        <td>{item.remarks || "-"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-muted py-4">
                                        No Records Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceRecords;
